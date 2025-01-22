export const offersSchemavalidation = [
    {
        //'discount
        if: {
            properties: {
                descriptor: {
                    properties: {
                        code: { const: 'discount' },
                    },
                },
            },
        },
        then: {
            properties: {
                // Ensure that the 'discount' fields like 'mandatory', 'qualifier', and 'benefit' are validated

                type: 'object',
                properties: {
                    mandatory: { type: 'string' },
                    qualifier: {
                        type: 'object',
                        properties: {
                            min_value: { type: 'string' },
                    
                        },
                        required: ['min_value'],
                        additionalProperties: false,
                    },
                    benefit: {
                        type: 'object',
                        properties: {
                            value: { type: 'string' },
                            value_type: { type: 'string' },
                        },
                        required: ['value','value_type'],
                        additionalProperties: false,
                        errorMessage: `value and value_type are required for discount.`
                        },
                    },
                },
                required: ['qualifier', 'benefit'],
                additionalProperties: false,
                errorMessage: {
                    qualifier: `The 'qualifier' field is required and should include relevant properties.`,
                    benefit: `The 'benefit' field is required and must adhere to the expected schema.`

                },
            },
            required: ['discount'],
            additionalProperties: false,
            errorMessage: {
                required: {
                    discount: "The 'discount' object must be provided with all required fields.",
                },
            },
        },
    
    {//buyXgetY
        if: {
            properties: {
                descriptor: {
                    properties: {
                        code: { const: 'buyXgetY' },
                    },
                },
            },
        },
        then: {
            properties: {
                // Ensure that the 'buyXgetY' fields like 'mandatory', 'qualifier', and 'benefit' are validated
                buyXgetY: {
                    type: 'object',
                    properties: {
                        mandatory: { type: 'boolean' },
                        qualifier: {
                            type: 'object',
                            properties: {
                                min_value: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_count_upper: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                            },
                            required: ['item_count'],
                            additionalProperties: false,
                        },
                        benefit: {
                            type: 'object',
                            properties: {
                                value: { type: 'boolean' },
                                value_type: { type: 'boolean' },
                                value_cap: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                                item_value: { type: 'boolean' },
                            },
                            required: ['item_count'],
                            additionalProperties: false,
                        },
                    },
                    required: ['mandatory', 'qualifier', 'benefit'],
                    additionalProperties: false,
                    anyOf: [
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: { min_value: { const: true } },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['value', 'value_type'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: { item_count_upper: { const: true } },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['value_cap'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: { item_id: { const: true } },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['item_id'],
                                    },
                                },
                            },
                        },
                    ],
                }
            }
        },
        required: ['offers'],
        additionalProperties: false,
    },
    {//freebie    
        if: {
            properties: {
                descriptor: {
                    properties: {
                        code: { const: 'freebie' },
                    },
                },
            },
        },
        then: {
            properties: {
                // Ensure that the 'freebie' fields like 'mandatory', 'qualifier', and 'benefit' are validated
                freebie: {
                    type: 'object',
                    properties: {
                        mandatory: { type: 'boolean' },
                        qualifier: {
                            type: 'object',
                            properties: {
                                min_value: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_count_upper: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                            },
                            required: [],
                            additionalProperties: false,
                        },
                        benefit: {
                            type: 'object',
                            properties: {
                                value: { type: 'boolean' },
                                value_type: { type: 'boolean' },
                                value_cap: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                                item_value: { type: 'boolean' },
                            },
                            required: ['item_count', 'item_id'],
                            additionalProperties: false,
                        },
                    },
                    required: ['mandatory', 'qualifier', 'benefit'],
                    additionalProperties: false,
                    anyOf: [
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: { min_value: { const: true } },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['value', 'value_type'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: { item_count: { const: true } },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['item_count'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: { item_id: { const: true } },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['item_id'],
                                    },
                                },
                            },
                        },
                    ],
                },
            }
        },
        required: ['offers'],
        additionalProperties: false,
    },
    {//slab    
        if: {
            properties: {
                descriptor: {
                    properties: {
                        code: { const: 'slab' },
                    },
                },
            },
        },
        then: {
            properties: {
                // Ensure that the 'slab' fields like 'mandatory', 'qualifier', and 'benefit' are validated
                slab: {
                    type: 'object',
                    properties: {
                        mandatory: { type: 'boolean' },
                        qualifier: {
                            type: 'object',
                            properties: {
                                min_value: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_count_upper: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                            },
                            required: ['item_count', 'item_count_upper'],
                            additionalProperties: false,
                        },
                        benefit: {
                            type: 'object',
                            properties: {
                                value: { type: 'boolean' },
                                value_type: { type: 'boolean' },
                                value_cap: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                                item_value: { type: 'boolean' },
                            },
                            required: ['value', 'value_type', 'value_cap'],
                            additionalProperties: false,
                        },
                    },
                    required: ['mandatory', 'qualifier', 'benefit'],
                    additionalProperties: false,
                    anyOf: [
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            item_count: { const: true },
                                            item_count_upper: { const: true },
                                        },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['value_cap'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: { min_value: { const: true } },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['value', 'value_type'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: { item_id: { const: true } },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['item_value'],
                                    },
                                },
                            },
                        },
                    ],
                },
            }
        },
        required: ['offers'],
        additionalProperties: false,
    },
    { //combo
        if: {
            properties: {
                descriptor: {
                    properties: {
                        code: { const: 'combo' },
                    },
                },
            },
        },
        then: {
            properties: {
                // Ensure that the 'combo' fields like 'mandatory', 'qualifier', and 'benefit' are validated
                combo: {
                    type: 'object',
                    properties: {
                        mandatory: { type: 'boolean' },
                        qualifier: {
                            type: 'object',
                            properties: {
                                min_value: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_count_upper: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                            },
                            required: ['item_count', 'item_id'],
                            additionalProperties: false,
                        },
                        benefit: {
                            type: 'object',
                            properties: {
                                value: { type: 'boolean' },
                                value_type: { type: 'boolean' },
                                value_cap: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                                item_value: { type: 'boolean' },
                            },
                            required: ['value', 'value_type', 'value_cap'],
                            additionalProperties: false,
                        },
                    },
                    required: ['mandatory', 'qualifier', 'benefit'],
                    additionalProperties: false,
                    anyOf: [
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            item_count: { const: true },
                                            item_id: { const: true },
                                        },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['value_cap'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            min_value: { const: true },
                                        },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['value'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            item_count_upper: { const: true },
                                        },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['value_type'],
                                    },
                                },
                            },
                        },
                    ],
                }
            }
        },
        required: ['offers'],
        additionalProperties: false,
    },
    {//delivery
        if: {
            properties: {
                descriptor: {
                    properties: {
                        code: { const: 'delivery' },
                    },
                },
            },
        },
        then: {
            properties: {
                // Ensure that the 'delivery' fields like 'mandatory', 'qualifier', and 'benefit' are validated
                delivery: {
                    type: 'object',
                    properties: {
                        mandatory: { type: 'boolean' },
                        qualifier: {
                            type: 'object',
                            properties: {
                                min_value: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_count_upper: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                            },
                            required: [],
                            additionalProperties: false,
                        },
                        benefit: {
                            type: 'object',
                            properties: {
                                value: { type: 'boolean' },
                                value_type: { type: 'boolean' },
                                value_cap: { type: 'boolean' },
                                item_count: { type: 'boolean' },
                                item_id: { type: 'boolean' },
                                item_value: { type: 'boolean' },
                            },
                            required: ['value', 'value_type'],
                            additionalProperties: false,
                        },
                    },
                    required: ['mandatory', 'qualifier', 'benefit'],
                    additionalProperties: false,
                    anyOf: [
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            min_value: { const: true },
                                        },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['value_cap'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            item_count: { const: true },
                                        },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['item_value'],
                                    },
                                },
                            },
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            item_id: { const: true },
                                        },
                                    },
                                },
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ['item_count'],
                                    },
                                },
                            },
                        },
                    ],
                }
            }
        },
        required: ['offers'],
        additionalProperties: false,
    },
    {//exchange
        if: {
            properties: {
                descriptor: {
                    properties: {
                        code: { "const": "exchange" }
                    }
                }
            }
        },
        then: {
            properties: {
                exchange: {
                    type: "object",
                    properties: {
                        mandatory: { "type": "boolean" },
                        qualifier: {
                            type: "object",
                            properties: {
                                min_value: { "type": "boolean" },
                                item_count: { "type": "boolean" },
                                item_count_upper: { "type": "boolean" },
                                item_id: { "type": "boolean" }
                            },
                            required: [],
                            additionalProperties: false
                        },
                        benefit: {
                            type: "object",
                            properties: {
                                value: { "type": "boolean" },
                                value_type: { "type": "boolean" },
                                value_cap: { "type": "boolean" },
                                item_count: { "type": "boolean" },
                                item_id: { "type": "boolean" },
                                item_value: { "type": "boolean" }
                            },
                            required: [],
                            additionalProperties: false
                        }
                    },
                    required: ["mandatory", "qualifier", "benefit"],
                    additionalProperties: false,
                    anyOf: [
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            min_value: { "const": true }
                                        }
                                    }
                                }
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ["value"]
                                    }
                                }
                            }
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            item_count: { "const": true }
                                        }
                                    }
                                }
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ["item_value"]
                                    }
                                }
                            }
                        },
                        {
                            if: {
                                properties: {
                                    qualifier: {
                                        properties: {
                                            item_id: { "const": true }
                                        }
                                    }
                                }
                            },
                            then: {
                                properties: {
                                    benefit: {
                                        required: ["item_count"]
                                    }
                                }
                            }
                        }
                    ]
                }
            }
        },
        required: ['offers'],
        additionalProperties: false,
    },
    {//financing
        if: {
            properties: {
                descriptor: {
                    properties: {
                        code: { "const": "exchange" },
                    }
                }
            }
        },
        then: {
            properties: {
                // Ensure that the 'delivery' fields like 'mandatory', 'qualifier', and 'benefit' are validated
                financing: {
                    type: "object",
                    properties: {
                        mandatory: { type: "boolean" },
                        qualifier: {
                            type: "object",
                            properties: {
                                min_value: { type: "boolean" },
                                item_count: { type: "boolean" },
                                item_count_upper: { type: "boolean" },
                                item_id: { type: "boolean" },
                            },
                            required: [],
                            additionalProperties: false,
                            benefit: {
                                type: "object",
                                properties: {
                                    value: { type: "boolean" },
                                    value_type: { type: "boolean" },
                                    value_cap: { type: "boolean" },
                                    item_count: { type: "boolean" },
                                    item_id: { type: "boolean" },
                                    item_value: { type: "boolean" },
                                },
                                required: [],
                                additionalProperties: false,
                            },
                        },
                        required: ["mandatory", "qualifier", "benefit"],
                        additionalProperties: false,
                        allOf: [
                            {
                                if: {
                                    properties: {
                                        qualifier: {
                                            properties: {
                                                min_value: { const: true },
                                            },
                                        },
                                    },
                                },
                                then: {
                                    properties: {
                                        benefit: {
                                            required: ["value", "value_type"],
                                        },
                                    },
                                },
                            },
                            {
                                if: {
                                    properties: {
                                        qualifier: {
                                            properties: {
                                                item_count: { const: true },
                                            },
                                        },
                                    },
                                },
                                then: {
                                    properties: {
                                        benefit: {
                                            required: ["item_value"],
                                        },
                                    },
                                },
                            },
                            {
                                if: {
                                    properties: {
                                        qualifier: {
                                            properties: {
                                                item_id: { const: true },
                                            },
                                        },
                                    },
                                },
                                then: {
                                    properties: {
                                        benefit: {
                                            required: ["item_count", "item_id"],
                                        },
                                    },
                                },
                            },
                        ]
                    }
                }
            }
        },
        required: ['offers'],
        additionalProperties: false,
    },//
]
