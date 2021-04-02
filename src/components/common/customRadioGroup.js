import React from 'react'
import { Radio } from 'antd';

export const customRadioGroup = ({ input, answer_index, answer_text, disabled, label, options, placeholder, defaultValue, mode, showSearch, meta: { touched, error, warning } }) =>
  <>
    <Radio.Group onChange={input.onChange} value={input.value} disabled={disabled}  >
      <Radio value={answer_index}>{answer_text ? answer_text : ''}</Radio>
    </Radio.Group>
    {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
  </>