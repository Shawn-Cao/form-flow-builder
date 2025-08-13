import React, { useState } from 'react';

// NOTE: react component should be plain and decoupled as much as possible
// the form supports using either/both uncontrolled and controlled input

export const ListInput = (props) => {
    const { name, value = [], fields, onChange, id, formData = {} } = props;
    const [newItem, setNewItem] = useState({});
    const addItem = () => {
        console.log('newItem: ', newItem);
        if (newItem) {
            value.push(newItem);
            onChange({ [name]: value })
        }
    };
    const listIdMapper = (childName, index) => `${name}-${childName}-${index}`;
    console.log('ListItem props: ', props);
    const children = renderChildren({
        ...props,
        formSpec: { fields },
        idMapper: props.idMapper || listIdMapper
    }, newItem);
    return (
        <div>
            {children}
            <button onClick={() => {}}>Add</button>
            <ul>
                {value.map(item => (<li>{JSON.stringify(item, null, 2)}</li>))}
            </ul>
        </div>
    );
}


// plain HTML text input https://www.w3schools.com/html/html_form_input_types.asp
export const TextInput = ({ name, id, required, value = '', onChange, error = "", fieldSpec: { description, instruction } }) => {
    return (
        <label htmlFor={id}>
            <span>{description || `${name}: `}</span><br />
            <input
                name={name}
                id={id}
                type="text"
                aria-label={name}
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

export const builtInComponents = {
    repeated: ListInput,
    string: TextInput,
    number: NumberInput,
    boolean: BooleanInput,
    select: SelectInput,
}

export function findReactComponent({ type, constraint, options }, customComponents = {}){
    const directlyMatched = builtInComponents[type] || customComponents[type];
    if (directlyMatched) {
        return directlyMatched;
    }
    if (options) {
        return SelectInput;
    }
    switch (type) {
        // case 'compound':
        //   TODO: handle grouped input. eg. card.color & card.text
        default:
            console.warn(`Component not found! Field specified type "${type}" does not match to a built-in component, you can create your own one.`);
            return () => {};
    }
};


export default findReactComponent;
