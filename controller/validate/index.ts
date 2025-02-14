import { Response, Request } from 'express'
import _ from 'lodash'
import axios from 'axios'
import { validateActionSchema } from '../../shared/validateLogs'
import { logger } from '../../shared/logger'
import { DOMAIN, IHttpResponse } from '../../shared/types'
import { actionsArray } from '../../constants'
import helper from './helper'

import { verify, hash } from '../../shared/crypto'

function isGitHubUrl(url: string): boolean {
  try {
    const parsedUrl = new URL(url)
    return parsedUrl.hostname === 'github.com' || parsedUrl.hostname === 'raw.githubusercontent.com'
  } catch (e) {
    return false
  }
}

// Helper function to convert GitHub URL to raw content URL
function convertToRawUrl(githubUrl: string): string {
  const parsedUrl = new URL(githubUrl)
  if (parsedUrl.hostname === 'raw.githubusercontent.com') {
    return githubUrl
    
  }
 

  const pathParts = parsedUrl.pathname.split('/')
  if (pathParts[3] === 'blob' && pathParts.length >= 5) {
    const user = pathParts[1]
    const repo = pathParts[2]
    const branch = pathParts[4]
    const filePath = pathParts.slice(5).join('/')
    return `https://raw.githubusercontent.com/${user}/${repo}/${branch}/${filePath}+search`
  }

  throw new Error('Invalid GitHub URL format')
}
const controller = {
  validate: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      let { domain, version, payload, flow, bap_id, bpp_id } = req.body

      // Check if payload is a GitHub URL and fetch content
      if (typeof payload === 'object' && payload.search_full_catalog_refresh) {
        const search_full_catalog_refresh = payload.search_full_catalog_refresh
        if (isGitHubUrl(search_full_catalog_refresh)) {
          try {
            const rawUrl = convertToRawUrl(search_full_catalog_refresh)
            const response = await axios.get(rawUrl)

            let fetchedData
            if (typeof response.data === 'string') {
              try {
                fetchedData = JSON.parse(response.data)
              } catch (parseError) {
                return res.status(400).json({
                  success: false,
                  response: { message: 'Fetched payload is not valid JSON' }
                })
              }
            } else {
              fetchedData = response.data
            }

            // Replace the GitHub URL with the fetched data
            payload.search_full_catalog_refresh = fetchedData
          } catch (error: any) {
            logger.error(error)
            return res.status(400).json({
              success: false,
              response: { message: `Error fetching payload from GitHub: ${error.message}` }
            })
          }
        }
      }

      // Validate payload is an object
      if (typeof payload !== 'object' || payload === null) {
        return res.status(400).json({
          success: false,
          response: { message: 'Payload must be a JSON object or a valid GitHub URL' }
        })
      }

      let result: { response?: string; success?: boolean; message?: string } = {}
      const splitPath = req.originalUrl.split('/')
      const pathUrl = splitPath[splitPath.length - 1]

      const normalisedDomain = helper.getEnumForDomain(pathUrl)

      switch (normalisedDomain) {
        case DOMAIN.RETAIL:
          {
            const { response, success, message } = await helper.validateRetail(
              domain,
              payload,
              version,
              flow.toString(),
              bap_id,
              bpp_id,
            )
            result = { response, success, message }
          }
          break
        case DOMAIN.LOGISTICS:
          // to-do
          throw new Error('Domain not supported yet')
          break
        case DOMAIN.FINANCE:
          {
            const { response, success, message } = await helper.validateFinance(domain, payload, version, flow)
            result = { response, success, message }
          }
          break
        case DOMAIN.MOBILITY:
          {
            const { response, success, message } = await helper.validateMobility(domain, payload, version, flow)
            result = { response, success, message }
          }
          break
        case DOMAIN.IGM:
          {
            const { response, success, message } = await helper.validateIGM(payload, version)
            result = { response, success, message }
          }
          break
        case DOMAIN.RSF:
          {
            const { response, success, message } = await helper.validateRSF(payload, version)
            result = { response, success, message }
          }
          break
        default:
          throw new Error('Internal server error')
      }

      const { response, success, message } = result

      const httpResponse: IHttpResponse = {
        message,
        report: response,
        bpp_id,
        bap_id,
        domain,
        reportTimestamp: new Date().toISOString(),
      }

      const { signature, currentDate } = await helper.createSignature({ message: JSON.stringify(httpResponse) })

      if (!success)
        return res.status(400).send({ success, response: httpResponse, signature, signTimestamp: currentDate })

      return res.status(200).send({ success, response: httpResponse, signature, signTimestamp: currentDate })
    } catch (error: any) {
      logger.error(error)
      return res.status(500).send({ success: false, response: { message: error?.message || error } })
    }
  },

  validateToken: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const { success, response, signature, signTimestamp } = req.body

      if (!signature || !signTimestamp || !response || success === undefined)
        throw new Error('Payload needs to have signature, signTimestamp, success, and response')

      const publicKey = process.env.SIGN_PUBLIC_KEY as string

      const httpResponse: IHttpResponse = {
        message: response?.message,
        report: response?.report,
        bpp_id: response?.bpp_id,
        bap_id: response?.bap_id,
        domain: response?.domain,
        reportTimestamp: response?.reportTimestamp,
      }

      const hashString = await hash({ message: JSON.stringify(httpResponse) })

      const signingString = `${hashString}|${signTimestamp}`

      const isVerified = await verify({ signedMessage: signature, message: signingString, publicKey })
      const reportMessage = isVerified ? 'The report is validated' : 'The report is not validated'

      return res.status(200).send({ success: true, response: { message: reportMessage, verified: isVerified } })
    } catch (error: any) {
      logger.error(error)
      return res.status(500).send({ success: false, response: { message: error?.message || error } })
    }
  },

  validateSingleAction: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      let error
      if (!req.body) return res.status(400).send({ success: false, error: 'provide transaction logs to verify' })
      const { context, message } = req.body

      if (!context || !message) return res.status(400).send({ success: false, error: 'context, message are required' })

      if (!context.domain || !context.core_version || !context.action) {
        return res
          .status(400)
          .send({ success: false, error: 'context.domain, context.core_version, context.action is required' })
      }

      const { domain, core_version, action } = req.body.context
      if (!actionsArray.includes(action)) {
        return res.status(400).send({ success: false, error: 'context.action should be valid' })
      }

      const payload = req.body
      switch (core_version) {
        case '1.2.0':
        case '1.2.5':
          error = validateActionSchema(payload, domain, action)
          break
        default:
          logger.warn('Invalid core_version !! ')
          res.status(400).send({ success: false, error: 'Invalid core_version, Please Enter a valid core_version' })
          return
      }

      if (!_.isEmpty(error)) res.status(400).send({ success: false, error })
      else return res.status(200).send({ success: true, error })
    } catch (error) {
      logger.error(error)
      return res.status(500).send({ success: false, error: error })
    }
  },
  getValidationFormat: async (req: Request, res: Response): Promise<Response | void> => {
    try {
      const upperDomain = req.params.dom
      const { domain, version } = req.query
      if (!domain || !version) return res.status(400).send({ success: false, error: 'domain, version are required' })

      const domainEnum = helper.getEnumForDomain(upperDomain)

      switch (domainEnum) {
        case DOMAIN.FINANCE:
          const format = helper.getFinanceValidationFormat(domain as string, version as string)
          return res.status(200).send({ success: true, response: format })
        default:
          return res.status(400).send({ success: false, error: 'Domain not supported yet' })
      }
    } catch (error) {
      logger.error(error)
      return res.status(500).send({ success: false, error: error })
    }
  },
}

export default controller
