
// package cache for instantiated forms
// React components should not interact with this unnecessarily
// TODO: shall we support form states? (eg. https://www.react-hook-form.com/api/useform/formstate/)
// TODO: page refresh should load from localStorage & sessionStorage
// storage options: live form saved in JS package storage in memory, updates goes to localStorage or remote API
export const forms = {};


// export const inMemoryStorage = {
//     clearForms: () => forms = {},
//     removeForm: (formName) => forms[formName] = undefined,
//     getForm: (formName = 'default') => forms[formName],
//     saveForm: (formName = 'default') => forms[formName],
// };
// eg. setItem("bgcolor", "red");
//   setItem();
//   removeItem();
//   localStorage.clear();
// any storage option with a browser storage API
let media = window.localStorage;
export const setMedia = (newMedia) => media = newMedia;

export const storage = {
  removeForm: (formName) => forms[formName] = undefined,
  getFormData: (formName = 'default') => {
    let persistedData;
    try {
      persistedData = JSON.parse(media.getItem(formName));
    } catch (error) {
      if (process.env !== 'PRODUCTION') {
        console.error('Failed to parse persisted form data as JSON!', storage.getItem(this.name));
      }
    }
    return persistedData;
  },
  saveForm: (form) => {
    try {
      const serializedData = JSON.stringify(form.data);
      media.setItem(form.name, serializedData);
    } catch (error) {
      if (process.env !== Production) {
        console.error('Failed to persist form data!', 'data: ', form.data, 'media:', media);
      }
    }
    return form.data;
  },
}


export default storage;
