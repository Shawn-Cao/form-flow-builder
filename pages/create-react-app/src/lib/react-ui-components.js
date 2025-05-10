import React from 'react';


// plain HTML text input https://www.w3schools.com/html/html_form_input_types.asp
export const TextInput = ({ name, description, value = '', onChange, error, formData = {} }) => {
    return (
        <label>
            {description || `${name}: `}
            <input
                name={name}
                type="text"
                aria-label={name}
                value={value}
                onChange={(e) => onChange({[name]: e.target.value})}
            />
        </label>
    );
}

// plain HTML number input
export const NumberInput = ({ name, description, value = 0, onChange, onError, formData = {} }) => {
    return (
        <label>
            {description || `${name}: `}
            <input
                name={name}
                type="number"
                aria-label={name}
                value={value}
                onChange={(e) => onChange({[name]: e.target.value})}
            />
        </label>
    );
}

// TODO: html select
export const SelectInput = ({ name, description, value = '', onChange, options = [], onError, formData = {} }) => {
    return (
        <label>
            {description || `${name}: `}
            <select
                name={name}
                value={value}
                onChange={(e) => onChange({[name]: e.target.value})}
            >
                {options.map(option => (<option value={option} key={option}>{option}</option>))}
            </select>
        </label>
    );
}

const findReactComponent = ({ type, constraint, options }) => {
    if (options) {
        return SelectInput;
    }
    switch (type) {
        case 'string':
            return TextInput;
        case 'number':
            return NumberInput;
        default:
            console.warn(`Component not found! Field specificated type "${type}" does not match to a built-in component, you can create your own one.`);
            return () => {};
    }
}

export default findReactComponent;
