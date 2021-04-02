import { Slider } from 'antd';
import React, { useEffect } from 'react';
import $ from 'jquery';
export const CustomSlider = ({ input, label, tipFormatter, onAfterChange, disabled, tooltipVisible, included, min, max, range, defaulValue, meta: { touched, error, warning } }) => {
    var id = "CustomSlider-" + Math.random().toString(36).substr(7)

    useEffect(() => {
        $(`#${id} .ant-slider-step`).attr('id', `${input.name}-focus`)
    })
    return (

        <div id="stickSliderTooltip">
            <label>{label}</label>
            <div>
                <Slider
                    id={id}
                    tipFormatter={tipFormatter}
                    onChange={input.onChange}
                    min={min}
                    max={max}
                    range={range}
                    included={included}
                    onAfterChange={onAfterChange}
                    value={input.value ? input.value : []}
                    tooltipVisible={tooltipVisible}
                    disabled={disabled}
                    getTooltipPopupContainer={() => document.getElementById('stickSliderTooltip')}
                />
                {touched && ((error && <span className="error-input">{error}</span>) || (warning && <span>{warning}</span>))}
            </div>
        </div>
    );
}