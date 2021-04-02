import React from 'react';
import { Icon, Collapse, Spin, notification, Select } from 'antd';
import { connect } from 'react-redux';
import { Field, reduxForm } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import moment from 'moment';

import { Strings } from '../../../dataProvider/localize';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import * as jobCalendarActions from '../../../actions/serviceAgentJobCalendarActions';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../utils/common';
import * as sAJobMgmtAction from '../../../actions/SAJobMgmtAction';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomTimePicker } from '../../common/customTimePicker';
import { DeepTrim } from '../../../utils/common';

const { Panel } = Collapse;
const { Option } = Select;
class AddShift extends React.Component {
    constructor(props) {
        super(props);
        this.state = { visible: true, fetching: false, staffList: [], value: [] };
        this.lastFetchId = 0;
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }

    handleSupervisorsSelection = (value) => {
    }

    handleSiteSupervisorsSelection = (value) => {
    }

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);

        var staff_ids = [];
        var shift = [];
        var shiftObj = {};
        for (let key in formData) {
            if (key === "siteSupervisors") {
                shiftObj['site_supervisor_id'] = formData[key];
            }
            if (key === "supervisors") {
                shiftObj['supervisor_id'] = formData[key];
            }
        }
        if (this.state.value && this.state.value.length > 0) {
            this.state.value.map(staffId => {
                if (staffId && staffId.key) {
                    staff_ids.push(parseInt(staffId.key));
                }
            })
        }
        shiftObj['staff'] = staff_ids;
        shiftObj['site_time'] = moment(formData.site_time, "HH:mm:ss").format("HH:mm:ss");
        shiftObj['yard_time'] = moment(formData.yard_time, "HH:mm:ss").format("HH:mm:ss");
        shiftObj['finish_time'] = moment(formData.finish_time, "HH:mm:ss").format("HH:mm:ss");


        if (formData.job_date) {
            formData.job_date = moment(formData.job_date).format("YYYY-MM-DD")
        }
        if (this.currentOrganization) {
            formData.org_id = this.currentOrganization;
        }
        if (formData.day) {
            formData.job_time = "D";
        } else if (formData.night) {
            formData.job_time = "N"
        } else if (formData.night && formData.night) {
            formData.job_time = "D,N";
        }
        formData.job_doc_id = 1;
        if (this.props.task_id) {
            formData.task_id = parseInt(this.props.task_id);
        }
        if (this.props.job_number) {
            formData.job_number = this.props.job_number
        }
        if (this.props.jobId) {
            formData.job_id = this.props.jobId
        }
        if (formData.shift_date) {
            shiftObj['shift_date'] = moment(formData.shift_date).format("YYYY-MM-DD");
        }
        shift.push(shiftObj);

        /* Changes after schedule object change Auth: Arish */
        formData.schedule_shifts = shift;
        formData.job_schedule_id = this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].job_schedules
            && this.props.jobDetails.job_details[0].job_schedules[0] && this.props.jobDetails.job_details[0].job_schedules[0].id
        formData.remove_shift_ids = []
        formData.job_duration = this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].job_schedules
            && this.props.jobDetails.job_details[0].job_schedules[0] && this.props.jobDetails.job_details[0].job_schedules[0].job_duration
        formData.note = this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].job_schedules
            && this.props.jobDetails.job_details[0].job_schedules[0] && this.props.jobDetails.job_details[0].job_schedules[0].note
        formData.job_start_date = this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].job_start_date;
        formData.job_time = this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].job_schedules
            && this.props.jobDetails.job_details[0].job_schedules[0] && this.props.jobDetails.job_details[0].job_schedules[0].job_time

        // this.props.jobCalendarActions.addTaskDetails(formData)
        this.props.jobCalendarActions.updateTaskDetails(formData)
            .then(message => {
                if (message) {
                    notification.success({
                        message: Strings.success_title,
                        description: message ? message : "Shift Added Successfully", onClick: () => { },
                        className: 'ant-success'
                    });
                }
                this.props.sAJobMgmtAction.getJobDetails(this.props.job_number);
                this.props.handleAddShiftForm();
            })
            .catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                })
            })
        this.props.reset();
    }

    handleAddAction = () => {
        this.props.handleAddShiftForm();
    }

    fetchUser = (searchKey) => {
        this.setState({ staffList: [], fetching: true });
        if (this.props.formValues && this.props.formValues.shift_date && this.props.formValues.site_time && this.props.formValues.yard_time && this.props.formValues.finish_time) {
            let shift_date = moment(this.props.formValues.shift_date).format("YYYY-MM-DD");
            let site_time = moment(this.props.formValues.site_time, "HH:mm:ss").format("HH:mm:ss");
            let yard_time = moment(this.props.formValues.yard_time, "HH:mm:ss").format("HH:mm:ss");
            let finish_time = moment(this.props.formValues.finish_time, "HH:mm:ss").format("HH:mm:ss");
            this.props.sAJobMgmtAction.getStaffBySearchKey(searchKey, shift_date, site_time, yard_time, finish_time).then(staff => {
                if (staff && staff.org_users && staff.org_users.length > 0) {
                    let staffList = staff.org_users.map(user => ({
                        title: user.first_name,
                        value: user.user_name,
                        availability: user.availability ? user.availability : 0
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

    handleChange = value => {
        this.setState({
            value,
            fetching: false,
        });
    };

    render() {
        const { handleSubmit } = this.props;
        return (<>
            {this.props.visible ? <div className="no-bg open-ttbale">
                <div className="allsf-tt-dtls">
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <div className="add-staff-ttable">
                            <button class="closed-btn extend-closed" onClick={this.handleAddAction}><Icon type="close" /></button>
                            <div className="d-flex ttbale-row" id="timePickerDrop">
                                <div className="col-md-5">
                                    <fieldset className="jc-calndr form-group sf-form">
                                        <Field
                                            name="shift_date"
                                            type="date"
                                            label={Strings.date_txt}
                                            component={CustomDatepicker} />
                                    </fieldset>
                                </div>
                                <div className="sf-form form-group">
                                    <Field label={Strings.yard_time} name="yard_time" component={CustomTimePicker} />
                                </div>
                                <div className="sf-form form-group">
                                    <Field label={Strings.site_time} name="site_time" component={CustomTimePicker} />
                                </div>
                                <div className="sf-form form-group">
                                    <Field label={Strings.finish_time} name="finish_time" component={CustomTimePicker} />
                                </div>
                                <div className="sf-form form-group sf-note">
                                    {/* <label>&nbsp;</label> */}
                                    {/* <p>Note : If Yard time and Site time is same then worker should suppose to come at site directly otherwise worker should suppose to come at yard.</p> */}
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-md-6">
                                    <fieldset className="form-group sf-form no-label">
                                        <Field
                                            name="supervisors"
                                            placeholder={Strings.allocate_supervisor}
                                            type="text"
                                            dataSource={this.props.supervisorsList ? this.props.supervisorsList.map(user => ({ text: user.first_name, value: user.user_name })) : []}
                                            component={CustomAutoCompleteSearch}
                                            onSelect={(value) => this.handleSupervisorsSelection(value)}
                                        />
                                    </fieldset>
                                </div>
                                <div className="col-md-6">
                                    <fieldset className="form-group sf-form no-label">
                                        <Field
                                            name="siteSupervisors"
                                            placeholder={Strings.allocate_site_supervisor}
                                            type="text"
                                            dataSource={this.props.siteSupervisorsList ? this.props.siteSupervisorsList.map(user => ({ text: user.first_name, value: user.user_name })) : []}
                                            component={CustomAutoCompleteSearch}
                                            onSelect={(value) => this.handleSiteSupervisorsSelection(value)}
                                        />
                                    </fieldset>
                                </div>
                            </div>
                            <div className="allocate-staff-collaps">
                                <Collapse className="allo-staff-list" expandIconPosition="right" defaultActiveKey={['allo-staff-key']} expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : -90} />}>
                                    <Panel className="asc-item" header="Allocate Staff" key="allo-staff-key">
                                        <div className="alsf-head">
                                            <fieldset className="form-group sf-form no-label">
                                                <Select
                                                    mode="multiple"
                                                    labelInValue
                                                    placeholder={Strings.show_all_available_staff}
                                                    suffixIcon={(<Icon type="caret-down" />)}
                                                    value={this.state.value}
                                                    filterOption={false}
                                                    notFoundContent={this.props.formValues && this.props.formValues.shift_date && this.props.formValues.yard_time && this.props.formValues.site_time && this.props.formValues.finish_time ? this.state.fetching ? <Spin size="small" /> : null : "Please select date, site/yard time, finish time"}
                                                    onSearch={this.fetchUser}
                                                    onChange={this.handleChange}
                                                >
                                                    {this.state.staffList.map(item => {
                                                        if (item.availability == 1) {
                                                            return <Option key={item.value} value={item.value} label={item.title} disabled={true}>
                                                                <span className="red-scratch">
                                                                    {item.title}
                                                                </span>
                                                            </Option>
                                                        } else if (item.availability == 3) {
                                                            return <Option key={item.value} value={item.value} label={item.title}>
                                                                <span className="green-scratch">
                                                                    {item.title}
                                                                </span>
                                                            </Option>
                                                        } else if (item.availability == 2) {
                                                            return <Option key={item.value} value={item.value} label={item.title} disabled={true}>
                                                                <span className="default-scratch">
                                                                    {item.title}
                                                                </span>
                                                            </Option>
                                                        }
                                                        // Its Pending user is present in org but not available on that shift time
                                                        else if (item.availability == 0) {
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
                                            <div className="alsf-scratch-label">
                                                {this.state.value && this.state.value.length > 0 ? this.state.value.map(staff => {
                                                    return <span className="alsf-spn-list">{staff && staff.label && staff.label.props && staff.label.props.children ? staff.label.props.children : null}</span>
                                                }) : null}
                                            </div>
                                            <button className="bnt bnt-active" type="submit">Allocate Staff</button>
                                        </div>
                                        <div className="alsf-foot">
                                            <div className="alsf-status">
                                                <span><strong>Black Scratch:</strong> Staff already allocated</span>
                                                <span className="provarity-txt"><strong>Red Scratch:</strong> Staff working two shifts in one day</span>
                                                <span className="done-txt"><strong>Allocate Staff</strong></span>
                                            </div>
                                        </div>
                                    </Panel>
                                </Collapse>
                            </div>
                        </div>
                    </form>
                </div>
            </div> : null
            }
        </>
        )
    }
}

// export default ShiftUpdate;
const mapStateToProps = (state, props) => {

    return {
        supervisorsList: state.sAJobCalendar.supervisorsList,
        siteSupervisorsList: state.sAJobCalendar.siteSupervisorsList,
        orgUSerList: state.jobdocManagement.orgUSerList,
        formValues: state.form.addShift && state.form.addShift.values ? state.form.addShift.values : {},
        jobDetails: state.sAJobMgmt.jobDetails,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
        sAJobMgmtAction: bindActionCreators(sAJobMgmtAction, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'addShift',
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(AddShift)