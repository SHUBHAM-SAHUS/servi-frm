import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, notification } from 'antd';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';

import { CustomSelect } from '../../../common/customSelect';

import { Strings } from '../../../../dataProvider/localize';
import { goBack, handleFocus } from '../../../../utils/common';
import CoreCalendar from './Calendar/CoreCalendar'
import * as organisationActions from '../../../../actions/organizationAction'
import * as staffCalendarActions from '../../../../actions/staffCalendarActions'
import * as jobDocActions from '../../../../actions/jobDocAction'
import * as jobCalendarActions from '../../../../actions/jobCalendarActions'
import { ADMIN_DETAILS, ORGANIZATIONS_LIST } from '../../../../dataProvider/constant'
import { getStorage } from '../../../../utils/common'
import { ERROR_NOTIFICATION_KEY } from '../../../../config';
import { customInput } from '../../../common/custom-input';
export class ServiceAgentStaffCalendar extends Component {

  state = {
    new: false,
    accepted: false,
    started: false,
    paused: false,
    completed: false,
    accountManager: '',
    selectedState: '',
    zone: '',
    filters: [],
    dropdowns: [],
    adminDetails: JSON.parse(getStorage(ADMIN_DETAILS))
  }

  componentDidMount() {
    this.props.change('zone', [])
    this.props.change('accountManager', [])
    this.props.change('stateName', [])
    this.props.staffCalendarActions.getStaffJobsList()
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

    this.props.organisationActions.getOrganization()
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
  }

  static getDerivedStateFromProps(props, state) {
  }

  onSubmit = formData => {

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
    this.setState({ currentEvent: event })

    if (event.job_shift_accept_status) {
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

  handleZoneChange = (value) => {

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

  resetFilters = () => {
    this.setState({
      new: false,
      accepted: false,
      started: false,
      paused: false,
      completed: false,
      accountManager: '',
      selectedState: '',
      zone: ''
    })
    this.props.reset()
    this.props.change("zone", [])
    this.props.change("accountManager", [])
    this.props.change("stateName", [])
  }

  handleSearch = e => {
    this.setState({ searchString: e.target.value })
  }

  render() {
    const { handleSubmit } = this.props;
    const { adminDetails } = this.state;
    console.log('adminDetails', adminDetails)
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
        <div className="main-container">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="d-flex justify-content-between flex-wrap calender-heading">
              <div className="status-bnt">
                <button type="button" onClick={() => this.handleNewClick()} className={this.state.new ? `job-offered-active` : `job-offered`}>Job Offer</button>
                <button type="button" onClick={() => this.handleAcceptedClick()} className={this.state.accepted ? `job-accepted-active` : `job-accepted`}>Job Accepted</button>
                <button type="button" onClick={() => this.handleStartedClick()} className={this.state.started ? `shift-started-active` : `shift-started`}>Shift Started</button>
                {/* <button type="button" onClick={() => this.handlePausedClick()} className={this.state.paused ? `paused-active` : `paused`}>Paused</button> */}
                <button type="button" onClick={() => this.handleCompletedClick()} className={this.state.completed ? `shift-completed-active` : `shift-completed`}>Shift Completed</button>
              </div>

              <div className="status-selects">
                {/* <fieldset className="form-group sf-form  zone-grp-txt">
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
                </fieldset> */}
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
            <div className="re-setbutton">
              <div className="status-bnt">
                <button type="button" onClick={() => this.resetFilters()} className={`reset`}>Reset</button>
              </div>
            </div>
          </form>

          <div className="row">
            {
              this.props.events && this.props.events.length > 0
                ? <div className="col-md-12">
                  <div className="sf-card sf-shadow">
                    <div className="sf-card-body p-0">
                      <div className="job-calendar-view" id="calenderPopover">
                        {/* <DragAndDropCalendar /> */}
                        <CoreCalendar
                          new={this.state.new}
                          accepted={this.state.accepted}
                          started={this.state.started}
                          paused={this.state.paused}
                          completed={this.state.completed}
                          accountManager={this.state.accountManager}
                          selectedState={this.state.selectedState}
                          onEventSelection={this.handleEventSelection}
                          filters={this.state.filters}
                          searchString={this.state.searchString}
                          dropdowns={this.state.dropdowns}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                : null
            }
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    events: state.staffCalendar.staffJobsList,
    states: state.staffCalendar.stateNames,
    accountManagers: state.jobsManagement.accountManagersList,
    organizationsList: state.organization && state.organization.organizations && state.organization.organizations,
    formValues: state.form.serviceAgentStaffCalendar && state.form.serviceAgentStaffCalendar.values,
  }
}

const mapDispatchToprops = dispatch => ({
  organisationActions: bindActionCreators(organisationActions, dispatch),
  staffCalendarActions: bindActionCreators(staffCalendarActions, dispatch),
  jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
  jobDocActions: bindActionCreators(jobDocActions, dispatch),
})

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'serviceAgentStaffCalendar', enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ServiceAgentStaffCalendar)
