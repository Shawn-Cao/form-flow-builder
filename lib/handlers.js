/*
 * Event handlers form submit, validation, and navigation for multi-page forms
 */

import validators from './validators';

// tools functions
export const mergeErrors = (errors, error) => error ? (errors.push(error), errors) : errors;




/**
 * validation(onChange) is where a DSL is needed. For now we can just support own field validation and let the DSL evolve.
 * @returns undefined for passed, Array<errors> for each failure
 */
export const validate = (formSpec, formData) => {
    // 1. validate each fields' own 
    const errors = {};
    Object.entries(formSpec.fields || {}).forEach(([fieldName, spec]) => spec?.constraints &&
        Object.entries(spec.constraints).forEach(([constraintName, constraintValue]) => {
            const fieldError = validators[constraintName]?.(formData[fieldName], constraintValue);
            if (fieldError) {
                errors[fieldName] = fieldError; // NOTE: only return last constraint error on each field
            }
        })
    )
    // 2. cross validation
    if (typeof formSpec.validation === 'function') {
        const crossValidationError = formSpec.validation(formData);
        if (crossValidationError) {
            errors["__root"] = crossValidationError;
        }
    }
    return errors;
}

export const createValidator = (formSpec) => (formData) => validate(formSpec, formData);

// validate, notification, etc.
export const onSubmit = (formData, clientHandler, onError) => {
    const errors = validate(formData);
    if (Object.keys(errors).length() !== 0) {
        return clientHandler(errors);
    }
    return onError(errors, formData);
}

export const onNext = () => {};

const handlers = {

}

export default handlers;