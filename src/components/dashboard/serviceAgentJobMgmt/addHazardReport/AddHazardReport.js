import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Strings } from '../../../../dataProvider/localize'
import { Icon, Steps, Modal, notification } from 'antd';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../../actions/organizationUserAction';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { goBack, handleFocus, goBackBrowser } from '../../../../utils/common';
import moment from 'moment'
import StepsProgress from './StepsProgress'
import PersonalDetailsStep from './Steps/PersonalDetailsStep';
import HazardDetailsStep from './Steps/HazardDetailsStep';
import CorrectiveActionsStep from './Steps/CorrectiveActionsStep';
import * as SAIncidentReportActions from '../../../../actions/SAIncidentReportActions'
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../../dataProvider/constant'
import { getStorage } from '../../../../utils/common';
import { validate } from '../../../../utils/Validations/HazardReportValidation'
import { ERROR_NOTIFICATION_KEY } from '../../../../config';
import { DeepTrim } from '../../../../utils/common';

const mapRouteToTitle = {
  '/dashboard/reports': 'Reports'
}

const { Step } = Steps;

export class AddHazardReport extends Component {

  state = {
    stepNumber: 0,
    visible: false,
    jobId: this.props.location.job_id
  }

  componentDidMount() {
    this.props.orgUserActions.getOrganizationUsers(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id)
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

    this.props.reportActions.getIncidentCategories()
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

    this.props.reportActions.getAllLikelihoodBeforeControl()
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

    this.props.reportActions.getAllBeforeConsequences()
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


  handleNextClick = () => {
    this.setState({ stepNumber: this.state.stepNumber + 1 })
  }

  handlePreviousClick = () => {
    this.setState({ stepNumber: this.state.stepNumber - 1 })
  }

  onSubmit = async formData => {
    formData = await DeepTrim(formData);

    const refinedFormData = {};

    refinedFormData["reporter_name"] = JSON.parse(getStorage(ADMIN_DETAILS)).user_name;
    refinedFormData["org_id"] = JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id;
    refinedFormData["job_id"] = this.props.location.job_id;

    Object.keys(formData).forEach(key => {
      if (key === "hazard_date") {
        refinedFormData[key] = formData[key].format("YYYY-MM-DD")
      } else if (key === "hazard_categories") {
        const categories = [];
        formData[key].forEach((value, index) => {
          if (value === true) {
            categories.push(index);
          }
        })
        // formData[key] = categories
        refinedFormData[key] = categories
      } else if (key === "responsible_person") {
        refinedFormData[key] = parseInt(formData[key])
      } else {
        refinedFormData[key] = formData[key]
      }
    })
    refinedFormData.reporter_email = JSON.parse(getStorage(ADMIN_DETAILS)).email_address;
    this.props.reportActions.addHazardReport(refinedFormData)
      .then((flag) => {
        this.props.reset();
        this.setState({ stepNumber: 0 })
        Modal.success({
          title: Strings.success_title,
          content: (
            <div className="thnu-wrap">
              <span class="glyph-item mega" aria-hidden="true" data-icon="&#xe080;" data-js-prompt="&amp;#xe080;"></span>
              <h1>Thank You!</h1>
              <p>The Hazard Report was submitted successfully.</p>
              <button type="button" onClick={() => { 
                // goBack(this.props); 
                goBackBrowser(this.props);
                Modal.destroyAll(); }} className="bnt bnt-active">Go to Job Details</button>
              <button className="normal-bnt" onClick={() => {
                this.props.history.push('/dashboard/reports/hazard-reports');
                Modal.destroyAll();
              }}>View Hazard Reports</button>
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
            {
              mapRouteToTitle[this.props.location.pathname]
                ? mapRouteToTitle[this.props.location.pathname]
                : 'Hazard Report'
            }
          </h2>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="sf-card-wrap">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <PersonalDetailsStep
                change={this.props.change}
              />
              <div className="all-btn d-flex justify-content-end mt-4 pl-bnt-2">
                <div className="btn-hs-icon sm-bnt"><button type="submit" className="bnt bnt-active" onClick={this.showModal}>Submit</button></div>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = dispatch => ({
  reportActions: bindActionCreators(SAIncidentReportActions, dispatch),
  orgUserActions: bindActionCreators(actions, dispatch)
})

export default compose(
  connect(null, mapDispatchToProps),
  reduxForm({ form: 'hazardReport', validate ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(AddHazardReport)
