import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, isDirty } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import { Strings } from '../../../dataProvider/localize';
import { notification } from 'antd';
import { customTextarea } from '../../common/customTextarea';
import * as sAJobMgmtAction from '../../../actions/SAJobMgmtAction';
import { DeepTrim } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { getStorage } from '../../../utils/common';

class AddJobNotes extends Component {

  constructor(props) {
    super(props);
    this.state = {
      disableAddNewNotes: true
    }
  }

  onNoteChanged = (event) => {
    var { formValues } = this.props;

    if (event.target.value !== '') {
      this.setState({
        disableAddNewNotes: false
      })
    } else if (event.target.value === '' || (formValues && formValues.job_notes && formValues.job_notes[formValues.job_notes.length - 1] === '{}')) {
      this.setState({
        disableAddNewNotes: true
      })
    }
  }

  onAddNewNote = () => {
    var { fields } = this.props;
    fields.push({});

    this.setState({
      disableAddNewNotes: true
    })

  }

  onNoteSubmit = async (formData) => {
    formData = await DeepTrim(formData);
    let noteFormData = {};
    let noteArray = [];
    formData.job_notes.forEach(item => {
      let noteObj = {
        note: item.note,
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
      }).catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });

  }

  render() {
    var { fields } = this.props;
    if (fields.length === 0) {
      fields.push({});
    }

    return (
      <form onSubmit={this.props.handleSubmit(this.onNoteSubmit)}>
        {
          fields.map((note, index) => {

            return (
              <>
                <div className="add-notes-row">
                  <fieldset className="form-group sf-form">
                    <Field
                      name={`${note}.note`}
                      type="text"
                      component={customTextarea}
                      onChange={this.onNoteChanged}
                    />
                  </fieldset>
                  <button className="normal-bnt" type="button" onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button>
                </div>
              </>
            )
          })
        }
        <div className="all-btn d-flex justify-content-end mt-3 sc-doc-bnt">
          <div className="btn-hs-icon sm-bnt">
            <button className="bnt bnt-normal"
              type="button"
              disabled={this.state.disableAddNewNotes}
              onClick={() => this.onAddNewNote()}>
              {Strings.add_notes_txt}
            </button>
          </div>
          <div className="btn-hs-icon sm-bnt">
            <button className="bnt bnt-normal"
              type="submit"
              disabled={!this.props.isDirty}>
              {Strings.verify_account_btn_submit}
            </button>
          </div>
        </div>
      </form>
    )
  }


}

const mapStateToProps = (state) => ({
  formValues: state.form && state.form.addJobNotes &&
    state.form.addJobNotes.values ? state.form.addJobNotes.values : {},
  isDirty: isDirty('addJobNotes')(state),
})

const mapDispatchToprops = dispatch => {
  return {
    sAJobMgmtAction: bindActionCreators(sAJobMgmtAction, dispatch),

  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'addJobNotes',
  })
)(AddJobNotes)


