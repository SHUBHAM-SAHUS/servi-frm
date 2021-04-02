import React, { useEffect } from 'react';
import $ from 'jquery';

export const customTextarea = ({ input, label, placeholder, disabled, type, maxLength, meta: { touched, error, warning } }) => {

  return (
    <div>
      <label>{label}</label>
      <div>
        <textarea id={`${input.name}-focus`} {...input} label={label} disabled={disabled} placeholder={placeholder} type={type} maxLength={maxLength} />
        {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}