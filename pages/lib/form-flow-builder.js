// @global 

const builder = {};

builder.build = () => {};

builder.attachHTML = (elementId) => {
    window.document.getElementById(elementId)
        .replaceChild(builder.build());
}

export default builder;
