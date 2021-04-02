import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field } from 'redux-form';
import { bindActionCreators, compose } from 'redux';

import { Strings } from '../../../../dataProvider/localize';
import { customInput } from '../../../common/custom-input';
import { Upload, notification } from 'antd';
import { customTextarea } from '../../../common/customTextarea';
import { isRequired } from '../../../../utils/Validations/scopeDocValidation';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import { getStorage } from '../../../../utils/common';
import * as sAJobMgmtAction from '../../../../actions/SAJobMgmtAction';

class AddNotes extends Component {

  state = {
    notes: []
  }

  handleNoteChange = (evt, index) => {
    const notes = [...this.state.notes];
    notes[index] = evt.target.value
    this.setState({ notes })
  }

  handleFormSubmit = () => {
    let noteFormData = {};
    let noteArray = [];
    this.state.notes.forEach(item => {
      let noteObj = {
        note: item,
        job_id: this.props.jobId,
        job_number: this.props.job_number,
        user_name: JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : ''
      }
      noteArray.push(noteObj)
    });

    noteFormData.job_notes = noteArray;

    this.props.sAJobMgmtAction.addJobNotes(noteFormData, this.props.job_number)
      .then((flag) => {
        this.props.reset();
        notification.success({
          message: Strings.success_title,
          description: flag,
          onClick: () => { },
          className: 'ant-success'
        });
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

  handleDeleteFields = (fields) => {
    fields.pop();
    if (this.props.isFromJobDetails) {
      const notes = [...this.state.notes]
      const notesCopy = notes.slice();
      notesCopy.pop()
      this.setState({ notes: [...notesCopy] })
    }
  }

  render() {
    var { fields, meta: { touched, error, warning, submitFailed }, isFromJobDetails } = this.props;
    if (fields.length === 0 && !this.props.isFromEdit) {
      fields.push({});
    }
    return (
      <>
        {
          fields.map((note, index) => {
            return (
              <>
                <div className="add-notes-row">
                  <fieldset className="form-group sf-form">
                    <Field
                      name={`${note}.note`}
                      id="notesssssssss"
                      placeholder={Strings.note_internal}
                      type="text"
                      onChange={(event) => this.handleNoteChange(event, index)}
                      component={customTextarea}
                      validate={this.props.isFromEdit ? isRequired : []}
                    />
                    {isFromJobDetails && fields.get(index) && fields.get(index).note === undefined ? <span className="error-input">This field is required.</span> : null}
                  </fieldset>
                  {/* <button className="normal-bnt" type="button" onClick={() => fields.pop()}><i class="fa fa-trash-o"></i></button> */}
                  {/* <button className="normal-bnt" type="button" onClick={() => this.handleDeleteFields(fields)}><i class="fa fa-trash-o"></i></button> */}
                </div>
              </>
            )
          })
        }
        {
          isFromJobDetails
            ? <div className="all-btn d-flex justify-content-end mt-3 sc-doc-bnt">
              {/* <div className="btn-hs-icon sm-bnt">
                <button className="bnt bnt-normal" type="button" disabled={fields.get(fields.length - 1) && fields.get(fields.length - 1).note === undefined} onClick={() => fields.push({})}>{Strings.add_notes_txt}</button>
              </div> */}
              <div className="btn-hs-icon sm-bnt">
                <button className="bnt bnt-normal"
                  type="button"
                  disabled={fields.get(fields.length - 1) && fields.get(fields.length - 1).note === undefined}
                  onClick={this.handleFormSubmit}>
                  {/* disabled={!this.props.isDirty}> */}
                  {Strings.verify_account_btn_submit}
                </button>
              </div>
            </div>
            : <div className="btn-hs-icon sm-bnt">
              {/* <button className="bnt bnt-normal" type="button" disabled={fields.get(fields.length - 1) && fields.get(fields.length - 1).note === undefined} onClick={() => fields.push({})}>{Strings.add_notes_txt}</button> */}
            </div>
        }
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  formValues: state.form.addServiceAgent,
})

const mapDispatchToprops = dispatch => ({
  sAJobMgmtAction: bindActionCreators(sAJobMgmtAction, dispatch),
})

export default connect(mapStateToProps, mapDispatchToprops)(AddNotes)
