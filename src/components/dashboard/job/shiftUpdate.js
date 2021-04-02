import React from 'react';
import { Icon, Collapse, notification, Select, Spin } from 'antd';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators, compose } from 'redux';

import { CustomCheckbox } from '../../common/customCheckbox';
import { Strings } from '../../../dataProvider/localize';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import * as SAJobMgmtAction from '../../../actions/SAJobMgmtAction';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../utils/common';
import { CustomTimePicker } from '../../common/customTimePicker';
import { DeepTrim } from '../../../utils/common';

import moment from 'moment'

const { Panel } = Collapse;
const { Option } = Select;
class ShiftUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visible: true, fetching: false, staffList: [], value: [] }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  componentDidMount() {
    this.props.initialize(this.props.initialValues); // here add this line to initialize the form
  }

  handleSupervisorsSelection = (value) => {
  }

  handleSiteSupervisorsSelection = (value) => {
  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);
    var staff_ids = [];
    var finalFormData = {};
    for (let key in formData) {
      if (key.indexOf("staff_") > -1) {
        let userName = key.split('_');
        if (formData[key]) {
          staff_ids.push(parseInt(userName[1]));
        }
      }
    }
    if (this.props.jobId) {
      finalFormData.job_id = this.props.jobId;
    }
    if (formData.siteSupervisors) {
      finalFormData.site_supervisor_id = formData.siteSupervisors;
    }
    if (formData.supervisors) {
      finalFormData.supervisor_id = formData.supervisors;
    }

    finalFormData.staff = staff_ids;
    finalFormData.site_time = moment(formData.site_time, "HH:mm:ss").format("HH:mm:ss");
    finalFormData.yard_time = moment(formData.yard_time, "HH:mm:ss").format("HH:mm:ss");
    finalFormData.finish_time = moment(formData.finish_time, "HH:mm:ss").format("HH:mm:ss");
    finalFormData.id = parseInt(this.props.shift.id);
    // finalFormData.task_id = parseInt(this.props.task_id);
    if (this.props.job_number) {
      finalFormData.job_number = this.props.job_number
    }
    this.props.SAJobMgmtAction.updateJobScheduleShift(finalFormData).then(message => {
      this.setState({ staffList: [], value: [] });
      notification.success({
        message: Strings.success_title,
        description: message ? message : "Shift Updated Successfully",
        onClick: () => { },
        className: 'ant-success'
      })
    }).catch(err => {
      notification.error({
        message: Strings.error_title,
        description: err ? err : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      })
    })
    this.props.handleEditShiftForm();
    this.props.reset();
  }

  handleEditAction = () => {
    this.props.handleEditShiftForm();
    this.setState({ staffList: [], value: [] });
  }
  fetchUser = (searchKey) => {
    this.setState({ staffList: [], fetching: true });
    if (this.props.formValues && this.props.shift && this.props.shift.shift_date && this.props.formValues.site_time && this.props.formValues.yard_time && this.props.formValues.finish_time) {
      let shift_date = moment(this.props.shift.shift_date).format("YYYY-MM-DD");
      let site_time = moment(this.props.formValues.site_time, "HH:mm:ss").format("HH:mm:ss");
      let yard_time = moment(this.props.formValues.yard_time, "HH:mm:ss").format("HH:mm:ss");
      let finish_time = moment(this.props.formValues.finish_time, "HH:mm:ss").format("HH:mm:ss");
      let shift_id = this.props.shift && this.props.shift.id ? parseInt(this.props.shift.id) : null;
      this.props.SAJobMgmtAction.getStaffBySearchKey(searchKey, shift_date, site_time, yard_time, finish_time, shift_id).then(staff => {
        if (staff && staff.org_users && staff.org_users.length > 0) {
          let staffList = staff.org_users.map(user => ({
            title: user.first_name,
            value: user.user_name,
            availability: user.availability ? user.availability : 0
          }));
          this.setState({ staffList, fetching: false })
        } else {
          this.setState({ fetching: false });
        }
      }).catch(err => {
        this.setState({ fetching: false });
      })
    }
  }

  handleChange = value => {
    this.setState({
      value,
      fetching: false,
    });
  };

  handleOnSelect = value => {
    if (value && value.key) {
      this.props.change(`staff_${value.key}`, true);
    }
  }

  handleOnDeselect = value => {
    if (value && value.key) {
      this.props.change(`staff_${value.key}`, false);
    }
  }

  render() {
    const { handleSubmit } = this.props;
    return (<>
      {this.props.visible ? <tr className="no-bg open-ttbale">
        <td colSpan="10" className="allsf-tt-dtls">
          {/* onClick show staff timetable details.  */}
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="add-staff-ttable">
              <button class="closed-btn extend-closed" onClick={this.handleEditAction}><Icon type="close" /></button>
              <div className="d-flex ttbale-row" id="timePickerDrop">
                <div className="sf-form">
                  {/* <label>{Strings.yard_time}</label> */}
                  <Field label={Strings.yard_time} name="yard_time" component={CustomTimePicker} />
                </div>
                <div className="sf-form">
                  {/* <label>{Strings.site_time}</label> */}
                  <Field label={Strings.site_time} name="site_time" component={CustomTimePicker} />
                </div>
                <div className="sf-form">
                  {/* <label>{Strings.finish_time}</label> */}
                  <Field label={Strings.finish_time} name="finish_time" component={CustomTimePicker} />
                </div>
                <div className="form-group sf-form">
                  <label>&nbsp;</label>
                  {/* <p>Note : If Yard time and Site time is same then worker should suppose to come at site directly otherwise worker should suppose to come at yard.</p> */}
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <fieldset className="form-group sf-form no-label">
                    <Field
                      name="supervisors"
                      placeholder={Strings.allocate_supervisor}
                      type="text"
                      dataSource={this.props.supervisorsList ? this.props.supervisorsList.map(user => ({ text: user.first_name, value: user.user_name })) : []}
                      component={CustomAutoCompleteSearch}
                      onSelect={(value) => this.handleSupervisorsSelection(value)}
                    />
                  </fieldset>
                </div>
                <div className="col-md-6">
                  <fieldset className="form-group sf-form no-label">
                    <Field
                      name="siteSupervisors"
                      placeholder={Strings.allocate_site_supervisor}
                      type="text"
                      dataSource={this.props.siteSupervisorsList ? this.props.siteSupervisorsList.map(user => ({ text: user.first_name, value: user.user_name })) : []}
                      component={CustomAutoCompleteSearch}
                      onSelect={(value) => this.handleSiteSupervisorsSelection(value)}
                    />
                  </fieldset>
                </div>
              </div>
              <div className="allocate-staff-collaps">
                <Collapse className="allo-staff-list" expandIconPosition="right" defaultActiveKey={['allo-staff-key']} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : -90} />}>
                  <Panel className="asc-item" header="Allocate Staff" key="allo-staff-key">
                    <div className="alsf-head">
                      <fieldset className="form-group sf-form no-label">
                        <Select
                          mode="multiple"
                          labelInValue
                          placeholder={Strings.show_all_available_staff}
                          suffixIcon={(<Icon type="caret-down" />)}
                          value={this.state.value}
                          filterOption={false}
                          notFoundContent={this.props.formValues && this.props.formValues.yard_time && this.props.formValues.site_time && this.props.formValues.finish_time ? this.state.fetching ? <Spin size="small" /> : null : "Please select site/yard time, finish time"}
                          onSearch={this.fetchUser}
                          onChange={this.handleChange}
                          onSelect={this.handleOnSelect}
                          onDeselect={this.handleOnDeselect}
                        >
                          {this.state.staffList.map(item => {
                            if (item.availability == 1) {
                              return <Option key={item.value} value={item.value} label={item.title} disabled={true}>
                                <span className="red-scratch">
                                  {item.title}
                                </span>
                              </Option>
                            } else if (item.availability == 3) {
                              return <Option key={item.value} value={item.value} label={item.title}>
                                <span className="green-scratch">
                                  {item.title}
                                </span>
                              </Option>
                            } else if (item.availability == 2) {
                              return <Option key={item.value} value={item.value} label={item.title} disabled={true}>
                                <span className="default-scratch">
                                  {item.title}
                                </span>
                              </Option>
                            }
                            // Its Pending user is present in org but not available on that shift time   disabled={true}
                            else if (item.availability == 0) {
                              return <Option key={item.value} value={item.value} label={item.title} disabled={true}>
                                <span className="red-scratch">
                                  {item.title}
                                </span>
                              </Option>
                            }
                          }
                          )}
                        </Select>
                      </fieldset>
                    </div>
                    <div className="alsf-body">
                      <div className="alsf-checkbx">
                        {this.props.shift && this.props.shift.job_allocated_users && this.props.shift.job_allocated_users.length > 0 ? this.props.shift.job_allocated_users.map((user, index) => {
                          if (user && user.user_name)
                            return <Field key={index} name={`staff_${user.user_name}`} label={<span>{user.first_name}</span>} component={CustomCheckbox} />
                        }) : null}
                        {this.state.value && this.state.value.length > 0 ? this.state.value.map((staff, staffIndex) => {
                          return <Field key={staffIndex} name={`staff_${staff.key}`} label={staff && staff.label && staff.label.props && staff.label.props.children ? staff.label.props.children : null} component={CustomCheckbox} />
                        }) : null}
                      </div>
                      <button className="bnt bnt-active" type="submit">Allocate Staff</button>
                    </div>
                    <div className="alsf-foot">
                      <div className="alsf-status">
                        <span><strong>Black Scratch:</strong> Staff already allocated</span>
                        <span className="provarity-txt"><strong>Red Scratch:</strong> Staff working two shifts in one day</span>
                        <span className="done-txt"><strong>Allocate Staff</strong></span>
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </div>
          </form>
        </td>
      </tr> : null
      }
    </>
    )
  }
}

