import React, { Component } from 'react';
import { Icon, Modal, Menu, notification } from 'antd';
import { connect } from 'react-redux';
import { reduxForm, Field, isDirty } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import * as SAIncidentReportActions from '../../../../../actions/SAIncidentReportActions';
import { Strings } from '../../../../../dataProvider/localize';
import { CustomDatepicker } from '../../../../common/customDatepicker';
import { CustomSelect } from '../../../../common/customSelect';
import moment from 'moment'
import { customTextarea } from '../../../../common/customTextarea';
import { CustomSwitch } from '../../../../common/customSwitch';
import { assignValidate } from '../../../../../utils/Validations/IncidentReportValidation'
import { ADMIN_DETAILS, USER_NAME } from '../../../../../dataProvider/constant'
import { getStorage } from '../../../../../utils/common';
import { DeepTrim } from '../../../../../utils/common';

export class EditCorrectiveActions extends Component {

    onSubmit =async  formData => {
        formData = await DeepTrim(formData);

        formData.due_date = formData.due_date.toString();
        formData.status = +formData.status;
        formData.incident_report_id = this.props.incidentReportDetails.incident_report_detail[0].incident_report_id;
        formData.incident_corrective_id = this.props.incident_corrective_id;
        formData.reporting_employee_email = JSON.parse(getStorage(ADMIN_DETAILS)).email_address;
        this.props.reportActions.AssignCorrectiveAction(formData)
            .then((flag) => {
                const orgId = JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id;
                // this.props.reset();
                this.props.reportActions.getAllIncidents(orgId)
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
        const { handleSubmit, users, cancelEdit, initialValues } = this.props
        return <div className="col-lg-4 col-md-12">
            <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h4 className="sf-sm-hd sf-pg-heading">Actions</h4>
                    <button class="closed-btn" onClick={cancelEdit}>
                        <Icon type="close" /></button>
                </div>
                <div className="sf-card-body mt-2">
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        {initialValues.status
                            ? <div class="data-v-col">
                                <div class="view-text-value">
                                    <label>{Strings.assigned_to}</label>
                                    <span>{users && users.find(user => user.user_name == initialValues.assigned_to) &&
                                        users.find(user => user.user_name == initialValues.assigned_to).name}</span>
                                </div>
                            </div> : JSON.parse(getStorage(ADMIN_DETAILS)).role.slug == "ACCOUNT_MANAGER" ?
                                <fieldset className="sf-form form-group">
                                    <Field
                                        name="assigned_to"
                                        label={Strings.assigned_to}
                                        placeholder="Select"
                                        options={users.map(user => ({
                                            title:  user.name + " " + (user.last_name ? user.last_name : ' '),
                                            value: user.user_name
                                        }))}
                                        component={CustomSelect} />
                                </fieldset> : <div class="data-v-col">
                                    <div class="view-text-value">
                                        <label>{Strings.assigned_to}</label>
                                        <span>{users && users.find(user => user.user_name == initialValues.assigned_to) &&
                                            users.find(user => user.user_name == initialValues.assigned_to).name}</span>
                                    </div>
                                </div>
                        }

                        {/* <fieldset className="sf-form form-group">
                            <Field
                                name="reporting_employeee"
                                label={Strings.priority}
                                placeholder="Select"
                                options={users.map(user => ({
                                    title: user.name,
                                    value: user.id
                                }))}
                                component={CustomSelect} />
                        </fieldset> */}
                        {initialValues.status
                            ? <div class="data-v-col">
                                <div class="view-text-value">
                                    <label>{Strings.due_on}</label>
                                    <span>{initialValues.due_date}</span>
                                </div>
                            </div> : JSON.parse(getStorage(ADMIN_DETAILS)).role.slug == "ACCOUNT_MANAGER" ?
                                <fieldset className="sf-form form-group lsico">
                                    <Field
                                        label={Strings.due_on}
                                        name="due_date"
                                        component={CustomDatepicker} />
                                </fieldset> :
                                <div class="data-v-col">
                                    <div class="view-text-value">
                                        <label>{Strings.due_on}</label>
                                        <span>{initialValues.due_date ? moment(initialValues.due_date).format('MM-DD-YYYY') : null}</span>
                                    </div>
                                </div>
                        }

                        {initialValues.status ? <div class="data-v-col">
                            <div class="view-text-value">
                                <label>Comment</label>
                                <span>{initialValues.comment}</span>
                            </div>
                        </div> : <fieldset className="sf-form form-group lsico">
                                <Field
                                    label={"Comment"}
                                    name="comment"
                                    component={customTextarea} />
                            </fieldset>}

                        {initialValues.status ? <div class="data-v-col">
                            <div class="view-text-value">
                                <label>Completed</label>
                                <span>{!!initialValues.status}</span>
                            </div>
                        </div> : <fieldset className="sf-form form-group lsico">
                                <Field
                                    label={"Completed"}
                                    name="status"
                                    component={CustomSwitch} />
                            </fieldset>}
                        {initialValues.status ? null :
                            <div className="all-btn multibnt mt-4">
                                <div className="btn-hs-icon d-flex justify-content-between">
                                    <button className="bnt bnt-normal" type="button" onClick={cancelEdit}>
                                        {Strings.cancel_btn}</button>
                                    <button type="submit" className="bnt bnt-active">
                                        {Strings.save_btn}</button>
                                </div>
                            </div>}
                    </form>
                </div>
            </div>
        </div>
    }
}

const mapStateToProps = (state) => ({
    users: state.organizationUsers.users,
    incidentReportDetails: state.sAIncidentManagement.incidentReportDetails,
})

const mapDispatchToProps = dispatch => {
    return {
        reportActions: bindActionCreators(SAIncidentReportActions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({ enableReinitialize: true, validate: assignValidate })
)(EditCorrectiveActions)
