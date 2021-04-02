import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Icon, Collapse } from 'antd'
import { Field } from 'redux-form'

import { Strings } from '../../../../dataProvider/localize';
import { CustomDatepicker } from '../../../common/customDatepicker'
import moment from 'moment';
import { CustomTimePicker } from '../../../common/customTimePicker';
import * as SAJobMgmtAction from '../../../../actions/SAJobMgmtAction';
import AllocateStaff from './AllocateStaff';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';

const { Panel } = Collapse;
class Shifts extends Component {
  constructor({ props }) {
    super()
    this.state = {
      values: [],
      selectedSuperVisors: [],
      selectedSiteSuperVisors: []
    }
  }

  onChange = event => {
    this.setState({
      value: event.target.value,
    });
  };

  handleWorkingChange = (event, index) => {
    if (this.state.values.length > 0) {
      const radioValues = [...this.state.values];
      radioValues[index] = event.target.value;
      this.setState({ values: radioValues })
    } else if (this.state.values.length === 0) {
      this.setState({ values: [event.target.value] })
    }
    this.props.change(`shifts[${index}].working`, event.target.value)
  }

  onYardTimeChange = (time, index) => {

    this.props.change(`shifts[${index}].yard_time`, moment(time).format('HH:mm:ss'))
  }

  onSiteTimeChange = (time, index) => {

    this.props.change(`shifts[${index}].site_time`, moment(time).format('HH:mm:ss'))
  }

  onFinishTimeChange = (time, index) => {

    this.props.change(`shifts[${index}].finish_time`, moment(time).format('HH:mm:ss'))
  }

  handleFields = (fields) => {
    fields.push({})
    this.props.change("job_duration", fields.length + 1)
  }

  handleNotification = (index) => {

  }

  handleDelete = (e, fields, index) => {
    e.stopPropagation()
    fields.remove(index)
    this.props.change("job_duration", fields.length > 0 ? fields.length - 1 : 0)
  }

