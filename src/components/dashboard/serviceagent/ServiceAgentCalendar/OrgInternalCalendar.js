import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Modal, Tag, notification } from 'antd';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';

import { CustomSelect } from '../../../common/customSelect';

import { Strings } from '../../../../dataProvider/localize';
import { goBack, handleFocus } from '../../../../utils/common';
import CoreCalendar from './Calendar/CoreCalendar'
import * as organisationActions from '../../../../actions/organizationAction'
import * as serviceAgentJobCalendarActions from '../../../../actions/serviceAgentJobCalendarActions'
import * as jobDocActions from '../../../../actions/jobDocAction'
import * as jobCalendarActions from '../../../../actions/jobCalendarActions'
import QuoteDetails from './QuoteDetails';
import EditAcceptedJob from "./EditAcceptedJob";
import { ADMIN_DETAILS } from '../../../../dataProvider/constant'
import { getStorage } from '../../../../utils/common'
import { ORGANIZATIONS_LIST } from '../../../../dataProvider/constant'
import { ERROR_NOTIFICATION_KEY } from '../../../../config';

export class OrgInternalCalendar extends Component {

  state = {
    new: false,
    accepted: false,
    started: false,
    paused: false,
    signedOff: false,
    invoiced: false,
    completed: false,
    accountManager: '',
    selectedState: '',
    filters: [],
    dropdowns: [],
    size: 'default',
    checkedQuotes: [],
    selectedOrganizations: [],
    showJobDetails: false,
    showAcceptedJobs: false
  }

