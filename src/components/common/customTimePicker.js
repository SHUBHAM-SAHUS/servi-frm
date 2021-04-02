import React, { useEffect } from 'react';
import $ from 'jquery'
import { TimePicker, Icon } from 'antd';

const moment = require('moment')
export const CustomTimePicker = ({ input, label, type, children, placeholder, disabled, defaultValue, timeFormat, meta: { touched, error, warning } }) => {
  var id = "CustomTimePicker-" + Math.random().toString(36).substr(7)

  useEffect(() => {
    $(`#${id} .ant-time-picker-input`).attr('id', `${input.name}-focus`)
  })
  return (
    <div id="stickDatepicker" className="cust-dpicker">
      <label>{label}</label>
      <div>
        <TimePicker
          id={id}
          // suffixIcon={<CustomCalendarIcon />}
          value={
            input.value
              ? timeFormat
                ? moment(input.value, timeFormat)
                : moment(input.value, "HH:mm:ss")
              : moment('00:00:00', 'HH:mm:ss')
          }
          format={timeFormat && timeFormat}
          onChange={input.onChange}
          placeholder={placeholder}
          label={label}
          type={type}
          defaultValue={defaultValue ? defaultValue : moment(new Date())}
          disabled={disabled}
        >
          {children}
        </TimePicker>
        {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}