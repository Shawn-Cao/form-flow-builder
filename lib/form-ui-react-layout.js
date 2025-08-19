import React, { useState } from 'react';
import { denormalize } from './form-spec-helper';
import { TextInput, NumberInput, BooleanInput, SelectInput } from  './form-ui-react-components.js';

const renderChildren = (form, orderedFields, formData, onChange, onError) => orderedFields.map((fieldSpec) => {
    const { name: formName, spec: formSpec, errors, components }  = form;
    const Component = findReactComponent(fieldSpec);
    const name = fieldSpec.name;
    const id = form.getFieldId(fieldSpec.name)
    return (
        <Component
            name={name}
            id={id}
            key={name}
            value={formData[name]}
            onChange={onChange}
            error={errors[name]}
            onError={onError}
            fieldSpec={fieldSpec}
            form={form}
            components={components}
        />
    );
});

export const Paginator = ({ form, formData, onChange, onError }) => {
    console.log('paginator accepted formData, ', formData);
    const { spec: formSpec, currentPageIndex, pageCount, errors }  = form;
    const [currentPage, setCurrentPage] = useState(currentPageIndex);
    const orderedFields = form.orderedFields;
    const formFieldComponents = renderChildren(form, form.orderedFields, formData, onChange, onError);
    if (pageCount === 1) {
        return (
            <div>
                {formFieldComponents}
                <div className={errors['__root'] ? "error active" : "error"} aria-live="polite">{errors['__root']}</div>
                <div><input type="submit" value="Submit" /></div>
            </div>
        );
    }
    const nextHandler = (event) => {
        const errors = form.errors;
        if (!Object.keys(errors).length) {
            setCurrentPage(form.handleNext());
        }
    };
    const previousHandler = (event) => setCurrentPage(form.handlePrevious());
    return (
        <div>
          {formFieldComponents}
          <div className={errors['__root'] ? "error active" : "error"} aria-live="polite">{errors['__root']}</div>
          <div className='form-control'>
            {currentPage > 0  && <button type='button' onClick={previousHandler}>Previous</button>}
            {currentPage !== (pageCount - 1) && <button type='button' disabled={!!Object.keys(errors).length} onClick={nextHandler}>Next</button>}
            {currentPage === (pageCount - 1) && <input type="submit" value="Submit" />}
          </div>
        </div>
    )
};

// eg. shoppingCart: {
//     type: 'repeated', // a list with add/review/remove buttons 
//     fields: {
//         itemName: { type: 'string' },
//         SKU: { type: 'id', readOnly: true }, 
//         price: { type: 'number', constraints: { min: 0 } },
//         notes: { type: 'string' },
//     }
// },
export const NestedInput = (props) => {
    const { fieldSpec: { description, fields }, name, id, onChange, onError, idMapper, form } = props; 
    const { spec: formSpec, components, data: formData, currentPageIndex, pageCount, errors }  = form;
    const nestedFields = denormalize(fields);
    // TODO: 08/13 handle change for form.data.shoppingCart.itemName
    

    const formFieldComponents = renderChildren(form, nestedFields, formData, onChange, onError);
    return (
        <div id={id} className='form-group'>
            <p>{description || `${name}: `}</p>
            {formFieldComponents}
        </div>
    );  
};

export const ListInput = (props) => {
    const { name, value = [], form: { fields }, onChange, id, formData = {} } = props;
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
        case 'composite':
            return NestedInput;
        //   TODO: handle grouped input. eg. card.color & card.text
            // return ;
        case 'ID':
        case 'phoneNumber':
        case 'email':
            return TextInput;
        default:
            console.warn(`Component not found! Field specified type "${type}" does not match to a built-in component, you can create your own one.`);
            return () => {};
    }
};


export default findReactComponent;