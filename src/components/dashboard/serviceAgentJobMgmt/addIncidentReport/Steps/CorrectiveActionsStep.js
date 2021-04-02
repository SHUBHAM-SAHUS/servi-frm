import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, FieldArray, FormSection } from 'redux-form';
import { Strings } from '../../../../../dataProvider/localize'
import { Upload, Dropdown } from 'antd';
import { CustomSelect } from '../../../../common/customSelect';
import { CustomDatepicker } from '../../../../common/customDatepicker';
import { customInput } from '../../../../common/custom-input'
import { customTextarea } from '../../../../common/customTextarea'
import { CustomCheckbox } from '../../../../common/customCheckbox'
import { goBack, getStorage } from '../../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../../dataProvider/constant';
import moment from 'moment'
import { SignCanvas } from '../../../../common/SignCanvas';
import { CustomAutoCompleteSearch } from '../../../../common/customAutoCompleteSearch';


const { Dragger } = Upload;

export class CorrectiveActionsStep extends Component {

  state = {
    fileList: [],
    documentSigned: false,
    fileUrl: ''
  }

  componentDidMount() {
    if (this.props.formValues && this.props.formValues.signatureFileUrl) {
      this.setState({
        documentSigned: true,
        fileUrl: this.props.formValues.signatureFileUrl
      })
    }
  }

  onSaveSignature = (signDetails, file) => {
    this.setState(prevState => {
      var url = URL.createObjectURL(file);
      this.props.change("signatureFile", file)
      this.props.change("signatureFileUrl", url)
      return {
        documentSigned: true,
        fileUrl: url
      }
    })
  }
  disabledDate = (current) => {
    const start_date = !current;
    const end_date = !current;
    return ((current < start_date) || (current > end_date));
  }

  renderPersonsInvolved = ({ fields }) => {
    /* if (fields.length === 0) {
      fields.push({})
    } */

    return (
      <>
        {
          fields.map((person, index) =>
            (
              <div className="tr">
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${person}.name`}
                      placeholder={Strings.name_incd_rep}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${person}.position`}
                      placeholder={Strings.position_incd_rep}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${person}.contact_details`}
                      placeholder={Strings.contact_details_incd_rep}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <div className="act-bnt">
                    <button class="delete-bnt delete-bnt" onClick={() =>
                      fields.remove(index)
                    }><i class="fa fa-trash-o"></i></button>
                  </div>
                </span>
              </div>
            )
          )
        }
        <button className="normal-bnt add-line-bnt mt-3" type="button" onClick={() => fields.push({})}><i class="material-icons">add</i>Add More People</button>
      </>
    )
  }

  renderCorrectiveActions = ({ fields }) => {
    if (fields.length === 0) {
      fields.push({})
    }

    return (
      <>
        {
          fields.map((person, index) =>
            (
              <div className="tr">
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${person}.risk_control`}
                      type="text"
                      options={this.props.riskControls.map(risk => ({ title: risk.name, value: risk.id }))}
                      component={CustomSelect} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${person}.required_action`}
                      placeholder={Strings.required_action_incd_rep}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form no-label select-wibg cor-act-srch">
                    <Field
                      name={`${person}.responsible_person`}
                      type="text"
                      placeholder={Strings.who_is_responsible}
                      dataSource={this.props.users.map(user => ({
                        text: user.name + " " + (user.last_name ? user.last_name : ""),
                        value: user.user_name
                      }))}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form lsico no-label">
                    <Field
                      name={`${person}.completion_date`}
                      placeholder={Strings.authorisor_name}
                      type="text"
                      component={CustomDatepicker} />
                  </fieldset>
                </span>
                <span className="td">
                  <div className="act-bnt">
                    <button class="delete-bnt delete-bnt" onClick={() =>
                      fields.remove(index)
                    }><i class="fa fa-trash-o"></i></button>
                  </div>
                </span>
              </div>
            )
          )
        }
        <button className="normal-bnt add-line-bnt mt-3" type="button" onClick={() => fields.push({})}><i class="material-icons">add</i>Add More Corrective Actions</button>
      </>
    )
  }

  render() {
    const { touched, error } = this.props;

    return (
      <>

        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Consultation</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">

            <div className="job-cleaning-report">
              <div className="sf-c-table org-user-table">
                <div className="tr">
                  <span className="th">Name</span>
                  <span className="th">Position</span>
                  <span className="th">Contact details</span>
                  <span className="th"></span>
                </div>
                <FieldArray
                  name="consultations"
                  component={this.renderPersonsInvolved}
                />
              </div>
            </div>

          </div>
        </div>

        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Corrective Actions</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">

            <div className="job-cleaning-report">
              <div className="sf-c-table org-user-table">
                <div className="tr">
                  <span className="th">Risk control</span>
                  <span className="th">Required Action</span>
                  <span className="th">Who is Responsible?</span>
                  <span className="th">Date for Completion</span>
                  <span className="th"></span>
                </div>
                <FieldArray
                  name="correctives"
                  component={this.renderCorrectiveActions}
                />
              </div>
            </div>

          </div>
        </div>

        {/*   <div className="sf-card">
          <div className="sf-card-head abb-1">
            <h2 className="sf-pg-heading">Corrective Actions</h2>
          </div>
          <div className="sf-card-body">
            <div className="row">
              <div className="col-md-12 col-sm-12">
                <fieldset className="sf-form form-group">
                  <Field
                    label="Describe what needs to be done"
                    name="description1"
                    type="text"
                    id="description1"
                    component={customTextarea} />
                </fieldset>
              </div>
              <div className="col-md-4 col-sm-12">
                <fieldset className="sf-form form-group">
                  <Field
                    name="responsible_person"
                    label="Who is Responsible?"
                    type="text"
                    component={customInput} />
                </fieldset>
              </div>
              <div className="col-md-3 col-sm-12">
                <fieldset className="sf-form form-group  lsico">
                  <Field
                    name="completion_date"
                    label="Date for Completion"
                    placeholder={moment(new Date()).format("MM-DD-YYYY")}
                    component={CustomDatepicker} />
                </fieldset>
              </div>
            </div>

          </div>
        </div> */}

        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Authorisation</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">
            <fieldset className="sf-form form-group">
              <Field
                name="autho_name"
                label="Authorisor Name"
                type="text"
                component={customInput} />
            </fieldset>
            <fieldset className="sf-form lsico form-group">
              <div class="view-text-value sf-form">
                <label>Authorisor Date : </label>
                <span>{moment().format("YYYY/MM/DD")}</span>
              </div>

              {/* <Field
                name="date"
                label="Authorisor Date"
                type="text"
                component={CustomDatepicker}
                disabled /> */}
            </fieldset>
            <div className="form-group sf-form">
              {
                !this.state.documentSigned
                  ? (
                    <SignCanvas
                      signDetail={{}}
                      onSave={this.onSaveSignature}>
                    </SignCanvas>
                  )
                  : <img alt="signature" src={this.state.fileUrl}></img>
              }
            </div>
            {touched && error && error.signatureFile ? <span className="error-input">{error.signatureFile}</span> : null}

          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  form: state.form.incidentReport,
  formValues: state.form.incidentReport && state.form.incidentReport.values,
  riskControls: state.sAIncidentManagement.riskControls/* [{ id: 1, name: "Call Ambulance" }, { id: 2, name: "Provide First aid" }] */,
  users: state.organizationUsers.users,
  error: state.form.incidentReport.syncErrors,
  touched: state.form.incidentReport.anyTouched,
  // initialValues: {
  //   date:moment().format('YYYY-MM-DD hh:mm:ss')
  // }
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CorrectiveActionsStep)
