import React, { useState } from 'react';

// plain HTML text input https://www.w3schools.com/html/html_form_input_types.asp
export const TextInput = ({ name, description, value, onChange, onError, formData = {} }) => {
    const [value, setValue] = useState(formData[name] || defaultValue || undefined);

    // handle parent value change while still own the data ? well, maybe shouldn't
    if (formData[name] !== value) {
        console.log(`Parent formData changed. Updating ${name} field value from ${value} to ${formData[name]}`)
        setValue(formData[name]);
    }
    const changeHandler = (e) => {
        setValue(e.target.value);
        // TODO: validate, and optionally skip onChange based on config
        // if (validateOnChange) {
        //     const errors = validate(value);
        //     errors && onError(errors);
        // }
        if (onChange) {
            return onChange({ name, value: e.target.value });
        }
    }
    return (
        <label>
            {description || `${name}: `}
            <input
                name={name}
                type="text"
                aria-label={name}
                value={value}
                onChange={changeHandler}
            />
        </label>
    );
}

// plain HTML number input
export const NumberInput = ({ name, description, defaultValue, onChange, onError, formData = {} }) => {
    const [value, setValue] = useState(formData[name] || defaultValue || undefined);
    const changeHandler = (e) => {
        const updatedValue = setValue(e.target.value);
        if (onChange) {
            return onChange({ name, value: e.target.value });
        }
        return updatedValue;
    }
    return (
        <label>
            {description || `${name}: `}
            <input
                name={name}
                type="number"
                aria-label={name}
                value={value}
                onChange={changeHandler}
            />
        </label>
    );
}

// TODO: html select
export const SelectInput = ({ name, description, defaultValue, onChange, onError }) => {
    const [value, setValue] = useState(defaultValue || '');
    const changeHandler = (e) => {
        const updatedValue = setValue(e.target.value);
        if (onChange) {
            return onChange({ name, value: e.target.value });
        }
        return updatedValue;
    }
    return (
        <label>
            {description}
            <input
                name={name}
                type="number"
                value={value}
                onChange={changeHandler}
            />
        </label>
    );
}

const findReactComponent = ({ type, constraint, options }) => {
    switch (type) {
        case 'string':
            return options ? SelectInput : TextInput;
        case 'number':
            return NumberInput;
        default:
            console.warn(`Component not found! Field specificated type "${type}" does not match to a built'in component, you can create your own one.`);
            return () => {};
    }
}

export default findReactComponent;
