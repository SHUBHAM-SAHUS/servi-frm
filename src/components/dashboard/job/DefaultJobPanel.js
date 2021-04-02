import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom'

import { Checkbox, Collapse, Icon, notification } from 'antd';
import { reduxForm, FormSection, Field } from 'redux-form';
import { customInput } from '../../common/custom-input';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomSelect } from '../../common/customSelect';
import { Strings } from '../../../dataProvider/localize';

import * as jobCalendarActions from '../../../actions/jobCalendarActions';
import * as scopeDocAction from '../../../actions/scopeDocActions';
import * as quoteAction from '../../../actions/quoteAction';
import * as orgAction from '../../../actions/organizationAction';
import * as jobAction from "../../../actions/jobAction";
import { groupBy, abbrivationStr, showAsCSV, currencyFormat } from '../../../utils/common';
import moment from 'moment';
import { ERROR_NOTIFICATION_KEY } from "../../../config";

const { Panel } = Collapse
export class DefaultJobPanel extends Component {

  state = {
    checkedJobs: [],
    indices: {},
    splitFlag: false,
    visible: true,
    budgetedValues: [],
  }

  componentDidMount() {
    this.props.orgAction.getServiceAgent()
  }

  static getDerivedStateFromProps(props, state) {

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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedTask.id !== this.props.selectedTask.id) {
      this.setState({ ...this.state, visible: false }, () => this.setState({ ...this.state, visible: true }))
    }
  }

  handleCancel = () => {

  }

  handleAccountManagerSubmit = () => {
    this.setState({ ...this.state, visible: false }, () => this.setState({ ...this.state, visible: true }))
  }

  onSubmit = (formValues) => {

    const finalFormValues = {};
    const currentSelectedJob = this.props.parentJobs.filter(job => job.id === this.props.selectedTask.id);
    finalFormValues.job_id = currentSelectedJob[0].id;
    finalFormValues.acc_manager_user_name = formValues.account_manager;

    this.props.jobCalendarActions.allocateAccountManager(finalFormValues)
      .then(message => {
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: Strings.allocate_manager_success,
            onClick: () => { },
            className: 'ant-success'
          });
        }
        this.props.jobCalendarActions.getJobsList()
      })
      .then(res => {
        currentSelectedJob[0].sites.forEach(site => site.tasks.forEach(task => task.allocated_account_manager = true))  //Front-End Key Name for calendar color
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  }

  handleClosePanel = () => {

  }

  handleTaskSave = (task, panelKey) => {
    const formValues = {};
    Object.keys(this.props.formValues).forEach(keyName => {
      if (keyName.startsWith(task.id.toString())) {
        formValues.task_details = {
          'start_date': moment(this.props.formValues[`${task.id}_start_date`]).format('YYYY-MM-DD'),
          'end_date': moment(this.props.formValues[`${task.id}_end_date`]).format('YYYY-MM-DD'),
          'outsourced_budget': this.props.formValues[`${task.id}_outsourced_budget`],
        };
        formValues.quote_management_id = task.id
      }
    })
    this.props.jobCalendarActions.saveBudgetedTask(formValues)
      .then(res => {
        this.props.onTaskSelect(this.props.selectedTask)
        if (res) {
          notification.success({
            message: Strings.success_title,
            description: Strings.task_save_success,
            onClick: () => { },
            className: 'ant-success'
          });
        }
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? (typeof message === "object" ? Strings.generic_error : message) : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  }

  calculateAdditionalCost = task => {
    if (!task.miscellaneous || task.miscellaneous.length === 0) {
      return false;
    } else {
      return task.miscellaneous.reduce(((acc, val) => acc + val.miscellaneous_cost), 0)
    }
  }

  calculateQuoteTotal = () => {
    let quoteTotal = 0;
    this.props.selectedTask.sites.forEach(site => site.tasks.forEach(task => {
      quoteTotal = quoteTotal + task.task_amount;
    }))
    return quoteTotal ? `${quoteTotal.toFixed(2)}` : `${0.00}`;
  }

  calculateBudgetTotal = () => {
    const taskIds = this.extractTaskIds(this.props.formValues);
    let budgetValue = 0;
    taskIds.forEach(id => {
      if (this.props.formValues.hasOwnProperty(`${id}_outsourced_budget`)) {
        budgetValue = budgetValue + parseFloat(Number(this.props.formValues[`${id}_outsourced_budget`]))
      }
    })
    return budgetValue.toFixed(2);
  }

  extractTaskIds = (values) => {
    const task_ids = [];
    Object.keys(values).forEach(keyName => {
      if (keyName !== 'account_manager') {
        const key = keyName.split('_')[0];
        if (!task_ids.includes(key)) {
          task_ids.push(key);
        }
      }
    })
    return task_ids;
  }

  handleDisableBudgetAllocation = () => {
    let disable = false;
    const { formValues } = this.props;
    const task_ids = this.extractTaskIds(formValues);
    if (!formValues.hasOwnProperty("account_manager") || formValues.account_manager === null) {
      return true;
    }
    task_ids.forEach(id => {
      if (!formValues.hasOwnProperty(`${id}_outsourced_budget`)) {
        disable = true;
      }
    })
    return disable;
  }

  calculatePercentage = () => {
    const taskIds = this.extractTaskIds(this.props.formValues);
    let budgetValue = 0;
    let percentage = 0;
    taskIds.forEach(id => {
      if (this.props.formValues.hasOwnProperty(`${id}_outsourced_budget`)) {
        budgetValue = budgetValue + parseFloat(Number(this.props.formValues[`${id}_outsourced_budget`]))
      }
    })
    if (budgetValue !== 0) {
      percentage = parseFloat(100 -
        ((
          (budgetValue / (this.calculateQuoteTotal()))
        ) * 100).toFixed(2)
      )
      return percentage.toFixed(2)
    } else {
      return 0
    }
  }

  render() {

    const { selectedTask, selectedScopeDoc, handleSubmit, parentJobs } = this.props;
    const currentSelectedJob = parentJobs.filter(job => job.id === selectedTask.id);
    const jobSitesList = currentSelectedJob && currentSelectedJob[0] && currentSelectedJob[0].sites

    const calculateEstimate = (estimate) => {
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

    const costRow = (
      <div className="ama-panel">
        <div className="d-flex justify-content-between task-panel-bottom">
          <div className="view-text-value">
            <label>Quote Total</label>
            <span>$ {this.calculateQuoteTotal()}</span>
          </div>
          <div className="view-text-value">
            <label>Budget Total</label>
            <span>$ {this.calculateBudgetTotal()}</span>
          </div>
          <div className="view-text-value">
            <label>%</label>
            <span>{this.calculatePercentage()}</span>
          </div>
        </div>
      </div>
    )

    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="col-md-3 sf-col-4">
        <div className="sf-card sf-shadow">
          <div className="job-details-header">
            <label>Job Allocation</label>
          </div>

          {/* New Panel Header */}
          <div className="sf-card-head jc-head job-allocation-header">
            <div className="job-allocation-logo">
              <label>{currentSelectedJob && currentSelectedJob[0] && abbrivationStr(currentSelectedJob[0].client_name)}</label>
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
            <button className="bnt bnt-active" type="button" onClick={() => this.handleJobDetailsClick(selectedTask.id, selectedScopeDoc.client.id, selectedTask.quote_number)}>Job Details</button>
          </div>
          {/* New Panel Header */}

          {/* New Account Manager assignment form */}
          <div className="sf-card-body job-allocation-panel">
            <div className="new-ama-form">
              {
                this.state.visible ?
                  <>{
                    jobSitesList && jobSitesList.map((siteItem, index) =>
                      siteItem.tasks && siteItem.tasks.length > 0 && (
                        <div className="ama-panel">
                          {
                            <Collapse className="ama-collapse" bordered={false} expandIconPosition={'right'}
                              expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                              <Panel
                                className="ama-colps-head"
                                header={
                                  <div className="data-v-row">
                                    <div className="data-v-col">
                                      <div className="view-text-value site-header-text">
                                        <label>Site Name: {siteItem.site_name}</label>
                                        {siteItem.tasks && siteItem.tasks.length > 0 ? <span>{siteItem.tasks.length} task(s)</span> : <span>No Tasks</span>}
                                      </div>
                                    </div>
                                  </div>
                                } key="1"
                              >
                                {
                                  siteItem.tasks.map((task, index) =>
                                    <Collapse className="ama-collapse task-collapse" bordered={false} expandIconPosition={'right'}
                                      expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                                      <Panel className="ama-colps-head" header={
                                        <div className="data-v-row task-header-main">
                                          <div className="d-flex justify-content-between task-header-panel">
                                            <div className="view-text-value">
                                              <label className="collapse-task-name">{task.job_task_label}</label>
                                              <span className="hide">{task.task_name}</span>
                                            </div>
                                            <div className="view-text-value">
                                              <label>Quote Value</label>
                                              <span>$ {task.task_amount}</span>
                                            </div>
                                            <div className="view-text-value">
                                              <label>Budget Value</label>
                                              <span>{this.props.formValues.hasOwnProperty(`${task.id}_outsourced_budget`) ? `$ ${this.props.formValues[`${task.id}_outsourced_budget`]}` : task.outsourced_budget ? `$ ${task.outsourced_budget}` : '-'}</span>
                                            </div>
                                            {
                                              this.props.formValues[`${task.id}_outsourced_budget`]
                                                && this.props.formValues[`${task.id}_start_date`]
                                                && this.props.formValues[`${task.id}_end_date`]
                                                ? (
                                                  <span class="material-icons icon-task-panel complete-icon">check</span>
                                                )
                                                : (
                                                  <span class="material-icons icon-task-panel incomplete-icon">clear</span>
                                                )
                                            }
                                          </div>
                                        </div>
                                      } key="1">
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
                                                        <span className="qunty-rate">{currencyFormat(calculateEstimate(task.estimate))}</span><b>{
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
                                              <label>Additional Costs</label>
                                              <span>$ {this.calculateAdditionalCost(task) ? this.calculateAdditionalCost(task) : 0}</span>
                                            </div>
                                            <div className="view-text-value">
                                              <label>Adjustment</label>
                                              <span>$ {task.adjustment_value}</span>
                                            </div>
                                            <div className="view-text-value">
                                              <label>Total</label>
                                              <span>$ {task.task_amount}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="sf-card">
                                          <div className="sf-card-body clnd-notes-dtl">
                                            <h5 className="popup-info-txt">{task.description}</h5>
                                            <div className="row">
                                              <div className="col-md-9">
                                                <fieldset className="sf-form jc-calndr form-group">
                                                  <Field
                                                    name={`${task.id}_outsourced_budget`}
                                                    label="Allocated Budget"
                                                    type="text"
                                                    component={customInput}
                                                    placeholder={'$ '}
                                                  />
                                                </fieldset>
                                              </div>
                                            </div>
                                            <label>Suggested Start Date</label>
                                            <div className="row">
                                              <div className="col-md-6">
                                                <fieldset className="sf-form jc-calndr form-group abcdef">
                                                  <Field
                                                    name={`${task.id}_start_date`}
                                                    label=" "
                                                    type="date"
                                                    component={CustomDatepicker}
                                                  />
                                                </fieldset>
                                              </div>
                                              <div className="col-md-6">
                                                <fieldset className="sf-form jc-calndr form-group">
                                                  <Field
                                                    name={`${task.id}_end_date`}
                                                    label=" "
                                                    type="date"
                                                    component={CustomDatepicker}
                                                  />
                                                </fieldset>
                                              </div>

                                            </div>
                                            <div className="row">
                                              <div className="col-md-6">
                                                <button type="button" className="bnt bnt-normal task-save" /* disabled={!this.props.formValues.hasOwnProperty(`${task.id}_outsourced_budget`)} onClick={() => this.handleTaskSave(task)} */>Cancel</button>
                                              </div>
                                              <div className="col-md-6">
                                                <button type="button" className="bnt bnt-active task-save" disabled={!this.props.formValues.hasOwnProperty(`${task.id}_outsourced_budget`)} onClick={() => this.handleTaskSave(task)}>Allocate</button>
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </Panel>
                                    </Collapse>
                                  )
                                }
                              </Panel>
                            </Collapse>

                          }
                        </div>
                      )
                    )}
                    {costRow}
                    <div className="ama-panel">
                      <fieldset className="form-group sf-form">
                        <Field
                          label="Allocate Manager"
                          name="account_manager"
                          placeholder={Strings.account_manager}
                          options={this.props.accountManagers.map(acMgr => ({
                            title: acMgr.first_name,
                            value: acMgr.user_name
                          }))}
                          type="text"
                          component={CustomSelect}
                        />
                      </fieldset>
                    </div>
                    <div className="d-flex justify-content-center">
                      <button type="submit" className="bnt bnt-active" disabled={this.handleDisableBudgetAllocation()}>Allocate Budget</button>
                    </div>
                  </>
                  : null
              }

            </div>
          </div>
          {
            // End
          }
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  var value = ownProps.selectedTask ? ownProps.selectedTask : {}
  // var scopeDocTasks = [];
  var initVals = {};
  if (value && value.sites) {
    value.sites.forEach(site => {
      if (site.tasks) {
        site.tasks.forEach(task => {
          if (task.service_agent_id) {

          }
          initVals[`${task.id}_start_date`] = task.start_date;
          initVals[`${task.id}_end_date`] = task.end_date;
          if (task.outsourced_budget) {
            initVals[`${task.id}_outsourced_budget`] = task.outsourced_budget;
          }
        })
        // scopeDocTasks = [...scopeDocTasks, ...site.tasks]
      }
    })
  }
  return {
    initialValues: ownProps.selectedTask && ownProps.selectedTask.hasOwnProperty("acc_manager_user_name") ? { ...initVals, account_manager: ownProps.selectedTask.acc_manager_user_name } : { ...initVals, account_manager: [] },
    selectedScopeDoc: state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : {},
    serviceAgents: state.organization.serviceAgents,
    jobs: state.jobsManagement.jobsList,
    formValues: state.form.defaultJobPanel && state.form.defaultJobPanel.values ? state.form.defaultJobPanel.values : {},
    // groupedJobs: map_to_obj(groupBy(
    //   value && value.quote_number && scopeDocTasks && scopeDocTasks.length > 0 ?
    //     state.jobsManagement.jobsList.filter(job => scopeDocTasks.find(task => {
    //       return task.id == job.id
    //     })) :
    //     [],
    //   job => moment(job.start_date).format('MMMM'))),
    clientsList: state.clientManagement && state.clientManagement.clients,
    accountManagers: state.jobsManagement.accountManagersList,
    parentJobs: state.jobsManagement.parentJobs,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
    quoteAction: bindActionCreators(quoteAction, dispatch),
    scopeDocAction: bindActionCreators(scopeDocAction, dispatch),
    orgAction: bindActionCreators(orgAction, dispatch),
    jobAction: bindActionCreators(jobAction, dispatch)
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({ form: 'defaultJobPanel', enableReinitialize: true })
)(DefaultJobPanel)
