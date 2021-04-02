import React from 'react';
import { Icon, Modal, Collapse, Radio, TimePicker, Dropdown, notification, Tooltip } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FormSection, FieldArray } from 'redux-form';
import moment from 'moment';
import $ from 'jquery';

import { CustomCheckbox } from '../../common/customCheckbox';

import * as actions from '../../../actions/roleManagementActions';
import * as accessControlAction from '../../../actions/accessControlManagementAction';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, GET_JOB_DOCUMENTS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { goBack, modifyObject, currencyFormat, handleFocus, goBackBrowser } from '../../../utils/common';
import { getStorage } from '../../../utils/common';
import * as sAJobMgmtAction from '../../../actions/SAJobMgmtAction';
import * as swmsAction from '../../../actions/SWMSAction';
import * as saJobCalender from '../../../actions/serviceAgentJobCalendarActions';
import * as jobDocAction from '../../../actions/jobDocAction';
import * as userAction from '../../../actions/organizationUserAction';
import { BASE_SCOPE_API_URL } from '../../../dataProvider/env.config'
import * as jobManagerAction from '../../../actions/jobMangerAction'

import AddSWMSForm from '../scope-doc/SWMS/AddSWMSForm';
import AddPPEForm from '../scope-doc/SWMS/AddPPEForm';
import AddToolTypeForm from '../scope-doc/SWMS/AddToolTypeForm';
import AddHRWForm from '../scope-doc/SWMS/AddHRWForm';
import AddChemicalForm from '../scope-doc/SWMS/AddChemicalForm';
import ShiftUpdate from './shiftUpdate';
import AddShift from './addShift';
import AddSiteNameNumberForm from './AddSiteNameNumberForm';
import UserLicienceView from './userLicienceView';
import { CustomTimePicker } from '../../common/customTimePicker';
import TaskFileViews from './taskFilesView';
import { pdf } from '@react-pdf/renderer';
import SignSWMSPdf from "../serviceAgentJobMgmt/signSWMS/SignSWMSPdf";
import JobReportPdf from "../serviceAgentJobMgmt/jobReport/JobReportPdf";
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { DeepTrim } from '../../../utils/common';
import AddJobNotes from './AddJobNotes';
import ReactHtmlParser from 'react-html-parser';
import AddNotes from '../scope-doc/AddNewScopeDoc/AddNotes';
import ViewToolboxTalk from './ToolBoxTalk.js/viewToolboxTalk';


const mapRouteToTitle = {
    '/dashboard/rolesmanagement/createRole': Strings.add_role_title
}
const { Panel } = Collapse;

class acceptedJobDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            togleSearch: true,
            visible: false,
            visibleAddPPE: false,
            visibleToolType: false,
            visibleHRS: false,
            visibleSDS: false,
            editShift: false,
            editShiftIndex: -1,
            shiftId: -1,
            addShift: false,
            editShiftForm: true,
            taskIndex: -1,
            handleSiteContact: false,
            handleSiteContactType: '',
            userSiteTime: false,
            selectedUserName: "",
            viewUserLicience: false,
            viewTaskFiles: false,
            taskFiles: [],
            job_number: '',
            uploadLoader: false,
            startYardType: '',
            staffStartTime: '',
            jobOrgId: '',
            jobId: '',
            currentShift: [],
            editShiftFlag: true
        }

        const restartJobAccess = JSON.parse(getStorage(ACCESS_CONTROL))
        this.hasRestartAccess = restartJobAccess && restartJobAccess.job_management && restartJobAccess.job_management.permissions && restartJobAccess.job_management.permissions.findIndex(permission => permission.control_name === 'sf_restart_job_controller_restart_job');

        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.loginUserName = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
            (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : '';
        this.loginUserRoleName = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).role.role_name : null;
    }

    componentDidMount() {
        if (this.props.location && this.props.location.state && this.props.location.state.jobNo) {
            this.props.sAJobMgmtAction.getJobDetails(this.props.location.state.jobNo).then(res => {
                if (res && res.job_details && res.job_details.length > 0 && res.job_details[0].job_number) {
                    this.setState({ job_number: res.job_details[0].job_number })
                }
                if (res && res.job_details && res.job_details.length > 0 && res.job_details[0].org_id && res.job_details[0].id) {
                    let organisation_id = res.job_details[0].org_id;
                    let job_id = res.job_details[0].id;
                    this.setState({ jobId: job_id, jobOrgId: organisation_id });
                    this.props.swmsAction.getJobSWMSByOrgIdAndJobId(organisation_id, job_id);
                    /* Get Tool Box talk */
                    this.props.swmsAction.getJobToolbox(job_id);


                }
            });
        }
        this.props.saJobCalender.getSupervisorsList();
        this.props.saJobCalender.getSiteSupervisorsList();
        this.props.jobDocAction.getServiceAgentAllStaff(this.currentOrganization);

        /* for download of swms */
        this.props.sAJobMgmtAction.getSWMSSignDetails(this.props.location.state.jobNo);
        this.props.userAction.getOrganizationUsers(JSON.parse(getStorage(ADMIN_DETAILS)) ?
            JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null);

        /* for job report */
        this.props.sAJobMgmtAction.getJobReport(undefined, this.props.location.state.jobNo);
    }


    handleAddSWMS = () => {
        this.setState({ visible: true });
    }

    handleAddPPE = () => {
        this.setState({ visibleAddPPE: true });
    }

    handleToolType = () => {
        this.setState({ visibleToolType: true });
    }

    handleHighRiskWork = () => {
        this.setState({ visibleHRS: true });
    }

    handleSDS = () => {
        this.setState({ visibleSDS: true });
    }

    handleHazardReportClick = () => {
        this.props.history.push({
            pathname: '/dashboard/add-hazard-report',
            job_id: this.props.jobDetails.job_details[0].id,

        })
    }

    handleIncidentReportClick = () => {
        if (this.props.jobDetails && this.props.jobDetails.job_details && this.props.jobDetails.job_details[0]) {
            this.props.history.push({
                pathname: '/dashboard/add-incident-report',
                job_id: this.props.jobDetails.job_details[0].id
            })
        }
    }



    downloadJocDoc = () => {
        const job_id = this.props.jobDetails.job_details[0].id
        this.props.jobDocAction.getJobDocument(job_id)
            .then(res => {
                const url = res.job_document_zip_file
                if (url) {
                    // //////////////for downloading///////////////////////
                    const a = document.createElement('a');
                    a.style.display = 'none';
                    a.href = url;
                    // the filename you want
                    a.download = `JobDoc_${job_id}.zip`;
                    document.body.appendChild(a);
                    a.click();
                    window.URL.revokeObjectURL(url);
                    // /////////////////////////
                }
            }).catch(error => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.error_title,
                    description: error ? error : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                })
            })
    }


    handleCancel = e => {
        this.setState({
            visible: false,
            visibleAddPPE: false,
            visibleToolType: false,
            visibleHRS: false,
            visibleSDS: false,
            handleSiteContact: false,
            handleSiteContactType: '',
            viewUserLicience: false,
            viewTaskFiles: false,
            taskFiles: [],
            uploadLoader: false,
            ViewToolboxTalk: false,

        });
    };

    ViewToolboxTalk = () => {

        const viewToolbox = (toolbox) => {
            this.props.swmsAction.getJobToolboxDetail(this.props.jobDetails.job_details[0].id, toolbox.id).
                then(() => this.setState({
                    ViewToolboxTalk: true,
                    toolboxTalk: toolbox,
                    toolBoxDetails: {
                        ...this.props.jobToolBoxTalkDetail, toolbox_talk_items: (
                            this.props.jobToolBoxTalkDetail && this.props.jobToolBoxTalkDetail.toolbox_talk_items &&
                                this.props.jobToolBoxTalkDetail.toolbox_talk_items.length == toolbox.toolbox_talk_items.length ?
                                this.props.jobToolBoxTalkDetail.toolbox_talk_items :
                                toolbox.toolbox_talk_items.map(tool => ({ toolbox_talk_item_id: tool.id }))
                        )
                    }
                }))

        };
        Modal.info({
            title: 'View Toolbox talks',
            content: (
                <div className="tbtf-list">
                    {
                        this.props.jobToolBoxTalk && this.props.jobToolBoxTalk.map(toolbox =>
                            <button className="normal-bnt"
                                onClick={() => viewToolbox(toolbox)}>{toolbox.toolbox_name}</button>
                        )
                    }
                </div>
            ),
        })
    };

    handleShiftEdit = (shift, index) => {
        this.setState({ editShift: true, editShiftIndex: index, shiftId: shift.id, editShiftForm: true })
    }

    handleAddShiftForm = () => {
        this.setState({ addShift: false })
    }

    addShift = () => {
        this.setState({ addShift: true });
    }

    handleEditShiftForm = () => {
        this.setState({ editShiftForm: false });
    }

    onUpdateSWMS = async (formData) => {
        formData = await DeepTrim(formData);

        var swms_document = [];
        for (let key in formData) {
            var taskObj = {};
            let taskIds = key.split('_');
            let task_id = parseInt(taskIds[1])
            taskObj.task_id = task_id;
            for (let area_key in formData[key]) {
                let areaIds = area_key.split('_');
                taskObj.area_id = parseInt(areaIds[1]);
                var swms_id = [];
                var ppe_id = [];
                var tool_id = [];
                var high_risk_work_id = [];
                var sds_id = [];
                for (let swms_key in formData[key][area_key]) {
                    if (swms_key === "swms") {
                        for (let swms in formData[key][area_key][swms_key]) {
                            let swmsIds = swms.split('_');
                            if (formData[key][area_key][swms_key][swms]) {
                                swms_id.push(swmsIds[1]);
                            }
                        }
                        taskObj.swms_id = swms_id;
                    }
                    if (swms_key === "ppe") {
                        for (let ppe in formData[key][area_key][swms_key]) {
                            let ppeIds = ppe.split('_');
                            if (formData[key][area_key][swms_key][ppe]) {
                                ppe_id.push(ppeIds[1]);
                            }
                        }
                        taskObj.ppe_id = ppe_id;
                    }
                    if (swms_key === "tool") {
                        for (let tool in formData[key][area_key][swms_key]) {
                            let toolIds = tool.split('_');
                            if (formData[key][area_key][swms_key][tool]) {
                                tool_id.push(toolIds[1]);
                            }
                        }
                        taskObj.tool_id = tool_id;
                    }
                    if (swms_key === "hrw") {
                        for (let hrw in formData[key][area_key][swms_key]) {
                            let hrwIds = hrw.split('_');
                            if (formData[key][area_key][swms_key][hrw]) {
                                high_risk_work_id.push(hrwIds[1]);
                            }
                        }
                        taskObj.high_risk_work_id = high_risk_work_id;
                    }
                    if (swms_key === "sds") {
                        for (let sds in formData[key][area_key][swms_key]) {
                            let sdsIds = sds.split('_');
                            if (formData[key][area_key][swms_key][sds]) {
                                sds_id.push(sdsIds[1]);
                            }
                        }
                        taskObj.sds_id = sds_id;
                    }
                }
            }
            swms_document.push(taskObj);
        }

        this.props.swmsAction.addSWMStoTask({ swms_document: JSON.stringify(swms_document), org_id: this.state.jobOrgId, job_id: this.state.jobId })
            .then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                });
                this.props.sAJobMgmtAction.getJobDetails(this.state.job_number);
            }).catch((message) => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }

    handleShiftDelete = (shift_id, job_number) => {
        Modal.confirm({
            title: "Delete Shift",
            content: "Do you wants to delete this Shift",
            onOk: () => this.handdleDeleteShiftOk(shift_id, job_number),
            cancelText: "Cancel",
        });
    }

    handdleDeleteShiftOk = (shift_id, job_number) => {
        this.props.sAJobMgmtAction.deleteJobScheduleShift(shift_id, job_number).then((message) => {
            notification.success({
                message: Strings.success_title,
                description: message,
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

    handleAddSiteNameNumber = (type) => {
        if (type === "ponumber") {
            this.setState({ handleSiteContact: true, handleSiteContactType: "ponumber" })
        }
        if (type === "name") {
            this.setState({ handleSiteContact: true, handleSiteContactType: "name" })
        }
    }

    onSiteTimeChange = (time) => {
        this.props.change(`site_time`, moment(time).format('HH:mm:ss'))
    }

    handleUserLicienceView = (user_name) => {
        if (user_name) {
            this.props.sAJobMgmtAction.getSingleUserLicences(user_name);
        }
        this.setState({ viewUserLicience: true });
    }

    handleTaskFileView = (files) => {
        if (files && files.length > 0) {
            this.setState({
                viewTaskFiles: true, taskFiles: files
            });
        }
    }

    toggleLoader = () => {
        this.setState({ uploadLoader: !this.state.uploadLoader });
    }

    printDocument = () => {
        this.toggleLoader();

        const jobNumber = this.props.jobDetails && this.props.jobDetails.job_details && this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].job_number;
        const fileUrl = this.props.jobDetails && this.props.jobDetails.job_details && this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].job_swms_sign_pdf;

        if (fileUrl) {
            fetch(fileUrl)
                .then(response => {
                    response.blob()
                        .then(blob => {
                            let url = window.URL.createObjectURL(blob);
                            let a = document.createElement('a');
                            a.href = url;
                            a.download = `job_swms_${jobNumber}.pdf`;
                            a.click();
                        })
                        .then(() => this.toggleLoader());
                });
        } else {
            const { jobDetails, swmsSignDetails, taskSWMS, swmsDoc } = this.props;
            this.toggleLoader();
            var obj = pdf(<SignSWMSPdf jobDetails={jobDetails.job_details && jobDetails.job_details[0] ?
                jobDetails.job_details[0] : {}} swmsSignDetails={swmsSignDetails} taskSWMS={taskSWMS} swmsDoc={swmsDoc} />).toBlob();
            obj.then((blob) => {
                var url = URL.createObjectURL(blob);
                //////////////for downloading///////////////////////
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = `jobReport_${jobDetails.job_details && jobDetails.job_details[0] ?
                    jobDetails.job_details[0].job_number : ""}.pdf`;
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
    }

    downloadJobReport = () => {
        this.toggleLoader();

        const jobNumber = this.props.jobDetails && this.props.jobDetails.job_details && this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].job_number;
        const fileUrl = this.props.jobDetails && this.props.jobDetails.job_details && this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].job_sheet_sign_pdf;

        if (fileUrl) {
            fetch(fileUrl)
            .then(response => {
                response.blob()
                    .then(blob => {
                        let url = window.URL.createObjectURL(blob);
                        let a = document.createElement('a');
                        a.href = url;
                        a.download = `job_report_${jobNumber}.pdf`;
                        a.click();
                    })
                    .then(() => this.toggleLoader());
            })
            .catch(err => {
                notification.error({
                    message: Strings.error_title,
                    description: 'message && message.message ? message.message : Strings.generic_error',
                    onClick: () => { },
                    className: 'ant-error'
                });
            })
        } else {
            const { jobDetails } = this.props;
            this.toggleLoader();
            var obj = pdf(<JobReportPdf job={jobDetails.job_details && jobDetails.job_details[0] ?
                jobDetails.job_details[0] : {}} jobReports={this.props.jobReports} filePath={this.props.filePath} />).toBlob();
            obj.then((blob) => {
                var url = URL.createObjectURL(blob);
                //////////////for downloading///////////////////////
                const a = document.createElement('a');
                a.style.display = 'none';
                a.href = url;
                // the filename you want
                a.download = `jobReport_${this.props.jobDetails.job_details && this.props.jobDetails.job_details[0] ?
                    this.props.jobDetails.job_details[0].job_number : ""}.pdf`;
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

    updateJobStatus = (job, status) => {
        this.props.jobManagerAction.updateJobStatus({
            job_number: job.job_number,
            job_status: status,
            job_id: job.id,
        })
            .then((flag) => {
                this.props.sAJobMgmtAction.getJobDetails(this.props.location.state.jobNo)
            })
            .catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }

    onChangeStaffStartYardTime = (event, user_name, shiftId) => {
        if (event.target.value) {
            this.setState({
                startYardType: `${event.target.value}`
            });
            this.props.change(`${shiftId}_${user_name}_siteYard`, event.target.value);
            let startType = event.target.value.split('_');
            if (startType && startType.length > 0 && startType[2]) {
                if (this.state.currentShift.id == shiftId) {
                    let shiftDetails = this.state.currentShift;
                    shiftDetails.job_allocated_users.map(user => {
                        if (user && user.user_name == user_name) {
                            user.start_time_type = startType[2];
                        }
                    })
                    this.setState({ currentShift: shiftDetails });
                }
            }
        }
    }

    onChangeStaffStartTime = (value, shiftId, user_name) => {
        var start_time = moment(value).format("HH:mm:ss");
        this.setState({ staffStartTime: start_time });
        if (this.state.currentShift.id == shiftId) {
            let shiftDetails = this.state.currentShift;
            shiftDetails.job_allocated_users.map(user => {
                if (user && user.user_name == user_name) {
                    user.start_time = start_time;
                }
            })
            this.setState({ currentShift: shiftDetails });
        }
    }

    handleEditStaffStartTime = (shift) => {
        this.setState({ currentShift: shift, shiftId: shift.id, editShiftFlag: false });
    }

    customRadioButton = (user_name, shiftId) => {
        return <Radio.Group onChange={(value) => this.onChangeStaffStartYardTime(value, user_name, shiftId)} value={`${this.props.formValues[`${shiftId}_${user_name}_siteYard`]}`}>
            <Radio value={`${shiftId}_${user_name}_yard`}></Radio>
            <Radio value={`${shiftId}_${user_name}_site`}></Radio>
        </Radio.Group>
    }

    handleSaveStaffStartTime = (shiftId) => {
        if (this.state.currentShift.id == shiftId) {
            var finalFormData = {};
            if (this.props.jobDetails && this.props.jobDetails.job_details && this.props.jobDetails.job_details.length > 0 && this.props.jobDetails.job_details[0].id) {
                finalFormData.job_id = this.props.jobDetails.job_details[0].id;
                finalFormData.job_number = this.props.jobDetails.job_details[0].job_number;
            }
            finalFormData.job_schedule_shift_id = shiftId;
            if (this.state.currentShift.job_allocated_users) {
                finalFormData.users = this.state.currentShift.job_allocated_users;
            }
            this.props.sAJobMgmtAction.updateUserSiteTime(finalFormData).then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                });
                this.setState({ editShiftFlag: true })
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message && message.message ? message.message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
        }
    }

    handleRestartJob = () => {
        // console.log(this.props.jobDetails.job_details[0]);
        const jobId = this.props.jobDetails.job_details[0].id;
        this.props.jobManagerAction.restartJob(jobId)
            .then(res => {
                this.props.sAJobMgmtAction.getJobDetails(this.state.job_number)
            })
            .catch(err => {

            });
    }

    sendNotification = () => {
        let jobDetails = this.props.jobDetails
        if (jobDetails && jobDetails.job_details
            && jobDetails.job_details.length > 0
            && jobDetails.job_details[0] && jobDetails.job_details[0].job_schedules
            && jobDetails.job_details[0].job_schedules.length > 0) {
            let formData = [];
            jobDetails.job_details[0].job_schedules.map(job_schedule => {
                if (job_schedule && job_schedule.job_schedule_shifts && job_schedule.job_schedule_shifts.length > 0) {
                    job_schedule.job_schedule_shifts.map((shift) => {
                        let shiftData = {
                            id: shift && shift.id ? shift.id : null,
                            supervisor_id: shift && shift.supervisor && shift.supervisor.user_name ? shift.supervisor.user_name : null,
                            site_supervisor_id: shift && shift.site_supervisor && shift.site_supervisor.user_name ? shift.site_supervisor.user_name : null
                        }
                        if (shift && shift.job_allocated_users && shift.job_allocated_users.length > 0) {
                            let staff = [];
                            shift.job_allocated_users.map(user => {
                                if (user.user_name && user.notification_send_status == 0) {
                                    staff.push({ user_name: user.user_name });
                                }
                            })
                            shiftData['staff'] = staff;
                        }
                        formData.push(shiftData);
                    })
                }
            })
            // call api for send notification to staff and supervisor and site supervisor
            this.props.jobManagerAction.sendJobNotificationStatus({ job_schedule: formData })
                .then((message) => {
                    notification.success({
                        message: Strings.success_title,
                        description: message,
                        onClick: () => { },
                        className: 'ant-success'
                    });
                    this.props.sAJobMgmtAction.getJobDetails(this.props.location.state.jobNo)
                })
                .catch((message) => {
                    notification.error({
                        message: Strings.error_title,
                        description: message ? message : Strings.generic_error,
                        onClick: () => { },
                        className: 'ant-error'
                    });
                });
        }
    }

    render() {
        let { jobDetails, orgSWMS, handleSubmit } = this.props;
        var jobNumber = jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_number ? jobDetails.job_details[0].job_number : '';
        var jobId = jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].id ? jobDetails.job_details[0].id : '';
        var jobOrgId = jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].org_id ? jobDetails.job_details[0].org_id : '';

        console.log('JD', jobDetails)

        return (
            <div className="sf-page-layout">
                {this.state.uploadLoader ?
                    this.profileLoaderView
                    : null
                }
                {/* inner header  */}
                <div className="dash-header">
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() =>
                            // goBack(this.props)
                            goBackBrowser(this.props)
                        } />
                        {
                            mapRouteToTitle[this.props.location.pathname]
                                ? mapRouteToTitle[this.props.location.pathname]
                                : Strings.job_details_txt
                        }
                    </h2>
                </div>
                {/* inner header  */}
                {/* ======= For:: Job Details View and Edit ::  ======== */}
                <div className="main-container">
                    <div className="row">
                        <div className="col-md-10 job-reports-wrap">
                            <div className="sf-card-wrap">
                                <div className="sf-card scope-v-value">
                                    <div className="sf-card-head d-flex align-items-center edit-jdls">
                                        <strong className="doc-v-usr"><span>{this.loginUserRoleName} : </span>{this.loginUserName}</strong>
                                        <button type="button" className="normal-bnt" type="button"><i class="fa fa-pencil-square-o"></i></button>
                                    </div>
                                </div>
                                <div className="sf-card mt-4">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">{Strings.job_details_txt}</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="sf-card-body">
                                        <div className="row justify-content-between">
                                            <div className="col-md-8">
                                                <div className="data-v-row">
                                                    <div className="data-v-col">
                                                        <div className="view-text-value">
                                                            <label>{Strings.job_site_contact_name_number}</label>
                                                            <span className="edit-bnt">
                                                                {jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].contact_name && jobDetails.job_details[0].contact_number ? jobDetails.job_details[0].contact_name + "/" + jobDetails.job_details[0].contact_number :
                                                                    jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                                        && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ?
                                                                        <button className="normal-bnt " type="button" onClick={() => this.handleAddSiteNameNumber("name")} disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>Add Name / Number</button> : null}
                                                            </span>
                                                        </div>
                                                    </div>
                                                    <div className="data-v-col">
                                                        <div className="view-text-value">
                                                            <label>{Strings.job_purchase_order_number}</label>
                                                            <span className="edit-bnt">{jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].po_number ? jobDetails.job_details[0].po_number :
                                                                jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                                    && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ?
                                                                    <button className="normal-bnt " type="button" onClick={() => this.handleAddSiteNameNumber("ponumber")} disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>Add PO Number</button> : null}</span>
                                                        </div>
                                                    </div>
                                                    <div className="data-v-col">
                                                        <div className="view-text-value">
                                                            <label>{Strings.job_approval_status}</label>
                                                            <span> {jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].quote && jobDetails.job_details[0].quote.admin_approve_status === 1 ? Strings.job_approved_admin : ''} </span>
                                                        </div>
                                                    </div>
                                                    <div className="data-v-col">
                                                        <div className="view-text-value">
                                                            <label>{Strings.job_invoiced}</label>
                                                            <span>{jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].invoice_generated ? jobDetails.job_details[0].invoice_generated : ''}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            {jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ?
                                                <div className="job-status-time">
                                                    <i class="material-icons">timer</i>
                                                    <h4>Job Status</h4>
                                                    {jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status === 0 ?
                                                        <div className="job-action-area">
                                                            <label>Not Started</label>
                                                            <button type="button" className="bnt bnt-normal" onClick={() => this.updateJobStatus(jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0], 1)}>Start Job</button>
                                                        </div> : jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status === 1 ?
                                                            <div className="job-action-area">
                                                                <label className="job-stated">Started</label>
                                                                <button type="button" className="bnt bnt-normal" onClick={() => this.updateJobStatus(jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0], 3)}>Completed</button>
                                                                <button type="button" className="normal-bnt pause-job" onClick={() => this.updateJobStatus(jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0], 2)}>Pause Job</button>
                                                            </div> :
                                                            jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status === 2 || jobDetails.job_details[0].job_status === 4 ? <div className="job-action-area">
                                                                <label>Paused</label>
                                                                <button type="button" className="bnt bnt-normal" onClick={() => this.updateJobStatus(jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0], 1)}>Start Job</button>
                                                            </div> :
                                                                <div className="job-action-area">
                                                                    <label>Completed</label></div>
                                                    }
                                                    {/* <label>{jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status === 0 ? Strings.job_not_started : Strings.job_started}</label>
                                                <button type="button" className="bnt bnt-active">{jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status === 0 ? Strings.start_job : Strings.complete_job}</button> */}
                                                </div> : null}
                                        </div>
                                    </div>

                                </div>

                                {/* Service Details */}
                                <div className="sf-card mt-4">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">{Strings.job_service_details}</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    {jobDetails && jobDetails.job_details
                                        && jobDetails.job_details.length > 0
                                        && jobDetails.job_details[0].quote
                                        && jobDetails.job_details[0].quote.scope_doc
                                        && jobDetails.job_details[0].quote.scope_doc.scope_docs_sites
                                        && jobDetails.job_details[0].quote.scope_doc.scope_docs_sites.length > 0 ? jobDetails.job_details[0].quote.scope_doc.scope_docs_sites.map(site => {
                                            return <div className="sf-card-body">
                                                <div className="data-v-row">
                                                    {/* <div className="data-v-col">
                                                        <div className="view-text-value">
                                                            <label>{Strings.job_name}</label>
                                                            <span>{site && site.site && site.site.job_name ? site.site.job_name : ''}</span>
                                                        </div>
                                                    </div> */}
                                                    <div className="data-v-col">
                                                        <div className="view-text-value">
                                                            <label>{Strings.site_name}</label>
                                                            <span>{site && site.site && site.site.site_name ? site.site.site_name : ''}</span>
                                                        </div>
                                                    </div>
                                                    <div className="data-v-col">
                                                        <div className="view-text-value">
                                                            <label>{Strings.address_txt}</label>
                                                            <span>{site && site.site && site.site.street_address ? site.site.street_address : ''} {site.site.city ? site.site.city : ''} {site.site.state ? site.site.state : ''} {site.site.zip_code ? site.site.zip_code : ''}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="service-table"> {/* task details */}
                                                    {site && site.site && site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map(task => {
                                                        return <div className="sf-job-doc-bg sAgent-calnd-row">
                                                            <div className="data-v-row">
                                                                <div className="data-v-col">
                                                                    <div className="view-text-value">
                                                                        <label>{task && task.task_name ? task.task_name : ''}</label>
                                                                        <span>{task && task.description ? task.description : ''}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="data-v-col">
                                                                    <div className="view-text-value">
                                                                        <label>{Strings.area_txt}</label>
                                                                        <span>{task && task.areas && task.areas.length > 0 ? task.areas.map((area, index) => {
                                                                            return area && area.area_name ? task.areas.length - 1 === index ? area.area_name : area.area_name + ", " : ""
                                                                        }
                                                                        ) : ''}</span>
                                                                    </div>
                                                                </div>
                                                                <div className="data-v-col">
                                                                    <div className="view-text-value">
                                                                        <label>{Strings.job_id}</label>
                                                                        <span>{jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_number ? jobDetails.job_details[0].job_number : ''}</span>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                            <div className="jb-note-items">
                                                                <div className="data-v-row sAgent-note justify-content-between">
                                                                    <div className="data-v-col">
                                                                        <div className="view-text-value">
                                                                            <label>Notes</label>
                                                                            <span>{task && task.note ? task.note : ''}</span>
                                                                        </div>
                                                                    </div>
                                                                    {/* Image file check */}
                                                                    {task && task.file && task.file.length > 0 && task.file[0].file_url ?
                                                                        <div className="job-note-pic">
                                                                            <img onClick={() => this.handleTaskFileView(task.file)} src={task.file[0].file_url} alt="img" />
                                                                        </div> : null}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    }) : ''}
                                                </div>
                                            </div>
                                        }) : ''}
                                </div>

                                {/* SWMS */}
                                <div className="sf-card mt-4">
                                    <form onSubmit={handleSubmit(this.onUpdateSWMS)}>
                                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                            <h2 className="sf-pg-heading">{Strings.swms_txt}</h2>
                                            {jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ?
                                                <button type="submit" className="normal-bnt" disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}><i class="material-icons">autorenew</i> Update </button> : <div className="info-btn disable-dot-menu">
                                                    <Dropdown className="more-info" disabled>
                                                        <i className="material-icons">more_vert</i>
                                                    </Dropdown>
                                                </div>}
                                        </div>
                                        <div className="sf-card-body">
                                            <Collapse className="swms-content-list" defaultActiveKey={['0']}>
                                                {jobDetails && jobDetails.task_swms && jobDetails.task_swms.length > 0 ? jobDetails.task_swms.map((task_swms, index) => {
                                                    return <Panel className="swms-co-items" header={task_swms && task_swms.name ? task_swms.name : ''} key={index.toString()}>
                                                        <FormSection name={`task_${task_swms.id}`}>
                                                            <Collapse className="swms-content-list" defaultActiveKey={['0']}>
                                                                {task_swms && task_swms.areas && task_swms.areas.length > 0 ? task_swms.areas.map((area, index) => {
                                                                    return <Panel className="swms-co-items" header={area && area.area_name ? area.area_name : ''} key={index.toString()}>
                                                                        <FormSection name={`area_${area.area_id}`}>
                                                                            <table className="table swms-table">
                                                                                <tr>
                                                                                    <th>SWMS Activity</th>
                                                                                    <th>PPE</th>
                                                                                    <th>Tool Type</th>
                                                                                    <th>High Risk Work</th>
                                                                                    <th>Chemicals</th>
                                                                                </tr>

                                                                                <tr className="swms-sr-dtl has-checkbx">
                                                                                    <td>
                                                                                        {orgSWMS && orgSWMS.swms && orgSWMS.swms.length > 0 ? orgSWMS.swms.map(swms => {
                                                                                            return <FormSection name="swms"><div className="sm-chkbx">
                                                                                                <Field name={`swms_${swms && swms.id ? swms.id : ''}`} label={swms && swms.activity ? swms.activity : ''} component={CustomCheckbox} />
                                                                                            </div>
                                                                                            </FormSection>
                                                                                        }) : ''}
                                                                                    </td>
                                                                                    <td>
                                                                                        {orgSWMS && orgSWMS.ppes && orgSWMS.ppes.length > 0 ? orgSWMS.ppes.map(ppe => {
                                                                                            return <FormSection name="ppe"><div className="sm-chkbx">
                                                                                                <Field name={`ppe_${ppe && ppe.id ? ppe.id : ''}`} label={ppe && ppe.name ? ppe.name : ''} component={CustomCheckbox} />
                                                                                            </div>
                                                                                            </FormSection>
                                                                                        }) : ''}
                                                                                    </td>
                                                                                    <td>
                                                                                        {orgSWMS && orgSWMS.tools && orgSWMS.tools.length > 0 ? orgSWMS.tools.map(tool => {
                                                                                            return <FormSection name="tool"> <div className="sm-chkbx">
                                                                                                <Field name={`tool_${tool && tool.id ? tool.id : ''}`} label={tool && tool.name ? tool.name : ''} component={CustomCheckbox} />
                                                                                            </div>
                                                                                            </FormSection>
                                                                                        }) : ''}
                                                                                    </td>
                                                                                    <td>
                                                                                        {orgSWMS && orgSWMS.high_risk_works && orgSWMS.high_risk_works.length > 0 ? orgSWMS.high_risk_works.map(high_risk_work => {
                                                                                            return <FormSection name="hrw"><div className="sm-chkbx">
                                                                                                <Field name={`hrw_${high_risk_work && high_risk_work.id ? high_risk_work.id : ''}`} label={high_risk_work && high_risk_work.name ? high_risk_work.name : ''} component={CustomCheckbox} />
                                                                                            </div>
                                                                                            </FormSection>
                                                                                        }) : ''}
                                                                                    </td>
                                                                                    <td>
                                                                                        {orgSWMS && orgSWMS.sds && orgSWMS.sds.length > 0 ? orgSWMS.sds.map(sds => {
                                                                                            return <FormSection name="sds"> <div className="sm-chkbx">
                                                                                                <Field name={`sds_${sds && sds.id ? sds.id : ''}`} label={sds && sds.name ? sds.name : ''} component={CustomCheckbox} />
                                                                                            </div>
                                                                                            </FormSection>
                                                                                        }) : ''}
                                                                                    </td>
                                                                                </tr>
                                                                                {jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                                                    && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ?
                                                                                    <tr className="add-moreswms">
                                                                                        <td><label>
                                                                                            <button className="normal-bnt" onClick={this.handleAddSWMS} type="button" disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>
                                                                                                <i class="material-icons">add</i> {Strings.add_new_swms_document}</button></label>
                                                                                        </td>
                                                                                        <td><label>
                                                                                            <button className="normal-bnt" onClick={this.handleAddPPE} type="button" disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>
                                                                                                <i class="material-icons">add</i> Add new PPE</button></label>
                                                                                        </td>
                                                                                        <td><label>
                                                                                            <button className="normal-bnt" onClick={this.handleToolType} type="button" disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>
                                                                                                <i class="material-icons">add</i> Add new Tool Type</button></label>
                                                                                        </td>
                                                                                        <td><label>
                                                                                            <button className="normal-bnt" onClick={this.handleHighRiskWork} type="button" disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>
                                                                                                <i class="material-icons">add</i> Add new High Rish work</button></label>
                                                                                        </td>
                                                                                        <td><label>
                                                                                            <button className="normal-bnt" onClick={this.handleSDS} type="button" disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>
                                                                                                <i class="material-icons">add</i> Add new Chemical</button></label>
                                                                                        </td>
                                                                                    </tr> : null}

                                                                            </table>
                                                                        </FormSection>
                                                                    </Panel>
                                                                }) : ''}
                                                            </Collapse>
                                                        </FormSection>
                                                    </Panel>

                                                }) : ''}
                                            </Collapse>

                                        </div>
                                    </form>
                                </div>

                                {/* Toolbox Talk Checklist */}
                                {/* <div className="sf-card mt-4">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">Toolbox Talk Checklist</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="sf-card-body">
                                        <div className="ttlk-checklists">
                                            <button className="normal-bnt" onClick={this.ViewToolboxTalk}>Toolbox Talk Checklist</button>
                                            <button className="normal-bnt" onClick={this.ViewToolboxTalk}>Toolbox Talk Checklist</button>
                                            <button className="normal-bnt" onClick={this.ViewToolboxTalk}>Toolbox Talk Checklist</button>
                                        </div>
                                    </div>
                                </div> */}

                                {/* Allocated Budget (for above tasks) */}
                                <div className="sf-card mt-4">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">Allocated Budget (for above tasks)</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="sf-card-body">
                                        <div className="all-budget">
                                            <div className="budget-list">
                                                <b></b> {jobDetails && jobDetails.budget ? currencyFormat(jobDetails.budget) : 0}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Staff */}
                                <div className="sf-card mt-4">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">Staff</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="sf-card-body">
                                        <div className="sli-table-items jd-staff">
                                            <table className="table">
                                                <tbody>
                                                    <tr>
                                                        <th>Position</th>
                                                        <th>Name</th>
                                                        <th>Start Time</th>
                                                        <th>Mobile</th>
                                                        <th>Status</th>
                                                        <th>Licences</th>
                                                        <th>Yard</th>
                                                        <th>Site</th>
                                                        <th style={{ width: 30 }}></th>
                                                    </tr>
                                                    {jobDetails && jobDetails.job_details
                                                        && jobDetails.job_details.length > 0
                                                        && jobDetails.job_details[0] && jobDetails.job_details[0].job_schedules && jobDetails.job_details[0].job_schedules.length > 0 ? jobDetails.job_details[0].job_schedules.map((job_schedule, job_schedule_index) => {
                                                            return <>
                                                                {job_schedule && job_schedule.job_schedule_shifts && job_schedule.job_schedule_shifts.length > 0 ? job_schedule.job_schedule_shifts.map((shift, index) => {
                                                                    return <>
                                                                        <tr key={index} className="no-bg">
                                                                            <td colSpan="8" className="allsf-tt-dtls">
                                                                                <div className="d-flex justify-content-between py-2">
                                                                                    <div className="time-datails d-flex">
                                                                                        <h3>{shift && shift.shift && shift.shift == "N" ? "NIGHT" : "DAY "}{shift && shift.shift_date ? `(${moment(shift.shift_date).format('YYYY-MM-DD')})` : ''}</h3>
                                                                                        <div className="d-flex view-satff-time">
                                                                                            <span><strong>Yard Time:</strong> {shift && shift.yard_time ? moment(shift.yard_time, "HH:mm:ss").format("HH:mm:ss") : ""} </span>
                                                                                            <span><strong>Start Time:</strong>{shift && shift.site_time ? moment(shift.site_time, "HH:mm:ss").format("HH:mm:ss") : ""} </span>
                                                                                            <span><strong>Finish Time:</strong> {shift && shift.finish_time ? moment(shift.finish_time, "HH:mm:ss").format("HH:mm:ss") : ""} </span>
                                                                                        </div>
                                                                                    </div>
                                                                                    {jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                                                        && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ?
                                                                                        <div className="d-flex staff-actn">
                                                                                            <button className="normal-bnt" type="button" onClick={() => this.handleShiftEdit(shift, index)} disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}><i className="material-icons">create</i> Edit</button>
                                                                                            {this.state.shiftId == shift.id && this.state.editShiftFlag == false ? <button className="normal-bnt" type="button" onClick={() => this.handleSaveStaffStartTime(shift.id, index)} disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}><i class="fa fa-floppy-o"></i> Save Staff Start Time</button> : <button className="normal-bnt" type="button" onClick={() => this.handleEditStaffStartTime(shift)} disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}><i className="material-icons">create</i> Edit Staff Start Time</button>}
                                                                                            <button className="normal-bnt" type="button" onClick={() => this.handleShiftDelete(shift.id, jobNumber)} disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}> <i className="fa fa-trash-o"></i> Delete Shift</button>
                                                                                        </div> : null}
                                                                                </div>
                                                                            </td>
                                                                        </tr>
                                                                        {shift && shift.job_allocated_users && shift.job_allocated_users.length > 0 ? shift.job_allocated_users.map(user => {
                                                                            return <>{user ? <tr>
                                                                                <td>{user && user.role_name ? user.role_name : ''}</td>
                                                                                <td>{user && user.first_name ? user.first_name : ''}</td>
                                                                                <td>
                                                                                    <span className="edit-jdls d-flex align-items-center no-label">
                                                                                        {this.state.shiftId == shift.id && this.state.editShiftFlag == false ?
                                                                                            <>
                                                                                                <Field name={`${shift.id}_${user.user_name}_start_time`} onChange={(value) => this.onChangeStaffStartTime(value, shift.id, user.user_name)} component={CustomTimePicker} />
                                                                                            </> :
                                                                                            <>
                                                                                                {user && user.start_time ? moment(user.start_time, "HH:mm:ss").format("HH:mm:ss") : ''}
                                                                                            </>}
                                                                                    </span>
                                                                                </td>
                                                                                <td>{user && user.phone_number ? user.phone_number : ''}</td>
                                                                                <td>
                                                                                    <Tooltip title={user && user.job_shift_accept_status == 1 ? 'Accepted' : user.job_shift_accept_status == 2 ? 'Declined' : user.notification_send_status == 1 ? 'Send' : null}>  {user && user.job_shift_accept_status == 1 ? <i class="fa fa-check"></i> : user.job_shift_accept_status == 2 ? <i class="fa fa-times"></i> : user.notification_send_status == 1 ? <i class="fa fa-paper-plane"></i> : null}</Tooltip>
                                                                                </td>
                                                                                <td>
                                                                                    <button type="button" onClick={() => this.handleUserLicienceView(user.user_name)} className="normal-bnt"><i class="material-icons">remove_red_eye</i></button>
                                                                                </td>
                                                                                {this.state.shiftId == shift.id && this.state.editShiftFlag == false ?
                                                                                    <td colSpan="2">
                                                                                        <div className="yard-site-rd-bnt">
                                                                                            <Field
                                                                                                name={`${shift.id}_${user.user_name}_siteYard`}
                                                                                                component={() => this.customRadioButton(user.user_name, shift.id)}
                                                                                            />
                                                                                        </div>
                                                                                    </td> :
                                                                                    <>
                                                                                        <td><Radio name="yard" checked={user.start_time_type.toString() === "yard"}></Radio></td>
                                                                                        <td><Radio name="site" checked={user.start_time_type.toString() === "site"}></Radio></td>
                                                                                    </>
                                                                                }

                                                                                <td>
                                                                                </td>
                                                                            </tr> : ''}
                                                                            </>
                                                                        }) : ''}
                                                                        {this.state.editShift && this.state.editShiftIndex == index && this.state.shiftId == shift.id ? <ShiftUpdate shift={shift} visible={this.state.editShiftForm} handleEditShiftForm={this.handleEditShiftForm} job_number={jobNumber} jobId={jobId} /> : null}
                                                                    </>
                                                                }) : ''}
                                                            </>
                                                        }) : ''}

                                                    {/* Extend Job button */}
                                                    {jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                        && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ?
                                                        <tr>
                                                            <td className="align-right px-0" colSpan="8">
                                                                {this.state.addShift ? <div className="all-btn justify-content-end mt-3 sc-doc-bnt d-none">
                                                                    <div className="btn-hs-icon">
                                                                        <button type="button" className="bnt bnt-active" onClick={() => this.addShift()} disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>{Strings.extend_job_bnt}</button>
                                                                    </div>
                                                                    <div className="btn-hs-icon">
                                                                        <button type="button" className="bnt bnt-active" onClick={() => this.sendNotification()} disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>Send Notifications</button>
                                                                    </div>
                                                                </div> : <div className="all-btn d-flex justify-content-end sc-doc-bnt">
                                                                        <div className="btn-hs-icon">
                                                                            <button type="button" className="bnt bnt-active" onClick={() => this.addShift()} disabled={(jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3) ||
                                                                                (jobDetails && jobDetails.job_details && jobDetails.job_details[0] && jobDetails.job_details[0].job_schedules && jobDetails.job_details[0].job_schedules.length == 0)}>{Strings.extend_job_bnt}</button>
                                                                            <div className="btn-hs-icon">
                                                                                <button type="button" className="bnt bnt-active" onClick={() => this.sendNotification()} disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].job_status == 3}>Send Notifications</button>
                                                                            </div>
                                                                        </div>
                                                                    </div>}
                                                                {this.state.addShift ? <AddShift visible={this.state.addShift}
                                                                    handleAddShiftForm={this.handleAddShiftForm}
                                                                    job_number={jobNumber} jobId={jobId} /> : null}
                                                            </td>
                                                        </tr> : null}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                </div>

                                {/* Note */}
                                <div className="sf-card mt-4 sf-shadow">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">{Strings.note_txt}</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="sf-card-body">
                                        {jobDetails.job_notes ? jobDetails.job_notes.map((note_item) => (
                                            <div className="view-internal-note">
                                                <span>{ReactHtmlParser(note_item.note)}</span>
                                                <span className="note-dtls">{`By ${note_item.organisation_user.first_name}, ${moment(note_item.created_at).format('DD MMM YYYY')}`}</span>
                                            </div>
                                        )) : ''}
                                        <div className="int-notes">
                                            <FieldArray
                                                name="job_notes"
                                                isFromJobDetails
                                                reset={this.props.reset}
                                                // component={AddJobNotes}
                                                component={AddNotes}
                                                job_number={jobNumber}
                                                jobId={jobId}
                                                user_name={this.state.selectedUserName}
                                            />
                                        </div>
                                    </div>
                                </div>
                                {
                                    this.hasRestartAccess
                                        && jobDetails
                                        && jobDetails.job_details
                                        && jobDetails.job_details.length > 0
                                        && jobDetails.job_details[0]
                                        && jobDetails.job_details[0].job_status == 3
                                        /* jobDetails.job_details[0].completed_job_accept_status == 0 */
                                        ? (
                                            <div className="all-btn d-flex justify-content-end mt-4">
                                                <div className="btn-hs-icon">
                                                    <button onClick={this.handleRestartJob} className="bnt bnt-active">
                                                        {Strings.restart_job}
                                                    </button>
                                                </div>
                                            </div>
                                        )
                                        : null
                                }
                            </div>
                        </div>


                        {/* Right panel:  All Tools  */}
                        <div className="col-md-2 reports-tools">
                            <div className="sf-card sf-shadow">
                                <div className="sf-card-body px-0">
                                    <div className="jobs-detail-tools">
                                        <div className="tools-lists">
                                            <button className="tools-items normal-bnt color-1"
                                                disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                    && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ? false : true}
                                                onClick={() => this.props.history.push({ pathname: './SignSWMS', state: true })}>
                                                <i className="sficon sf-sign-swms"></i>
                                                <span>sign swms</span>
                                            </button>
                                            <button className="tools-items normal-bnt color-6" onClick={this.ViewToolboxTalk}>
                                                <i className="material-icons">settings_applications</i>
                                                <span>Toolbox Talks</span>
                                            </button>
                                            <button onClick={() => this.props.history.push('./sign-off-sheet')} className="tools-items normal-bnt color-2"
                                                disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                    && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ? false : true}>
                                                <i className="sficon sf-sign-off-sheet"></i>
                                                <span>Sign Off Sheet</span>
                                            </button>
                                            <button onClick={() => this.props.history.push('./jobReport')} className="tools-items normal-bnt color-3"
                                                disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                    && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ? false : true}>
                                                <i class="fa fa-wpforms"></i>
                                                <span>JOB REPORT</span>
                                            </button>
                                            <button onClick={this.handleHazardReportClick} className="tools-items normal-bnt color-4"
                                                disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                    && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ? false : true}>
                                                <i class="fa fa-scissors"></i>
                                                <span>HAZARD REPORT</span>
                                            </button>
                                            <button onClick={this.handleIncidentReportClick} className="tools-items normal-bnt color-5"
                                                disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                    && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ? false : true}>
                                                <i className="sficon sf-incident-report"></i>
                                                <span>INCIDENT REPORT</span>
                                            </button>
                                            <button type="button"
                                                disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                    && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ? false : true}
                                                onClick={() => this.props.history.push({ pathname: './time-sheets', state: jobDetails.job_details[0], isFromJobDetails: true })} className="tools-items normal-bnt color-6 brb-1">
                                                <i className="sficon sf-time-sheet"></i>
                                                <span>TIMESHEET</span>
                                            </button>
                                            <button type="button" onClick={this.downloadJocDoc} className="tools-items normal-bnt color-7 ">
                                                {/* <a href={`${BASE_SCOPE_API_URL}${GET_JOB_DOCUMENTS}?job_id=${this.props.jobDetails && this.props.jobDetails.job_details && this.props.jobDetails.job_details[0] && this.props.jobDetails.job_details[0].id}`} className="tools-items normal-bnt color-7"> */}
                                                <i className="material-icons">get_app</i>
                                                <span>JOB DOCUMENTATION</span>
                                                {/* </a> */}
                                            </button>
                                            <button className="tools-items normal-bnt color-8" onClick={this.downloadJobReport}>
                                                <i className="material-icons">get_app</i>
                                                <span>JOB Report</span>
                                            </button>
                                            <button className="tools-items normal-bnt color-1 brb-1" onClick={this.printDocument}>
                                                <i className="material-icons">get_app</i>
                                                <span>SWMS</span>
                                            </button>
                                            {/* <button className="tools-items normal-bnt color-10" onClick={() =>
                                                this.props.history.push('./rebookJob')}>
                                                <i class="material-icons">format_paint</i>
                                                <span>REBOOK JOB</span>
                                            </button> */}
                                            <button className="tools-items normal-bnt color-11"
                                                disabled={jobDetails && jobDetails.job_details && jobDetails.job_details.length > 0 && jobDetails.job_details[0].service_agent_id
                                                    && jobDetails.job_details[0].service_agent_id == JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id ? false : true}
                                                onClick={() => {
                                                    /**Chnage hardcoded job id */
                                                    this.props.history.push('./photosDocs')
                                                }}>
                                                <i class="material-icons">insert_photo</i>
                                                <span>PHOTOS/DOCS</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                </div>

                {/* Add SWMS document Modal */}
                <Modal
                    visible={this.state.visible}
                    footer={null}
                    closable={false}>
                    <AddSWMSForm close={this.handleCancel} organisation_id={jobOrgId} job_id={jobId} />
                </Modal>

                {/* Add PPE Modal */}
                <Modal
                    visible={this.state.visibleAddPPE}
                    footer={null}
                    closable={false}>
                    <AddPPEForm close={this.handleCancel} organisation_id={jobOrgId} job_id={jobId} />
                </Modal>

                {/* Add tool type */}
                <Modal
                    visible={this.state.visibleToolType}
                    footer={null}
                    closable={false}>
                    <AddToolTypeForm close={this.handleCancel} organisation_id={jobOrgId} job_id={jobId} />
                </Modal>

                {/* Add high risk work swms */}
                <Modal
                    visible={this.state.visibleHRS}
                    footer={null}
                    closable={false}>
                    <AddHRWForm close={this.handleCancel} organisation_id={jobOrgId} job_id={jobId} />
                </Modal>

                {/* Add Chemical swms */}
                <Modal
                    visible={this.state.visibleSDS}
                    footer={null}
                    closable={false}>
                    <AddChemicalForm close={this.handleCancel} organisation_id={jobOrgId} job_id={jobId} />
                </Modal>

                {/* Add site contact number / name and po number */}
                <Modal
                    visible={this.state.handleSiteContact}
                    footer={null}>
                    <AddSiteNameNumberForm job_number={jobNumber} job_id={jobId} close={this.handleCancel} siteFormType={this.state.handleSiteContactType} />
                </Modal>

                {/* userLicienceView  */}

                <Modal
                    visible={this.state.viewUserLicience}
                    footer={null}
                    onCancel={this.handleCancel}>
                    {this.props.userLicence ? <UserLicienceView /> : ''}
                </Modal>

                {/* task file view  */}

                <Modal
                    visible={this.state.viewTaskFiles}
                    footer={null}
                    onCancel={this.handleCancel}>
                    <TaskFileViews taskFiles={this.state.taskFiles} />
                </Modal>

                {/* Toolbox Talk checklist  */}
                {this.state.ViewToolboxTalk ? <Modal
                    visible={this.state.ViewToolboxTalk}
                    footer={null}
                    width="100%"
                    className="toolbox-talk-form"
                    onCancel={this.handleCancel}>
                    <ViewToolboxTalk selectedToolboxTalk={this.state.toolboxTalk} onCancel={this.handleCancel}
                        initialValues={this.state.toolBoxDetails} />

                </Modal> : null
                }
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    let taskObj = {}
    if (state.sAJobMgmt.jobDetails && state.sAJobMgmt.jobDetails.task_swms && state.sAJobMgmt.jobDetails.task_swms.length > 0) {
        state.sAJobMgmt.jobDetails.task_swms.map(task => {
            if (task && task.id) {
                if (task && task.areas && task.areas.length > 0) {
                    task.areas.map(areas => {
                        if (areas && areas.area_id) {
                            for (let swms in areas) {
                                if (swms == "swms_doc" && areas[swms] && areas[swms].length > 0) {
                                    areas[swms].map(item => {
                                        if (item.id) {
                                            modifyObject(taskObj, [`task_${task.id}`, `area_${areas.area_id}`, 'swms', `swms_${item.id}`], true);
                                        }
                                    })
                                }

                                if (swms == "tool_type" && areas[swms] && areas[swms].length > 0) {
                                    areas[swms].map(item => {
                                        modifyObject(taskObj, [`task_${task.id}`, `area_${areas.area_id}`, 'tool', `tool_${item.id}`], true);
                                    })
                                }
                                if (swms == "ppe" && areas[swms] && areas[swms].length > 0) {
                                    areas[swms].map(item => {
                                        modifyObject(taskObj, [`task_${task.id}`, `area_${areas.area_id}`, 'ppe', `ppe_${item.id}`], true);
                                    })
                                }
                                if (swms == "hig_risk_work" && areas[swms] && areas[swms].length > 0) {
                                    areas[swms].map(item => {
                                        modifyObject(taskObj, [`task_${task.id}`, `area_${areas.area_id}`, 'hrw', `hrw_${item.id}`], true);
                                    })
                                }
                                if (swms == "chemical" && areas[swms] && areas[swms].length > 0) {
                                    areas[swms].map(item => {
                                        modifyObject(taskObj, [`task_${task.id}`, `area_${areas.area_id}`, 'sds', `sds_${item.id}`], true);
                                    })
                                }
                            }
                        }
                    })
                }
            }
        })
    }

    if (state.sAJobMgmt.jobDetails && state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details.length > 0 && state.sAJobMgmt.jobDetails.job_details[0] && state.sAJobMgmt.jobDetails.job_details[0].job_schedules && state.sAJobMgmt.jobDetails.job_details[0].job_schedules.length > 0) {
        state.sAJobMgmt.jobDetails.job_details[0].job_schedules.map((job_schedule, job_schedule_index) => {
            if (job_schedule && job_schedule.job_schedule_shifts && job_schedule.job_schedule_shifts.length > 0) {
                job_schedule.job_schedule_shifts.map((shift, index) => {
                    if (shift && shift.job_allocated_users && shift.job_allocated_users.length > 0) {
                        shift.job_allocated_users.map((user, userIndex) => {
                            if (user && user.start_time) {
                                taskObj[`${shift.id}_${user.user_name}_start_time`] = user.start_time
                            }
                            if (user && user.start_time_type) {
                                taskObj[`${shift.id}_${user.user_name}_siteYard`] = `${shift.id}_${user.user_name}_${user.start_time_type}`
                            }
                        })
                    }
                })
            }
        })
    }

    return {
        roles: state.roleManagement.roles,
        jobDetails: state.sAJobMgmt.jobDetails,
        orgSWMS: state.swmsReducer.orgSWMS,
        userLicence: state.sAJobMgmt.userLicence,
        formValues: state.form.acceptedJobDetails && state.form.acceptedJobDetails.values ? state.form.acceptedJobDetails.values : {},
        initialValues: taskObj,
        swmsSignDetails: state.sAJobMgmt.swmsSignDetails,
        taskSWMS: state.sAJobMgmt.jobDetails.task_swms ?
            state.sAJobMgmt.jobDetails.task_swms : [],
        jobReports: state.sAJobMgmt.jobReports,
        filePath: state.sAJobMgmt.filePath,
        swmsDoc: state.sAJobMgmt.jobDetails.swms_document ? state.sAJobMgmt.jobDetails.swms_document : [],
        jobToolBoxTalk: state.swmsReducer.jobToolBoxTalk,
        jobToolBoxTalkDetail: state.swmsReducer.jobToolBoxTalkDetail,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
        accessControlAction: bindActionCreators(accessControlAction, dispatch),
        sAJobMgmtAction: bindActionCreators(sAJobMgmtAction, dispatch),
        swmsAction: bindActionCreators(swmsAction, dispatch),
        saJobCalender: bindActionCreators(saJobCalender, dispatch),
        jobDocAction: bindActionCreators(jobDocAction, dispatch),
        userAction: bindActionCreators(userAction, dispatch),
        jobManagerAction: bindActionCreators(jobManagerAction, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'acceptedJobDetails', enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(acceptedJobDetails)