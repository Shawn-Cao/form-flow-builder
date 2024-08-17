// @global 


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
    let componentName;
    if (typeof schema === 'string') {
        componentName = schema;
    } else if (schema.name) {
        componentName = schema.name;
    } else {
        componentName = 'text';
    }
    if (!components[componentName] || typeof components[componentName] !== 'function') {
        console.warn(`desired component with name ${componentName} is not provided, rendering as text`);
        componentName = 'text';
    }
    // TODO: support nested fields and pagination
    return components[componentName](schema);
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
