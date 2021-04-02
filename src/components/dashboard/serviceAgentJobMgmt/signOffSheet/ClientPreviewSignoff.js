import React from 'react';
import { connect } from 'react-redux'
import { Strings } from '../../../../dataProvider/localize'
import { Dropdown, notification } from 'antd';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { goBack, handleFocus } from '../../../../utils/common';
import moment from 'moment';
import { pdf } from '@react-pdf/renderer';
import SignoffSheetPdf from "./SignoffSheetPdf";
import * as actions from '../../../../actions/SAJobMgmtAction';
import { CustomDatepicker } from '../../../common/customDatepicker';
import { customInput } from '../../../common/custom-input';
import { CustomCheckbox } from '../../../common/customCheckbox'
import { customTextarea } from '../../../common/customTextarea';
import { SignCanvas } from '../../../common/SignCanvas';
import { abbrivationStr } from '../../../../utils/common';
import { DeepTrim } from '../../../../utils/common';


class ClientPreviewSignoff extends React.Component {

  state = {
    signSaved: false,
    clientSign: false
  }

  componentDidMount() {
    const query = new URLSearchParams(this.props.location.search);
    this.props.action.getJobSignOff(query.get('job_number'));
    this.props.action.getJobDetails(query.get('job_number'));
    // this.printDocument()
  }

