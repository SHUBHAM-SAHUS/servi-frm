import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field, isDirty } from 'redux-form';
import { compose, bindActionCreators } from 'redux';
import { Icon } from 'antd';
import { Strings } from '../../../dataProvider/localize'
import { CustomDatepicker } from '../../common/customDatepicker'
import { DeepTrim } from '../../../utils/common';

import * as scopeDocActions from '../../../actions/scopeDocActions';
import { handleFocus } from '../../../utils/common';

export class AmendQuoteTask extends Component {

  state = {

  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);

    const finalFormData = {};
    finalFormData.start_date = formData.start_date
    finalFormData.end_date = formData.end_date
    finalFormData.task_id = this.props.initialValues.id
    // this.props.scopeDocActions.updateTaskDetailsInAmendQuote(finalFormData)
    this.props.updateTaskDetailsInView(finalFormData)
    this.props.handleCancel()
    this.props.reset()
  }

  handleCancel = () => {
    this.props.reset()
    this.props.handleCancel()
  }

  render() {
    const { handleSubmit } = this.props

    return (
      <div className="sf-card">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h4 className="sf-sm-hd sf-pg-heading">{Strings.update_task_txt}</h4>
          <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
        </div>
        <div className="sf-card-body doc-update-task mt-2">
          <form onSubmit={handleSubmit(this.onSubmit)} >
            <fieldset className="form-group sf-form lsico">
              <Field
                label="Start Date"
                name="start_date"
                type="text"
                id="start_date"
                component={CustomDatepicker} />
            </fieldset>
            {/* <fieldset className="form-group sf-form lsico">
              <Field
                label="End Date"
                name="end_date"
                type="text"
                id="end_date"
                component={CustomDatepicker} />
            </fieldset> */}
            <div className="all-btn multibnt">
              <div className="btn-hs-icon d-flex justify-content-between">
                <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                  {Strings.cancel_btn}</button>
                <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                  {Strings.update_btn}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  isDirty: isDirty('AmendQuoteTask')(state),
})

const mapDispatchToProps = dispatch => {
  return {
    scopeDocActions: bindActionCreators(scopeDocActions, dispatch),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({ form: 'AmendQuoteTask',  enableReinitialize: true ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(AmendQuoteTask)