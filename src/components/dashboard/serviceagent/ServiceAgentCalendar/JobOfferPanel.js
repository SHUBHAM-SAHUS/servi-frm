import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Checkbox, Collapse, Icon, notification } from 'antd';
import { Strings } from '../../../../dataProvider/localize';
import { groupBy, map_to_obj, showAsCSV, currencyFormat } from '../../../../utils/common';
import { compose, bindActionCreators } from 'redux';
// import * as jobManagementActions from '../../../../actions/jobMangerAction';
import * as jobManagementActions from '../../../../actions/SAJobMgmtAction';
import * as jobAction from "../../../../actions/jobAction";
import * as serviceAgentJobCalendarActions from '../../../../actions/serviceAgentJobCalendarActions';
import * as scopeDocAction from '../../../../actions/scopeDocActions';

import moment from 'moment'
import {
  ADMIN_DETAILS,
} from '../../../../dataProvider/constant'
import { getStorage } from '../../../../utils/common';
import { ERROR_NOTIFICATION_KEY } from '../../../../config';

const { Panel } = Collapse

export class JobOfferPanel extends Component {
  state = {

  }

  componentDidMount() {

  }

  calculateTotalTaskAmout = () => {
    const { selectedTask } = this.props;
    let total = 0;
    selectedTask
      && selectedTask[0]
      && selectedTask[0].quote
      && selectedTask[0].quote.scope_doc
      && selectedTask[0].quote.scope_doc.scope_docs_sites
      && selectedTask[0].quote.scope_doc.scope_docs_sites.forEach(siteItem => {
        siteItem.site.tasks.forEach(task => total = parseFloat(total) + parseFloat(task.outsourced_budget));
      })
    return total;
  }

  calculateGSTAmount = () => {
    const totalTasksAmount = this.calculateTotalTaskAmout();
    const GSTAmount = 0.1 * totalTasksAmount;
    return GSTAmount;
  }

  calculateNetTotal = () => {
    const netTotal = this.calculateTotalTaskAmout() + this.calculateGSTAmount();
    return netTotal;
  }

  calculateEstimate = (estimate) => {
    if (estimate) {
      if (estimate.estimate_type && estimate.estimate_type === 'hours' &&
        estimate.staff && estimate.hours && estimate.days && estimate.rate) {
        return estimate.staff * estimate.hours * estimate.days * estimate.rate;
      }
      if (estimate.estimate_type && estimate.estimate_type === 'area' && estimate.sqm && estimate.rate) {
        return estimate.sqm * estimate.rate;
      }
      if (estimate.estimate_type && estimate.estimate_type === 'quant' && estimate.quant && estimate.rate) {
        return estimate.quant * estimate.rate;
      }
    }
    return 0
  }

