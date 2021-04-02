import { Select, Icon } from 'antd';
import React, { useEffect } from 'react';
import $ from 'jquery';

const Option = Select.Option;

export const customCountrySelect = ({ input, label, options, placeholder, defaultValue, mode, showSearch, filterOption, meta: { touched, error, warning } }) => {
  var id = "CustomCountrySelect-" + Math.random().toString(36).substr(7)

  useEffect(() => {
    $(`#${id} .ant-select-selection`).attr('id', `${input.name}-focus`)
  })

  return (
    <div id="stickDrop" className="sf-select select-wibg drop-mw">
      <label>{label}</label>
      <Select
        id={id}
        placeholder={placeholder}
        suffixIcon={(<Icon type="caret-down" />)}
        value={input.value !== null || input.value !== undefined || input.value !== [] ? input.value : undefined}
        showSearch
        maxTagCount="1"
        onChange={input.onChange}
      >
        {options ? options.map((item) => (item.disabled ?
          <Option value={item.value} disabled={item.disabled}>{item.title}</Option>
          : <Option value={item.value} >{item.title}</Option>)) : null}
      </Select>
      {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  );
}