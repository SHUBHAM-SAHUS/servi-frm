import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Dropdown } from 'antd';

import { Field, reduxForm, FieldArray, FormSection } from 'redux-form';
import { Strings } from '../../../../../dataProvider/localize'
import { TimePicker, Radio } from 'antd';
import { CustomSelect } from '../../../../common/customSelect';
import { CustomDatepicker } from '../../../../common/customDatepicker';
import { customInput } from '../../../../common/custom-input'
import { customTextarea } from '../../../../common/customTextarea'
import { CustomCheckbox } from '../../../../common/customCheckbox'
import moment from 'moment'
import { incidents, states } from '../../../../../utils/common';
import { stat } from 'fs';
import { getStorage } from '../../../../../utils/common';
import { ADMIN_DETAILS, USER_NAME } from '../../../../../dataProvider/constant'


export class IncidentDetailsStep extends Component {

  state = {
    value: -1
  }

  componentDidMount() {

  }

  onReportTimeChange = (value) => {
    this.props.change("incident_time", value)
  }

  handleWorkRelatedChange = (event) => {
    this.setState({ value: event.target.value })
    this.props.change("is_work_related", event.target.value)
  }

  disabledDate = (current) => {
    // console.log(current,"currentttttttttttttt");
    
    const { job_details } = this.props.jobDetails
    const start_date = job_details && job_details[0] && job_details[0].job_start_date ? moment(job_details[0].job_start_date) : null;
    const end_date = job_details && job_details[0] && job_details[0].job_end_date ? moment(job_details[0].job_end_date).add(1, 'day') : null;
    return ((current < start_date) || (current > end_date));
  }
  

  render() {
    const { touched, error } = this.props;
    return (
      <>
        <div className="sf-card">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">{Strings.incident_details}</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">
            <div className="row">
              <div className="col-md-4 col-sm-12">
                <div className="row">
                  <div className="col-md-7">
                    <fieldset className="form-group sf-form lsico">
                      <Field
                        name="incident_date"
                        disabledDate={this.disabledDate}
                        label={Strings.date_of_incident}
                        type="date"
                        component={CustomDatepicker} />
                    </fieldset>
                  </div>
                  <div className="col-md-5">
                    <fieldset className="form-group sf-form lsico w-100">
                      <label>{Strings.time_txt}</label>
                      <TimePicker
                        name="incident_time"
                        use12Hours
                        value={this.props.formValues && this.props.formValues.incident_time && moment(this.props.formValues.incident_time)}
                        placeholder={`${moment(new Date()).format("h:mm a")}`}
                        format="h:mm a"
                        onChange={(value) => this.onReportTimeChange(value)} />
                      {touched && error && error.incident_time ? <span className="error-input">{error.incident_time}</span> : null}
                    </fieldset>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <div class="view-text-value sf-form">
                  <label>Reported by:</label>
                  <span>{JSON.parse(getStorage(ADMIN_DETAILS)).name ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
                    (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : null}</span>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4 col-sm-12">
                <fieldset className="form-group sf-form">
                  <Field
                    name="location"
                    label={Strings.location_txt}
                    placeholder={Strings.location_incd_rep}
                    type="text"
                    component={customInput} />
                </fieldset>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-sm-12">
                <fieldset className="sf-form">
                  <Field
                    label={Strings.description}
                    name="description"
                    placeholder={Strings.description_incd_rep}
                    type="text"
                    id="description"
                    component={customTextarea} />
                </fieldset>
              </div>
            </div>

          </div>
        </div>

        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">{Strings.incident_categories}</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                {touched && error && error.actual_incident_category ? <span className="error-input">{error.actual_incident_category}</span> : null}
                <FormSection
                  name="actual_incident_category"
                  className="alsf-checkbx  remove-error">
                  {
                    this.props.incidentCategories && this.props.incidentCategories.map(incident => {
                      return (
                        <Field
                          name={incident.id}
                          label={incident.name}
                          component={CustomCheckbox}
                        />
                      )
                    })
                  }
                </FormSection>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  formHolder: state.form.incidentReport,
  formValues: state.form.incidentReport && state.form.incidentReport.values,
  incidentCategories: state.sAIncidentManagement.incidentCategories,
  error: state.form.incidentReport.syncErrors,
  touched: state.form.incidentReport.anyTouched,
  jobDetails: state.sAJobMgmt.jobDetails,
})

export default connect(mapStateToProps)(IncidentDetailsStep)
