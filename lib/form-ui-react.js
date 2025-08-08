import React, { useState, useEffect } from 'react';
import Form from './form-data';
import { initializeData, orderFields } from './form-spec-helper.js';
import { findReactComponent, renderChildren, Paginator } from './form-ui-react-components.js';

const useForm = (formSpec, initialData, formName) => {
    const form = Form.get(formName) ?? new Form(formSpec, initialData);
    const [data, setData] = useState(form.data);
    // TODO: think about this when/if other places needs setData
    // const [data, setReactData] = useState(form.data);
    // const setData = (data) => {
    //     form.data = data; 
    //     setReactData(data);
    // };
    return { form, data, setData, errors: form.errors, orderedFields: form.orderFields };
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
    // desired API
    // const { handleChange, handleSubmit } = createForm(props.formSpec, props.formData, props.formName);
    // handleChange.bind(null, )
    // // on Uncontolled??? let user decide? - yes we should

    // forms.error: {[field-name]: error, "form": error}
    const { form, data: formData, setData: setFormData, errors, orderedFields } = useForm(props.formSpec, props.data, props.formName);

    // allows data override through parent data change
    const [lastPropsData, setLastPropsData] = useState(props.data);
    if (lastPropsData !== props.data) {
        console.log('External data changed! Overriding corresponding form data fields.')
        setLastPropsData(props.data);
        setFormData({ ...formData, ...props.data });
    }

    const fieldComponents = orderedFields.map((fieldSpec, index) => {
        const Component = findReactComponent(fieldSpec, props.components);
        const name = fieldSpec.name;
        const changeHandler = (e) => {
            // instead of useEffect, let the library drive changes
            const newFormData = form.change(e);
            props.validateOnChange && props.onError?.(form.errors);
            // new object to notify React for change
            setFormData({ ...newFormData });
            return props.onChange?.(newFormData);
        }
        const id = props.idMapper?.(name, index) || `form-${form.name}-${name}`

        return (
            <Component
                name={name}
                id={id}
                key={name}
                value={formData[name]}
                onChange={changeHandler}
                error={errors[name]}
                onError={props.onError}
                formData={formData}
            />
        )
    });

    const submitHandler = (event) => {
        event.preventDefault(); // still propagate the event
        // TODO: reportValidity() from https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation#validating_forms_using_javascript
        if (props.validateOnSubmit === true || props.validateOnSubmit === undefined) {
            if (Object.keys(errors).length) {
                // TODO: display error and return unsubmitted;
                console.error("form submit handler errors:", errors)
                return;
            }
        }
        return props.onSubmit ? props.onSubmit(formData) : console.log(formData);
    }
    // TODO: move Paginator into <Layout> component and extrac logic, should be live in form object???
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
            {fieldComponents}
            <div className={errors['__root'] ? "error active" : "error"} aria-live="polite">{errors['__root']}</div>
            <div><input type="submit" value="Submit" /></div>
        </form>
    )
};

export default FormReact;
