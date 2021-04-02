import React from 'react';
import { Icon, Collapse, Modal, Dropdown, notification } from 'antd';
import { Strings } from '../../../../dataProvider/localize';
import { withRouter } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import SignSWMSPdf from "./SignSWMSPdf";
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import * as actions from '../../../../actions/SAJobMgmtAction';
import * as userAction from '../../../../actions/organizationUserAction';
import moment from 'moment';
import { abbrivationStr } from '../../../../utils/common'
import { ERROR_NOTIFICATION_KEY } from '../../../../config';

class ClientPreviewSwmsSign extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            jobMembers: []
        };
    }
    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        if (query.get('job_number')) {

            this.props.action.getSWMSSignDetails(query.get('job_number'));

            this.props.action.getJobDetails(query.get('job_number'))
                .then(flag => {
                    this.getJobMembers(this.props.jobDetails)
                }).catch(message => {
                    notification.error({
                        key: ERROR_NOTIFICATION_KEY,
                        message: Strings.success_title,
                        description: message ? message : Strings.generic_error,
                        onClick: () => { },
                        className: 'ant-error'
                    })
                });
        } else {
            notification.error({
                key: ERROR_NOTIFICATION_KEY,
                message: Strings.error_title,
                description: "Invalid Link",
                onClick: () => { },
                className: 'ant-error'
            })
        }
    }

    uniqueBy(arr, key) {
        const arrayUniqueByKey = [...new Map(arr.map(item =>
            [item[key], item])).values()];
        return arrayUniqueByKey.length > 0 ? arrayUniqueByKey : []
    }

    getJobMembers = (jobDetails) => {
        var members = []
        if (jobDetails && jobDetails.job_schedules && jobDetails.job_schedules.length > 0) {
            jobDetails.job_schedules.map((item) => {
                const arrayUniqueByKey = item.job_schedule_shifts && item.job_schedule_shifts.length > 0 ? item.job_schedule_shifts.map(schedule_shifts => {
                    if (schedule_shifts.supervisor) {
                        members.push(schedule_shifts.supervisor)
                    }
                    if (schedule_shifts.site_supervisor) {
                        members.push(schedule_shifts.site_supervisor)
                    }
                    if (schedule_shifts.job_allocated_users) {
                        const arrayUniqueByKey1 = schedule_shifts.job_allocated_users && schedule_shifts.job_allocated_users.length > 0 ? schedule_shifts.job_allocated_users.map(job_allocated_users => {
                            members.push(job_allocated_users)
                        }) : null
                    }
                }) : null
            })
        }
        if (members.length > 0) {
            let uniqueArr = this.uniqueBy(members, 'user_name')
            console.log(uniqueArr)
            this.setState({
                jobMembers: uniqueArr
            })
        }
    }

    render() {

        const { jobDetails, swmsDoc, swmsSignDetails, taskSWMS } = this.props;
        const sites = jobDetails.quote && jobDetails.quote.scope_doc && jobDetails.quote.scope_doc.scope_docs_sites;
        var activityArray = [];
        taskSWMS.forEach(swms => {
            if (swms.areas) {
                swms.areas.forEach(area => {
                    if (area.swms_doc)
                        activityArray = [...activityArray, ...area.swms_doc];
                })
            }
        });
        return (
            <div className="sf-jobdoc-preview">
                <div className="sf-card-wrap">
                    {/* header */}
                    <div className="jdp-head">
                        <div class="jdp-c-exp-date co-details-prv">
                            <p>{jobDetails.org_details && jobDetails.org_details.name}</p>
                            <p>ABN: {jobDetails.org_details && jobDetails.org_details.abn_acn}</p>
                            <p>A: {jobDetails.org_details && jobDetails.org_details.address}</p>
                            <p>E: {jobDetails.org_details && jobDetails.org_details.contact_person_email}</p>
                        </div>
                        {jobDetails.org_details && jobDetails.org_details.client_logo ? <img src={jobDetails.org_details.client_logo} /> :
                            <strong className="img-abbri-str">{jobDetails.org_details && jobDetails.org_details.name &&
                                abbrivationStr(jobDetails.org_details.name)}</strong>}
                    </div>
                    {/* inner header */}

                    <div className="jdp-big-cntr-head">
                        <h1>Safe Work Method Statement (SWMS)</h1>
                    </div>

                    {/* Safe Work Method Statement (SWMS) */}
                    {/* <div className="sf-card">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h2 className="sf-pg-heading">{Strings.safe_work_method_statement_swms}</h2>
                            <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled>
                                    <i className="material-icons">more_vert</i>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="sf-card-body">
                            <div className="data-v-row">
                                <div className="data-v-col">
                                    <div className="view-text-value">
                                        <label>{Strings.abn}</label>
                                        <span>{jobDetails.quote && jobDetails.quote.client.abn_acn}</span>
                                    </div>
                                </div>
                                <div className="data-v-col">
                                    <div className="view-text-value">
                                        <label>{Strings.phone}</label>
                                        <span>{jobDetails.quote && jobDetails.quote.client.contact_person_phone}</span>
                                    </div>
                                </div>
                                <div className="data-v-col">
                                    <div className="view-text-value">
                                        <label>{Strings.email_txt}</label>
                                        <span>{jobDetails.quote && jobDetails.quote.client.contact_person_email}</span>
                                    </div>
                                </div>
                                <div className="data-v-col">
                                    <div className="view-text-value">
                                        <label>{Strings.address_txt}</label>
                                        <span>{jobDetails.quote && jobDetails.quote.client.address}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* Site Details */}
                    <div className="sf-card mt-4">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h2 className="sf-pg-heading">{Strings.site_details}</h2>
                            <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled>
                                    <i className="material-icons">more_vert</i>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="sf-card-body sign-swms-wrap">
                            <div className="view-swms-site">
                                {sites && sites.map((site, index) =>
                                    <div className="view-swms-panel">
                                        <h3 className="vsite-title">{site.site.site_name}</h3>
                                        <div className="view-site-conte">
                                            <div className="data-v-row">
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.site_name}</label>
                                                        <span>{site.site.site_name}</span>
                                                    </div>
                                                </div>
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.address_txt}</label>
                                                        <span>{site.site.street_address}</span>
                                                    </div>
                                                </div>
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.swms_no}</label>
                                                        <span>{Strings.swms_no}</span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="normal-txt brt">
                                                <span>All person involved in the works must have the SWMS explained and communicated to them prior to start of works.</span>
                                            </div>
                                        </div>
                                    </div>)}
                            </div>
                        </div>
                    </div>

                    {/* Staff Details */}
                    <div className="sf-card mt-4">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h2 className="sf-pg-heading">{Strings.staff_details}</h2>
                            <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled>
                                    <i className="material-icons">more_vert</i>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="sf-card-body">
                            <div className="staff-list-details">
                                <div className="site-name-list">
                                    {/* <h3 className="site-title">{site.site && site.site.site_name}</h3> */}
                                    <div className="task-name-list">
                                        {/* <h3 className="task-title">{task && task.task_name}</h3> */}
                                        <div className="task-table">
                                            <div className="sf-c-table">
                                                <div className="tr">
                                                    <span className="th">Name</span>
                                                    <span className="th">Position </span>
                                                    <span className="th">Note</span>
                                                </div>
                                                {this.state.jobMembers && this.state.jobMembers.length > 0 ? this.state.jobMembers.map((user) => {
                                                    return <>
                                                        <div className="tr">
                                                            <span className="td">{user && user.first_name ? user.first_name : ''}</span>
                                                            <span className="td">{user && user.role_name ? user.role_name : ''}</span>
                                                            <span className="td">All person involved in the works must have the SWMS explained and communicated to them.</span>
                                                        </div>
                                                    </>
                                                }) : null}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* SWMS details */}
                    <div className="sf-card mt-4">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h2 className="sf-pg-heading">{Strings.swms_txt}</h2>
                            <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled>
                                    <i className="material-icons">more_vert</i>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="sf-card-body">
                            <div className="swms-view-wrap">

                                {/* mapping will start from here */}

                                {taskSWMS && taskSWMS.length > 0 ? taskSWMS.map((task_swms, index) => <div className="swms-view-items">
                                    <h2>{task_swms && task_swms.name ? task_swms.name : ''}</h2>
                                    {task_swms && task_swms.areas && task_swms.areas.length > 0 ? task_swms.areas.map((area, index) =>
                                        <div className="swms-task-view-items">
                                            <h3>{area && area.area_name ? area.area_name : ''}</h3>
                                            <div className="smws-view-task-table">
                                                <table className="swms-table">
                                                    <tr>
                                                        <th>SWMS Activity</th>
                                                        <th>PPE</th>
                                                        <th>Tool Type</th>
                                                        <th>High Risk Work</th>
                                                        <th>Chemicals</th>
                                                    </tr>
                                                    <tr className="swms-sr-dtl">
                                                        <td>
                                                            {area && area.swms_doc && area.swms_doc.length > 0 ? area.swms_doc.map(swms_doc => {
                                                                return <span>{swms_doc && swms_doc.activity ? swms_doc.activity : ''}</span>
                                                            }) : ''}

                                                        </td>
                                                        <td>
                                                            {area && area.ppe && area.ppe.length > 0 ? area.ppe.map(ppe => {
                                                                return <span>{ppe && ppe.name ? ppe.name : ''}</span>
                                                            }) : ''}
                                                        </td>
                                                        <td>
                                                            {area && area.tool_type && area.tool_type.length > 0 ? area.tool_type.map(tool_type => {
                                                                return <span>{tool_type && tool_type.name ? tool_type.name : ''}</span>
                                                            }) : ''}
                                                        </td>
                                                        <td>
                                                            {area && area.hig_risk_work && area.hig_risk_work.length > 0 ? area.hig_risk_work.map(hig_risk_work => {
                                                                return <span>{hig_risk_work && hig_risk_work.name ? hig_risk_work.name : ''}</span>
                                                            }) : ''}
                                                        </td>
                                                        <td>
                                                            {area && area.chemical && area.chemical.length > 0 ? area.chemical.map(chemical => {
                                                                return <span>{chemical && chemical.name ? chemical.name : ''}</span>
                                                            }) : ''}
                                                        </td>
                                                    </tr>
                                                </table>
                                            </div>
                                        </div>) : null}
                                </div>
                                ) : null}
                            </div>
                        </div>
                    </div>

                    {/* SWMS Document */}
                    <div className="sf-card mt-4">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h2 className="sf-pg-heading">{Strings.swms_document}</h2>
                            <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled>
                                    <i className="material-icons">more_vert</i>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="sf-card-body">
                            <div className="swms-document swms-doc-new-tbl">
                                <table className="swms-doc-table">
                                    <tr>
                                        <th rowSpan="2">Activity
                                            <span>Break the job down into steps</span>
                                        </th>
                                        <th rowSpan="2">Potential Safety and<br /> Environmental Hazards
                                            <span>What can go wrong</span>
                                        </th>
                                        <th colSpan="3">Risk Rating</th>
                                        <th rowSpan="2">Control Measures</th>
                                        <th colSpan="3">Risk Rating After Controls</th>
                                        <th rowSpan="2">Person Responsible
                                             <span>To ensure management method applied</span>
                                        </th>
                                    </tr>
                                    <tr className="sub-th-vlue">
                                        <th>C</th>
                                        <th>P</th>
                                        <th>R</th>
                                        <th>C</th>
                                        <th>P</th>
                                        <th>R</th>
                                    </tr>
                                    {/* looping area */}
                                    {swmsDoc && swmsDoc.map(doc =>
                                        <tr>
                                            <td>
                                                {/* <div className="swms-act-list">
                                                {activityArray.map(activity => <span>{activity.activity}</span>)}
                                            </div> */}
                                                {doc.activity}
                                            </td>
                                            <td>{doc.hazard}</td>
                                            <td>{doc.consequence_before_control_name}</td>
                                            <td className="std-sty">{doc.likelihood_before_control_name}</td>
                                            <td className="std-sty">{doc.risk_before_control}</td>
                                            <td>{doc.control_measures}</td>
                                            <td>{doc.consequence_after_control_name}</td>
                                            <td className="std-sty">{doc.likelihood_after_control_name}</td>
                                            <td className="std-sty">{doc.risk_after_control}</td>
                                            <td>{doc.person_responsible}</td>
                                        </tr>)}
                                    {/* loop end area */}
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Signatures */}
                    <div className="sf-card mt-4">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h2 className="sf-pg-heading">{Strings.Signoff}</h2>
                            <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled>
                                    <i className="material-icons">more_vert</i>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="sf-card-body">
                            <div className="normal-txt mt-2">
                                <span>We the undersigned, confirm that the SWMS nominated above has been explained and its contents are clearly understood and accepted. We also confirm that our
