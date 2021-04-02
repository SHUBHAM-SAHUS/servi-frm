import React, { useEffect } from 'react'
import { AutoComplete, Icon } from 'antd'
import $ from 'jquery';

/*NOTE: Please make sure you handle the 'onSelect' prop whenever you're using this custom component. */


export const CustomCountryAutoCompleteSearch = ({ onSearch, onSelect, input, label, dataSource, placeholder, meta: { touched, error, warning } }) => {
  var id = "customAutoCompleteSearch-" + Math.random().toString(36).substr(7)

  useEffect(() => {
    $(`#${id} .ant-input.ant-select-search__field`).attr('id', `${input.name}-focus`)
  })
  return (
    <div /*id="stickAutoComplete"*/ className="sf-select select-wibg">
      <label>{label}</label>
      <div className="client-name">
        <AutoComplete
          id={id}
          placeholder={placeholder}
          dataSource={input.value ? dataSource : []}
          value={input.value
            ? (
              dataSource.find(country => input.value === country.text)
                ? input.value
                : ''
            )
            : ''}
          onSearch={onSearch}
          onChange={(event) => input.onChange(event)}
          defaultOpen={false}
          filterOption={(inputValue, option) =>
            typeof option.props.children === 'string' ? option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1 : true}
          onSelect={onSelect ? (value) => onSelect(value) : () => { }}
        // getPopupContainer={() => document.getElementById('stickAutoComplete')}
        >
        </AutoComplete>
        <span className="srch-icons" data-icon="" data-js-prompt="&amp;#xe090;"></span>
        <span className="ant-select-arrow"><Icon type="caret-down" /></span>
      </div>
      {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
    </div>
  )
};