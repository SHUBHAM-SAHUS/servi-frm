import React, { useEffect } from 'react';
import $ from 'jquery';
import { Icon, Modal, Upload, Radio } from 'antd';

export const customRadioGroup = ({ input, label, options, placeholder, defaultValue, mode, showSearch, meta: { touched, error, warning } }) => {
  var id = "customRadioGroup-" + Math.random().toString(36).substr(7)

  useEffect(() => {
    $(`#${id} .ant-radio-button-input`).attr('id', `${input.name}-focus`)
  })

  return <>
    <Radio.Group onChange={input.onChange} value={input.value} id={id}>
      <Radio.Button value="hours">
        <span className="rbp-btn">Hours</span>
      </Radio.Button>
      <Radio.Button value="area">
        <span className="rbp-btn">Area</span>
      </Radio.Button>
      <Radio.Button value="quant">
        <span className="rbp-btn">Quantity</span>
      </Radio.Button>
    </Radio.Group>
    {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
  </>
}