import React, { useState, useEffect } from 'react';
import Form from '../form-data.js';
import { Paginator } from './form-ui-react-layout.js';

export const useForm = (formSpec, initialData, formName, components, idMapper) => {
    const form = Form.get(formName) ?? new Form(formSpec, initialData, { name: formName, components, idMapper });
    // NOTE: a copy of form data is kept in React for change detection
    const [data, setData] = useState(form.data);

    // allows data override through parent data change
    const [lastFormSpec, setLastFormSpec] = useState(formSpec);
    if (lastFormSpec !== formSpec) {
        console.log('Form specs changes, resetting form!');
        setLastFormSpec(formSpec);
        Form.clear(formName);
    }
    // TODO: think about this when/if other places needs setData
    // const [data, setReactData] = useState(form.data);
    // const setData = (data) => {
    //     form.data = data; 
    //     setReactData(data);
    // };
    return { form, data, setData, errors: form.errors };
}

/**
 * @param props.formSpec: form specifications as an object
 * @param props.components - custom components, overrides built-in ones
 * @param props.data initial data - optional, default to {}
 * @param props.onChange - change handler. Components should pass changed field name like {[name]: e.target.value}
 * @param props.onSubmit submit button handler - validation runs before
 * @param props.onError optional external error handlder.
 * @param props.validateOnSubmit default true
 * @param props.validateOnChange default true (TODO: default to onBlur?)
 */
export const FormReact = (props) => {
    // forms.errors: {[field-name]: error, "form": error}
    const {
        form: liveForm,
        data: formData,
        setData: setFormData,
        errors,
    } = useForm(props.formSpec, props.components, props.data, props.formName, props.idMapper);

    // allows data override through parent data change
    const [lastPropsData, setLastPropsData] = useState(props.data);
    if (lastPropsData !== props.data) {
        console.log('External data changed! Overriding corresponding form data fields.')
        setLastPropsData(props.data);
        setFormData({ ...formData, ...props.data });
    }

    // React components shares the same form provided event handler
    const changeHandler = event => {
        const newFormData = liveForm.handleChange(event);
        props.validateOnChange && props.onError?.(liveForm.errors);
        // new object to notify React for change
        setFormData({ ...newFormData });
        return props.onChange?.(newFormData);
    }

    const submitHandler = (event) => {
        const isFormValid = liveForm.handleSubmit(event);
        return isFormValid && props?.onSubmit(formData);
    }
    return (
        <form onSubmit={submitHandler}>
            <Paginator form={liveForm} formData={formData} onChange={changeHandler}>
            </Paginator>
        </form>
    );
};

export default FormReact;
