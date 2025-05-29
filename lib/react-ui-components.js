import React, { useState } from 'react';
import { orderFields } from './form-spec-helper';


export const renderChildren = ({ formSpec, components, idMapper, onChange, data }, formData) => {
    const orderedFields = orderFields(formSpec, formData || data);
    // TODO: deal with setFormData (and setNewItem for List) 
    // for convenience, field component should emit events with field {name:value}
    const changeHandler = (fieldData) => {
        console.log('onchange field data: ', fieldData, 'formData:', formData);
        const newFormData = { ...formData, ...fieldData };
        console.log('new form data: ', newFormData);
        setFormData(newFormData); // TODO: support deep merge
        return onChange?.(newFormData);
    }
    return orderedFields.map((fieldSpec, index) => {
        const Component = components?.[fieldSpec.type]
            || findReactComponent(fieldSpec);
        const name = fieldSpec.name;
        return (
            <Component
                {...fieldSpec}
                id={idMapper?.(name, index) || name}
                key={name}
                value={formData[name]}
                onChange={changeHandler}
                formData={formData}
            />
        )
    });
}

// TODO: import shared logic: validate on Next, reload to hold page number
export const Paginator = ({ childern }) => {
    return (
        <div>
            {childern}
            <button onClick={() => {}}>Next</button>
        </div>
    )
};

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
export const TextInput = ({ name, id, description, value = '', onChange, error, formData = {} }) => {
    return (
        <label>
            {description || `${name}: `}
            <input
                name={name}
                id={id}
                type="text"
                aria-label={name}
                value={value}
                onChange={(e) => onChange({ [name]: e.target.value })}
            />
        </label>
    );
};

// plain HTML number input
export const NumberInput = ({ name, id, description, value = 0, onChange, onError, formData = {} }) => {
    return (
        <label>
            {description || `${name}: `}
            <input
                name={name}
                id={id}
                type="number"
                aria-label={name}
                value={value}
                onChange={(e) => onChange({ [name]: e.target.value })}
            />
        </label>
    );
};

// TODO: html select
export const SelectInput = ({ name, id, description, value = '', onChange, options = [], onError, formData = {} }) => {
    return (
        <label>
            {description || `${name}: `}
            <select
                name={name}
                value={value}
                onChange={(e) => onChange({ [name]: e.target.value })}
            >
                {options.map(option => (<option value={option} key={option}>{option}</option>))}
            </select>
        </label>
    );
};

export const builtInComponents = {
    repeated: ListInput,
    string: TextInput,
    number: NumberInput,
    select: SelectInput,
}

export function findReactComponent({ type, customComponents = {}, constraint, options }){
    const directlyMatched = builtInComponents[type] || customComponents[type];
    if (directlyMatched) {
        return directlyMatched;
    }
    if (options) {
        return SelectInput;
    }
    switch (type) {
        // case 'string':
        //     return TextInput;
        // case 'number':
        //     return NumberInput;
        default:
            console.warn(`Component not found! Field specificated type "${type}" does not match to a built-in component, you can create your own one.`);
            return () => {};
    }
};


export default findReactComponent;
