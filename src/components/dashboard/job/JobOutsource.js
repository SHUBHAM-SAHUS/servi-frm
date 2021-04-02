import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, compose } from 'redux';
import { withRouter } from 'react-router-dom'

import { Collapse, Icon, notification, Popconfirm } from 'antd';
import { reduxForm, FieldArray, Field } from 'redux-form';
import { customInput } from '../../common/custom-input';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomTimePicker } from '../../common/customTimePicker';
import { customTextarea } from '../../common/customTextarea';
import { Strings } from '../../../dataProvider/localize';

import * as jobCalendarActions from '../../../actions/jobCalendarActions';
import * as scopeDocAction from '../../../actions/scopeDocActions';
import * as quoteAction from '../../../actions/quoteAction';
import * as orgAction from '../../../actions/organizationAction';
import * as jobAction from "../../../actions/jobAction";
import { groupBy, map_to_obj, showAsCSV, currencyFormat, abbrivationStr } from '../../../utils/common';
import moment from 'moment';
import { ERROR_NOTIFICATION_KEY } from "../../../config";
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';

const { Panel } = Collapse

export class JobOutsource extends Component {

  frequencies = ["Day", "Week", "Month", "Year"];
  durations = ["Day", "Week", "Fortnight", "Month", "Year"];

  state = {
    checkedJobs: [],
    visible: true,
    durationDataSource: []
  }

  componentDidMount() {
    this.props.orgAction.getServiceAgent()
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedTask.id !== this.props.selectedTask.id) {
      this.setState({ ...this.state, visible: false }, () => this.setState({ ...this.state, visible: true }))
    }
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

  handleCancel = () => {

  }

  handleAccountManagerSubmit = () => {
    this.setState({ ...this.state, visible: false }, () => this.setState({ ...this.state, visible: true }))
  }

