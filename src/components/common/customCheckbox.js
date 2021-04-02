import { Checkbox } from 'antd';
import React, { useEffect } from 'react';
import $ from 'jquery';
export const CustomCheckbox = ({ input, label, disabled, checked = Boolean(input.value), meta: { touched, error, warning } }) => {

  var id = "CustomCheckbox-" + Math.random().toString(36).substr(7)

  useEffect(() => {
    $(`#${id} .ant-checkbox-input`).attr('id', `${input.name}-focus`)
  })

  return (
    <div className="cu-checkbox">
      <Checkbox
        id={id}
        checked={checked}
        onChange={input.onChange}
        disabled={disabled}>

        {label}
      </Checkbox>
      {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  );
}
