import React, { Component } from 'react';
import { Icon, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import { Route } from 'react-router-dom';
import $ from 'jquery';

import { Strings } from '../../../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../../../dataProvider/constant';
import { getStorage, goBack, handleFocus } from '../../../../../utils/common';
import HazardReportSearch from './HazardReportSearch';
import { validate } from '../../../../../utils/Validations/roleValidation';
import ViewAssignHazardReport from './ViewAssignHazardReport';
import * as orgUserActions from '../../../../../actions/organizationUserAction';
import * as reportActions from '../../../../../actions/SAIncidentReportActions'
import { ERROR_NOTIFICATION_KEY } from '../../../../../config';
const mapRouteToTitle = {
  '/dashboard/reports': 'Reports'
}
export class AssignHazardReports extends Component {
  constructor(props) {
    super(props);
    this.state = { togleSearch: true }
  }

  componentDidMount() {
    const orgId = JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id;
    this.props.reportActions.getAllHazardsNew(orgId)
      .then((flag) => {
        this.props.orgUserActions.getOrganizationUsers(orgId)
      })
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
  }

  handleSearchToggle = () => {
    this.setState({ togleSearch: !this.state.togleSearch })
  }

  roleAccessControl = "rolesmanagement" in JSON.parse(getStorage(ACCESS_CONTROL)) ? JSON.parse(getStorage(ACCESS_CONTROL))["rolesmanagement"].permissions : [];
  /**Permissions for the module */
  permissions = {
    org_list_role: this.roleAccessControl.findIndex(acess => acess.control_name === 'org_list_role'),
    org_create_role: this.roleAccessControl.findIndex(acess => acess.control_name === 'org_create_role'),
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
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            Hazard Reports
          </h2>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">

            {/* Left section */}

            <HazardReportSearch
              handleSearchToggle={this.handleSearchToggle}
              togleSearch={this.state.togleSearch}
            />

            <Route
              path={this.props.match.path + '/showHazardReport'}
              render={(props) => <ViewAssignHazardReport {...props} togleSearch={this.state.togleSearch} />}
            />

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  hazardReportDetails: state.sAIncidentManagement.hazardReportDetails,
  hazardReports: state.sAIncidentManagement.allHazardReports
})

const mapDispatchToProps = dispatch => {
  return {
    reportActions: bindActionCreators(reportActions, dispatch),
    orgUserActions: bindActionCreators(orgUserActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({ form: 'assignHazardReports', validate, enableReinitialize: true ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(AssignHazardReports)
