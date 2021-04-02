import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Strings } from '../../../../dataProvider/localize'
import { Icon, Upload, Modal, Collapse, Dropdown, notification, Checkbox } from 'antd';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FormSection } from 'redux-form';
import { goBack, handleFocus, goBackBrowser } from '../../../../utils/common';
import moment from 'moment';
import * as actions from '../../../../actions/SAJobMgmtAction';
import { CustomDatepicker } from '../../../common/customDatepicker';
import { customInput } from '../../../common/custom-input';
import { customTextarea } from '../../../common/customTextarea';
import { CustomCheckbox } from '../../../common/customCheckbox';
import PreviewSignoffSheet from './PreviewSignoffSheet';
import { SignCanvas } from '../../../common/SignCanvas';
import { validate, signedOffByRequired, signedOffDateRequired } from '../../../../utils/Validations/signOffValidation'
import { DeepTrim } from '../../../../utils/common';

import { VALIDATE_STATUS } from '../../../../dataProvider/constant'

const mapRouteToTitle = {
  '/dashboard/reports': 'Reports'
}

const { Panel } = Collapse;

const { Dragger } = Upload;

export class SignOffSheet extends Component {

  constructor(props) {
    super(props);
    this.state = { fileList: [], clientSign: false, fileUploadStatus: false }
  }

  componentDidMount() {
    this.props.action.getJobSignOff(this.props.jobDetails.job_number)
  }