required qualifications to undertake this activity are current. We also clearly understand the controls in this SWMS must be applied as documented; otherwise work is to
cease immediately.</span>
                            </div>
                            <div className="signature-box">
                                <table className="add-user-table table">
                                    <tr>
                                        <th>Name</th>
                                        <th>Signature </th>
                                        <th>Date</th>
                                    </tr>

                                    {this.props.swmsSignDetails[0] && this.props.swmsSignDetails[0].job_swms_sign_offs ?
                                        this.props.swmsSignDetails[0].job_swms_sign_offs.map(sign =>
                                            <tr>
                                                <td>{sign.user_first_name + ' (' + sign.user_role_name + ')'}</td>
                                                <td><img src={sign.sign} alt="SF logo" /></td>
                                                <td>{moment(sign.sign_date).format('DD/MM/YY')}</td>

                                            </tr>) : null}
                                </table>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        jobDetails: state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] ?
            state.sAJobMgmt.jobDetails.job_details[0] : {},
        swmsSignDetails: state.sAJobMgmt.swmsSignDetails,
        users: state.organizationUsers.users,
        taskSWMS: state.sAJobMgmt.jobDetails.task_swms ?
            state.sAJobMgmt.jobDetails.task_swms : [],
        swmsDoc: state.sAJobMgmt.jobDetails.swms_document ? state.sAJobMgmt.jobDetails.swms_document : []
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
        userAction: bindActionCreators(userAction, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(ClientPreviewSwmsSign);