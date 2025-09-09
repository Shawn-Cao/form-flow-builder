import React, { useState } from 'react';
import { denormalize } from '../form-spec-helper.js';
import { TextInput, NumberInput, BooleanInput, SelectInput } from  './form-ui-react-components.js';

const renderChildren = (form, orderedFields, formData, onChange, onKeyDown, onError) =>
    orderedFields.map((fieldSpec) => {
        const { name: formName, spec: formSpec, errors, components }  = form;
        const Component = findReactComponent(fieldSpec, components);
        const name = fieldSpec.name;
        const id = form.getFieldId(fieldSpec.name)
        return (
            <Component
                name={name}
                id={id}
                key={name}
                value={formData[name]}
                onChange={onChange}
                onKeyDown={onKeyDown}
                error={errors[name]}
                onError={onError}
                fieldSpec={fieldSpec}
                form={form}
                components={components}
            />
        );
    });

export const Paginator = ({ form, formData, onChange, onKeyDown, onError }) => {
    const { spec: formSpec, currentPageIndex, pageCount, errors }  = form;
    const [currentPage, setCurrentPage] = useState(currentPageIndex);
    const formFieldComponents = renderChildren(form, form.orderedFields, formData, onChange, onKeyDown, onError);
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

export const NestedInput = (props) => {
    const { fieldSpec: { description, fields }, name, value, id, onChange, onKeyDown, onError, idMapper, form } = props; 
    const { spec: formSpec, components, data: formData, currentPageIndex, pageCount, errors }  = form;
    const nestedFields = denormalize(fields);
    // TODO: 08/13 handle change for form.data.shoppingCart.productName (list of nested)
    

    const formFieldComponents = renderChildren(form, nestedFields, value ?? formData, onChange, onKeyDown, onError);
    return (
        <div id={id} className='form-group'>
            <p>{description || `${name}: `}</p>
            {formFieldComponents}
        </div>
    );  
};

export const ListInput = (props) => {
    const { fieldSpec, name, id, ref, value: listValue, onChange, onError, form } = props;
    const { repeat } = fieldSpec;
    const ChildComponent = findReactComponent({ type: repeat }, form.components);
    const [inputValue, setInputValue] = useState();
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            if (listValue && listValue.includes(inputValue)) {
                return;
            }
            const newValue = listValue ? [...listValue, inputValue] : [inputValue];
            setInputValue(undefined);
            onChange({ [name]: newValue });
        }
    }
    const handleChange = evt => {
        if (repeat === 'composite') {
            return setInputValue(Object.assign({}, inputValue, { [evt.target.name]: evt.target.value }));
        }
        return setInputValue(evt.target.value);
    }
    return (
        <div>
            <ChildComponent
                name={name}
                id={id}
                key={name}
                value={inputValue}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                ref={ref}
                error={form.errors[name]}
                onError={onError}
                fieldSpec={fieldSpec}
                form={form}
                components={form.components}
            />
            <ul>
                {listValue && listValue.map((item, index) => (
                    <li
                      key={`${item}-${index}`}
                      style={{borderColor: item===inputValue? 'red': 'black'}}
                    >
                        {JSON.stringify(item)}<sup onClick={() => onChange({ [name]: listValue.toSpliced(index, 1) })}>X</sup>
                    </li>
                ))}
            </ul>
        </div>
    );
}


export const builtInComponents = {
    composite: NestedInput,
    repeated: ListInput,
    string: TextInput,
    number: NumberInput,
    boolean: BooleanInput,
    select: SelectInput,
}

export const findReactComponent = ({ type, constraint, options }, customComponents = {}) => {
    const directlyMatched = builtInComponents[type] || customComponents[type];
    if (directlyMatched) {
        return directlyMatched;
    }
    if (options) {
        return builtInComponents.select;
    }
    switch (type) {
        case 'composite':
            return builtInComponents.composite;
        //   TODO: handle grouped input. eg. card.color & card.text
            // return ;
        case 'ID':
        case 'phoneNumber':
        case 'email':
            return builtInComponents.string;
        default:
            console.warn(`Component not found! Field specified type "${type}" does not match to a built-in component, you can create your own one.`);
            return () => {};
    }
};


export default Paginator;