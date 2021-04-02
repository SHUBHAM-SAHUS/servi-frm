import React, { Component } from 'react';
import { Icon, Dropdown, Menu, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { reduxForm, Field, isDirty } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import * as SAIncidentReportActions from '../../../../../actions/SAIncidentReportActions'
import { Strings } from '../../../../../dataProvider/localize';
import { CustomDatepicker } from '../../../../common/customDatepicker';
import { CustomSelect } from '../../../../common/customSelect';
import moment from 'moment';
import $ from 'jquery';

import { pdf } from '@react-pdf/renderer';
import IncidentReportPdf from "./IncidentReportPdf";
import EditCorrectiveActions from './EditCorrectiveActions';
import { handleFocus } from '../../../../../utils/common';

export class ViewAssignIncidentReport extends Component {

  state = {
    cardExpnadBtn: true,
    currentAction: {},
    viewEdit: false
  }

  menu = (action) => (
    <Menu>
      <Menu.Item onClick={() => this.handleEditCorrectiveAction(action)}>
        Edit Details
      </Menu.Item>
    </Menu>
  )

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  handleEditCorrectiveAction = (action) => {
    /*  const key = index.keyPath[0].split("_")[1]
     const currentAction = this.props.incidentReportDetails.correctives[key]
     this.setState(() => {
       return {
         currentAction: currentAction
       }
     }) */
    this.cancelEdit();
    this.props.reportActions.getActionAssign(action.id)
      .then(() => {
        this.setState({ currentAction: action, viewEdit: true })
        if (!this.state.cardExpnadBtn) {
          this.handleExpand()
        }
      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });

  }

  cancelEdit = () => {
    this.setState({ viewEdit: false })
  }

  printDocument = () => {
    var obj = pdf(<IncidentReportPdf selectedScopeDoc={this.props.selectedScopeDoc} />).toBlob();
    obj.then(function (blob) {
      var url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      return Promise.resolve(blob)
    }).then((res) => {
      this.blobData = res
    })
  }


  render() {

    const { currentAction, viewEdit } = this.state;
    const { incidentReportDetails, usersList, riskControls } = this.props;
    const { consultations, authorizations, corrective_actions, incident_report_detail, persons, witnesses } = incidentReportDetails;
    const authorization = authorizations; const corrective = corrective_actions; const incidentReportDetail = incident_report_detail;
    const person = persons; const witness = witnesses;
    const basicReportDetails = incidentReportDetail && incidentReportDetail.length > 0 && incidentReportDetail[0];

    const reportingUser = incidentReportDetail
      && incidentReportDetail.length > 0
      && usersList.find(employee => employee.user_name.toString() === incidentReportDetail[0].reporting_employee.toString())

    const reportCategories = basicReportDetails
      && basicReportDetails.actual_incident_category
      && basicReportDetails.actual_incident_category.length > 0
      && basicReportDetails.actual_incident_category.split(",").map(ele => parseInt(ele));

    const categoryData = reportCategories && reportCategories.length > 0 ? this.props.incidentCategories.filter(category => reportCategories.includes(category.id)) : null

    // return basicReportDetails && reportingUser && categoryData && person && witness && corrective && authorization
    return (
      <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <div className="row">
          <div className="col-md-12 col-lg-8">
            <form>
              <div className="sf-card-wrap">
                {/* zoom button  */}
                <div className="card-expands">
                  <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                    <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                </div>

                {/* General Information */}
                {/*    <div className="sf-card">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                      <h2 className="sf-pg-heading">{Strings.general_information}</h2>
                    </div>
                    <div className="sf-card-body mt-2">
                      <div className="data-v-row">
                        <div class="data-v-col">
                          <div class="view-text-value">
                            <label>{Strings.entered_by}</label>
                            <span>{basicReportDetails.incident_entered_by}</span>
                          </div>
                        </div>
                        <div class="data-v-col">
                          <div class="view-text-value">
                            <label>{Strings.responsible_manager}</label>
                            <span>{basicReportDetails.incident_responsible_manager}</span>
                          </div>
                        </div>
                        <div class="data-v-col">
                          <div class="view-text-value">
                            <label>{Strings.closeout_manager}</label>
                            <span>{basicReportDetails.incident_closeout_manager}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> */}

                {/* Admin Details */}
                <div className="sf-card">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.admin_details}</h2>
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
                          <label>{Strings.employee_reporting}</label>
                          <span>{reportingUser ? reportingUser.name + " " + (reportingUser.last_name ? reportingUser.last_name : "") : ""}</span>
                        </div>
                      </div>
                      <div class="data-v-col">
                        <div class="view-text-value">
                          <label>{Strings.date_Time_of_report}</label>
                          <span>{`${moment(incidentReportDetail && incidentReportDetail.report_date).format("MM-DD-YYYY")}, ${moment(incidentReportDetail && incidentReportDetail.report_time).format("HH:MM A")}`}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incident Details */}
                <div className="sf-card  mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.incident_details}</h2>
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
                          <label>{Strings.date_Time_of_report}</label>
                          <span>{`${moment(incidentReportDetail && incidentReportDetail.report_date).format("MM-DD-YYYY")}, ${moment(incidentReportDetail && incidentReportDetail.report_time).format("HH:MM A")}`}</span>
                        </div>
                      </div>
                      {/* <div class="data-v-col">
                          <div class="view-text-value">
                            <label>{Strings.division}</label>
                            <span>{basicReportDetails.division}</span>
                          </div>
                        </div> */}
                      {/*  <div class="data-v-col">
                          <div class="view-text-value">
                            <label>{Strings.business_unit}</label>
                            <span>{basicReportDetails.business_unit}</span>
                          </div>
                        </div> */}
                      {/* <div class="data-v-col">
                          <div class="view-text-value">
                            <label>{Strings.state_txt}</label>
                            <span>{basicReportDetails.state}</span>
                          </div>
                        </div> */}
                      <div class="data-v-col">
                        <div class="view-text-value">
                          <label>{Strings.location_txt}</label>
                          <span>{basicReportDetails && basicReportDetails.location}</span>
                        </div>
                      </div>
                      {/* <div class="data-v-col">
                          <div class="view-text-value">
                            <label>{Strings.company_txt}</label>
                            <span>{basicReportDetails.company}</span>
                          </div>
                        </div> */}
                      {/* <div class="data-v-col">
                          <div class="view-text-value">
                            <label>{Strings.project_txt}</label>
                            <span>{basicReportDetails.project}</span>
                          </div>
                        </div> */}
                      {/* <div class="data-v-col">
                          <div class="view-text-value">
                            <label>{Strings.is_this_work_related}</label>
                            <span>{basicReportDetails.is_work_related ? 'Yes' : 'No'}</span>
                          </div>
                        </div> */}
                    </div>
                    <div className="data-v-row">
                      <div class="data-v-col no-border">
                        <div class="view-text-value">
                          <label>{Strings.description_txt}</label>
                          <span>{basicReportDetails && basicReportDetails.description}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Incident Categories */}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.incident_categories}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body mt-2">
                    <ul className="incident-lists">
                      {categoryData && Object.values(categoryData).map(category => <li>{category.name}</li>)}
                    </ul>
                  </div>
                </div>


                {/* Other Information */}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Other Information</h2>
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
                          <label>Is this a Contractor Incident</label>
                          <span>{basicReportDetails && basicReportDetails.is_contractor_incident ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <div class="data-v-col">
                        <div class="view-text-value">
                          <label>Is this a Regulatory Notifiable Incident</label>
                          <span>{basicReportDetails && basicReportDetails.regulatory_notifiable_incident ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <div class="data-v-col">
                        <div class="view-text-value">
                          <label>Have any Notices Been Issued?</label>
                          <span>{basicReportDetails && basicReportDetails.any_issued ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      {/* New fields added */}
                      <div class="data-v-col">
                        <div class="view-text-value">
                          <label>Was the State Safety Regulator notified</label>
                          <span>{basicReportDetails && basicReportDetails.state_safely_regulator ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <div class="data-v-col">
                        <div class="view-text-value">
                          <label>Were police involved</label>
                          <span>{basicReportDetails && basicReportDetails.police_involved ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      <div class="data-v-col">
                        <div class="view-text-value">
                          <label>Is this a workers compensation related incident</label>
                          <span>{basicReportDetails && basicReportDetails.worker_compensation_related ? 'Yes' : 'No'}</span>
                        </div>
                      </div>
                      {/* --- */}
                    </div>
                    <div className="data-v-row">
                      <div class="data-v-col no-border">
                        <div class="view-text-value">
                          <label>{"What was done following the incident"}</label>
                          <span>{basicReportDetails && basicReportDetails.what_was_done}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Images */}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Images</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body mt-2">
                    <div className="images-list">
                      {/* {
                          incidentFiles.map(file => {
                            return (
                              <div className="imgs-items">
                                <i class="glyph-item" aria-hidden="true" data-icon="&#xe032;" data-js-prompt="&amp;#xe032;"></i>
                                <a href={file}><span className="img-title">incidentFile.JPG</span></a>
                              </div>
                            )
                          })
                        } */}
                      <div className="imgs-items">
                        <i class="glyph-item" aria-hidden="true" data-icon="&#xe032;" data-js-prompt="&amp;#xe032;"></i>
                        <a target="_blank" rel="noopener noreferrer" href={basicReportDetails && basicReportDetails.incident_files}><span className="img-title">
                          {basicReportDetails && basicReportDetails.incident_files &&
                            basicReportDetails.incident_files.split('/')[basicReportDetails.incident_files.split('/').length - 1]}</span></a>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Persons Involved */}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Persons Involved</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body mt-2">
                    <div className="incident-table">
                      <table className="add-user-table table">
                        <tr>
                          <th>Name</th>
                          <th>Type of Person</th>
                          <th>Other Details</th>
                        </tr>
                        {
                          person && person.map(item => {
                            return (
                              <tr>
                                <td>{item.name}</td>
                                <td>{item.type_of_person}</td>
                                <td>{item.other_detail}</td>
                              </tr>
                            )
                          })
                        }
                        {/* <tr>
                            <th>Name</th>
                            <th>Type of Person</th>
                            <th>Other Details</th>
                          </tr>
                          <tr>
                            <td>Paul Smith</td>
                            <td>Aenean Elementum </td>
                            <td>Nunc vitae mollis est, eu suscipit velit</td>
                          </tr>
                          <tr>
                            <td>Paul Smith</td>
                            <td>Aenean Elementum </td>
                            <td>Nunc vitae mollis est, eu suscipit velit</td>
                          </tr> */}
                      </table>
                    </div>
                  </div>
                </div>


                {/* Witnesses */}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Witnesses</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body mt-2">
                    <div className="incident-table">
                      <table className="add-user-table table">
                        <tr>
                          <th>Name</th>
                          <th>Type of Person</th>
                          <th>Other Details</th>
                        </tr>
                        {
                          witness && witness.map(item => {
                            return (
                              <tr>
                                <td>{item.name}</td>
                                <td>{item.type_of_person}</td>
                                <td>{item.other_detail}</td>
                              </tr>
                            )
                          })
                        }
                      </table>
                    </div>
                  </div>
                </div>

                {/* Consultations new added */}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Consultations</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body mt-2">
                    <div className="incident-table">
                      <table className="add-user-table table">
                        <tr>
                          <th>Name</th>
                          <th>Position</th>
                          <th>Contact details</th>
                        </tr>
                        {
                          consultations && consultations.map(item => {
                            return (
                              <tr>
                                <td>{item.name}</td>
                                <td>{item.position}</td>
                                <td>{item.contact_details}</td>
                              </tr>
                            )
                          })
                        }
                      </table>
                    </div>
                  </div>
                </div>

                {/* Corrective Actions */}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Corrective Actions</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body mt-2">
                    {
                      corrective && corrective.map((action, index) => {
                        return (
                          <div className="cor-action">
                            <div className="info-btn">
                              <Dropdown className="more-info" overlay={() => this.menu(action)}>
                                <i className="material-icons">more_vert</i>
                              </Dropdown>
                            </div>
                            <div className="data-v-row">
                              <div class="data-v-col no-border">
                                <div class="view-text-value">
                                  <label>Describe what needs to be done</label>
                                  <span>{action.required_action}</span>
                                </div>
                              </div>
                            </div>
                            <div className="data-v-row">
                              <div class="data-v-col">
                                <div class="view-text-value">
                                  <label>Risk Control</label>
                                  <span>{riskControls && riskControls.find(control => control.id === action.risk_control) && riskControls.find(control => control.id === action.risk_control).name}</span>
                                </div>
                              </div>
                              <div class="data-v-col">
                                <div class="view-text-value">
                                  <label>Who is Responsible?</label>
                                  <span>{usersList && usersList.find(user => user.user_name.toString() === action.responsible_person.toString()) &&
                                    usersList.find(user => user.user_name.toString() === action.responsible_person.toString()).name}</span>
                                </div>
                              </div>
                              <div class="data-v-col">
                                <div class="view-text-value">
                                  <label>Date for Completion</label>
                                  <span>{moment(action.completion_date).format("MM-DD-YYYY")}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    }
                  </div>
                </div>


                {/* Authorisation of Corrective Actions */}
                <div className="sf-card  mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Authorisation of Corrective Actions</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  {
                    authorization && authorization.map(author => {
                      return (
                        <div className="sf-card-body au-sign">
                          <div className="data-v-row">
                            <div class="data-v-col no-border">
                              <div class="view-text-value">
                                <label>Signature</label>
                                <img alt="signature" className="sign-img" src={author.sign} />
                              </div>
                            </div>
                          </div>
                          <div className="data-v-row">
                            <div class="data-v-col">
                              <div class="view-text-value">
                                <label>Who is Responsible?</label>
                                <span>{author.name}</span>
                              </div>
                            </div>
                            <div class="data-v-col">
                              <div class="view-text-value">
                                <label>Date for Completion</label>
                                <span>{moment(author.date).format("MM-DD-YYYY")}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
              </div>
            </form>
            {/* you can remove after proper design of pdf view */}
            {/* <div className="btn-hs-icon my-4">
                <button type="button" className="bnt bnt-normal" onClick={this.printDocument}>Open PDF</button>
              </div> */}
          </div>

          {/* Right Section */}
          {
            viewEdit
              ? <EditCorrectiveActions
                form={'editCorrective_' + currentAction.id}
                cancelEdit={this.cancelEdit}
                initialValues={this.props.actionAssign}
                incident_corrective_id={currentAction.id}
              />
              : null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  incidentReportDetails: state.sAIncidentManagement.incidentReportDetails,
  usersList: state.organizationUsers.users,
  incidentCategories: state.sAIncidentManagement.incidentCategories,
  riskControls: state.sAIncidentManagement.riskControls,
  actionAssign: state.sAIncidentManagement.actionAssign
})

const mapDispatchToProps = dispatch => {
  return {
    reportActions: bindActionCreators(SAIncidentReportActions, dispatch),

  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({ form: 'assignIncident', enableReinitialize: true ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(ViewAssignIncidentReport)
