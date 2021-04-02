import React from 'react';
import { Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, notification } from 'antd';
import { reduxForm } from 'redux-form';
import moment from 'moment';

import { Strings } from '../../../../dataProvider/localize';
import * as action from '../../../../actions/timeSheetAction';
import { customInput } from '../../../common/custom-input';
import { customTextarea } from '../../../common/customTextarea';
import { CustomTimePicker } from '../../../common/customTimePicker';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';
import { handleFocus, DeepTrim } from '../../../../utils/common';

class UpdateSingleTimeSheet extends React.Component {
  constructor(props) {
    super(props);
    this.state = { position: '' };
  }

  onSubmitSingleStaffUpdate = async (formData) => {
    formData = await DeepTrim(formData);

    if (formData && formData.start_time) {
      formData.start_time = moment(formData.start_time, "HH:mm:ss").format('HH:mm:ss');
    }
    if (formData && formData.stop_time) {
      formData.stop_time = moment(formData.stop_time, "HH:mm:ss").format('HH:mm:ss');
    }
    this.props.updateSingleStaff(formData).then(message => {
      notification.success({
        message: Strings.success_title,
        description: message ? message : "staff Updated Successfully",
        onClick: () => { },
        className: 'ant-success'
      })
      this.props.removeInlineTimeSheet(this.props.initialValues);
    }).catch(err => {
      notification.error({
        message: Strings.error_title,
        description: err ? err : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      })
    })
  }

  handleStaffSelection = (value) => {
    var userObj;
    if (this.props.timeSheetList && this.props.timeSheetList.staff_list && this.props.timeSheetList.staff_list.length > 0) {
      userObj = this.props.timeSheetList.staff_list.find(user => user.user_name.toString() === value.toString());
    }
    if (userObj && userObj.role_name) {
      this.setState({ position: userObj.role_name });
    } else {
      this.setState({ position: '' });
    }
  }

  render() {
    const { handleSubmit, initialValues, timeSheetList } = this.props;
    return (
      <>
        <form className="tr update-tsheet" onSubmit={handleSubmit(this.onSubmitSingleStaffUpdate)} key={initialValues.id}>
          <span className="td"><fieldset className="sf-form">
            <Field
              name="user_name"
              placeholder={Strings.allocate_supervisor}
              type="text"
              dataSource={timeSheetList && timeSheetList.staff_list && timeSheetList.staff_list.length > 0 ? timeSheetList.staff_list.map(user => ({ text: user.first_name, value: user.user_name })) : []}
              component={CustomAutoCompleteSearch}
              onSelect={(value) => this.handleStaffSelection(value)}
            />
          </fieldset></span>
          <span className="td">{this.state.position ? this.state.position : initialValues.position}</span>
          <span className="td"><fieldset className="sf-form">
            <Field name="start_time" component={CustomTimePicker} /> </fieldset> </span>
          <span className="td"><fieldset className="sf-form">
            <Field name="stop_time" component={CustomTimePicker} /> </fieldset> </span>
          <span className="td"><fieldset className="sf-form">
            <Field name="break_time" type="text" component={customInput} /> </fieldset> </span>
          <span className="td"><fieldset className="sf-form sm-txtarea-size">
            <Field name="comment" type="text" component={customTextarea} /> </fieldset></span>

          <span className="td"><button className='delete-bnt' type='submit' >
            <i class="material-icons">save</i>
          </button>
            <button className='delete-bnt' type='button' onClick={() => this.props.removeInlineTimeSheet(this.props.initialValues)} >
              <i class="material-icons">close</i>
            </button>
          </span>
        </form>
      </>

    )
  }
}

const mapStateToProps = (state) => {
  return {
    timeSheetList: state.timeSheet.timeSheetList
  }
}


export default compose(
  connect(mapStateToProps, action),
  reduxForm({ form: 'updateSingleTimesheet', enableReinitialize: true ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(UpdateSingleTimeSheet)