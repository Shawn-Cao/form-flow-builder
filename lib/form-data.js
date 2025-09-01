import { initializeData, orderFields, customReferenceEvaluation } from './form-spec-helper.js';
import { validate } from './handlers.js';

// storage options: default to JS package storage in memory.
const forms = {};

// Deep merge object fields. Note: array items should be handled by the hosting component
const merge = (target, source) => {
  // Iterate through `source` properties and if an `Object` set property to merge of `target` and `source` properties
  for (const key of Object.keys(source)) {
    if (source[key] instanceof Object) Object.assign(source[key], merge(target[key], source[key]))
  }

  // Join `target` and modified `source`
  Object.assign(target || {}, source)
  return target
}

/**
 * a "Form" object holds the live form in action.
 * Utility functions are attached to this object to access form spec and data
 * source of truth when working with other stateful libraries like react
 */
export class Form {
  constructor(spec, customization = {} ) {
    this.spec = spec ?? {};
    const { name, data, components, idMapper } = customization;
    this.data = initializeData(spec, data);
    this.name = name || 'form-flow-builder';
    this.components = components;
    this.idMapper = idMapper;
    this.currentPageIndex = 0;  // TODO: browser refresh should maintain the page number
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
        ...fieldSpec,
      }
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
    return this.idMapper?.(fieldName) || `form-${this.name}-${fieldName}`
  }

  evaluate(config) {
    if (typeof config === 'function') {
        return config(this.data);
    }
    if (typeof config === 'string') { // Need a mini DSL string for JSON or YAML config
        return customReferenceEvaluation(config, this.data);
    }
    return config
  }

  // event handlers
  handleChange(event) {
    const name = event.target.name;
    const value = event.target.value;
    console.log('event: ', name, value, event);
    // TODO: handle names that are not at the top level... for nested fields, we use parent node? -> we should bubble and handle and parent node!
    // console.log('event: ', event, name, value);
    // mutate data
    merge(this.data, { [name]: value });
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
        console.error("form submit handler errors:", errors)
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

export default Form;
