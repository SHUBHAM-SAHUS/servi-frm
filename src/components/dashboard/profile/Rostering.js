import React from 'react';
import { Icon, Dropdown, Menu, Upload, message, Radio, TimePicker, Modal, notification } from 'antd';
import { reduxForm, Field, FieldArray, FormSection, isDirty } from 'redux-form';
import { validate } from '../../../utils/Validations/subscriptionValidate';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import { customTextarea } from '../../common/customTextarea';
import * as actions from '../../../actions/profileManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { CustomSwitch } from '../../../components/common/customSwitch';
import { days, handleFocus } from '../../../utils/common';
import { CustomTimePicker } from '../../common/customTimePicker';
import moment from 'moment';
import { isNumber, isRequired } from '../../../utils/Validations/scopeDocValidation';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage } from '../../../utils/common';
import { CustomSlider } from '../../common/customSlider';
import { DeepTrim } from '../../../utils/common';

import TimeSlider from './TimeSlider';

class Rostering extends React.Component {
  daySwitch = []
  constructor(props) {
    super(props);
    this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;

    Object.values(this.props.initialValues).forEach((key, index) => {
      this.daySwitch = { ...this.daySwitch, [index]: key && key.full_time_availability === 1 ? true : false }
    })

  }

  componentDidMount() {
    Object.values(this.props.initialValues).forEach((key, index) => {
      this.daySwitch = { ...this.daySwitch, [index]: key && key.full_time_availability === 1 ? true : false }
    })
  }

  componentDidUpdate(prevProps, prevState) {
    Object.values(this.props.formValues).forEach((fromKey, index) => {
      this.daySwitch = { ...this.daySwitch, [index]: fromKey && fromKey.full_time_availability ? true : false }
    })
  }

  state = {
    value: 1,
    switch: false,
    arrVal: [],
    daySwitch: ''
  };

  onSubmit = async (formData) => {
    let overlap = false;
    const overlapDays = [];
    for (let key in formData) {
      if (formData[key].not_available_from_to && formData[key].not_available_from_to.length === 2) {
        if ((formData[key].not_available_from_to[1].from_to[0] < formData[key].not_available_from_to[0].from_to[1]) || (formData[key].not_available_from_to[0].from_to[1] > formData[key].not_available_from_to[1].from_to[0])) {
          if (overlapDays.indexOf(key) === -1) {
            overlapDays.push(key);
            overlap = true;
          }
        }
      }
    }
    const overlapErrorMessage = overlapDays.length > 1 ? overlapDays.slice(0, overlapDays.length - 1).join(', ') + ` and ${overlapDays[overlapDays.length - 1]}` : overlapDays[0];
    if (overlap === true) {
      notification.error({
        message: Strings.error_title,
        description: `Shift timings overlapping for ${overlapErrorMessage}.`,
        onClick: () => { },
        className: 'ant-error'
      })
      return
    }
    formData = await DeepTrim(formData);
    Object.values(this.daySwitch).forEach((val, indexVal) => {
      Object.values(formData).forEach((key, indexKey) => {
        if (val) {
          if (indexVal === indexKey) {
            key.not_available_from_to = [{}]
            key.full_time_availability = true

          }
        }
      })
    })

    delete formData.not_available_from
    delete formData.not_available_to
    formData = { 'days': formData }
    formData = { ...formData, 'total_hours': formData.days.total_hours }
    formData = { ...formData, 'org_id': this.org_user_id, 'user_name': this.org_user_name, 'profile_progress': this.props.profileComplete }
    //delete formData.days.total_hours
    // var appendStartDate = ''
    // var appendEndDate = ''
    // Object.keys(formData.days).forEach(key => {
    //     Object.keys(formData.days[key]).forEach(key1 => {
    //         Object.keys(formData.days[key][key1]).forEach(key2 => {
    //             Object.values(formData.days[key][key1][key2]).forEach(key3 => {
    //                 var v0 = key3[0] ? key3[0] : ''
    //                 var v1 = key3[1] ? key3[1] : ''
    //                 var t1 = this.handleHourMinut(v0)
    //                 var t2 = this.handleHourMinut(v1)
    //                 appendStartDate = moment(new Date()).format("YYYY MM D") + ' ' + t1
    //                 appendEndDate = moment(new Date()).format("YYYY MM D") + ' ' + t2
    //                 key3[0] = appendStartDate ? appendStartDate : null
    //                 key3[1] = appendEndDate ? appendEndDate : null
    //             })
    //         })
    //     })
    // })

    // for Required Fields (at least one)
    let valRostering = false
    Object.keys(formData.days).forEach(key => {
      Object.keys(formData.days[key]).forEach(key2 => {
        Object.keys(formData.days[key][key2]).forEach(obj => {
          if (formData.days[key][key2][obj].from_to) {
            valRostering = true
          }
        })
      })
    })
    let daySwitchCheck = false
    Object.values(this.daySwitch).forEach(key => {
      if (key) {
        daySwitchCheck = true
      }
    })

    if (valRostering || daySwitchCheck) {
      this.props.userActions.updateRostering(formData)
        .then(message => {
          notification.success({
            message: Strings.success_title,
            description: message,
            onClick: () => { },
            className: 'ant-success'
          });
          // this.props.reset()
          // this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name);
        }).catch((error) => {
          if (error.status === VALIDATE_STATUS) {
            notification.warning({
              message: Strings.validate_title,
              description: error && error.data && typeof error.data.message == 'string'
                ? error.data.message : Strings.generic_validate, onClick: () => { },
              className: 'ant-warning'
            });
          } else {
            notification.error({
              message: Strings.error_title,
              description: error && error.data && error.data.message && typeof error.data.message == 'string'
                ? error.data.message : Strings.generic_error, onClick: () => { },
              className: 'ant-error'
            });
          }
        });
    } else {
      notification.error({
        message: Strings.error_title,
        description: 'Please provide at least one rostering.',
        onClick: () => { },
        className: 'ant-error'
      })
    }
  }

