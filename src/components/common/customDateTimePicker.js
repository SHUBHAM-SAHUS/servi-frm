import React, { useEffect } from 'react';
import $ from 'jquery';
import { DatePicker } from 'antd';
import CustomCalendarIcon from './customCalendarIcon'

const moment = require('moment')
export const CustomDateTimePicker = ({ input, label, type, afterChange, disabledDate, showTime, disabled, children, placeholder, meta: { touched, error, warning } }) => {
  var id = "CustomDateTimePicker-" + Math.random().toString(36).substr(7)

  useEffect(() => {
    $(`#${id} .ant-calendar-picker-input.ant-input`).attr('id', `${input.name}-focus`)
  })

  return (
    <div id="stickDatepicker" className="cust-dpicker">
      <label>{label}</label>
      <div>
        <DatePicker
          suffixIcon={<CustomCalendarIcon />}
          value={
            input.value
              ? moment.utc(new Date(input.value))
              : input.value
          }
          onChange={(...props) => {
            input.onChange(...props);
            if (afterChange) { afterChange(...props) }
          }}
          placeholder={placeholder}
          label={label}
          type={type}
          disabled={disabled}
          disabledDate={disabledDate}
          showTime={showTime}
          allowClear={false}
          id={id}
        >
          {children}
        </DatePicker>
        {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}