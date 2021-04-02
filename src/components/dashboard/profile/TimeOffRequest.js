import React from 'react';
import { Icon, Dropdown, Menu, Upload, Pagination, Modal, TimePicker, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { timeOffRequestValidator } from '../../../utils/Validations/timeOffRequestValidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import * as actions from '../../../actions/profileManagementActions';
import * as jobDocAction from '../../../actions/jobDocAction';
import { Strings } from '../../../dataProvider/localize';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomCheckbox } from '../../common/customCheckbox';
import { customTextarea } from '../../common/customTextarea';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../utils/common';
import * as userAction from '../../../actions/organizationUserAction';

import moment from 'moment';
import { CustomTimePicker } from '../../common/customTimePicker';
import { isRequired } from '../../../utils/Validations/scopeDocValidation';
import { DeepTrim } from '../../../utils/common';


class TimeOffRequest extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            allDayCheck: false,
            halfDayCheck: false,
            dropdowns: {
                notify_manager: {},
            }
        }

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }

    componentDidUpdate(prevProps, prevState) {

    }

    componentDidMount() {
        this.props.userActions.getLeaveType();
        // this.props.jobDocAction.getServiceAgentAllStaff(this.currentOrganization);
        // this.props.action.getRoles(this.currentOrganization);
        this.props.action.getOrganizationUsers(this.org_user_id);
    }

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);
        formData.start_date = moment(formData.start_date).toString()
        formData.end_date = moment(formData.end_date).toString()
        //formData.start_time = moment(formData.start_time)._d
        //formData.end_time = moment(formData.end_time)._d
        formData.all_day = this.state.allDayCheck ? 1 : (this.state.halfDayCheck ? 2 : 0)
        formData = { ...formData, 'org_id': this.org_user_id, 'user_name': this.org_user_name }

        this.props.userActions.addTimeOffRequest(formData)
            .then(flag => {
                this.handleCancel()
                notification.success({
                    message: Strings.success_title,
                    description: flag,
                    onClick: () => { },
                    className: 'ant-success'
                });
                this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name);
            }).catch((error) => {
                if (error.status === VALIDATE_STATUS) {
                    notification.warning({
                        message: Strings.validate_title,
                        description: error && error.data && typeof error.data.message == 'string'
                            ? error.data.message : Strings.generic_validate,
                        onClick: () => { },
                        className: 'ant-warning'
                    });
                } else {
                    notification.error({
                        message: Strings.error_title,
                        description: error && error.data && error.data.message && typeof error.data.message == 'string'
                            ? error.data.message : Strings.generic_error,
                        onClick: () => { },
                        className: 'ant-error'
                    });
                }
            });
    }

    onStartTimeChange = (time, timeString) => {
        this.props.change("start_time", time)
    }

    onEndTimeChange = (time, timeString) => {
        this.props.change("end_time", time)
    }

    onChangeAllDay = e => {
        this.setState({
            allDayCheck: e.target.checked,
            halfDayCheck: false,

        })
    }

    onChangeHalfDay = e => {
        this.setState({
            halfDayCheck: e.target.checked,
            allDayCheck: false,
        })
    }

    handleCancel = () => {
        this.props.onCancel();
    }

    handleUserChange = (value) => {
        const selectedUser = this.props.users.find(user => user.id.toString() === value.toString()) ? this.props.users.find(user => user.id.toString() === value.toString()) : []
        this.setState({
            ...this.state,
            dropdowns: {
                ...this.state.dropdowns,
                notify_manager: selectedUser
            }
        })
    }

    render() {
        const { handleSubmit, leaveType, users, initialValues } = this.props;

        return (
            <div>
                <form onSubmit={handleSubmit(this.onSubmit)}>

                    {/* <div className="form-group sf-form lsico">
                        <label>Start Date</label>
                        <div className="time-o-dtl no-label">
                            <Field
                                name="start_date"
                                type="date"
                                placeholder="Select Date"
                                disabledDate={current => {
                                    return current < new Date();
                                }}
                                component={CustomDatepicker} />
                            <Field
                                name="start_time"
                                type="text"
                                id="start_time"
                                disabled={this.state.allDayCheck}
                                value={moment(new Date()).format("HH:mm")}
                                onChange={(value) => this.onStartTimeChange(value)}
                                component={CustomTimePicker} /> 
                        </div>
                    </div>
                    <div className="form-group sf-form lsico">
                        <label>End Date</label>
                        <div className="time-o-dtl no-label">
                            <Field
                                name="end_date"
                                type="date"
                                placeholder="Select Date"
                                disabledDate={current => {
                                    return current < new Date();
                                }}
                                component={CustomDatepicker} />
                             <Field
                                name="end_time"
                                type="text"
                                id="end_time"
                                disabled={this.state.allDayCheck}
                                value={moment(new Date()).format("HH:mm")}
                                onChange={(value) => this.onEndTimeChange(value)}
                                component={CustomTimePicker} /> 
                        </div>
                    </div> */}
                    <div className="form-group sf-form lsico">
                        <fieldset className="form-group sf-form">
                            <Field
                                label="Start Date"
                                name="start_date"
                                placeholder="Select Date"
                                type="date"
                                disabledDate={current => {
                                    return current < new Date();
                                }}
                                component={CustomDatepicker} />
                        </fieldset>

                        <fieldset className="form-group sf-form">
                            <Field
                                label="End Date"
                                name="end_date"
                                placeholder="Select Date"
                                type="date"
                                disabledDate={current => {
                                    return current < new Date();
                                }}
                                component={CustomDatepicker} />
                        </fieldset>
                    </div>

                    <fieldset className="form-group sf-form">
                        <Field
                            label={Strings.leave_type}
                            name="leave_type"
                            placeholder={Strings.leave_type_rost}
                            type="text"
                            id="leave_type"
                            options={leaveType.map(type => ({
                                title: type.name,
                                value: type.id
                            }))}
                            component={CustomSelect} />
                    </fieldset>

                    <div className="sf-chkbx-group mb-3 nrml-txt">
                        <Field
                            name="all_day"
                            label="All Day"
                            checked={this.state.allDayCheck}
                            onChange={this.onChangeAllDay}
                            component={CustomCheckbox} />
                        <Field
                            name="half_day"
                            label="Half Day"
                            checked={this.state.halfDayCheck}
                            onChange={this.onChangeHalfDay}
                            component={CustomCheckbox} />
                    </div>

                    <fieldset className="form-group sf-form">
                        <Field
                            label={Strings.comment_txt}
                            name="comment"
                            placeholder={Strings.comment_leave_rost}
                            type="text"
                            id="comment"
                            component={customTextarea} />
                    </fieldset>
                    <fieldset className="form-group sf-form notify-mngr-search">
                        <Field
                            label={Strings.notify_manager}
                            name="notify_manager"
                            id="notify_manager"
                            mode="tags"
                            onChange={(value) => this.handleUserChange(value)}
                            options={users && users.map(user => ({
                                title: user.last_name ? user.name + ' ' + user.last_name : user.name,
                                value: user.user_name.toString()
                            }))}
                            component={CustomSelect}
                        />
                    </fieldset>

                    <div className="all-btn multibnt">
                        <div className="btn-hs-icon d-flex justify-content-between">
                            <button type="button" onClick={this.handleCancel} className="bnt bnt-normal">
                                {Strings.cancel_btn}</button>
                            <button type="submit" className="bnt bnt-active">
                                {Strings.add_txt}</button>
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}

const mapStateToProps = (state, props) => {
    return {
        leaveType: state.profileManagement && state.profileManagement.leaveType,
        formValues: state.form && state.form.TimeOffRequest && state.form.TimeOffRequest.values
            ? state.form.TimeOffRequest.values : {},
        users: state.organizationUsers.users,
        initialValues: { ...props.initialValues, notify_manager: props.initialValues.notify_manager ? JSON.parse(props.initialValues.notify_manager) : [] }
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(actions, dispatch),
        jobDocAction: bindActionCreators(jobDocAction, dispatch),
        action: bindActionCreators(userAction, dispatch),
        initialValues: { leave_type: [], notify_manager: [] }
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'TimeOffRequest', validate: timeOffRequestValidator, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(TimeOffRequest)