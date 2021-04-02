import React, { Component } from 'react';
import { Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import { Route } from 'react-router-dom';
import $ from 'jquery';

import { Strings } from '../../../dataProvider/localize';
import { ACCESS_CONTROL } from '../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../utils/common';
import JobManagementSearch from './JobManagementSearch';
import { validate } from '../../../utils/Validations/roleValidation';
import * as jobManagementAction from '../../../actions/jobManagementAction';
import * as jobCalendarAction from '../../../actions/jobCalendarActions'
import ShowJobManagement from './showJobManagement';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
export class JobManagement extends Component {
  constructor(props) {
    super(props);
    this.state = { togleSearch: true }
  }
  componentDidMount() {
    this.props.jobManagementAction.initCompletedJobs()
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

  handleCancel = () => {
    this.setState({ displayEdit: 'none' });
  }


  render() {
    return (
      <div className="sf-page-layout">
        {/* inner header  */}

        {/* inner header  */}
        <div className="main-container">
          <div className="row">

            {/* Left section */}

            <JobManagementSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} />

            {/* center section  */}
            {<div className="col-md-9">
              <Route
                path={this.props.match.path + '/showJob'}
                render={(props) => <ShowJobManagement {...props} togleSearch={this.state.togleSearch} />}
              />

            </div>}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    completedJobList: state.completedJobManagement.completedJobList,
    completedJobDetail: state.completedJobManagement.completedJobDetail
  }
}

const mapDispatchToprops = dispatch => ({
  jobManagementAction: bindActionCreators(jobManagementAction, dispatch),
  jobCalendarAction: bindActionCreators(jobCalendarAction, dispatch)
})

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({ form: 'timeSheets', validate, enableReinitialize: true,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  } })
)(JobManagement)