  printDocument() {
    const url = this.props.jobDetails.job_sheet_sign_pdf;
    const query = new URLSearchParams(this.props.location.search);
    if (url) {
      fetch(url)
        .then(response => {
          response.blob()
            .then(blob => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = `job_sign_off_report_${query.get('job_number')}.pdf`;
              a.click();
            });
        });
    } else {
      var obj = pdf(<SignoffSheetPdf signOffDetails={this.props.signOffDetails}
        jobDetails={this.props.jobDetails} />).toBlob();
      const query = new URLSearchParams(this.props.location.search);
      obj.then(function (blob) {
        var url = URL.createObjectURL(blob);
        //////////////for downloading///////////////////////
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        // the filename you want
        a.download = `job_sign_off_report_${query.get('job_number')}.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        /////////////////////////
        return Promise.resolve(blob)
      }).then((res) => {
        this.blobData = res
      })
    }
  }

  showPdf = () => {
    this.printDocument()
  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);

    const query = new URLSearchParams(this.props.location.search);
    var svgString = new XMLSerializer().serializeToString(document.getElementById("client_signoff_sign").childNodes[0]);
    var canvas = document.getElementById("canvas");
    var ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    var DOMURL = window.self.URL || window.self.webkitURL || window.self;
    var img = new Image();
    var svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
    var url = DOMURL.createObjectURL(svg);
    img.onload = () => {
      ctx.drawImage(img, 0, 0);
      var png = canvas.toDataURL("image/png");
      canvas.toBlob((blob) => {
        formData.scope_of_work = []
        formData.file_map = [];
        formData.id = this.props.signOffDetails.id;
        formData.job_sheet_sign_off_status = 1;
        var finalFormData = new FormData();

        if (blob) {
          finalFormData.append("sign", blob);
          formData.file_map.push({ file_type: "sign" });
        }
        Object.keys(formData).forEach(key => {
          finalFormData.append(key, JSON.stringify(formData[key]))
        });

        this.props.action.signOffJobSheet(finalFormData, query.get('job_number'))
          .then((res) => {
            this.setState({ signSaved: true })
            if (res) {
              notification.success({
                message: Strings.success_title,
                description: res,
                onClick: () => { },
                className: 'ant-success'
              });
            }
          })
          .catch((message) => {
            notification.error({
              message: Strings.error_title,
              description: message && typeof message === 'string' ? message : Strings.generic_error,
              onClick: () => { },
              className: 'ant-error'
            });
          });
      })

      DOMURL.revokeObjectURL(png);
    };
    img.src = url;

  }

  onSaveSignature = (status) => {
    if (status !== this.state.clientSign) {
      this.setState({ clientSign: status });
    }
  }

  render() {
    const { signOffDetails, jobDetails, handleSubmit, formValues } = this.props;
    const clientEmailSent = jobDetails && jobDetails.client_email_sent;

    let clientSignStatus = true;
    if (this.state.clientSign) {
      if (formValues.client_name && formValues.signed_off_date) {
        clientSignStatus = false;
      }
    }

    return (
      <div className="sf-jobdoc-preview">
        <form onSubmit={handleSubmit(this.onSubmit)}>
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
              <h1>{Strings.sign_off_sheet}</h1>
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
                                {signOffDetails.job_sheet_sign_off_status === 1 && task.verb_accept_status ?
                                  <div className="vrbl-acc-content">
                                    <fieldset className="sf-form form-group">
                                      <Field name="verb_accept_status" disabled checked={Boolean(task.verb_accept_status)} label="Verbally Accepted" component={CustomCheckbox} />
                                    </fieldset>
                                    <div className="row w-100 text-right">

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
                                    </div>
                                  </div> : null}
                              </div>
                            </div>
                          </div>
                        </div>
                      }) : ''}
                    </div>
                  </div>
                }) : ''}
            </div>

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
                            {signOffDetails.job_sheet_sign_off_status === 0 ?
                              <Field
                                name="client_name"
                                label={Strings.client_name}
                                type="text"
                                component={customInput} />
                              :
                              signOffDetails.client_name !== null
                                ? <div className="view-text-value"><label>{Strings.client_name}</label>
                                  <span>{signOffDetails.client_name}</span></div>
                                : null
                            }
                          </fieldset>
                        </div>
                        <div className="col-md-4 col-sm-12">
                          <fieldset className="sf-form form-group  lsico">
                            {signOffDetails.job_sheet_sign_off_status === 0 ?
                              <Field
                                name="signed_off_date"
                                label={Strings.date_txt}
                                placeholder={moment(new Date()).format("MM-DD-YYYY")}
                                component={CustomDatepicker} />
                              : signOffDetails.signed_off_date !== null
                                ? <div className="view-text-value"><label>{Strings.date_txt}</label>
                                  <span>{moment(signOffDetails.signed_off_date).format("DD/MM/YYYY")}</span></div>
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
                          : signOffDetails.feedback !== null
                            ? <div className="view-text-value"><label>{Strings.feegback_txt}</label>
                              <span>{signOffDetails.feedback}</span></div>
                            : null
                        }
                      </fieldset>
                    </div>
                    <div className="col-md-10 col-sm-12">
                      <div className="form-group sf-form">
                        {/* <label>{Strings.sf_signature}</label> */}
                        {
                          signOffDetails.job_sheet_sign_off_status === 1 && signOffDetails.job_sheet_sign === null
                            ? null
                            : <label>{Strings.sf_signature}</label>
                        }

                        <div className="signature-box m-0">
                          <div className="upload-ur-sign no-pl">
                            {
                              signOffDetails.job_sheet_sign_off_status === 0
                                ? <SignCanvas signDetail={{}} sign_id="client_signoff_sign" signFlag={this.onSaveSignature}></SignCanvas>
                                : signOffDetails.job_sheet_sign !== null
                                  ? <img src={signOffDetails.job_sheet_sign} /*alt="SF logo"*/ />
                                  : null
                            }
                          </div>

                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            }
          </div>

          {/* pdf view button */}
          <div className="jdp-footer">
            <div className="all-btn d-flex justify-content-end mt-5 sc-doc-bnt">
              <div className="btn-hs-icon">
                {signOffDetails && signOffDetails.job_sheet_sign_off_status ?
                  <button
                    type="submit"
                    className="bnt bnt-normal"
                    disabled={Boolean(signOffDetails.job_sheet_sign_off_status)}
                  >Save sign and complete</button> : <button
                    type="submit"
                    className="bnt bnt-normal"
                    disabled={clientSignStatus}
                  >Save sign and complete</button>}
              </div>
              <div className="btn-hs-icon link-disabled">
                <a className="bnt bnt-active" disabled={clientEmailSent && (!Boolean(signOffDetails.job_sheet_sign_off_status))} onClick={this.showPdf}>Download Report</a>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  jobDetails: state.sAJobMgmt.jobDetails && state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] ?
    state.sAJobMgmt.jobDetails.job_details[0] : {},
  signOffDetails: state.sAJobMgmt.signOffDetails && state.sAJobMgmt.signOffDetails.job_details && state.sAJobMgmt.signOffDetails.job_details[0] ?
    state.sAJobMgmt.signOffDetails.job_details[0] : {},
  formValues: state.form && state.form.clientPreviewSignoff &&
    state.form.clientPreviewSignoff.values ? state.form.clientPreviewSignoff.values : {},
})

const mapDispatchToProps = dispatch => ({
  action: bindActionCreators(actions, dispatch),
})

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'clientPreviewSignoff',
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ClientPreviewSignoff);