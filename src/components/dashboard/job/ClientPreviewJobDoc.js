import React from 'react';
import { Dropdown, notification, Modal } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import moment from 'moment';
import { withRouter } from 'react-router-dom';

import { Strings } from '../../../dataProvider/localize';
import * as actions from '../../../actions/jobDocAction';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { abbrivationStr } from '../../../utils/common';

class ClientPreviewJobDoc extends React.Component {
    constructor(props) {
        super(props);
        this.state = { jobDocDetails: {}, imageUrl: '', visibleImage: false, imageName: '' }
    }

    componentDidMount() {
        const query = new URLSearchParams(this.props.location.search);
        if (query.get('job_doc_no')) {
            this.props.action.getJobDetailsForClientPreview(query.get('job_doc_no'))
                .then(jobDoc => {
                    if (jobDoc && jobDoc.length > 0) {
                        this.setState({ jobDocDetails: jobDoc[0] });
                    }
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

    render() {
        const { jobDocDetails } = this.state;
        return (
            <div className="sf-jobdoc-preview">
                <div className="jdp-head">
                    <div className="page-mn-hd">{jobDocDetails && jobDocDetails.org_logo ? <img src={`${jobDocDetails.org_logo}`} alt="img" /> : jobDocDetails && jobDocDetails.org_name ? <strong className="img-abbri-str">{abbrivationStr(jobDocDetails.org_name)} </strong> : ''} </div>
                    <h2 className="page-mn-hd">{Strings.job_document_title}</h2>
                    <div class="jdp-c-exp-date">
                        <h3>{jobDocDetails && jobDocDetails.org_name ? jobDocDetails.org_name : ''}</h3>
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
                                        <span>{jobDocDetails && jobDocDetails.org_name ? jobDocDetails.org_name : ''}</span>
                                    </div>
                                </div>
                                <div className="data-v-col">
                                    <div className="view-text-value">
                                        <label>{Strings.client_abn}</label>
                                        <span>{jobDocDetails && jobDocDetails.org_abn_acn ? jobDocDetails.org_abn_acn : ''}</span>
                                    </div>
                                </div>
                                <div className="data-v-col">
                                    <div className="view-text-value">
                                        <label>{Strings.address_txt}</label>
                                        <span>{jobDocDetails && jobDocDetails.org_address ? jobDocDetails.org_address : ''}</span>
                                    </div>
                                </div>
                                <div className="data-v-col">
                                    <div className="view-text-value">
                                        <label>{Strings.client_contact}</label>
                                        <span>{jobDocDetails && jobDocDetails.org_primary_person ? jobDocDetails.org_primary_person : ''}</span>
                                    </div>
                                </div>
                                <div className="data-v-col">
                                    <div className="view-text-value">
                                        <label>{Strings.client_phone}</label>
                                        <span>{jobDocDetails && jobDocDetails.org_phone_number ? jobDocDetails.org_phone_number : ''}</span>
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

                        {jobDocDetails && jobDocDetails.quote && jobDocDetails.quote.scope_doc && jobDocDetails.quote.scope_doc.scope_docs_sites && jobDocDetails.quote.scope_doc.scope_docs_sites.length > 0 ? jobDocDetails.quote.scope_doc.scope_docs_sites.map(site => {
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
                                        {site && site.site && site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map(task => {
                                            return task && task.parent_id !== null && task.split_status !== "O" ? null :
                                                <tr>
                                                    <td>
                                                        <div className="view-text-value">
                                                            <label>{task && task.task_name ? task.task_name : ''}</label>
                                                            <span>{task && task.description ? task.description : ''}</span>
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
                            <div className="jbdc-staff-list">
                                <div className="jdp-table">
                                    <table className="table">
                                        <tr>
                                            <th>{Strings.job_staff_name_position}</th>
                                            {jobDocDetails && jobDocDetails.licience_types && jobDocDetails.licience_types.length > 0 ? jobDocDetails.licience_types.map(licence => {
                                                return <th>{licence && licence.name ? licence.name : ''}</th>
                                            }) : ''}
                                        </tr>
                                        {jobDocDetails && jobDocDetails.job_allocated_users && jobDocDetails.job_allocated_users.length > 0 ? jobDocDetails.job_allocated_users.map((user, index) => {
                                            return <tr>
                                                {user && user.organisation_user ? <td>{user.organisation_user.first_name + " (" + user.organisation_user.role_name + ")"}</td> : ''}
                                                {jobDocDetails && jobDocDetails.licience_types && jobDocDetails.licience_types.length > 0 ? jobDocDetails.licience_types.map(licence => {
                                                    if (user && user.user_license && user.user_license.length > 0) {
                                                        let licienceObj = user.user_license.filter(item => licence.id == item.type);
                                                        if (licienceObj && licienceObj.length > 0) {
                                                            return <td><div className="inc-actions"> <div className="sli-action">
                                                                <a className="sli-download" onClick={() => this.downloadImage(licienceObj[0].image, licienceObj[0].licence_file)}><i className="material-icons">publish</i></a>
                                                                <a className="sli-download" onClick={() => this.showImage("Staff Licenses/Inductions", licienceObj[0].licence_file)}><i className="material-icons">remove_red_eye</i></a>
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
                                    {jobDocDetails && jobDocDetails.job_doc_orgs_certificates && jobDocDetails.job_doc_orgs_certificates.length > 0 ? jobDocDetails.job_doc_orgs_certificates.map(certificate => {
                                        if (certificate && certificate.orgs_certificate && certificate.orgs_certificate.name && certificate.orgs_certificate.certificate_file) {
                                            return <tr>
                                                <td>{certificate && certificate.orgs_certificate && certificate.orgs_certificate.name ? certificate.orgs_certificate.name : ''}</td>
                                                <td>{certificate && certificate.orgs_certificate && certificate.orgs_certificate.certificate_number ? certificate.orgs_certificate.certificate_number : ''}</td>
                                                <td>{certificate && certificate.orgs_certificate && certificate.orgs_certificate.expiry_date ? moment(certificate.orgs_certificate.expiry_date).format('DD/MM/YYYY') : ''}</td>
                                                <td>
                                                    <div className="inc-actions">
                                                        <div className="sli-action">
                                                            <a className="sli-download" onClick={() => this.downloadImage(certificate.orgs_certificate.name, certificate.orgs_certificate.certificate_file)}><i className="material-icons">publish</i></a>
                                                            <a className="sli-download" onClick={() => this.showImage("Insurance Certificates & SWMS", certificate.orgs_certificate.certificate_file)}><i className="material-icons">remove_red_eye</i></a>
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
                                    {jobDocDetails && jobDocDetails.job_doc_schedules && jobDocDetails.job_doc_schedules.length > 0 ? jobDocDetails.job_doc_schedules.map(scheduleObject => {
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
                                        {jobDocDetails && jobDocDetails.note ? jobDocDetails.note : ''}
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
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        jobDocsDetails: state.scopeDocs && state.scopeDocs.jobDocsDetails,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch)
    }
}

export default compose(withRouter, connect(mapStateToProps, mapDispatchToprops))(ClientPreviewJobDoc);
