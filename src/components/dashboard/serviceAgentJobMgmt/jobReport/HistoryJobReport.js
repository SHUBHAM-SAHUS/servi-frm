import React from 'react';
import { Icon, Collapse, Table } from 'antd';
import { Strings } from '../../../../dataProvider/localize';
import { connect } from 'react-redux';
import { abbrivationStr } from '../../../../utils/common'

// slider content

const { Panel } = Collapse;


// images view in table
const columns = [
    {
        dataIndex: 'locationPicDetails',
        key: 'locationPicDetails',
    },
];

class HistoryJobReport extends React.Component {
    render() {
        const { job, jobReports, filePath } = this.props;
        var index = 0;
        return (
            <div className="sf-jobdoc-preview sf-history-preview">
                <div className="sf-card-wrap">
                    {/* header */}
                    {/* <div className="jdp-head">
            <div class="jdp-c-exp-date co-details-prv">
              <p>{job.org_details ? job.org_details.name : ""}</p>
              <p>ABN: {job.quote ? job.org_details.abn_acn : ""}</p>
              <p>A: {job.quote ? job.org_details.address : ""}</p>
              <p>E: {job.quote ? job.org_details.contact_person_email : ""}</p>
            </div>
            {job.quote && job.org_details && job.org_details.client_logo ?
              <img src={job.org_details.client_logo} /> :
              <strong className="img-abbri-str">{job.org_details && job.org_details.name && abbrivationStr(job.org_details.name)}</strong>}
          </div> */}
                    {/* inner header */}
                    <div className="jdp-big-cntr-head">
                        <h1>{this.props.job.job_number} - {this.props.versionNo}</h1>
                    </div>
                    {/* body */}

                    <div className="sf-card">
                        <div className="sf-card-body p-0">
                            <div className="job-cleaning-report">
                                <div className="sf-c-table org-user-table">
                                    <div className="tr">
                                        <span className="th">Area</span>
                                        <span className="th">Area Photos</span>
                                        <span className="th">Before Photos </span>
                                        <span className="th">After Photos </span>
                                        <span className="th">Note</span>
                                        <span className="th">Record by</span>
                                    </div>
                                    {jobReports && jobReports.map(jobReport => {
                                        return <div className="drag-row tr">
                                            <span className="td">{jobReport.area ? jobReports.area : ''}</span>
                                            <span className="td">
                                                <div className="location-afbf-pic">
                                                    <img width="100px" src={jobReport.location_photo ? this.props.filePath + JSON.parse(jobReport.location_photo) : ''} />
                                                </div>
                                            </span>
                                            <span className="td">
                                                <div className="location-afbf-pic">
                                                    <img width="100px" src={jobReport.before_photo ? this.props.filePath + JSON.parse(jobReport.before_photo) : ''} />
                                                </div>
                                            </span>
                                            <span className="td">
                                                <div className="location-afbf-pic">
                                                    <img width="100px" src={jobReport.after_photo ? this.props.filePath + JSON.parse(jobReport.after_photo) : ''} />
                                                </div>
                                            </span>
                                            <span className="td">{jobReport.note ? jobReport.note : ''}</span>
                                            <span className="td">{jobReport.photo_taken_by ? jobReport.photo_taken_by : ''}</span>
                                        </div>
                                    })}
                                </div>
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
        formValues: state.form && state.form.jobReport &&
            state.form.jobReport.values ? state.form.jobReport.values : {},
        job: state.sAJobMgmt.jobDetails && state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] ?
            state.sAJobMgmt.jobDetails.job_details[0] : {},
        jobReports: state.sAJobMgmt.jobReportVersionHistory && state.sAJobMgmt.jobReportVersionHistory.length > 0 ? state.sAJobMgmt.jobReportVersionHistory : [],
        filePath: state.sAJobMgmt.filePath,
    }
}

const mapDispatchToprops = dispatch => {
    return {
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(HistoryJobReport);