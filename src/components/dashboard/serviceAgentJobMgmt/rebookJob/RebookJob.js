import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Strings } from '../../../../dataProvider/localize'
import { Upload, Icon, Modal, Calendar, Select, Carousel, Collapse, TimePicker, Radio, Popover, Button, Steps, Divider, Dropdown, notification } from 'antd';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FieldArray } from 'redux-form';
import * as actions from '../../../../actions/SAJobMgmtAction';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import * as userAction from '../../../../actions/organizationUserAction';
import { getStorage, goBack, currencyFormat, handleFocus, goBackBrowser } from '../../../../utils/common';
import moment from 'moment'
import { customInput } from '../../../common/custom-input';
import EditSiteTask from '../../scope-doc/EditSiteTask';
import * as scopeDocActions from '../../../../actions/scopeDocActions';
import * as quoteAction from '../../../../actions/quoteAction';
import AmendQuoteTask from '../../scope-doc/AmendQuoteTask';
import TaskFileViews from '../../job/taskFilesView';
import { ERROR_NOTIFICATION_KEY } from '../../../../config';
const Option = Select.Option;
// Collapse

const { Panel } = Collapse;

export class RebookJob extends Component {

  tasksData = []

  state = {
    visible: false,
    selectedMember: false,
    showTaskEdit: 'none',
    selectedSiteTask: null,
    siteTasks: []
  };

