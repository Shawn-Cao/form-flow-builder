import { Form } from './lib/react-ui.js';

export const FormReact = Form;

// package cache for instantiated forms
// React components should not interact with this unnecessarily
// TODO: shall we support form states? (eg. https://www.react-hook-form.com/api/useform/formstate/)
// TODO: move to cache.js, also support localStorage & sessionStorage
const forms = {};
export const clearForms = () => forms = {};
export const clearForm = (formName) => forms[formName] = undefined;
export const getForm = (formName = 'default') => forms[formName];

export const creatForm = (formSpec, initialData = {}, formName = 'default') => {
    const formData = initializeData(formSpec, initialData);
    forms[formName] = {
        spec: formSpec,
        data: formData,
        state: {
            errors: {}
        }
    }
    return forms[formName];
};