  handleAcceptOrDeclineJob = (task, status) => {
    const currentSelectedJob = this.props.parentJobs.find(job => job.id === task.job_id)
    console.log(currentSelectedJob)
    // return
    const adminDetails = JSON.parse(getStorage(ADMIN_DETAILS))
    const jobDetails = {
      id: task.id,
      task_accept_by_sa: status,
      account_manager_email: currentSelectedJob.account_manager_email,
      account_manager_name: currentSelectedJob.account_manager_name,
      job_label: currentSelectedJob.job_label,
      decline_reason: '',
      service_agent_name: adminDetails.organisation.name
    }
    console.log(jobDetails)
    this.props.serviceAgentJobCalendarActions.updateJob(jobDetails)
      .then((message) => {
        if (status === 1) {
          notification.success({
            message: Strings.success_title,
            description: message ? message : 'Job Accepted',
            className: 'ant-success'
          });
          this.props.serviceAgentJobCalendarActions.getAllServiceAgentJobs()
            .catch(message => {
              notification.error({
                key: ERROR_NOTIFICATION_KEY,
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
              });
            })
        } else if (status === 2) {
          notification.warning({
            message: Strings.warning_title,
            description: message ? message : 'Job Rejected',
            className: 'ant-warning'
          });
        }

        this.props.serviceAgentJobCalendarActions.getAllServiceAgentJobs()
      })
      .then(res => {

      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? 'Error' : Strings.generic_error, onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  handleDeclineJob = () => {
    alert('Rejected')
  }

  handleJobDetailsClick = (jobId, clientId, quote_number) => {
    this.props.jobAction
      .getTaskJobDetails(jobId)
      .then(flag => {
        this.props.scopeDocAction.getPrimaryPersons(clientId);
        this.props.history.push({
          pathname: "./job-details",
          state: jobId
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
    const { task, selectedTask, parentJobs } = this.props;
    // const jobSitesList = selectedTask
    //   && selectedTask[0]
    //   && selectedTask[0].quote
    //   && selectedTask[0].quote.scope_doc
    //   && selectedTask[0].quote.scope_doc.scope_docs_sites;
    const jobSitesList = task.sites
    // const jobAcceptStatus = selectedTask && selectedTask[0]
    //   && selectedTask[0].job_accept_status

    // const jobAcceptStatus = task.job_accept_status
    const currentSelectedJob = parentJobs.filter(job => job.id === task.id);

    return (
      <div className="col-md-3 sf-col-4">
        <div className="sf-card sf-shadow">
          <span class="material-icons panel-cancel" onClick={() => this.props.onCancel()}>cancel</span>
          <div className="job-details-header">
            <label>Job Offer</label>
            {/* <button className="bnt bnt-active" type="button" >Job Details</button> */}
          </div>
          <div className="sf-card-body job-allocation-panel">
            <div className="new-ama-form">

              {/* New Panel Header */}
              <div className="sf-card-head jc-head job-allocation-header">
                <div className="job-allocation-logo">
                  <label>AP</label>
                </div>
                <div className="job-allocation-header-meta">
                  <span className="meta-line-item">{currentSelectedJob && currentSelectedJob[0] && `Quote Name: ${currentSelectedJob[0].job_name}`}</span>
                  <span className="meta-line-item">{currentSelectedJob && currentSelectedJob[0] && `Company: ${currentSelectedJob[0].client_name}`}</span>
                  <div>
                    <button type="button" className="job-allocation-quote-button">{currentSelectedJob && currentSelectedJob[0] && currentSelectedJob[0].job_label}</button>
                    <span className="meta-line-item">{currentSelectedJob && currentSelectedJob[0] && currentSelectedJob[0].job_start_date && moment(currentSelectedJob[0].start_date).format('DD MMM YYYY')}</span>
                  </div>
                </div>
              </div>

              <div className="job-details-button">
                <button className="bnt bnt-active" type="button" onClick={() => this.handleJobDetailsClick(currentSelectedJob[0].id, currentSelectedJob[0].client_id)}>Job Details</button>
              </div>
              {/* New Panel Header */}
              {
                jobSitesList && jobSitesList.map((siteItem, siteIndex) =>
                  <div className="ama-panel">
                    {
                      siteItem
                        && siteItem.tasks
                        && siteItem.tasks.length
                        && siteItem.tasks.length > 0
                        ? <Collapse className="ama-collapse" bordered={false} expandIconPosition={'right'}
                          expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                          <Panel
                            className="ama-colps-head"
                            header={
                              <div className="data-v-row">
                                <div className="data-v-col">
                                  <div className="view-text-value site-header-text">
                                    <label>Site: {siteItem.site_name}</label>
                                    <span>{siteItem && siteItem.tasks && siteItem.tasks.length} tasks</span>
                                  </div>
                                </div>
                              </div>
                            } key="1"
                          >
                            {
                              siteItem && siteItem.tasks && siteItem.tasks.length && siteItem.tasks.map((task, taskIndex) =>
                                <Collapse className="ama-collapse task-collapse" bordered={false} expandIconPosition={'right'}
                                  expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                                  <Panel
                                    className="ama-colps-head"
                                    header={
                                      <div className="data-v-row task-header-main">
                                        <div className="d-flex justify-content-between task-header-panel">
                                          <div className="view-text-value">
                                            <label className="collapse-task-name">{task.job_task_label}</label>
                                            <span className="hide">{task.task_name}</span>
                                          </div>
                                          <div className="view-text-value">
                                            <label>Value</label>
                                            <span className="hide">${task.outsourced_budget}</span>
                                          </div>
                                        </div>
                                      </div>
                                    }
                                    key="1">
                                    <div className="d-flex flex-wrap">
                                      <div className="column task-data-column">
                                        <div className="view-text-value">
                                          <label>Scope</label>
                                          <span>{task.task_name}</span>
                                        </div>
                                        <div className="view-text-value">
                                          <label>{Strings.area_txt}</label>
                                          <span>{showAsCSV(task.areas)}</span>
                                        </div>
                                        <div className="view-text-value">
                                          <label>Notes</label>
                                          <span>{task.note}</span>
                                        </div>
                                      </div>
                                      <>{
                                        task.estimate
                                          ? <div className="esti-data-view mt-2 estimate-data-view">
                                            {
                                              typeof task.estimate === 'string'
                                                ? <div className="data-v-col">
                                                  <div className="view-text-value">
                                                    <label>{Strings.estimate_txt}</label>
                                                    <span>{task.estimate}</span>
                                                  </div>
                                                </div>
                                                : <>
                                                  <label className="esti-hrs-hd">{Strings.estimate_txt}
                                                    <span className="qunty-rate">{currencyFormat(this.calculateEstimate(task.estimate))}</span><b>{
                                                      task.estimate
                                                      && task.estimate.estimate_type
                                                      && task.estimate.estimate_type.toUpperCase()
                                                    }</b></label>
                                                  <div className="esti-table">
                                                    {
                                                      task.estimate && task.estimate.estimate_type === "hours"
                                                        ? <table className="table">
                                                          <tr className="est-sc-thd">
                                                            <th>Staff</th>
                                                            <th>Hours</th>
                                                            <th>Days</th>
                                                            <th>Rate</th>
                                                          </tr>
                                                          <tr>
                                                            <td>{task.estimate.staff}</td>
                                                            <td>{task.estimate.hours}</td>
                                                            <td>{task.estimate.days}</td>
                                                            <td>{currencyFormat(task.estimate.rate)}</td>
                                                          </tr>
                                                        </table>
                                                        : task.estimate && task.estimate.estimate_type === "area"
                                                          ? <table className="table ">
                                                            <tr className="est-sc-thd">
                                                              <th>SQM</th>
                                                              <th>Rate</th>
                                                            </tr>
                                                            <tr>
                                                              <td>{task.estimate.sqm}</td>
                                                              <td>{currencyFormat(task.estimate.rate)}</td>
                                                            </tr>
                                                          </table>
                                                          : task.estimate && task.estimate.estimate_type === "quant"
                                                            ? <table className="table">
                                                              <tr className="est-sc-thd">
                                                                <th>Quantity</th>
                                                                <th>Rate</th>
                                                              </tr>
                                                              <tr>
                                                                <td>{task.estimate.quant}</td>
                                                                <td>{currencyFormat(task.estimate.rate)}</td>
                                                              </tr>
                                                            </table>
                                                            : null
                                                    }
                                                  </div>
                                                </>
                                            }
                                          </div>
                                          : null
                                      }</>
                                      <div className="column task-data-column">
                                        <div className="view-text-value">
                                          <label>Job Value</label>
                                          <span>${Number(task.outsourced_budget).toFixed(2)}</span>
                                        </div>
                                      </div>
                                    </div>
                                    <div className="d-flex justify-content-around">
                                      <button type="button" className="bnt bnt-active" onClick={() => this.handleAcceptOrDeclineJob(task, 1)}>Accept</button>
                                      <button type="button" className="bnt bnt-normal" onClick={() => this.handleAcceptOrDeclineJob(task, 2)}>Decline</button>
                                    </div>
                                  </Panel>
                                </Collapse>
                              )
                            }
                          </Panel>
                        </Collapse>
                        : null
                    }
                    {/* <div className="ama-panel">
                      <div className="d-flex flex-column  task-panel-bottom totals-panel">
                        <div className="view-text-value">
                          <label>Total</label>
                          <span>${Number(this.calculateTotalTaskAmout()).toFixed(2)}</span>
                        </div>
                        <div className="view-text-value">
                          <label>GST</label>
                          <span>${Number(this.calculateGSTAmount()).toFixed(2)}</span>
                        </div>
                        <div className="view-text-value">
                          <label>Total</label>
                          <span>${Number(this.calculateNetTotal()).toFixed(2)}</span>
                        </div>
                      </div>
                      {
                        !jobAcceptStatus
                        && (
                          <div className="d-flex justify-content-around">
                            <button type="button" className="bnt bnt-active" onClick={() => this.handleAcceptOrDeclineJob(selectedTask[0].id, selectedTask[0].job_number, 1)}>Accept</button>
                            <button type="button" className="bnt bnt-normal" onClick={() => this.handleAcceptOrDeclineJob(selectedTask[0].id, selectedTask[0].job_number, 2)}>Decline</button>
                          </div>
                        )
                      }
                    </div> */}
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </div >
    )
  }
}

const mapStateToProps = (state) => ({
  selectedTask: state.sAJobCalendar.selectedJobDetails,
  parentJobs: state.sAJobCalendar.parentJobs,
})

const mapDispatchToProps = dispatch => ({
  // jobManagerAction: bindActionCreators(jobManagerAction, dispatch),
  jobManagementActions: bindActionCreators(jobManagementActions, dispatch),
  serviceAgentJobCalendarActions: bindActionCreators(serviceAgentJobCalendarActions, dispatch),
  jobAction: bindActionCreators(jobAction, dispatch),
  scopeDocAction: bindActionCreators(scopeDocAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(JobOfferPanel)
