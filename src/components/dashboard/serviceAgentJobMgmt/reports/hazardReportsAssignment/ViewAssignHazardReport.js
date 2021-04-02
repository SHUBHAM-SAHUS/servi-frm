import React, { Component } from 'react';
import { Icon, Modal, Dropdown, Menu, notification } from 'antd';
import { connect } from 'react-redux';
import { reduxForm, Field } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import $ from 'jquery';
import * as SAIncidentReportActions from '../../../../../actions/SAIncidentReportActions';
import { Strings } from '../../../../../dataProvider/localize';
import { ADMIN_DETAILS } from '../../../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../../../utils/common';
import { assignValidate } from '../../../../../utils/Validations/HazardReportValidation';
import { customTextarea } from '../../../../common/customTextarea';
import { CustomSelect } from '../../../../common/customSelect';
import * as orgUserActions from '../../../../../actions/organizationUserAction';
import moment from 'moment'
import { CustomAutoCompleteSearch } from '../../../../common/customAutoCompleteSearch';
import { DeepTrim } from '../../../../../utils/common';

import { pdf } from '@react-pdf/renderer';
import HazardReportPdf from "./HazardReportPdf";

export class ViewAssignHazardReport extends Component {

  state = {
    cardExpnadBtn: true,
    displayEdit: 'none'
  }

  componentDidMount() {
    const orgId = JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id;

    this.props.orgUserActions.getOrganizationUsers(orgId)
  }

  static getDerivedStateFromProps(props, state) {

  }

