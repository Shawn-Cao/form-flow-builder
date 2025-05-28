import React, { useState } from 'react';
import { initializeData, orderFields } from './form-spec-helper';
import { validate } from './handlers.js';
import { renderChildren, Paginator } from './react-ui-components.js';


/**
 * @param props.formSpec: form specifications as an object
 * @param props.components - custom components, overrides built-in ones
 * @param props.data initial data - optional, default to {}
 * @param props.onChange - change handler. Components should pass changed field name like {[name]: e.target.value}
 * @param props.onSubmit submit button handler - validation runs before
 * @param props.onError optional external error handlder.
 */
export const Form = (props) => {
    const [formData, setFormData] = useState(initializeData(props.formSpec, props.data));
    // allows data override through parent data change
    const [lastPropsData, setLastPropsData] = useState(props.data);
    if (lastPropsData !== props.data) {
        console.log('External data changed! Overriding corresponding form data fields.')
        setLastPropsData(props.data);
        setFormData({ ...formData, ...props.data });
    }

    const components = renderChildren(props, formData);

    const submitHandler = (event) => {
        event.preventDefault(); // still propagate the event
        const errors = validate(formData);
        if (errors) {
            // TODO: display error and return unsubmitted;
            return;
        }
        return props.onSubmit ? props.onSubmit(formData) : console.log(formData);
    }
    const isMultiPage = props.formSpec.pages
    if (isMultiPage) {
        return (
            <form onSubmit={submitHandler}>
                <Paginator>
                    {components}
                    <input type="submit" />
                </Paginator>
            </form>
        )
    }
    return (
        <form onSubmit={submitHandler}>
            {components}
            <input type="submit" />
        </form>
    )
};

