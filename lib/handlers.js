/*
 * Event handlers form submit, validation, and navigation for multi-page forms
 */

import validators from './validators';

// tools functions
export const mergeErrors = (errors, error) => error ? (errors.push(error), errors) : errors;




/**
 * validation(onChange) is where a DSL is needed. For now we can just support a few and let the DSL evolve.
 * @returns {} for passed, {[name]: error} for each failure
 */
export const validate = (formSpec, formData) => {
    // 1. validate each fields' own constraints
    const errors = {};
    Object.entries(formSpec.fields || {}).forEach(([fieldName, spec]) => spec?.constraints &&
        Object.entries(spec.constraints).forEach(([constraintName, constraintValue]) => {
            const fieldError = validators[constraintName]?.(formData[fieldName], constraintValue);
            if (fieldError) {
                errors[fieldName] = errors[fieldName] ? `${errors[fieldName]} ${fieldError}` : fieldError;
            }
        })
    )
    // 2. cross validation, errors at the root
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