import { logger } from '../../../shared/logger'
import { getValue } from '../../../shared/dao'
import constants, { ApiSequence } from '../../../constants'
import { validateSchema, isObjectEmpty, checkContext } from '../..'
import { catalogRejectionErrors, ErrorDetail } from '../../../constants/catalogRejection'
import _ from 'lodash'
import { timeDiff } from '../../' 


interface CatalogError {
  code: string
  type: string
  path: string
  message: string
}

export const checkCatalogRejection = (data: any) => {
  try {
    const errorObj: any = {}
    if (!data || isObjectEmpty(data)) {
      errorObj[ApiSequence.CATALOG_REJECTION] = 'JSON cannot be empty'
      return
    }
    const flow = getValue('flow')
    const { errors, context, message } = data
    if (!context) {
      return { missingFields: '/context is missing' }
    }

    if ((!errors || Object.entries(errors).length == 0) && !data.message) {
      return { missingFields: '/errors or /message must be present' }
    }

    if (!_.isEqual(data.context.domain.split(':')[1], getValue(`domain`))) {
      errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }
    const schemaValidation = validateSchema(context.domain.split(':')[1], constants.CATALOG_REJECTION, data)
    const contextRes: any = checkContext(context, constants.CATALOG_REJECTION)

    //Timestamp check
    const timestampOnSearch = getValue(`${ApiSequence.ON_SEARCH}_tmpstmp`)
    const timeDifference = timeDiff(context.timestamp, timestampOnSearch)
    if (timeDifference <= 0) {
      const key = 'context/timestamp'
      errorObj[key] =
        `context/timestamp of /${ApiSequence.CATALOG_REJECTION} should be greater than /${ApiSequence.ON_SEARCH} context/timestamp`
    }

    if (Array.isArray(errors)) {
      errors.map((error: CatalogError, index: number) => {
        const errorCode = error?.code
        let catalogError: ErrorDetail | undefined
        for (const code in catalogRejectionErrors) {
          if (errorCode == code && catalogRejectionErrors.hasOwnProperty(code)) {
            catalogError = catalogRejectionErrors[code]
          }
        }
        if (error.message != catalogError?.message) {
          errorObj[`error.message${index}`] =
            `Catalog rejection error message doesn't match the provided error.message code: ${errorCode}`
        }

        if (error.type != catalogError?.type) {
          errorObj[`error.type${index}`] =
            `Catalog rejection error type doesn't match the provided error.type code: ${errorCode}`
        }
      })
    }

    if (schemaValidation !== 'error') {
      Object.assign(errorObj, schemaValidation)
    }

    if (!contextRes?.valid) {
      Object.assign(errorObj, contextRes.ERRORS)
    }
    if (_.isEqual(data.context, getValue(`domain`))) {
      errorObj[`Domain[${data.context.action}]`] = `Domain should be same in each action`
    }

    if (context.city !== '*' && flow == '9') {
      errorObj.contextCityError = 'context/city should be "*" while sending search_inc_catalog request'
    }
    console.log(message)
    if (flow == '8') {
      if (!message || message.catalog_status.state?.descriptor?.code !== 'PROCESSED') {
        errorObj.catalogStatusError = 'message.state.descriptor.code must be PROCESSED for successful execution'
      }
    }

    return Object.keys(errorObj).length > 0 && errorObj
  } catch (error: any) {
    logger.error(error.message)
    return { error: error.message }
  }
}
