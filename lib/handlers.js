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
    // 1. validate each fields' own constraints
    const errors = Object.entries(formSpec.fields || {}).map(([fieldName, spec]) => {
        if (spec?.constraints) {
            return Object.entries(spec.constraints)
                .map(([constraintName, constraintValue]) => validators[constraintName]?.(formData[fieldName], constraintValue))
                .reduce(mergeErrors, []);
        }
        return undefined
    }).reduce(mergeErrors, []);
    // 2. cross validation
    if (typeof formSpec.validation === 'function') {
        const crossValidationErrors = formSpec.validation(formData);
        if (crossValidationErrors) {
            errors.concat(crossValidationErrors);
        }
    }
    return errors.length ? errors.flat() : undefined;
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

const handlers = {

}

export default handlers;