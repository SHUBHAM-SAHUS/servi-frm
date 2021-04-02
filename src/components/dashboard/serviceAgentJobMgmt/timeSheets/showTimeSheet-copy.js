import React, { Component } from 'react';
import { Icon, Modal, Dropdown, notification } from 'antd';
import { connect } from 'react-redux';
import moment from 'moment';
import _ from 'lodash';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import $ from 'jquery';
import * as sAJobMgmtAction from '../../../../actions/SAJobMgmtAction';
import * as invoiceAction from '../../../../actions/invoiceAction';
import * as actions from '../../../../actions/roleManagementActions';
import * as accessControlAction from '../../../../actions/accessControlManagementAction';
import InvoicePrintPdf from './InvoicePrintPdf';

import { Strings } from '../../../../dataProvider/localize';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import { getStorage, removeByAttr, handleFocus } from '../../../../utils/common';
import { customInput } from '../../../common/custom-input';
import { validate } from '../../../../utils/Validations/showTimeSheetValidation';
import * as timeSheetAction from '../../../../actions/timeSheetAction';
import UpdateSingleTimeSheet from './updateSingleTimeSheet';
import { customTextarea } from '../../../common/customTextarea';
import { CustomTimePicker } from '../../../common/customTimePicker';
import { pdf } from '@react-pdf/renderer';
import IncidentReportPdf from '../reports/IncidentReportsAssignment/IncidentReportPdf';
import * as SAIncidentReportAction from '../../../../actions/SAIncidentReportActions';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';
import JobReportPdf from "../jobReport/JobReportPdf";
import * as orgUserActions from '../../../../actions/organizationUserAction';
import HazardReportPdf from '../reports/hazardReportsAssignment/HazardReportPdf';
import { ViewInvoice } from './ViewInvoice';
import ScrollArea from 'react-scrollbar';
import { ERROR_NOTIFICATION_KEY } from '../../../../config';
import { DeepTrim } from '../../../../utils/common';

class ShowTimeSheet extends Component {
    constructor(props) {
        super(props);
        this.state = { togleSearch: true, inlineTimeSheet: [], timesheetDate: null, timeSheetIndex: 0, allStaffList: [] }
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }

    getStaffTimeSheetByJobId(job_id) {
        this.props.timeSheetAction.getStaffTimeSheetList(job_id)
            .then(async () => {
                if (this.props.timeSheetList && this.props.timeSheetList.staff_list) {
                    if (this.props.timeSheetList && this.props.timeSheetList.staff_timesheet && this.props.timeSheetList.staff_timesheet.length > 0 && this.props.timeSheetList.staff_timesheet[0] && this.props.timeSheetList.staff_timesheet[0].staff_timesheet) {
                        var staffList = this.props.timeSheetList.staff_timesheet[0].staff_timesheet;
                        var userList = this.props.timeSheetList.staff_list;
                        const myDifferences = _.differenceBy(userList, staffList, 'user_name');
                        this.setState({ allStaffList: myDifferences });
                    }
                }
            })
            .catch(message => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            })
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
        this.props.SAIncidentReportAction.getIncidentCategories()
        this.props.orgUserActions.getOrganizationUsers(this.currentOrganization);
        if (this.props.initialJob && this.props.initialJob.id && this.props.initialJob.job_number) {
            this.getStaffTimeSheetByJobId(this.props.initialJob.id);
            this.props.invoiceAction.getPreviewInvoiceList(this.props.initialJob.job_number);
            this.props.timeSheetAction.getInvoices(this.props.initialJob.job_number);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps && prevProps.job === undefined) {
            if (this.props.job && this.props.job.id) {
                this.setState({ timeSheetIndex: 0 })
                this.getStaffTimeSheetByJobId(this.props.job.id)
                this.props.invoiceAction.getPreviewInvoiceList(this.props.job.job_number)
                this.props.timeSheetAction.getInvoices(this.props.job.job_number)
            }
        } else if (this.props.job && this.props.job.id && (prevProps.job.id !== this.props.job.id)) {
            this.setState({ timeSheetIndex: 0 })
            this.getStaffTimeSheetByJobId(this.props.job.id)
            this.props.invoiceAction.getPreviewInvoiceList(this.props.job.job_number)
            this.props.timeSheetAction.getInvoices(this.props.job.job_number)
        }
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
    removeInlineTimeSheet = (timeSheet) => {
        var { inlineTimeSheet } = this.state;
        var index = inlineTimeSheet.findIndex(id => id === timeSheet.id)
        if (index != -1) {
            inlineTimeSheet.splice(index, 1);
        }
        this.setState({ inlineTimeSheet }, () => {
            if ($('.staff-timesheet-table').closest(".add-staff-tmsheet").find("div.tr")) {
                $('.staff-timesheet-table .scrollarea.sf-scroll-width .scrollarea-content').css('min-width', 1100);
            } else {
                $('.staff-timesheet-table .scrollarea.sf-scroll-width .scrollarea-content').css('min-width', '');
            }
        });
    }


