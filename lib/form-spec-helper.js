
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
        return Object.entries(formSpec.fields).map(([fieldName, fieldSpec]) => ({
            name: fieldName,
            ...fieldSpec,
        }))
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
