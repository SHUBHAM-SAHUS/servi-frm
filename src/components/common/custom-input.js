import React from 'react';

export const customInput = ({ input, maxLength, placeholder, disabled, readonly, autoFocus, label, type, min, meta: { touched, error, warning } }) => {
  const onKeyDown = e => {

    if (e.keyCode == 32
      && input.name
      && (
        input.name.includes('email')
        || input.name.includes('mobile')
        || input.name.includes('phone')
      )
    ) {
      e.preventDefault();
      return false;
    }

  }
  var id = `${input.name}-focus`


  return (

    <div>
      <label>{label}</label>
      <div>
        {readonly ?
          <input {...input} placeholder={placeholder} 
          // className="hide-txtbox" 
          type={type} readOnly onKeyDown={onKeyDown} /> :
          <input {...input} id={id} placeholder={placeholder} disabled={disabled} type={type} autoFocus={autoFocus} maxLength={maxLength} min={min ? parseInt(min) : null} onKeyDown={onKeyDown} />
        }

        {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}
