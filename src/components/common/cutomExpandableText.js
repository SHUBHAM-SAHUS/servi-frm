import React, { useEffect } from 'react';
import { Input } from 'antd';

const { TextArea } = Input;

export const cutomExpandableText = ({ input, label, placeholder, disabled, type, meta: { touched, error, warning } }) => {
      return (

    <div>
      <label>{label}</label>
      <div className="cust-expand-txt-area">
        <TextArea  {...input} label={label} disabled={disabled} placeholder={placeholder} 
            onPressEnter={(e)=>e.preventDefault()} 
            id={`${input.name}-focus`} autoSize={true}
        />
        {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}