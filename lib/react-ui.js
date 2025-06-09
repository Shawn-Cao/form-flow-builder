import React, { useState } from 'react';
import { initializeData, orderFields } from './form-spec-helper';
import { validate } from './handlers.js';
import { findReactComponent, renderChildren, Paginator } from './react-ui-components.js';

// TODO: decide where to put errors, and how to merge then(eg. onChange clear?)
// forms.error: {[field-name]: error, "form": error}
let errors;

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
export const Form = (props) => {
    // desired API
    // const { handleChange, handleSubmit } = createForm(props.formSpec, props.formData, props.formName);
    // handleChange.bind(null, )
    // // on Uncontolled??? let user decide? - yes we should

    const [formData, setFormData] = useState(initializeData(props.formSpec, props.data));
    // allows data override through parent data change
    const [lastPropsData, setLastPropsData] = useState(props.data);
    if (lastPropsData !== props.data) {
        console.log('External data changed! Overriding corresponding form data fields.')
        setLastPropsData(props.data);
        setFormData({ ...formData, ...props.data });
    }

    const orderedFields = orderFields(props.formSpec, formData || data);
    const fieldComponents = orderedFields.map((fieldSpec, index) => {
        const Component = findReactComponent(fieldSpec, props.components);
        const name = fieldSpec.name;
        // TODO: deal with setFormData (and setNewItem for List)
        // also name should be `$(parent}-${child}...` when nesting 
        const changeHandler = (e) => {
            const newFormData = {
                ...formData,
                [name]: e.target.value
            };
            if (props.validateOnChange === true || props.validateOnChange === undefined) {
                errors = validate(props.formSpec, {[name]: e.target.value})
                props.onError?.(errors)                
            }
            console.log('===>changed field: [', name, '], changed value to: ', e.target.value, '. new form data: ', newFormData, "errors: ", errors);
            setFormData(newFormData); // TODO: support deep merge
            return props.onChange?.(newFormData);
        }
        const id = props.idMapper?.(name, index) || `${props.formName?`${props.formName}-`:''}${name}`

        return (
            <Component
                name={name}
                id={id}
                key={name}
                value={formData[name]}
                onChange={changeHandler}
                error={errors}
                onError={props.onError}
                formData={formData}
            />
        )
    });

    const submitHandler = (event) => {
        event.preventDefault(); // still propagate the event
        // TODO: reportValidity() from https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation#validating_forms_using_javascript
        if (props.validateOnSubmit === true || props.validateOnSubmit === undefined) {
            const errors = validate(props.formSpec, formData);
            if (errors) {
                // TODO: display error and return unsubmitted;
                console.error("form submit handler errors:", errors)
                return;
            }
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
            {fieldComponents}
            <div className={error ? "error active" : "error"} aria-live="polite">{errors}</div>
            <div><input type="submit" /></div>
        </form>
    )
};

