import React, { useState } from 'react';

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

/**
 * Transform specified fields from map form to nested arrays.
 * formData may be used to determine order
 */
const orderFields = (formSpec, formData) => {
  if (typeof formSpec?.fields !== 'object') {
    console.log("Error! Expect the form to specify fields as a map.");
    return [];
  }
  // single page no order specification: use object fields order
  if (!formSpec.order || !formSpec.routing) {
    return Object.entries(formSpec.fields).map(([fieldName, fieldSpec]) => ({
      name: fieldName,
      ...fieldSpec
    }));
  }
};

/**
 * 
 * @param formSpec:  fields
 * @param initialData: optional data that are preknown
 * NOTE: we should differentiate default data from no-input, vs user viewed data.
 *   This is because in mission critical projects, data should be seen by the user first to be valid (reviewed).
 */
const initializeData = (formSpec, initialData) => {
  const data = initialData ?? {};
  if (typeof formSpec?.fields === 'object') {
    Object.entries(formSpec.fields).forEach(([fieldName, fieldSpec]) => {
      data[fieldName] = data[fieldName] ?? fieldSpec.defaultValue;
    });
  }
  return data;
};

/**
 * Typical validators. Their names are used in form specifications.
 * Demo a few for now
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
 * Handles form submit, validation, and navigation for multi-page forms
 */


// tools functions
const mergeErrors = (errors, error) => error ? (errors.push(error), errors) : errors;

/**
 * validation(onChange) is where a DSL is needed. For now we can just support own field validation and let the DSL evolve.
 * @returns undefined for passed, Array<errors> for each failure
 */
const validate = (formSpec, formData) => {
  // 1. validate each fields' own constraints
  const errors = Object.entries(formSpec.fields || {}).map(([fieldName, spec]) => {
    if (spec?.constraints) {
      return Object.entries(spec.constraints).map(([constraintName, constraintValue]) => validators[constraintName]?.(formData[fieldName], constraintValue)).reduce(mergeErrors, []);
    }
    return undefined;
  }).reduce(mergeErrors, []);
  // 2. cross validation
  if (typeof formSpec.validation === 'function') {
    const crossValidationErrors = formSpec.validation(formData);
    if (crossValidationErrors) {
      errors.concat(crossValidationErrors);
    }
  }
  return errors.length ? errors.flat() : undefined;
};

const Paginator = ({
  childern
}) => {
  return /*#__PURE__*/React.createElement("div", null, childern, /*#__PURE__*/React.createElement("button", {
    onClick: () => {}
  }, "Next"));
};

// plain HTML text input https://www.w3schools.com/html/html_form_input_types.asp
const TextInput = ({
  name,
  description,
  value = '',
  onChange,
  error,
  formData = {}
}) => {
  return /*#__PURE__*/React.createElement("label", null, description || `${name}: `, /*#__PURE__*/React.createElement("input", {
    name: name,
    type: "text",
    "aria-label": name,
    value: value,
    onChange: e => onChange({
      [name]: e.target.value
    })
  }));
};

// plain HTML number input
const NumberInput = ({
  name,
  description,
  value = 0,
  onChange,
  onError,
  formData = {}
}) => {
  return /*#__PURE__*/React.createElement("label", null, description || `${name}: `, /*#__PURE__*/React.createElement("input", {
    name: name,
    type: "number",
    "aria-label": name,
    value: value,
    onChange: e => onChange({
      [name]: e.target.value
    })
  }));
};

// TODO: html select
const SelectInput = ({
  name,
  description,
  value = '',
  onChange,
  options = [],
  onError,
  formData = {}
}) => {
  return /*#__PURE__*/React.createElement("label", null, description || `${name}: `, /*#__PURE__*/React.createElement("select", {
    name: name,
    value: value,
    onChange: e => onChange({
      [name]: e.target.value
    })
  }, options.map(option => /*#__PURE__*/React.createElement("option", {
    value: option,
    key: option
  }, option))));
};
const findReactComponent = ({
  type,
  constraint,
  options
}) => {
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
};

/**
 * TODO: set up compiling lib module so create-react-app work out-of-the-box. developing right here first
 */

/**
 * @param props.formSpec: form specifications as an object
 * @param props.components - custom components, overrides built-in ones
 * @param props.data initial data - optional, default to {}
 * @param props.onChange - change handler. Components should pass changed field name like {[name]: e.target.value}
 * @param props.onSubmit submit button handler - validation runs before
 * @param props.onError optional external error handlder.
 */
const Form = props => {
    console.log('react version: ', React.version, ', useState: ', React.useState);
  const [formData, setFormData] = useState(initializeData(props.formSpec, props.data));
  // allows data override through parent data change
  const [lastPropsData, setLastPropsData] = useState(props.data);
  if (lastPropsData !== props.data) {
    console.log('External data changed! Overriding corresponding form data fields.');
    setLastPropsData(props.data);
    setFormData({
      ...formData,
      ...props.data
    });
  }

  // for performance, field component should emit events with field {name:value}
  const changeHandler = fieldData => {
    console.log('onchange field data: ', fieldData, 'formData:', formData);
    const newFormData = {
      ...formData,
      ...fieldData
    };
    console.log('new form data: ', newFormData);
    setFormData(newFormData); // TODO: support deep merge
    return props?.onChange?.(newFormData);
  };
  const orderedFields = orderFields(props.formSpec);
  const components = orderedFields.map(fieldSpec => {
    const Component = props.components?.[fieldSpec.type] || findReactComponent(fieldSpec);
    const name = fieldSpec.name;
    return /*#__PURE__*/React.createElement(Component, _extends({}, fieldSpec, {
      key: name,
      value: formData[name],
      onChange: changeHandler,
      formData: formData
    }));
  });
  const submitHandler = event => {
    event.preventDefault(); // still propagate the event
    const errors = validate(formData);
    if (errors) {
      // TODO: display error and return unsubmitted;
      return;
    }
    return props.onSubmit ? props.onSubmit(formData) : console.log(formData);
  };
  const isMultiPage = props.formSpec.pages;
  if (isMultiPage) {
    return /*#__PURE__*/React.createElement("form", {
      onSubmit: submitHandler
    }, /*#__PURE__*/React.createElement(Paginator, null, components, /*#__PURE__*/React.createElement("input", {
      type: "submit"
    })));
  }
  return /*#__PURE__*/React.createElement("form", {
    onSubmit: submitHandler
  }, components, /*#__PURE__*/React.createElement("input", {
    type: "submit"
  }));
};

const ReactForm = Form;

export { ReactForm };
