import React from 'react';
import { Icon, Collapse, Modal, Dropdown, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm } from 'redux-form';
import { customTextarea } from '../../common/customTextarea';
import * as actions from '../../../actions/SAJobMgmtAction';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { goBack, currencyFormat, handleFocus, goBackBrowser } from '../../../utils/common';
import { getStorage } from '../../../utils/common';
import { withRouter } from 'react-router-dom';
import TaskFileViews from './taskFilesView';
import { validationString } from '../../../dataProvider/localize';
import { DeepTrim } from '../../../utils/common';


const mapRouteToTitle = {
    '/dashboard/rolesmanagement/createRole': Strings.add_role_title
}

export const declineReasonRequired = value => value ? undefined : validationString.Job_doc_decline_reason


const { Panel } = Collapse;

class JobDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = { togleSearch: true, viewTaskFiles: false, taskFiles: [] }
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.loginUserName = JSON.parse(getStorage(ADMIN_DETAILS)) ?  JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
        (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : null;
        this.loginUserRoleName = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).role.role_name : null;
    }

    componentDidMount() {
        /**Remove hardcoded job_number once api is fixed */
        this.props.actions.getJobDetails(this.props.location.state ? this.props.location.state : ""); // remove it 
    }

    updateJobStatus = (data) => {
        const orgType = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.organisation_type : null
        if (data) {
            data.id = this.props.jobDetails.job_details[0].id;
            data.job_number = this.props.jobDetails.job_details[0].job_number;
            this.props.actions.updateJob(data).then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                    // onOk: () => this.props.history.push('/dashboard/service_agent_staff_calendar')
                })
                if (orgType == 1) {
                    this.props.history.push('/dashboard/internal_calendar')
                } else {
                    this.props.history.push('/dashboard/service_agent_staff_calendar')                    
                }
            }).catch(err => {
                notification.error({
                    message: Strings.error_title,
                    description: err ? err : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                })
            })
        }
    }

    onSubmitDecline = async (formData) => {
        formData = await DeepTrim(formData);

        if (formData.decline_reason === '' || formData.decline_reason == null) {
            notification.error({
                message: Strings.error_title,
                description: validationString.Job_doc_decline_reason,
                onClick: () => { },
                className: 'ant-error'
            })
        } else {
            formData.job_accept_status = 2;
            this.updateJobStatus(formData);
        }
    }
    onSubmitAccept = (formData) => {
        formData.job_accept_status = 1;
        this.updateJobStatus(formData);
    }

    handleCancel = e => {
        this.setState({
            viewTaskFiles: false,
            taskFiles: []
        });
    };

    handleTaskFileView = (files) => {
        if (files && files.length > 0) {
            this.setState({
                viewTaskFiles: true, taskFiles: files
            });
        }
    }

    render() {
        let { jobDetails, handleSubmit } = this.props;
        return (
            <div className="sf-page-layout">
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

                {/* ======= For:: Job Details View ::  ======== */}

                <div className="main-container">
                    <div className="row">
                        <div className="col-lg-12">
                            <div className="sf-card-wrap">
                                <div className="sf-card scope-v-value">
                                    <div className="sf-card-head d-flex justify-content-between align-items-start">
                                        <strong className="doc-v-usr"><span>{this.loginUserRoleName} : </span>{this.loginUserName}</strong>
                                        <strong className="doc-v-usr"><span>{Strings.validity_txt}</span>60 Days</strong>
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

                                                            </div>
                                                            <div className="data-v-row sAgent-note justify-content-between">
                                                                <div className="data-v-col">
                                                                    <div className="view-text-value">
                                                                        <label>Notes</label>
                                                                        <span>{task && task.note ? task.note : ''}</span>
                                                                    </div>
                                                                </div>
                                                                {task && task.file && task.file[0] && task.file[0].file_url ?
                                                                    <div className="job-note-pic">
                                                                        <img src={task.file[0].file_url} onClick={() => this.handleTaskFileView(task.file)}  />
                                                                    </div> : null}
                                                            </div>
                                                        </div>
                                                    }) : ''}
                                                </div>
                                            </div>
                                        }) : ''}
                                </div>

                                {/* SWMS */}
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
                                        <Collapse className="swms-content-list" defaultActiveKey={[0]}>
                                            {jobDetails && jobDetails.task_swms && jobDetails.task_swms.length > 0 ? jobDetails.task_swms.map((task_swms, index) => {
                                                return <Panel className="swms-co-items" header={task_swms && task_swms.name ? task_swms.name : ''} key={index}>
                                                    <Collapse className="swms-content-list" defaultActiveKey={[0]}>
                                                        {task_swms && task_swms.areas && task_swms.areas.length > 0 ? task_swms.areas.map((area, index) => {
                                                            return <Panel className="swms-co-items" header={area && area.area_name ? area.area_name : ''} key={index}>
                                                                <table className="table swms-table">
                                                                    <tr>
                                                                        <th>SWMS Activity</th>
                                                                        <th>PPE</th>
                                                                        <th>Tool Type</th>
                                                                        <th>High Risk Work</th>
                                                                        <th>Chemicals</th>
                                                                    </tr>
                                                                    {/* {area} */}
                                                                    <tr className="swms-sr-dtl swms-doc-lists">
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
                                                            </Panel>
                                                        }) : ''}
                                                    </Collapse>
                                                </Panel>
                                            }) : ''}
                                        </Collapse>
                                    </div>
                                </div>

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
                                                <b></b> {jobDetails && jobDetails.budget ? currencyFormat(jobDetails.budget) : 0}</div>
                                        </div>
                                    </div>
                                </div>

                                {/* Reason to Decline */}

                                <div className="sf-card mt-4 sf-shadow">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">Reason to Decline</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="sf-card-body">
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <fieldset className="sf-form no-label">
                                                    <Field
                                                        name="decline_reason"
                                                        type="text"
                                                        // validate={declineReasonRequired}
                                                        component={customTextarea} />
                                                </fieldset>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* save and preview button */}

                                <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                                    <form onSubmit={handleSubmit(this.onSubmitDecline)}>
                                        <div className="btn-hs-icon">
                                            <button type="submit" className="bnt bnt-normal" >Decline</button>
                                        </div>
                                    </form>
                                    <form onSubmit={handleSubmit(this.onSubmitAccept)}>
                                        <div className="btn-hs-icon">
                                            <button type="submit" className="bnt bnt-active">Accept</button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <Modal
                    visible={this.state.viewTaskFiles}
                    footer={null}
                    onCancel={this.handleCancel}>
                    <TaskFileViews taskFiles={this.state.taskFiles} />
                </Modal>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        jobDetails: state.sAJobMgmt.jobDetails,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'jobDetails' ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(JobDetails)