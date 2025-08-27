// functional style HTML components

// 'form' is required and would be to be auto-generated if omitted in form schema
export const form = () => document.createElement('form');

// 'text' is required as the default component
export const text = ({ description }) => {
    const wrapper = document.createElement('div');
    wrapper.appendChild(document.createTextNode(description));
    return wrapper;
}

// plain HTML text input https://www.w3schools.com/html/html_form_input_types.asp
export const TextInput = ({ name, id, value, onChange, error = "", fieldSpec: { description, defaultValue, placeholder, required, readOnly } }) => {
    if (!value && defaultValue) { value = defaultValue; }
    const wrapper = document.createElement('label');
    wrapper.setAttribute("htmlFor", id)
    wrapper.appendChild(document.createTextNode(description || `${name}: `));
    wrapper.appendChild(document.createElement('br'));
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('id', id);
    input.setAttribute('type', 'text');
    input.setAttribute('aria-label', name);
    if (required) { input.setAttribute('placeholder', placeholder); }
    if (required) { input.setAttribute('required', true); }
    if (readOnly) { input.setAttribute('disabled', true); } // common practice 
    if (value) { input.setAttribute('value', value); }
    wrapper.appendChild(input);
    return wrapper;
};

export const NumberInput = ({ name, id, value, onChange, error = "", fieldSpec: { description, defaultValue, placeholder, required, readOnly } }) => {
    if (!value && defaultValue) { value = defaultValue; }
    const wrapper = document.createElement('label');
    wrapper.setAttribute("htmlFor", id)
    wrapper.appendChild(document.createTextNode(description || `${name}: `));
    wrapper.appendChild(document.createElement('br'));
    const input = document.createElement('input');
    input.setAttribute('name', name);
    input.setAttribute('id', id);
    input.setAttribute('type', 'number');
    input.setAttribute('aria-label', name);
    if (required) { input.setAttribute('placeholder', placeholder); }
    if (required) { input.setAttribute('required', true); }
    if (readOnly) { input.setAttribute('disabled', true); } // common practice 
    if (value) { input.setAttribute('value', value); }
    wrapper.appendChild(input);
    return wrapper;
};
