import { Form } from '../form-data';
import { SubmitButton, handleSubmit } from './form-ui-html-layout';
import { TextInput, NumberInput } from './form-ui-html-components';

export const builtInComponents = {
    // TODO: implement others
    // composite: NestedInput,
    // repeated: ListInput,
    string: TextInput,
    number: NumberInput,
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
            return builtInComponents.string;
    }
};


export const formFLowBuilder =  {
  build: (formSpec, options = {}) => {
    options.components = {
      ...builtInComponents,
      ...options.components,
    }
    const form = Form.get(options.name) ?? new Form(formSpec, options);
    return form;
  },
  // TODO: use something like https://github.com/ryansolid/dom-expressions/tree/main/packages/babel-plugin-jsx-dom-expressions for better expressiveness
  render: (form, formSelector) => {
    const formElement = document.querySelector(formSelector);
    console.log('form root', formElement, 'fields ', form.orderedFields);
    form.orderedFields.forEach(fieldSpec => {
      const { type, name } = fieldSpec;
      const component = findComponent(fieldSpec); 
      const id = form.getFieldId(name);
      const formData = form.data = {};
      // NOTE: decide if we should make it React-like declarative call?
      const fieldElement = component({ fieldSpec, name, id, value: formData[name], errors: form.errors})
      formElement.appendChild(fieldElement);
    });
    // TODO: append layout element which contains submit button, plus pagination & navigation buttons
    formElement.appendChild(SubmitButton());
    // NOTE: HTML native event is used to handle change and submit.
    // TODO: Should we provide options to handle change like in the react ui?
    //   getting data and managing tracking should already work through form 
    // formElement.addEventListener('change');
    formElement.addEventListener('submit', handleSubmit);
  },
  clear: (formSelector) => {
    const formElement = document.querySelector(formSelector);
    formElement.replaceChildren();
  },
};


export { Form, formFLowBuilder as FormHTML };

export default formFLowBuilder;