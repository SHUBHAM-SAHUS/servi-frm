import React, { Component } from 'react';
import { Icon, Dropdown, notification, Pagination } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import $ from 'jquery';

import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { getStorage, removeByAttr, handleFocus } from '../../../utils/common';
import { customInput } from '../../common/custom-input';
import { CustomDatepicker } from '../../common/customDatepicker';
import { validate } from '../../../utils/Validations/showTimeSheetValidation';
import * as timeSheetAction from '../../../actions/adminTimeSheetAction';
import { customTextarea } from '../../common/customTextarea';
import { CustomTimePicker } from '../../common/customTimePicker';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { CustomSelect } from '../../common/customSelect';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { DeepTrim } from '../../../utils/common';
import UpdateSingleTimeSheet from './updateSingleTimeSheet';
import AddOwnTimeSheet from './AddOwnTimeSheet';

const PAGE_SIZE = 5;

class ShowTimeSheet extends Component {
    constructor(props) {
        super(props);
        this.state = {
            togleSearch: true, inlineTimeSheet: [], allStaffList: [],
            current: 1
        }
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }


    profileLoaderView = (
        <div className="profile-loader otherloader">
            <div class="sk-circle">
                <div class="sk-circle1 sk-child"></div>
                <div class="sk-circle2 sk-child"></div>
                <div class="sk-circle3 sk-child"></div>
                <div class="sk-circle4 sk-child"></div>
                <div class="sk-circle5 sk-child"></div>
                <div class="sk-circle6 sk-child"></div>
                <div class="sk-circle7 sk-child"></div>
                <div class="sk-circle8 sk-child"></div>
                <div class="sk-circle9 sk-child"></div>
                <div class="sk-circle10 sk-child"></div>
                <div class="sk-circle11 sk-child"></div>
                <div class="sk-circle12 sk-child"></div>
            </div>
        </div>
    )
    componentDidMount() {

    }

