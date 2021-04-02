import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { Icon, Select, Spin, notification } from 'antd'
import { Field, FormSection } from 'redux-form'

import { Strings } from '../../../../dataProvider/localize';
import { CustomCheckbox } from '../../../common/customCheckbox'
import moment from 'moment';
import * as SAJobMgmtAction from '../../../../actions/SAJobMgmtAction';

const { Option } = Select;

class AllocateStaff extends Component {
    constructor({ props }) {
        super()
        this.state = {
            values: [],
            fetching: false,
            staffList: [],
            value: []
        }
    }
    componentDidMount() {
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.shiftData && prevProps && this.props.shiftData.job_allocated_users && prevProps.shiftData && prevProps.shiftData.job_allocated_users && prevProps.shiftData.job_allocated_users && this.props.shiftData.job_allocated_users.length != prevProps.shiftData.job_allocated_users.length) {
            this.setState({ value: [], staffList: [] });
        }
    }

    fetchUser = (searchKey, index, shiftData) => {
        this.setState({ staffList: [], fetching: true });
        if (shiftData) {
            let shift = shiftData;
            let shift_date = moment(shift.shift_date).format("YYYY-MM-DD");
            let site_time = moment(shift.site_time, "HH:mm:ss").format("HH:mm:ss");
            let yard_time = moment(shift.yard_time, "HH:mm:ss").format("HH:mm:ss");
            let finish_time = moment(shift.finish_time, "HH:mm:ss").format("HH:mm:ss");
            let shift_id = shift && shift.id ? parseInt(shift.id) : null;
            this.props.SAJobMgmtAction.getStaffBySearchKey(searchKey, shift_date, site_time, yard_time, finish_time, shift_id).then(staff => {
                if (staff && staff.org_users && staff.org_users.length > 0) {
                    let staffList = staff.org_users.map(user => ({
                        title: user.first_name,
                        value: user.user_name,
                        availability: user.availability ? user.availability : 0,
                        index: index
                    }));
                    this.setState({ staffList, fetching: false })
                } else {
                    this.setState({ fetching: false });
                }
            }).catch(err => {
                this.setState({ fetching: false });
            })
        }
    }

    handleChange = (value, index) => {
        this.setState({
            value,
            fetching: false,
        });
    };

    handleOnSelect = (value, shifts, index) => {
        if (value && value.key) {
            this.props.onChange(`${shifts}.staff.staff_${value.key}`, true);
        }
    }

    handleOnDeselect = (value, shifts) => {
        if (value && value.key) {
            this.props.onChange(`${shifts}.staff.staff_${value.key}`, false);
        }
    }

    handleNotification = (index) => {
        var staff_ids = [];
        var finalFormData = {};
        var data = this.props.formValues && this.props.formValues.shifts && this.props.formValues.shifts.length > 0 && this.props.formValues.shifts[index];
        for (let key in data) {
            if (key == "staff") {
                for (let staffKey in data[key]) {
                    if (staffKey.indexOf("staff_") > -1) {
                        let userName = staffKey.split('_');
                        if (data[key][staffKey]) {
                            staff_ids.push(parseInt(userName[1]));
                        }
                    }
                }
            }
        }
        if (this.props.jobId) {
            finalFormData.job_id = this.props.jobId;
        }
        if (data.siteSupervisors) {
            finalFormData.site_supervisor_id = data.siteSupervisors;
        }
        if (data.supervisors) {
            finalFormData.supervisor_id = data.supervisors;
        }
        if (this.props.jobNumber) {
            finalFormData.job_number = this.props.jobNumber;
        }

        finalFormData.staff = staff_ids;
        finalFormData.site_time = moment(data.site_time, "HH:mm:ss").format("HH:mm:ss");
        finalFormData.yard_time = moment(data.yard_time, "HH:mm:ss").format("HH:mm:ss");
        finalFormData.finish_time = moment(data.finish_time, "HH:mm:ss").format("HH:mm:ss");
        finalFormData.id = parseInt(data.id);
        this.props.SAJobMgmtAction.updateJobScheduleShift(finalFormData).then(message => {
            this.setState({ value: [], staffList: [] })
            this.props.handleSingleShiftNotification();
            notification.success({
                message: Strings.success_title,
                description: message ? message : "Shift Updated Successfully",
                onClick: () => { },
                className: 'ant-success'
            })
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
        var { shiftData, index, shifts } = this.props;
        return (
            <>
                <div className="alsf-head">
                    <fieldset className="form-group sf-form no-label">
                        <Select
                            mode="multiple"
                            labelInValue
                            placeholder={Strings.show_all_available_staff}
                            suffixIcon={(<Icon type="caret-down" />)}
                            value={this.state.value}
                            filterOption={false}
                            notFoundContent={shiftData.yard_time && shiftData.finish_time ? this.state.fetching ? <Spin size="small" /> : null : "Please select site/yard time, finish time"}
                            onSearch={(key) => this.fetchUser(key, index, shiftData)}
                            onChange={(value) => this.handleChange(value, index)}
                            onSelect={(value) => this.handleOnSelect(value, shifts, index)}
                            onDeselect={(value) => this.handleOnDeselect(value, shifts)}
                        >
                            {this.state.staffList.map(item => {
                                if (item.index == index && item.availability == 1) {
                                    return <Option key={item.value} value={item.value} label={item.title} disabled={true}>
                                        <span className="red-scratch">
                                            {item.title}
                                        </span>
                                    </Option>
                                } else if (item.index == index && item.availability == 3) {
                                    return <Option key={item.value} value={item.value} label={item.title}>
                                        <span className="green-scratch">
                                            {item.title}
                                        </span>
                                    </Option>
                                } else if (item.index == index && item.availability == 2) {
                                    return <Option key={item.value} value={item.value} label={item.title} disabled={true}>
                                        <span className="default-scratch">
                                            {item.title}
                                        </span>
                                    </Option>
                                }
                                // Its Pending user is present in org but not available on that shift time   disabled={true}
                                else if (item.index == index && item.availability == 0) {
                                    return <Option key={item.value} value={item.value} label={item.title} disabled={true}>
                                        <span className="red-scratch">
                                            {item.title}
                                        </span>
                                    </Option>
                                }
                            }
                            )}
                        </Select>
                    </fieldset>
                </div>
                <div className="alsf-body">
                    <FormSection name={`${shifts}.staff`} className="alsf-checkbx">
                        {
                            shiftData && shiftData.job_allocated_users && shiftData.job_allocated_users.length > 0 ? shiftData.job_allocated_users.map(user => {
                                return (
                                    <Field name={`staff_${user.user_name}`} label={`${user.first_name}`} component={CustomCheckbox} />
                                )
                            }) : null
                        }
                        {this.state.value && this.state.value.length > 0 ? this.state.value.map((staff, staffIndex) => {
                            return <Field key={staffIndex} name={`staff_${staff.key}`} label={staff && staff.label && staff.label.props && staff.label.props.children ? staff.label.props.children : null} component={CustomCheckbox} />
                        }) : null}
                    </FormSection>
                    <button
                        type="button"
                        disabled={
                            !(shiftData
                                && shiftData.staff
                                && (Object.values(shiftData.staff).find(staffMember => staffMember === true)))}
                        className="bnt bnt-active"
                        onClick={() => this.handleNotification(index)}>Send Notification</button>
                </div>
                <div className="alsf-foot">
                    <div className="alsf-status">
                        <span><strong>Black Scratch:</strong> Staff already allocated</span>
                        <span className="provarity-txt"><strong>Red Scratch:</strong> Staff working two shifts in one day</span>
                        <span className="done-txt"><strong>Allocate Staff</strong></span>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        formValues: state.form.EditAcceptedJob && state.form.EditAcceptedJob.values ? state.form.EditAcceptedJob.values : {},
    }
}

const mapDispatchToProps = dispatch => {
    return {
        SAJobMgmtAction: bindActionCreators(SAJobMgmtAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AllocateStaff)