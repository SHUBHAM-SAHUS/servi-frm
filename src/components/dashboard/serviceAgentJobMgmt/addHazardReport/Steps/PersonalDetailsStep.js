import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown } from 'antd';

import { Field, reduxForm, FieldArray, FormSection } from 'redux-form';
import { Strings } from '../../../../../dataProvider/localize'
import { customInput } from '../../../../common/custom-input';
import { CustomCheckbox } from '../../../../common/customCheckbox'
import { customTextarea } from '../../../../common/customTextarea';
import { CustomSelect } from '../../../../common/customSelect';
import { CustomAutoCompleteSearch } from '../../../../common/customAutoCompleteSearch';
import { CustomDatepicker } from '../../../../common/customDatepicker'
import { getStorage } from '../../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../../dataProvider/constant';
import moment from 'moment'
import { validate } from '../../../../../utils/Validations/HazardReportValidation'

export class PersoanlDetailsStep extends Component {

  state = {

  }

  componentDidMount() {
  }

  onReportTimeChange = (value) => {
    this.props.change("report_time", value)
  }

  disabledDate = (current) => {
    const { job_details } = this.props.jobDetails
    const start_date = job_details && job_details[0] && job_details[0].job_start_date ? moment(job_details[0].job_start_date) : null;
    const end_date = job_details && job_details[0] && job_details[0].job_end_date ? moment(job_details[0].job_end_date).add(1, 'day') : null;
    return ((current < start_date) || (current > end_date));
  }

  render() {
    const currentUser = JSON.parse(getStorage(ADMIN_DETAILS))
    const { usersList, likelihood, consequences, touched, error } = this.props

    return (
      <div className="sf-card">
      BABUSHKA
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h2 className="sf-pg-heading">Hazard Details</h2>
          <div className="info-btn disable-dot-menu">
            <Dropdown className="more-info" disabled>
              <i className="material-icons">more_vert</i>
            </Dropdown>
          </div>
        </div>
        <div className="sf-card-body">
          <div className="row">
            <div className="col-md-2 col-sm-12">
              <div class="view-text-value sf-form">
                <label>{Strings.name_txt}</label>
                <span>{currentUser.name + " " + (currentUser.last_name ? currentUser.last_name : "")}</span>
              </div>
            </div>
            <div className="col-md-4 col-sm-12">
              <fieldset className="sf-form form-group">
                <Field
                  name="hazard_location"
                  label={"Location"}
                  placeholder={Strings.location_hazd}
                  type="text"
                  component={customInput} />
              </fieldset>
            </div>
            <div className="col-md-4 col-sm-12">
              <fieldset className="sf-form form-group">
                <Field
                  name="description"
                  label={"Description"}
                  placeholder={Strings.description_hazd}
                  type="text"
                  component={customTextarea} />
              </fieldset>
            </div>
            <div className="col-md-4">
              <fieldset className="form-group sf-form lsico">
                <Field
                  name="hazard_date"
                  label={"Date of Hazard"}
                  disabledDate={this.disabledDate}
                  component={CustomDatepicker} />
              </fieldset>
            </div>
            <div className="col-lg-12">
              <div className="sf-form form-group">
                <label>Hazard Categories</label>
                {touched && error && error.hazard_categories ? <span className="error-input">{error.hazard_categories}</span> : null}
                <FormSection
                  name="hazard_categories"
                  className="alsf-checkbx  remove-error">
                  {
                    this.props.hazardCategories && this.props.hazardCategories.map(category => {
                      return (
                        <Field
                          onChange={this.handleCategories}
                          name={category.id}
                          label={category.name}
                          component={CustomCheckbox}
                        />
                      )
                    })
                  }
                </FormSection>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <fieldset className="sf-form form-group">
                <Field
                  name="immediate_action_taken"
                  label={"Immediate Action Taken"}
                  placeholder={Strings.immediate_action_taken_hazd}
                  type="text"
                  component={customTextarea} />
              </fieldset>
            </div>
            <div className="col-md-4 col-sm-12">
              <fieldset className="sf-form form-group">
                <Field
                  name="likelihood"
                  label={"Likelihood"}
                  type="text"
                  options={likelihood.map(control => ({
                    title: control.name,
                    value: control.id
                  }))}
                  component={CustomSelect} />
              </fieldset>
            </div>
            <div className="col-md-4 col-sm-12">
              <fieldset className="sf-form form-group">
                <Field
                  name="consequence"
                  label={"Consequence"}
                  type="text"
                  options={consequences.map(control => ({
                    title: control.name,
                    value: control.id
                  }))}
                  component={CustomSelect} />
              </fieldset>
            </div>
          </div>
          <div className="row">
            <div className="col-md-4 col-sm-12">
              <fieldset className="sf-form form-group">
                <Field
                  name="responsible_person"
                  label={"Responsible Person"}
                  type="text"
                  dataSource={usersList && usersList.map(user => ({
                    text: user.name + " " + (user.last_name ? user.last_name : ""),
                    value: user.user_name
                  }))}
                  component={CustomAutoCompleteSearch} />
              </fieldset>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  jobDetails: state.sAJobMgmt.jobDetails,
  likelihood: state.sAIncidentManagement.allLikelihood,
  consequences: state.sAIncidentManagement.allConsequences,
  formValues: state.form.hazardReport && state.form.hazardReport.values,
  error: state.form.hazardReport.syncErrors,
  touched: state.form.hazardReport.anyTouched,
  hazardCategories: state.sAIncidentManagement.incidentCategories,
  usersList: state.organizationUsers.users
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(PersoanlDetailsStep)
