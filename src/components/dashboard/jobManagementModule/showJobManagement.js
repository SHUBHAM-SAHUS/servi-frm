import React, { Component } from 'react';
import { Icon, Modal, Select, Dropdown, Menu, notification } from 'antd';
import { connect } from 'react-redux';
import { reduxForm, Field, isDirty } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import { Route } from 'react-router-dom';
import $ from 'jquery';

import * as actions from '../../../actions/roleManagementActions';
import * as scopeDocActions from '../../../actions/scopeDocActions';
import * as accessControlAction from '../../../actions/accessControlManagementAction';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL, USER_NAME } from '../../../dataProvider/constant';
import { getStorage, setStorage, goBack, currencyFormat, handleFocus } from '../../../utils/common';
import JobManagementSearch from './JobManagementSearch';
import { customInput } from '../../common/custom-input';
import { validate } from '../../../utils/Validations/roleValidation';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomSelect } from '../../common/customSelect';
import * as jobManagementAction from '../../../actions/jobManagementAction';
import * as sAJobMgmtAction from '../../../actions/SAJobMgmtAction';

import PreviewJobReport from '../../dashboard/serviceAgentJobMgmt/jobReport/PreviewJobReport';
import PreviewSignoffSheet from '../../dashboard/serviceAgentJobMgmt/signOffSheet/PreviewSignoffSheet'
import * as quoteAction from '../../../actions/quoteAction';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
const { Option, OptGroup } = Select;

// import * as timeSheetAction from '../../../../actions/timeSheetAction';
// import UpdateSingleUser from '../../organization/UpdateSingleUser.js';



class ShowJobManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      togleSearch: true,
      inlineUsers: [],
      signOffSheetVisible: false
    }
  }

  componentDidMount() {
    this.props.jobManagementAction.getCompletedJobDetail(this.props.location.state.job_number)
      .then(() => {

      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  }
  createRoleHandler = () => {
    this.props.history.push(this.props.match.path + '/createRole')
  }

  handleSearchToggle = () => {
    this.setState({ togleSearch: !this.state.togleSearch })
  }

  roleAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["job_calendar"].permissions;
  /**Permissions for the module */
  permissions = {
    sf_job_calendar_job_calendar: this.roleAccessControl.findIndex(acess => acess.control_name === 'sf_job_calendar_job_calendar')
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }


  acceptCompletedJob = (jobNumber) => {
    this.props.jobManagementAction.acceptCompletedJob(jobNumber)
      .then((message) => {
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: message,
            onClick: () => { },
            className: 'ant-success'
          });
          this.props.jobManagementAction.getCompletedJobDetail(this.props.location.state.job_number)
            .then(() => {

            })
            .catch(message => {
              notification.error({
                key: ERROR_NOTIFICATION_KEY,
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
              });
            })
        }
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  };


  handleSendForApproval = (jobNumber) => {
    this.props.quoteAction.adminListGet().then(flag => {
      Modal.confirm({
        title: Strings.quote_select_admin,
        content:
          <Select className="sf-form w-100"
            onChange={(value) => {
              this.admin_user_name = value;
            }}>
            {this.props.adminList ? this.props.adminList.map((item) =>
              (<Option value={item.user_name}>{item.first_name}</Option>)) :
              null}
          </Select>
        ,
        onOk: () => {
          this.sendCompletedJobForApproval(jobNumber, this.admin_user_name)
        },
        onCancel() { },
      });
    })
  }

  sendCompletedJobForApproval = (jobNumber, user_name) => {
    this.props.jobManagementAction.sendJobForApproval(jobNumber, user_name)
      .then((message) => {
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: message,
            onClick: () => { },
            className: 'ant-success'
          });
          this.props.jobManagementAction.getCompletedJobDetail(this.props.location.state.job_number)
            .then(() => {

            })
            .catch(message => {
              notification.error({
                key: ERROR_NOTIFICATION_KEY,
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
              });
            })
        }
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  };

  approveCompletedJob = (jobNumber) => {
    this.props.jobManagementAction.approveCompletedJob(jobNumber, getStorage(USER_NAME), 1)
      .then((message) => {
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: message,
            onClick: () => { },
            className: 'ant-success'
          });
          this.props.jobManagementAction.getCompletedJobDetail(this.props.location.state.job_number)
            .then(() => {

            })
            .catch(message => {
              notification.error({
                key: ERROR_NOTIFICATION_KEY,
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
              });
            })
        }
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  };

  showModal = () => {

    this.setState({
      visible: true,
    });
    this.props.sAJobMgmtAction.getJobReport(this.props.completedJobDetail.id);
    this.props.sAJobMgmtAction.getJobDetails(this.props.completedJobDetail.job_number);
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
    this.props.history.push('./showJob');

  };

  handleCancel = e => {
    this.setState({
      visible: false,
      signOffSheetVisible: false
    });
  };

  roleAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["org_manage_completed_job"].permissions;
  /**Permissions for the module */
  permissions = {
    sf_job_mgmt_controller_approve_completed_job: this.roleAccessControl.findIndex(acess => acess.control_name === 'sf_jobs_controller_update_completed_job_approval'),
    sf_job_mgmt_controller_send_for_admin_approval: this.roleAccessControl.findIndex(acess => acess.control_name === "sf_jobs_controller_send_job_for_admin_approval"),

  }




  showStatus = () => {

    const { completedJobDetail } = this.props;
    let jobStatus = 'Completed';
    if (completedJobDetail) {
      if (completedJobDetail.completed_job_accept_status == 0) {
        jobStatus = 'Completed';
      } else if (completedJobDetail.completed_job_accept_status == 1 && completedJobDetail.completed_job_approver == null) {
        jobStatus = 'Approved by AM';
      } else if (completedJobDetail.completed_job_accept_status == 1 && completedJobDetail.completed_job_approver !== null && completedJobDetail.completed_job_approve_status == 0) {
        jobStatus = 'Pending Admin Approval';
      } else if (completedJobDetail.completed_job_approve_status == 1 && completedJobDetail.completed_job_approver !== null) {
        jobStatus = 'Admin Approved';
      }
    }


    return jobStatus;
  }

  handleQuoteClick = (clientId, scopeDocId) => {
    this.props.scopeDocAction.getScopeDocDetails(scopeDocId)
      .then((flag) => {
        this.props.scopeDocAction.getPrimaryPersons(clientId)
        this.props.history.push({ pathname: '../scopedoc/showScopeDoc', state: scopeDocId })
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

  handleClientSignOff = (signOffStatus, jobNumber) => {
    if (!signOffStatus) {
      this.props.history.push({ pathname: '../../dashboard/emailJobSignOff' })
    } else {
      this.props.sAJobMgmtAction.getJobSignOff(jobNumber);
      this.setState({ signOffSheetVisible: true })
    }
  }

  render() {
    const { completedJobDetail, taskList } = this.props;
    const jobAssociatedClientId = completedJobDetail && completedJobDetail.client && completedJobDetail.client.id ? completedJobDetail.client.id : null;
    const jobAssociatedScopeDocId = completedJobDetail && completedJobDetail.tasks && Array.isArray(completedJobDetail.tasks) && completedJobDetail.tasks[0] && completedJobDetail.tasks[0].scope_doc_id ? completedJobDetail.tasks[0].scope_doc_id : null;
    const jobAssociatedSignOffSheetStatus = completedJobDetail.job_sheet_sign_off_status;
    const jobNumber = completedJobDetail.job_number;

    return (
      <>
        <form>
          <div className="sf-card-wrap">
            {/* zoom button  */}
            <div className="card-expands">
              <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
            </div>

            {/* Job Details */}
            <div className="sf-card">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">{Strings.job_details_txt}</h2>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body mt-2">
                <div className="data-v-row">
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>Job Id</label>
                      <span className="active-txt">{completedJobDetail ? completedJobDetail.job_number : ''}</span>
                    </div>
                  </div>
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>Job Name</label>
                      <span className="active-txt">{completedJobDetail ? completedJobDetail.job_name : ''}</span>
                    </div>
                  </div>
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>{Strings.client_name}</label>
                      <span>{completedJobDetail && completedJobDetail.client ? completedJobDetail.client.name : ''}</span>
                    </div>
                  </div>
                  {/* <div class="data-v-col">
                                    <div class="view-text-value">
                                        <label>{Strings.site_name}</label>
                                        <span>{completedJobDetail ? completedJobDetail.site_contact_name : ''}</span>
                                    </div>
                                </div>
                                <div class="data-v-col">
                                    <div class="view-text-value">
                                        <label>{Strings.site_contact_number}</label>
                                        <span>{completedJobDetail ? completedJobDetail.site_contact_number : ''}</span>
                                    </div>
                                </div> */}
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>{Strings.status}</label>
                      {/* <span>{completedJobDetail &&
                                            completedJobDetail.completed_job_accept_status == 0 ? ' Job not accepted' : 'Job Accepted'}</span> */}
                      <span>{this.showStatus()}</span>
                    </div>
                  </div>
                  {/* <div class="data-v-col">
                                    <div class="view-text-value">
                                        <label>{Strings.job_approval_status}</label>
                                        <span>{completedJobDetail
                                            && completedJobDetail.completed_job_approve_status == 0 && completedJobDetail.completed_job_approver === null ? 'Not Approved' :
                                            (completedJobDetail
                                                && completedJobDetail.completed_job_approve_status == 0 && completedJobDetail.completed_job_approver ? 'Pending' : 'Approved')}</span>
                                    </div>
                                </div> */}
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>Report</label>

                      {/* <span><a className="normal-link" onClick={this.showModal}>View Link</a></span> */}

                      <div className="stff-action-bnt">
                        <button type="button" className="normal-bnt" onClick={this.showModal}><i className="material-icons">remove_red_eye</i></button>
                      </div>
                    </div>
                  </div>
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>Quote</label>
                      <div className="stff-action-bnt">
                        <button type="button" className="normal-bnt" onClick={() => this.handleQuoteClick(jobAssociatedClientId, jobAssociatedScopeDocId)}>
                          <i className="material-icons">description</i></button>
                      </div>

                    </div>
                  </div>

                  {completedJobDetail && completedJobDetail.job_invoices && completedJobDetail.job_invoices[0] &&
                    completedJobDetail.job_invoices[0].invoice_file ?
                    <div class="data-v-col">
                      <div class="view-text-value">
                        <label>Invoice</label>
                        <div className="stff-action-bnt">
                          <a href={completedJobDetail.job_invoices[0].invoice_file}>
                            <i className="material-icons">
                              get_app</i>
                          </a>
                        </div>
                      </div>
                    </div> : null}

                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>Client Sign-Off</label>
                      <div className="stff-action-bnt">
                        <button type="button" className="normal-bnt" onClick={() => this.handleClientSignOff(jobAssociatedSignOffSheetStatus, jobNumber)} > <i className="material-icons">remove_red_eye</i></button>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

            {/* Staff Timesheet */}
            <div className="sf-card  mt-4">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">Service Details</h2>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body mt-2">
                <div className="staff-timesheet-table">
                  <table className="add-user-table table">
                    <tr>
                      <th></th>
                      <th>Service Name</th>
                      <th>Site Name</th>
                      <th>Areas</th>
                      <th>Notes</th>
                      <th>Allocated Budget</th>

                    </tr>

                    {taskList && taskList.length && taskList.map((task, index) => {
                      return (
                        <tr>
                          <td></td>
                          <td>{task.task_name}</td>
                          <td>{task.site_name}</td>
                          <td>{task.area_name ? task.area_name : ''}</td>
                          <td>{task.description && task.description !== 'null' ? task.description : ''}</td>
                          <td>{currencyFormat(task.allocated_budget)}</td>
                        </tr>
                      )
                    })}
                  </table>
                </div>
              </div>
            </div>

            {/* save timeSheets button */}
            <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
              {completedJobDetail && completedJobDetail.completed_job_accept_status === 0 &&
                this.permissions.sf_job_mgmt_controller_approve_completed_job != -1 ?
                <div className="btn-hs-icon">
                  <button className="bnt bnt-normal" type="button" onClick={() => this.acceptCompletedJob(completedJobDetail.job_number)}>
                    {Strings.completed_job_accept}</button>
                </div>
                : ''
              }
              {completedJobDetail && (completedJobDetail.completed_job_approve_status === 0 || completedJobDetail.completed_job_approve_status === 2)
                && !completedJobDetail.completed_job_approver
                && this.permissions
                  .sf_job_mgmt_controller_send_for_admin_approval != -1
                && completedJobDetail.completed_job_accept_status === 1
                ?

                <div className="btn-hs-icon">
                  <button type="button" className="bnt bnt-active" onClick={() => this.handleSendForApproval(completedJobDetail.job_number)}>
                    Send For Approval</button>
                </div>
                : ''
              }
              {completedJobDetail && completedJobDetail.completed_job_approve_status !== 1 && completedJobDetail.completed_job_approver == getStorage(USER_NAME) ?

                <div className="btn-hs-icon">
                  <button type="button" className="bnt bnt-active" onClick={() => this.approveCompletedJob(completedJobDetail.job_number)}>
                    Approve</button>
                </div>
                : ''
              }
            </div>
            {/* Job Report Modal  */}
            <Modal
              title="Basic Modal"
              visible={this.state.visible}
              onOk={this.handleOk}
              // footer={null}
              okText={Strings.email_job_docs_bnt}
              width="100%"
              className="job-doc-preview"
              onCancel={this.handleCancel}
            >
              <PreviewJobReport />

            </Modal>
          </div>
          <div>
            <Modal
              title="Basic Modal"
              visible={this.state.signOffSheetVisible}
              onOk={() => this.props.history.push('./emailJobSignOff')}
              // footer={null}
              okText={Strings.email_job_docs_bnt}
              width="100%"
              className="job-doc-preview"
              onCancel={this.handleCancel}>
              <PreviewSignoffSheet />
            </Modal>
          </div>
        </form>
      </>

    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    completedJobDetailFromProp: props.location.state,
    completedJobDetail: state.completedJobManagement.completedJobDetail,
    taskList: state.completedJobManagement && state.completedJobManagement.completedJobDetail
      && state.completedJobManagement.completedJobDetail.tasks,
    jobReports: state.sAJobMgmt.jobReports,
    adminList: state.scopeDocs.adminList,

  }
}

const mapDispatchToprops = dispatch => ({
  jobManagementAction: bindActionCreators(jobManagementAction, dispatch),
  action: bindActionCreators(actions, dispatch),
  scopeDocAction: bindActionCreators(scopeDocActions, dispatch),
  sAJobMgmtAction: bindActionCreators(sAJobMgmtAction, dispatch),
  quoteAction: bindActionCreators(quoteAction, dispatch)

})

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'ShowJobManagement', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ShowJobManagement)
