export const SubmitButton = () => {
    const wrapper = document.createElement('div');
    const submitElement = document.createElement('input');
    submitElement.setAttribute('type', 'submit');
    submitElement.setAttribute('value', 'Submit');
    wrapper.appendChild(submitElement);
    return wrapper;
};

export const handleSubmit = (event) => {
  event.preventDefault();
  const formData = new FormData(event.target);
  const json = Object.fromEntries(formData.entries());
  console.log('formData', Object.fromEntries(formData.entries()));
  window.alert(JSON.stringify(json, null, 2));
};
