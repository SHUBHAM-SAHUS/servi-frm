import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field } from 'redux-form';

import { isRequired, isNumber } from '../../../utils/Validations/scopeDocValidation';
import { Icon } from 'antd';
import { CustomSlider } from '../../common/customSlider';
import moment from 'moment';

const dayMapper = [{ 1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday', 5: 'Friday', 6: 'Saturday', 7: 'Sunday' }]

export class AddExperience extends Component {

    handleHourMinut = (data) => {
        var hour = Math.floor(data / 4).toString().length === 1 ? `0${Math.floor(data / 4)}` : Math.floor(data / 4).toString()
        var minute = 15 * (data % 4) === 0 ? '00' : 15 * (data % 4)
        return `${hour}:${minute}`
    }

    formatToolTip = (v) => {
        var hour = Math.floor(v / 4).toString().length === 1 ? `0${Math.floor(v / 4)}` : Math.floor(v / 4).toString()
        var minute = 15 * (v % 4) === 0 ? '00' : 15 * (v % 4)
        return `${hour}:${minute}`
    }

    // handleSlider = (val, day) => {
    //     var v0 = val[0]
    //     var v1 = val[1]
    //     var t1 = this.handleHourMinut(v0)
    //     var t2 = this.handleHourMinut(v1)
    //     var appendStartDate = moment(new Date()).format("YYYY MM D") + ' ' + t1
    //     var appendEndDate = moment(new Date()).format("YYYY MM D") + ' ' + t2
    //     // this.props.change(`${day}.not_available_from`, appendStartDate)
    //     // this.props.change(`${day}.not_available_to`, appendEndDate)
    // }

    render() {
        var { fields, meta: { error, submitFailed }, daySwitch, dayIndex } = this.props;
        if (fields.length === 0) {
            fields.push({});
        }

        return (
            <>
                {
                    fields.map((rostering, index) => {

                        return (
                            <div className="time-slider">
                                <fieldset className="form-group rost-slider m-0 no-label">

                                    <Field
                                        name={`${rostering}.from_to`}
                                        type="text"
                                        // id="not_available_from"
                                        tipFormatter={(v) => this.formatToolTip(v)}
                                        //onAfterChange={(val) => this.handleSlider(val)}
                                        range
                                        min={0}
                                        max={95}
                                        tooltipVisible
                                        disabled={daySwitch[dayIndex] === true}
                                        component={CustomSlider}
                                    />

                                </fieldset>

                                {index === fields.length - 1
                                    ? <button disabled={daySwitch[dayIndex] === true || index === 1} className="exp-bnt add" type="button" onClick={() => fields.push({})}><Icon type='plus' /></button>
                                    : <button disabled={daySwitch[dayIndex] === true} className='exp-bnt delete' type='button' onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
                            </div>

                        )
                    })
                }
            </>

        )
    }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps)(AddExperience)
