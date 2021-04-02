import React from 'react';
import { Icon, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import * as scopeDocAction from '../../../actions/scopeDocActions';
import { CustomSelect } from '../../common/customSelect';

import * as clientActions from '../../../actions/clientManagementActions';
import * as jobCalendarActions from '../../../actions/jobCalendarActions';
import * as accessControlAction from '../../../actions/accessControlManagementAction';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { goBack, handleFocus } from '../../../utils/common';
import { getStorage } from '../../../utils/common';
import CoreCalendar from './Calendar/CoreCalendar'
import OutSourceJob from './outSourceJob';
import DefaultJobPanel from './DefaultJobPanel';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { customInput } from '../../common/custom-input';
import JobOutsource from './JobOutsource';

class JobCalender extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expand: false,
      showSidePanel: false,
      selectedTask: {},
      view: "month",
      filters: {
        notApproved: false,
        adminApproved: false,
        clientApproved: false,
        booked: false,
        started: false,
        paused: false,
        completed: false,
        signedOff: false,
        invoiced: false,
        allocated: false,
        outsourced: false,
        some: 0
      },
      dropdowns: {
        zone: "",
        accountMgr: "",
        stateName: ""
      },
    }
    const adminDetails = JSON.parse(getStorage(ADMIN_DETAILS))
    this.currentOrganization = adminDetails ? adminDetails.organisation.id : null;
    this.role = adminDetails ? adminDetails.role.role_name : null;
  }

  states = [];
  zones = [];

  componentDidMount() {
    this.props.change('zone', [])
    this.props.change('accountManager', [])
    this.props.change('stateName', [])
    this.props.jobCalendarActions.getJobsList()
      .then(() => {

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

    this.props.jobCalendarActions.getAccountManagersList()
      .then((flag) => {

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

    var currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    this.props.clientActions.getClientsList(currentOrganization);

  }

  handleNotApprovedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        notApproved: !this.state.filters.notApproved
      }
    })
  }

  handleAdminApprovedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        adminApproved: !this.state.filters.adminApproved
      }
    })
  }

  handleClientApprovedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        clientApproved: !this.state.filters.clientApproved
      }
    })
  }

  handleBookedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        booked: !this.state.filters.booked
      }
    })
  }

  handleStartedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        started: !this.state.filters.started
      }
    })
  }

  handlePausedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        paused: !this.state.filters.paused
      }
    })
  }

  handleCompletedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        completed: !this.state.filters.completed
      }
    })
  }

  handleSignedOffClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        signedOff: !this.state.filters.signedOff
      }
    })
  }

  handleInvoicedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        invoiced: !this.state.filters.invoiced
      }
    })
  }

  handleZoneChange = (value) => {
    const selectedZone = this.props.zones.find(zone => zone.id.toString() === value.toString())
    this.setState({
      ...this.state,
      dropdowns: {
        ...this.state.dropdowns,
        zone: selectedZone
      }
    })
  }

  handleAccountMgrChange = (value) => {
    this.setState({
      ...this.state,
      dropdowns: {
        ...this.state.dropdowns,
        accountMgr: value
      }
    })
  }

  handleStateChange = (value) => {
    this.setState({
      ...this.state,
      dropdowns: {
        ...this.state.dropdowns,
        stateName: value
      }
    })
  }

  handleShowMore = () => {
    this.setState({ expand: true })
  }

  resetFilters = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        filters: {
          notApproved: false,
          adminApproved: false,
          clientApproved: false,
          booked: false,
          started: false,
          paused: false,
          completed: false,
          signedOff: false,
          invoiced: false,
          allocated: false,
          outsourced: false,
        },
        dropdowns: {
          zone: "",
          accountMgr: "",
          stateName: ""
        },
      }
    })
    this.props.change('zone', [])
    this.props.change('accountManager', [])
    this.props.change('stateName', [])
  }

  onTaskSelect = (task) => {
    if (task.isJob) {
      this.props.scopeDocAction.getScopeDocDetails(task.scope_doc_id, null, task.quote_number)
      this.props.jobCalendarActions.getJobsList()
        .then(() => {

          this.setState({
            selectedTask: task,
            showSidePanel: true,
          }, () => {
            const currentSelectedJob = this.props.parentJobs.filter(job => job.id === this.state.selectedTask.id);
            currentSelectedJob[0].sites.forEach(site => site.tasks.forEach(task => task.partially_allocated_budget = true))
          });
        })
        .catch(err => {

        });
    } else {
      if (this.state.selectedTask && this.state.selectedTask.id !== task.id) {
        this.props.scopeDocAction.getScopeDocDetails(task.scope_doc_id, task.id, task.quote_number);
        this.setState({
          selectedTask: task,
          showSidePanel: true
        });
      }
    }
  }

  calendarAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["job_calendar"] && JSON.parse(getStorage(ACCESS_CONTROL))["job_calendar"].permissions;
  permissions = {
    sf_job_calendar_controller_outsource_and_revoke_job: this.calendarAccessControl && this.calendarAccessControl.length > 0 ?
      this.calendarAccessControl.findIndex(access => access.control_name === 'sf_job_calendar_controller_outsource_and_revoke_job') : -1,
  }

  handleJobDetailsClick = (jobNo) => {
    this.props.history.push({
      pathname: '/dashboard/job-details',
      state: {
        jobNo: jobNo
      }
    })
  }

  handleVisibility = () => {
    this.setState({ showSidePanel: false }, () => { this.setState({ showSidePanel: true }) })
  }

  handleExpand = () => {
    this.setState({ ...this.state, expanded: !this.state.expanded, view: "week", showSidePanel: false }, () => this.setState({ ...this.state, view: "month" }))
  }

  handleSearch = e => {
    this.setState({ searchString: e.target.value })
  }

  handleJobAllocatedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        allocated: !this.state.filters.allocated
      }
    })
  }

  handleOutsourcedClick = () => {
    this.setState({
      ...this.state,
      filters: {
        ...this.state.filters,
        outsourced: !this.state.filters.outsourced
      }
    })
  }

  handleJobView = () => {
    this.setState({
      ...this.state,
      jobView: true
    })
  }

  handleCancel = () => {
    this.setState({ showSidePanel: false, selectedTask: {}/* , jobView: true */ })
  }

  handleChangeView = (jobView) => {
    if (jobView === true) {

    } else {
      this.setState({ showSidePanel: false })
    }
  }

  static getDerivedStateFromProps(props, state) {
  }

  render() {
    return (
      <div className="sf-page-layout">
        {/* <Core /> */}
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            {Strings.job_calender_txt}
          </h2>

        </div>
        {/* inner header  */}
        <div className="main-container sf-job-calendar">
          <form>
            <div className="row">
              <div className={this.state.showSidePanel ? "col-md-9 flex-wrap d-flex justify-content-between calender-heading" : "col-md-12 flex-wrap d-flex justify-content-between calender-heading"}>
                <div className="status-bnt">
                  {
                    (this.role === 'Admin' || this.role === 'BDM') &&
                    <button type="button" onClick={() => this.handleBookedClick()} className={this.state.filters.booked ? `booked-active` : `booked`}>Job Booked</button>
                  }
                  <button type="button" onClick={() => this.handleJobAllocatedClick()} className={this.state.filters.allocated ? `allocated-active` : `allocated`}>Job Allocated</button>
                  <button type="button" onClick={() => this.handleOutsourcedClick()} className={this.state.filters.outsourced ? `outsourced-active` : `outsourced`}>Job Outsourced</button>
                  <button type="button" onClick={() => this.handleStartedClick()} className={this.state.filters.started ? `started-active` : `started`}>Job Started</button>
                  <button type="button" onClick={() => this.handlePausedClick()} className={this.state.filters.paused ? `paused-active` : `paused`}>Job Paused</button>
                  <button type="button" onClick={() => this.handleCompletedClick()} className={this.state.filters.completed ? `completed-active` : `completed`}>Job Completed</button>
                  <button type="button" onClick={() => this.handleSignedOffClick()} className={this.state.filters.signedOff ? `signed-off-active` : `signed-off`}>Job Signed Off</button>
                  <button type="button" onClick={() => this.handleInvoicedClick()} className={this.state.filters.invoiced ? `invoiced-active` : `invoiced`}>Invoiced</button>
                  {
                    (this.role === 'Admin' || this.role === 'BDM') &&
                    <button type="button" onClick={() => this.handleNotApprovedClick()} className={this.state.filters.notApproved ? `not-approved-active` : `not-approved`}>Not Approved</button>
                  }
                </div>

                <div className="status-selects">
                  <fieldset className="form-group sf-form zone-grp-txt">
                    <Field
                      name="zone"
                      placeholder={Strings.zone_txt.toString()}
                      component={CustomSelect}
                      onChange={(value) => this.handleZoneChange(value)}
                      options={[]} />
                  </fieldset>
                  <fieldset className="form-group sf-form accountMngr">
                    <Field
                      name="accountManager"
                      placeholder={Strings.accout_manager_txt}
                      component={CustomSelect}
                      onChange={(value) => this.handleAccountMgrChange(value)}
                      options={this.props.accountManagers.map(acMgr => ({
                        title: acMgr.first_name,
                        value: acMgr.user_name
                      }))} />
                  </fieldset>
                  <fieldset className="form-group sf-form">
                    <Field
                      name="stateName"
                      placeholder={Strings.state_txt}
                      component={CustomSelect}
                      onChange={(value) => this.handleStateChange(value)}
                      options={this.props.stateNames.map((stateItem, index) => ({
                        title: stateItem.name,
                        value: `${stateItem.name}`
                      }))}
                    />
                  </fieldset>
                  <fieldset className="form-group sf-form search-filter">
                    <Field
                      name="search"
                      placeholder={"Search"}
                      type="text"
                      component={customInput}
                      onChange={(e) => this.handleSearch(e)} />
                  </fieldset>
                </div>
              </div>
            </div>
            <div className="row">
              <div className={this.state.showSidePanel ? "col-md-9 sf-col-8" : "col-md-12"}>
                <div className="re-setbutton">
                  <div className="status-bnt d-flex button-cust" /*justify-content-between */>
                    <button type="button" onClick={() => this.resetFilters()} className='reset'>Reset</button>
                    <button type="button" onClick={this.handleExpand} className='reset'>{this.state.expanded ? "Collapse" : "Expand"}</button>
                  </div>
                </div>
              </div>
            </div>
          </form>

          <div className="row">
            <div className={this.state.showSidePanel ? "col-md-9 sf-col-8" : "col-md-12"}>
              <div className="sf-card sf-shadow">
                <div className="sf-card-body p-0">
                  <div className={this.state.expanded ? "job-calendar-view job-calendar-view-expand" : "job-calendar-view"} id="calenderPopover">
                    {/* <DragAndDropCalendar /> */}
                    {
                      <CoreCalendar
                        view={this.state.view}
                        expanded={this.state.expanded}
                        jumpToDate={this.props.location.jumpToDate}
                        filters={this.state.filters}
                        dropdowns={this.state.dropdowns}
                        quoteId={this.state.selectedTask.quote_id}
                        onTaskSelect={this.onTaskSelect}
                        onCalendarView={(view) => this.setState({ ...this.state, view: view })}
                        searchString={this.state.searchString}
                        onChangeView={(jobView) => this.handleChangeView(jobView)}
                      />
                    }
                  </div>
                </div>
              </div>
            </div>

            {
              this.permissions.sf_job_calendar_controller_outsource_and_revoke_job !== -1
                ? this.state.showSidePanel
                  ? <JobOutsource selectedTask={this.state.selectedTask} visibility={() => this.handleVisibility()} onCancel={this.handleCancel} />
                  // <OutSourceJob hanndleCreateJobDocs={this.hanndleCreateJobDocs} selectedTask={this.state.selectedTask} visibility={() => this.handleVisibility()} />
                  : null
                : this.state.showSidePanel
                  ? <DefaultJobPanel selectedTask={this.state.selectedTask} onCancel={this.handleCancel} onTaskSelect={this.onTaskSelect} />
                  : null
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    jobs: state.jobsManagement.jobsList,
    accountManagers: state.jobsManagement.accountManagersList,
    zones: state.jobsManagement.zones,
    stateNames: state.jobsManagement.stateNames,
    initialValues: {
      zone: [],
      accountManager: [],
      stateName: []
    },
    selectedScopeDoc: state.scopeDocs.scopeDocsDetails,
    outSourceJobForm: state.form.outSourceJob && state.form.outSourceJob,
    splitJobForm: state.form.splitJob && state.form.splitJob,
    parentJobs: state.jobsManagement.parentJobs,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
    accessControlAction: bindActionCreators(accessControlAction, dispatch),
    scopeDocAction: bindActionCreators(scopeDocAction, dispatch),
    clientActions: bindActionCreators(clientActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'jobCalendar', enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(JobCalender)