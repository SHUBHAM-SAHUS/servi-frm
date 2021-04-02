import { Select, Icon } from 'antd';
import React, { useEffect } from 'react';
import $ from 'jquery';

const Option = Select.Option;

export const CustomSelect = ({ input, label, options, placeholder, defaultValue, mode, showSearch, notFoundContent, onSearch, filterOption, meta: { touched, error, warning } }) => {
  var id = "CustomSelect-" + Math.random().toString(36).substr(7)

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
        value={/* options.findIndex(item => item.value === input.value) !== -1 ? input.value : "" */
          input.value !== null || input.value !== undefined ? input.value : undefined}
        mode={mode && mode}
        showSearch={showSearch ? 1 : 0}
        notFoundContent={notFoundContent && notFoundContent}
        onSearch={onSearch && onSearch}
        filterOption={filterOption && filterOption}
        onChange={input.onChange}
      // getPopupContainer={() => document.getElementById(id)}
      >
        {options ? options.map((item) => (item.disabled ?
          <Option value={item.value} disabled={item.disabled}>{item.title}</Option>
          : <Option value={item.value} >{item.title}</Option>)) : null}
      </Select>
      {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  );
}