  componentDidMount() {
    if (this.props.jobDetails.quote)
      this.props.quoteAction.generateQuote({ scope_doc_id: this.props.jobDetails.quote.scope_doc_id })
        .then(data => {
          this.setState({ quote_number: data.quote_number })
        })
        .catch((message) => {
          notification.error({
            key: ERROR_NOTIFICATION_KEY,
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        });
  }

  getSSDAreas = (areas) => {
    if (areas.length > 0) {
      const str = areas.map(area => {
        return area.area_name
      })
      const jointString = str.join(', ');
      return jointString;
    }
    return ''
  }

  handleEditTaskClick = (task_item) => {
    this.setState({
      showTaskEdit: 'block',
      selectedSiteTask: task_item,
    });
  }

  handleCancel = () => {
    this.setState({
      showTaskEdit: 'none',
    });
  }

  handleTaskDelete = (task_item) => {
    this.setState({ showTaskEdit: 'none' })
    Modal.confirm({
      title: "Delete Task",
      content: "Do you wants to delete this Task",
      onOk: () => this.handdleOk(task_item),
      cancelText: "Cancel",
    });
  }

  handdleOk = (task_item) => {
    var scope_docs_id = this.props.selectedScopeDoc.id
    this.props.action.deleteSiteTask(task_item.id, scope_docs_id, this.props.location.state).then((res) => {
      notification.success({
        message: Strings.success_title,
        description: res.message,
        onClick: () => { },
        className: 'ant-success'
      });
    }).catch((message) => {
      notification.error({
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });
  }

  updateTask = taskDetails => {

    const taskIndex = this.tasksData.findIndex(taskItem => taskItem.task_id.toString() === taskDetails.task_id.toString())
    if (taskIndex === -1) {
      this.tasksData.push(taskDetails)
    } else {
      this.tasksData[taskIndex] = taskDetails
    }
  }

  onSubmit = (formData) => {
    this.props.scopeDocActions.rebookJob(this.tasksData)
      .then((res) => {
        notification.success({
          message: Strings.success_title,
          description: res.message,
          onClick: () => { },
          className: 'ant-success'
        });
        this.props.reset()
        this.setState({ showSSDEdit: 'none', generateQuote: false })
        this.props.history.push({
          pathname: '/dashboard/job-details',
          state: {
            jobNo: this.props.jobDetails.job_number
          }
        })
      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });

    // var { jobDetails } = this.props;
    // const sites = jobDetails.quote && jobDetails.quote.scope_doc && jobDetails.quote.scope_doc.scope_docs_sites;
    // const selectedScopeDoc = jobDetails.quote && jobDetails.quote.scope_doc ? jobDetails.quote.scope_doc : {};
    // const quote = jobDetails.quote
    // this.props.scopeDocActions.UpdateScopeDoc({
    //   client_id: quote.client_id, quote_number: this.state.quote_number,
    //   scope_docs_id: quote.scope_doc_id, sites, save_quote_flag: true
    // }).then((res) => {
    //   Modal.success({
    //     title: Strings.success_title,
    //     content: res.message,
    //   });
    //   this.props.reset()
    //   this.setState({ showSSDEdit: 'none', generateQuote: false })
    // }).catch((message) => {
    //   Modal.error({
    //     title: Strings.error_title,
    //     content: Strings.generic_error,
    //   });
    // });
  }

  submitCallBack = () => {
    this.props.action.getJobDetails(this.props.jobDetails.job_number);
  }

  handleTaskFileView = (files, e) => {
    e.stopPropagation();
    if (files && files.length > 0) {
      this.setState({
        viewTaskFiles: true, taskFiles: files
      });
    }
  }

  handleCancel = () => {
    this.setState({
      viewTaskFiles: false,
      taskFiles: [],
    });
  }

  render() {

    var { jobDetails, handleSubmit } = this.props;
    const { siteTasks } = this.props
    if (!jobDetails)
      jobDetails = {};
    const sites = jobDetails.quote && jobDetails.quote.scope_doc && jobDetails.quote.scope_doc.scope_docs_sites;
    const selectedScopeDoc = jobDetails.quote && jobDetails.quote.scope_doc ? jobDetails.quote.scope_doc : {}

    return (
      <div className="sf-page-layout">

        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() =>
              // goBack(this.props)
              goBackBrowser(this.props)
            } />
            Rebook Job
          </h2>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            <div className="col-md-9">
              <div className="sf-card-wrap">
                {/* Safe Work Method Statement (SWMS) */}
                <div className="sf-card">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.safe_work_method_statement_swms}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body">
                    <div className="row">
                      <div className="col-md-10">
                        <h3 className="sf-big-hd">{jobDetails.quote && jobDetails.quote.client.name}</h3>
                        <div className="data-v-row">
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.abn}</label>
                              <span>{jobDetails.quote && jobDetails.quote.client.abn_acn}</span>
                            </div>
                          </div>
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.phone}</label>
                              <span>{jobDetails.quote && jobDetails.quote.client.contact_person_phone}</span>
                            </div>
                          </div>
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.email_txt}</label>
                              <span>{jobDetails.quote && jobDetails.quote.client.contact_person_email}</span>
                            </div>
                          </div>
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.address_txt}</label>
                              <span>{jobDetails.quote && jobDetails.quote.client.address}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-2">
                        <div className="co-logo">
                          {jobDetails.quote && jobDetails.quote.client.client_logo ? <img src={jobDetails.quote.client.client_logo} /> : null}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Site Details */}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.site_details}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body sign-swms-wrap">

                    <Collapse className="sign-swms-col" defaultActiveKey={['0']}>
                      {sites && sites.map((site, index) =>
                        <Panel className="sign-swms-items" header={site.site.site_name} key={index}>
                          <div className="data-v-row">
                            <div className="data-v-col">
                              <div className="view-text-value">
                                <label>{Strings.site_name}</label>
                                <span>{site.site.site_name}</span>
                              </div>
                            </div>
                            <div className="data-v-col">
                              <div className="view-text-value">
                                <label>{Strings.address_txt}</label>
                                <span>{site.site.street_address}</span>
                              </div>
                            </div>
                            <div className="data-v-col">
                              <div className="view-text-value">
                                <label>{Strings.swms_no}</label>
                                <span>{}</span>
                              </div>
                            </div>
                          </div>
                          <div className="normal-txt brt">
                            <span>All person involved in the works must have the SWMS explained and communicated to them prior to start of works.</span>
                          </div>
                        </Panel>
                      )}

                    </Collapse>
                  </div>
                  <div className="sf-card-body">
                    {/* <FormSection name="valuesOfTask"> */}
                    {selectedScopeDoc.scope_docs_sites ? selectedScopeDoc.scope_docs_sites.map((site_item, index) => (
                      <div className="add-n-site">
                        <div className="data-v-row">
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.job_name}</label>
                              <span>{site_item.site.job_name}</span>
                            </div>
                            <div className="info-btn">
                              {/* Drop down for card */}
                              {/*<Dropdown className="more-info" overlay={ssdMenu(site_item)}>
                                                            <Icon type="more" /></Dropdown>*/}
                              {/*Drop down*/}
                            </div>

                          </div>
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.site_name}</label>
                              <span>{site_item.site.site_name}</span>
                            </div>
                          </div>
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.address_txt}</label>
                              <span>{site_item.site.street_address + ", " + site_item.site.city + ", " + site_item.site.state + ", " + site_item.site.zip_code}</span>
                            </div>
                          </div>
                        </div>

                        {/* ----------------------------
                                                site service details
                                        ---------------------------- */}
                        <div className="site-ser-table">
                          {site_item.site.tasks.map((task_item, index) => (
                            <div className="task-wrapper">
                              <button className="dragde-bnt normal-bnt" type="button">
                                <i class="material-icons">more_horiz</i>
                                <i class="material-icons">more_horiz</i>
                              </button>
                              <div className="doc-action-bnt">
                                <button className="normal-bnt" type="button" onClick={() => this.handleEditTaskClick(task_item)}><i class="fa fa-pencil"></i></button>
                                <button className="normal-bnt" type="button" onClick={() => this.handleTaskDelete(task_item)}><i class="fa fa-trash-o"></i></button>
                              </div>
                              <div className="site-ser-view">
                                <div className="site-s-head">
                                  <div className="site-s-footer d-flex pt-0">
                                    <div className="view-text-value scodc-site-title">
                                      <label>{task_item.task_name}</label>
                                      <span>{task_item.description}</span>
                                    </div>
                                  </div>
                                </div>
                                <div className="site-s-body view-esti-sec">
                                  <div className="d-flex flex-wrap justify-content-between">
                                    <div className="data-v-row">
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.area_txt}</label>
                                          <span>{
                                            this.getSSDAreas(task_item.areas ? task_item.areas : [])
                                          }</span>
                                        </div>
                                      </div>
                                      {/* <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.estimate_txt}</label>
                                          <span>{task_item.estimate}</span>
                                        </div>
                                      </div> */}
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.frequency_txt}</label>
                                          <span>{task_item.frequency}</span>
                                        </div>
                                      </div>
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.duration_txt}</label>
                                          <span>{task_item.duration}</span>
                                        </div>
                                      </div>
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.start_date_txt}</label>
                                          <span>{moment(task_item.start_date).format("DD-MM-YYYY")}</span>
                                        </div>
                                      </div>
                                      {/* {
                                        task_item.file && task_item.file.length > 0 ? <div className="doc-sr-img" onClick={(evt) => this.handleTaskFileView(task_item.file, evt)} >
                                          {
                                            task_item.file.length > 1
                                              ? task_item.file.length > 9
                                                ? <i class="material-icons">filter_9_plus</i>
                                                : <i class="material-icons">{`filter_${task_item.file.length}`}</i>
                                              : null
                                          }
                                          <img alt="taskImage" src={task_item.file.length > 0 ? task_item.file[0].file_url : ''} />

                                        </div> : null
                                      } */}
                                      {
                                        task_item.file && task_item.file.length > 0 ? <div className="doc-sr-img" onClick={(evt) => this.handleTaskFileView(task_item.file, evt)} >
                                          {
                                            task_item.file.length > 1
                                              ? task_item.file.length > 9
                                                ? <i class="material-icons">filter_9_plus</i>
                                                : <i class="material-icons">{`filter_${task_item.file.length}`}</i>
                                              : null
                                          }
                                          <img alt="taskImage" src={task_item.file.length > 0 ? task_item.file[0].file_url : ''} />

                                        </div> : null
                                      }
                                    </div>
                                    {/* estimate details tables */}


                                    {task_item.estimate ? <div className="esti-data-view">
                                      {typeof task_item.estimate === 'string' ?
                                        <div className="data-v-col">
                                          <div className="view-text-value">
                                            <label>{Strings.estimate_txt}</label>
                                            <span>{task_item.estimate}</span>
                                          </div>
                                        </div>
                                        :
                                        <>
                                          <label className="esti-hrs-hd">{Strings.estimate_txt}
                                            <span className="qunty-rate">{currencyFormat(this.calculateEstimate(task_item.estimate))}</span> <b>{task_item.estimate && task_item.estimate.estimate_type
                                              && task_item.estimate.estimate_type.toUpperCase()}</b></label>
                                          <div className="esti-table">
                                            {task_item.estimate && task_item.estimate.estimate_type === "hours" ? <table className="table">
                                              <tr className="est-sc-thd">
                                                <th>Staff</th>
                                                <th>Hours</th>
                                                <th>Days</th>
                                                <th>Rate</th>
                                              </tr>
                                              <tr>
                                                <td>{task_item.estimate.staff}</td>
                                                <td>{task_item.estimate.hours}</td>
                                                <td>{task_item.estimate.days}</td>
                                                <td>{currencyFormat(task_item.estimate.rate)}</td>
                                              </tr>
                                            </table> :
                                              task_item.estimate && task_item.estimate.estimate_type === "area" ?

                                                <table className="table ">
                                                  <tr className="est-sc-thd">
                                                    <th>SQM</th>
                                                    <th>Rate</th>
                                                  </tr>
                                                  <tr>
                                                    <td>{task_item.estimate.sqm}</td>
                                                    <td>{currencyFormat(task_item.estimate.rate)}</td>
                                                  </tr>
                                                </table> :
                                                task_item.estimate && task_item.estimate.estimate_type === "quant" ?
                                                  <table className="table">
                                                    <tr className="est-sc-thd">
                                                      <th>Quantity</th>
                                                      <th>Rate</th>
                                                    </tr>
                                                    <tr>
                                                      <td>{task_item.estimate.quant}</td>
                                                      <td>{currencyFormat(task_item.estimate.rate)}</td>
                                                    </tr>
                                                  </table> : null}
                                          </div>
                                        </>}
                                    </div> : null}
                                  </div>
                                  <div className="site-s-footer d-flex justify-content-between sco-note-vlue">
                                    <div className="view-text-value">
                                      <label>Notes</label>
                                      <span>{task_item.note}</span>
                                    </div>

                                    {selectedScopeDoc.quote_number ? <div className="data-v-col">
                                      <div className="view-text-value">
                                        <label>{"Value"}</label>
                                        <span>{currencyFormat(task_item.amount)}</span>
                                      </div>
                                    </div> : null}

                                    {this.state.generateQuote ?
                                      <div onClick={this.handleChildClick} className="quote-vlue qto-position-st">
                                        <fieldset className="form-group sf-form" >
                                          <Field
                                            label="Value"
                                            name={`value$${site_item.site_id}_${task_item.id}`}
                                            type="text"
                                            id="name"
                                            component={customInput} />
                                        </fieldset>
                                      </div> : null}
                                  </div>
                                </div>
                              </div>
                              {this.state.generateQuote ?
                                <div className="quote-vlue">
                                  <fieldset className="form-group sf-form">
                                    <Field
                                      label="Value"
                                      name={`value$${site_item.site_id}_${task_item.id}`}
                                      type="text"
                                      id="name"
                                      onFocus={(e1, e2) => { }}
                                      component={customInput} />
                                  </fieldset>
                                </div> : null}
                            </div>
                          ))}
                        </div>
                        {/* ----------------------------
                                                    End
                                        ---------------------------- */}

                      </div>
                    )) : ''}
                    {/* </FormSection> */}

                  </div>
                </div>
              </div>
              <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                <form onSubmit={handleSubmit(this.onSubmit)}>
                  <div className="btn-hs-icon">
                    <button type="submit" class="bnt bnt-normal" >
                      {Strings.amend_quote_rebook}</button>
                  </div>
                </form>
              </div>
            </div>
            {/** Show Edit Task */}
            <div className="col-lg-3 col-md-12" style={{ display: this.state.showTaskEdit }} >
              {/* <EditSiteTask
                selectedScopeDoc={selectedScopeDoc}
                initialValues={this.state.selectedSiteTask}
                fileItems={this.state.selectedSiteTask && this.state.selectedSiteTask.file}
                selectedScopeDocID={selectedScopeDoc.scope_doc_id}
                handleCancel={this.handleCancel}
                submitCallBack={this.submitCallBack}
              /> */}
              {/* showClientDetailsEdit={this.state.showClientDetailsEdit} */}
              {
                <AmendQuoteTask
                  selectedScopeDoc={selectedScopeDoc}
                  initialValues={this.state.selectedSiteTask}
                  handleCancel={this.handleCancel}
                  selectedScopeDocID={selectedScopeDoc.scope_doc_id}
                  submitCallBack={this.submitCallBack}
                  updateTaskDetailsInView={(task) => this.updateTask(task)}
                />
              }
            </div>
          </div>
          <Modal
            visible={this.state.viewTaskFiles}
            className="job-img-gallery"
            zIndex="99999"
            footer={null}
            onCancel={this.handleCancel}>
            <TaskFileViews taskFiles={this.state.taskFiles} />
          </Modal>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    jobDetails: state.sAJobMgmt.jobDetails && state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] ?
      state.sAJobMgmt.jobDetails.job_details[0] : {},
    swmsSignDetails: state.sAJobMgmt.swmsSignDetails,
    taskSWMS: state.sAJobMgmt.jobDetails.task_swms ?
      state.sAJobMgmt.jobDetails.task_swms : [],
    tasksData: state.sAJobMgmt.jobDetails
      && state.sAJobMgmt.jobDetails.job_details
      && state.sAJobMgmt.jobDetails.job_details[0]
      ? state.sAJobMgmt.jobDetails.job_details[0]
      && state.sAJobMgmt.jobDetails.job_details[0].quote
      && state.sAJobMgmt.jobDetails.job_details[0].quote.scope_doc
      && state.sAJobMgmt.jobDetails.job_details[0].quote.scope_doc.scope_docs_sites
      && state.sAJobMgmt.jobDetails.job_details[0].quote.scope_doc.scope_docs_sites.map(site_item => {
        return site_item
          && site_item.site
          && site_item.site.tasks
          && site_item.site.tasks.map(task_item => ({
            start_date: task_item.start_date,
            end_date: task_item.end_date,
            task_id: task_item.id
          }))
      })
      : []
  }
}
const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    scopeDocActions: bindActionCreators(scopeDocActions, dispatch),
    quoteAction: bindActionCreators(quoteAction, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'rebookJob',
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(RebookJob)
