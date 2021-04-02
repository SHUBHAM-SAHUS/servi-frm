import React from 'react';
import { Checkbox, Popover, Button, Popconfirm, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FormSection } from 'redux-form';
import moment from 'moment';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';

import * as jobCalendarActions from '../../../actions/jobCalendarActions';
import * as scopeDocAction from '../../../actions/scopeDocActions';
import * as quoteAction from '../../../actions/quoteAction';
import { Strings } from '../../../dataProvider/localize';
import { ACCESS_CONTROL, ADMIN_DETAILS, CLIENTS_GET_CLIENTS_LIST } from '../../../dataProvider/constant';
import { getStorage } from '../../../utils/common';
import { goBack, handleFocus } from '../../../utils/common';
import { setStorage } from '../../../utils/common';
import CoreCalendar from './Calendar/CoreCalendar';
import { groupBy, map_to_obj } from '../../../utils/common';
import SplitJob from './splitJob';
import { withRouter } from 'react-router-dom';
import * as orgAction from '../../../actions/organizationAction';
import DateTimeDropdown from './DateTimeDropdown'
import { ERROR_NOTIFICATION_KEY } from "../../../config";

class OutSourceJob extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      checkedJobs: [],
      indices: {},
      splitFlagMap: {},
      visible: false,
      currentSplitJobId: ''
    }
  }

  componentDidMount() {
    this.props.orgAction.getServiceAgent()
  }

  handleActiveSplit = job => {
    console.log(job)
  }

  // group radio button
  state = {
    value: 1,
  };

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
  };

  handleSASelect = (value, job) => {
    const finalFormData = {}
    finalFormData.task_id = parseInt(job.id);
    finalFormData.service_agent_id = value;
    this.props.jobCalendarActions.simplyAssignSA(finalFormData)
      .then((flag) => {
        this.props.reset()
        this.props.jobCalendarActions.getJobsList()
      })
      .then(() => {
        this.props.scopeDocAction.getScopeDocDetails(job.scope_doc_id, job.id)
      })
      .then(() => {

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

  static getDerivedStateFromProps(props, state) {
    // console.log(props.groupedJobs)
  }

  // popover add SA
  add_more_sa = (job) => (
    <fieldset className="add-sa-search no-label form-group sf-form select-wibg">
      <Field
        name={`job_id$${job.id}`}
        placeholder="Select Service Agent"
        dataSource={this.props.serviceAgents.map(agent => ({ text: agent.name, value: agent.id }))}
        onSelect={(value) => this.handleSASelect(value, job)}
        component={CustomAutoCompleteSearch}
      />
    </fieldset>
  )

  handleOutSource = (job, outsource_status = 1) => {
    const formValue = {
      outsource_job: [{
        service_agent_id: outsource_status === 0 ? null :
          job.service_agent_id ? job.service_agent_id : this.props.formValues.jobServiceAgents[`job_id$${job.id}`],
        task_id: job.id,
        outsource_status,
        client_id: this.props.selectedScopeDoc.client.id
      }]
    }
    this.props.quoteAction.outsourceJob(formValue).then((res) => {
      if (this.props.selectedScopeDoc.id) {
        this.props.scopeDocAction.getScopeDocDetails(this.props.selectedScopeDoc.id);
      }
      this.props.jobCalendarActions
        .getJobsList(this.props.selectedScopeDoc && this.props.selectedScopeDoc.quotes &&
          this.props.selectedScopeDoc.quotes.length > 0 && this.props.selectedScopeDoc.quotes[0].id)
      notification.success({
        message: Strings.success_title,
        description: res.message,
        onClick: () => { },
        className: 'ant-success'
      });
      this.props.change(`jobServiceAgents[${`job_id$${job.id}`}]`, null)
    }).catch((message) => {
      notification.error({
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });
  }

  handleSimplyOutSource = (job, outsource_status = 1) => {
    const formValue = {
      outsource_job: [{
        service_agent_id: outsource_status === 0 ? null :
          job.task_service_agent_id ? job.task_service_agent_id : this.props.formValues.jobServiceAgents[`job_id$${job.id}`],
        task_id: job.id,
        outsource_status,
        client_id: this.props.selectedScopeDoc.client.id
      }]
    }
    this.props.quoteAction.outsourceJob(formValue).then((res) => {
      if (this.props.selectedScopeDoc.id) {
        this.props.scopeDocAction.getScopeDocDetails(this.props.selectedScopeDoc.id);
      }
      this.props.jobCalendarActions
        .getJobsList(this.props.selectedScopeDoc && this.props.selectedScopeDoc.quotes &&
          this.props.selectedScopeDoc.quotes.length > 0 && this.props.selectedScopeDoc.quotes[0].id)
      notification.success({
        message: Strings.success_title,
        description: res.message,
        onClick: () => { },
        className: 'ant-success'
      });
      this.props.change(`jobServiceAgents[${`job_id$${job.id}`}]`, null)
    }).catch((message) => {

      notification.error({
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });
  }

  onCheckChange = (job) => {
    var { checkedJobs } = this.state;
    var index = checkedJobs.findIndex(checked => checked.id === job.id);
    if (index >= 0) {
      checkedJobs.splice(index, 1);
    }
    else {
      checkedJobs.push(job);
    }

    this.setState({ checkedJobs });
  }

  handleGroupAndOut = () => {
    var { checkedJobs } = this.state;
    var noSAFlag = false;
    var outsource_job = checkedJobs.map(job => ({
      service_agent_id: job.service_agent_id ? job.service_agent_id : this.props.formValues.jobServiceAgents &&
        this.props.formValues.jobServiceAgents[`job_id$${job.id}`] ? this.props.formValues.jobServiceAgents[`job_id$${job.id}`]
        : noSAFlag = true,
      task_id: job.id,
      outsource_status: 1,
      client_id: this.props.selectedScopeDoc.client.id
    }));

    if (noSAFlag) {
      notification.error({
        message: Strings.error_title,
        description: Strings.job_sa_group_outsrc_error,
        onClick: () => { },
        className: 'ant-error'
      });
      return 0;
    }
    this.props.quoteAction.outsourceJob({ outsource_job: outsource_job }).then((res) => {
      if (this.props.selectedScopeDoc.id) {
        this.props.scopeDocAction.getScopeDocDetails(this.props.selectedScopeDoc.id);
      }
      this.props.jobCalendarActions
        .getJobsList(this.props.selectedScopeDoc && this.props.selectedScopeDoc.quotes &&
          this.props.selectedScopeDoc.quotes.length > 0 && this.props.selectedScopeDoc.quotes[0].id)
      notification.success({
        message: Strings.success_title,
        description: res.message,
        onClick: () => { },
        className: 'ant-success'
      });
      checkedJobs.forEach(job => {
        if (this.props.formValues.jobServiceAgents && this.props.formValues.jobServiceAgents[`job_id$${job.id}`])
          this.props.change(`jobServiceAgents[${`job_id$${job.id}`}]`, null);
      })

      this.setState({ checkedJobs: [] })
    }).catch((message) => {
      notification.error({
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });
  }

  calendarAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["job_calendar"].permissions;
  permissions = {
    sf_job_calendar_controller_split_job: this.calendarAccessControl.findIndex(access => access.control_name === 'sf_job_calendar_controller_split_job'),
  }

  handleJobDetailsClick = (jobNo) => {
    this.props.history.push({
      pathname: '/dashboard/job-details',
      state: {
        jobNo: jobNo
      }
    })
  }

  handleSplit = (jobIndex, monthIndex, jobId) => {
    const newIndices = { ...this.state.indices }
    newIndices[`${jobIndex}${monthIndex}`] = true
    this.setState(prevState => ({
      ...prevState,
      currentSplitJobId: jobId,
      splitFlagMap: {
        ...this.state.splitFlagMap,
        [`split_${jobIndex}_${monthIndex}`]: true
      },
      indices: {
        ...newIndices
      }
    }));
  }

  handleUnsplit = (jobIndex, monthIndex) => {
    const newIndices = { ...this.state.indices }
    newIndices[`${jobIndex}${monthIndex}`] = false
    this.setState(prevState => ({ ...prevState, splitFlagMap: { ...this.state.splitFlagMap, [`split_${jobIndex}_${monthIndex}`]: false }, indices: { ...newIndices } }));
  }

  handleDeleteSplitTask = (task) => {
    const task_id = task.id;
    const scope_doc_id = task.scope_doc_id
    this.props.jobCalendarActions.deleteSplitTask(task_id, scope_doc_id)
      .then(res => {
        this.props.jobCalendarActions.getJobsList()
      })
      .then(res => {

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

  updateForcibly = () => {
    this.forceUpdate()
    this.props.visibility()
  }

  handleJobDetailsClick = (scopeDocId, clientId, quote_number) => {
    this.props.scopeDocAction
      .getScopeDocDetails(scopeDocId, null, quote_number)
      .then(flag => {
        this.props.scopeDocAction.getPrimaryPersons(clientId);
        this.props.history.push({
          pathname: "/dashboard/scopedoc/showScopeDoc",
          state: scopeDocId
        });
      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: "ant-error"
        });
      });
  }

  render() {
    const { serviceAgents, selectedScopeDoc, formValues, selectedTask } = this.props
    const { checkedJobs } = this.state;

    return (
      <div id="dismissThis" className="col-md-3 sf-col-4">
        <div className="sf-card sf-shadow">
          <span class="material-icons panel-cancel" onClick={() => this.props.onCancel()}>cancel</span>
          <div className="job-details-header">
            <label>Job Outsource</label>
            <button className="bnt bnt-active" type="button" onClick={() => this.handleJobDetailsClick(selectedScopeDoc.id, selectedScopeDoc.client.id, selectedTask.quote_number)}>Job Details</button>
          </div>
          <div className="sf-card-head jc-head">
            <div className="doc-vlue">{Strings.quote_txt}
              <span>{selectedScopeDoc.quote_number}</span>
            </div>
          </div>
          <div className="sf-card-body px-0">
            <div className="job-date-list sf-scroll-bar sf-jc-main">
              <FormSection name="jobServiceAgents">

                {this.props.groupedJobs && Object.keys(this.props.groupedJobs).map((month, monthIndex) =>
                  <div className="job-date-item">
                    <h3 className="job-c-my">{month} {moment(this.props.groupedJobs[month][0].start_date).format('YYYY')}</h3>
                    {this.props.groupedJobs[month].map((job, jobIndex) =>
                      <div className="job-c-details">
                        <div className="split-jc-chkbx">
                          <div className="sf-chkbx-group sf-jc-check-box">

                            {/**Parent Task Section Begins */}

                            <Checkbox onChange={() => this.onCheckChange(job)} checked={
                              checkedJobs.findIndex(checked => checked.id === job.id) >= 0
                            }
                              disabled={(job.sub_tasks && job.sub_tasks.length > 0) || job.outsource_status === 1}>
                              {moment(job.start_date).format("DD-MM-YYYY")}
                            </Checkbox>
                            <div className="jc-value-dtls">
                              <span className="jc-job-no">{job.hasOwnProperty("job_number") ? job.job_number : null}</span>
                              <span className="jc-assign">
                                {/* job.hasOwnProperty("sub_tasks") &&  */}
                                {
                                  job.hasOwnProperty("sub_tasks") && this.props.clientsList.find(client => client.id == job.client_id)
                                    ? `${this.props.clientsList.find(client => client.id == job.client_id).name}: ${job.task_name}` :
                                    job.task_name
                                }
                              </span>
                            </div>
                          </div>

                          {
                            this.state.indices[`${jobIndex}${monthIndex}`] === true
                              ? null
                              : <div id="sfPopOver" className="add-sa-popover">
                                {
                                  (job.hasOwnProperty("job_number") && (job.job_number !== null || job.job_number !== ""))
                                    && (job.hasOwnProperty("job_accept_status") && job.job_accept_status.toString() === '1')
                                    ? <button className="jc-outsource normal-bnt mb-1" type="button" onClick={() => this.handleJobDetailsClick(job.job_number)}>See Job Details</button>
                                    : null
                                }
                                {
                                  formValues.jobServiceAgents
                                    && serviceAgents.find(agent => agent.id == formValues.jobServiceAgents[`job_id$${job.id}`]) && (job.outsource_status !== 0 || job.outsource_status)
                                    ? <>
                                      <label>{serviceAgents.find(agent => agent.id == formValues.jobServiceAgents[`job_id$${job.id}`]).name}</label>
                                      {job && job.cost && job.outsourced_budget
                                        ? <button className="jc-outsource normal-bnt" onClick={() => { this.handleOutSource(job, 1) }} type='button'>Outsource Job</button>
                                        : null}
                                    </>
                                    : (job.outsource_status === 0 || !job.outsource_status) && job.task_service_agent_id                            //Edit SA when job not outsourced
                                      ? (job.sub_tasks && job.sub_tasks.length > 0 ? null :
                                        <>
                                          <Popover className="bnt-simple add-sa-bnt"
                                            placement="bottomRight"
                                            content={this.add_more_sa(job)}
                                            trigger="click"
                                          >
                                            <Button>{serviceAgents.find(agent => agent.id == job.task_service_agent_id)
                                              ? serviceAgents.find(agent => agent.id == job.task_service_agent_id).name
                                              : ""}
                                            </Button>
                                          </Popover>
                                          <button className="jc-outsource normal-bnt" onClick={() => { this.handleSimplyOutSource(job, 1) }} type='button'>
                                            Outsource Job</button>                                                                  {/* Outsource button for simply assigned SA */}
                                        </>
                                      )
                                      : job.outsource_status === 1                                                                                                //outsourced jobs
                                        && job.service_agent_id
                                        ? <>
                                          <label>{serviceAgents.find(agent => agent.id == job.service_agent_id)
                                            ? serviceAgents.find(agent => agent.id == job.service_agent_id).name : ""}</label>
                                          {
                                            job.job_accept_status == 0
                                              ? <button className="jc-outsource normal-bnt" onClick={() => { this.handleOutSource(job, 0) }} type='button'>Revoke</button>
                                              : null
                                          }
                                        </>
                                        : !(job.sub_tasks && job.sub_tasks.length > 0)                                                          //simply assigning SA to Parent task
                                          ? <>
                                            <Popover className="bnt-simple add-sa-bnt"
                                              placement="bottomRight"
                                              content={this.add_more_sa(job)}
                                              trigger="click"
                                            >
                                              <Button><i className="material-icons">add_circle</i> Add SA</Button>
                                            </Popover>
                                            <button className="jc-outsource normal-bnt" disabled type='button'>
                                              Outsource Job</button>
                                          </>
                                          : null
                                }
                              </div>
                          }
                        </div>
                        <div className="jc-chk-value">
                          {
                            <DateTimeDropdown
                              splitFlag={this.state.splitFlagMap[`split_${jobIndex}_${monthIndex}`]}
                              form={'DateTimeDropdown_' + job.id}
                              initialValues={{
                                start_date: job.start_date,
                                start_time: job.start_time,
                                number_of_shifts: job.number_of_shifts
                              }}
                              updateThis={() => this.updateForcibly()}
                              id={job.id}
                              index={jobIndex}
                              job={job}
                            />
                          }

                          {/* New Estimate Fieldset begins */}

                          {
                            job.estimate && job.estimate !== "null"
                              ? JSON.parse(job.estimate).estimate_type === 'area'
                                ? (
                                  <div className="jc-esti-details">
                                    <div className="jc-est-items jc-area-view">
                                      <label>Area:</label>
                                      <span><b>{JSON.parse(job.estimate).sqm}</b> sqm</span>
                                    </div>
                                  </div>
                                )
                                : JSON.parse(job.estimate).estimate_type === 'hours'
                                  ? (
                                    <div className="jc-esti-details">
                                      <div className="jc-est-items">
                                        <label className="est-hrs-hd">Hours:</label>
                                        <div className="jc-hrs-list">
                                          <span>Staff: <b>{JSON.parse(job.estimate).staff}</b></span>
                                          <span>Hours: <b>{JSON.parse(job.estimate).hours}</b></span>
                                          <span>Days: <b>{JSON.parse(job.estimate).days}</b></span>
                                        </div>
                                      </div>
                                    </div>
                                  )
                                  : <div className="jc-esti-details">
                                    <div className="jc-est-items">
                                      <label>Quantity:</label>
                                      <span className="jc-qty-vlu">{JSON.parse(job.estimate).quant}</span>
                                    </div>
                                  </div>
                              : null
                          }

                          {/** New Estimate Fieldset ends */}

                          {/**Parent Task Section Ends */}

                          {/* Sub tasks section begins */}

                          <div className="jc-add-more-split">
                            {
                              job.sub_tasks && job.sub_tasks.length > 0 ?
                                job.sub_tasks.map((subtask, subTaskIndex) =>
                                  <div className="job-c-details  mt-4">
                                    <div className="split-jc-chkbx">
                                      <div className="sf-chkbx-group sf-jc-check-box">
                                        <Checkbox onChange={() => this.onCheckChange(subtask)} checked={
                                          checkedJobs.findIndex(checked => checked.id === subtask.id) >= 0
                                        }
                                          disabled={subtask.outsource_status === 1}>
                                          {moment(subtask.start_date).format("DD-MM-YYYY")}
                                        </Checkbox>
                                        <div className="jc-value-dtls">
                                          <span className="jc-assign">{this.props.clientsList.find(client => client.id === subtask.client_id).name}: {subtask.task_name}</span>
                                        </div>
                                      </div>
                                      <div id="sfPopOver" className="add-sa-popover">
                                        {/* {console.log(subtask)} */}
                                        {
                                          subtask.task_service_agent_id && (subtask.outsource_status === 0 || !subtask.outsource_status)
                                            ? <>                                                                                          {/* Edit SA when job not outsourced} */}
                                              <div id="task-delete">
                                                <Popconfirm
                                                  title={Strings.outsource_task_confirm_delete_alert}
                                                  onConfirm={() => this.handleDeleteSplitTask(subtask)}
                                                  placement="topRight"
                                                  okText="Yes"
                                                  cancelText="No"
                                                  getPopupContainer={() => document.getElementById('task-delete')}
                                                >
                                                  <button className='delete-bnt split-dlt-bnt' type='button'>
                                                    <i class="fa fa-trash-o"></i>
                                                  </button>
                                                </Popconfirm>
                                              </div>
                                              <Popover className="bnt-simple add-sa-bnt"
                                                placement="bottomRight"
                                                content={this.add_more_sa(subtask)}
                                                trigger="click"
                                              >
                                                <Button>
                                                  {
                                                    serviceAgents.find(agent => agent.id == subtask.task_service_agent_id)
                                                      ? serviceAgents.find(agent => agent.id == subtask.task_service_agent_id).name
                                                      : ''
                                                  }
                                                </Button>
                                              </Popover>
                                              <button disabled={!subtask.outsourced_budget} className="jc-outsource normal-bnt" onClick={() => { this.handleSimplyOutSource(subtask, 1) }} type='button'>
                                                Outsource Job</button>
                                            </>
                                            : subtask.service_agent_id/* && job.outsource_status === 1 */                                                   /* Outsourced subtask */
                                              ? <label>{serviceAgents.find(agent => agent.id == subtask.service_agent_id)
                                                ? <>
                                                  {
                                                    serviceAgents.find(agent => agent.id == subtask.task_service_agent_id)
                                                      ? serviceAgents.find(agent => agent.id == subtask.service_agent_id).name
                                                      : ''
                                                  }
                                                  {
                                                    subtask.job_accept_status == 0
                                                      ? <button className="jc-outsource normal-bnt" onClick={() => { this.handleOutSource(subtask, 0) }} type='button'>Revoke</button>
                                                      : null
                                                  }
                                                </>
                                                : subtask.service_agent_id}</label>
                                              : formValues.jobServiceAgents &&
                                                serviceAgents.find(agent => agent.id == formValues.jobServiceAgents[`job_id$${subtask.id}`])
                                                ? <label>{serviceAgents.find(agent => agent.id == formValues.jobServiceAgents[`job_id$${subtask.id}`]).name}</label>
                                                : <>
                                                  <div id="task-delete">
                                                    <Popconfirm
                                                      title={Strings.outsource_task_confirm_delete_alert}
                                                      onConfirm={() => this.handleDeleteSplitTask(subtask)}
                                                      placement="topRight"
                                                      okText="Yes"
                                                      cancelText="No"
                                                      getPopupContainer={() => document.getElementById('task-delete')}
                                                    >
                                                      <button className='delete-bnt split-dlt-bnt' type='button'>
                                                        <i class="fa fa-trash-o"></i>
                                                      </button>
                                                    </Popconfirm>
                                                  </div>
                                                  <Popover className="bnt-simple add-sa-bnt split-sub-dtl"
                                                    placement="bottomRight"
                                                    content={this.add_more_sa(subtask)}
                                                    trigger="click"
                                                  >
                                                    <Button><i className="material-icons">add_circle</i> Add SA</Button>
                                                    <button className="jc-outsource normal-bnt" disabled type='button'>Outsource Job</button>
                                                  </Popover>
                                                </>
                                        }
                                        {/* {
                                          subtask.outsource_status === 0
                                            ? subtask && subtask.cost && subtask.outsourced_budget
                                              ? <button className="jc-outsource normal-bnt" onClick={() => { this.handleOutSource(subtask, 1) }} type='button'>Outsource Job</button>
                                              : null
                                            : subtask && subtask.job_accept_status == 0 ? <button className="jc-outsource normal-bnt" onClick={() => { this.handleOutSource(subtask, 0) }} type='button'>Revoke</button> : null
                                        } */}
                                      </div>
                                    </div>
                                    <div className="jc-chk-value">

                                      {/* date time & duration */}

                                      {
                                        <DateTimeDropdown
                                          splitFlag={false}
                                          form={'DateTimeDropdown_' + subtask.id}
                                          initialValues={{
                                            start_date: subtask.start_date,
                                            start_time: subtask.start_time,
                                            number_of_shifts: subtask.number_of_shifts
                                          }}
                                          updateThis={() => this.updateForcibly()}
                                          id={subtask.id}
                                          index={subTaskIndex}
                                          job={subtask}
                                        />
                                      }

                                      {/* date time & duration ends */}

                                    </div>
                                  </div>

                                ) : null
                            }
                          </div>

                          {/* Sub tasks section ends */}

                          {
                            job.outsource_status === 0 && this.permissions.sf_job_calendar_controller_split_job !== -1
                              ? <SplitJob
                                currentSplitJobId={this.state.currentSplitJobId}
                                selectedJob={job}
                                onSplit={() => this.handleSplit(jobIndex, monthIndex, job.id)}
                                onUnsplit={() => this.handleUnsplit(jobIndex, monthIndex)}
                                subTaskFlag={job.sub_tasks && job.sub_tasks.length > 0}
                              />
                              : null
                          }
                        </div>
                        <br />
                      </div>
                    )}

                  </div>
                )}
              </FormSection>

            </div>
          </div>

          <div className="sf-card-footer pb-4 pt-2">
            <div className="jc-bnt d-flex flex-column">
              {selectedScopeDoc && selectedScopeDoc.job_doc_number ?
                <button type="button" className="bnt bnt-active" onClick={() => this.props.history.push('./showJobDoc')}>Update Job Docs</button> :
                <button type="button" className="bnt bnt-active" onClick={() => this.props.history.push('./jobDocs')}>Create Job Docs</button>}
              <button className="bnt" disabled={!checkedJobs.length > 0} onClick={this.handleGroupAndOut} type="button">Group & Outsource</button>
            </div>
          </div>

        </div>
      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  var value = state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : {};
  var json = require('./temp.json');
  var scopeDocTasks = []
  if (value && value.sites) {
    value.sites.forEach(site => {
      if (site.tasks) {
        site.tasks.forEach(task => { if (task.service_agent_id) { } })
        scopeDocTasks = [...scopeDocTasks, ...site.tasks]
      }
    })
  }
  return {
    selectedScopeDoc: (value ? value : {}),
    serviceAgents: state.organization.serviceAgents,
    jobs: /* json.tasks */ state.jobsManagement.jobsList,
    formValues: state.form.outSourceJob && state.form.outSourceJob.values ? state.form.outSourceJob.values : {},
    groupedJobs: map_to_obj(groupBy(
      value && value.quote_number && scopeDocTasks && scopeDocTasks.length > 0 ?
        state.jobsManagement.jobsList.filter(job => scopeDocTasks.find(task => {
          // if (task.sub_tasks && task.sub_tasks.length > 0) {
          //   return task.sub_tasks.find(taskItem => taskItem.id == job.id)
          // } else {
          return task.id == job.id
          // }
        })/*  job.quote_number === value.quote_number */) :
        [],
      job => moment(job.start_date).format('MMMM'))),
    clientsList: state.clientManagement && state.clientManagement.clients,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
    quoteAction: bindActionCreators(quoteAction, dispatch),
    scopeDocAction: bindActionCreators(scopeDocAction, dispatch),
    orgAction: bindActionCreators(orgAction, dispatch),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'outSourceJob', enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(OutSourceJob)