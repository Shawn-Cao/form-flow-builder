/**
 * JSON spec use {[name]: {...fields}} format to improve readability by reducing nesting
 * This utility method converts them back to be used in the library's internal logic
 */
const denormalize = spec => Object.entries(spec).map(([fieldName, fieldSpec]) => ({
  name: fieldName,
  ...fieldSpec
}));

/**
 * Transform specified fields from map form to nested arrays.
 * formData may be used to determine order
 */
const orderFields = (formSpec, formData) => {
  if (typeof formSpec?.fields !== 'object') {
    console.log("Error! Expect the form to specify fields as a map.");
    return [];
  }
  // TODO: decide to support ordering here or during pagination (eg. !formSpec.order || !formSpec.routing)
  // single page no order specification: use object fields order
  if (!formSpec.order || !formSpec.routing) {
    // TODO: nested fields should have name as `$(parent}-${child}...` => for list items
    return denormalize(formSpec.fields);
  }
};

/**
 * 
 * @param formSpec:  fields
 * @param initialData: optional data that are pre-filled for the form
 * NOTE: we should differentiate default data from no-input, vs user viewed data.
 *   This is because in mission critical projects, data should be seen by the user in order to be considered valid (reviewed).
 *   Hence any not pre-filled fields are initialized to undefined.
 */
const initializeData = (formSpec, initialData = {}) => {
  if (typeof formSpec?.fields !== 'object') {
    console.error('Error! Expect a valid form specification with fields as map');
    return;
  }
  const data = initialData;
  Object.entries(formSpec.fields).forEach(([fieldName, fieldSpec]) => {
    data[fieldName] = data[fieldName] ?? fieldSpec.defaultValue;
  });
  return data;
};

/**
 * Typical validators. Their names are used in form specifications.
 * Demo a few for now
 * TODO: try align with HTML specs, eg https://developer.mozilla.org/en-US/docs/Web/API/ValidityState
 */
const max = (numberValue, maxValue) => numberValue > maxValue ? "max value exceeded" : undefined;
const min = (numberValue, minValue) => numberValue < minValue ? "min value not reached" : undefined;
const maxLength = (stringValue, length) => stringValue.length > length ? "string length too long" : undefined;
const minLength = (stringValue, length) => stringValue.length > length ? "string length too short" : undefined;
const validators = {
  max,
  min,
  maxLength,
  minLength
};

/*
 * Event handlers form submit, validation, and navigation for multi-page forms
 */


/**
 * validation(onChange) is where a DSL is needed. For now we can just support a few and let the DSL evolve.
 * @returns {} for passed, {[name]: error} for each failure
 */
const validate = (formSpec, formData) => {
  // 1. validate each fields' own constraints
  const errors = {};
  Object.entries(formSpec.fields || {}).forEach(([fieldName, spec]) => spec?.constraints && Object.entries(spec.constraints).forEach(([constraintName, constraintValue]) => {
    const fieldError = validators[constraintName]?.(formData[fieldName], constraintValue);
    if (fieldError) {
      errors[fieldName] = errors[fieldName] ? `${errors[fieldName]} ${fieldError}` : fieldError;
    }
  }));
  // 2. cross validation, errors at the root
  if (typeof formSpec.validation === 'function') {
    const crossValidationError = formSpec.validation(formData);
    if (crossValidationError) {
      errors["__root"] = crossValidationError;
    }
  }
  return errors;
};

// storage options: default to JS package storage in memory.
const forms = {};

// Deep merge object fields. Note: array items should be handled by the hosting component
const merge = (target, source) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]));
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source);
  return target;
};

/**
 * a "Form" object holds the live form in action.
 * Utility functions are attached to this object to access form spec and data
 * source of truth when working with other stateful libraries like react
 */
class Form {
  constructor(spec, customization = {}) {
    this.spec = spec ?? {};
    const {
      name,
      data,
      components,
      idMapper
    } = customization;
    this.data = initializeData(spec, data);
    this.name = name || 'form-flow-builder';
    this.components = components;
    this.idMapper = idMapper;
    this.currentPageIndex = 0; // TODO: browser refresh should maintain the page number
    forms[this.name] = this; // TODO: support browser storage (or even remote persistence?)
  }

