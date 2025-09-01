import React, { useState } from 'react';
// NOTE: react component should be plain and decoupled as much as possible
// the form supports using either/both uncontrolled and controlled input

// text input can also handles some other HTML inputs in https://www.w3schools.com/html/html_form_input_types.asp
const TextLikeInputTypes = new Set(['email', 'tel', 'search', 'url']);

export const TextInput = ({ name, id, value, onChange, error = "", form, fieldSpec: { description, type, defaultValue, placeholder, required, readOnly } }) => {
    if (!value && defaultValue) { value = defaultValue; }
    if (typeof required === 'string') {
        console.log('required', required);
    }
    return (
        <label htmlFor={id}>
            <span>{description || `${name}: `}</span><br />
            <input
                name={name}
                id={id}
                type={TextLikeInputTypes.has(type) ? type : 'text'}
                aria-label={name}
                required={form.evaluate(required)}
                placeholder={placeholder}
                disabled={form.evaluate(readOnly)}
                value={value}
                onChange={onChange}
            />
            <span className={error ? "error active" : "error"} aria-live="polite">{error}</span>
        </label>
    );
};

// plain HTML number input
export const NumberInput = ({ name, id, value, onChange, error = "", form, fieldSpec: { description, defaultValue = 0, required } }) => {
    return (
        <label htmlFor={id}>
            <span>{description || `${name}: `}</span><br />
            <input
                name={name}
                id={id}
                type="number"
                aria-label={name}
                required={form.evaluate(required)}
                value={value ?? defaultValue}
                onChange={onChange}
            />
            <span className={error ? "error active" : "error"} aria-live="polite">{error}</span>
        </label>
    );
};

export const BooleanInput = ({ name, id, value = '', onChange, error = "", form, fieldSpec: { description, options = [], required }}) => {
    return (
        <label htmlFor={id}>
            <span>{description || `${name}: `}</span>
            <input
                type="checkbox"
                name={name}
                id={id}
                checked={value}
                onChange={onChange}
            />
            <span className={error ? "error active" : "error"} aria-live="polite">{error}</span>
        </label>
    );
};

export const SelectInput = ({ name, id, value = '', onChange, error = "", form, fieldSpec: { description, options = [], required }}) => {
    return (
        <label htmlFor={id}>
            <span>{description || `${name}: `}</span><br />
            <select
                name={name}
                id={id}
                required={form.evaluate(required)}
                value={value}
                onChange={onChange}
            >
                {options.map(option => (<option value={option} key={option}>{option}</option>))}
            </select>
            <span className={error ? "error active" : "error"} aria-live="polite">{error}</span>
        </label>
    );
};

