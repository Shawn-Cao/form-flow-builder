import { initializeData, orderFields } from './form-spec-helper.js';
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
  constructor(spec, data, name = 'form-flow-builder') {
    this.spec = spec ?? {};
    this.data = initializeData(spec, data);
    this.name = name;
    forms[name] = this; // TODO: support browser storage (or even remote persistence?)
  }

  get orderFields() {
    return orderFields(this.spec, this.data);
  }

  get errors() {
    return validate(this.spec, this.data);
  }

  static get(name = 'form-flow-builder') {
    // if (!forms[name]) {
    //   console.info('Form with name "', name, '" not found!');
    // }
    return forms[name];
  }
  static clear(name = 'form-flow-builder') {
    delete forms[name];
  } 

  change(event) {
    const name = event.target.name;
    const value = event.target.value;
    merge(this.data, { [name]: value });
    // if (this.persist?) { send to API; }
    if (process.env !== 'PRODUCTION') {
      console.info('===> form field changed: ["', name, '"], changed value to: "', value, '". new form data: ', this.data, "errors: ", this.errors);
    }
    return this.data;
  }
}

export default Form;
