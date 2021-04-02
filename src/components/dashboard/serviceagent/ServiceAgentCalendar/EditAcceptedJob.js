import React from 'react';
import { Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FieldArray } from 'redux-form';
import moment from 'moment';
import { CustomCheckbox } from '../../../common/customCheckbox';
import { customInput } from '../../../common/custom-input';
import { CustomDatepicker } from '../../../common/customDatepicker';

import * as jobCalendarActions from '../../../../actions/serviceAgentJobCalendarActions';
import * as SWMSAction from '../../../../actions/SWMSAction';

import { Strings } from '../../../../dataProvider/localize';
import { getStorage, groupBy, map_to_obj, handleFocus } from '../../../../utils/common';
import { withRouter } from 'react-router-dom';
import ShiftDetails from './ShiftDetails'
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import { validate } from '../../../../utils/Validations/acceptedJobValidations';
import { DeepTrim } from '../../../../utils/common';
import ReactHtmlParser from 'react-html-parser';


class EditAcceptedJob extends React.Component {
  state = {
    value: 1,
    showNote: false,
    checkedJobs: [],
  };

  componentDidUpdate(nextProps) {
    const { formValues } = this.props
    if (nextProps.formValues.id !== formValues.id) {
      let flag = this.props.initialValues
        && this.props.initialValues.hasOwnProperty("note")
        && (this.props.initialValues.note != null || this.props.initialValues.note != '') ? false : true
      this.setState({
        showNote: flag,
      })
    }
  }