  // derived field getters
  get pageCount() {
    return Object.keys(this.spec.pages || [1]).length;
  }
  get errors() {
    return validate(this.spec, this.data);
  }

  // get orderFields on current page
  get orderedFields() {
    const currentPageFieldNames = this.spec.pages && Object.values(this.spec.pages).map(pageSpec => pageSpec.fields)[this.currentPageIndex];
    if (!currentPageFieldNames) {
      return orderFields(this.spec, this.data);
    }
    return currentPageFieldNames.map(fieldName => {
      const fieldSpec = this.spec.fields[fieldName];
      return {
        name: fieldName,
        ...fieldSpec
      };
    });
  }

  // global form cache. TODO: move to forms/cache module
  static get(name = 'form-flow-builder') {
    // if (!forms[name]) {
    //   console.info('Form with name "', name, '" not found!');
    // }
    return forms[name];
  }
  static clear(name = 'form-flow-builder') {
    delete forms[name];
  }

  // utility methods
  getFieldId(fieldName) {
    return this.idMapper?.(fieldName) || `form-${this.name}-${fieldName}`;
  }

  // event handlers
  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    console.log('event: ', name, value, event);
    // TODO: handle names that are not at the top level... for nested fields, we use parent node? -> we should bubble and handle and parent node!
    // console.log('event: ', event, name, value);
    // mutate data
    merge(this.data, {
      [name]: value
    });
    // if (this.persist?) { send to API; }
    if (process.env !== 'PRODUCTION') {
      console.info('===> form field changed: ["', name, '"], changed value to: "', value, '". new form data: ', this.data, "errors: ", this.errors);
    }
    return this.data;
  }
  handleSubmit(event) {
    event.preventDefault(); // still propagate the event
    console.log('Submitting form: ', this.data);
    // TODO: reportValidity() for ARIA from https://developer.mozilla.org/en-US/docs/Learn_web_development/Extensions/Forms/Form_validation#validating_forms_using_javascript
    if (Object.keys(this.errors).length) {
      console.error("form submit handler errors:", errors);
      return false;
    }
    return true;
  }
  handleNext() {
    this.currentPageIndex += 1;
    return this.currentPageIndex;
  }
  handlePrevious() {
    this.currentPageIndex -= 1;
    return this.currentPageIndex;
  }
}

// functional style HTML components


// plain HTML text input https://www.w3schools.com/html/html_form_input_types.asp
const TextInput = ({
  name,
  id,
  required,
  value,
  onChange,
  error = "",
  fieldSpec: {
    description,
    defaultValue,
    placeholder,
    readOnly
  }
}) => {
  if (!value && defaultValue) {
    value = defaultValue;
  }
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id
  }, /*#__PURE__*/React.createElement("span", null, description || `${name}: `), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    name: name,
    id: id,
    type: "text",
    "aria-label": name,
    required: required,
    placeholder: placeholder,
    disabled: readOnly,
    value: value,
    onChange: onChange
  }), /*#__PURE__*/React.createElement("span", {
    className: error ? "error active" : "error",
    "aria-live": "polite"
  }, error));
};

// NOTE: how to manage widgets live using plain JS? No support for now

const builtInComponents = {
  // composite: NestedInput,
  // repeated: ListInput,
  string: TextInput
  // number: NumberInput,
  // boolean: BooleanInput,
  // select: SelectInput,
};
const findComponent = ({
  type,
  constraint,
  options
}, customComponents = {}) => {
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
const formFLowBuilder = {
  build: (formSpec, options = {}) => {
    options.components = {
      ...builtInComponents,
      ...options.components
    };
    const form = Form.get(options.name) ?? new Form(formSpec, options);
    return form;
  },
  render: (rootSelector, form) => {
    document.querySelector(rootSelector);
    console.log('fields ', form.orderedFields);
    form.orderedFields.forEach(fieldSpec => {
      const {
        type,
        name
      } = fieldSpec;
      const component = findComponent(fieldSpec);
      const id = form.getFieldId(name);
      const formData = form.data = {};
      // NOTE: decide if we should make it React-like declarative call?
      return component.call(form, {
        name,
        id,
        value: formData[name],
        errors: form.errors
      });
    });
  }
};

export { Form, builtInComponents, formFLowBuilder as default, formFLowBuilder };
