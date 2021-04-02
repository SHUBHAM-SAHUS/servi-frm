import React from 'react';
import { Modal, Dropdown, notification } from 'antd';
import { Strings } from '../../../../dataProvider/localize';
import { connect } from 'react-redux';
import moment from 'moment';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { pdf } from '@react-pdf/renderer';
import JobDocPdf from "../JobDocPdf";
import * as actions from '../../../../actions/scopeDocActions';
import { ERROR_NOTIFICATION_KEY } from '../../../../config';

class Preview extends React.Component {
  job_doc_no
  constructor(props) {
    super(props);
    this.state = { staffList: [], certificates: [], visibleImage: false, imageUrl: null }

    const query = new URLSearchParams(this.props.location.search);
    this.job_doc_no = query.get('job_doc_no');

    // this.job_doc_no = 'JQSK1001909100001189'

  }

  componentDidUpdate(prevProps, prevState) {

  }

  componentDidMount() {
    this.props.action.getJobDocsDetails(this.job_doc_no)
      .then(data => {
      }).catch(error => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: error ? error : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        })
      });
  }

  showImage = (image) => {
    this.setState({
      imageUrl: image,
      visibleImage: true,
    });
  };

  handleImageOk = e => {
    this.setState({
      imageUrl: null,
      visibleImage: false,
    });
  };

  handleImageCancel = e => {
    this.setState({
      imageUrl: null,
      visibleImage: false,
    });
  };

  // printDocument() {
  //   var obj = pdf(<JobDocPdf
  //     selectedScopeDoc={this.props.selectedScopeDoc}
  //     staffList={this.state.staffList}
  //     certificates={this.state.certificates}
  //     schedule={this.props.formValues && this.props.formValues.schedule ? this.props.formValues.schedule : []}
  //     notes={this.props.formValues && this.props.formValues.note ? this.props.formValues.note : ''}
  //   />).toBlob();
  //   obj.then(function (blob) {
  //     var url = URL.createObjectURL(blob);
  //     window.open(url, '_blank');
  //     return Promise.resolve(blob)
  //   }).then((res) => {
  //     this.blobData = res
  //   })
  // }

  // showPdf = () => {
  //   this.printDocument()
  // }

  render() {
    const { jobDocsDetails } = this.props;

    return (
      <div className="sf-jobdoc-preview">
        <div className="jdp-head">
          {jobDocsDetails && jobDocsDetails.org_logo ? <img src={jobDocsDetails.org_logo} alt="img" /> : ''}
          <h2 className="page-mn-hd">{Strings.job_document_title}</h2>
          <div class="jdp-c-exp-date">
            <h3>{jobDocsDetails && jobDocsDetails.org_name ? jobDocsDetails.org_name : ''}</h3>
            <h5>{jobDocsDetails && jobDocsDetails.job_doc_link_validity && jobDocsDetails.validity_unit ? `${Strings.link_expire_day} ${jobDocsDetails.job_doc_link_validity} ${jobDocsDetails.validity_unit}` : ''}</h5>
          </div>
        </div>
        <div className="sf-card-wrap">
          {/* Contractor Details */}
          <div className="sf-card">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.contractor_details}</h2>
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
                    <label>{Strings.client_company}</label>
                    <span>{jobDocsDetails && jobDocsDetails.quote && jobDocsDetails.quote.client && jobDocsDetails.quote.client && jobDocsDetails.quote.client.name ? jobDocsDetails.quote.client.name : ''}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_abn}</label>
                    <span>{jobDocsDetails && jobDocsDetails.quote && jobDocsDetails.quote.client && jobDocsDetails.quote.client.abn_acn ? jobDocsDetails.quote.client.abn_acn : ''}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.address_txt}</label>
                    <span>{jobDocsDetails && jobDocsDetails.quote && jobDocsDetails.quote.client && jobDocsDetails.quote.client.address ? jobDocsDetails.quote.client.address : ''}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_contact}</label>
                    <span>{jobDocsDetails && jobDocsDetails.quote && jobDocsDetails.quote.client && jobDocsDetails.quote.client.contact_person_name ? jobDocsDetails.quote.client.contact_person_name : ''}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_phone}</label>
                    <span>{jobDocsDetails && jobDocsDetails.quote && jobDocsDetails.quote.client && jobDocsDetails.quote.client.contact_person_phone ? jobDocsDetails.quote.client.contact_person_phone : ''}</span>
                  </div>
                </div>
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

            {jobDocsDetails && jobDocsDetails.quote && jobDocsDetails.quote.scope_doc && jobDocsDetails.quote.scope_doc.scope_docs_sites
              && jobDocsDetails.quote.scope_doc.scope_docs_sites.length > 0 ? jobDocsDetails.quote.scope_doc.scope_docs_sites.map(site => {
                return <div className="sf-card-body">
                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.job_name}</label>
                        <span>{site && site.site && site.site.job_name ? site.site.job_name : ''}</span>
                      </div>
                    </div>
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

                  <div className="service-table">
                    <table className="table">
                      {site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map(task => {
                        return <tr>
                          <td>
                            <div className="view-text-value">
                              <label>{task && task.task_name ? task.task_name : ''}</label>
                              <span>{task && task.description ? task.description : ''}</span>
                            </div>
                          </td>
                          <td>
                            <div className="view-text-value" id="sfPopOver">
                              <label>{Strings.job_service_agent}</label>
                              <span>{task && task.service_agent && task.service_agent.name ? task.service_agent.name : ''}</span>
                            </div>
                          </td>
                        </tr>
                      }) : ''}
                    </table>
                  </div>
                </div>

              }) : ''}
          </div>

          {/* Staff Licenses/Inductions */}
          <div className="sf-card mt-4">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.job_staff_licenses_inductions}</h2>
              <div className="info-btn disable-dot-menu">
                <Dropdown className="more-info" disabled>
                  <i className="material-icons">more_vert</i>
                </Dropdown>
              </div>
            </div>
            <div className="sf-card-body">
              <div className="jdp-table">
                <table className="table">
                  <tr>
                    <th>{Strings.job_staff_name_position}</th>
                  </tr>
                  {jobDocsDetails && jobDocsDetails.job_allocated_users && jobDocsDetails.job_allocated_users.length > 0 ? jobDocsDetails.job_allocated_users.map(staff => {
                    return <tr>
                      {staff && staff.organisation_user && staff.organisation_user.first_name ?
                        <td>{staff.organisation_user.first_name}({staff && staff.organisation_user
                          && staff.organisation_user.role_name ? staff.organisation_user.role_name : ''})</td> : ''}
                      {/* {staff && staff.organisation_user && staff.organisation_user.role_name ? <td>{staff.organisation_user.role_name}</td> : staff.organisation_user.role_name ? <td>{staff.organisation_user.role_name}</td> : ''} */}
                    </tr>
                  }) : ''}
                </table>
              </div>
            </div>
          </div>

          {/* Insurance Certificates & SWMS */}
          <div className="sf-card mt-4">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.job_doc_insurance_certificate}</h2>
              <div className="info-btn disable-dot-menu">
                <Dropdown className="more-info" disabled>
                  <i className="material-icons">more_vert</i>
                </Dropdown>
              </div>
            </div>
            <div className="sf-card-body">
              <div className="jdp-table">
                <table className="table">
                  <tr>
                    <th>Type</th>
                    <th>Number </th>
                    <th>Expiry Date</th>
                    <th>Action</th>
                  </tr>
                  {jobDocsDetails && jobDocsDetails.job_doc_orgs_certificates && jobDocsDetails.job_doc_orgs_certificates.length > 0 ? jobDocsDetails.job_doc_orgs_certificates.map(certificate => {
                    return <tr>
                      <td>{certificate && certificate.orgs_certificate && certificate.orgs_certificate.name ? certificate.orgs_certificate.name : ''}</td>
                      <td>{certificate && certificate.orgs_certificate && certificate.orgs_certificate.certificate_number ? certificate.orgs_certificate.certificate_number : ''}</td>
                      <td>{certificate && certificate.orgs_certificate && certificate.orgs_certificate.expiry_date ? moment(certificate.orgs_certificate.expiry_date).format('DD/MM/YYYY') : ''}</td>
                      <td>
                        <div className="sli-action">
                          <Link className="sli-download" to={certificate.orgs_certificate.certificate_file} target="_blank" download><i className="material-icons">publish</i></Link>
                          <button type="button" onClick={() => this.showImage(certificate.orgs_certificate.certificate_file)}><i className="material-icons">remove_red_eye</i></button>
                        </div>
                      </td>
                    </tr>
                  }) : ''}
                </table>
              </div>
            </div>
          </div>

          {/* Schedule */}
          <div className="sf-card mt-4">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">Schedule</h2>
              <div className="info-btn disable-dot-menu">
                <Dropdown className="more-info" disabled>
                  <i className="material-icons">more_vert</i>
                </Dropdown>
              </div>
            </div>
            <div className="sf-card-body">
              <div className="jdp-table">
                <table className="table">
                  <tr>
                    <th>{Strings.job_date}</th>
                    <th>{Strings.job_start} </th>
                    <th>{Strings.job_finish}</th>
                    <th>{Strings.job_scope}</th>
                    <th>{Strings.job_area}</th>
                    <th>{Strings.job_site_requirements}</th>
                  </tr>
                  {jobDocsDetails && jobDocsDetails.job_doc_schedules && jobDocsDetails.job_doc_schedules.length > 0 ? jobDocsDetails.job_doc_schedules.map(schedule => {
                    return <tr>
                      <td>{schedule && schedule.date && schedule.date ? moment(schedule.date).format('DD/MM/YYYY') : ''}</td>
                      <td>{schedule && schedule.start && schedule.start ? schedule.start : ''}</td>
                      <td>{schedule && schedule.finish && schedule.finish ? schedule.finish : ''}</td>
                      <td>{schedule && schedule.scope && schedule.scope ? schedule.scope : ''}</td>
                      <td>{schedule && schedule.area && schedule.area ? schedule.area : ''}</td>
                      <td>{schedule && schedule.site_requirements ? schedule.site_requirements : ''}</td>
                    </tr>
                  }) : ''}
                </table>
              </div>

              {/* Add notes here */}
              <div className="row">
                <div className="col-md-8 col-sm-8 col-xs-12">
                  <div className="jdp-notes mt-4">
                    <h2 className="jdp-note-title">Notes</h2>
                    {jobDocsDetails && jobDocsDetails.note ? jobDocsDetails.note : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* save and preview button */}
        {/* <div className="jdp-footer">
          <div className="all-btn d-flex justify-content-end mt-5 sc-doc-bnt"> */}
        {/* <div className="btn-hs-icon">
              <button type="submit" className="bnt bnt-normal" onClick={this.showPdf}>Open PDF</button>
            </div> */}
        {/* <div className="btn-hs-icon">
              <button type="submit" className="bnt bnt-active" onClick={() => {
                this.props.history.replace('/dashboard/jobEmail')
              }}>{Strings.email_job_docs_bnt}</button>
            </div>
          </div>
        </div> */}


        {/* certificate image Modal */}
        <Modal
          title="Insurance Certificates and SWMS"
          visible={this.state.visibleImage}
          onOk={this.handleImageOk}
          onCancel={this.handleImageCancel}
        >
          <img src={this.state.imageUrl ? this.state.imageUrl : ''} alt="img" />

        </Modal>

      </div>
    );
  }
}

const mapStateToProps = (state) => {

  return {
    jobDocsDetails: state.scopeDocs && state.scopeDocs.jobDocsDetails
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}
export default withRouter(connect(mapStateToProps, mapDispatchToprops)(Preview));