const mapStateToProps = (state, props) => {
  var siteSupervisors;
  var supervisors;
  var yard_time;
  var site_time;
  var finish_time;
  var userObj = {}
  if (props.shift) {
    siteSupervisors = props.shift && props.shift.site_supervisor && props.shift.site_supervisor.user_name ? props.shift.site_supervisor.user_name : '';
    supervisors = props.shift && props.shift.supervisor && props.shift.supervisor.user_name ? props.shift.supervisor.user_name : ''
    yard_time = props.shift && props.shift.yard_time ? props.shift.yard_time : '';
    site_time = props.shift && props.shift.site_time ? props.shift.site_time : '';
    finish_time = props.shift && props.shift.finish_time ? props.shift.finish_time : '';
    if (props.shift && props.shift.job_allocated_users && props.shift.job_allocated_users.length > 0) {
      props.shift.job_allocated_users.map(user => {
        if (user.user_name) {
          userObj['staff_' + user.user_name] = true;
        }
      })
    }
  }

  return {
    supervisorsList: state.sAJobCalendar.supervisorsList,
    siteSupervisorsList: state.sAJobCalendar.siteSupervisorsList,
    orgUSerList: state.jobdocManagement.orgUSerList,
    formValues: state.form.shiftUpdate && state.form.shiftUpdate.values ? state.form.shiftUpdate.values : {},
    initialValues: {
      siteSupervisors: siteSupervisors,
      supervisors: supervisors,
      site_time: site_time,
      finish_time: finish_time,
      yard_time: yard_time,
      ...userObj
    }
  }
}

const mapDispatchToprops = dispatch => {
  return {
    SAJobMgmtAction: bindActionCreators(SAJobMgmtAction, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'shiftUpdate', enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ShiftUpdate)