  handleHourMinut = (data) => {
    var hour = Math.floor(data / 4).toString().length === 1 ? `0${Math.floor(data / 4)}` : Math.floor(data / 4).toString()
    var minute = 15 * (data % 4) === 0 ? '00' : 15 * (data % 4)
    return `${hour}:${minute}`
  }

  handleOnSwitch = (checked, index, day) => {
    this.daySwitch = { ...this.daySwitch, [index]: checked }
    this.setState({
      switch: checked,
      daySwitch: this.daySwitch
    })

    if (checked === true) {
      this.props.change(`${day}.not_available_from_to`, [{}]);
      this.props.change(`${day}.full_time_availability`, true);
    }

    // Object.values(this.daySwitch).forEach((val, indexVal) => {
    //     Object.values(this.props.formValues).forEach((key, indexKey) => {
    //         if (val) {
    //             if (indexVal === indexKey) {
    //                 key.not_available_from_to = [{}]
    //                 key.full_time_availability = true
    //             }
    //         }
    //     })
    // })
  }

  render() {
    const { handleSubmit, profile, } = this.props;
    const editMenu = (
      <Menu>
        <Menu.Item></Menu.Item>
      </Menu>
    )
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>

        {/* Personal Details */}

        <div className="sf-card">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">{Strings.tab_rostering}</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled overlay={editMenu}>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body mt-2">
            <div className="medic-content">
              <h3>Nulla vel mollis enim, vel malesuada odio</h3>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet libero ut nisi hendrerit aliquam. Aliquam erat volutpat. Sed semper diam ut magna fringilla posuere. Morbi sagittis, felis nec ultrices bibendum, diam tellus egestas felis, et mattis lectus ipsum sit amet libero. Ut rutrum consequat maximus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam vel suscipit purus. Quisque in iaculis eros. </p>

              <table className="sf-table sf-t-br-strip rostr-table">
                <tr>
                  <th></th>
                  <th>Full Time Availability</th>
                  <th>Availability</th>
                </tr>
                {days.map((day, index) => {
                  return (
                    <FormSection name={day}>
                      <tr>
                        <td>{day}</td>
                        <td>
                          <fieldset className="sf-chkbx-group sf-form no-label">
                            <Field
                              name="full_time_availability"
                              id="full_time_availability"
                              onChange={(e) => this.handleOnSwitch(e, index, day)}
                              // validate={isRequired}
                              component={CustomSwitch}
                            />
                          </fieldset>
                        </td>
                        <td className="w-60">
                          <FieldArray
                            name="not_available_from_to"
                            daySwitch={this.daySwitch}
                            dayIndex={index}
                            component={TimeSlider}
                            formValues={this.props.formValues}
                          />
                        </td>
                      </tr>
                    </FormSection>
                  )
                })
                }
              </table>

              <h3 className="mt-5">Applicable to Students Only:</h3>
              <p>If you are a student or limitation of allowed work hours apply to you, then fill in the number of hours below.</p>

              <div className="row">
                <div className="col-md-4 col-sm-6 col-xs-12">
                  <fieldset className="form-group sf-form">
                    <Field
                      label="No of Hours Allowed / Week?"
                      name="total_hours"
                      type="text"
                      id=""
                      validate={isNumber}
                      component={customInput} />
                  </fieldset>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="all-btn d-flex justify-content-end mt-4">
          <div className="btn-hs-icon">
            <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
              <Icon type="save" theme="filled" /> Save</button>
          </div>
        </div>
      </form>

    );
  }
}

