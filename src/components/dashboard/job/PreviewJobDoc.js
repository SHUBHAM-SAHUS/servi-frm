import React from 'react';
import { Modal, Icon, Dropdown, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { Strings } from '../../../dataProvider/localize';
import * as actions from '../../../actions/scopeDocActions';
import * as jobDocAction from '../../../actions/jobDocAction';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { abbrivationStr } from '../../../utils/common';
class PreviewJobDoc extends React.Component {
  job_doc_no
  constructor(props) {
    super(props);
    this.state = { staffList: [], certificates: [], visibleImage: false, imageUrl: null, licienceDetails: {}, visibleLicienceDetails: false, jobDocNumber: '', imageName: null, }
  }

  componentDidMount() {
    console.log(this.props, 'this.propsthis.props')
    if (this.props.job_doc_number) {
      this.setState({ jobDocNumber: this.props.job_doc_number })
      this.props.action.getJobDocsDetails(this.props.job_doc_number)
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
  }

  showImage = (imageName, image) => {
    this.setState({
      imageName: imageName,
      imageUrl: image,
      visibleImage: true,
    });
  };

  handleImageOk = e => {
    this.setState({
      imageUrl: null,
      imageName: null,
      visibleImage: false,
    });
  };

  handleImageCancel = e => {
    this.setState({
      imageUrl: null,
      imageName: null,
      visibleImage: false,
    });
  };

  showPdf = () => {
    this.props.history.push({
      pathname: '/dashboard/jobEmail/emailDocument',
      state: { job_doc_number: this.props.job_doc_number }
    })
  }

  downloadImage = (name, url) => {
    if (name === undefined || name === null) {
      let fileName = url.split('/');
      if (fileName && fileName.length > 0) {
        name = fileName[4]
      }
    }
    let imageUrl = `${url}? t = ${new Date().getTime()}`;
    fetch(imageUrl)
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = name;
          a.click();
        });
      });
  }

  render() {
    var scopeDoc = this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 ? this.props.scopeDocsDetails[0] : {};
    this.job_doc_no = this.props.job_doc_number;
    const { organization } = this.props;
    return (
      <div className="sf-jobdoc-preview">
        <div className="jdp-head">
          <div className="page-mn-hd"><Icon type="arrow-left" onClick={this.props.handleCancel} />
            {organization && organization.logo ? <img src={`${organization.logo}`} alt="img" /> : organization && organization.name ? <strong className="img-abbri-str">{abbrivationStr(organization.name)}</strong> : ''}
          </div>
          <h2 className="page-mn-hd">{Strings.job_document_title}</h2>
          <div class="jdp-c-exp-date">
            <h3>{organization && organization.name ? organization.name : ''}</h3>
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
                    <span>{organization && organization.name ? organization.name : ''}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_abn}</label>
                    <span>{organization && organization.abn_acn ? organization.abn_acn : ''}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.address_txt}</label>
                    <span>{organization && organization.address ? organization.address : ''}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_contact}</label>
                    <span>{organization && organization.primary_person ? organization.primary_person : ''}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_phone}</label>
                    <span>{organization && organization.phone_number ? organization.phone_number : ''}</span>
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

            {scopeDoc && scopeDoc.sites && scopeDoc.sites.length > 0 ? scopeDoc.sites.map(site => {
              return <div className="sf-card-body">
                <div className="data-v-row">
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
                    {site.tasks && site.tasks.length > 0 ? site.tasks.map(task => {
                      return <>
                        <tr>
                          <td>
                            <div className="view-text-value">
                              <label>{task && task.task_name ? task.task_name : ''}</label>
                              <span>{task && task.description ? task.description : ''}</span>
                            </div>
                          </td>
                        </tr>
                      </>
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
              <div className="jbdc-staff-list">
                <div className="jdp-table">
                  <table className="table">
                    <tr>
                      <th>{Strings.job_staff_name_position}</th>
                      {this.props.licenceType && this.props.licenceType.length > 0 ? this.props.licenceType.map(licence => {
                        return <th>{licence && licence.name ? licence.name : ''}</th>
                      }) : ''}
                    </tr>
                    {this.props.previewStaffList && this.props.previewStaffList.length > 0 ? this.props.previewStaffList.map((serviceAgent, index) => {
                      return <>
                        {serviceAgent && serviceAgent.staff_users && serviceAgent.staff_users.length > 0 ? serviceAgent.staff_users.map(staff => {
                          return <tr>
                            {staff && staff.name ? <td>{staff.name + " (" + staff.role_name + ")"}</td> : staff.first_name ? <td>{staff.first_name + " (" + staff.role_name + ")"}</td> : ''}
                            {this.props.licenceType && this.props.licenceType.length > 0 ? this.props.licenceType.map(licence => {
                              if (staff && staff.user_licences && staff.user_licences.length > 0) {
                                let licienceObj = staff.user_licences.filter(item => licence.id == item.type);
                                if (licienceObj && licienceObj.length > 0) {
                                  return <td><div className="inc-actions"> <div className="sli-action">
                                    <a className="sli-download" onClick={() => this.downloadImage(null, licienceObj[0].image)}><i className="material-icons">publish</i></a>
                                    <a className="sli-download" onClick={() => this.showImage("Staff Licenses/Inductions", licienceObj[0].image)}><i className="material-icons">remove_red_eye</i></a>
                                  </div> </div>
                                  </td>
                                } else {
                                  return <td></td>
                                }
                              } else {
                                return <td></td>
                              }
                            }) : ''}
                          </tr>
                        }) : ''} </>
                    }) : ''}
                  </table>
                </div>
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
                  {this.props.previewCertificates && this.props.previewCertificates.length > 0 ? this.props.previewCertificates.map(certificate => {
                    if (certificate && certificate.name && certificate.s3FileUrl) {
                      return <tr>
                        <td>{certificate && certificate.name ? certificate.name : ''}</td>
                        <td>{certificate && certificate.certificate_number ? certificate.certificate_number : ''}</td>
                        <td>{certificate && certificate.expiry_date ? moment(certificate.expiry_date).format('DD/MM/YYYY') : ''}</td>
                        <td>
                          <div className="inc-actions">
                            <div className="sli-action">
                              <a className="sli-download" onClick={() => this.downloadImage(certificate.name, certificate.s3FileUrl)}><i className="material-icons">publish</i></a>
                              <a className="sli-download" onClick={() => this.showImage("Insurance Certificates & SWMS", certificate.s3FileUrl)}><i className="material-icons">remove_red_eye</i></a>
                            </div>
                          </div>
                        </td>
                      </tr>
                    }
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
                  {this.props.formValues.schedule && this.props.formValues.schedule.length > 0 ? this.props.formValues.schedule.map(scheduleObject => {
                    return <tr>
                      <td>{scheduleObject && scheduleObject.date && scheduleObject.date ? moment(scheduleObject.date).format('DD/MM/YYYY') : ''}</td>
                      <td>{scheduleObject && scheduleObject.start && scheduleObject.start ? typeof scheduleObject.start === 'object' ? moment(scheduleObject.start).format("HH:mm:ss") : scheduleObject.start : ''}</td>
                      <td>{scheduleObject && scheduleObject.finish && scheduleObject.finish ? typeof scheduleObject.finish === 'object' ? moment(scheduleObject.finish).format("HH:mm:ss") : scheduleObject.finish : ''}</td>
                      <td>{scheduleObject && scheduleObject.scope && scheduleObject.scope ? scheduleObject.scope : ''}</td>
                      <td>{scheduleObject && scheduleObject.area && scheduleObject.area ? scheduleObject.area : ''}</td>
                      <td>{scheduleObject && scheduleObject.site_requirements ? scheduleObject.site_requirements : ''}</td>
                    </tr>
                  }) : ''}
                </table>
              </div>

              {/* Add notes here */}
              <div className="row">
                <div className="col-md-8 col-sm-8 col-xs-12">
                  <div className="jdp-notes mt-4">
                    <h2 className="jdp-note-title">Notes</h2>
                    {this.props.formValues.note ? this.props.formValues.note : ''}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* save and preview button */}
        <div className="jdp-footer">
          <div className="all-btn d-flex justify-content-end mt-5 sc-doc-bnt">
            <div className="btn-hs-icon">
              <button type="submit" className="bnt bnt-active" onClick={this.showPdf}>{Strings.email_job_docs_bnt}</button>
            </div>
          </div>
        </div>


        {/* certificate image Modal */}
        <Modal
          title={this.state.imageName}
          visible={this.state.visibleImage}
          onOk={this.handleImageOk}
          onCancel={this.handleImageCancel}
          cancelButtonProps={{ style: { display: 'none' } }}
        >
          {this.state.imageUrl && (this.state.imageUrl.includes(".pdf") || this.state.imageUrl.includes(".PDF")) ? <embed src={this.state.imageUrl} frameborder="0" width="100%" height="400px" /> : <img src={this.state.imageUrl ? this.state.imageUrl : ''} alt="img" />}
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  var value = state.scopeDocs && state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : null;
  return {
    selectedScopeDoc: (value ? value : {}),
    scopeDocsDetails: state.scopeDocs.scopeDocsDetails,
    licenceType: state.profileManagement.licenceType,
    jobDocsDetails: state.scopeDocs && state.scopeDocs.jobDocsDetails,
    organization: state.organization.organizationDetails,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    jobDocAction: bindActionCreators(jobDocAction, dispatch)
  }
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToprops))(PreviewJobDoc);
