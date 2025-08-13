import React, { useState } from 'react';
import { findReactComponent } from './form-ui-react-components.js';

export const Paginator = ({ form, components, onChange, onError, idMapper }) => {
    const { spec: formSpec, data: formData, currentPageIndex, pageCount, errors }  = form;
    const [currentPage, setCurrentPage] = useState(form.currentPageIndex);
    const orderedFields = form.orderedFields;
    const formFieldComponents = orderedFields.map((fieldSpec, index) => {
      const Component = findReactComponent(fieldSpec, components);
      const name = fieldSpec.name;
      const id = idMapper?.(name, index) || `form-${form.name}-${name}`
      return (
          <Component
              name={name}
              id={id}
              key={name}
              value={formData[name]}
              onChange={onChange}
              error={errors[name]}
              onError={onError}
              formData={formData}
              fieldSpec={fieldSpec}
          />
      );
    });
    if (pageCount === 1) {
        return (
            <div>
                {formFieldComponents}
                <div className={errors['__root'] ? "error active" : "error"} aria-live="polite">{errors['__root']}</div>
                <div><input type="submit" value="Submit" /></div>
            </div>
        );
    }
    const nextHandler = (event) => {
        const errors = form.errors;
        if (!Object.keys(errors).length) {
            setCurrentPage(form.handleNext());
        }
    };
    const previousHandler = (event) => setCurrentPage(form.handlePrevious());
    return (
        <div>
          {formFieldComponents}
          <div className={errors['__root'] ? "error active" : "error"} aria-live="polite">{errors['__root']}</div>
          {currentPage > 0  && <button type='button' onClick={previousHandler}>Previous</button>}
          {currentPage !== (pageCount - 1) && <button type='button' disabled={!!Object.keys(errors).length} onClick={nextHandler}>Next</button>}
          <div><input type="submit" value="Submit" /></div>
        </div>
    )
};