const convertTimeToSlider = (hh, mm) => {
  return ((hh * 60) + mm) / 15
}

const mapStateToProps = (state) => {
  var temp = [];
  let total_hours;
  if (state && state.profileManagement.profile && state.profileManagement.profile.length > 0 &&
    state.profileManagement.profile[0] && state.profileManagement.profile[0].rostering) {
    for (let item of state.profileManagement.profile[0].rostering) {
      total_hours = item.total_hours;
      var roasterObj = {}
      var notAvailableValueObj = {};
      var notAvailableValueArray = [];
      if (item.day) {
        if (item.not_available_from_to) {
          // eslint-disable-next-line no-loop-func
          Object.keys(item.not_available_from_to).forEach(key => {
            // var from = item && item.not_available_from_to && item.not_available_from_to[key] && item.not_available_from_to[key].from_to && item.not_available_from_to[key].from_to[0] ? convertTimeToSlider(parseInt(moment(item.not_available_from_to[key].from_to[0]).format('HH')), parseInt(moment(item.not_available_from_to[key].from_to[0]).format('mm'))) : '';
            // var to = item && item.not_available_from_to && item.not_available_from_to[key] && item.not_available_from_to[key].from_to && item.not_available_from_to[key].from_to[1] ? convertTimeToSlider(parseInt(moment(item.not_available_from_to[key].from_to[1]).format('HH')), parseInt(moment(item.not_available_from_to[key].from_to[1]).format('mm'))) : '';
            let fromTo = [];
            fromTo.push(item && item.not_available_from_to && item.not_available_from_to[key] && item.not_available_from_to[key].from_to && item.not_available_from_to[key].from_to[0] ||
              item && item.not_available_from_to && item.not_available_from_to[key] && item.not_available_from_to[key].from_to && item.not_available_from_to[key].from_to[0] === 0
              ? item.not_available_from_to[key].from_to[0] : null);
            fromTo.push(item && item.not_available_from_to && item.not_available_from_to[key] && item.not_available_from_to[key].from_to && item.not_available_from_to[key].from_to[1] ? item.not_available_from_to[key].from_to[1] : null);
            if (fromTo[0] !== null) {
              notAvailableValueArray.push({ from_to: fromTo });
            }
          })
        }
        notAvailableValueObj.not_available_from_to = notAvailableValueArray;
        notAvailableValueObj = { ...notAvailableValueObj, full_time_availability: item.full_time_availability ? true : false }
        roasterObj[item.day] = notAvailableValueObj ? notAvailableValueObj : ''
      }
      temp.push(roasterObj)
    }
    temp = [...temp, { 'total_hours': total_hours }]
  }
  var finalValues = {}
  temp.forEach(ele => {

    finalValues = { ...finalValues, ...ele };
  })

  return {
    formValues: state.form && state.form.Rostering && state.form.Rostering.values
      ? state.form.Rostering.values : {},
    isDirty: isDirty('Rostering')(state),
    profile: state.profileManagement && state.profileManagement.profile,
    profileComplete: state.profileManagement && state.profileManagement.profileComplete,
    initialValues: finalValues ? finalValues : {}
  }
}

const mapDispatchToProps = dispatch => {
  return {
    userActions: bindActionCreators(actions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'Rostering', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(Rostering)