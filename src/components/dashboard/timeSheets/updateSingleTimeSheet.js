import React from 'react';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, notification } from 'antd';
import { reduxForm } from 'redux-form';
import moment from 'moment';

import { Strings } from '../../../dataProvider/localize';
import * as action from '../../../actions/adminTimeSheetAction';
import { customInput } from '../../common/custom-input';
import { customTextarea } from '../../common/customTextarea';
import { CustomTimePicker } from '../../common/customTimePicker';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { handleFocus, DeepTrim } from '../../../utils/common';

class UpdateSingleTimeSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { position: '' };
  }

  onSubmitSingleStaffUpdate = (formData) => {
    // formData = await DeepTrim(formData);

    if (formData && formData.start_time) {
      formData.start_time = moment(formData.start_time, "HH:mm:ss").format('HH:mm:ss');
    }
    if (formData && formData.stop_time) {
      formData.stop_time = moment(formData.stop_time, "HH:mm:ss").format('HH:mm:ss');
    }
    /* if (formData && formData.break_time) {
      formData.break_time = moment(formData.break_time, "HH:mm:ss").format('HH:mm:ss');
    } */
    formData.searchKeys = { ...this.props.searchFormValues, timesheet_list: undefined }
    this.props.updateOwnTimeSheet(formData).then(message => {
      notification.success({
        message: Strings.success_title,
        description: message ? message : "staff Updated Successfully",
        onClick: () => { },
        className: 'ant-success'
      })
      // this.props.removeInlineTimeSheet(this.props.initialValues);
    }).catch(err => {
      notification.error({
        message: Strings.error_title,
        description: err ? err : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      })
    })
  }



  render() {
    const { handleSubmit, initialValues } = this.props;
    return (
      <>
        <form className="tr update-tsheet" onSubmit={handleSubmit(this.onSubmitSingleStaffUpdate)} key={initialValues.id}>
          {/* <div className="tr"> */}
          <span className="td">{initialValues.day_of_week}</span>
          <span className="td">{initialValues.date}</span>
          <span className="td">{initialValues.shift && initialValues.shift == "D" ? "DAY" : "NIGHT"}</span>
          <span className="td">{initialValues.sa_name}</span>
          <span className="td">{initialValues.acc_manager_name}</span>
          <span className="td">{initialValues.client_name}</span>
          <span className="td">{initialValues.site_name}</span>
          <span className="td">{initialValues.job_name}</span>
          <span className="td">{initialValues.job_status ? initialValues.job_status == 1 ? "Started" : initialValues.job_status == 2 ? "Paused" :
            "Completed" : "Not Started"}</span>
          <span className="td">{initialValues.is_editable ? <fieldset className="sf-form">
            <Field name="start_time" component={CustomTimePicker} /> </fieldset> : initialValues.start_time} </span>
          <span className="td">{initialValues.is_editable ? <fieldset className="sf-form">
            <Field name="stop_time" component={CustomTimePicker} /> </fieldset> : initialValues.stop_time} </span>
          <span className="td">{initialValues.is_editable ? <fieldset className="sf-form">
            <Field name="break_time" type="number" component={customInput} /> </fieldset> : initialValues.break_time} </span>
          <span className="td"> <strong>{initialValues.total_hours}</strong></span>
          {/* <span className="td">{initialValues.timesheet_status ? "Active" : "Inactive"}</span> */}
          <span className="td">
            {initialValues.is_editable ?
              <button className='bnt bnt-active' type='submit'>
                Save</button> : null}
          </span>
          {/* </div> */}
        </form>
      </>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    searchFormValues: state.form.showTimeSheet && state.form.showTimeSheet.values ? state.form.showTimeSheet.values : {}
  }
}


export default compose(
  connect(mapStateToProps, action),
  reduxForm({
    enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(UpdateSingleTimeSheet)