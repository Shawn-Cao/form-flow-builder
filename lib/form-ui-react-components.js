import React, { useState } from 'react';

// NOTE: react component should be plain and decoupled as much as possible
// the form supports using either/both uncontrolled and controlled input

// plain HTML text input https://www.w3schools.com/html/html_form_input_types.asp
export const TextInput = ({ name, id, required, value = '', onChange, error = "", fieldSpec: { description, placeholder, readOnly } }) => {
    return (
        <label htmlFor={id}>
            <span>{description || `${name}: `}</span><br />
            <input
                name={name}
                id={id}
                type="text"
                aria-label={name}
                placeholder={placeholder}
                disabled={readOnly}
                value={value}
                onChange={onChange}
            />
            <span className={error ? "error active" : "error"} aria-live="polite">{error}</span>
        </label>
    );
};

// plain HTML number input
export const NumberInput = ({ name, id, required, value, onChange, error = "", fieldSpec: { description, defaultValue = 0 } }) => {
    return (
        <label htmlFor={id}>
            <span>{description || `${name}: `}</span><br />
            <input
                name={name}
                id={id}
                type="number"
                aria-label={name}
                required={required}
                value={value ?? defaultValue}
                onChange={onChange}
            />
            <span className={error ? "error active" : "error"} aria-live="polite">{error}</span>
        </label>
    );
};

export const BooleanInput = ({ name, id, required, value = '', onChange, error = "", fieldSpec: { description, options = [] }}) => {
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

export const SelectInput = ({ name, id, required, value = '', onChange, error = "", fieldSpec: { description, options = [] }}) => {
    return (
        <label htmlFor={id}>
            <span>{description || `${name}: `}</span><br />
            <select
                name={name}
                id={id}
                required={required}
                value={value}
                onChange={onChange}
            >
                {options.map(option => (<option value={option} key={option}>{option}</option>))}
            </select>
            <span className={error ? "error active" : "error"} aria-live="polite">{error}</span>
        </label>
    );
};

