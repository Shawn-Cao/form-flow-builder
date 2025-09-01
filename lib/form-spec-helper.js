/**
 * JSON spec use {[name]: {...fields}} format to improve readability by reducing nesting
 * This utility method converts them back to be used in the library's internal logic
 */
export const denormalize = spec => Object.entries(spec).map(([fieldName, fieldSpec]) => ({
    name: fieldName,
    ...fieldSpec,
}));

const get = (dataFieldNameString, data) => {
    const valueOrReference = dataFieldNameString.trim();
    if (valueOrReference.startsWith("!")) {
        return !get(valueOrReference.substring(1), data)
    }
    if (valueOrReference.startsWith('$')) {
        const reference = valueOrReference.replace('$', '');
        return data[reference];
    }
    // auto escaping, hence string doesn't need quote "" 
    switch (valueOrReference) {
        case 'true':
            return true;
        case 'false':
            return false;
        default:
            return valueOrReference;
    }
};

/**
 * Converts custom config string to a function to evaluate form data dynamically.
 *   NOTE: We support basic de-referencing and comparison. But for security, never use eval or complicated logic.
 *   The custom string evaluation works similar to https://docs.gitlab.com/ci/jobs/job_rules/#cicd-variable-expressions
 * @param {*} configString 
 * @returns function to be called with form data as argument
 */
export const customReferenceEvaluation = (configString, data) => {
    if (!configString.includes('=')) { // Boolean conversion
        return Boolean(get(configString, data));
    }
    if (configString.split('==').length === 2) { // equality comparison
        const [left, right] = configString.split('==');
        return get(left, data) == get(right, data);
    }
    if (configString.split('!=').length === 2) { // inequality comparison
        const [left, right] = configString.split('!=');
        return get(left, data) != get(right, data);
    }
    return config;
};

/**
 * Transform specified fields from map form to nested arrays.
 * formData may be used to determine order
 */
export const orderFields = (formSpec, formData) => {
    if (typeof formSpec?.fields !== 'object') {
        console.log("Error! Expect the form to specify fields as a map.")
        return [];
    }
    // TODO: decide to support ordering here or during pagination (eg. !formSpec.order || !formSpec.routing)
    // single page no order specification: use object fields order
    if (!formSpec.order || !formSpec.routing) {
        // TODO: nested fields should have name as `$(parent}-${child}...` => for list items
        // for now, this is delegated to nested and list element to handle themselves
        return denormalize(formSpec.fields);
    }
};

/**
 * 
 * @param formSpec:  fields
 * @param initialData: optional data that are pre-filled for the form
 * NOTE: we should differentiate default data from no-input, vs user viewed data.
 *   This is because in mission critical projects, data should be seen by the user in order to be considered valid (reviewed).
 *   Hence any not pre-filled fields are initialized to undefined.
 */
export const initializeData = (formSpec, initialData = {}) => {
    if (typeof formSpec?.fields !== 'object') {
        console.error('Error! Expect a valid form specification with fields as map');
        return;
    }
    const data = initialData;
    Object.entries(formSpec.fields).forEach(([fieldName, fieldSpec]) => {
        data[fieldName] = data[fieldName] ?? fieldSpec.defaultValue;
    });
    return data;
};
