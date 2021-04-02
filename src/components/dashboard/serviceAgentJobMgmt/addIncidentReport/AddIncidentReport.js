import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Strings } from '../../../../dataProvider/localize'
import { Icon, Modal, notification } from 'antd';
import { bindActionCreators, compose } from 'redux';
import { reduxForm } from 'redux-form';
import { goBack, handleFocus, goBackBrowser } from '../../../../utils/common';

import StepsProgress from './StepsProgress'
import IncidentDetailsStep from './Steps/IncidentDetailsStep';
import OtherInformationStep from './Steps/OtherInformationStep'
import CorrectiveActionsStep from './Steps/CorrectiveActionsStep';
import * as SAIncidentReportActions from '../../../../actions/SAIncidentReportActions'
import * as organisationUserActions from '../../../../actions/organizationUserAction'
import { states } from '../../../../utils/common'
import { ADMIN_DETAILS, USER_NAME, VALIDATE_STATUS } from '../../../../dataProvider/constant'
import { getStorage } from '../../../../utils/common';
import { validate } from '../../../../utils/Validations/IncidentReportValidation';
import moment from 'moment';
import { ERROR_NOTIFICATION_KEY } from '../../../../config';
import { DeepTrim } from '../../../../utils/common';

export class AddIncidentReport extends Component {

  state = {
    stepNumber: 0,
    visible: false
  }

  componentDidMount() {
    this.props.organisationUserActions.getOrganizationUsers(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id)
      .then(() => { })
      .catch((message) => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });

    this.props.reportActions.getIncidentCategories()
      .then(() => { })
      .catch((message) => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });

    this.props.reportActions.getRiskControls()
      .then(() => { })
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

  handleNextClick = () => {
    this.setState({ stepNumber: this.state.stepNumber + 1 })
  }

  handlePreviousClick = () => {
    this.setState({ stepNumber: this.state.stepNumber - 1 })
  }

  onSubmit = async formData => {
    formData = await DeepTrim(formData);

    var finalFormData = new FormData();
    const fileMap = [];
    finalFormData.append("reporting_employee", JSON.parse(getStorage(USER_NAME)))
    // finalFormData.append("date", moment().format());
    Object.keys(formData).map(key => {
      if (key === "report_date" || key === "incident_date" || key === "completion_date" || key === "completion_date") {
        formData[key] = formData[key] && formData[key].format && formData[key].format();
        finalFormData.append(key, formData[key]);
      } else if (key === "report_time" || key === "incident_time") {
        formData[key] = formData[key].format && formData[key].format()
        finalFormData.append(key, formData[key]);
      } else if (key === "state") {
        const selectedState = states.find(state => state.id.toString() === formData[key].toString())
        formData[key] = selectedState.name;
        finalFormData.append(key, formData[key]);
      } else if (key === "actual_incident_category") {
        const categories = [];
        formData[key].forEach((value, index) => {
          if (value === true) {
            categories.push(index);
          }
        })
        formData[key] = categories
        finalFormData.append(key, JSON.stringify(formData[key]));
      } else if (key === 'incidentFiles') {
        Object.values(formData[key]).forEach(file => {
          finalFormData.append('files', file.originFileObj);
          fileMap.push({ "name": "incident_file" })
        })
      } else if (key === 'persons' || key === 'witnesses') {
        finalFormData.append(key, JSON.stringify(formData[key]))
      } else if (key === 'signatureFile') {
        finalFormData.append('files', formData[key]);
        fileMap.push({ "name": "signature" })
      } else if (key !== 'signatureFileUrl' && key !== 'signatureFile' && key !== 'incidentFiles') {
        finalFormData.append(key, JSON.stringify(formData[key]));
      }

    })
    finalFormData.append("file_map", JSON.stringify(fileMap));
    finalFormData.append("job_id", this.props.location.job_id);
    finalFormData.append("org_id", JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id)
    finalFormData.append("reporting_employee_email", JSON.parse(getStorage(ADMIN_DETAILS)).email_address)
    this.props.reportActions.addIncidentReport(finalFormData)
      .then((flag) => {
        this.props.reset();
        this.setState({ stepNumber: 0 })
        Modal.success({
          title: Strings.success_title,
          content: (
            <div className="thnu-wrap">
              <span class="glyph-item mega" aria-hidden="true" data-icon="&#xe080;" data-js-prompt="&amp;#xe080;"></span>
              <h1>Thank You!</h1>
              <p>The Incident Report was submitted successfully.</p>
              <button type="button" onClick={() => { 
                // goBack(this.props);
                goBackBrowser(this.props);
                 Modal.destroyAll(); }} className="bnt bnt-active">Go to Job Details</button>
              <button className="normal-bnt" onClick={() => {
                this.props.history.push('/dashboard/reports/incident-reports');
                Modal.destroyAll();
              }}>View Incident Reports</button>
            </div>
          )
        });
      })
      .catch((error) => {
        if (error.status == VALIDATE_STATUS) {
          notification.warning({
            message: Strings.validate_title,
            description: error && error.data && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_validate,
            onClick: () => { },
            className: 'ant-warning'
          });
        } else {
          notification.error({
            message: Strings.error_title,
            description: error && error.data && error.data.message && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        }
      });
  }

  // save modal
  showModal = () => {
    const { errors, touch, valid } = this.props;
    if (!valid) {
      touch(...Object.keys(errors));
      touch(`persons[0].name`, `persons[0].type_of_person`, 'persons[0].other_detail',
        `witnesses[0].name`, `witnesses[0].type_of_person`, 'witnesses[0].other_detail');
      if (errors.incident_date || errors.incident_time || errors.location || errors.description || errors.actual_incident_category) {
        this.setState({ stepNumber: 0 });
      }
      var personTest = true;
      var personFlag = 0;
      if (errors.persons && errors.persons.length > 0) {
        errors.persons.forEach(err => {
          if (Object.keys(err).length > 0)
            personFlag++;
        })
      } /* else
        personTest = false */

      var witnessTest = true;
      var witnessFlag = 0;
      if (errors.witnesses && errors.witnesses.length > 0) {
        errors.witnesses.forEach(err => {
          if (Object.keys(err).length > 0)
            witnessFlag++;
        })
      } /* else
        personTest = false */

      if (errors.whats_was_done /* || personTest || witnessTest */ || personFlag > 0 || witnessFlag > 0) {
        this.setState({ stepNumber: 1 });
      }
    }
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {

    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {

    this.setState({
      visible: false,
    });
  };

  render() {

    const { handleSubmit } = this.props
    return (
      <div className="sf-page-layout">
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => 
            // goBack(this.props)
            goBackBrowser(this.props)
            } />
            Incident Report
          </h2>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            <div className="col-lg-12">
              <div className="sf-card-wrap">
                <form onSubmit={handleSubmit(this.onSubmit)}>
                  <div className="row">
                    <div className="col-md-2 col-sm-3 col-xs-4">
                      <div className="sf-card">
                        <div className="sf-card-body">
                          <StepsProgress
                            currentStep={this.state.stepNumber}
                          />
                        </div></div></div>

                    <div className="col-md-10 col-sm-9 col-xs-8">
                      <>
                        <div className={this.state.stepNumber === 0 ? "" : 'd-none'}>
                          <IncidentDetailsStep
                            change={this.props.change}
                          />
                        </div>
                        <div className={this.state.stepNumber === 1 ? "" : 'd-none'}>
                          <OtherInformationStep
                            change={this.props.change}
                          />
                        </div>
                        <div className={this.state.stepNumber === 2 ? "" : 'd-none'}>
                          <CorrectiveActionsStep
                            change={this.props.change}
                          />
                        </div>
                      </>
                    </div>
                  </div>
                  <div className="all-btn d-flex justify-content-end mt-4 pl-bnt-2">
                    {this.state.stepNumber > 0 && this.state.stepNumber <= 3 ? <div className="btn-hs-icon sm-bnt"><button type="button" className="bnt bnt-normal" onClick={() => this.handlePreviousClick()}>Previous</button></div> : null}
                    {this.state.stepNumber <= 1 ? <div className="btn-hs-icon sm-bnt"><button type="button" className="bnt bnt-active" onClick={() => this.handleNextClick()}>Next</button></div> : null}
                    {this.state.stepNumber === 2 ? <div className="btn-hs-icon sm-bnt"><button type="submit" className="bnt bnt-active" onClick={this.showModal}>Submit</button></div> : null}
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>

      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  formValues: state.form.incidentReport && state.form.incidentReport.values,
  errors: state.form.incidentReport && state.form.incidentReport.syncErrors,
  incidentCategories: state.sAIncidentManagement.incidentCategories,
  jobDetails: state.sAJobMgmt.jobDetails,
  initialValues: {
    date: moment().format('YYYY-MM-DD')
  }
})

const mapDispatchToProps = dispatch => ({
  reportActions: bindActionCreators(SAIncidentReportActions, dispatch),
  organisationUserActions: bindActionCreators(organisationUserActions, dispatch)
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({ form: 'incidentReport', validate ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(AddIncidentReport)
