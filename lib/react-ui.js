import React from 'react';

/**
 * {@props.data} initial data - optional, default to {}
 * {@props.updateData} change handler, update data to outside if props.data is passed in
 * {@props.onSubmit} submit button handler - validation runs before
 * {@props.onError} optional external error handlder.
 */
export const Form = (props) => {
    const [formData, setFormData] = useState(props.data || {});
    const updateData = (formData) => {
        setFormData(formData);
        props?.updateData(formData);
    }
  
    // TODO: builder.build(formSpec)
    // const Form = formFlowBuilder.build(formSpec, formComponents)
    const fields = [
        (<input name="name" />),
        (<input name="age" type="number" />),
    ]
    return (
        <form>
            {fields}
        </form>
    );
  };

export function NumberField = ({ inputData, formData, onChange, onError }) => {
    return (
        <input name="age" type="number" />
    );
}

export default ui;