// TODO: move this to package root when a build script is set up
// @global 
import jsYaml from '/lib/js-yaml.js';
// import jsYaml from 'js-yaml';

const builder = {};

builder.parse = (yaml) => {
    console.log('parsing yaml: ', yaml);
    jsYaml.load(yaml);
};

builder.build = (html) => html;

builder.attachHtml = (elementId, html) => {
    window.document.getElementById(elementId)
        .replaceChild(builder.build(html));
}

export default builder;
