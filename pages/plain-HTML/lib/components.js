// complementary React components

// 'form' is required and would be to be auto-generated if omitted in form schema
export const form = () => document.createElement('form');

// 'text' is required as the default component
export const text = ({ description }) => {
    const wrapper = document.createElement('div');
    wrapper.appendChild(document.createTextNode(description));
    return wrapper;
}


// NOTE: how to manage widgets live using plain JS? No support for now