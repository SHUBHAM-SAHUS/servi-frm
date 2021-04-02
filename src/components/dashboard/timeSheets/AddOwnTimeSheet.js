import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, notification } from 'antd';
import { reduxForm } from 'redux-form';
import moment from 'moment';
import $ from 'jquery';
import { Strings } from '../../../dataProvider/localize';
import * as action from '../../../actions/adminTimeSheetAction';
import { customInput } from '../../common/custom-input';
import { customTextarea } from '../../common/customTextarea';
import { CustomTimePicker } from '../../common/customTimePicker';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { handleFocus, DeepTrim } from '../../../utils/common';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomSelect } from '../../common/customSelect';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
const isRequired = value =>
    value ? undefined : "Required";
class AddOwnTimeSheet extends React.Component {
    constructor(props) {
        super(props);
        this.state = { position: '' };
    }

    handleAddStaff = (e, fields) => {
        fields.push({})
        $('.staff-timesheet-table .scrollarea.sf-scroll-width .scrollarea-content').css('min-width', 1100);
    }
    handleDeleteStaff = (e, fields) => {
        if ($('.staff-timesheet-table').closest(".sf-c-table").find("form.tr")) {
            $('.staff-timesheet-table .scrollarea.sf-scroll-width .scrollarea-content').css('min-width', 1100);
        } else {
            $('.staff-timesheet-table .scrollarea.sf-scroll-width .scrollarea-content').css('min-width', '');
        }
    }
    handleStaffSelection = (user_name) => {
    }


    disabledDate = (currentDate) => {
        const { ownTimeSheet } = this.props;
        if (ownTimeSheet.min_date && ownTimeSheet.max_date) {
            console.log()
            return currentDate < moment(ownTimeSheet.min_date) || currentDate > moment(ownTimeSheet.max_date).add('days', 1)
        } else
            return false;
    }

    renderMembers = ({ fields, meta: { error, submitFailed } }) => {
        return (
            <>
                {fields.map((member, index) => (
                    <div className="tr">
                        <span className="td">
                            <fieldset className="sf-form lsico pr-2">
                                <Field
                                    label="Start Day"
                                    name={`${member}.date`}
                                    id="date_of_birth"
                                    disabledDate={this.disabledDate}
                                    component={CustomDatepicker}
                                    validate={isRequired}
                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field name={`${member}.shift`} type="text" component={CustomSelect} options={
                                    [{ value: "D", title: "Day" }, { value: "N", title: "Night" }]
                                }
                                    validate={isRequired}
                                /> </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field name={`${member}.job_id`} label="SA Filter" placeholder={Strings.allocate_supervisor}
                                    type="text" options={
                                        this.props.formValues && this.props.formValues.timesheet_list &&
                                            this.props.formValues.timesheet_list[index] &&
                                            this.props.formValues.timesheet_list[index].date ?
                                            this.props.ownTimeSheet && this.props.ownTimeSheet.jobs ?
                                                this.props.ownTimeSheet.jobs.filter(job =>
                                                    moment(job.shift_date).isSame(this.props.formValues.timesheet_list[index].date, 'day')).
                                                    map(job => ({ title: job.job_name, value: job.id })) :
                                                [] : []
                                    } component={CustomSelect}
                                    validate={isRequired}
                                />
                            </fieldset>
                        </span>
                        <span className="td"><fieldset className="sf-form">
                            <Field name={`${member}.start_time`} component={CustomTimePicker}
                                validate={isRequired}
                            /> </fieldset> </span>
                        <span className="td"><fieldset className="sf-form">
                            <Field name={`${member}.stop_time`} component={CustomTimePicker}
                                validate={isRequired}
                            /> </fieldset> </span>
                        <span className="td"><fieldset className="sf-form">
                            <Field name={`${member}.break_time`} component={customInput} type="number"
                                validate={isRequired}
                            /> </fieldset> </span>
                        <span className="td"><button className='delete-bnt' type='button' onClick={() => {
                            fields.remove(index);
                            this.handleDeleteStaff()
                        }}><i class="fa fa-trash-o"></i></button></span>
                    </div>
                ))}
                <div className="btn-hs-icon sm-bnt bnt-error mt-3">
                    <button className="normal-bnt" type="button"
                        onClick={(e) => this.handleAddStaff(e, fields)}
                    > + Add Staff</button>
                    {submitFailed && error && <span className="error-input">{error}</span>}
                </div>
            </>
        )
    }
    onNewTimeSheetSubmit = (formData) => {
        console.log("FormFata", formData);
        formData.timesheet_list && formData.timesheet_list.forEach(time => {
            time.date = time.date.format("DD-MM-YYYY");
            time.start_time = time.start_time.format('HH:mm:ss')
            time.stop_time = time.stop_time.format('HH:mm:ss')
            // time.break_time = time.break_time.format('HH:mm:ss')
            var job = time.job_id && this.props.ownTimeSheet && this.props.ownTimeSheet.jobs
                && this.props.ownTimeSheet.jobs.find(job => job.id === time.job_id)
            if (job)
                time.staff_user_name = job.staff_user_name;

        })
        formData = { ...formData, ...this.props.searchFormValues }
        this.props.addOwnTimeSheet(formData).then(message => {
            notification.success({
                message: Strings.success_title,
                description: message ? message : "Time sheet added Succesfully",
                onClick: () => { },
                className: 'ant-success'
            })
            this.props.reset();
        }).catch(err => {
            notification.error({
                key: ERROR_NOTIFICATION_KEY,
                message: Strings.error_title,
                description: err ? err : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
            })
        })
    }
    render() {
        const { handleSubmit, formValues } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onNewTimeSheetSubmit)}>
                <div className="sf-c-table org-user-table mb-0">
                    {formValues && formValues.timesheet_list && formValues.timesheet_list.length > 0 ? <div className="tr">
                        <span className="th">Date</span>
                        <span className="th">Shift name</span>
                        <span className="th">Job ID</span>
                        <span className="th">Start time</span>
                        <span className="th">End time</span>
                        <span className="th">Break time</span>
                        <span className="th"></span>
                    </div> : null}
                    <FieldArray name="timesheet_list" component={this.renderMembers} />
                </div>
                {formValues && formValues.timesheet_list && formValues.timesheet_list.length > 0 ?
                    <div className="all-btn d-flex justify-content-end"> <div className="btn-hs-icon"> <button type="submit" className="bnt bnt-active">{Strings.save_btn}</button></div></div> : null}
            </form>

        )
    }
}

const mapStateToProps = (state) => {
    return {
        formValues: state.form.AddOwnTimeSheet && state.form.AddOwnTimeSheet.values ? state.form.AddOwnTimeSheet.values : {},
        ownTimeSheet: state.adminTimesheet.ownTimeSheet,
        searchFormValues: state.form.showTimeSheet && state.form.showTimeSheet.values ? state.form.showTimeSheet.values : {}
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({
        form: "AddOwnTimeSheet",
        enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(AddOwnTimeSheet)