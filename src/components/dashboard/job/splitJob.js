import React from 'react';
import { Checkbox, notification, Popover, Button, Collapse, Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FieldArray } from 'redux-form';
import moment from 'moment';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';

import * as jobCalendarActions from '../../../actions/jobCalendarActions';
import * as quoteAction from '../../../actions/quoteAction';
import * as scopeDocAction from '../../../actions/scopeDocActions';
import { Strings, validationString } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL, CLIENTS_GET_CLIENTS_LIST } from '../../../dataProvider/constant';
import { goBack, handleFocus } from '../../../utils/common';
import { getStorage, setStorage } from '../../../utils/common';
import CoreCalendar from './Calendar/CoreCalendar';
import { groupBy, map_to_obj } from '../../../utils/common';
import { CustomTimePicker } from '../../common/customTimePicker';
import { customInput } from '../../common/custom-input';
import { DeepTrim } from '../../../utils/common';

import { splitStartDateRequired, splitNumberOfShiftsRequired } from '../../../utils/Validations/dateTimeDropdownValidations'

const { Panel } = Collapse

class SplitJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      splitFlag: false, durationDataSource: []
    };
  }

  componentDidMount() {
  }

  handleSplit = () => {
    this.setState({ splitFlag: true })
    this.props.onSplit()
  }

  durations = ["Day", "Week", "Fortnight", "Month", "Year"];

  add_more_sa = (job, member) => {
    return <fieldset className="add-sa-search no-label form-group sf-form select-wibg">
      <Field
        name={`${member}.service_agent_id`}
        placeholder="Select Service Agent"
        dataSource={this.props.serviceAgents.map(agent => ({ text: agent.name, value: agent.id }))}
        component={CustomAutoCompleteSearch}
        onSelect={(val) => this.handleServiceAgentSelection(val, job)} />
    </fieldset>
  }

  handleServiceAgentSelection = (value, job) => {

  }

  handleDurationSearch = value => {
    var letterNumber = /^[1-9]+$/;
    if (value.match(letterNumber)) {
      let post = value > 1 ? "s" : ""
      this.setState({
        durationDataSource: !value ? [] : this.durations.map(title => ({ text: value + " " + title + post, value: value + "_" + (title + post).toUpperCase() })),
      });
    } else {
      this.setState({
        durationDataSource: !value ? [] : this.durations.map(title => ({ text: title, value: title.toString() })),
      });
    }
  };

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.selectedJob.id !== this.props.selectedJob.id) {
      this.handleCancel()
    }
  }

  handleDelete = (fields, index) => {
    if (fields.length === 2 && (!this.props.selectedJob.sub_tasks || this.props.selectedJob.sub_tasks.length === 0)) {
      notification.error({
        message: Strings.validate_title,
        description: validationString.split_task_count_error,
        className: 'ant-error'
      })
    } else {
      fields.remove(index);
      /* Temporary Solution Begins*/
      if (index === 0) {
        this.handleCancel()
      }
      /* Temporary Solution Ends*/
    }
  }

  disabledDate = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  renderMembers = ({ fields, subTaskFlag, meta: { error, submitFailed, dirty } }) => {
    if (fields.length === 0 && !dirty && (!this.props.selectedJob.sub_tasks || (this.props.selectedJob.sub_tasks && this.props.selectedJob.sub_tasks.length === 0))) {
      fields.push({})
      this.props.change(`split_job_${this.props.selectedJob.id}][${0}].start_date`, this.props.selectedJob.start_date)
      fields.push({})
      this.props.change(`split_job_${this.props.selectedJob.id}][${1}].start_date`, this.props.selectedJob.start_date)
    } else if (fields.length === 0 && (this.props.selectedJob.sub_tasks && this.props.selectedJob.sub_tasks.length > 0)) {
      fields.push({})
      this.props.change(`split_job_${this.props.selectedJob.id}][${0}].start_date`, this.props.selectedJob.start_date)
    }

    const { formValues, serviceAgents } = this.props

    return (
      <>
        <div className="sf-c-table org-user-table ve-a-user-t">
          {fields.map((member, index) => {
            return (
              <div className="split-job-plp">
                <div className="split-jc-chkbx">
                  <div className="sf-chkbx-group">
                    <Checkbox disabled />

                    {/* Split numbering below */}

                    <span className="split-jc-no">
                      {
                        this.props.selectedJob.sub_tasks
                          && this.props.selectedJob.sub_tasks.length > 0
                          ? `Split ${this.props.selectedJob.sub_tasks.length + index + 1}`
                          : `Split ${index + 1}`
                      }
                    </span>
                  </div>
                  <button className='delete-bnt split-dlt-bnt' type='button' onClick={() =>
                    this.handleDelete(fields, index)}><i class="fa fa-trash-o"></i></button>

                  {/* Add SA Popover for new split -- begins */}

                  {
                    formValues[`split_job_${this.props.selectedJob.id}`]
                      && serviceAgents.find(agent => agent.id == formValues[`split_job_${this.props.selectedJob.id}`][index].service_agent_id)
                      ? <div className="spil-jc-popover">
                        <Popover className="bnt-simple add-sa-bnt"
                          placement="bottomRight"
                          content={this.add_more_sa(this.props.selectedJob, member)}
                          trigger="click"
                        >
                          <Button>{serviceAgents.find(agent => agent.id == formValues[`split_job_${this.props.selectedJob.id}`][index].service_agent_id).name}</Button>
                        </Popover>
                        <button className="jc-outsource normal-bnt" disabled type='button'>Outsource Job</button>
                      </div>
                      : <div className="spil-jc-popover">
                        <Popover className="bnt-simple add-sa-bnt"
                          placement="bottomRight"
                          content={this.add_more_sa(this.props.selectedJob, member)}
                          trigger="click"
                        >
                          <Button><i className="material-icons">add_circle</i> Add SA</Button>
                        </Popover>
                        <button className="jc-outsource normal-bnt" disabled type='button'>
                          Outsource Job</button>
                      </div>
                  }

                  {/* Add SA Popover for new split -- ends */}

                </div>

                {/* New form -- begins */}

                <div className="date-time-durtion">
                  <Collapse
                    bordered={false}
                    expandIconPosition={'right'}
                    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? -90 : 90} />}>
                    <Panel header="Start Date/Time" key="1" className="dt-dur-style">
                      <div className="row ml-0">
                        <div className="col-md-6">
                          <fieldset className="jc-calndr form-group sf-form no-label">
                            <Field
                              name={`${member}.start_date`}
                              type="date"
                              validate={splitStartDateRequired}
                              disabledDate={this.disabledDate}
                              component={CustomDatepicker} />
                          </fieldset>
                        </div>
                        <div className="col-md-6">
                          <div className="sf-form form-group no-label">
                            <Field
                              name={`${member}.start_time`}
                              component={CustomTimePicker} />
                          </div>
                        </div>
                      </div>
                      <fieldset className="jc-calndr sf-form label-block">
                        <Field
                          name={`${member}.number_of_shifts`}
                          type="text"
                          validate={splitNumberOfShiftsRequired}
                          placeholder="3 Shifts"
                          label={Strings.number_shifts_txt}
                          component={customInput} />
                      </fieldset>
                    </Panel>
                  </Collapse>
                </div>

                {/* New form -- ends */}

              </div>

            )
          })}
        </div>
        <div className="btn-hs-icon sm-bnt bnt-error">
          <button class="normal-bnt add-line-bnt mt-3" type="button" onClick={() => {
            fields.push({ start_date: this.props.selectedJob.start_date })
            this.props.change(`split_job_${this.props.selectedJob.id}][${0}].start_date`, this.props.selectedJob.start_date)
          }}>
            <i class="material-icons">add</i><span>Add More Splits</span></button>
          {submitFailed && error && <span className="error-input">{error}</span>}
        </div>
      </>
    )
  }

  onSubmit = async (formData) => {
		formData = await DeepTrim(formData);

    formData.split_job = formData[`split_job_${this.props.selectedJob.id}`];
    formData.task_id = this.props.selectedJob.id;
    formData.split_job.forEach(job => {
      job.number_of_shifts = parseInt(job.number_of_shifts)
      job.service_agent_id = parseInt(job.service_agent_id)
      job.start_date = moment(job.start_date).format('YYYY-MM-DD');
      job.start_time = moment(job.start_time).format('HH:mm:ss');
    })
    this.props.quoteAction.splitJob(formData).then((res) => {
      this.props.scopeDocAction.getScopeDocDetails(this.props.selectedScopeDoc.id);
      this.props.jobCalendarActions
        .getJobsList(this.props.selectedScopeDoc && this.props.selectedScopeDoc.quotes &&
          this.props.selectedScopeDoc.quotes.length > 0 && this.props.selectedScopeDoc.quotes[0].id)
      notification.success({
        message: Strings.success_title,
        description: res.message,
        onClick: () => { },
        className: 'ant-success'
      });
      this.handleCancel();
      this.props.reset();
    }).catch((message) => {
      notification.error({
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });
  }

  handleCancel = () => {
    this.props.reset()
    this.setState({ splitFlag: false })
    this.props.onUnsplit()
  }

  render() {
    const { handleSubmit, subTaskFlag, formValues } = this.props;
    const { splitFlag } = this.state;
    let keyIndex = `split_job_${this.props.selectedJob.id}`
    return (
      <>
        {
          (!splitFlag && !subTaskFlag) || (this.props.selectedJob.id !== this.props.currentSplitJobId) 
            ? (
              <button class="normal-bnt add-line-bnt mt-3" type="button" onClick={this.handleSplit}>
                <i class="material-icons">call_split</i>
                <span>Split Job</span>
              </button>
            )
            : !splitFlag && subTaskFlag
              ? <button class="normal-bnt add-line-bnt mt-3" type="button" onClick={this.handleSplit}>
                  <i class="material-icons">add</i><span>Add More Splits</span>
                </button>
              : <form onSubmit={handleSubmit(this.onSubmit)} className='mt-4'>
                  <FieldArray name={`split_job_${this.props.selectedJob.id}`} component={this.renderMembers} subTaskFlag={subTaskFlag} />
                  {
                    formValues[keyIndex] && formValues[keyIndex].length > 0
                      ? <div className="all-btn multibnt mt-4">
                          <div className="btn-hs-icon d-flex justify-content-between">
                            <button onClick={this.handleCancel} className="bnt bnt-normal" type="button">
                              {Strings.cancel_btn}</button>
                            <button type="submit" className="bnt bnt-active">{Strings.save_btn}</button>
                          </div>
                        </div>
                      : null
                  }
                </form>
        }
      </>
    )
  }
}



const mapStateToProps = (state) => {
  var value = state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : {};
  return {
    selectedScopeDoc: (value ? value : {}),
    serviceAgents: state.organization.serviceAgents,
    jobs: state.jobsManagement.jobsList,
    formValues: state.form.splitJob && state.form.splitJob.values ? state.form.splitJob.values : {},
    groupedJobs: map_to_obj(groupBy(state.jobsManagement.jobsList, job => moment(job.start_date).format('MMMM')))
  }
}

const mapDispatchToprops = dispatch => {
  return {
    jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
    quoteAction: bindActionCreators(quoteAction, dispatch),
    scopeDocAction: bindActionCreators(scopeDocAction, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({ form: 'splitJob', enableReinitialize: true,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  } })
)(SplitJob)