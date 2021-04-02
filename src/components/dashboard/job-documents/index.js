import React, { Fragment } from 'react';
import { Image, Icon, Button, Collapse, Modal, Table } from 'antd';
import { connect } from 'react-redux';
import AddTasks from './add-tasks';
import AddStaff from './add-staff';
import Document from './document';
import StaffList from './staff-list';
import StaffLicences from './staff-licences';
import AddNotes from './add-notes';
import Logo from '../../../images/logo.jpg';
import * as actions from '../../../actions/jobDocumentsAction';
import { getStorage } from '../../../utils/common';
import StaffLicenseList from './staff-licences';
import * as jobDocAction from '../../../actions/jobDocAction';
import JobDocumentHistoryView from './job-doc-history'
class JobDocuments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedStaffs: [{
                abn_acn: "",
                address: "",
                email_address: "",
                id: 0,
                logo: "",
                name: "",
                org_code: "",
                phone_number: "",
                primary_person: "",
                site_supervisors: [],
                staffs: [],
                selected: false,
                visible: false
            }],
            sites: [],
            certificateList: []

        }
    }

    callback = (key) => {
        console.log(key);
    }

    componentDidMount() {
        const jobId = getStorage('JOB_ID');
        //this.props.getJobDocument();
        let { getJobDocVersionHistory } = this.props;
        this.props.getServiceAgentAllStaff();
        this.props.getJobDetails(jobId).then(res => {
            if (res.length > 0) {
                this.setState({ sites: res[0].sites });
            }
        })
        this.props.getJobDocumentCertificates();

    }

    setDocuments = (documentId) => {
        let { selectedDocuments, setSelectedDocument } = this.props;
        let documents = JSON.parse(JSON.stringify(selectedDocuments))
        let index = documents.indexOf(documentId);
        if (index === -1) {
            documents.push(documentId)
        } else {
            documents.splice(index, 1);
        }
        setSelectedDocument(documents);
    }

    viewJobDoc(version) {
        let { jobDetails, staffLists } = this.props;
        console.log(staffLists, 'staffListstaffList')
        let staff = staffLists && staffLists.length > 0 && staffLists[0];
        console.log(staff, 'staff')
        for (let index = 0; index < version; index++) {
            return (staff && staff.job_doc_number ? <div className="vjh-items"><button className="normal-bnt" type="button" onClick={() =>
                this.getJobHistoryDetail(staff.job_doc_number, index + 1)}>
                {`${staff.job_doc_number} - ${index + 1}`}</button></div> : `Version - ${index + 1}`)
        }
    }

    getJobHistoryDetail(docNumver, version) {
        let { getJobDocVersionHistory, setJobView } = this.props;
        getJobDocVersionHistory(docNumver, version)
        this.setState({ visible: true })
        setJobView(true);
    }

    handleOkCancel = () => {
        const jobId = getStorage('JOB_ID');
        let { setJobView } = this.props;

        this.setState({ visible: false })
        setJobView(false);
        this.props.getJobDetails(jobId).then(res => {
            if (res.length > 0) {
                this.setState({ sites: res[0].sites });
            }
        })
    }

    render() {
        const { allStaffList, jobDetails, certificateList, step, staffLists, isViewJob, selectedDocuments,
            licencesTypes, totalJobDocVersion } = this.props;
        const { Panel } = Collapse;
        return (
            <>
                <Modal
                    title="Licence Details"
                    visible={this.state.visible}
                    onOk={this.handleOkCancel}
                    onCancel={this.handleOkCancel}
                    width={1500}
                >
                    <div className="dash-header">
                        <div className="col-12 header-main p-0">
                            <div className="d-flex">
                                <div className="pull-left hed-img">
                                    <img
                                        width={50}
                                        src={Logo}
                                    />
                                </div>
                                <div className="full-right hed-text">
                                    <h1>JOB DOCUMENTS</h1>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="main-container pl-3">

                        <div className="sf-card-wrap pb-5">
                            <Fragment>
                                <div className="col-12 white-back sf-card scope-v-value mb-4">
                                    <div className="row">
                                        <div className="col-lg-6 col-md-6 col-sm-12 pt-2 pb-2 text-left doc-lnes-hed">
                                            <div className="">
                                                <b>From :</b>
                                            </div>
                                            <div className="">
                                                <b>Business Name: </b> {jobDetails.businessName || ''}
                                            </div>
                                            <div className="">
                                                <b>ABN: </b> {jobDetails.client_abn_acn || ''}
                                            </div>
                                            <div className="">
                                                <b>Address: </b> {jobDetails.address || ''}
                                            </div>
                                            <div className="">
                                                <b>Phone: </b> {jobDetails.phone_number || ''}
                                            </div>
                                            <div className="">
                                                <b>Email: </b> {jobDetails.email_address || ''}
                                            </div>
                                            <div >&nbsp;</div>
                                            <div className="">
                                                <b>Job Name: </b> {jobDetails.job_name || ''}
                                            </div>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 pt-2 pb-2 text-left doc-lnes-hed">
                                            <div className="">
                                                <b>To :</b>
                                            </div>
                                            <div className="">
                                                <b>Client Name: </b> {jobDetails.client_name || ''}
                                            </div>
                                            <div className="">
                                                <b>Primary Contact: </b> {jobDetails.client_name || ''}
                                            </div>
                                            <div className="">
                                                <b>Phone Number: </b> {jobDetails.client_person_phone || ''}
                                            </div>
                                            <div className="">
                                                <b>ABN: </b> {jobDetails.client_abn_acn || ''}
                                            </div>
                                            <div className="">
                                                <b>Address: </b> {jobDetails.client_address || ''}
                                            </div>
                                            <div className="">
                                                <b>Email: </b> {jobDetails.client_person_email || ''}
                                            </div>
                                        </div>
                                    </div>
                                    {!isViewJob &&
                                        <div className="quote view-jd-history vjh-items-box">
                                            <Collapse className="show-frquency-box" bordered={false} accordion
                                                expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                                                <Panel header="View Job Doc History" key="1">
                                                    {totalJobDocVersion && totalJobDocVersion > 0 ?
                                                        this.viewJobDoc(totalJobDocVersion) : "No Data Found"}
                                                </Panel>
                                            </Collapse>
                                        </div>
                                    }

                                </div>

                                <div className="text-left hdg-mn addstaff-top-head mb-3" onClick={this.addTasks}>
                                    <AddStaff isViewJob={isViewJob} />
                                </div>
                            </Fragment>
                            {staffLists.length > 0 && (<Fragment>
                                <div className="document-main hdg-mn sf-card sf-card-body mb-4">
                                    <Collapse className="swms-content-list" defaultActiveKey={['1']} onChange={this.callback}>
                                        <Panel className="color-add border0" header="Job Documents" key="1">
                                            <Document documents={certificateList} setDocuments={this.setDocuments}
                                                selectedDocuments={selectedDocuments} isViewJob={isViewJob} />
                                        </Panel>
                                    </Collapse>

                                </div>

                                <div className="staff-list-main hdg-mn sf-card-body mb-4 sf-card">
                                    <Collapse className="swms-content-list" defaultActiveKey={['1']} onChange={this.callback}>
                                        <Panel className="color-add border0" header="Staff List" key="1">
                                            {isViewJob ? <StaffLicenseList staffLists={staffLists} allStaffList={allStaffList}
                                                licencesTypes={licencesTypes} /> : <StaffList />}
                                        </Panel>
                                    </Collapse>
                                </div>

                                <div className="staff-licence-main hdg-mn sf-card-body mb-4 sf-card">
                                    <Collapse className="swms-content-list" defaultActiveKey={['1']} onChange={this.callback}>
                                        <Panel className="color-add border0" header="Schedule" key="1">
                                            <AddNotes isViewJob={isViewJob} />
                                        </Panel>
                                    </Collapse>
                                </div>
                            </Fragment>)}
                        </div>

                    </div>
                </Modal>
                <div className="dash-header">
                    <div className="col-12 header-main p-0">
                        <div className="d-flex">
                            <div className="pull-left hed-img">
                                <img
                                    width={50}
                                    src={Logo}
                                />
                            </div>
                            <div className="full-right hed-text">
                                <h1>JOB DOCUMENTS</h1>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="main-container pl-3">

                    <div className="sf-card-wrap pb-5">
                        <Fragment>
                            <div className="col-12 white-back sf-card scope-v-value mb-4">
                                <div className="row">
                                    <div className="col-lg-6 col-md-6 col-sm-12 pt-2 pb-2 text-left doc-lnes-hed">
                                        <div className="">
                                            <b>From :</b>
                                        </div>
                                        <div className="">
                                            <b>Business Name: </b> {jobDetails.businessName || ''}
                                        </div>
                                        <div className="">
                                            <b>ABN: </b> {jobDetails.client_abn_acn || ''}
                                        </div>
                                        <div className="">
                                            <b>Address: </b> {jobDetails.address || ''}
                                        </div>
                                        <div className="">
                                            <b>Phone: </b> {jobDetails.phone_number || ''}
                                        </div>
                                        <div className="">
                                            <b>Email: </b> {jobDetails.email_address || ''}
                                        </div>
                                        <div >&nbsp;</div>
                                        <div className="">
                                            <b>Job Name: </b> {jobDetails.job_name || ''}
                                        </div>
                                    </div>

                                    <div className="col-lg-6 col-md-6 col-sm-12 pt-2 pb-2 text-left doc-lnes-hed">
                                        <div className="">
                                            <b>To :</b>
                                        </div>
                                        <div className="">
                                            <b>Client Name: </b> {jobDetails.client_name || ''}
                                        </div>
                                        <div className="">
                                            <b>Primary Contact: </b> {jobDetails.client_name || ''}
                                        </div>
                                        <div className="">
                                            <b>Phone Number: </b> {jobDetails.client_person_phone || ''}
                                        </div>
                                        <div className="">
                                            <b>ABN: </b> {jobDetails.client_abn_acn || ''}
                                        </div>
                                        <div className="">
                                            <b>Address: </b> {jobDetails.client_address || ''}
                                        </div>
                                        <div className="">
                                            <b>Email: </b> {jobDetails.client_person_email || ''}
                                        </div>
                                    </div>
                                </div>
                                {!isViewJob &&
                                    <div className="quote view-jd-history vjh-items-box">
                                        <Collapse className="show-frquency-box" bordered={false} accordion
                                            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                                            <Panel header="View Job Doc History" key="1">
                                                {totalJobDocVersion && totalJobDocVersion > 0 ?
                                                    this.viewJobDoc(totalJobDocVersion) : "No Data Found"}
                                            </Panel>
                                        </Collapse>
                                    </div>
                                }

                            </div>

                            <div className="text-left hdg-mn addstaff-top-head mb-3" onClick={this.addTasks}>
                                <AddStaff isViewJob={isViewJob} />
                            </div>
                        </Fragment>
                        {staffLists.length > 0 && (<Fragment>
                            <div className="document-main hdg-mn sf-card sf-card-body mb-4">
                                <Collapse className="swms-content-list" defaultActiveKey={['1']} onChange={this.callback}>
                                    <Panel className="color-add border0" header="Job Documents" key="1">
                                        <Document documents={certificateList} setDocuments={this.setDocuments}
                                            selectedDocuments={selectedDocuments} isViewJob={isViewJob} />
                                    </Panel>
                                </Collapse>

                            </div>

                            <div className="staff-list-main hdg-mn sf-card-body mb-4 sf-card">
                                <Collapse className="swms-content-list" defaultActiveKey={['1']} onChange={this.callback}>
                                    <Panel className="color-add border0" header="Staff List" key="1">
                                        {isViewJob ? <StaffLicenseList staffLists={staffLists} allStaffList={allStaffList}
                                            licencesTypes={licencesTypes} /> : <StaffList />}
                                    </Panel>
                                </Collapse>
                            </div>

                            <div className="staff-licence-main hdg-mn sf-card-body mb-4 sf-card">
                                <Collapse className="swms-content-list" defaultActiveKey={['1']} onChange={this.callback}>
                                    <Panel className="color-add border0" header="Schedule" key="1">
                                        <AddNotes isViewJob={isViewJob} />
                                    </Panel>
                                </Collapse>
                            </div>
                        </Fragment>)}
                    </div>

                </div>

                {/* <Modal
                    title="Licence Details"
                    visible={this.state.visible}
                    onOk={this.handleOkCancel}
                    onCancel={this.handleOkCancel}
                    width={1500}
                >
                    <JobDocumentHistoryView />
                </Modal> */}
            </>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        staffLists: state.jobDetailsReducer.staffList,
        jobDetails: state.jobDetailsReducer.jobDetails.length > 0 && state.jobDetailsReducer.jobDetails[0],
        certificateList: state.jobDetailsReducer.certificateList,
        step: state.jobDetailsReducer.step,
        selectedDocuments: state.jobDetailsReducer.selectedDocuments,
        isViewJob: state.jobDetailsReducer.isViewJob,
        allStaffList: state.jobDocuments.staffList,
        licencesTypes: state.jobDetailsReducer.licencesTypes,
        totalJobDocVersion: state.jobDetailsReducer.totalJobDocVersion,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        getServiceAgentAllStaff: () => dispatch(actions.getServiceAgentAllStaff()),
        getJobDetails: (jobId) => dispatch(actions.getJobDetails(jobId)),
        getJobDocumentCertificates: () => dispatch(actions.getJobDocumentCertificates()),
        setSelectedDocument: (documents) => dispatch(actions.setSelectedDocument(documents)),
        getJobDocVersionHistory: (jobDocNo, version) => dispatch(jobDocAction.getJobDocVersionHistory(jobDocNo, version)),
        setJobView: (value) => dispatch(actions.setJobView(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(JobDocuments);