import React, { useEffect, useState } from 'react';
import $ from 'jquery'
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const moment = require('moment')
export const CustomReactTimePicker = ({ input, label, type, children, placeholder, disabled, defaultValue,
  timeFormat, meta: { touched, error, warning } }) => {
  var id = "CustomReactTimePicker-" + Math.random().toString(36).substr(7)

  useEffect(() => {
    $(`#${id} .ant-time-picker-input`).attr('id', `${input.name}-focus`)
  })
  console.log(input, 'inputinputinput')
  const [startDate, setStartDate] = useState(new Date());

  console.log(startDate, 'startDatestartDateF')
 
  return (
    <div id="stickDatepicker" className="cust-dpicker">
      <label>{label}</label>
      <div>
        <DatePicker
          id={id}
          selected={input.value ?
            input.value : ''}
          onChange={input.onChange}
          showTimeSelect
          showTimeSelectOnly
          timeIntervals={15}
          timeCaption="Time"
          dateFormat="h:mm aa"
          disabled={disabled}
          defaultValue={defaultValue ? defaultValue : new Date()}
        />
        {/* <TimePicker
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
        </TimePicker> */}
        {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
      </div>
    </div>
  )
}