  onSubmit = async formData => {
    formData = await DeepTrim(formData);

    var taskIndex = this.props.selectedTask
      && this.props.selectedTask[0]
      && this.props.selectedTask[0].quote
      && this.props.selectedTask[0].quote.scope_doc
      && this.props.selectedTask[0].quote.scope_doc.scope_docs_sites
      && this.props.selectedTask[0].quote.scope_doc.scope_docs_sites[0]
      && this.props.selectedTask[0].quote.scope_doc.scope_docs_sites[0].site
      && this.props.selectedTask[0].quote.scope_doc.scope_docs_sites[0].site.tasks
      && this.props.selectedTask[0].quote.scope_doc.scope_docs_sites[0].site.tasks.findIndex(task1 => task1.id === this.props.task.id);

    //Condition to check if job schedules are already present in the task
    if (taskIndex !== undefined && taskIndex !== -1
      && this.props.selectedTask[0].job_schedules && this.props.selectedTask[0].job_schedules.length
      && this.props.selectedTask[0].job_schedules.length > 0
      /* && this.props.selectedTask[0].quote.scope_doc.scope_docs_sites[0].site.tasks[taskIndex].job_schedules
      && this.props.selectedTask[0].quote.scope_doc.scope_docs_sites[0].site.tasks[taskIndex].job_schedules[0]
      && this.props.selectedTask[0].quote.scope_doc.scope_docs_sites[0].site.tasks[taskIndex].job_schedules[0].id */) {
      var finalFormData = {}
      finalFormData.job_schedule_id = this.props.selectedTask[0].job_schedules[0].id
      // finalFormData.task_id = this.props.selectedTask[0].quote.scope_doc.scope_docs_sites[0].site.tasks[taskIndex].id
      finalFormData.job_id = this.props.selectedTask[0].quote.scope_doc.scope_docs_sites[0].site.tasks[taskIndex].job_id
      finalFormData.remove_shift_ids = []
      finalFormData.schedule_shifts = []
      finalFormData.job_duration = formData.job_duration
      finalFormData.note = formData.note
      finalFormData.job_start_date = formData.job_start_date

      let jobTime = "";
      if (formData.day) {
        jobTime = "D";
      }

      if (formData.night) {
        jobTime = "N"
      }

      if (formData.day && formData.night) {
        jobTime = "D,N";
      }

      finalFormData.job_time = jobTime;

      const newShiftIds = []

      formData.shifts.forEach(shift => {
        let currentShift = {};
        currentShift.staff = []

        if (shift.hasOwnProperty("id")) {
          currentShift.id = shift.id
          newShiftIds.push(shift.id)
        }

        if (shift.hasOwnProperty("shift_date")) {
          currentShift.shift_date = moment(shift.shift_date).format("YYYY-MM-DD")
        }

        if (shift.hasOwnProperty("yard_time")) {
          currentShift.yard_time = moment(shift.yard_time, "HH:mm:ss").format("HH:mm:ss")
        }

        if (shift.hasOwnProperty("working")) {
          currentShift.working = shift.working
        }

        if (shift.hasOwnProperty("site_time")) {
          currentShift.site_time = moment(shift.site_time, "HH:mm:ss").format("HH:mm:ss")
        }

        if (shift.hasOwnProperty("staff")) {
          for (let [key, value] of Object.entries(shift.staff)) {
            if (value) {
              currentShift.staff.push(key.split("_")[1])
            }
          }
        }

        if (shift.hasOwnProperty("supervisor")) {
          currentShift["supervisor_id"] = shift["supervisor"]
        }

        if (shift.hasOwnProperty("supervisor")) {
          currentShift["site_supervisor_id"] = shift["site_supervisor"]
        }

        if (shift.hasOwnProperty("finish_time")) {
          currentShift.finish_time = moment(shift.finish_time, "HH:mm:ss").format("HH:mm:ss")
        }

        finalFormData.schedule_shifts.push(currentShift);
      })

      formData.existing_shift_ids && formData.existing_shift_ids.forEach(ele => {
        if (newShiftIds.indexOf(ele) === -1) {
          finalFormData.remove_shift_ids.push(ele)
        }
      })

      this.props.jobCalendarActions.updateTaskDetails(finalFormData)
        .then(message => {
          if (message) {
            // this.props.onCancel()
            // this.props.destroy("EditAcceptedJob")
            // this.props.recall(this.props.calendarEvent)
            this.props.jobCalendarActions.getTaskDetails(this.props.calendarEvent)
              .then(() => {
                notification.success({
                  message: Strings.success_title,
                  description: message ? message : Strings.task_details_success, onClick: () => { },
                  className: 'ant-success'
                });
                // this.props.handleopen();
              })
          }
        })
        .catch((message) => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          })
        })
    } else {
      if (formData.job_date) {
        formData.job_date = moment(formData.job_date).format("YYYY-MM-DD")
      }

      let jobTime = "";
      if (formData.day) {
        jobTime = "D";
      } else if (formData.night) {
        jobTime = "N"
      } else if (formData.night && formData.night) {
        jobTime = "D,N";
      }

      formData.job_time = jobTime;

      formData.org_id = parseInt(JSON.stringify(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id))

      // Temporary Adjustments //

      formData.job_id = this.props.task.job_id;
      // formData.task_id = this.props.task.id;
      // Temporary Adjustments //

      if (formData.shifts && formData.shifts.length > 0) {
        formData.shifts.forEach(shift => {
          Object.keys(shift).forEach(property => {

            if (property === "shift_date") {
              shift[property] = moment(shift[property]).format("YYYY-MM-DD");
            }

            if (property === "staff") {
              let staffMembers = [];
              for (let [key, value] of Object.entries(shift[property])) {
                if (value)
                  staffMembers.push(key.split("_")[1])
              }
              shift[property] = staffMembers;
            }

            if (property.includes("_time")) {
              shift[property] = moment(shift[property], "HH:mm:ss").format("HH:mm:ss")
            }

            if (property === "supervisor") {
              shift["supervisor_id"] = shift["supervisor"]
            }

            if (property === "site_supervisor") {
              shift["site_supervisor_id"] = shift["site_supervisor"]
            }

          })
        })
      }

      this.props.jobCalendarActions.addTaskDetails(formData)
        .then(message => {
          if (message) {
            // this.props.onCancel();
            // this.props.destroy("EditAcceptedJob")
            this.props.jobCalendarActions.getTaskDetails(this.props.calendarEvent)
              .then(() => {
                notification.success({
                  message: Strings.success_title,
                  description: message ? message : Strings.task_details_success, onClick: () => { },
                  className: 'ant-success'
                });
                // this.props.handleopen();
              })
          }
        })
        .catch((message) => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          })
        })
    }

  }

  static getDerivedStateFromProps(props, state) {
    // console.log(props.formValues)
  }

  handleNoteToggle = () => {
    this.setState(prevState => ({
      showNote: !prevState.showNote
    }))
  }

  disableDate = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  handleSingleShiftNotification = () => {
    this.props.jobCalendarActions.getTaskDetails(this.props.calendarEvent);
  }

  render() {
    const { handleSubmit, task, errorValues, touched, initialValues } = this.props
    if (initialValues && initialValues.shifts) {
      this.props.change("existing_shift_ids", initialValues.shifts.map(shift => shift.id))
    }
    return (
      <div className="col-md-3">
        {/* Job not started */}
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="sf-card sf-shadow mb-4 jdw-wrap">
            <div className="sf-card-head jc-head">
              <div className="doc-vlue jbd-status">
                {Strings.quote_txt}
                <span>{task && task.quote_number}</span>
                {task && (task.job_status === 0 || !task.hasOwnProperty("job_status")) ? <div className="client-fdbk not-started">Job not started</div> : null}
                {task && (task.job_status === 1) ? <div className="client-fdbk started">Job started</div> : null}
                {task && (task.job_status === 2) ? <div className="client-fdbk paused">Job paused</div> : null}
                {task && (task.job_status === 3) ? <div className="client-fdbk complete">Job complete</div> : null}
              </div>
              <div className="jdw-notes doc-vlue p-relative">
                <span>{task && task.job_number ? task.job_number : 'Job# undefined'}</span>
                <div className="jc-value-dtls">
                  <span class="jc-assign">
                    {`${task && task.client_name}: ${task && task.title}`} -
                    <span>
                      {task && task.areas && (task.areas.length > 0) ? task.areas.map(area => `${area.area_name}, `) : 'No areas'}
                    </span>
                  </span>
                  {task && task.description && task.description !== 'null' ? <p className="jc-note">{task.description}</p> : ""}
                  {/* <p className="jc-note">{task && task.description && task.description}</p> */}
                </div>
                {/* <form> */}
                <div className="v-calndr-note">
                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>Notes</label>
                      <span>{
                        initialValues.job_note && initialValues.job_note.note ? ReactHtmlParser(initialValues.job_note.note) : ""
                      }</span>
                    </div>
                    {initialValues.job_note && initialValues.job_note.note ?
                      <div className="v-note-footer">
                        <strong className="v-n-username">{
                          initialValues.job_note && initialValues.job_note.organisation_user && initialValues.job_note.organisation_user.first_name ? initialValues.job_note.organisation_user.first_name : ""
                        }</strong>
                        <span className="v-n-dates">{
                          initialValues.job_note && initialValues.job_note.created_at ? moment(initialValues.job_note.created_at).format('DD/MM/YYYY h:mm a') : ""
                        }</span>
                      </div>
                      : <div></div>
                    }
                  </div>

                </div>
                <div id="sfPopOver" className="add-sa">
                  <button
                    className="jc-outsource normal-bnt"
                    disabled=""
                    type="button"
                    onClick={() => {
                      this.props.history.push({
                        pathname: '/dashboard/job-details',
                        state: {
                          jobNo: task.job_number,
                          scopeId: task.scope_doc_id
                        }
                      });
                      this.props.swmsAction.getSWMSControl()
                    }}>See Details</button>
                </div>

                {/* <button type="button" className="normal-bnt"
                  hidden={(this.state.showNote == false ? true : false)}
                  onClick={() => this.handleNoteToggle()}>
                  <i className="material-icons">add</i>
                  <span>Add Note</span>
                </button> */}

              </div>
            </div>
            <div className="sf-card-body p-0">
              <div className="job-date-list sf-scroll-bar">
                <fieldset className="jc-calndr form-group sf-form">
                  <Field
                    name="job_start_date"
                    type="date"
                    label={Strings.start_date_txt}
                    id="job_start_date"
                    disabledDate={this.disableDate}
                    component={CustomDatepicker}
                  />
                </fieldset>
                <div className="row">
                  <div className="col-md-5">
                    <div className="form-group sf-form">
                      <label>{Strings.job_time}</label>
                      <div className="job-time-chk">
                        <div className="add-sub-mod">
                          <Field
                            name="day"
                            label="D"
                            component={CustomCheckbox} />
                        </div>
                        <div className="add-sub-mod">
                          <Field
                            name="night"
                            label="N"
                            component={CustomCheckbox} />
                        </div>
                      </div>
                      {touched && errorValues && errorValues.job_time ? <span className="error-input">{errorValues.job_time}</span> : null}
                    </div>
                  </div>
                  <div className="col-md-7 pl-0">
                    <fieldset className="jc-calndr form-group sf-form">
                      <Field
                        name="job_duration"
                        type="number"
                        min="0"
                        placeholder={Strings.number_of_shifts}
                        label={Strings.number_shifts}
                        component={customInput} />
                    </fieldset>
                  </div>
                </div>
                <div className="add-day-night-shift">
                  <FieldArray
                    name="shifts"
                    component={ShiftDetails}
                    change={this.props.change}
                    jobId={this.props.selectedTask && this.props.selectedTask.length > 0 ? this.props.selectedTask[0].id : null}
                    jobNumber={this.props.selectedTask && this.props.selectedTask.length > 0 ? this.props.selectedTask[0].job_number : null}
                    handleSingleShiftNotification={() => this.handleSingleShiftNotification()}
                  />
                </div>
              </div>
            </div>
            <div className="sf-card-footer pb-4 pt-4">
              <div className="all-btn d-flex justify-content-end sc-doc-bnt">
                <div className="btn-hs-icon">
                  <button type="button" className="bnt bnt-normal" onClick={() => this.props.onCancel()}>{Strings.cancel_btn}</button>
                </div>
                <div className="btn-hs-icon">
                  <button type="submit" className="bnt bnt-active">{Strings.save_btn}</button>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  var value = state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : {};
  return {
    selectedScopeDoc: (value ? value : {}),
    serviceAgents: state.organization.serviceAgents,
    jobs: state.jobsManagement.jobsList,
    formValues: state.form.EditAcceptedJob && state.form.EditAcceptedJob.values ? state.form.EditAcceptedJob.values : {},
    groupedJobs: map_to_obj(groupBy(state.jobsManagement.jobsList, job => moment(job.start_date).format('MMMM'))),
    selectedTask: state.sAJobCalendar.selectedJobDetails,
    errorValues: state.form.EditAcceptedJob && state.form.EditAcceptedJob.syncErrors,
    touched: state.form.EditAcceptedJob && state.form.EditAcceptedJob.anyTouched,
    calendarEvent: state.sAJobCalendar.currentCalendarEvent
  }
}

const mapDispatchToprops = dispatch => {
  return {
    jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
    swmsAction: bindActionCreators(SWMSAction, dispatch),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'EditAcceptedJob', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(EditAcceptedJob)

