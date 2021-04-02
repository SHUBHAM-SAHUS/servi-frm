import React, { Component } from 'react'
import { notification } from 'antd';
import { customInput } from '../../../common/custom-input';
import { CustomDatepicker } from '../../../common/customDatepicker'
import { CustomSelect } from '../../../common/customSelect'
import { customTextarea } from '../../../common/customTextarea'
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Strings } from '../../../../dataProvider/localize';
import * as jobCalendarActions from '../../../../actions/jobCalendarActions';
import * as scopeDocAction from '../../../../actions/scopeDocActions';
import { isRequired } from '../../../../utils/Validations/scopeDocValidation';
import { assignManagerAccountValidate } from '../../../../utils/Validations/assignAccountManagerValidation'
import moment from 'moment'
import { withRouter } from 'react-router-dom'
import { handleFocus, DeepTrim } from '../../../../utils/common';

export class AssignForm extends Component {

  state = {
    visible: true,
    task: this.props.task
  }

  handleCancel = () => {
    this.props.reset()
  }

  componentDidMount() {
    console.log(this.props.task)
  }

  static getDerivedStateFromProps(props, state) {
    console.log('selectedScopeDoc', props.selectedScopeDoc)
  }

  onSubmit = async (formData) => {
    console.log('Fd', formData)
    formData = await DeepTrim(formData);

    this.setState({ visible: false })
    var structuredFormData = {};
    structuredFormData.task_id = formData.task_id;
    structuredFormData.task_details = {
      "start_date": moment(formData.start_date).format('YYYY-MM-DD'),
      "end_date": moment(formData.end_date).format('YYYY-MM-DD'),
      "user_name": formData.account_manager.toString(),
      "cost": this.props.initialValues.task_amount !== undefined ? parseInt(formData.task_amount) : 0,
      "outsourced_budget": parseInt(formData.outsourced_budget),
      "comment": formData.comment,
    }
    structuredFormData.task_id = this.props.task.id;
    let quoteIdArray = this.props.selectedScopeDoc.quotes.map(item => item.id);
    structuredFormData["quote_ids"] = JSON.stringify(quoteIdArray);

    this.props.jobCalendarActions.assignAccountManager(structuredFormData)
      .then((message) => {
        this.props.reset();
        this.handleCancel();
        this.props.scopeDocAction.getScopeDocDetails(this.props.selectedScopeDoc.id, this.props.task.id)
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: Strings.allocate_manager_success,
            onClick: () => { },
            className: 'ant-success'
          });
        }
        // this.props.onFormSubmit();
        this.props.jobCalendarActions.getJobsList(this.props.history.location.qid)
      })
      .then(() => {
        this.setState({
          events: this.props.events
        })
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
    this.props.reset()
  }

  render() {
    const { task } = this.props
    console.log(this.props.initialValues)
    return (
      <form /*className="calendar-popover"*/ onSubmit={this.props.handleSubmit(this.onSubmit)}>
        <div className="sf-card">
          <div className="sf-card-head abb-1">
            <h2 className="sf-pg-heading">{task.title}</h2>
          </div>
          <div className="sf-card-body clnd-notes-dtl">
            <h5 className="popup-info-txt">{task.description}</h5>
            <div className="row">
              <div className="col-md-6">
                <fieldset className="sf-form jc-calndr form-group">
                  <Field
                    name="start_date"
                    label="Start Date"
                    type="date"
                    component={CustomDatepicker}
                  />
                </fieldset>
              </div>
              <div className="col-md-6">
                <fieldset className="sf-form jc-calndr form-group">
                  <Field
                    name="end_date"
                    label="End Date"
                    type="date"
                    component={CustomDatepicker}
                  />
                </fieldset>
              </div>
              {/* <div className="col-md-12">
                <fieldset className="form-group sf-form">
                  <Field
                    label="Account Manager"
                    name="account_manager"
                    //placeholder="Allocate Account Manager"
                    placeholder={Strings.account_manager}
                    options={this.props.accountManagers.map(acMgr => ({
                      title: acMgr.first_name,
                      value: acMgr.user_name
                    }))}
                    type="text"
                    component={CustomSelect}
                  />
                </fieldset>
              </div> */}
              <div className="col-md-6">
                {
                  this.props.initialValues
                    && (("task_amount" in this.props.initialValues) && this.props.initialValues.task_amount !== null)
                    ? <div className="view-text-value form-group sf-form">
                      <label>Cost</label>
                      {
                        this.props.initialValues.task_amount !== undefined
                          ? <span>{`$${this.props.initialValues.task_amount}`}</span>
                          : <span>${0}</span>
                      }
                    </div>
                    : <div className="view-text-value form-group sf-form">
                      <label>Cost</label>
                      <span>${0}</span>
                    </div>
                }
              </div>
              <div className="col-md-6">
                <fieldset className="form-group sf-form w-currency-symbl">
                  <Field
                    name="outsourced_budget"
                    label="Outsourced Budget"
                    placeholder={Strings.outsourced_budget}
                    type="text"
                    component={customInput} />
                </fieldset>
              </div>
              <div className="col-md-12">
                <fieldset className="form-group sf-form">
                  <Field
                    name="comment"
                    label="Comment"
                    type="text"
                    placeholder={Strings.comment}
                    component={customTextarea} />
                </fieldset>
              </div>
            </div>
            <div className="all-btn d-flex justify-content-end mb-2 sc-doc-bnt">
              <div className="btn-hs-icon">
                <button type="button" onClick={() => this.props.handleCancel()} className="bnt bnt-normal">
                  {Strings.cancel_btn}
                </button>
              </div>
              <div className="btn-hs-icon">
                <button type="submit" className="bnt bnt-active">
                  {Strings.add_txt}
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    )
  }
}

const mapStateToProps = (state, ownProps) => {
  const values = ownProps.task && ownProps.task.hasOwnProperty("user_name")
    ? { ...ownProps.task, account_manager: ownProps.task.user_name, outsourced_budget: ownProps.task.outsourced_budget, comment: ownProps.task.comment }
    : {}
  console.log(values)
  return {
    accountManagers: state.jobsManagement.accountManagersList,
    // initialValues: values,
  }
}

const mapDispatchToProps = dispatch => ({
  jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
  scopeDocAction: bindActionCreators(scopeDocAction, dispatch),
})

// export default compose(
//   withRouter,
//   connect(mapStateToProps, mapDispatchToProps),
//   reduxForm({
//     form: 'assignForm', validate: assignManagerAccountValidate, enableReinitialize: true,
//     onSubmitFail: (errors, dispatch, sub, props) => {
//       handleFocus(errors, "#");
//     }
//   })
// )(AssignForm)

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    destroyOnUnmount: true,
    validate: assignManagerAccountValidate,
    enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AssignForm)