  state = {
    visible: false
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  onSubmit = (formData) => {
    if (this.state.fileList.length > 0 && (document.getElementById("client_signoff_sign").childNodes[0].childNodes[1].childNodes.length === 0)) {

      //Case for only document upload

      formData.id = this.props.signOffDetails.id;
      formData.job_sheet_sign_off_status = 1;
      formData.file_map = [];
      formData.scope_of_work = []

      if (!formData.signed_off_date) {
        formData.signed_off_date = moment(new Date())
      }

      Object.keys(formData.taskSOW).forEach(key => {
        if (formData.taskSOW[key].verb_accept_status) {
          formData.taskSOW[key].verb_accept_status = +formData.taskSOW[key].verb_accept_status
        }
        formData.scope_of_work.push(formData.taskSOW[key]);
      });
      var finalFormData = new FormData();

      finalFormData.job_sheet_sign_off_status = 1;
      finalFormData.append("document", this.state.fileList[0])
      // finalFormData.append("files", this.state.fileList[0])
      formData.file_map.push({ file_type: "document" });
      Object.keys(formData).forEach(key => {
        finalFormData.append(key, JSON.stringify(formData[key]))
      });
      this.props.action.signOffJobSheet(finalFormData, this.props.jobDetails.job_number)
        .then((res) => {
          if (res) {
            notification.success({
              message: Strings.success_title,
              description: res ? res : Strings.success_title, onClick: () => { },
              className: 'ant-success'
            });
          }
        })
        .catch((message) => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error, onClick: () => { },
            className: 'ant-error'
          });
        });
      return;
    }

    if (formData.signed_off_date && formData.client_name && formData.feedback && document.getElementById("client_signoff_sign").childNodes[0].childNodes[1].childNodes.length > 0) {

      //Case for client details filled with signature

      if (document.getElementById("client_signoff_sign").childNodes[0].childNodes[1].childNodes.length === 0) {
        notification.warning({
          message: Strings.warning_title,
          description: "Please sign before saving",
          onClick: () => { },
          className: 'ant-warning'
        });
        return;
      }
      let svgString = new XMLSerializer().serializeToString(document.getElementById("client_signoff_sign").childNodes[0]);
      let canvas = document.getElementById("canvas");
      let ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      let DOMURL = window.self.URL || window.self.webkitURL || window.self;
      let img = new Image();
      let svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
      let url = DOMURL.createObjectURL(svg);
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        let png = canvas.toDataURL("image/png");
        canvas.toBlob((blob) => {
          formData.scope_of_work = []
          Object.keys(formData.taskSOW).forEach(key => {
            if (formData.taskSOW[key].verb_accept_status) {
              formData.taskSOW[key].verb_accept_status = +formData.taskSOW[key].verb_accept_status
            }
            formData.scope_of_work.push(formData.taskSOW[key]);
          });
          formData.file_map = [];
          formData.id = this.props.signOffDetails.id;
          formData.job_sheet_sign_off_status = 1;
          var finalFormData = new FormData();
          if (this.state.fileList.length > 0) {
            finalFormData.append("document", this.state.fileList[0])
            formData.file_map.push({ file_type: "document" });
          }
          if (blob) {
            finalFormData.append("sign", blob);
            formData.file_map.push({ file_type: "sign" });
          }

          formData.verb_accept_status = +formData.verb_accept_status
          Object.keys(formData).forEach(key => {
            finalFormData.append(key, JSON.stringify(formData[key]))
          });
          this.props.action.signOffJobSheet(finalFormData, this.props.jobDetails.job_number)
            .then((res) => {
              if (res) {
                notification.success({
                  message: Strings.success_title,
                  description: res ? res : Strings.success_title, onClick: () => { },
                  className: 'ant-success'
                });
              }
            })
            .catch((message) => {
              notification.error({
                message: Strings.error_title,
                description: message ? message : Strings.generic_error, onClick: () => { },
                className: 'ant-error'
              });
            });
        })

        DOMURL.revokeObjectURL(png);

      };
      img.src = url;
    } else if (document.getElementById("client_signoff_sign").childNodes[0].childNodes[1].childNodes.length !== 0) {
      //Case for client signed and file uploaded
      if (!formData.signed_off_date || !formData.client_name) {
        notification.warning({
          message: Strings.warning_title,
          description: "Please fill in client details",
          onClick: () => { },
          className: 'ant-warning'
        });
        return;
      } else {
        let svgString = new XMLSerializer().serializeToString(document.getElementById("client_signoff_sign").childNodes[0]);
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let DOMURL = window.self.URL || window.self.webkitURL || window.self;
        let img = new Image();
        let svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        let url = DOMURL.createObjectURL(svg);

        img.onload = () => {
          ctx.drawImage(img, 0, 0);
          let png = canvas.toDataURL("image/png");
          canvas.toBlob((blob) => {
            formData.file_map = [];
            formData.id = this.props.signOffDetails.id;
            formData.job_sheet_sign_off_status = 1;
            var finalFormData = new FormData();
            if (this.state.fileList.length > 0) {
              finalFormData.append("document", this.state.fileList[0])
              formData.file_map.push({ file_type: "document" });
            }
            if (blob) {
              finalFormData.append("sign", blob);
              formData.file_map.push({ file_type: "sign" });
            }

            formData.verb_accept_status = +formData.verb_accept_status
            Object.keys(formData).forEach(key => {
              finalFormData.append(key, JSON.stringify(formData[key]))
            });
            this.props.action.signOffJobSheet(finalFormData, this.props.jobDetails.job_number)
              .then((res) => {
                if (res) {
                  notification.success({
                    message: Strings.success_title,
                    description: res ? res : Strings.success_title, onClick: () => { },
                    className: 'ant-success'
                  });
                }
              })
              .catch((message) => {
                notification.error({
                  message: Strings.error_title,
                  description: message ? message : Strings.generic_error, onClick: () => { },
                  className: 'ant-error'
                });
              });
          })
          DOMURL.revokeObjectURL(png);
        }
        img.src = url;
      }

    } else {

      //Case for simply task details filled

      var finalFormData = new FormData();

      formData.scope_of_work = []
      Object.keys(formData.taskSOW).forEach(key => {
        if (formData.taskSOW[key].verb_accept_status) {
          formData.taskSOW[key].verb_accept_status = +formData.taskSOW[key].verb_accept_status
        }
        formData.scope_of_work.push(formData.taskSOW[key]);
      });

      formData.id = this.props.signOffDetails.id;
      formData.job_sheet_sign_off_status = 1;

      Object.keys(formData).forEach(key => {
        finalFormData.append(key, JSON.stringify(formData[key]))
      });
      this.props.action.signOffJobSheet(finalFormData, this.props.jobDetails.job_number)
        .then((res) => {
          if (res) {
            notification.success({
              message: Strings.success_title,
              description: res ? res : Strings.success_title, onClick: () => { },
              className: 'ant-success'
            });
          }
        })
        .catch((message) => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error, onClick: () => { },
            className: 'ant-error'
          });
        });
    }

  }

  onSaveSignature = (status) => {
    if (status !== this.state.clientSign) {
      this.setState({ clientSign: status });
    }
  }

  render() {
    const { signOffDetails, jobDetails, handleSubmit, change, formValues } = this.props;
    const { fileList } = this.state;
    const props = {
      name: 'file',
      multiple: false,
      accept: ".doc, .pdf, .docx",
      onChange: (info) => {
        if (info.file.status == 'removed') {
          return
        }
        this.setState({ fileList: [info.file], fileUploadStatus: true })
      },
      beforeUpload: () => false,
      fileList: fileList,
      onRemove: () => {
        this.setState({ fileList: [], fileUploadStatus: false })
      }
    };
    let verballyAcceptedTasks = true;
    let acceptedByClientDetails = true;
    let verballyAcceptedStatus = false;
    let clientSignStatus = true;

    if (formValues) {
      if (signOffDetails && signOffDetails.quote
        && signOffDetails.quote.scope_doc
        && signOffDetails.quote.scope_doc.scope_docs_sites
        && signOffDetails.quote.scope_doc.scope_docs_sites.length > 0) {
        signOffDetails.quote.scope_doc.scope_docs_sites.map(site => {
          if (site && site.site && site.site.tasks && site.site.tasks.length > 0) {
            site.site.tasks.map(task => {
              if (formValues && formValues['taskSOW'] && formValues['taskSOW'][`taskId_${task.id}`]) {
                if (formValues['taskSOW'][`taskId_${task.id}`] && formValues['taskSOW'][`taskId_${task.id}`]['verb_accept_status']) {
                } else {
                  verballyAcceptedTasks = false;
                }
              }
            })
          }
        })
      }
      if (formValues.client_name && formValues.signed_off_date && formValues.verb_accept_status) {
        acceptedByClientDetails = false;
      }

      if (this.state.clientSign) {
        if (formValues.client_name && formValues.signed_off_date) {
          clientSignStatus = false;
        }
      }
    }

    if (verballyAcceptedTasks === false) {
      verballyAcceptedStatus = true;
    }
    if (Boolean(signOffDetails.job_sheet_sign_off_status)) {
      verballyAcceptedStatus = true;
    }

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
                : Strings.job_sign_off_sheet
            }
          </h2>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="sf-card-wrap">
              <div className="sf-card scope-v-value">
                <div className="sf-card-head">
                  <div className="quote view-jd-history">
                    <Collapse className="show-frquency-box" bordered={false} accordion
                      expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                      <Panel header="View History" key="1">
                      </Panel>
                    </Collapse>
                  </div>
                </div>
              </div>

              {/* job details */}
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
                  <div className="row">
                    <div className="col-md-10">
                      <h3 className="sf-big-hd">{jobDetails.org_details && jobDetails.org_details.name}</h3>
                      <div className="data-v-row">
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.abn}</label>
                            <span>{jobDetails.org_details && jobDetails.org_details.abn_acn}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.phone}</label>
                            <span>{jobDetails.org_details && jobDetails.org_details.contact_person_phone}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.email_txt}</label>
                            <span>{jobDetails.org_details && jobDetails.org_details.contact_person_email}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.address_txt}</label>
                            <span>{jobDetails.org_details && jobDetails.org_details.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="co-logo">
                        {jobDetails.org_details && jobDetails.org_details.client_logo ? <img src={jobDetails.org_details.client_logo} /> : null}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Scope of Work */}
              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.scope_of_work}</h2>
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>
                <FormSection name='taskSOW'>
                  {signOffDetails.quote
                    && signOffDetails.quote.scope_doc
                    && signOffDetails.quote.scope_doc.scope_docs_sites
                    && signOffDetails.quote.scope_doc.scope_docs_sites.length > 0 ? signOffDetails.quote.scope_doc.scope_docs_sites.map(site => {

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
                        <div className="service-table"> {/* task details */}
                          {site && site.site && site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map(task => {
                            change(`taskSOW.taskId_${task.id}.id`, task.id);
                            if (!(formValues.taskSOW && formValues.taskSOW[`taskId_${task.id}`] && formValues.taskSOW[`taskId_${task.id}`].verb_accept_status)) {
                              change(`taskSOW.taskId_${task.id}.verb_accept_status`);
                            }
                            return <div className="scope-of-work">
                              <div className="site-s-body verbally-accpt">
                                <div className="row">
                                  <div className="col-md-8">
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
                                    <div className="view-text-value sco-note">
                                      <label>Notes</label>
                                      <span>{task && task.note ? task.note : ''}</span>
                                    </div>
                                  </div>
                                  <div className="col-md-4 col-sm-12">
                                    <FormSection name={`taskId_${task.id}`}>
                                      <div className="vrbl-acc-content">
                                        {
                                          signOffDetails.job_sheet_sign_off_status === 0 ? task.verb_accept_status
                                            ? <fieldset className="sf-form form-group">
                                              <Field name="verb_accept_status" label="Verbally Accepted" checked={Boolean(task.verb_accept_status)} disabled component={CustomCheckbox} />
                                            </fieldset> : <fieldset className="sf-form form-group">
                                              <Field name="verb_accept_status" label="Verbally Accepted" component={CustomCheckbox} />
                                            </fieldset>
                                            : signOffDetails.job_sheet_sign_off_status === 1 && task.verb_accept_status
                                              ? <fieldset className="sf-form form-group">
                                                <Field name="verb_accept_status" label="Verbally Accepted" checked={Boolean(task.verb_accept_status)} disabled component={CustomCheckbox} />
                                              </fieldset> : null
                                        }

                                        <div className="row w-100 text-right">
                                          {
                                            signOffDetails.job_sheet_sign_off_status === 0 ? task.verb_accept_status ? <>
                                              <div className="col-md-6 col-sm-12">
                                                <div className="view-text-value">
                                                  <label>{Strings.name_txt}</label>
                                                  <span>{task.signed_off_name}</span></div>
                                              </div>
                                              <div className="col-md-6 col-sm-12">
                                                <div className="view-text-value">
                                                  <label>{Strings.date_txt}</label>
                                                  <span>{moment(task.signed_of_date).format("DD/MM/YYYY")}</span></div>
                                              </div>
                                            </> : formValues.taskSOW && formValues.taskSOW[`taskId_${task.id}`] && formValues.taskSOW[`taskId_${task.id}`].verb_accept_status
                                                ? <>
                                                  <div className="col-md-6 col-sm-12">
                                                    <fieldset className="sf-form form-group">

                                                      <Field
                                                        name="signed_off_by"
                                                        label={Strings.name_txt}
                                                        type="text"
                                                        validate={signedOffByRequired}
                                                        component={customInput} />

                                                    </fieldset>
                                                  </div>
                                                  <div className="col-md-6 col-sm-12">
                                                    <fieldset className="sf-form form-group  lsico">

                                                      <Field
                                                        name="signed_of_date"
                                                        label={Strings.date_txt}
                                                        validate={signedOffDateRequired}
                                                        placeholder={moment(new Date()).format("MM-DD-YYYY")}
                                                        component={CustomDatepicker} />

                                                    </fieldset>
                                                  </div>
                                                </>
                                                : null :
                                              signOffDetails.job_sheet_sign_off_status === 1
                                                ? task.verb_accept_status ? <>
                                                  <div className="col-md-6 col-sm-12">
                                                    <div className="view-text-value">
                                                      <label>{Strings.name_txt}</label>
                                                      <span>{task.signed_off_name}</span></div>
                                                  </div>
                                                  <div className="col-md-6 col-sm-12">
                                                    <div className="view-text-value">
                                                      <label>{Strings.date_txt}</label>
                                                      <span>{moment(task.signed_of_date).format("DD/MM/YYYY")}</span></div>
                                                  </div>
                                                </>
                                                  : null
                                                : null
                                          }
                                        </div>
                                      </div>
                                    </FormSection>
                                  </div>
                                </div>
                              </div>
                            </div>
                          }) : ''}
                        </div>
                      </div>
                    }) : ''}
                </FormSection>
              </div>

              {/* File upload */}
              {signOffDetails.job_sheet_sign_off_status === 0 ?
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.upload_client_signed_document}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body">
                    <div className="upload-sfv-file dotted-br up-sign-doc">
                      <Dragger {...props} fileList={this.state.fileList}>
                        <p className="ant-upload-drag-icon">
                          <i class="material-icons">cloud_upload</i>
                        </p>
                        <p className="ant-upload-text">{Strings.choose_file_to_upload}</p>
                        <p className="ant-upload-hint">
                          {Strings.img_drag_drop_text}
                        </p>
                      </Dragger>
                    </div>
                  </div>
                </div> : null}

              {/* Signature */}
              {signOffDetails && signOffDetails.job_sheet_sign_off_status === 1 && signOffDetails.client_name === null && signOffDetails.signed_off_date === null ? null :
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.details_to_be_filled}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="row">
                          <div className="col-md-8 col-sm-12">
                            <fieldset className="sf-form form-group">
                              {
                                signOffDetails.job_sheet_sign_off_status === 0 ?
                                  <Field
                                    name="client_name"
                                    label={Strings.client_name}
                                    type="text"
                                    component={customInput} />
                                  :
                                  signOffDetails.client_name !== null
                                    ? <div className="view-text-value">
                                      <label>{Strings.client_name}</label>
                                      <span>{signOffDetails.client_name}</span>
                                    </div>
                                    : null
                              }
                            </fieldset>
                          </div>
                          <div className="col-md-4 col-sm-12">
                            <fieldset className="sf-form form-group  lsico">
                              {
                                signOffDetails.job_sheet_sign_off_status === 0 ?
                                  <Field
                                    name="signed_off_date"
                                    label={Strings.date_txt}
                                    placeholder={moment(new Date()).format("MM-DD-YYYY")}
                                    component={CustomDatepicker} />
                                  :
                                  signOffDetails.signed_off_date !== null
                                    ? <div className="view-text-value">
                                      <label>{Strings.date_txt}</label>
                                      <span>{moment(signOffDetails.signed_off_date).format("DD/MM/YYYY")}</span>
                                    </div>
                                    : null
                              }
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="row">
                      <div className="col-lg-12">
                        <fieldset className="sf-form form-group">
                          {signOffDetails.job_sheet_sign_off_status === 0 ?
                            <Field
                              label={Strings.feegback_txt}
                              name="feedback"
                              type="text"
                              id="description1"
                              component={customTextarea} />
                            :
                            signOffDetails.feedback !== null
                              ? <div className="view-text-value">
                                <label>{Strings.feegback_txt}</label>
                                <span>{signOffDetails.feedback}</span>
                              </div>
                              : null
                          }
                        </fieldset>
                      </div>
                      <div className="col-md-2 col-sm-12">
                        <fieldset className="sf-form form-group">

                          {
                            signOffDetails.job_sheet_sign_off_status === 0
                              ? <>
                                <label>Verbally Accepted</label>
                                <Field name="verb_accept_status" label="Yes" component={CustomCheckbox} /> </>
                              : <>
                                <label>Verbally Accepted</label>
                                <Field name="verb_accept_status" label="Yes" checked={Boolean(signOffDetails.verb_accept_status)} disabled component={CustomCheckbox} />
                              </>
                          }
                        </fieldset>
                      </div>
                      <div className="col-md-10 col-sm-12">
                        <div className="form-group sf-form">
                          {
                            signOffDetails.job_sheet_sign_off_status === 1 && signOffDetails.job_sheet_sign === null
                              ? null
                              : <label>{Strings.sf_signature}</label>
                          }

                          <div className="signature-box m-0">
                            <div className="upload-ur-sign no-pl">
                              {
                                signOffDetails.job_sheet_sign_off_status === 0
                                  ? <>
                                    <SignCanvas signDetail={{}}
                                      sign_id={"client_signoff_sign"}
                                      signFlag={this.onSaveSignature}></SignCanvas>
                                    {/* {this.state.signed ? <span className="error-input">Please sign before saving</span> : null} */}
                                  </>
                                  : signOffDetails.job_sheet_sign
                                    ? <img src={signOffDetails.job_sheet_sign} /*alt="SF logo"*/ />
                                    : null
                              }
                            </div>

                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>}
            </div>

            {/* all buttons */}

            <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
              <div className="btn-hs-icon">
                <button type="button" class="bnt bnt-normal" onClick={this.showModal}>
                  <i class="material-icons">remove_red_eye</i> {Strings.preview_btn}</button>
              </div>
              <div className="btn-hs-icon">
                <button type="button" className="bnt bnt-normal" onClick={() => this.props.history.push('./emailJobSignOff')}>
                  <i className="material-icons">mail_outline</i>{Strings.email_to_client}</button>
              </div>
              <div className="btn-hs-icon">
                {this.state.fileUploadStatus === true ? <button type="submit" className="bnt bnt-active" disabled={!this.state.fileUploadStatus}>
                  <i className="material-icons">save</i>{Strings.save_btn}</button> : clientSignStatus === false ? <button type="submit" className="bnt bnt-active" disabled={clientSignStatus}>
                    <i className="material-icons">save</i>{Strings.save_btn}</button> : acceptedByClientDetails === false ? <button type="submit" className="bnt bnt-active" disabled={acceptedByClientDetails}>
                      <i className="material-icons">save</i>{Strings.save_btn}</button> : <button type="submit" className="bnt bnt-active" disabled={verballyAcceptedStatus}>
                        <i className="material-icons">save</i>{Strings.save_btn}</button>}
              </div>
            </div>
          </form>
        </div>

        {/* Job Report Modal  */}
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={() => this.props.history.push('./emailJobSignOff')}
          // footer={null}
          okText={Strings.email_job_docs_bnt}
          width="100%"
          className="job-doc-preview"
          onCancel={this.handleCancel}>
          <PreviewSignoffSheet />
        </Modal>

      </div>
    )
  }
}

const mapStateToProps = (state, props) => {
  let accept_status = 0
  if (state.sAJobMgmt.signOffDetails && state.sAJobMgmt.signOffDetails.job_details && state.sAJobMgmt.signOffDetails.job_details[0] && state.sAJobMgmt.signOffDetails.job_details[0].verb_accept_status) {
    accept_status = state.sAJobMgmt.signOffDetails && state.sAJobMgmt.signOffDetails.job_details && state.sAJobMgmt.signOffDetails.job_details[0].verb_accept_status
  }
  return {
    jobDetails: state.sAJobMgmt.jobDetails && state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] ?
      state.sAJobMgmt.jobDetails.job_details[0] : {},
    signOffDetails: state.sAJobMgmt.signOffDetails && state.sAJobMgmt.signOffDetails.job_details && state.sAJobMgmt.signOffDetails.job_details[0] ?
      state.sAJobMgmt.signOffDetails.job_details[0] : {},
    formValues: state.form && state.form.signoffsheet &&
      state.form.signoffsheet.values ? state.form.signoffsheet.values : {},
    // checkStatus
    initialValues: { verb_accept_status: Boolean(accept_status) },
  }
}

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(actions, dispatch),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'signoffsheet',
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(SignOffSheet)
