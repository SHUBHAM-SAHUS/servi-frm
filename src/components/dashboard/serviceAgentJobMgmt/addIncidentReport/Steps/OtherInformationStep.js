import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, FieldArray } from 'redux-form';
import { Strings } from '../../../../../dataProvider/localize'
import { Upload, Radio, message, Dropdown } from 'antd';
import { customInput } from '../../../../common/custom-input'
import { customTextarea } from '../../../../common/customTextarea'


const { Dragger } = Upload;

export class OtherInformationStep extends Component {

  state = {
    values: [-1, -1, -1],
    fileList: []
  }

  componentDidMount() {
    if (this.props.formValues && this.props.formValues.incidentFiles && this.props.formValues.incidentFiles.length > 0) {
      this.setState({ fileList: [...this.props.formValues.incidentFiles] })
    }
  }

  handleContractor = (event) => {
    const values = [...this.state.values]
    values[0] = event.target.value;
    this.setState({ values: values })
    this.props.change("is_contractor_incident", values[0])
  }

  handleRegulatory = (event) => {
    const values = [...this.state.values]
    values[1] = event.target.value;
    this.setState({ values: values })
    this.props.change("regulatory_notifiable_incident", values[1])
  }

  handleNotices = (event) => {
    const values = [...this.state.values]
    values[2] = event.target.value;
    this.setState({ values: values })
    this.props.change("any_issued", values[2])
  }

  handlePreUpload = (file) => {
    return false;
  }

  handleFileChange = info => {
    this.setState({ fileList: info.fileList })
    this.props.change('incidentFiles', info.fileList)
  }

