import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, FieldArray, FormSection } from 'redux-form';
import { Strings } from '../../../../../dataProvider/localize'
import { Upload, TimePicker, Dropdown } from 'antd';
import { CustomDatepicker } from '../../../../common/customDatepicker';
import { customInput } from '../../../../common/custom-input';
import { CustomSelect } from '../../../../common/customSelect';
import { SignCanvas } from '../../../../common/SignCanvas';

export class CorrectiveActionsStep extends Component {

  state = {
    documentSigned: false,
    fileUrl: '',
    fieldCount: 1
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

  handleAddFields = (fields) => {
    fields.push({});
    this.setState({ fieldCount: this.state.fieldCount + 1 })
  }

  handleRemoveFields = (fields, index) => {
    if (this.state.fieldCount > 1) {
      fields.remove(index);
      this.setState({ fieldCount: this.state.fieldCount - 1 })
    }
  }

  renderCorrectiveActions = ({ fields }) => {
    if (fields.length === 0) {
      fields.push({})
    }

    return (
      <>
        {
          fields.map((action, index) =>
            (
              <div className="tr">
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${action}.risk_control`}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${action}.required_action`}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${action}.by_whom`}
                      label="By Whom"
                      placeholder="Select"
                      options={this.props.usersList.map(user => ({
                        title: user.name + " " + (user.last_name ? user.last_name : ""),
                        value: user.user_name
                      }))}
                      component={CustomSelect} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form lsico no-label">
                    <Field
                      name={`${action}.completion_date`}
                      component={CustomDatepicker} />
                  </fieldset>
                </span>
                <span className="td">
                  <div className="act-bnt">
                    <button
                      type="button"
                      className="delete-bnt delete-bnt"
                      userid="176"
                      onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button>
                  </div>
                </span>
              </div>
            )
          )
        }
        <button
          className="normal-bnt add-line-bnt mt-3"
          type="button"
          onClick={() => fields.push({})}><i class="material-icons">add</i>Add More Corrective Actions</button>
      </>
    )
  }

  render() {

    return (
      <>
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
          <div className="sf-card-body">
            <div className="job-cleaning-report">
              <div className="sf-c-table org-user-table">
                <div className="tr">
                  <span className="th">Risk Control (Highest to Lowest)</span>
                  <span className="th">Required Action </span>
                  <span className="th">By Whom</span>
                  <span className="th">Date to be completed</span>
                  <span className="th"></span>
                </div>
                <FieldArray
                  name="corrective_actions"
                  component={this.renderCorrectiveActions}
                />
              </div>
            </div>
          </div>
        </div>


        {/* Authorisation of Corrective Action */}
        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Authorisation of Corrective Action</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">
            <div className="row">
              <div className="col-md-4">
                <fieldset className="sf-form form-group">
                  <Field
                    name="authorisation_name"
                    label={Strings.name_txt}
                    type="text"
                    component={customInput} />
                </fieldset>
              </div>
              <div className="col-md-4">
                <fieldset className="sf-form form-group">
                  <Field
                    name="authorisation_position"
                    label={Strings.position_txt}
                    type="text"
                    component={customInput} />
                </fieldset>
              </div>
              <div className="col-md-4">
                <fieldset className="sf-form form-group">
                  <Field
                    name="authorisation_contact"
                    label={Strings.contact_number}
                    type="text"
                    component={customInput} />
                </fieldset>
              </div>
            </div>
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
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  formValues: state.form.hazardReport && state.form.hazardReport.values,
  usersList: state.organizationUsers.users
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(CorrectiveActionsStep)
