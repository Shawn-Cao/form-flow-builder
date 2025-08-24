import { Form } from '../form-data';
import { TextInput } from './form-ui-html-components';

export const builtInComponents = {
    // composite: NestedInput,
    // repeated: ListInput,
    string: TextInput,
    // number: NumberInput,
    // boolean: BooleanInput,
    // select: SelectInput,
}

const findComponent = ({ type, constraint, options }, customComponents = {}) => {
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

const render = (form, component, parentElement) => {
  const component = component(args);
  parentElement.appendChild(component);
} 

export const formFLowBuilder =  {
  build: (formSpec, options = {}) => {
    options.components = {
      ...builtInComponents,
      ...options.components,
    }
    const form = Form.get(options.name) ?? new Form(formSpec, options);
    return form;
  },
  render: (form, rootSelector) => {
    const root = document.querySelector(rootSelector);
    console.log('fields ', form.orderedFields);
    form.orderedFields.forEach(fieldSpec => {
      const { type, name } = fieldSpec;
      const component = findComponent(fieldSpec); 
      const id = form.getFieldId(name);
      const formData = form.data = {};
      // NOTE: decide if we should make it React-like declarative call?
      return component.call(form, { name, id, value: formData[name], errors: form.errors})
    });
  },
};

// const renderChildren = (form, orderedFields, formData, onChange, onError) => orderedFields.map((fieldSpec) => {
//     const { name: formName, spec: formSpec, errors, components }  = form;
//     const Component = findReactComponent(fieldSpec);
//     const name = fieldSpec.name;
//     const id = form.getFieldId(fieldSpec.name)
//     return (
//         <Component
//             name={name}
//             id={id}
//             key={name}
//             value={formData[name]}
//             onChange={onChange}
//             error={errors[name]}
//             onError={onError}
//             fieldSpec={fieldSpec}
//             form={form}
//             components={components}
//         />
//     );
// });

export { Form };

export default formFLowBuilder;