import { initializeData, orderFields, customReferenceEvaluation, isValueEvent, merge } from './form-spec-helper.js';
import { validate } from './handlers.js';
import { forms, storage } from './storage.js';


/**
 * a "Form" object holds the live form in action.
 * Utility functions are attached to this object to access form spec and data
 * source of truth when working with other stateful libraries like react
 */
export class Form {
  constructor(spec, customization = {}) {
    this.spec = spec ?? {};
    const { name = 'form-flow-builder', data, components, idMapper, persistData = true } = customization;
    this.name = name;
    this.data = initializeData(spec, data);
    this.components = components;
    this.idMapper = idMapper;
    this.currentPageIndex = 0;  // TODO: browser refresh should maintain the page number. TODO: support page by name
    // the live form is cached in memory, and form data is persisted on change
    forms[this.name] = this;
    if (persistData) {
      Object.assign(this.data, storage.getFormData(this.name));
    }
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

  // static forms cache.
  static get(name = 'form-flow-builder') {
    if (process.env !== 'PRODUCTION' && !forms[name]) {
      console.info('Form with name "', name, '" not found!');
    }
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
  handleChange(eventOrNewValue) {
    const newData = isValueEvent(eventOrNewValue) ? { [eventOrNewValue.target.name]: eventOrNewValue.target.value } : eventOrNewValue;
    console.log('event or new value: ', eventOrNewValue, 'updating data: ', newData);
    // TODO: handle names that are not at the top level... for nested fields, we use parent node? -> we should bubble and handle and parent node!
    // console.log('event: ', event, name, value);
    // mutate data
    merge(this.data, newData);
    // if (this.persist?) { send to API; }
    if (process.env !== 'PRODUCTION') {
      console.info('===> form field changed. Received:', newData, '. Original data: ', this.data, '. Errors: ', this.errors);
    }
    if (persistData) {
      storage.saveForm(this);
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
