import React, { useEffect } from "react";
import $ from "jquery";
import { DatePicker } from "antd";
import CustomCalendarIcon from "./customCalendarIcon";

const moment = require("moment");
export const CustomRangePicker = ({
  input,
  label,
  type,
  afterChange,
  disabledDate,
  disabled,
  children,
  placeholder,
  meta: { touched, error, warning }
}) => {
  var id =
    "CustomDatepicker-" +
    Math.random()
      .toString(36)
      .substr(7);

  useEffect(() => {
    $(`#${id} .ant-calendar-picker-input.ant-input`).attr(
      "id",
      `${input.name}-focus`
    );
  });

  return (
    <div id="stickDatepicker" className="cust-dpicker">
      <label>{label}</label>
      <div>
        <DatePicker.RangePicker
          suffixIcon={<CustomCalendarIcon />}
          value={input.value && input.value}
          onChange={(...props) => {
            input.onChange(...props);
            if (afterChange) {
              afterChange(...props);
            }
          }}
          placeholder={placeholder}
          label={label}
          type={type}
          disabled={disabled}
          disabledDate={disabledDate}
          // allowClear={false}
          id={id}
        >
          {children}
        </DatePicker.RangePicker>
        {touched &&
          ((error && <span className="error-input">{error}</span>) ||
            (warning && <span>{warning}</span>))}
      </div>
    </div>
  );
};
