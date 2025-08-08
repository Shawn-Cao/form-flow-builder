import { initializeData, orderFields } from './form-spec-helper.js';
import { validate } from './handlers.js';

// storage options: default to JS package storage in memory.
const forms = {};

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

  // TODO: support deep merge
  // TODO: support list items merge
  change(event) {
    const name = event.target.name;
    const value = event.target.value;
    this.data[name] = value;
    // if (this.persist?) { send to API; }
    if (process.env !== 'PRODUCTION') {
      console.info('===> form field changed: ["', name, '"], changed value to: "', value, '". new form data: ', this.data, "errors: ", this.errors);
    }
    return this.data;
  }
}

export default Form;