  componentDidMount() {
    this.props.change('organizations', [])
    this.props.change('zone', [])
    this.props.change('accountManager', [])
    this.props.change('stateName', [])

    this.props.jobCalendarActions.getAccountManagersList()
      .then(() => { })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })

    this.props.serviceAgentJobActions.getAllConnectedOrg()
      .then(() => {
        // console.log(this.props.connectedOrg)
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


    // this.props.organisationActions.getOrganization()
    //   .then(() => { })
    //   .catch(message => {
    //     notification.error({
    //       key: ERROR_NOTIFICATION_KEY,
    //       message: Strings.error_title,
    //       description: message ? message : Strings.generic_error,
    //       onClick: () => { },
    //       className: 'ant-error'
    //     });
    //   })

    this.props.serviceAgentJobActions.getAllServiceAgentJobs()
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })

    this.props.jobDocActions.getServiceAgentAllStaff(JSON.stringify(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id))
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

    this.props.serviceAgentJobActions.getSupervisorsList()
      .then(() => {

      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        })
      })

    this.props.serviceAgentJobActions.getSiteSupervisorsList()
      .then(() => {

      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        })
      })
  }

  handleCancel = () => {
    this.setState({
      showAcceptedJobs: false,
      showJobDetails: false
    })
  }

  handleopen = () => {
    this.setState({
      showAcceptedJobs: true,
      showJobDetails: true
    })
  }

  handleEventSelection = (event) => {
    // console.log(event)
    this.setState({ currentEvent: event })
    this.props.serviceAgentJobActions.getTaskDetails(event)
      .then(res => {

      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        })
      })

    if (event.job_accept_status) {
      this.setState({
        showAcceptedJobs: true,
        showJobDetails: false
      })
    } else {
      this.setState({
        showJobDetails: true,
        showAcceptedJobs: false
      })
    }
  }

  handleNewClick = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        new: !prevState.new
      }
    })
  }

  handleAcceptedClick = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        accepted: !prevState.accepted
      }
    })
  }

  handleStartedClick = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        started: !prevState.started
      }
    })
  }

  handlePausedClick = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        paused: !prevState.paused
      }
    })
  }

  handleCompletedClick = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        completed: !prevState.completed
      }
    })
  }

  handleZoneChange = () => {

  }

  handleAccountMgrChange = (value) => {
    this.setState(prevState => {
      return {
        ...prevState,
        accountManager: value
      }
    })
  }

  handleStateChange = (value) => {
    const selectedState = this.props.states.filter(state => state.stateId.toString() === value.toString())
    this.setState(prevState => {
      return {
        ...prevState,
        selectedState: selectedState[0]
      }
    })
  }

  handleSignedOffClick = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        signedOff: !prevState.signedOff
      }
    })
  }

  handleInvoicedClick = () => {
    this.setState(prevState => {
      return {
        ...prevState,
        invoiced: !prevState.invoiced
      }
    })
  }

  // handleOrganizationChange = (values) => {
  //   const selectedOrganizations = [];
  //   this.props.organizationsList.forEach(org => {
  //     values.forEach(value => {
  //       if (org.id.toString() === value) {
  //         selectedOrganizations.push({
  //           name: org.name,
  //           id: org.id
  //         })
  //       }
  //     })
  //   })

  //   this.setState(prevState => {
  //     return {
  //       ...prevState,
  //       selectedOrganizations: selectedOrganizations
  //     }
  //   })
  // }

  // handleCloseTag = (value) => {
  //   this.setState(prevState => {
  //     const orgIndex = prevState.selectedOrganizations.findIndex(org => org.id === value);
  //     const newSelectedOrganizations = prevState.selectedOrganizations.slice();
  //     newSelectedOrganizations.splice(orgIndex, 1);
  //     this.props.change("organizations", newSelectedOrganizations.map(org => org.name))
  //     return {
  //       selectedOrganizations: newSelectedOrganizations
  //     }
  //   });
  // }

  resetFilters = () => {
    this.setState({
      new: false,
      accepted: false,
      started: false,
      paused: false,
      completed: false,
      signedOff: false,
      invoiced: false,
      accountManager: '',
      selectedState: '',
      // selectedOrganizations: [],
    })
    // this.props.change('organizations', [])
    this.props.change('zone', [])
    this.props.change('accountManager', [])
    this.props.change('stateName', [])
  }

  render() {

    const orgList = this.props.connectedOrg && this.props.connectedOrg.length > 0 ? [...this.props.connectedOrg] : []
    // this.props.connectedOrg.forEach(orgItem => {
    //   if (orgItem.organisation_type && orgItem.organisation_type == 1) {
    //     orgList.push(orgItem)
    //   }
    // })

    return (
      <div className="sf-page-layout">
        {/* <Core /> */}
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            {Strings.internal_calendar_txt}
          </h2>

        </div>
        {/* inner header  */}
        <div className="main-container">
          <form>
            <div className="row">
              <div className={this.state.showAcceptedJobs ? "col-md-9 flex-wrap d-flex justify-content-between calender-heading" : "col-md-12 flex-wrap d-flex justify-content-between calender-heading"}>
                <div className="status-bnt">
                  <button type="button" onClick={() => this.handleNewClick()} className={this.state.new ? `not-approved-active` : `not-approved`}>New</button>
                  <button type="button" onClick={() => this.handleAcceptedClick()} className={this.state.accepted ? `approved-active` : `approved`}>Accepted</button>
                  <button type="button" onClick={() => this.handleStartedClick()} className={this.state.started ? `started-active` : `started`}>Started</button>
                  <button type="button" onClick={() => this.handlePausedClick()} className={this.state.paused ? `paused-active` : `paused`}>Paused</button>
                  <button type="button" onClick={() => this.handleCompletedClick()} className={this.state.completed ? `completed-active` : `completed`}>Completed</button>
                  <>
                    <button type="button" onClick={() => this.handleSignedOffClick()} className={this.state.signedOff ? `signed-off-active` : `signed-off`}>Signed Off</button>
                    <button type="button" onClick={() => this.handleInvoicedClick()} className={this.state.invoiced ? `invoiced-active` : `invoiced`}>Invoiced</button>
                  </>
                </div>

                <div className="status-selects">
                  {/* <fieldset className="form-group sf-form org-slt-tags">
                    <Field
                      name="organizations"
                      mode="tags"
                      options={orgList.map(org => {
                        return {
                          title: org.name,
                          value: org.id.toString()
                        }
                      })
                      }
                      placeholder={Strings.org_title}
                      onChange={(value) => this.handleOrganizationChange(value)}
                      style={{ width: '100%' }}
                      component={CustomSelect}
                    />
                  </fieldset> */}
                  <fieldset className="form-group sf-form zone-grp-txt">
                    <Field
                      name="zone"
                      placeholder={Strings.zone_txt}
                      component={CustomSelect}
                      onChange={(value) => this.handleZoneChange(value)}
                      options={[]}
                    />
                  </fieldset>
                  <fieldset className="form-group sf-form sf-form accountMngr">
                    <Field
                      name="accountManager"
                      placeholder={Strings.accout_manager_txt}
                      component={CustomSelect}
                      onChange={(value) => this.handleAccountMgrChange(value)}
                      options={this.props.accountManagers.map(acMgr => ({
                        title: acMgr.first_name,
                        value: acMgr.user_name
                      }))}
                    // options={[]}
                    />
                  </fieldset>
                  <fieldset className="form-group sf-form">
                    <Field
                      name="stateName"
                      placeholder={Strings.state_txt}
                      component={CustomSelect}
                      onChange={(value) => this.handleStateChange(value)}
                      options={this.props.states.map((stateItem, index) => ({
                        title: stateItem.stateName,
                        value: stateItem.stateId
                      }))}
                    />
                  </fieldset>
                </div>

                {/* <div className={this.state.selectedOrganizations && this.state.selectedOrganizations.length > 0 ? "org-select-tags" : "d-none"}>
                  <strong>Organizations selected:</strong>
                  <div className="org-all-tags">{this.state.selectedOrganizations && this.state.selectedOrganizations.map(tag => <Tag closable onClose={() => this.handleCloseTag(tag.id)}>{tag.name}</Tag>)}</div>
                </div> */}
              </div>
            </div>
            <div className="re-setbutton">
              <div className="status-bnt">
                <button type="button" onClick={() => this.resetFilters()} className={`reset`}>Reset</button>
              </div>
            </div>
          </form>

          <div className="row">
            {
              this.props.events && this.props.events.length > 0
                ? <div className={this.state.showAcceptedJobs || this.state.showJobDetails ? "col-md-9" : "col-md-12"}>
                  <div className="sf-card sf-shadow">
                    <div className="sf-card-body p-0">
                      <div className="job-calendar-view" id="calenderPopover">
                        {/* <DragAndDropCalendar /> */}
                        <CoreCalendar
                          new={this.state.new}
                          accepted={this.state.accepted}
                          started={this.state.started}
                          paused={this.state.paused}
                          signedOff={this.state.signedOff}
                          invoiced={this.state.invoiced}
                          completed={this.state.completed}
                          accountManager={this.state.accountManager}
                          selectedState={this.state.selectedState}
                          onEventSelection={this.handleEventSelection}
                          filters={this.state.filters}
                          dropdowns={this.state.dropdowns}
                        // selectedOrganizations={
                        //   this.state.selectedOrganizations
                        //     && this.state.selectedOrganizations.length > 0
                        //     ? this.state.selectedOrganizations.map(org => org.id)
                        //     : []
                        // }
                        />
                      </div>
                    </div>
                  </div>
                </div>
                : null
            }

            {
              this.state.showAcceptedJobs
                ? <EditAcceptedJob
                  initialValues={
                    this.props.initialValues && Object.keys(this.props.initialValues).length > 0
                      ? this.props.initialValues
                      : {}
                  }
                  onCancel={this.handleCancel}
                  task={this.state.currentEvent}
                  handleCreateJobDocs={this.handleCreateJobDocs}
                  recall={(e) => this.handleEventSelection(e)}
                  handleopen={this.handleopen}
                />
                : null
            }

            {
              this.state.showJobDetails
                ? <QuoteDetails
                  onCancel={this.handleCancel}
                  task={this.state.currentEvent}
                />
                : null
            }

          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  const { selectedJobDetails, currentCalendarEvent, numberOfShifts } = state.sAJobCalendar
  var values = {}
  // values.organizations = []
  values.accountManager = []
  values.stateName = []
  values.zone = []
  //Write a separate condition for (job_accept_status === 0) to prefill the formValues here

  if (selectedJobDetails && selectedJobDetails.length > 0 && selectedJobDetails[0].job_accept_status && selectedJobDetails[0].job_accept_status === 1) {
    selectedJobDetails[0].quote
      && selectedJobDetails[0].quote.scope_doc
      && selectedJobDetails[0].quote.scope_doc.scope_docs_sites
      && selectedJobDetails[0].quote.scope_doc.scope_docs_sites.forEach(site => site.site.tasks.forEach(task => {

        if (task.id === currentCalendarEvent.id && values) {
          values = task
            && Array.isArray(selectedJobDetails[0].job_schedules)
            && selectedJobDetails[0].job_schedules.length > 0
            ? selectedJobDetails[0].job_schedules[0]
            // : {}
            : {
              "job_start_date": task.start_date,
              "job_duration": /* task.job_duration ? parseInt(task.job_duration.split('_')[0]) : Number(0) */ numberOfShifts
            }

          if (Object.keys(values).length > 0) {
            values.job_accept_status = selectedJobDetails[0] && selectedJobDetails[0].job_accept_status
            values.job_status = selectedJobDetails[0] && selectedJobDetails[0].job_status
            values.job_start_date = task.start_date

            values.day = selectedJobDetails[0]
              && selectedJobDetails[0].job_schedules
              && Array.isArray(selectedJobDetails[0].job_schedules)
              && selectedJobDetails[0].job_schedules[0]
              && selectedJobDetails[0].job_schedules[0].job_time
              && selectedJobDetails[0].job_schedules[0].job_time.split(",").find(letter => letter === "D")

            values.night = selectedJobDetails[0]
              && selectedJobDetails[0].job_schedules
              && Array.isArray(selectedJobDetails[0].job_schedules)
              && selectedJobDetails[0].job_schedules[0]
              && selectedJobDetails[0].job_schedules[0].job_time
              && selectedJobDetails[0].job_schedules[0].job_time.split(",").find(letter => letter === "N")

            values.job_duration = selectedJobDetails[0]
              && Array.isArray(selectedJobDetails[0].job_schedules)
              && selectedJobDetails[0].job_schedules[0]
              && selectedJobDetails[0].job_schedules[0].job_schedule_shifts
              && selectedJobDetails[0].job_schedules[0].job_schedule_shifts.length

            values.shifts = selectedJobDetails[0]
              && Array.isArray(selectedJobDetails[0].job_schedules)
              && selectedJobDetails[0].job_schedules[0]
              && selectedJobDetails[0].job_schedules[0].job_schedule_shifts
              ? selectedJobDetails[0].job_schedules[0].job_schedule_shifts
              : []

            if (values.shifts.length === 0) {
              for (let iterator = 0; iterator < numberOfShifts; iterator++) {
                values.shifts.push({})
              }
            }
          }
        }
      }))

    values.shifts && values.shifts.length > 0 && values.shifts.forEach((shift, index) => {
      shift.staff = {}
      if (shift.job_allocated_users) {
        shift.job_allocated_users.forEach(user => {
          shift.staff[`staff_${user.user_name}`] = true
        })
      }
      if (shift.supervisor && shift.supervisor.user_name) {
        shift.supervisor = shift.supervisor.user_name
      }
      if (shift.site_supervisor && shift.site_supervisor.user_name) {
        shift.site_supervisor = shift.site_supervisor.user_name
      }
    })
  }

  return {
    initialValues: values,
    events: state.sAJobCalendar.jobsList,
    states: state.sAJobCalendar.statesList,
    jobStaffMembers: state.jobdocManagement.orgUSerList,
    selectedTask: state.sAJobCalendar.selectedJobDetails,
    accountManagers: state.jobsManagement.accountManagersList,
    selectedCalendarEvent: state.sAJobCalendar.currentCalendarEvent,
    // organizationsList: state.organization && state.organization.organizations && state.organization.organizations,
    formValues: state.form.OrgInternalCalendar && state.form.OrgInternalCalendar.values && state.form.OrgInternalCalendar.values,
    connectedOrg: state.sAJobCalendar.connectedOrg
  }
}

const mapDispatchToprops = dispatch => ({
  jobDocActions: bindActionCreators(jobDocActions, dispatch),
  jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
  // organisationActions: bindActionCreators(organisationActions, dispatch),
  serviceAgentJobActions: bindActionCreators(serviceAgentJobCalendarActions, dispatch),
})

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'OrgInternalCalendar',
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(OrgInternalCalendar)
