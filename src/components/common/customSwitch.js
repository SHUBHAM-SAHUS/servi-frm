import { Switch } from 'antd';
import React, { useEffect } from 'react';
import $ from 'jquery';
export const CustomSwitch = ({ input, label, meta: { touched, error, warning } }) => {

  var id = "CustomSwitch-" + Math.random().toString(36).substr(7)

  useEffect(() => {
    $(`#${id} .ant-switch`).attr('id', `${input.name}-focus`)
  })
  return (
    <div>
      <label>{label}</label>
      <div>
        <Switch id={id} checked={Boolean(input.value)} onChange={input.onChange} />
        {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
}