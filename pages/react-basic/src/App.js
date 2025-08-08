import React, { useState } from 'react';
import './App.css';

// create-react-app doesn't compile jsx in libraryes, importing partially compiled instead.
import { FormReact as Form } from 'form-flow-builder/main.js';
import { demoFormSpec, multiPageForm, dynamicFormSpec } from 'form-flow-builder/lib/form-spec-demos.js';

let lastWorkingSpec = demoFormSpec;

function App() {
  // default data, also force form recreation to support live editing
  const [formSpec, setFormSpec] = useState(JSON.stringify(demoFormSpec, null, 2));
  let error, workingSpec;
  try {
    workingSpec = JSON.parse(formSpec);
    lastWorkingSpec = workingSpec;
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

      <section className="App-section form-spec">
        <p><label>pre-made demo specs: 
          <select name="demos" onChange={e => setFormSpec(e.target.value)}>
            <option value={JSON.stringify(demoFormSpec, null, 2)}>Basic</option>
            <option value={JSON.stringify(multiPageForm, null, 2)}>Multi Page</option>
            <option value={JSON.stringify(dynamicFormSpec, null, 2)}>Dynamic Specs</option>
          </select>
        </label></p>
        <textarea name="custom" value={formSpec} onChange={e => setFormSpec(e.target.value)} style={{height: '20em', width: '90%'}} />
        <p style={error && {color: 'red'}}>Form specification in JSON {error ? `Not updated! Error: ${error}` : 'is valid.'}</p>
      </section>

      <section className="App-section form-live">
        {/* TODO support templating within the form (as child?) */}
        <Form
          formSpec={workingSpec ?? lastWorkingSpec}
          onSubmit={(formData) => window?.alert(JSON.stringify(formData, null, 2))} />
      </section>
    </div>
  );
}

export default App;
