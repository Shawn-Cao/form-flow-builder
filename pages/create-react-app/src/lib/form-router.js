
/**
 * Transform specified fields from map form to nested arrays.
 * formData may be used to determine order
 */
export const orderFields = (formSpec, formData) => {
    if (typeof formSpec?.fields !== 'object') {
        console.log("Error! Expect the form to specify fields as a map.")
        return [];
    }
    // single page no order specification: use object fields order
    if (!formSpec.order || !formSpec.routing) {
        return Object.entries(formSpec.fields).map(([fieldName, fieldSpec]) => ({
            name: fieldName,
            ...fieldSpec,
        }))
    }
};
