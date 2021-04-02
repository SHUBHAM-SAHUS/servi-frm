import React, { Component } from 'react'
import { connect } from 'react-redux'

import { Field, reduxForm, FieldArray } from 'redux-form';
import { Strings } from '../../../../../dataProvider/localize'
import { Upload, Icon, Modal, Calendar, Select, Carousel, Collapse, TimePicker, Radio, Popover, Button, Steps, Divider, Dropdown } from 'antd';
import { CustomSelect } from '../../../../common/customSelect';
import { CustomDatepicker } from '../../../../common/customDatepicker';
import { customInput } from '../../../../common/custom-input';

export class GeneralDetailsStep extends Component {

  state = {

  }

  componentDidMount() {

  }

  onReportTimeChange = (value) => {
    this.props.change("report_time", value)
  }

  render() {
    return (
      <>
        <div className="sf-card">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">{Strings.general_information}</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">
            <div className="data-v-col no-border">
              <div className="view-text-value sf-form">
                <label>{Strings.entered_by}</label>
                <span>Mikhil Kotak</span>
              </div>
            </div>
            <div className="row">
              <div className="col-md-5 col-sm-12">
                <fieldset className="sf-form">
                  <Field
                    name="incident_responsible_manager"
                    label={Strings.responsible_manager}
                    type="text"
                    component={customInput} />
                </fieldset>
              </div>
              <div className="col-md-5 col-sm-12">
                <fieldset className="sf-form">
                  <Field
                    name="incident_closeout_manager"
                    label="Closeout Manager"
                    type="text"
                    component={customInput} />
                </fieldset>
              </div>
            </div>
          </div>
        </div>

        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">{Strings.admin_details}</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">
            <div className="row">
              <div className="col-md-5 col-sm-12">
                <fieldset className="sf-form form-group">
                  <Field
                    name="reporting_employee"
                    label={Strings.employee_reporting}
                    placeholder="Select"
                    options={this.props.users.map(user => ({
                      title: user.name + " " + (user.last_name ? user.last_name : " "),
                      value: user.id
                    }))}
                    component={CustomSelect}
                  />
                </fieldset>
              </div>
            </div>
            <div className="row">
              <div className="col-md-3 col-sm-12">
                <fieldset className="form-group sf-form lsico">
                  <Field
                    name="report_date"
                    label={Strings.date_of_report}
                    component={CustomDatepicker} />
                </fieldset>
              </div>
              <div className="col-md-2 col-sm-12">
                <fieldset className="form-group sf-form lsico">
                  <label>{Strings.time_of_report}</label>
                  <TimePicker
                    name="report_time"
                    use12Hours
                    placeholder="Time"
                    value={this.props.formValues && this.props.formValues.report_time && this.props.formValues.report_time}
                    format="h:mm a"
                    onChange={(value) => this.onReportTimeChange(value)}
                  />
                </fieldset>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  formValues: state.form.incidentReport && state.form.incidentReport.values,
  users: state.organizationUsers.users
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(GeneralDetailsStep)
