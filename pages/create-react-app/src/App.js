import React, { useState } from 'react';
import './App.css';

import Form from 'form-flow-builder/lib/react-ui';

const formSpec = {
    fields: {
        name: {
            type: 'string',
        },
        age: {
            type: 'integer',
            constraints: {
                min: 0,
                max: 200,
            }
        },
        gender: {
            type: 'string',
            options: ['male', 'female', 'other'],
        }
    },
};


function App() {
  // const [formData, updateData] = useState({});
  return (
    <div className="App">
      <header className="App-header">
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          React UI demo based on create-react-app
        </a>
      </header>
      <section className="App-section">
        {/* TODO support templating within the form (as child?) */}
        <Form onSubmit={window?.echo} />
      </section>
    </div>
  );
}

export default App;
