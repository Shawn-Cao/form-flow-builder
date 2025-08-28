// @global 

// NOTE: this file is not used. I'm jus thinking to write a simple JSX to HTML mapper for plain HTML. Should be better to find a good library for that.
// TODO: move this to package root when a build script is set up
import jsYaml from 'js-yaml';

// TODO: support custom components (with dynamic import?)
import * as components from './components.js';


export const parse = (yaml) => {
    const jsonSchema = jsYaml.load(yaml);
    console.info('parsed yaml: ', jsonSchema);
    return jsonSchema;
};

export const createNode = (schema) => {
    let componentType;
    if (typeof schema === 'string') {
        componentType = schema;
    } else if (schema.type) {
        componentType = schema.type;
    } else {
        componentType = 'text';
    }
    if (!components[componentType] || typeof components[componentType] !== 'function') {
        console.warn(`requested component with type ${componentType} is not provided, rendering as text`);
        componentType = 'text';
    }
    // TODO: support nested fields and pagination
    return components[componentType](schema);
}

export const buildTree = (form, schema) => {
    const fields = schema.fields
       .map(createNode)
       .forEach(node => form.appendChild(node));
    return fields;
}

export const build = (schema) => {
    const form = components.form();
    if (!schema.fields) { return; }
    if (!schema.fields.map) {
        console.warn(`Schema fields should be an array, got ${schema.fields} instead. Skipping`);
        return;
    }
    buildTree(form, schema);
    return form;
}


export const attachHtml = (elementId, html) => {
    const element = window.document.getElementById(elementId);
    if (!element || element.childElementCount != 0) {
        throw(`HTML element with ID ${elementId} not found or is not empty`);
    }
    element.appendChild(html);
}

export const render = (elementId, yaml) => {
    const jsonSchema = parse(yaml);
    const html = build(jsonSchema);
    attachHtml(elementId, html);
}

export default render;