  handleFileRemove = file => {
    file.status = 'removed';
    this.setState(prevState => {
      const fileIndex = prevState.fileList.indexOf(file);
      const newFileList = prevState.fileList.slice();
      newFileList.splice(fileIndex, 1);
      if (newFileList.length > 0) {
        this.props.change('incidentFiles', newFileList)
        return {
          fileList: newFileList,
        };
      } else {
        delete this.props.formValues.incidentFiles;
        return {
          fileList: []
        }
      }
    });
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
                      name={`${person}.type_of_person`}
                      placeholder={Strings.type_of_person_incd_rep}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${person}.other_detail`}
                      placeholder={Strings.other_details_incd_rep}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <div className="act-bnt">
                    <button class="delete-bnt delete-bnt" userid="176" onClick={() =>
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

  renderWitnesses = ({ fields }) => {

    return (
      <>
        {
          fields.map((witness, index) =>
            (
              <div className="tr">
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${witness}.name`}
                      placeholder={Strings.name_incd_rep}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${witness}.type_of_person`}
                      placeholder={Strings.type_of_person_incd_rep}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <fieldset className="sf-form no-label">
                    <Field
                      name={`${witness}.other_detail`}
                      placeholder={Strings.other_details_incd_rep}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </span>
                <span className="td">
                  <div className="act-bnt">
                    <button class="delete-bnt delete-bnt" userid="176" onClick={() =>
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

  handleNotified = (event) => {
    const values = [...this.state.values]
    values[3] = event.target.value;
    this.setState({ values: values })
    this.props.change("state_safely_regulator", values[3])
  }

  handlePolice = (event) => {
    const values = [...this.state.values]
    values[4] = event.target.value;
    this.setState({ values: values })
    this.props.change("police_involved", values[4])
  }

  handleWorker = (event) => {
    const values = [...this.state.values]
    values[5] = event.target.value;
    this.setState({ values: values })
    this.props.change("worker_compensation_related", values[5])
  }

  render() {
    console.log(this.props.formValues)
    console.log('touched', this.props.touched)
    const fileProps = {
      accept: ".jpeg,.jpg,.png",
      multiple: true,
      listType: "picture-card",
      fileList: this.props.formValues && this.props.formValues.incidentFiles && this.props.formValues.incidentFiles.length && this.props.formValues.incidentFiles.length > 0 ? this.props.formValues.incidentFiles : this.state.fileList,
      beforeUpload: this.handlePreUpload,
      onChange: this.handleFileChange,
      onRemove: this.handleFileRemove
    };

    return (
      <>

        <div className="sf-card">

          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Other Information</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>

          <div className="sf-card-body">
            <div className="row">
              <div className="col-md-4">
                <div className="sf-form form-group group-radio-bnt">
                  <label>Is this a Contractor Incident?</label><br />
                  <Radio.Group onChange={(event) => this.handleContractor(event)} value={this.props.formValues && this.props.formValues.is_contractor_incident ? this.props.formValues.is_contractor_incident : this.state.values[0]}>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                  {
                    this.props.formValues && (this.props.formValues.is_contractor_incident == 0 || this.props.formValues.is_contractor_incident == 1)
                      ? null
                      : this.props.touched && <span className="error-input">Please select an option</span>
                  }
                </div>
              </div>
              <div className="col-md-4">
                <div className="sf-form form-group group-radio-bnt">
                  <label>Is this a Regulatory Notifiable Incident?</label><br />
                  <Radio.Group onChange={(event) => this.handleRegulatory(event)} value={this.props.formValues && this.props.formValues.regulatory_notifiable_incident ? this.props.formValues.regulatory_notifiable_incident : this.state.values[1]}>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                  {
                    this.props.formValues && (this.props.formValues.regulatory_notifiable_incident == 0 || this.props.formValues.regulatory_notifiable_incident == 1)
                      ? null
                      : this.props.touched && <span className="error-input">Please select an option</span>
                  }
                </div>
              </div>
              <div className="col-md-4">
                <div className="sf-form form-group group-radio-bnt">
                  <label>Have any Notices Been Issued?</label><br />
                  <Radio.Group onChange={(event) => this.handleNotices(event)} value={this.props.formValues && this.props.formValues.any_issued ? this.props.formValues.any_issued : this.state.values[2]}>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                  {
                    this.props.formValues && (this.props.formValues.any_issued == 0 || this.props.formValues.any_issued == 1)
                      ? null
                      : this.props.touched && <span className="error-input">Please select an option</span>
                  }
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-4">
                <div className="sf-form form-group group-radio-bnt">
                  <label>Was the State Safety Regulator notified? </label><br />
                  <Radio.Group onChange={(event) => this.handleNotified(event)}
                    value={this.props.formValues && this.props.formValues.state_safely_regulator ?
                      this.props.formValues.state_safely_regulator : this.state.values[3]}>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                  {
                    this.props.formValues && (this.props.formValues.state_safely_regulator == 0 || this.props.formValues.state_safely_regulator == 1)
                      ? null
                      : this.props.touched && <span className="error-input">Please select an option</span>
                  }
                </div>
              </div>
              <div className="col-md-4">
                <div className="sf-form form-group group-radio-bnt">
                  <label>Were police involved?</label><br />
                  <Radio.Group onChange={(event) => this.handlePolice(event)}
                    value={this.props.formValues && this.props.formValues.police_involved ?
                      this.props.formValues.police_involved : this.state.values[4]}>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                  {
                    this.props.formValues && (this.props.formValues.police_involved == 0 || this.props.formValues.police_involved == 1)
                      ? null
                      : this.props.touched && <span className="error-input">Please select an option</span>
                  }
                </div>
              </div>
              <div className="col-md-4">
                <div className="sf-form form-group group-radio-bnt">
                  <label>Is this a workers compensation related incident?</label><br />
                  <Radio.Group onChange={(event) => this.handleWorker(event)}
                    value={this.props.formValues && this.props.formValues.worker_compensation_related ?
                      this.props.formValues.worker_compensation_related :
                      this.state.values[5]}>
                    <Radio value={1}>Yes</Radio>
                    <Radio value={0}>No</Radio>
                  </Radio.Group>
                  {
                    this.props.formValues && (this.props.formValues.worker_compensation_related == 0 || this.props.formValues.worker_compensation_related == 1)
                      ? null
                      : this.props.touched && <span className="error-input">Please select an option</span>
                  }
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-md-12 col-sm-12">
                <fieldset className="sf-form">
                  <Field
                    label="What was done following the incident?"
                    name="whats_was_done"
                    placeholder={Strings.what_was_done_following_the_incident}
                    type="text"
                    component={customTextarea} />
                </fieldset>
              </div>
            </div>

          </div>
        </div>

        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Upload File</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">
            <div className="row">
              <div className="col-md-12">
                <div className="upload-sfv-file add-equipment-img upeqip-pic sm-drbx">
                  <Dragger {...fileProps}>
                    <p className="ant-upload-drag-icon">
                      <i class="material-icons">cloud_upload</i>
                    </p>
                    <p className="ant-upload-text">Choose file to upload</p>
                    <p className="ant-upload-hint">
                      {Strings.img_upload_text}
                    </p>
                  </Dragger>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Persons Involved</h2>
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
                  <span className="th">Type of Person</span>
                  <span className="th">Other Details</span>
                  <span className="th"></span>
                </div>
                <FieldArray
                  name="persons"
                  component={this.renderPersonsInvolved}
                />
              </div>
            </div>

          </div>
        </div>

        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Witnesses</h2>
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
                  <span className="th">Type of Person</span>
                  <span className="th">Other Details</span>
                  <span className="th"></span>
                </div>
                <FieldArray
                  name="witnesses"
                  component={this.renderWitnesses}
                />
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
  touched: state.form.incidentReport.anyTouched
})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(OtherInformationStep)
