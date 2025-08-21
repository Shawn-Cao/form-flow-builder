// complementary React components

// 'form' is required and would be to be auto-generated if omitted in form schema
export const form = () => document.createElement('form');

// 'text' is required as the default component
export const text = ({ description }) => {
    const wrapper = document.createElement('div');
    wrapper.appendChild(document.createTextNode(description));
    return wrapper;
}

// TODO:
// plain HTML text input https://www.w3schools.com/html/html_form_input_types.asp
export const TextInput = ({ name, id, required, value, onChange, error = "", fieldSpec: { description, defaultValue, placeholder, readOnly } }) => {
    if (!value && defaultValue) { value = defaultValue; }
    return (
        <label htmlFor={id}>
            <span>{description || `${name}: `}</span><br />
            <input
                name={name}
                id={id}
                type="text"
                aria-label={name}
                required={required}
                placeholder={placeholder}
                disabled={readOnly}
                value={value}
                onChange={onChange}
            />
            <span className={error ? "error active" : "error"} aria-live="polite">{error}</span>
        </label>
    );
};


// NOTE: how to manage widgets live using plain JS? No support for now