    componentDidUpdate(prevProps) {

    }

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    }


    handleTimeSheetClick = (timeSheet) => {
        var { inlineTimeSheet } = this.state;
        inlineTimeSheet.push(timeSheet.id);
        this.setState({ inlineTimeSheet }, () => {
            if ($('.staff-timesheet-table').closest(".sf-c-table").find("form.tr") && $('.staff-timesheet-table').closest(".add-staff-tmsheet").find("div.tr")) {
                $('.staff-timesheet-table .scrollarea.sf-scroll-width .scrollarea-content').css('min-width', 1100);
            } else {
                $('.staff-timesheet-table .scrollarea.sf-scroll-width .scrollarea-content').css('min-width', '');
            }
        });


    }


    
    



    handleFilterSubmit = (formData) => {
        var newForm = { ...formData, timesheet_list: undefined }

        this.props.timeSheetAction.getAdminTimeSheets(newForm).then(message => {
            /*  notification.success({
                 message: Strings.success_title,
                 description: message ? message : "job staff updated successfully",
                 onClick: () => { },
                 className: 'ant-success'
             }) */
        }).catch(err => {
            /*  notification.error({
                 key: ERROR_NOTIFICATION_KEY,
                 message: Strings.error_title,
                 description: err ? err : Strings.generic_error,
                 onClick: () => { },
                 className: 'ant-error'
             }) */
        })

    }

    onPageChange = page => {
        this.setState({
            current: page,
        });
    };



    resetSeacrh = () => {
        this.props.change("start_date", undefined)
        this.props.change("service_agent_id", [])
        this.props.change("user_name", [])
        this.props.change("period", undefined)

    }

    render() {
        const { handleSubmit, sataffList, saList, timeSheetsList } = this.props;
        const { current } = this.state;
        return (
            <div className="row">
                {this.state.uploadLoader ?
                    this.profileLoaderView
                    : null
                }
                <div className="col-md-12">
                    <div className="sf-card-wrap">

                        {/* Staff Timesheet */}
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">Staff Timesheet</h2>
                                <div className="info-btn disable-dot-menu">
                                    <Dropdown className="more-info" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <form onSubmit={handleSubmit(this.handleFilterSubmit)}>

                                    <div className="timesheet-filter ext-div">
                                        <fieldset className="sf-form lsico pr-2">
                                            <Field
                                                label="Start Day" allowClear={true}
                                                name="start_date"
                                                component={CustomDatepicker}
                                            />
                                        </fieldset>
                                        <fieldset className="sf-form pr-2">
                                            <Field name="period" label="Period"
                                                type="text" options={[{ title: "Week", value: 7 }, { title: "Fortnight ", value: 14 },
                                                { title: "Calendar Month", value: 31 }, { title: "Month", value: 30 }]}
                                                component={CustomSelect} />
                                        </fieldset>
                                        <fieldset className="sf-form pr-2">
                                            <Field name="user_name" label="Staff" mode="multiple"
                                                type="text" options={sataffList.map(staff => ({ title: staff.staff_name, value: staff.staff_user_name }))}
                                                component={CustomSelect} />
                                        </fieldset>
                                        <fieldset className="sf-form pr-2">
                                            <Field name="service_agent_id" label="SA Filter" mode="multiple"
                                                type="text" options={saList.map(sa => ({ title: sa.sa_name, value: sa.service_agent_id }))}
                                                component={CustomSelect} />
                                        </fieldset>
                                        <button type="submit" className="bnt bnt-active">Submit</button>
                                        <button
                                            className="normal-bnt ml-3"
                                            type="submit"
                                            onClick={this.resetSeacrh}
                                        >
                                            Reset
              </button>
                                    </div>
                                </form>

                                <div className="staff-timesheet-table sf-timesheet-table">
                                    {/* <ScrollArea className="sf-scroll-width"
                                            speed={1} smoothScrolling={true} vertical={false}> */}
                                    {/* <div className="timesheet-add-nr-scroll"> */}
                                    <div className="sf-c-table org-user-table mb-0">
                                        <div className="tr">
                                            <span className="th">Day of week</span>
                                            <span className="th">Date </span>
                                            <span className="th">Shift (day/night)</span>
                                            <span className="th">Service Agent</span>
                                            <span className="th">Account Manager</span>
                                            <span className="th">Client</span>
                                            <span className="th">Site</span>
                                            <span className="th">Job ID</span>
                                            <span className="th">Job Status</span>
                                            <span className="th">Start time</span>
                                            <span className="th">End time</span>
                                            <span className="th">Break time </span>
                                            <span className="th">Total hours</span>
                                            {/* <span className="th">Timesheet status</span> */}
                                            <span className="th"></span>
                                        </div>
                                        {timeSheetsList && timeSheetsList.slice((current - 1) * PAGE_SIZE, current * PAGE_SIZE).map(time =>
                                            <UpdateSingleTimeSheet form={`updateSingleTimeSheet_${time.timesheet_id}`}
                                                initialValues={time} />)}
                                    </div>
                                    {/* </div> */}
                                    <Pagination className="time-sh-pagniton" current={current} onChange={this.onPageChange}
                                        total={timeSheetsList && timeSheetsList.length} pageSize={PAGE_SIZE} />
                                    {/* <FieldArray name="timeSheetList" component={this.renderMembers} /> */}
                                    {/* </ScrollArea> */}

                                    <AddOwnTimeSheet />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        sataffList: state.adminTimesheet.sataffList,
        saList: state.adminTimesheet.saList,
        timeSheetsList: state.adminTimesheet.timeSheetsList,
        ownTimeSheet: state.adminTimesheet.ownTimeSheet,
        initialValues: { user_name: [], service_agent_id: [] },
        formValues: state.form.showTimeSheet && state.form.showTimeSheet.values
    }
}

const mapDispatchToprops = dispatch => ({
    timeSheetAction: bindActionCreators(timeSheetAction, dispatch)
})

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'showTimeSheet', validate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(ShowTimeSheet)