    handleStaffSelection = (user_name) => {
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



    renderMembers = ({ fields, meta: { error, submitFailed } }) => {
        return (
            <div className="sf-c-table org-user-table add-staff-tmsheet mb-0">
                {fields.map((member, index) => (
                    <div className="tr" key={index}>
                        <span className="td"><fieldset className="sf-form">
                            <Field
                                name={`${member}.user_name`}
                                placeholder={Strings.allocate_supervisor}
                                type="text"
                                dataSource={this.state.allStaffList && this.state.allStaffList.length > 0 ? this.state.allStaffList.map(user => ({ text: user.first_name, value: user.user_name })) : []}
                                component={CustomAutoCompleteSearch}
                                onSelect={(value) => this.handleStaffSelection(value)}
                            />
                        </fieldset></span>
                        <span className="td">
                            <label>{this.props.formValues.timeSheetList && this.props.formValues.timeSheetList[index] &&
                                this.props.formValues.timeSheetList[index].user_name && this.props.timeSheetList &&
                                this.props.timeSheetList.staff_list && this.props.timeSheetList.staff_list.
                                    find(user => user.user_name.toString() === this.props.formValues.timeSheetList[index].user_name.toString()) &&
                                this.props.timeSheetList.staff_list.
                                    find(user => user.user_name.toString() === this.props.formValues.timeSheetList[index].user_name.toString()).role_name}</label>
                        </span>
                        <span className="td"><fieldset className="sf-form">
                            <Field name={`${member}.start_time`} component={CustomTimePicker} /> </fieldset> </span>
                        <span className="td"><fieldset className="sf-form">
                            <Field name={`${member}.stop_time`} component={CustomTimePicker} /> </fieldset> </span>
                        <span className="td"><fieldset className="sf-form">
                            <Field name={`${member}.break_time`} type="text" component={customInput} /> </fieldset> </span>
                        <span className="td"><fieldset className="sf-form sm-txtarea-size">
                            <Field name={`${member}.comment`} type="text" component={customTextarea} /> </fieldset></span>

                        <span className="td"><button className='delete-bnt' type='button' onClick={() => {
                            fields.remove(index);
                            this.handleDeleteStaff()
                        }}><i class="fa fa-trash-o"></i></button></span>
                    </div>
                ))}
                <div className="btn-hs-icon sm-bnt bnt-error mt-3">
                    {this.props.timeSheetList.staff_list && this.props.timeSheetList.staff_list.length > 0 ? <button className="bnt bnt-normal" type="button" onClick={(e) => this.handleAddStaff(e, fields)} disabled={this.props.timeSheetList && this.props.timeSheetList.job && this.props.timeSheetList.job.timesheet_approval_status == 1}>Add Staff</button> : ''}
                    {submitFailed && error && <span className="error-input">{error}</span>}
                </div>
            </div>
        )
    }

    handleTimesheetSubmit = async (formData) => {
        formData = await DeepTrim(formData);

        if (this.props.job && this.props.job.id) {
            formData.job_id = this.props.job.id;
        }
        if (formData.timeSheetList && formData.timeSheetList.length > 0) {
            var updatedStaffList = this.state.allStaffList;
            formData.timeSheetList.map(item => {
                if (this.props.timeSheetList && this.props.timeSheetList.staff_timesheet && this.props.timeSheetList.staff_timesheet.length > 0) {
                    item.date = this.props.timeSheetList.staff_timesheet[this.state.timeSheetIndex].date;
                    if (item && item.start_time) {
                        item.start_time = moment(item.start_time).format('HH:mm:ss');;
                    }
                    if (item && item.stop_time) {
                        item.stop_time = moment(item.stop_time).format('HH:mm:ss');;
                    }
                    if (item && item.user_name) {
                        updatedStaffList = removeByAttr(updatedStaffList, 'user_name', item.user_name);
                    }
                }
            })
            this.setState({ allStaffLis: updatedStaffList });
            this.props.timeSheetAction.saveTimesheet(formData).then(message => {
                this.props.change('timeSheetList', []);
                notification.success({
                    message: Strings.success_title,
                    description: message ? message : "job staff updated successfully",
                    onClick: () => { },
                    className: 'ant-success'
                })
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
    }

    printDocument = (obj, fileName) => {
        obj.then((blob) => {
            var url = URL.createObjectURL(blob);
            //////////////for downloading///////////////////////
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // the filename you want
            a.download = `${fileName}_${this.props.job.job_number}.pdf`;
            document.body.appendChild(a);
            this.toggleLoader();
            a.click();
            window.URL.revokeObjectURL(url);
            /////////////////////////
            return Promise.resolve(blob)
        }).then((res) => {

            this.blobData = res
        })
    }
    downloadHazardReport = (id) => {
        if (id && this.currentOrganization && this.props.job.id) {
            this.props.SAIncidentReportAction.getHazardDetailsNew(id, this.currentOrganization, this.props.job.id).then(res => {
                this.toggleLoader();
                var obj = pdf(<HazardReportPdf users={this.props.usersList} hazardDetails={this.props.hazardDetails}
                    job={this.props.jobDetails} />).toBlob();
                this.printDocument(obj, `hazard_report`);
            })
        }
    }

    downloadIncidentReport = (id) => {
        if (id && this.currentOrganization && this.props.job.id) {
            this.props.SAIncidentReportAction.getIncidentDetails(id, this.currentOrganization, this.props.job.id).then(res => {
                this.props.SAIncidentReportAction.getRiskControls().then(() => {
                    this.toggleLoader();
                    const { incidentReportDetails, usersList, riskControls } = this.props;
                    var obj = pdf(<IncidentReportPdf incidentReportDetails={incidentReportDetails} usersList={usersList}
                        riskControls={riskControls} job={this.props.jobDetails} />).toBlob();
                    if (obj)
                        this.printDocument(obj, 'incident_report');
                })

            })
        }
    }
    toggleLoader = () => {
        this.setState({ uploadLoader: !this.state.uploadLoader });
    }

    downloadJobReport = () => {
        if (this.currentOrganization && this.props.job && this.props.job.id) {
            this.props.sAJobMgmtAction.getJobReport(this.props.job.id).then((res) => {
                this.toggleLoader();
                var obj = pdf(<JobReportPdf job={this.props.jobDetails} jobReports={this.props.jobReports} filePath={this.props.filePath} />).toBlob();
                this.printDocument(obj, 'job_report')
            }
            )
        }
    }

    handlePreviousSheet = () => {
        if (this.state.timeSheetIndex !== 0) {
            this.setState({ timeSheetIndex: this.state.timeSheetIndex - 1 })
        }
        this.props.reset();
    }
    handleNextSheet = () => {
        var timeSheetLength = this.props.timeSheetList && this.props.timeSheetList.staff_timesheet && this.props.timeSheetList.staff_timesheet.length ? this.props.timeSheetList.staff_timesheet.length - 1 : 0;
        if (timeSheetLength > this.state.timeSheetIndex) {
            this.setState({ timeSheetIndex: this.state.timeSheetIndex + 1 })
        }
        this.props.reset();
    }
    showGenerateInvoiceModal = () => {

        this.setState({
            visible: true,
        });


        // this.props.sAJobMgmtAction.getJobReport(this.props.completedJobDetail.id);
        // this.props.sAJobMgmtAction.getJobDetails(this.props.completedJobDetail.job_number);
    };
    handleOk = e => {
        this.setState({
            visible: false,
        });

        this.printPdf()
    };
    printPdf = () => {
        var obj = pdf(<InvoicePrintPdf invoiceDetails={this.props.invoiceDetails} />).toBlob();
        obj.then((blob) => {
            var url = URL.createObjectURL(blob);
            var finalFormData = new FormData();
            finalFormData.append("job_number", this.props.jobDetails.job_number);
            finalFormData.append("amount", this.props.invoiceDetails.total);
            finalFormData.append("job_id", this.props.jobDetails.id);
            finalFormData.append("gst_amount", this.props.invoiceDetails.gst);
            finalFormData.append("invoice_file", blob);
            this.props.timeSheetAction.saveInvoice(finalFormData, this.props.jobDetails.job_number).then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message ? message : "Timesheet approved successfully",
                    onClick: () => { },
                    className: 'ant-success'
                })
            }).catch(err => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.error_title,
                    description: err ? err : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                })
            })
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            // the filename you want
            a.download = `invoice.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            return Promise.resolve(blob)
        }).then((res) => {
            this.blobData = res
        })
    }
    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    handleApproveTimesheet = () => {
        if (this.props.job && this.props.job.id) {
            var formData = {
                job_id: this.props.job.id,
                timesheet_approval_status: 1
            }
            this.props.timeSheetAction.approveTimesheet(formData).then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message ? message : "Timesheet approved successfully",
                    onClick: () => { },
                    className: 'ant-success'
                })
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
    }

    approveJobReport = () => {
        if (this.props.job && this.props.job.id) {
            var formData = {
                job_id: this.props.job.id,
                completed_job_reports_approval_status: 1
            }
            this.props.timeSheetAction.approveJobReport(formData).then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message ? message : "Job Report approved successfully",
                    onClick: () => { },
                    className: 'ant-success'
                })
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
    }

    deleteTimeSheetStff = (user_name, timesheet_id, job_id) => {
        if (user_name && timesheet_id && job_id) {
            this.props.timeSheetAction.deleteSingleStaff(user_name, timesheet_id, job_id).then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message ? message : "job staff delete successfully",
                    onClick: () => { },
                    className: 'ant-success'
                })
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
    }

    render() {
        const { timeSheetList, handleSubmit, job, initialJob, allIncidentReportsByJob, allHazardReportsByJob } = this.props;
        return (
            <div className="row">
                {this.state.uploadLoader ?
                    this.profileLoaderView
                    : null
                }
                <div className="col-md-12 col-lg-8">
                    <div className="sf-card-wrap">
                        {/* zoom button  */}
                        <div className="card-expands">
                            <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                                <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                        </div>

                        {/* Job Details */}
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.job_details_txt}</h2>
                                <div className="info-btn disable-dot-menu">
                                    <Dropdown className="more-info" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="data-v-row">
                                    <div class="data-v-col">
                                        <div class="view-text-value">
                                            <label>Job Id</label>
                                            <span className="active-txt">{job ? job.job_number ? job.job_number : '' : initialJob && initialJob.job_number ? initialJob.job_number : ''}</span>
                                        </div>
                                    </div>
                                    <div class="data-v-col">
                                        <div class="view-text-value">
                                            <label>Site Contact Name</label>
                                            <span>{job ? job.site_contact_name ? job.site_contact_name : '' : initialJob && initialJob.site_contact_name ? initialJob.site_contact_name : ''}</span>
                                        </div>
                                    </div>
                                    <div class="data-v-col">
                                        <div class="view-text-value">
                                            <label>Site Contact Number</label>
                                            <span>{job ? job.site_contact_number ? job.site_contact_number : '' : initialJob && initialJob.site_contact_number ? initialJob.site_contact_number : ''}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Staff Timesheet */}
                        <form onSubmit={handleSubmit(this.handleTimesheetSubmit)}>
                            <div className="sf-card  mt-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">Staff Timesheet</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="ts-select-date">
                                    <button className="ts-nav-arrow left-arrow" onClick={this.handlePreviousSheet}>
                                        <i className="material-icons">keyboard_arrow_left</i>
                                    </button>

                                    <label>{timeSheetList
                                        && timeSheetList.staff_timesheet
                                        && timeSheetList.staff_timesheet.length > 0 && timeSheetList.staff_timesheet[this.state.timeSheetIndex].date
                                        ? moment(timeSheetList.staff_timesheet[this.state.timeSheetIndex].date).format('dddd DD MMM YYYY')
                                        : ''} </label>
                                    <button className="ts-nav-arrow right-arrow" onClick={this.handleNextSheet} >
                                        <i className="material-icons">keyboard_arrow_right</i>
                                    </button>
                                </div>
                                <div className="sf-card-body mt-2">
                                    <div className="staff-timesheet-table">
                                        <ScrollArea className="sf-scroll-width" // swapWheelAxes={true}
                                            speed={1} smoothScrolling={true} vertical={false}>
                                            <div className="sf-c-table org-user-table mb-0">
                                                <div className="tr">
                                                    <span className="th">Name</span>
                                                    <span className="th">Position</span>
                                                    <span className="th">Start Time</span>
                                                    <span className="th">End Time</span>
                                                    <span className="th">Break</span>
                                                    <span className="th">Comments</span>
                                                    <span className="th"></span>
                                                </div>
                                                {timeSheetList && timeSheetList.staff_timesheet && timeSheetList.staff_timesheet.length > 0 && timeSheetList.staff_timesheet[this.state.timeSheetIndex] && timeSheetList.staff_timesheet[this.state.timeSheetIndex].staff_timesheet && timeSheetList.staff_timesheet[this.state.timeSheetIndex].staff_timesheet.length > 0 ? timeSheetList.staff_timesheet[this.state.timeSheetIndex].staff_timesheet.map((timeSheet, index) => {
                                                    var inline = this.state.inlineTimeSheet.findIndex(id => id === timeSheet.id);
                                                    if (inline !== -1) {
                                                        return <UpdateSingleTimeSheet
                                                            form={'updateSingleTimesheet' + timeSheet.id} initialValues={timeSheet}
                                                            removeInlineTimeSheet={this.removeInlineTimeSheet} />
                                                    }
                                                    return (
                                                        <div className="tr">
                                                            <span className="td">{timeSheet && timeSheet.staff_name ? timeSheet.staff_name : ''}</span>
                                                            <span className="td">{timeSheet && timeSheet.position ? timeSheet.position : ''}</span>
                                                            <span className="td">{timeSheet && timeSheet.start_time ? timeSheet.start_time : ''}</span>
                                                            <span className="td">{timeSheet && timeSheet.stop_time ? timeSheet.stop_time : ''}</span>
                                                            <span className="td">{timeSheet && timeSheet.break_time ? timeSheet.break_time : ''}</span>
                                                            <span className="td">{timeSheet && timeSheet.comment ? timeSheet.comment : ''}</span>
                                                            <span className="td">
                                                                {timeSheetList && timeSheetList.job && timeSheetList.job.timesheet_approval_status == 1 ? null : <>
                                                                    <button class="delete-bnt" type="button" onClick={() => this.handleTimeSheetClick(timeSheet)}>
                                                                        <i class="material-icons">create</i></button>
                                                                    <button className='delete-bnt' type='button' onClick={() => this.deleteTimeSheetStff(timeSheet.user_name, timeSheet.id, timeSheet.job_id)}>
                                                                        <i class="fa fa-trash-o"></i></button>
                                                                </>
                                                                }
                                                            </span>
                                                        </div>
                                                    )
                                                }) : ''}
                                            </div>
                                            <FieldArray name="timeSheetList" component={this.renderMembers} />
                                        </ScrollArea>
                                    </div>
                                </div>
                            </div>

                            {/* save timeSheets button */}
                            <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                                <div className="btn-hs-icon">
                                    <button className="bnt bnt-normal" type="submit" disabled={timeSheetList && timeSheetList.job && timeSheetList.job.timesheet_approval_status == 1}>
                                        Save Timesheet</button>
                                </div>
                                <div className="btn-hs-icon">
                                    <button type="button" disabled={timeSheetList && timeSheetList.job && timeSheetList.job.timesheet_approval_status == 1} className="bnt bnt-active" onClick={this.handleApproveTimesheet}>
                                        Approve Timesheet</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Right Section */}
                <div className="col-lg-4 col-md-12">
                    <div className="sf-card">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h4 className="sf-sm-hd sf-pg-heading">View & Approve Job Report</h4>
                        </div>
                        <div className="sf-card-body mt-2">
                            <div className="ts-report-list">
                                <div className="ts-report-items">
                                    <h2>Hazard Report</h2>
                                    <ul className="crt-licence-lists">
                                        {allHazardReportsByJob && allHazardReportsByJob.length > 0 ? allHazardReportsByJob.map(haazard =>
                                            <li>
                                                <a onClick={() => this.downloadHazardReport(haazard.id)}>
                                                    <i className="material-icons">get_app</i>
                                                    {haazard && haazard.description ? haazard.description : ''}</a>
                                            </li>

                                        ) : ''}
                                    </ul>
                                </div>
                                <div className="ts-report-items">
                                    <h2>Incident Report</h2>
                                    <ul className="crt-licence-lists">
                                        {allIncidentReportsByJob && allIncidentReportsByJob.length > 0 ? allIncidentReportsByJob.map(incident =>
                                            <li>
                                                <a onClick={() => this.downloadIncidentReport(incident.id)}><i className="material-icons">get_app</i>
                                                    {incident && incident.description ? incident.description : ''}</a>
                                            </li>
                                        ) : ''}
                                    </ul>
                                </div>
                                <div className="ts-report-items">
                                    <h2>Job Report</h2>
                                    <ul className="crt-licence-lists">
                                        <li>
                                            <button className="normal-bnt" onClick={this.downloadJobReport}><i className="sficon sf-business-report"></i>
                                                Job Report #{job && job.job_number}</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <div className="all-btn multibnt mt-4">
                                <div className="btn-hs-icon d-flex justify-content-between">
                                    <button type="button" disabled={!timeSheetList.job || !timeSheetList.job.timesheet_approval_status || timeSheetList.job.completed_job_reports_approval_status == 1} onClick={this.approveJobReport} className="bnt bnt-active">
                                        Approve Job Reports</button>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="sf-card mt-4">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h4 className="sf-sm-hd sf-pg-heading">Invoices</h4>
                        </div>
                        <div className="sf-card-body mt-2">
                            <div className="ts-report-list">
                                <ul className="crt-licence-lists">
                                    {this.props.invoices && this.props.invoices.map(invoice =>
                                        <li>
                                            <a href={invoice.s3FileUrl} download={invoice.invoice_file} target='_blank'><i className="sficon sf-invoice"></i>
                                                Invoice {invoice.job_number} </a>
                                        </li>
                                    )}
                                </ul>
                            </div>
                            <div className="all-btn multibnt mt-4">
                                <div className="btn-hs-icon d-flex justify-content-between">
                                    <button type="button" className="bnt bnt-active"
                                        disabled={!timeSheetList.job || !timeSheetList.job.completed_job_reports_approval_status || this.props.invoices.length !== 0}
                                        onClick={this.showGenerateInvoiceModal}>
                                        View And generate invoice</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Modal
                    title="Basic Modal"
                    visible={this.state.visible}
                    onOk={this.handleOk}
                    // footer={null}
                    okText='Save and download Invoice'
                    width="100%"
                    className="job-doc-preview"
                    onCancel={this.handleCancel}
                >
                    <ViewInvoice invoiceDetails={this.props.invoiceDetails} />

                </Modal>

            </div>

        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        timeSheetList: state.timeSheet.timeSheetList,
        allIncidentReportsByJob: state.sAIncidentManagement.allIncidentReportsByJob,
        allHazardReportsByJob: state.sAIncidentManagement.allHazardReportsByJob,
        incidentReportDetails: state.sAIncidentManagement.incidentReportDetails,
        hazardReportDetails: state.sAIncidentManagement.hazardReportDetails,
        formValues: state.form.showTimeSheet && state.form.showTimeSheet.values ? state.form.showTimeSheet.values : {},
        jobDetails: state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] ?
            state.sAJobMgmt.jobDetails.job_details[0] : {},
        jobReports: state.sAJobMgmt.jobReports,
        filePath: state.sAJobMgmt.filePath,
        usersList: state.organizationUsers.users,
        incidentCategories: state.sAIncidentManagement.incidentCategories,
        riskControls: state.sAIncidentManagement.riskControls,
        hazardDetails: state.sAIncidentManagement.hazardDetails,
        invoiceDetails: state.invoice.invoiceDetails,
        invoices: state.timeSheet.invoices
    }
}

const mapDispatchToprops = dispatch => ({
    timeSheetAction: bindActionCreators(timeSheetAction, dispatch),
    invoiceAction: bindActionCreators(invoiceAction, dispatch),
    SAIncidentReportAction: bindActionCreators(SAIncidentReportAction, dispatch),
    sAJobMgmtAction: bindActionCreators(sAJobMgmtAction, dispatch),
    orgUserActions: bindActionCreators(orgUserActions, dispatch)
})

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'showTimeSheet', validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(ShowTimeSheet)
