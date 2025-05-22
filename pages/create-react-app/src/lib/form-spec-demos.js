
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
export default const demoFormInAction = {
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