  handleEditClick = () => {
    this.setState({
      displayEdit: 'block',
    })
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  printDocument = () => {
    var obj = pdf(<HazardReportPdf selectedScopeDoc={this.props.selectedScopeDoc} />).toBlob();
    obj
      .then(function (blob) {
        var url = URL.createObjectURL(blob);
        window.open(url, '_blank');
        return Promise.resolve(blob)
      })
      .then((res) => {
        this.blobData = res
      })
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  handleCloseEdit = () => {
    this.setState({ displayEdit: 'none', });
  }

  onSubmit = async formData => {
    formData = await DeepTrim(formData);

    formData.id = this.props.hazardDetails[0].id;
    formData.reporter_email = JSON.parse(getStorage(ADMIN_DETAILS)).email_address;
    this.props.reportActions.AssignHazard(formData)
      .then((flag) => {
        // this.props.reset();
        this.props.reportActions.getAllHazardsNew();
        this.props.reportActions.getHazardDetailsNew(formData.id, null, this.props.hazardDetails[0].job_id)
        notification.success({
          message: Strings.success_title,
          description: flag,
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
  render() {
    const { handleSubmit, users } = this.props
    const basicHazardDetails = this.props.hazardDetails && this.props.hazardDetails.length > 0 ? this.props.hazardDetails[0] : undefined

    var menu = (
      <Menu>
        <Menu.Item onClick={this.handleEditClick}>
          {'Edit Details'}
        </Menu.Item>
      </Menu>
    );

    var options = [{
      title: "Assigned",
      value: 0
    }, {
      title: 'In progress',
      value: 1
    }, {
      title: "Completed",
      value: 2
    }]

    return <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
      <div className="row">
        <div className="col-md-12 col-lg-8">
          <div className="sf-card-wrap">
            {/* zoom button  */}
            <div className="card-expands">
              <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
            </div>

            {/* Personal Details */}
            <div className="sf-card">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">Personal Details</h2>
                <div className="info-btn">
                  {/* Drop down for card */}
                  <Dropdown className="more-info" overlay={menu}>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                  {/*Drop down*/}
                </div>
              </div>
              <div className="sf-card-body mt-2">
                <div className="data-v-row">
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>{Strings.name_txt}</label>
                      <span>{basicHazardDetails && basicHazardDetails.reporter_details && basicHazardDetails.reporter_details.first_name}</span>
                    </div>
                  </div>
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>{Strings.position_txt}</label>
                      <span>{basicHazardDetails && basicHazardDetails.reporter_details && basicHazardDetails.reporter_details.role_name}</span>
                    </div>
                  </div>
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>Responsible Person</label>
                      <span>{basicHazardDetails && basicHazardDetails.responsible_person_details && basicHazardDetails.responsible_person_details.first_name}</span>
                    </div>
                  </div>
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>Responsible Person Position</label>
                      <span>{basicHazardDetails && basicHazardDetails.responsible_person_details && basicHazardDetails.responsible_person_details.role_name}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Hazard Details */}
            <div className="sf-card  mt-4">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">Hazard Details</h2>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled overlay={this.menu}>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body mt-2">
                <div className="data-v-row">
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>{Strings.date_Time_of_report}</label>
                      <span>{`${moment(basicHazardDetails && basicHazardDetails.hazard_date).format("MM-DD-YYYY")}, ${moment(basicHazardDetails && basicHazardDetails.hazard_time).format("HH:MM A")}`}</span>
                    </div>
                  </div>
                  <div class="data-v-col">
                    <div class="view-text-value">
                      <label>{Strings.location_txt}</label>
                      <span>{basicHazardDetails && basicHazardDetails.hazard_location}</span>
                    </div>
                  </div>
                </div>
                <div className="data-v-row">
                  <div class="data-v-col no-border">
                    <div class="view-text-value">
                      <label>Description</label>
                      <span>{basicHazardDetails && basicHazardDetails.description}</span>
                    </div>
                  </div>
                </div>
                <div class="data-v-col">
                  <div class="view-text-value">
                    <label>Consequences</label>
                    <span>{basicHazardDetails && basicHazardDetails.consequence_before_control && basicHazardDetails.consequence_before_control.name}</span>
                  </div>
                </div>
                <div class="data-v-col">
                  <div class="view-text-value">
                    <label>Likelihood</label>
                    <span>{basicHazardDetails && basicHazardDetails.likelihood_before_control && basicHazardDetails.likelihood_before_control.name}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Incident Categories */}
            <div className="sf-card mt-4">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">Hazard Categories</h2>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled overlay={this.menu}>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body mt-2">
                <ul className="incident-lists">
                  {basicHazardDetails && basicHazardDetails.hazard_categories && basicHazardDetails.hazard_categories.map(item => {
                    return <li>{item.name}</li>
                  })}
                </ul>
              </div>
            </div>

            <div className="sf-card  mt-4">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">Immediate Action Taken When Hazard Identified</h2>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled overlay={this.menu}>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body mt-2">
                <div className="incident-table">
                  <span>{basicHazardDetails && basicHazardDetails.immediate_action_taken}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="col-lg-4 col-md-12" style={{ display: this.state.displayEdit }}>
          <div className="sf-card">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h4 className="sf-sm-hd sf-pg-heading">Actions</h4>
            </div>
            <div className="sf-card-body mt-2">
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <fieldset className="sf-form form-group">
                  <Field
                    name="responsible_person"
                    label={' Responsible Person'}
                    placeholder="Select"
                    dataSource={users && users.map(user => ({
                      text: user.name + " " + (user.last_name ? user.last_name : ' '),
                      value: user.user_name.toString()
                    }))}
                    component={CustomAutoCompleteSearch} />
                </fieldset>

                <fieldset className="sf-form form-group lsico">
                  <Field
                    label={'Follow up / Action '}
                    name="follow_up"
                    component={customTextarea} />
                </fieldset>

                <fieldset className="sf-form form-group">
                  <Field
                    name="status"
                    label={'Status'}
                    placeholder="Select"
                    options={options}
                    component={CustomSelect} />
                </fieldset>

                <div className="all-btn multibnt mt-4">
                  <div className="btn-hs-icon d-flex justify-content-between">
                    <button className="bnt bnt-normal" type="button" onClick={this.handleCloseEdit}>
                      {Strings.cancel_btn}</button>
                    <button type="submit" className="bnt bnt-active">
                      {Strings.save_btn}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  }
}

const mapStateToProps = (state) => {
  return {
    hazardDetails: state.sAIncidentManagement.hazardDetails,
    hazardReportDetails: state.sAIncidentManagement.hazardReportDetails,
    users: state.organizationUsers.users,
    initialValues: state.sAIncidentManagement.hazardDetails[0] && state.sAIncidentManagement.hazardDetails[0].hazard_report_histories
      && state.sAIncidentManagement.hazardDetails[0].hazard_report_histories[0] ?
      state.sAIncidentManagement.hazardDetails[0].hazard_report_histories[0] :
      {}
  }
}

const mapDispatchToProps = dispatch => {
  return {
    orgUserActions: bindActionCreators(orgUserActions, dispatch),
    reportActions: bindActionCreators(SAIncidentReportActions, dispatch),

  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({ form: 'assignHazardReportss', validate: assignValidate, enableReinitialize: true ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(ViewAssignHazardReport)
