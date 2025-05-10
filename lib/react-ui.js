import React from 'react';
import { useState } from 'react';

/**
 * TODO: havent' set up compileing in lib module for react. developing over there first
 *  - move create-react-app/lib to root /lib, then import form-lib/dist
 */

/**
 * {@props.data} initial data - optional, default to {}
 * {@props.updateData} change handler, update data to outside if props.data is passed in
 * {@props.onSubmit} submit button handler - validation runs before
 * {@props.onError} optional external error handlder.
 */
export const Form = (props) => {
    const [formData, setFormData] = useState(props?.data || {});
    // const [formData, setFormData] = [{}, () => {}];
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

export const NumberField = ({ inputData, formData, onChange, onError }) => {
    return (
        <input name="age" type="number" />
    );
}

const fields = {
    NumberField,
}

export default fields;
