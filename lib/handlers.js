/*
 * Handles form submit, validation, and navigation for multi-page forms
 */

import validators from 'validators';
const mergeErrors = ((errors, error) => errors.push(error), []);


const handlers = {

}

const formSpec = {
    fields: {
        name: {
            type: 'string',
        },
        age: {
            type: 'integer',
            constraints: {
                min: 0,
                max: 200,
            }
        },
        gender: {
            type: 'string',
            options: ['male', 'female', 'other'],
        }
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
 * validation(onChange) is where a DSL is needed. For now we can just support own field validation and let the DSL evolve.
 * 
 */
export const validate = (formSpec, formData) => {
    // 1. validate each fields' own constraints
    const errors = formSpec.fields.map(field => {
        if (field.constraints) {
            return constrains.entries()
                .map(validators)
                .reduce(mergeErrors, []);
        }
    }).reduce(mergeErrors, []);
    // 2. cross validation
    if (typeof formSpec.validation === 'function') {
        const crossValidationErrors = formSpec.validation(formData);
        if (crossValidationErrors) {
            errors.concat(crossValidationErrors);
        }
    }
    // TODO: add tests
}

export const createValidator = (formSpec) => (formData) => validate(formSpec, formData);

// validate, notification, etc.
export const onSubmit = (formData, clientHandler, onError) => {
    const errors = validate(formData);
    if (!errors) {
        return clientHandler();
    }
    return onError(errors, formData);
}

export const onNext = () => {};

export default handlers;