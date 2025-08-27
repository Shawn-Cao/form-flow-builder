'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');

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

// NOTE: react component should be plain and decoupled as much as possible
// the form supports using either/both uncontrolled and controlled input

// plain HTML text input https://www.w3schools.com/html/html_form_input_types.asp
const TextInput = ({
  name,
  id,
  value,
  onChange,
  error = "",
  fieldSpec: {
    description,
    defaultValue,
    placeholder,
    required,
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

// plain HTML number input
const NumberInput = ({
  name,
  id,
  value,
  onChange,
  error = "",
  fieldSpec: {
    description,
    defaultValue = 0,
    required
  }
}) => {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id
  }, /*#__PURE__*/React.createElement("span", null, description || `${name}: `), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("input", {
    name: name,
    id: id,
    type: "number",
    "aria-label": name,
    required: required,
    value: value ?? defaultValue,
    onChange: onChange
  }), /*#__PURE__*/React.createElement("span", {
    className: error ? "error active" : "error",
    "aria-live": "polite"
  }, error));
};
const BooleanInput = ({
  name,
  id,
  value = '',
  onChange,
  error = "",
  fieldSpec: {
    description,
    options = [],
    required
  }
}) => {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id
  }, /*#__PURE__*/React.createElement("span", null, description || `${name}: `), /*#__PURE__*/React.createElement("input", {
    type: "checkbox",
    name: name,
    id: id,
    checked: value,
    onChange: onChange
  }), /*#__PURE__*/React.createElement("span", {
    className: error ? "error active" : "error",
    "aria-live": "polite"
  }, error));
};
const SelectInput = ({
  name,
  id,
  value = '',
  onChange,
  error = "",
  fieldSpec: {
    description,
    options = [],
    required
  }
}) => {
  return /*#__PURE__*/React.createElement("label", {
    htmlFor: id
  }, /*#__PURE__*/React.createElement("span", null, description || `${name}: `), /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("select", {
    name: name,
    id: id,
    required: required,
    value: value,
    onChange: onChange
  }, options.map(option => /*#__PURE__*/React.createElement("option", {
    value: option,
    key: option
  }, option))), /*#__PURE__*/React.createElement("span", {
    className: error ? "error active" : "error",
    "aria-live": "polite"
  }, error));
};

const renderChildren = (form, orderedFields, formData, onChange, onError) => orderedFields.map(fieldSpec => {
  const {
    name: formName,
    spec: formSpec,
    errors,
    components
  } = form;
  const Component = findReactComponent(fieldSpec);
  const name = fieldSpec.name;
  const id = form.getFieldId(fieldSpec.name);
  return /*#__PURE__*/React.createElement(Component, {
    name: name,
    id: id,
    key: name,
    value: formData[name],
    onChange: onChange,
    error: errors[name],
    onError: onError,
    fieldSpec: fieldSpec,
    form: form,
    components: components
  });
});
const Paginator = ({
  form,
  formData,
  onChange,
  onError
}) => {
  console.log('paginator accepted formData, ', formData);
  const {
    spec: formSpec,
    currentPageIndex,
    pageCount,
    errors
  } = form;
  const [currentPage, setCurrentPage] = React.useState(currentPageIndex);
  form.orderedFields;
  const formFieldComponents = renderChildren(form, form.orderedFields, formData, onChange, onError);
  if (pageCount === 1) {
    return /*#__PURE__*/React.createElement("div", null, formFieldComponents, /*#__PURE__*/React.createElement("div", {
      className: errors['__root'] ? "error active" : "error",
      "aria-live": "polite"
    }, errors['__root']), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("input", {
      type: "submit",
      value: "Submit"
    })));
  }
  const nextHandler = event => {
    const errors = form.errors;
    if (!Object.keys(errors).length) {
      setCurrentPage(form.handleNext());
    }
  };
  const previousHandler = event => setCurrentPage(form.handlePrevious());
  return /*#__PURE__*/React.createElement("div", null, formFieldComponents, /*#__PURE__*/React.createElement("div", {
    className: errors['__root'] ? "error active" : "error",
    "aria-live": "polite"
  }, errors['__root']), /*#__PURE__*/React.createElement("div", {
    className: "form-control"
  }, currentPage > 0 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    onClick: previousHandler
  }, "Previous"), currentPage !== pageCount - 1 && /*#__PURE__*/React.createElement("button", {
    type: "button",
    disabled: !!Object.keys(errors).length,
    onClick: nextHandler
  }, "Next"), currentPage === pageCount - 1 && /*#__PURE__*/React.createElement("input", {
    type: "submit",
    value: "Submit"
  })));
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
const NestedInput = props => {
  const {
    fieldSpec: {
      description,
      fields
    },
    name,
    id,
    onChange,
    onError,
    idMapper,
    form
  } = props;
  const {
    spec: formSpec,
    components,
    data: formData,
    currentPageIndex,
    pageCount,
    errors
  } = form;
  const nestedFields = denormalize(fields);
  // TODO: 08/13 handle change for form.data.shoppingCart.itemName

  const formFieldComponents = renderChildren(form, nestedFields, formData, onChange, onError);
  return /*#__PURE__*/React.createElement("div", {
    id: id,
    className: "form-group"
  }, /*#__PURE__*/React.createElement("p", null, description || `${name}: `), formFieldComponents);
};
const ListInput = props => {
  const {
    name,
    value = [],
    form: {
      fields
    },
    onChange,
    id,
    formData = {}
  } = props;
  const [newItem, setNewItem] = React.useState({});
  const listIdMapper = (childName, index) => `${name}-${childName}-${index}`;
  console.log('ListItem props: ', props);
  const children = renderChildren({
    ...props,
    formSpec: {
      fields
    },
    idMapper: props.idMapper || listIdMapper
  }, newItem);
  return /*#__PURE__*/React.createElement("div", null, children, /*#__PURE__*/React.createElement("button", {
    onClick: () => {}
  }, "Add"), /*#__PURE__*/React.createElement("ul", null, value.map(item => /*#__PURE__*/React.createElement("li", null, JSON.stringify(item, null, 2)))));
};
const builtInComponents = {
  composite: NestedInput,
  repeated: ListInput,
  string: TextInput,
  number: NumberInput,
  boolean: BooleanInput,
  select: SelectInput
};
function findReactComponent({
  type,
  constraint,
  options
}, customComponents = {}) {
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
}

