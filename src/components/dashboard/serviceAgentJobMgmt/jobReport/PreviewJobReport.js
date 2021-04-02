import React from 'react';
import { Icon, Collapse, Table } from 'antd';
import { Strings } from '../../../../dataProvider/localize';
import { connect } from 'react-redux';
import { abbrivationStr } from '../../../../utils/common'
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../../dataProvider/constant';
import { getStorage } from '../../../../utils/common';

// slider content

const { Panel } = Collapse;


// images view in table
const columns = [
  {
    dataIndex: 'locationPicDetails',
    key: 'locationPicDetails',
  },
];

class PreviewJobReport extends React.Component {




  render() {
    const { job, jobReports, filePath } = this.props;

    const org_type = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.organisation_type : null;
    var index = 0;
    return (
      <div className="sf-jobdoc-preview">
        <div className="sf-card-wrap">
          {/* header */}
          <div className="jdp-head">
            <div class="jdp-c-exp-date co-details-prv">
              <p>{job.org_details ? job.org_details.name : ""}</p>
              <p>ABN: {job.quote ? job.org_details.abn_acn : ""}</p>
              <p>A: {job.quote ? job.org_details.address : ""}</p>
              <p>E: {job.quote ? job.org_details.contact_person_email : ""}</p>
            </div>
            {job.quote && job.org_details && job.org_details.client_logo ?
              <img src={job.org_details.client_logo} /> :
              <strong className="img-abbri-str">{job.org_details && job.org_details.name && abbrivationStr(job.org_details.name)}</strong>}
          </div>
          {/* inner header */}
          <div className="jdp-big-cntr-head">
            <h1>Job Report</h1>
            <h2 className="page-mn-hd">{job.job_name}</h2>
            {/* <h2 className="page-mn-hd">External Window Cleaning (Melbourne Exhibition Centre (MCEC)</h2> */}
          </div>
          {/* body */}
          <div className="sf-card">
            <div className="sf-card-body p-0">
              <div className="view-img-slider">
                <Collapse bordered={false} defaultActiveKey={['1']} accordion expandIconPosition="right"
                  expandIcon={({ isActive }) => <Icon type="down" rotate={isActive ? 180 : 0} />}>
                  <Panel header={Strings.before_after_photo_slider} key="1">
                    <div id="carouselExampleControls" data-interval="false" className="carousel slide">
                      {/* data-ride="carousel" */}
                      <div className="carousel-inner">
                        {jobReports.map(report => {

                          if (report.before_photo && JSON.parse(report.before_photo).length > 0 && report.after_photo && JSON.parse(report.after_photo).length > 0) {
                            index++;
                            return <div className={index === 1 ? "carousel-item active" : "carousel-item"}>
                              <div className="ab-image-slide">
                                <div className="after-image sld-pic">
                                  <img src={filePath + JSON.parse(report.before_photo)[0]} />
                                  <span className="abpic-txt">Before</span>
                                </div>
                                <span className="abpic-txt loc-txt">{report.area}</span>
                                <div className="before-image sld-pic">
                                  <img src={filePath + JSON.parse(report.after_photo)[0]} />
                                  <span className="abpic-txt">After</span>
                                </div>
                              </div>
                            </div>
                          }
                        })}


                      </div>
                      <div className="slider-navigation">
                        <a className="carousel-control-prev" href="#carouselExampleControls" role="button" data-slide="prev">
                          <span className="fa fa-angle-left" aria-hidden="true"></span>
                        </a>
                        <a className="carousel-control-next" href="#carouselExampleControls" role="button" data-slide="next">
                          <span className="fa fa-angle-right" aria-hidden="true"></span>
                        </a>
                      </div>
                    </div>
                  </Panel>
                </Collapse>
              </div>
            </div>
          </div>

          {/* images list */}
          <div className="sf-card mt-4 no-shadow">
            <div className="job-abaf-table">
              <Table columns={columns} pagination={{ pageSize: 4 }} dataSource={
                jobReports.map((report, index) => {
                  return {
                    key: index,
                    locationPicDetails: <div className="location-pic-dtl"><div className="loc-pic">
                      {report.location_photo && report.location_photo.length > 0 ? <img src={filePath + JSON.parse(report.location_photo)[0]} /> : null}
                      <span className="job-pre-tag">Area Photo</span>
                    </div>
                      <div className="loc-name">
                        <h3>{report.area}</h3>
                        <span>{report.note && report.note}</span>
                      </div>
                      <div className="ab-images">
                        <div className="loc-pic">
                          {report.before_photo && JSON.parse(report.before_photo).length > 0 ?
                            <img src={filePath + JSON.parse(report.before_photo)[0]} /> : null}
                          <span className="job-pre-tag">Before</span>
                        </div>
                        <div className="loc-pic">
                          {report.after_photo && JSON.parse(report.after_photo).length > 0 ? <img src={filePath + JSON.parse(report.after_photo)[0]} /> : null}
                          <span className="job-pre-tag">After</span>
                        </div></div></div>,
                  }
                })
              } showHeader={false} />
            </div>
          </div>
        </div>

        {/* save and preview button */}
        <div className="jdp-footer">
          <div className="all-btn d-flex justify-content-end mt-5 sc-doc-bnt">
            {/* <div className="btn-hs-icon">
              <button type="submit" className="bnt bnt-active" onClick={() => {
                
                this.props.history.replace('/dashboard/jobEmail')
              }
              }>
                {Strings.email_job_docs_bnt}</button>
            </div> */}
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
    jobReports: state.sAJobMgmt.jobReports,
    filePath: state.sAJobMgmt.filePath,
  }
}

const mapDispatchToprops = dispatch => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(PreviewJobReport);