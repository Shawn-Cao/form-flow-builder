import React from 'react';
import './App.css';

import { Form } from './lib/react-ui';

const formSpec = {
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
  // optionally pass fown formData to 'control' the form. (if listening form event is not enough)
  // const [formData, setFormData] = useState({});
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
        <Form
          formSpec={formSpec}
          onSubmit={(formData) => window?.alert(JSON.stringify(formData))} />
      </section>
    </div>
  );
}

export default App;
