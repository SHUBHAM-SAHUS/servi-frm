import React from 'react';
import { Icon, Modal, Progress, Tabs, Dropdown, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../../../utils/Validations/subscriptionValidate';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Strings } from '../../../dataProvider/localize';
import * as jobManagerAction from '../../../actions/jobMangerAction'
import * as sAJobMgmtAction from '../../../actions/SAJobMgmtAction';
import { withRouter } from 'react-router-dom';
import { getStorage, handleFocus } from '../../../utils/common';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import * as userActions from '../../../actions/profileManagementActions';
import moment from 'moment';


const { TabPane } = Tabs;

// upload user profile pic



class JobListView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      panelView: null
    }
    this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
  }


  // slider script

  handlePanelView = (job) => {
    if (job.id === this.state.panelView) {
      this.setState({ panelView: null })
    }
    else {
      this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name)
      this.props.sAJobMgmtAction.getJobDetails(job.job_number);
      this.setState({ panelView: job.id })
    }
  }

  componentDidMount() {
    this.intervalID = setInterval(
      () => this.tick(),
      1000
    );
  }

  componentWillUnmount() {
    clearInterval(this.intervalID);
  }

  tick() {
    this.setState({
      currentDate: moment()
    });
  }

  handleJobAccept = (id, status) => {
    this.props.jobManagerAction.acceptDeclineShift({
      id,
      job_shift_accept_status: status
    })
      .then((flag) => {

      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? 'ERROR EDITING CLIENT' : Strings.generic_error,onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  updateJobStatus = (job, status) => {
    this.props.jobManagerAction.updateJobStatus({
      job_number: job.job_number,
      job_status: status,
      job_id: job.id
    })
      .then((flag) => {

      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? 'ERROR EDITING CLIENT' : Strings.generic_error,onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  jobMagAccess = JSON.parse(getStorage(ACCESS_CONTROL))["job_management"] && JSON.parse(getStorage(ACCESS_CONTROL))["job_management"].permissions;
  permissions = {
    update_job_status: this.jobMagAccess.findIndex(acess => acess.control_name === 'sf_jobs_controller_update_job_status'),
  }


  render() {

    const { displayJobs, jobDetails, licences, licenceType, licenseUrl } = this.props;
    const { currentDate } = this.state;
    return (
      <>
        <div className="job-manager-wrap mt-5 pt-1">
          {/* job status and other.. */}
          {displayJobs.map(job => {
            var startTime = moment(job.job_start_date);
            {/*  moment(job.job_shifts[0].job_scheduled_shifts[0].shift_date)
                            .set({
                                h: moment(job.job_shifts[0].job_scheduled_shifts[0].yard_time).format("hh"),
                                m: moment(job.job_shifts[0].job_scheduled_shifts[0].yard_time).format("mm")
                            }); */}
            var remaining_hr = Math.floor(startTime.diff(currentDate) / 1000 / 60 / 60);
            remaining_hr = remaining_hr.toString().length === 1 ? `0${remaining_hr}` : remaining_hr;
            var remaining_min = Math.floor(((startTime.diff(currentDate) / 1000 / 60 / 60) - remaining_hr) * 60);
            remaining_min = remaining_min.toString().length === 1 ? `0${remaining_min}` : remaining_min;
            var remaining_sec = Math.floor(((((startTime.diff(currentDate) / 1000 / 60 / 60) - remaining_hr) * 60) - remaining_min) * 60)
            remaining_sec = remaining_sec.toString().length === 1 ? `0${remaining_sec}` : remaining_sec;

            if (job.job_shift_accept_status === 1)
              return <div className="job-status-lists">
                <div className="job-mr-head d-flex justify-content-between">
                  <div className="col job-mr-w">

                    {job.job_status === 0 ?
                      <div className="jobmr-status"> <div className="sts-circle">
                        <span>NOT</span>
                        STARTED
                                            </div>
                      </div>
                      :
                      job.job_status === 1 ? <div className="jobmr-status jb-started-status">
                        <div className="sts-circle">
                          <span><i class="fa fa-hourglass-start"></i></span>
                          STARTED
                                                 </div>
                      </div> :
                        job.job_status === 2 ? <div className="jobmr-status">
                          <div className="sts-circle">
                            <span>JOB</span>
                            PAUSED
                                                    </div>
                        </div> :
                          <div className="jobmr-status jb-started-status">
                            <div className="sts-circle">
                              <span>JOB</span>
                              COMPLETED
                                                 </div>
                          </div>}
                  </div>
                  <div className="col job-dtl-w">
                    <div className="job-mr-details">
                      <h2 className="job-name-id">{job.client_name}, Job # {job.job_number}</h2>
                      <div className="job-mr-time">
                        <span><i className="fa fa-calendar"></i> {startTime.format('DD-MM-YYYY')}</span>
                        <span><i className="fa fa-clock-o"></i> {startTime.format('hh:mm A')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col job-act-w">
                    <button type="button" onClick={() => this.handlePanelView(job)} className="normal-bnt open-job-bnt"><i class="material-icons">keyboard_arrow_down</i></button>
                    {job.job_status === 0 ?
                      <div className="job-action-area">
                        <span>Job Starts In:</span>
                        <strong>{remaining_hr}:{remaining_min}:{remaining_sec}</strong>
                        {this.permissions.update_job_status !== -1 ? <button type="button" className="bnt bnt-normal"
                          onClick={() => this.updateJobStatus(job, 1)}>Start Job</button> : null}
                      </div> : job.job_status === 1 ?
                        <div className="job-action-area">
                          <span>Job Starts In:</span>
                          <strong>{remaining_hr}:{remaining_min}:{remaining_sec}</strong>
                          {this.permissions.update_job_status !== -1 ? <>
                            <button type="button" className="bnt bnt-normal"
                              onClick={() => this.updateJobStatus(job, 2)}>Pause</button>
                            <button type="button" className="bnt bnt-normal"
                              onClick={() => this.updateJobStatus(job, 3)}>Completed</button></> : null}
                        </div> :
                        job.job_status === 2 ? <div className="job-action-area">
                          <span>Job Starts In:</span>
                          <strong>{remaining_hr}:{remaining_min}:{remaining_sec}</strong>
                          {this.permissions.update_job_status !== -1 ? <button type="button" className="bnt bnt-normal"
                            onClick={() => this.updateJobStatus(job, 1)}>Start Job</button> : null}
                        </div> :
                          <div className="job-completed">
                            <span><i class="material-icons">check_circle_outline</i>Completed</span>
                          </div>
                    }

                  </div>
                </div>
                {/* show hide this section when click the down arrow button */}
                <div className={this.state.panelView === job.id ? "job-mr-body" : "job-mr-body d-none"}>
                  <div className="row">
                    <div className="col-md-10 job-reports-wrap">
                      <div className="sf-card has-shadow">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                          <h2 className="sf-pg-heading">Service Details</h2>
                          <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled>
                              <i className="material-icons">more_vert</i>
                            </Dropdown>
                          </div>
                        </div>
                        {jobDetails && jobDetails.job_details
                          && jobDetails.job_details.length > 0
                          && jobDetails.job_details[0].quote
                          && jobDetails.job_details[0].quote.scope_doc
                          && jobDetails.job_details[0].quote.scope_doc.scope_docs_sites
                          && jobDetails.job_details[0].quote.scope_doc.scope_docs_sites.length > 0 ? jobDetails.job_details[0].quote.scope_doc.scope_docs_sites.map(site => {
                            return <div className="sf-card-body">
                              <div className="data-v-row">
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{Strings.job_name}</label>
                                    <span>{site && site.site && site.site.job_name ? site.site.job_name : ''}</span>
                                  </div>
                                </div>
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{Strings.site_name}</label>
                                    <span>{site && site.site && site.site.site_name ? site.site.site_name : ''}</span>
                                  </div>
                                </div>
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{Strings.address_txt}</label>
                                    <span>{site && site.site && site.site.street_address ? site.site.street_address : ''} {site.site.city ? site.site.city : ''} {site.site.state ? site.site.state : ''} {site.site.zip_code ? site.site.zip_code : ''}</span>
                                  </div>
                                </div>
                              </div>
                              <div className="service-table"> {/* task details */}
                                {site && site.site && site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map(task => {
                                  return <div className="sf-job-doc-bg sAgent-calnd-row">
                                    <div className="data-v-row">
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{task && task.task_name ? task.task_name : ''}</label>
                                          <span>{task && task.description ? task.description : ''}</span>
                                        </div>
                                      </div>
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.area_txt}</label>
                                          <span>{task && task.areas && task.areas.length > 0 ? task.areas.map((area, index) => {
                                            return area && area.area_name ? task.areas.length - 1 === index ? area.area_name : area.area_name + ", " : ""
                                          }
                                          ) : ''}</span>
                                        </div>
                                      </div>
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.job_id}</label>
                                          <span>{jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_number ? jobDetails.job_details[0].job_number : ''}</span>
                                        </div>
                                      </div>

                                    </div>
                                    <div className="data-v-row sAgent-note justify-content-between">
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>Notes</label>
                                          <span>{task && task.note ? task.note : ''}</span>
                                        </div>
                                      </div>
                                      <div className="job-note-pic">
                                        {task.file && task.file.length > 0 && task.file[0].file_url ?
                                          <img src={task.file[0].file_url} alt="img" /> : ''}
                                      </div>
                                    </div>
                                  </div>
                                }) : ''}
                              </div>
                            </div>
                          }) : ''}
                      </div>

                      <div className="sf-card has-shadow mt-3">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                          <h2 className="sf-pg-heading">Licences</h2>
                          <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled>
                              <i className="material-icons">more_vert</i>
                            </Dropdown>
                          </div>
                        </div>
                        <div className="sf-card-body">
                          {/* slider */}
                          <div id="licencesSlider" class="carousel slide" data-interval="false" data-ride="carousel">
                            <div class="carousel-inner">
                              {licences && licences.length > 0 && licences.map((lic, index) => {
                                if (index % 4 == 0) {
                                  var dummyLicences = [...licences];
                                  return <div class={index === 0 ? "carousel-item active" : "carousel-item"}>
                                    <div className="licence-slider row">
                                      {
                                        dummyLicences.splice(index, 4).map(licence =>
                                          <div className="col-md-3">
                                            <div className="licence-list">
                                              {licenseUrl?<img src={licenseUrl+licence.image} />:null}
                                              <div className="li-details">
                                                <h3>{licenceType.find(type => type.id === licence.type) ?
                                                  licenceType.find(type => type.id === licence.type).name : ''}</h3>
                                                <ul className="li-lists">
                                                  <li><span>Number:</span> {licence.number}</li>
                                                  <li><span>Number:</span> {licence.number}</li>
                                                  <li><span>Issued By:</span> {licence.issued_by}</li>
                                                  <li><span>Issue Date:</span> {moment(licence.issued_date).format('D MM YYYY')}</li>
                                                  <li><span>Expiry Date:</span> {moment(licence.expiry_date).format('D MM YYYY')}</li>
                                                </ul>
                                              </div>
                                            </div>
                                          </div>)
                                      }
                                    </div>
                                  </div>
                                }
                              })}

                            </div>
                            <div className="slider-nav">
                              <a class="carousel-control-prev" href="#licencesSlider" role="button" data-slide="prev">
                                <i class="material-icons" aria-hidden="true">keyboard_arrow_left</i>
                              </a>
                              <a class="carousel-control-next" href="#licencesSlider" role="button" data-slide="next">
                                <i class="material-icons" aria-hidden="true">keyboard_arrow_right</i>
                              </a>
                            </div>
                          </div>

                          {/* slider */}


                        </div>
                      </div>
                    </div>
                    {/* Right panel:  All Tools  */}
                    <div className="col-md-2 reports-tools">
                      <div className="sf-card sf-shadow">
                        <div className="sf-card-body px-0">
                          <div className="jobs-detail-tools">
                            <div className="tools-lists">
                              <button className="tools-items normal-bnt color-1" onClick={() => this.props.history.push('./SignSWMS')}>
                                <i className="sficon sf-sign-swms"></i>
                                <span>sign swms</span>
                              </button>
                              <button onClick={() => this.props.history.push({
                                pathname: '/dashboard/jobReport',
                                job_id: jobDetails.job_details[0].id,
                                state: { flag: true }
                              })} className="tools-items normal-bnt color-3">
                                <i class="fa fa-file-text-o"></i>
                                <span>JOB REPORT</span>
                              </button><button onClick={() => this.props.history.push({
                                pathname: '/dashboard/add-hazard-report',
                                job_id: this.props.jobDetails.job_details[0].id,

                              })} className="tools-items normal-bnt color-4">
                                <i class="fa fa-scissors"></i>
                                <span>HAZARD REPORT</span>
                              </button>
                              <button onClick={() => this.props.history.push({
                                pathname: '/dashboard/add-incident-report',
                                job_id: this.props.jobDetails.job_details[0].id
                              })} className="tools-items normal-bnt color-5">
                                <i className="sficon sf-incident-report"></i>
                                <span>INCIDENT REPORT</span>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            else if (job.job_shift_accept_status === 0)
              return <div className="job-status-lists job-request-box">
                <div className="job-mr-head d-flex justify-content-between">
                  <div className="col job-mr-w">
                    <div className="jobmr-status jb-request-status">
                      <div className="sts-circle">
                        <span>{remaining_hr} hr</span>
                        {remaining_min} min
                                            </div>
                    </div>
                  </div>
                  <div className="col job-dtl-w">
                    <div className="job-mr-details">
                      <h2 className="job-name-id">{job.client_name}, Job # {job.job_number}</h2>
                      <div className="job-mr-time">
                        <span><i className="fa fa-calendar"></i>{startTime.format('DD-MM-YYYY')}</span>
                        <span><i className="fa fa-clock-o"></i> {startTime.format('hh:mm A')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="col job-act-w">
                    <div className="job-action-area">
                      <button type="button" className="bnt bnt-active" onClick={() => this.handleJobAccept(job.id, 1)}>
                        <i class="fa fa-thumbs-o-up"></i>Yeah, Accept!</button>
                      <button type="button" className="bnt bnt-normal" onClick={() => this.handleJobAccept(job.id, 2)}>
                        <i class="fa fa-thumbs-o-down" ></i>Not Interested</button>
                    </div>
                  </div>
                </div>
              </div>
            else
              return <div className="job-status-lists job-request-box">
                <div className="job-mr-head d-flex justify-content-between">
                  <div className="col job-mr-w">
                    <div className="jobmr-status jb-request-status">
                      <div className="sts-circle">
                        <span>Rejected</span>

                      </div>
                    </div>
                  </div>
                  <div className="col job-dtl-w">
                    <div className="job-mr-details">
                      <h2 className="job-name-id">{job.client_name}, Job # {job.job_number}</h2>
                      <div className="job-mr-time">
                        <span><i className="fa fa-calendar"></i>{startTime.format('DD-MM-YYYY')}</span>
                        <span><i className="fa fa-clock-o"></i> {startTime.format('hh:mm A')}</span>
                      </div>
                    </div>
                  </div>
                  {/* <div className="col job-act-w">
                                        <div className="job-action-area">
                                            <button type="button" className="bnt bnt-active" onClick={() => this.handleJobAccept(job.id, 1)}>
                                                <i class="fa fa-thumbs-o-up"></i>Yeah, Accept!</button>
                                            <button type="button" className="bnt bnt-normal" onClick={() => this.handleJobAccept(job.id, 2)}>
                                                <i class="fa fa-thumbs-o-down" ></i>Not Interested</button>
                                        </div>
                                    </div> */}
                </div>
              </div>
          })}

        </div>

      </>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userJobs: state.jobManger.userJobs,
    jobDetails: state.sAJobMgmt.jobDetails,
    profile: state.profileManagement.profile,
    licences: state.profileManagement.profile[0] && state.profileManagement.profile[0].licences ?
      state.profileManagement.profile[0].licences : [],
    licenceType: state.profileManagement && state.profileManagement.licenceType,
    licenseUrl :  state.profileManagement.profile[0] && state.profileManagement.profile[0].licences_file_path     
  }
}

const mapDispatchToprops = dispatch => ({
  jobManagerAction: bindActionCreators(jobManagerAction, dispatch),
  sAJobMgmtAction: bindActionCreators(sAJobMgmtAction, dispatch),
  userActions: bindActionCreators(userActions, dispatch)
})

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({ form: 'JobListView', validate ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(withRouter(JobListView))