const useForm = (formSpec, components, data, formName, idMapper) => {
  const form = Form.get(formName) ?? new Form(formSpec, {
    name: formName,
    data,
    components,
    idMapper
  });
  // NOTE: a copy of form data is kept in React for change detection
  const [formData, setFormData] = React.useState(form.data);

  // allows data override through parent data change
  const [lastFormSpec, setLastFormSpec] = React.useState(formSpec);
  if (lastFormSpec !== formSpec) {
    console.log('Form specs changes, resetting form!');
    setLastFormSpec(formSpec);
    Form.clear(formName);
  }
  // TODO: think about this when/if other places needs setData
  // const [data, setReactData] = useState(form.data);
  // const setData = (data) => {
  //     form.data = data; 
  //     setReactData(data);
  // };
  return {
    form,
    data: formData,
    setData: setFormData,
    errors: form.errors
  };
};

/**
 * @param props.formSpec: form specifications as an object
 * @param props.components - custom components, overrides built-in ones
 * @param props.data initial data - optional, default to {}
 * @param props.onChange - change handler. Components should pass changed field name like {[name]: e.target.value}
 * @param props.onSubmit submit button handler - validation runs before
 * @param props.onError optional external error handlder.
 * @param props.validateOnSubmit default true
 * @param props.validateOnChange default true (TODO: default to onBlur?)
 */
const FormReact = props => {
  // forms.errors: {[field-name]: error, "form": error}
  const {
    form: liveForm,
    data: formData,
    setData: setFormData,
    errors
  } = useForm(props.formSpec, props.components, props.data, props.formName, props.idMapper);

  // allows data override through parent data change
  const [lastPropsData, setLastPropsData] = React.useState(props.data);
  if (lastPropsData !== props.data) {
    console.log('External data changed! Overriding corresponding form data fields.');
    setLastPropsData(props.data);
    setFormData({
      ...formData,
      ...props.data
    });
  }

  // React components shares the same form provided event handler
  const changeHandler = event => {
    const newFormData = liveForm.handleChange(event);
    props.validateOnChange && props.onError?.(liveForm.errors);
    // new object to notify React for change
    setFormData({
      ...newFormData
    });
    return props.onChange?.(newFormData);
  };
  const submitHandler = event => {
    const isFormValid = liveForm.handleSubmit(event);
    return isFormValid && props?.onSubmit(formData);
  };
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: submitHandler
  }, /*#__PURE__*/React.createElement(Paginator, {
    form: liveForm,
    formData: formData,
    onChange: changeHandler
  }));
};

exports.FormReact = FormReact;
exports.default = FormReact;
exports.useForm = useForm;
