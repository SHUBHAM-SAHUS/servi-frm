import React from 'react';
import { pdf } from '@react-pdf/renderer';
import { notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { Strings } from '../../../dataProvider/localize';
import JobDocPdf from "./JobDocPdf";
import * as actions from '../../../actions/scopeDocActions';
import * as jobDocAction from '../../../actions/jobDocAction';
import { ERROR_NOTIFICATION_KEY } from '../../../config';

class HistoryJobDoc extends React.Component {
  job_doc_no
  constructor(props) {
    super(props);
    this.state = {
      staffList: [],
      certificates: [],
      visibleImage: false,
      imageUrl: null,
      licenceDetails: {},
      visibleLicenceDetails: false,
      jobDocNumber: ''
    }
  }

  static getDerivedStateFromProps = (props, state) => {
    console.log(props.previewStaffList)
  }

  componentDidMount() {
    if (this.props.job_doc_number) {
      this.setState({ jobDocNumber: this.props.job_doc_number })
      this.props.action.getJobDocsDetails(this.props.job_doc_number)
        .then(data => {

        })
        .catch(error => {
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

  printDocument() {
    var obj = pdf(
      <JobDocPdf
        jobDocsDetails={this.props.jobDocsDetails}
        licenceType={this.props.licenceType}
        staffList={this.props.previewStaffList}
        organization={this.props.organization}
      />).toBlob();

    obj.then(function (blob) {
      return Promise.resolve(blob)
    })
      .then((res) => {
        this.blobData = res
        var newFormData = new FormData();
        if (this.props.job_doc_number) {
          newFormData.append('job_doc_no', this.props.job_doc_number);
          newFormData.append('job_doc', res);
          this.props.jobDocAction.uploadJobDocPdf(newFormData)
            .then((data) => {
              if (data.data.job_doc_details.job_doc_number) {
                this.props.history.push({
                  pathname: '/dashboard/jobEmail/emailDocument',
                  state: { job_doc_number: data.data.job_doc_details.job_doc_number }
                })
              }
            })
            .catch(message => {
              notification.error({
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
              })
            });
        }
      })
  }

  showPdf = () => {
    this.printDocument();
  }

  downloadImage = (name, url) => {
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


  viewLicenceDetails = (licenceObj) => {
    if (licenceObj) {
      this.setState({
        licenceDetails: licenceObj,
        visibleLicenceDetails: true,
      });
    }
  }

  handleLicenceDetailsOk = e => {
    this.setState({
      licenceDetails: null,
      visibleLicenceDetails: false,
    });
  };

  handleLicenceDetailsCancel = e => {
    this.setState({
      licenceDetails: null,
      visibleLicenceDetails: false,
    });
  };

  render() {

    const { versionHistory } = this.props
    const currentVersionAllDetails = this.props.versionHistory.job_doc_data[0]
    const currentVersionOrgDetails = currentVersionAllDetails.organisation_detail
    // const currentVersionClientDetails = currentVersionAllDetails.quote.client
    const currentVersionSitesList = currentVersionAllDetails.quote.scope_doc.scope_docs_sites
    const currentVersionCertificates = currentVersionAllDetails.job_doc_orgs_certificates

    // var scopeDoc = this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 ? this.props.scopeDocsDetails[0] : {};
    this.job_doc_no = this.props.job_doc_number;
    // const { organization } = this.props;
    return (
      <div className="sf-jobdoc-preview sf-history-preview">
        <div className="jdp-big-cntr-head pt-5">
          <h1>{versionHistory.job_doc_number} - {versionHistory.version}</h1>
        </div>
        <div className="sf-card-wrap pt-0">
          {/* Contractor Details */}
          <div className="sf-card">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.contractor_details}</h2>
            </div>
            <div className="sf-card-body">
              <div className="data-v-row">
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_company}</label>
                    <span>{currentVersionOrgDetails.name}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_abn}</label>
                    <span>{currentVersionOrgDetails.abn_acn}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.address_txt}</label>
                    <span>{currentVersionOrgDetails.address}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_contact}</label>
                    <span>{currentVersionOrgDetails.primary_person}</span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{Strings.client_phone}</label>
                    <span>{currentVersionOrgDetails.phone_number}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Service Details */}
          <div className="sf-card mt-4">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.job_service_details}</h2>
            </div>

            {
              currentVersionSitesList.length > 0
                ? currentVersionSitesList.map(site => {
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
                        {
                          site.site.tasks && site.site.tasks.length > 0
                            ? site.site.tasks.map(task => {
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
                            })
                            : ''
                        }
                      </table>
                    </div>
                  </div>
                })
                : ''
            }
          </div>

          {/* Staff Licenses/Inductions */}
          <div className="sf-card mt-4">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.job_staff_licenses_inductions}</h2>
            </div>
            <div className="sf-card-body">
              <div className="jbdc-staff-list">
                <div className="jdp-table">
                  <table className="table">
                    <tr>
                      <th>{Strings.job_staff_name_position}</th>
                      {
                        this.props.licenceType && this.props.licenceType.length > 0
                          ? this.props.licenceType.map(licence => {
                            return <th>
                              {
                                licence && licence.name
                                  ? licence.name
                                  : ''
                              }
                            </th>
                          }) : ''
                      }
                    </tr>
                    {
                      this.props.previewStaffList && this.props.previewStaffList.length > 0 ? this.props.previewStaffList.map((serviceAgent, index) => {
                        console.log(serviceAgent)
                        return <>
                          {
                            serviceAgent && serviceAgent.staff_users && serviceAgent.staff_users.length > 0
                              ? serviceAgent.staff_users.map(staff => {
                                return <tr>
                                  {
                                    staff && staff.name
                                      ? <td>{staff.name + " (" + staff.role_name + ")"}</td>
                                      : staff.first_name
                                        ? <td>{staff.first_name + " (" + staff.role_name + ")"}</td>
                                        : ''
                                  }
                                  {
                                    this.props.licenceType && this.props.licenceType.length > 0
                                      ? this.props.licenceType.map(licence => {
                                        if (staff && staff.user_licences && staff.user_licences.length > 0) {
                                          let licenceObj = staff.user_licences.filter(item => licence.id == item.type);
                                          if (licenceObj && licenceObj.length > 0) {
                                            return <td><span>{
                                              licenceObj && licenceObj[0].expiry_date
                                                ? moment(licenceObj[0].expiry_date).format('MMM YYYY')
                                                : ''
                                            }</span>
                                            </td>
                                          } else {
                                            return <td></td>
                                          }
                                        } else {
                                          return <td></td>
                                        }
                                      })
                                      : ''
                                  }
                                </tr>
                              })
                              : ''
                          }
                        </>
                      })
                        : ''
                    }
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Insurance Certificates & SWMS */}
          <div className="sf-card mt-4">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.job_doc_insurance_certificate}</h2>
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
                  {currentVersionCertificates && currentVersionCertificates.length > 0 ? currentVersionCertificates.map(certificate => {
                    if (certificate && certificate.name && certificate.s3FileUrl);
                    return <tr>
                      <td>{certificate.orgs_certificate && certificate.orgs_certificate.name ? certificate.orgs_certificate.name : ''}</td>
                      <td>{certificate.orgs_certificate && certificate.orgs_certificate.certificate_number ? certificate.orgs_certificate.certificate_number : ''}</td>
                      <td>{certificate.orgs_certificate && certificate.orgs_certificate.expiry_date ? moment(certificate.orgs_certificate.expiry_date).format('DD/MM/YYYY') : ''}</td>
                      {
                        <td>
                          <div className="sli-action">
                            <a className="sli-download" href="#" onClick={() => certificate.orgs_certificate.certificate_file ? this.downloadImage(certificate.orgs_certificate.name, certificate.orgs_certificate.certificate_file) : null}><i className="material-icons">publish</i></a>
                          </div>
                        </td>
                      }
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
                    {currentVersionAllDetails.note}
                  </div>
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
  var value = state.scopeDocs && state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : null;
  return {
    selectedScopeDoc: (value ? value : {}),
    scopeDocsDetails: state.scopeDocs.scopeDocsDetails,
    licenceType: state.profileManagement.licenceType,
    jobDocsDetails: state.scopeDocs && state.scopeDocs.jobDocsDetails,
    organization: state.organization.organizationDetails,
    versionHistory: state.jobdocManagement.jobDocVersionHistory
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    jobDocAction: bindActionCreators(jobDocAction, dispatch)
  }
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToprops))(HistoryJobDoc);