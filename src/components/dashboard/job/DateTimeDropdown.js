import React, { Component } from 'react'
import { connect } from 'react-redux'
import { compose, bindActionCreators } from 'redux';
import { Collapse, Icon, notification } from 'antd'
import { Field, reduxForm, isDirty } from 'redux-form';
import { Strings } from '../../../dataProvider/localize';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomTimePicker } from '../../common/customTimePicker';
import { customInput } from '../../common/custom-input';
import * as jobCalendarActions from '../../../actions/jobCalendarActions';
import { splitStartDateRequired, splitNumberOfShiftsRequired } from '../../../utils/Validations/dateTimeDropdownValidations';
import { DeepTrim } from '../../../utils/common';

import moment from 'moment'

const { Panel } = Collapse;

export class DateTimeDropdown extends Component {

  handleCancel = () => {
    this.props.reset()
  }

  componentWillReceiveProps(props, state) {
    if (this.props.id !== props.id) {
      this.props.updateThis()
      // this.props.initialize()
    }
  }

  onSubmit = async formData => {
		formData = await DeepTrim(formData);

    const finalFormData = {}

    finalFormData.task_id = this.props.job.id;
    finalFormData.start_date = moment(formData.start_date).format('YYYY-MM-DD')
    finalFormData.start_time = moment(formData.start_time).format("YYYY-MM-DD HH:mm:ss")
    finalFormData.number_of_shifts = parseInt(formData.number_of_shifts)

    this.props.jobCalendarActions.updateTaskDateAndShifts(finalFormData)
      .then((message) => {
        this.props.updateThis()
        this.props.jobCalendarActions.getJobsList()
          .then(res => {
            notification.success({
              message: Strings.success_title,
              description: message ? message : 'Task updated successfully',
              onClick: () => { },
              className: 'ant-success'
            });
          })
      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  disabledDate = (current) => {
    let startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  handleDivClick = () => {
  }

  render() {

    const { handleSubmit, job, id, splitFlag } = this.props
    if (!splitFlag && (!job.sub_tasks || (job.sub_tasks && job.sub_tasks.length === 0))) {
      return (
        <form
          onSubmit={handleSubmit(this.onSubmit)}
          key={`${id}`}
        >
          <div onClick={this.handleDivClick} className="date-time-durtion">
            <Collapse
              bordered={false}
              expandIconPosition={'right'}
              expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? -90 : 90} />}>
              <Panel header="Start Date/Time" key="1" className="dt-dur-style">
                <div className="row ml-0">
                  <div className="col-md-6">
                    <fieldset className="jc-calndr form-group sf-form no-label">
                      <Field
                        name={`start_date`}
                        type="date"
                        disabledDate={this.disabledDate}
                        validate={splitStartDateRequired}
                        component={CustomDatepicker} />
                    </fieldset>
                  </div>
                  <div className="col-md-6">
                    <div className="sf-form form-group no-label">
                      <Field
                        name={`start_time`}
                        type="date"
                        component={CustomTimePicker} />
                    </div>
                  </div>
                </div>
                <fieldset className="jc-calndr sf-form label-block">
                  <Field
                    name={`number_of_shifts`}
                    type="text"
                    validate={splitNumberOfShiftsRequired}
                    placeholder="3 Shifts"
                    label={Strings.number_shifts_txt}
                    component={customInput} />
                </fieldset>
              </Panel>
            </Collapse>
            <div class="all-btn multibnt mt-2">
              <div class="btn-hs-icon d-flex justify-content-between">
                <button type="submit" className="bnt bnt-active" disabled={this.props.splitFlag || !this.props.isDirty}>Save</button>
                <button onClick={this.handleCancel} disabled={!this.props.isDirty} type="button" className="bnt bnt-normal">Cancel</button>
              </div>
            </div>
          </div>
        </form>
      )
    } else {
      return (
        <div className="date-time-durtion view-dt-durtion">
          <Collapse
            bordered={false}
            expandIconPosition={'right'}
            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? -90 : 90} />}>
            <Panel header="Start Date/Time" key="1" className="dt-dur-style">
              <div className="dur-dt-lable">
                <span>{job.start_date}</span>
                {job.start_time ? <span>/ {job.start_time}</span> : null}
              </div>
              {
                job.number_of_shifts
                  ? <div className="view-text-value dure-lable">
                    <label>Duration</label>
                    <span>{job.number_of_shifts}</span>
                  </div>
                  : null
              }
            </Panel>
          </Collapse>
        </div>
      )
    }
  }
}

const mapStateToProps = (state, props) => {
  const { job } = props
  return {
    isDirty: isDirty(`DateTimeDropdown_${job.id}`)(state),
    scopeDocsDetails: state.scopeDocs.scopeDocsDetails,
    forms: state.form
  }
}

const mapDispatchToProps = dispatch => {
  return {
    jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
  }
}

export default compose(
  reduxForm({ enableReinitialize: true, destroyOnUnmount: true }),
  connect(mapStateToProps, mapDispatchToProps),
)(DateTimeDropdown)
