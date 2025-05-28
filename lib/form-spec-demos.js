/**
 * Example form specifications (core specs)
 * DSL features - fields: 
 *   1. type - data type, used in validation, also hints choice of component
 *   2. constraints - type specific validation rules
 *   3. defaultValue - initializes data (trumped by inferred and user input data)
 *   4. options - data validation, also hints choice of component
 *   5. required/optional - submit guards, also hints UI display (like in Gitlab docs)
 */
export const demoFormSpec = {
    fields: {
        name: {
            type: 'string',
        },
        age: {
            type: 'number',
            constraints: {
                min: 0,
                max: 200,
            },
        },
        motherPlanet: {
            type: 'string',
            defaultValue: 'Earth',
        },
        gender: {
            type: 'string',
            options: ['male', 'female', 'other'],
            required: '$motherPlanet == "Earth"',
        },
    },
};

/**
 * Translates to data fields and components, validations.
 */
export const demoFormSpecInAction = {
    data: {
        name: undefined,
        age: undefined,
        motherPlanet: 'Earth',
        gender: undefined,
    },
    components: [
        {
            name: 'name',
            type: 'string',
        },
        {
            name: 'age',
            type: 'number',
            constraints: {
                min: 0,
                max: 200,
            },
        },
        {
            name: 'motherPlanet',
            type: 'string',
            defaultValue: 'Earth',
        },
        {
            name: 'gender',
            type: 'string',
            options: ['male', 'female', 'other'],
        },
    ],
}

/**
 * Multiple pages, where translation is guarded by validation
 *   1. custom page order using @param pages
 *   2. nested fields using type = 'repeated' or 'compound'
 */
export const multiPageForm = {
    fields: {
        shoppingCart: {
            type: 'repeated', // a list with add/review/remove buttons 
            fields: {
                itemName: { type: 'string' },
                SKU: { type: 'id', readOnly: true }, 
                price: { type: 'number', constraints: { min: 0 } },
                notes: { type: 'string' },
            }
        },
        // shippingAddress: {
        //     type: 'streetAddress', // custom type with autosuggest
        //     fields: {
        //         street: {},
        //         streetLine2: {},
        //         city: {},
        //         state: {},
        //     }
        // },
        // recepient: {
        //     type: 'compound', // nested fields
        //     fields: {
        //         name: {},
        //         phoneNumber: { type: 'phoneNumber' },
        //         email: { type: 'email' }
        //     }
        // },
    },
    // pages: {
    //     selectItems: {
    //         fields: ['shoppingCart'],
    //         constraints: {
    //             notEmpty: 'shoppingCart'
    //         }
    //     },
    //     completeOrder: { // custom page
    //         fields: ['shippingAddress', 'recepient']
    //     }
    // }
};


/**
 * Dynamic components:
 *   1. optional fields using required/optional
 *   2. conditional fields using only/except(show/hide)
 *   NOTE: every field is default as required
 */
export const dynamicFormSpec = {
    fields: {
        loanPurpose: {
            type: 'string',
            options: ['purchase', 'refinance'],
        },
        loanType: {
            type: 'string',
            options: ['Conventional', 'FHA', 'VA'],
            only: '$loanPurpose == "purchase"',
            optional: true,
        },
        isJumboLoan: {
            type: 'boolean',
            required: '$loanType == "Conventional"',
        },
        downPaymentPercentage: {
            type: 'number',
            constraints: {
                min: 3,
                max: 90,
            },
            defaultValue: 20,
            only: '$loanPurpose == "purchase" && $loanType == "Conventional',
        },
    },
};

/**
 * custom validations (Defined in core form spec so server-side can use the same)
 */
export const demoValidationOnSubmit = {
    fields: {
        name: {
            type: 'string',
        },
        gender: {
            type: 'string',
            options: ['male', 'female', 'other'],
        },
        otherGender: {
            type: 'string',
            required: '$gender == "other',
        },
    },
    validation: (formData) => {
        const errors = [];
        if (formData.name === 'John' && formData.gender === 'female') {
            errors.push('John isn\'t typically a female name');
        }
        return errors.length ? errors : undefined;
    }
};

/**
 * defaults: fields type defaults to string
 */
export const demoDefaults = {
    fields: ['name', 'age', 'gender']
}

/**
 * get spec from data
 */
export const demoDataDriven = {
    data: {
        name: 'John',
        age: 50,
        gender: 'male',
    }
}