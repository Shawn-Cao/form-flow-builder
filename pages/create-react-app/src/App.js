import React, { useState } from 'react';
import './App.css';

import { Form } from './lib/react-ui';

const demoFormSpec = {
    fields: {
        name: {
            type: 'string',
        },
        age: {
            type: 'number',
            constraints: {
                min: 0,
                max: 200,
            }
        },
        gender: {
            type: 'string',
            options: ['male', 'female', 'other'],
        },
        motherPlanet: {
            type: 'string',
            defaultValue: 'Earth',
        }
    },
};


function App() {
  const [formSpec, setFormSpec] = useState(JSON.stringify(demoFormSpec, null, 2));
  let error, workingSpec;
  try {
    workingSpec = JSON.parse(formSpec);
  } catch(err) {
    error = err;
  }
  // optionally pass fown formData to 'control' the form. (if listening form event onChange/onSubmit is not enough)
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
        <p>Form specification in JSON {error ? `has error: ${error}` : 'is valid.'}</p>
        <textarea value={formSpec} onChange={e => setFormSpec(e.target.value)} style={{height: '20em', width: '90%'}} />
      </section>

      <section className="App-section">
        {/* TODO support templating within the form (as child?) */}
        <Form
          formSpec={workingSpec ?? demoFormSpec}
          onSubmit={(formData) => window?.alert(JSON.stringify(formData, null, 2))} />
      </section>
    </div>
  );
}

export default App;
