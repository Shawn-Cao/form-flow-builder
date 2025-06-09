/**
 * Typical validators. Their names are used in form specifications.
 * Demo a few for now
 * TODO: try align with HTML specs, eg https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 */
export const max = (numberValue, maxValue) => numberValue > maxValue ? "max value exceeded" : undefined;

export const min = (numberValue, minValue) => numberValue < minValue ? "min value not reached" : undefined;

export const maxLength = (stringValue, length) => stringValue.length > length ? "string length too long" : undefined;

export const minLength = (stringValue, length) => stringValue.length > length ? "string length too short" : undefined;

const validators = {
    max,
    min,
    maxLength,
    minLength,
}

export default validators;