  onSubmit = (formValues) => {
    const { selectedTask } = this.props;
    const outsourceStatusMap = {};
    selectedTask.sites.forEach((site, siteIndex) => {
      site.tasks.forEach((task, taskIndex) => {
        outsourceStatusMap[`${siteIndex}_${taskIndex}`] = {
          task_id: task.id,
          outsource_status: task.outsource_status
        }
      })
    })

    const finalFormValues = {
      outsource_job: []
    };

    formValues.job_outsource_sites.forEach((site, siteIndex) => {
      site.forEach((task, taskIndex) => {
        task.forEach((split, splitIndex) => {
          finalFormValues.outsource_job.push({
            service_agent_id: split.service_agent_id,
            outsource_status: 1,
            client_id: selectedTask.client_id,
            task_id: outsourceStatusMap[`${siteIndex}_${taskIndex}`].task_id
          })
        })
      })
    })
    this.props.quoteAction.outsourceJob(finalFormValues)
      .then(res => {
        notification.success({
          message: Strings.success_title,
          description: res && res.message ? res.message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-success'
        });
        // this.props.scopeDocAction.getScopeDocDetails(selectedScopeDoc.id, null, selectedScopeDoc.quote_number)
      })
      .then(res => {
        this.props.jobCalendarActions.getJobsList()
      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: "ant-error"
        });
      })
  }

  handleClick = (task) => {
  }

  handleTaskSave = (task, siteIndex, taskIndex, splitStatus) => {
    const finalFormValues = {
      tasks: []
    };
    if (splitStatus) {
      this.props.formValues.job_outsource_sites[siteIndex][taskIndex].forEach((split, splitIndex) => {
        if (splitIndex === 0) {
          finalFormValues.tasks.push({ ...split, id: task.id })
        } else {
          finalFormValues.tasks.push({ ...split, start_date: moment(split.start_date).format('YYYY-MM-DD'), parent_id: task.id })
        }
      })
    } else {
      this.props.formValues.job_outsource_sites[siteIndex][taskIndex].forEach((split, splitIndex) => {
        finalFormValues.tasks.push({ ...split, id: task.id, est_start_time: moment(split.est_start_time).format('hh.mm A'), est_end_time: moment(split.est_end_time).format('hh.mm A') })
      })
    }
    // return
    this.props.jobCalendarActions.simplyAssignSA(finalFormValues)
      .then(message => {
        notification.success({
          message: Strings.success_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-success'
        });
        // this.props.scopeDocAction.getScopeDocDetails(selectedScopeDoc.id, null, selectedScopeDoc.quote_number)
      })
      .then(res => {
        this.props.jobCalendarActions.getJobsList()
      })
      .then(res => {

      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: "ant-error"
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

  calculateOutsourceTotal = () => {
    const { selectedScopeDoc, formValues } = this.props;
    let outsourceValue = 0;
    selectedScopeDoc.sites.forEach((site, siteIndex) => site.tasks.forEach((task, taskIndex) => {
      if (task.sub_tasks && task.sub_tasks.length) {
        task.sub_tasks.forEach((subTask, subTaskIndex) => {
          outsourceValue = formValues
            && formValues.job_outsource_sites
            && formValues.job_outsource_sites[siteIndex]
            && formValues.job_outsource_sites[siteIndex][taskIndex]
            && formValues.job_outsource_sites[siteIndex][taskIndex][subTaskIndex + 1]
            && formValues.job_outsource_sites[siteIndex][taskIndex][subTaskIndex + 1].outsourced_budget_to_sa
            ? outsourceValue + Number(formValues.job_outsource_sites[siteIndex][taskIndex][subTaskIndex + 1].outsourced_budget_to_sa)
            : outsourceValue + subTask.outsourced_budget_to_sa;
        })
      }

      outsourceValue = formValues
        && formValues.job_outsource_sites
        && formValues.job_outsource_sites[siteIndex]
        && formValues.job_outsource_sites[siteIndex][taskIndex]
        && formValues.job_outsource_sites[siteIndex][taskIndex]
        && formValues.job_outsource_sites[siteIndex][taskIndex][0]
        && formValues.job_outsource_sites[siteIndex][taskIndex][0].outsourced_budget_to_sa
        ? outsourceValue + Number(formValues.job_outsource_sites[siteIndex][taskIndex][0].outsourced_budget_to_sa)
        : outsourceValue + task.outsourced_budget_to_sa;
    }))

    return outsourceValue ? `${outsourceValue}` : `${0}`;
  }

  calculateQuoteTotal = () => {
    let quoteTotal = 0;
    this.props.selectedScopeDoc.sites.forEach(site => site.tasks.forEach(task => {
      quoteTotal = quoteTotal + task.amount;
    }))
    return quoteTotal ? `${quoteTotal}` : `${0}`;
  }

  calculateBudgetTotal = () => {
    let budgetTotal = 0;
    this.props.selectedScopeDoc.sites.forEach(site => site.tasks.forEach(task => {
      budgetTotal = budgetTotal + task.outsourced_budget;
    }))
    return budgetTotal ? `${budgetTotal}` : `${0}`;
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
    let disabled = false;
    // if (this.props.selectedScopeDoc && this.props.selectedScopeDoc.sites) {
    //   disabled = this.props.selectedScopeDoc.sites.every(site => site.tasks.every(task => task.outsource_status === 1))
    // }
    return disabled;
  }

  handleDurationSearch = value => {
    var letterNumber = /^[1-9]+$/;
    var array = value.split(" ");

    if (value.match(letterNumber)) {
      let post = value > 1 ? "s" : ""
      this.setState({
        durationDataSource: !value ? [] : this.durations.map(title => ({ text: value + " " + title + post, value: value + " " + title + post })),
      });
    } else if (array.length > 1 && !isNaN(array[0])) {
      let postfix = array[0] > 1 ? "s" : ""
      let filterValue = this.durations.filter(val => {
        return val.toLowerCase().includes((array[1].toLowerCase()))
      })
      this.setState({
        durationDataSource: !value ? [] : filterValue.map(title => ({ text: array[0] + " " + title + postfix, value: array[0] + " " + title + postfix })),
      });
    } else {
      this.setState({
        durationDataSource: !value ? [] : this.durations.map(title => ({ text: title, value: title.toString() })),
      });
    }
  };

  renderSplitTasks = ({ fields, siteIndex, taskIndex, formValues, task, meta: { error, submitFailed } }) => {

    if (fields.length === 0) {
      fields.push({ start_date: task.start_date })
    }

    return (
      <>
        {
          fields.map((split, index) => {
            return (
              <>
                {
                  (index > 0) &&
                  <>
                    <label className="service-agent-title">Split #{index}</label>
                    <Popconfirm
                      title={Strings.outsource_task_confirm_delete_alert}
                      onConfirm={() => this.handleTaskDelete(fields, index)}
                      placement="topRight"
                      okText="Yes"
                      cancelText="No"
                      getPopupContainer={() => document.getElementById('task-delete')}
                    >
                      <button id="task-delete" className='delete-bnt split-delete-bnt' type='button'>
                        <i class="fa fa-trash-o"></i>
                      </button>
                    </Popconfirm>
                  </>
                }
                <div className="row">
                  {/* <div className="col-md-12"> */}
                  <div className="col-md-6">
                    <fieldset className="sf-form jc-calndr form-group">
                      <Field
                        name={`${split}.outsourced_budget_to_sa`}
                        label="Outsourced Value"
                        type="text"
                        placeholder={'$ '}
                        component={customInput}
                      />
                    </fieldset>
                  </div>
                  <div className="col-md-6">
                    <fieldset className="sf-form jc-calndr form-group">
                      <div className="view-text-value view-outsource-task-percent">
                        <label>%</label>
                        <span>{this.calculateTaskProfitPercentage(formValues, siteIndex, taskIndex, index, task)} %</span>
                      </div>
                    </fieldset>
                  </div>
                  {/* </div> */}
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <label className="service-agent-title">Outsource To</label>
                    <fieldset className="add-sa-search no-label form-group sf-form select-wibg">
                      <Field
                        name={`${split}.service_agent_id`}
                        dataSource={this.props.serviceAgents.map(agent => ({ text: agent.name, value: agent.id }))}
                        placeholder="Select a Service Agent"
                        component={CustomAutoCompleteSearch}
                      />
                    </fieldset>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <fieldset className="sf-form jc-calndr form-group">
                      <Field
                        name={`${split}.start_date`}
                        label="Start Date"
                        placeholder={Strings.job_date}
                        type="date"
                        component={CustomDatepicker}
                      />
                    </fieldset>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6">
                    <div className="sf-form form-group">
                      <Field
                        label="Est Start Time"
                        name={`${split}.est_start_time`}
                        component={CustomTimePicker}
                        timeFormat={"hh.mm A"}
                      />
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="sf-form form-group">
                      <Field
                        label="Est Finish Time"
                        name={`${split}.est_end_time`}
                        component={CustomTimePicker}
                        timeFormat={"hh.mm A"}
                      />
                    </div>
                  </div>
                </div>
                {/* </div> */}
                <div className="row">
                  <div className="col-md-12">
                    <fieldset className="form-group sf-form">
                      <Field
                        label={Strings.task_duration_txt}
                        name={`${split}.duration`}
                        type="text"
                        id="duration"
                        placeholder="1 DAY"
                        dataSource={this.state.durationDataSource}
                        component={CustomAutoCompleteSearch}
                        onSearch={this.handleDurationSearch} />
                    </fieldset>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <fieldset className="sf-form jc-calndr form-group">
                      <Field
                        name={`${split}.quote_notes`}
                        label="Notes"
                        type="text"
                        placeholder="Notes"
                        component={customTextarea}
                      />
                    </fieldset>
                  </div>
                </div>

              </>
            )
          })
        }
        <div className="row justify-content-center">
          {
            fields.length > 1
              ?
              <button class="normal-bnt add-line-bnt" type="button" onClick={() => fields.push({})}>
                <i class="material-icons">add</i><span>Add More Splits</span>
              </button>
              :
              <button class="normal-bnt add-line-bnt" type="button" onClick={() => fields.push({})}>
                <i class="material-icons">call_split</i>
                <span>Split Job</span>
              </button>
          }
        </div>
      </>
    )

  }

  handleTaskDelete = (fields, index) => {
    fields.remove(index);
    //API call to delete existing task here
  }

  calculateSingleTaskOutsourceValue = (task, siteIndex, taskIndex) => {
    // console.log(task);
    const { formValues } = this.props;

    let outsourceValue = formValues
      && formValues.job_outsource_sites
      && formValues.job_outsource_sites[siteIndex]
      && formValues.job_outsource_sites[siteIndex][taskIndex]
      && formValues.job_outsource_sites[siteIndex][taskIndex]
      && formValues.job_outsource_sites[siteIndex][taskIndex][0]
      && formValues.job_outsource_sites[siteIndex][taskIndex][0].outsourced_budget_to_sa
      ? Number(formValues.job_outsource_sites[siteIndex][taskIndex][0].outsourced_budget_to_sa)
      : task.outsourced_budget_to_sa;

    if (task.sub_tasks && task.sub_tasks.length > 0) {
      task.sub_tasks.forEach((subTask, subTaskIndex) => {
        outsourceValue = formValues
          && formValues.job_outsource_sites
          && formValues.job_outsource_sites[siteIndex]
          && formValues.job_outsource_sites[siteIndex][taskIndex]
          && formValues.job_outsource_sites[siteIndex][taskIndex]
          && formValues.job_outsource_sites[siteIndex][taskIndex][subTaskIndex + 1]
          && formValues.job_outsource_sites[siteIndex][taskIndex][subTaskIndex + 1].outsourced_budget_to_sa
          ? Number(outsourceValue + formValues.job_outsource_sites[siteIndex][taskIndex][subTaskIndex + 1].outsourced_budget_to_sa)
          : outsourceValue + subTask.outsourced_budget_to_sa;
      })
    }
    return outsourceValue;
  }

  calculateTaskProfitPercentage = (formValues, siteIndex, taskIndex, index, task) => {
    return parseFloat(100 - ((formValues.job_outsource_sites[siteIndex][taskIndex][index].outsourced_budget_to_sa / task.outsourced_budget) * 100)).toFixed(2)
  }

  render() {

    const { parentJobs, formValues, selectedTask, selectedScopeDoc, handleSubmit, initialValues } = this.props
    const { checkedJobs } = this.state;

    const clientDetails = selectedScopeDoc && selectedScopeDoc.client ? selectedScopeDoc.client : false;
    const clientPrimaryContactDetails = selectedScopeDoc && selectedScopeDoc.client_person ? selectedScopeDoc.client_person : false;
    // const jobSitesList = selectedScopeDoc && selectedScopeDoc.sites ? selectedScopeDoc.sites : false;
    const currentSelectedJob = parentJobs.filter(job => job.id === selectedTask.id);
    const jobSitesList = currentSelectedJob && currentSelectedJob[0] && currentSelectedJob[0].sites

    const jobNumber = currentSelectedJob && currentSelectedJob[0] && currentSelectedJob[0].job_title && currentSelectedJob[0].job_title && (currentSelectedJob[0].job_title.split('|| ')[1]).split('/')[0]

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
    return (
      <form onSubmit={handleSubmit(this.onSubmit)} className="col-md-3 sf-col-4">
        < div className="sf-card sf-shadow" >
          <span class="material-icons panel-cancel" onClick={() => this.props.onCancel()}>cancel</span>
          <div className="job-details-header">
            <label>Job Allocation</label>
            {/* <button className="bnt bnt-active" type="button" onClick={() => this.handleJobDetailsClick(selectedScopeDoc.id, selectedScopeDoc.client.id, selectedTask.quote_number)}>Job Details</button> */}
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
            <button className="bnt bnt-active" type="button" onClick={() => this.handleJobDetailsClick(currentSelectedJob[0].id, currentSelectedJob[0].client_id)}>Job Details</button>
          </div>

          {/* New Panel Header */}

          <div className="sf-card-body job-allocation-panel">
            <div className="new-ama-form">

              {/* <div className="ama-panel">
                <label>Client:</label>
                <div className="d-flex justify-content-between ">
                  <div className="view-text-value no-line">
                    <label>Name</label>
                    <span>{clientDetails && clientDetails.name}</span>
                  </div>
                  <div className="view-text-value no-line">
                    <label>Contact</label>
                    <span>{clientPrimaryContactDetails && clientPrimaryContactDetails.name}</span>
                  </div>
                  <div></div>
                </div>
              </div>
              <div className="view-text-value">
                <label>Job:</label>
                <span>{selectedTask.job_name}</span>
              </div> */}
              {
                this.state.visible ?
                  <>
                    {
                      jobSitesList && jobSitesList.map((siteItem, siteIndex) =>
                        <div className="ama-panel">
                          {
                            siteItem.tasks.length > 0 && <Collapse className="ama-collapse" bordered={false} expandIconPosition={'right'}
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
                                  siteItem.tasks && siteItem.tasks.length > 0 && siteItem.tasks.map((task, index) =>
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
                                                <label>Budget Value</label>
                                                <span>$ {task.outsourced_budget}</span>
                                              </div>
                                              <div className="view-text-value">
                                                <label>Outsource Value</label>
                                                <span>$ {Number(this.calculateSingleTaskOutsourceValue(task, siteIndex, index)).toFixed(2)}</span>
                                              </div>
                                              {
                                                (
                                                  this.props.formValues
                                                  && this.props.formValues.job_outsource_sites
                                                  && this.props.formValues.job_outsource_sites[siteIndex]
                                                  && this.props.formValues.job_outsource_sites[siteIndex][index]
                                                  && this.props.formValues.job_outsource_sites[siteIndex][index].every(task =>
                                                    // task.every(subTask =>
                                                    task.hasOwnProperty('duration') && task.duration !== ""
                                                    && task.hasOwnProperty('start_date') && task.start_date !== ""
                                                    && task.hasOwnProperty('quote_notes') && task.quote_notes !== "" && task.quote_notes !== null
                                                    && task.hasOwnProperty('service_agent_id') && task.service_agent_id !== "" && task.service_agent_id !== null
                                                    && task.hasOwnProperty('outsourced_budget_to_sa') && task.outsourced_budget_to_sa !== ""
                                                    && task.hasOwnProperty('est_start_time') && task.est_start_time !== "" && task.est_start_time !== null
                                                    && task.hasOwnProperty('est_end_time') && task.est_end_time !== "" && task.est_start_time !== null
                                                  )
                                                )
                                                  ? (
                                                    <span class="material-icons icon-task-panel job-outsource-icon-pass">check</span>
                                                  )
                                                  : (
                                                    <span class="material-icons icon-task-panel job-outsource-icon-fail">clear</span>
                                                  )
                                              }
                                            </div>
                                          </div>
                                        }
                                        key="1">
                                        <div className="d-flex flex-wrap">
                                          <div className="column task-data-column">
                                            <div className="view-text-value">
                                              <label>Scheduled Date</label>
                                              <span>{moment(task.start_date).format('YYYY-MM-DD')}</span>
                                            </div>
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
                                            <div className="view-text-value">
                                              <label>Allocated Budget</label>
                                              <span>{this.props.formValues.hasOwnProperty(`${task.id}_outsourced_budget`) ? `$ ${this.props.formValues[`${task.id}_outsourced_budget`]}` : task.outsourced_budget ? `$ ${task.outsourced_budget}` : '-'}</span>
                                            </div>
                                          </div>
                                        </div>
                                        <div className="sf-card">
                                          <div className="sf-card-body clnd-notes-dtl">
                                            <>
                                              <FieldArray name={`job_outsource_sites.${siteIndex}.${index}`} siteIndex={siteIndex} taskIndex={index} formValues={formValues} task={task} component={this.renderSplitTasks} />
                                            </>
                                            <div className="row justify-content-around mt-3">
                                              <button type="button" className="bnt bnt-normal">Cancel</button>
                                              <button
                                                type="button"
                                                className="bnt bnt-active task-save"
                                                disabled={
                                                  !(
                                                    this.props.formValues
                                                    && this.props.formValues.job_outsource_sites
                                                    && this.props.formValues.job_outsource_sites[siteIndex][index]
                                                    && this.props.formValues.job_outsource_sites[siteIndex][index].every(task =>
                                                      task.hasOwnProperty('duration')
                                                      && task.hasOwnProperty('start_date')
                                                      && task.hasOwnProperty('quote_notes')
                                                      && task.hasOwnProperty('service_agent_id')
                                                      && task.hasOwnProperty('outsourced_budget_to_sa')
                                                      && task.hasOwnProperty('est_start_time')
                                                      && task.hasOwnProperty('est_end_time')
                                                    )
                                                  )
                                                }
                                                onClick={() => this.handleTaskSave(
                                                  task,
                                                  siteIndex,
                                                  index,
                                                  this.props.formValues
                                                    && this.props.formValues.job_outsource_sites
                                                    && this.props.formValues.job_outsource_sites[siteIndex][index]
                                                    && this.props.formValues.job_outsource_sites[siteIndex][index].length > 1
                                                    ? true
                                                    : false
                                                )}>Outsource</button>
                                            </div>
                                          </div>
                                        </div>
                                        {
                                          task.sa_job_accept_statuses.length > 0
                                          && (
                                            <div className="job-accept-decline-table">
                                              <table className="table">
                                                <tbody>
                                                  {
                                                    task.sa_job_accept_statuses.map(rowItem => (
                                                      <tr className="job-accept-decline-table-row">
                                                        <td>{rowItem.service_agent_name}</td>
                                                        {rowItem.acept_decline_status === 1 ? <td className="row-item-accept-label">Accepted</td> : <td className="row-item-reject-label">Rejected</td>}
                                                        <td>{moment(rowItem.created_at).format('DD MMM YYYY')}</td>
                                                      </tr>
                                                    ))
                                                  }
                                                </tbody>
                                              </table>
                                            </div>
                                          )
                                        }
                                      </Panel>
                                    </Collapse>
                                  )
                                }
                              </Panel>
                            </Collapse>

                          }
                        </div>
                      )
                    }
                    <div className="ama-panel">
                      <div className="d-flex justify-content-between task-panel-bottom">
                        <div className="view-text-value">
                          <label>Budget Total</label>
                          <span>$ {parseFloat(this.calculateBudgetTotal()).toFixed(2)}</span>
                        </div>
                        <div className="view-text-value">
                          <label>Outsource Total</label>
                          <span>$ {parseFloat(this.calculateOutsourceTotal()).toFixed(2)}</span>
                        </div>
                        <div className="view-text-value">
                          <label>Profit%</label>
                          <span>{parseFloat((100 - ((this.calculateOutsourceTotal() / this.calculateBudgetTotal()) * 100))).toFixed(2)}%</span>
                        </div>
                      </div>
                    </div>
                    <div className="row justify-content-center">
                      <button type="submit" className="bnt bnt-active" disabled={this.handleDisableBudgetAllocation()}>Outsource Job</button>
                    </div>
                  </>
                  : null
              }
            </div>
          </div>
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  var value = ownProps.selectedTask ? ownProps.selectedTask : {}
  var scopeDocTasks = []
  if (value && value.sites) {
    value.sites.forEach(site => {
      if (site.tasks) {
        site.tasks.forEach(task => { if (task.service_agent_id) { } })
        scopeDocTasks = [...scopeDocTasks, ...site.tasks]
      }
    })
  }
  const initialValues = { job_outsource_sites: [] };
  if (ownProps.selectedTask && ownProps.selectedTask.sites) {
    ownProps.selectedTask.sites.forEach((site, siteIndex) => {
      initialValues.job_outsource_sites[siteIndex] = [];
      site.tasks.forEach((task, taskIndex) => {
        initialValues.job_outsource_sites[siteIndex].push([{
          service_agent_id: task.service_agent_id,
          outsourced_budget_to_sa: task.outsourced_budget_to_sa,
          start_date: task.start_date,
          duration: task.duration,
          quote_notes: task.quote_notes,
          est_start_time: task.est_start_time,
          est_end_time: task.est_end_time
        }]);
        if (task.sub_tasks) {
          task.sub_tasks.forEach((subTask, subTaskIndex) => {
            initialValues.job_outsource_sites[siteIndex][taskIndex].push({
              service_agent_id: subTask.service_agent_id,
              outsourced_budget_to_sa: subTask.outsourced_budget_to_sa,
              start_date: subTask.start_date,
              duration: subTask.duration,
              quote_notes: subTask.quote_notes,
              est_start_time: task.est_start_time,
              est_end_time: task.est_end_time
            });
          })
        }
      })
    })
  }
  return {
    initialValues: initialValues,
    selectedScopeDoc: (value ? value : {}),
    serviceAgents: state.organization.serviceAgents,
    jobs: state.jobsManagement.jobsList,
    formValues: state.form.JobOutsource && state.form.JobOutsource.values ? state.form.JobOutsource.values : {},
    groupedJobs: map_to_obj(groupBy(
      value && value.quote_number && scopeDocTasks && scopeDocTasks.length > 0 ?
        state.jobsManagement.jobsList.filter(job => scopeDocTasks.find(task => {
          return task.id == job.id
        })) :
        [],
      job => moment(job.start_date).format('MMMM'))),
    clientsList: state.clientManagement && state.clientManagement.clients,
    parentJobs: state.jobsManagement.parentJobs,
  }
}

const mapDispatchToProps = (dispatch) => {
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
  reduxForm({
    form: 'JobOutsource', enableReinitialize: true,
  })
)(JobOutsource)