  disableDate = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  render() {
    var { fields, formValues, jobStaffMembers, initialValues } = this.props;

    // console.log(formValues)

    if (fields.length === 0 && (formValues.shifts && formValues.shifts.length !== 0)) {
      fields.push({});
    }

    if (formValues.shifts && formValues.shifts.length > 0 && formValues.shifts.length < formValues.job_duration) {
      fields.push({});
    }

    if (formValues.shifts && formValues.shifts.length > 0 && formValues.shifts.length > formValues.job_duration) {
      fields.pop()
    }

    return (
      <Collapse
        bordered={false}
        expandIconPosition="right"
        defaultActiveKey={['0']}
        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? -90 : 90} />}>
        {
          fields.map((shifts, index) => {
            return (
              <Panel
                header={
                  <>
                    <div>
                      {(formValues.day && formValues.night)
                        ? (index + 1) % 2 === 1
                          ? Strings.day_shift_txt
                          : Strings.night_shift_txt
                        : formValues.night
                          ? Strings.night_shift_txt
                          : Strings.day_shift_txt}
                    </div>
                    <button className='delete-bnt delete-day-shift' type='button' onClick={(e) =>
                      this.handleDelete(e, fields)}>
                      <i class="fa fa-trash-o"></i>
                    </button>
                  </>
                }
                key={index.toString()}>
                <div className="dn-shift-wrap">
                  <div className="row">
                    <div className="col-md-6">
                      <fieldset className="jc-calndr form-group sf-form">
                        <Field
                          name={`${shifts}.shift_date`}
                          disabledDate={this.disableDate}
                          type="date"
                          label={Strings.date_txt}
                          component={CustomDatepicker} />
                      </fieldset>
                    </div>
                  </div>
                  <div className="d-flex ttbale-row ysf-time" >
                    <div className="sf-form">
                      {/* <label>{Strings.yard_time}</label> */}
                      <Field
                        label={Strings.yard_time}
                        name={`${shifts}.yard_time`}
                        defaultValue={
                          initialValues
                            && initialValues[index]
                            && initialValues[index].hasOwnProperty("yard_time")
                            ? initialValues[index].yard_time
                            : moment(new Date())
                        }
                        timeFormat={"h:mm a"}
                        component={CustomTimePicker}
                      />
                    </div>
                    <div className="sf-form">
                      {/* <label>{Strings.site_time}</label> */}
                      <Field
                        label={Strings.site_time}
                        name={`${shifts}.site_time`}
                        defaultValue={
                          initialValues
                            && initialValues[index]
                            && initialValues[index].hasOwnProperty("site_time")
                            ? initialValues[index].site_time
                            : moment(new Date())
                        }
                        timeFormat={"h:mm a"}
                        component={CustomTimePicker}
                      />
                    </div>
                    <div className="sf-form">
                      {/* <label>{Strings.finish_time}</label> */}
                      <Field
                        label={Strings.finish_time}
                        name={`${shifts}.finish_time`}
                        defaultValue={
                          initialValues
                            && initialValues[index]
                            && initialValues[index].hasOwnProperty("finish_time")
                            ? initialValues[index].finish_time
                            : moment(new Date())
                        }
                        timeFormat={"h:mm a"}
                        component={CustomTimePicker}
                      />
                    </div>
                  </div>
                  <div className="form-group sf-form">
                    {/* <p className="jc-note">Note : If Yard time and Site time are the same then the worker is supposed to arrive at the site directly, otherwise the worker is supposed to arrive at the yard.</p> */}
                  </div>
                  <div className="day-alocte-suprior">
                    <fieldset className="form-group sf-form no-label">
                      <Field
                        name={`${shifts}.supervisor`}
                        placeholder={Strings.allocate_supervisor}
                        type="text"
                        dataSource={this.props.supervisorsList.map(item => ({
                          text: item.first_name,
                          value: item.user_name
                        }))}
                        component={CustomAutoCompleteSearch}
                      />
                    </fieldset>
                    <fieldset className="form-group sf-form no-label">
                      <Field
                        name={`${shifts}.site_supervisor`}
                        placeholder={Strings.allocate_site_supervisor}
                        type="text"
                        dataSource={this.props.siteSupervisorsList.map(item => ({
                          text: item.first_name,
                          value: item.user_name
                        }))}
                        component={CustomAutoCompleteSearch}
                      />
                    </fieldset>
                    <div className="allocate-staff-collaps alsf-rt-staff">
                      <Collapse name={`${shifts}.collapse`} className="allo-staff-list" expandIconPosition="right" defaultActiveKey={['allo-staff-key']} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : -90} />}>
                        <Panel className="asc-item" header="Allocate Staff" key="allo-staff-key">
                          <AllocateStaff shiftData={this.props.formValues.shifts[index]} shifts={shifts} index={index} onChange={this.props.change} jobId={this.props.jobId} jobNumber={this.props.jobNumber} handleSingleShiftNotification={this.props.handleSingleShiftNotification} />
                        </Panel>
                      </Collapse>
                    </div>
                  </div>
                </div>
              </Panel>
            )
          })
        }
        <button class="normal-bnt add-line-bnt mt-3" type="button" onClick={() => this.handleFields(fields)}>
          <i class="material-icons">add</i>
          Add Shifts
        </button>
      </Collapse>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    formValues: state.form.EditAcceptedJob && state.form.EditAcceptedJob.values ? state.form.EditAcceptedJob.values : {},
    jobStaffMembers: state.jobdocManagement.orgUSerList,
    supervisorsList: state.sAJobCalendar.supervisorsList,
    siteSupervisorsList: state.sAJobCalendar.siteSupervisorsList,
    selectedTask: state.sAJobCalendar.selectedTask
  }
}

const mapDispatchToProps = dispatch => {
  return {
    SAJobMgmtAction: bindActionCreators(SAJobMgmtAction, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Shifts)
