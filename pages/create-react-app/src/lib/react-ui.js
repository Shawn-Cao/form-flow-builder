import React, { useState } from 'react';
import { orderFields } from './form-router';
import findComponent from './react-ui-components';

/**
 * TODO: set up compiling lib module so create-react-app work out-of-the-box. developing right here first
 */

/**
 * @props.formSpec: form specifications as an object
 * @props.components - custom components, overrides built-in ones
 * @props.data initial data - optional, default to {}
 * @props.onChange -  change handler, also update data to outside if props.data is passed in
 * @props.onSubmit submit button handler - validation runs before
 * @props.onError optional external error handlder.
 */
export const Form = (props) => {
    const [formData, setFormData] = useState(props?.data || {});
    if (props.data !== formData) {
        setFormData(props.data);
    }

    // for performance, field component should emit events with field {name:value}
    // eslint-disable-next-line
    const changeHandler = (fieldData) => {
        const newFormData = { ...formData, ...fieldData };
        console.log('new form data: ', formData);
        setFormData(newFormData); // TODO: support deep merge
        props?.onChange?.(newFormData);
    }

    const orderedFields = orderFields(props.formSpec, formData);
    const components = orderedFields.map(fieldSpec => {
        const Component = props.components?.[fieldSpec.type]
            || findComponent(fieldSpec);
        return (
            <Component
                {...fieldSpec}
                key={fieldSpec.name}
                onChange={changeHandler}
                formData={formData}
            />
        )
    });
    const submitHandler = (event) => {
        event.preventDefault(); // still propagate the event
        return props.onSubmit ? props.onSubmit(formData) : console.log(formData);
    }
    const fields = (
        <form onSubmit={submitHandler}>
            {components}
            <input type="submit" />
      </form>
    )
    return fields;
};

