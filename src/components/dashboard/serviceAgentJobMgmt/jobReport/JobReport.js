import React from "react";
import {
  Upload,
  Icon,
  Modal,
  Calendar,
  Select,
  Carousel,
  Collapse,
  TimePicker,
  Radio,
  Popover,
  Button,
  Dropdown,
  notification
} from "antd";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { Field, reduxForm, FieldArray } from "redux-form";
import { pdf } from "@react-pdf/renderer";
import JobReportPdf from "./JobReportPdf";
import { customInput } from "../../../common/custom-input";
import PreviewJobReport from "./PreviewJobReport";
import HistoryJobReport from "./HistoryJobReport";
import * as actions from "../../../../actions/SAJobMgmtAction";
import { validate } from "../../../../utils/Validations/jobReportValidation";
import { Strings } from "../../../../dataProvider/localize";
import {
  goBack,
  handleFocus,
  goBackBrowser,
  getStorage
} from "../../../../utils/common";
import UpdateSingleReport from "./UpdateSingleReport";
import { DeepTrim } from "../../../../utils/common";

import {
  VALIDATE_STATUS,
  ADMIN_DETAILS
} from "../../../../dataProvider/constant";

const mapRouteToTitle = {
  "/dashboard/rolesmanagement/createRole": Strings.add_role_title
};

function onPanelChange(value, mode) { }

const { Panel } = Collapse;

// select label add staff

const { Option } = Select;
const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

class JobReport extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      inlineUsers: [],
      uploadLoader: false,
      hisVisible: false,
      versionNo: 0
    };
  }

  componentDidMount() {
    this.props.action.getJobReport(this.props.job.id);
  }

  // Job Report Preview
  showModal = () => {
    this.setState({
      visible: true
    });
  };

  handleOk = e => {
    this.setState({
      visible: false
    });
    this.props.history.push("./emailJobReport");
  };

  handleCancel = e => {
    this.setState({
      visible: false
    });
  };

  // History modal function
  showHistoryModal = versionNumber => {
    this.props.action
      .getJobReportVersionHistory(
        this.props.job.id,
        this.props.job.job_number,
        versionNumber
      )
      .then(() => {
        this.setState({
          hisVisible: true,
          versionNo: versionNumber
        });
      })
      .catch(err => { });
  };
  hisHandleCancel = e => {
    this.setState({
      hisVisible: false
    });
  };

  ////File upload funtion//////////
  handleChange = (fileList, index, keyName) =>
    this.props.change(`job_cleaning_reports[${index}].${keyName}`, fileList);

  handlePreUpload = () => {
    return false;
  };
  ////////////////

  ///////Download PDF/////////////
  printDocument = () => {
    const url = this.props.jobReports && this.props.jobReports[0] && this.props.jobReports[0].job_report_file;
    const jobNumber = this.props.job && this.props.job.job_number
    if (url) {
      fetch(url)
        .then(response => {
          response.blob()
            .then(blob => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = `job_cleaning_report_${jobNumber}.pdf`;
              a.click();
            })
            .then(() => this.toggleLoader());
        });
    } else {
      var obj = pdf(
        <JobReportPdf
          job={this.props.job}
          jobReports={this.props.jobReports}
          filePath={this.props.filePath}
        />
      ).toBlob();
      obj
        .then(blob => {
          var url = URL.createObjectURL(blob);
          //////////////for downloading///////////////////////
          const a = document.createElement("a");
          a.style.display = "none";
          a.href = url;
          // the filename you want
          a.download = `jobReport_${this.props.job.job_number}.pdf`;
          document.body.appendChild(a);
          this.toggleLoader();

          a.click();
          window.URL.revokeObjectURL(url);
          /////////////////////////
          return Promise.resolve(blob);
        })
        .then(res => {
          this.blobData = res;
        });
    }
  };
  toggleLoader = () => {
    this.setState({ uploadLoader: !this.state.uploadLoader });
  };
  profileLoaderView = (
    <div className="profile-loader otherloader">
      <div class="sk-circle">
        <div class="sk-circle1 sk-child"></div>
        <div class="sk-circle2 sk-child"></div>
        <div class="sk-circle3 sk-child"></div>
        <div class="sk-circle4 sk-child"></div>
        <div class="sk-circle5 sk-child"></div>
        <div class="sk-circle6 sk-child"></div>
        <div class="sk-circle7 sk-child"></div>
        <div class="sk-circle8 sk-child"></div>
        <div class="sk-circle9 sk-child"></div>
        <div class="sk-circle10 sk-child"></div>
        <div class="sk-circle11 sk-child"></div>
        <div class="sk-circle12 sk-child"></div>
      </div>
    </div>
  );
  showPdf = () => {
    this.toggleLoader();

    this.printDocument();
  };
  ///////////////////////////////

  renderAreaMembers = ({
    fields,
    formValues,
    meta: { error, submitFailed }
  }) => {
    const uploadButton = (
      <div className="loadf-txt">
        <i class="material-icons">add_a_photo</i>
        <div className="ant-upload-text">Upload Image</div>
      </div>
    );

    return (
      <>
        {fields.map((member, index) => (
          <div className="drag-row tr">
            <span className="td">
              <button class="dragde-bnt normal-bnt" type="button">
                <i class="fa fa-ellipsis-h"></i>
                <i class="fa fa-ellipsis-h"></i>
              </button>
            </span>
            <span className="td">
              <fieldset className="sf-form no-label">
                <Field
                  name={`${member}.area`}
                  type="text"
                  placeholder={Strings.area_job_rep}
                  component={customInput}
                />
              </fieldset>
            </span>
            <span className="td">
              <div className="location-afbf-pic">
                <Upload
                  listType="picture-card"
                  fileList={
                    formValues.job_cleaning_reports &&
                      formValues.job_cleaning_reports[index] &&
                      formValues.job_cleaning_reports[index].location
                      ? formValues.job_cleaning_reports[index].location
                      : []
                  }
                  beforeUpload={this.handlePreUpload}
                  accept=".jpeg,.jpg,.png"
                  onChange={({ fileList }) =>
                    this.handleChange(fileList, index, "location")
                  }
                >
                  {formValues.job_cleaning_reports &&
                    formValues.job_cleaning_reports[index] &&
                    formValues.job_cleaning_reports[index].location
                    ? formValues.job_cleaning_reports[index].location.length >=
                      1
                      ? null
                      : uploadButton
                    : uploadButton}
                </Upload>
              </div>
            </span>
            <span className="td">
              <div className="location-afbf-pic">
                <Upload
                  listType="picture-card"
                  fileList={
                    formValues.job_cleaning_reports &&
                      formValues.job_cleaning_reports[index] &&
                      formValues.job_cleaning_reports[index].before
                      ? formValues.job_cleaning_reports[index].before
                      : []
                  }
                  accept=".jpeg,.jpg,.png"
                  beforeUpload={this.handlePreUpload}
                  onChange={({ fileList }) =>
                    this.handleChange(fileList, index, "before")
                  }
                >
                  {formValues.job_cleaning_reports &&
                    formValues.job_cleaning_reports[index] &&
                    formValues.job_cleaning_reports[index].before
                    ? formValues.job_cleaning_reports[index].before.length >= 1
                      ? null
                      : uploadButton
                    : uploadButton}
                </Upload>
              </div>
            </span>
            <span className="td">
              <div className="location-afbf-pic">
                <Upload
                  listType="picture-card"
                  fileList={
                    formValues.job_cleaning_reports &&
                      formValues.job_cleaning_reports[index] &&
                      formValues.job_cleaning_reports[index].after
                      ? formValues.job_cleaning_reports[index].after
                      : []
                  }
                  beforeUpload={this.handlePreUpload}
                  accept=".jpeg,.jpg,.png"
                  onChange={({ fileList }) =>
                    this.handleChange(fileList, index, "after")
                  }
                >
                  {formValues.job_cleaning_reports &&
                    formValues.job_cleaning_reports[index] &&
                    formValues.job_cleaning_reports[index].after
                    ? formValues.job_cleaning_reports[index].after.length >= 1
                      ? null
                      : uploadButton
                    : uploadButton}
                </Upload>
              </div>
            </span>
            <span className="td">
              <fieldset className="sf-form no-label">
                <Field
                  name={`${member}.note`}
                  type="text"
                  placeholder={Strings.note_job_rep}
                  component={customInput}
                />
              </fieldset>
            </span>
            <span className="td">
              <label>
                {JSON.parse(getStorage(ADMIN_DETAILS))
                  ? JSON.parse(getStorage(ADMIN_DETAILS)).name +
                  " " +
                  (JSON.parse(getStorage(ADMIN_DETAILS)).last_name
                    ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name
                    : "")
                  : ""}
              </label>
              {/* <fieldset className="sf-form no-label">
                                    <Field name={`${member}.photo_taken_by`} type="text" placeholder={Strings.photo_taken_by_whom_job_rep} component={customInput} />
                                </fieldset> */}
            </span>
            <span className="td">
              <div className="act-bnt">
                <button
                  class="delete-bnt delete-bnt"
                  userid="176"
                  onClick={() => fields.remove(index)}
                >
                  <i class="fa fa-trash-o"></i>
                </button>
              </div>
            </span>
          </div>
        ))}

        {/* add new record button */}
        <button
          class="normal-bnt add-line-bnt mt-3"
          type="button"
          onClick={() =>
            fields.push({
              photo_taken_by: JSON.parse(getStorage(ADMIN_DETAILS))
                ? JSON.parse(getStorage(ADMIN_DETAILS)).name +
                " " +
                (JSON.parse(getStorage(ADMIN_DETAILS)).last_name
                  ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name
                  : "")
                : ""
            })
          }
        >
          <i class="material-icons">add</i> {Strings.add_new_record}
        </button>
      </>
    );
  };

  onSubmit = async (formData, flag) => {
    formData = await DeepTrim(formData);

    var fileIndex = 0;
    var finalForm = new FormData();
    formData.job_cleaning_reports.forEach((report, reportIndex) => {
      //////////////////for location image//////////////////////////
      formData.job_cleaning_reports[reportIndex].location_photo = [];
      if (report.location && report.location.length > 0) {
        report.location.forEach((file, index) => {
          finalForm.append("files", file.originFileObj);
          formData.job_cleaning_reports[reportIndex].location_photo[
            index
          ] = fileIndex;
          fileIndex++;
        });
      }
      ////////////////////For before image//////////////////////
      formData.job_cleaning_reports[reportIndex].before_photo = [];
      if (report.before && report.before.length > 0) {
        report.before.forEach((file, index) => {
          finalForm.append("files", file.originFileObj);
          formData.job_cleaning_reports[reportIndex].before_photo[
            index
          ] = fileIndex;
          fileIndex++;
        });
      }
      ////////////////////For after image//////////////////////
      formData.job_cleaning_reports[reportIndex].after_photo = [];
      if (report.after && report.after.length > 0) {
        report.after.forEach((file, index) => {
          finalForm.append("files", file.originFileObj);
          formData.job_cleaning_reports[reportIndex].after_photo[
            index
          ] = fileIndex;
          fileIndex++;
        });
      }
    });
    finalForm.append(
      "job_cleaning_reports",
      JSON.stringify(formData.job_cleaning_reports)
    );
    finalForm.append("job_id", this.props.job.id);
    /* for (var pair of finalForm.entries()) {
            
        } */
    this.props.action
      .saveJobReport(finalForm, this.props.job.id)
      .then(flag => {
        this.props.reset();
        notification.success({
          message: Strings.success_title,
          description: flag,
          onClick: () => { },
          className: "ant-success"
        });
      })
      .catch(error => {
        if (error.status == VALIDATE_STATUS) {
          notification.warning({
            message: Strings.validate_title,
            description:
              error && error.data && typeof error.data.message == "string"
                ? error.data.message
                : Strings.generic_validate,
            onClick: () => { },
            className: "ant-warning"
          });
        } else {
          notification.error({
            message: Strings.error_title,
            description:
              error &&
                error.data &&
                error.data.message &&
                typeof error.data.message == "string"
                ? error.data.message
                : Strings.generic_error,
            onClick: () => { },
            className: "ant-error"
          });
        }
      });
  };

  ////////////////Inline edit funtions////////////////////////////
  handleUserEditClick = user => {
    var { inlineUsers } = this.state;
    inlineUsers.push(user.id);
    this.setState({ inlineUsers });
  };
  removeInlineUser = user => {
    var { inlineUsers } = this.state;
    var index = inlineUsers.findIndex(id => id === user.id);
    if (index != -1) {
      inlineUsers.splice(index, 1);
    }
    this.setState({ inlineUsers });
  };
  ////////////////////////////////////////////////////////////////////

  deleteReport = report => {
    this.props.action
      .deleteReport(report)
      .then(res => {
        notification.success({
          message: Strings.success_title,
          description: res.message,
          onClick: () => { },
          className: "ant-success"
        });
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: "ant-error"
        });
      });
  };

  render() {
    // file upload

    const { formValues, handleSubmit, error } = this.props;

    return (
      <div className="sf-page-layout">
        {this.state.uploadLoader ? this.profileLoaderView : null}
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon
              type="arrow-left"
              onClick={() =>
                // goBack(this.props)
                goBackBrowser(this.props)
              }
            />
            {mapRouteToTitle[this.props.location.pathname]
              ? mapRouteToTitle[this.props.location.pathname]
              : Strings.job_cleaning_report}
          </h2>
        </div>
        {/* inner header  */}

        <div className="main-container">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="row">
              <div className="col-lg-12">
                <div className="sf-card-wrap">
                  <div className="sf-card scope-v-value mb-4">
                    <div className="sf-card-head">
                      <div className="quote view-jd-history sf-page-history mt-0">
                        <Collapse
                          className="show-frquency-box"
                          bordered={false}
                          accordion
                          expandIcon={({ isActive }) => (
                            <Icon
                              type="caret-right"
                              rotate={isActive ? 90 : 0}
                            />
                          )}
                        >
                          <Panel header="View History" key="1">
                            {this.props.versionArray.map(versionNumber => {
                              return (
                                <div className="history-lists">
                                  <button
                                    type="button"
                                    class="normal-bnt"
                                    onClick={() =>
                                      this.showHistoryModal(versionNumber)
                                    }
                                  >
                                    {this.props.job.job_number} -{" "}
                                    {versionNumber}
                                  </button>
                                </div>
                              );
                            })}
                          </Panel>
                        </Collapse>
                      </div>
                    </div>
                  </div>
                  <div className="sf-card mt-4">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                      <h2 className="sf-pg-heading">
                        {Strings.job_cleaning_report}
                      </h2>
                      <div className="info-btn disable-dot-menu">
                        <Dropdown className="more-info" disabled>
                          <i className="material-icons">more_vert</i>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="sf-card-body">
                      <div className="job-cleaning-report">
                        <div className="sf-c-table org-user-table">
                          <div className="tr">
                            <span className="th"></span>
                            <span className="th">Area</span>
                            <span className="th">Area Photos</span>
                            <span className="th">Before Photos </span>
                            <span className="th">After Photos </span>
                            <span className="th">Note</span>
                            <span className="th">Record by</span>
                            <span className="th"></span>
                          </div>
                          {this.props.jobReports.map(report => {
                            var inline = this.state.inlineUsers.findIndex(
                              id => id === report.id
                            );
                            if (inline !== -1) {
                              return (
                                <UpdateSingleReport
                                  form={"UpdateSingleReport" + report.id}
                                  initialValues={report}
                                  removeInlineUser={this.removeInlineUser}
                                />
                              );
                            }
                            return (
                              <div className="drag-row tr">
                                <span className="td">
                                  <button
                                    class="dragde-bnt normal-bnt"
                                    type="button"
                                  >
                                    <i class="fa fa-ellipsis-h"></i>
                                    <i class="fa fa-ellipsis-h"></i>
                                  </button>
                                </span>
                                <span className="td">{report.area}</span>
                                <span className="td">
                                  <div className="location-afbf-pic">
                                    {report.location_photo &&
                                      JSON.parse(
                                        report.location_photo
                                      ).map(url => (
                                        <img
                                          width="100px"
                                          src={this.props.filePath + url}
                                        />
                                      ))}
                                  </div>
                                </span>
                                <span className="td">
                                  <div className="location-afbf-pic">
                                    {report.before_photo &&
                                      JSON.parse(
                                        report.before_photo
                                      ).map(url => (
                                        <img
                                          width="100px"
                                          src={this.props.filePath + url}
                                        />
                                      ))}
                                  </div>
                                </span>
                                <span className="td">
                                  <div className="location-afbf-pic">
                                    {report.after_photo &&
                                      JSON.parse(
                                        report.after_photo
                                      ).map(url => (
                                        <img
                                          width="100px"
                                          src={this.props.filePath + url}
                                        />
                                      ))}
                                  </div>
                                </span>
                                <span className="td">{report.note}</span>
                                <span className="td">
                                  {report.photo_taken_by}
                                </span>
                                <span className="td">
                                  <div className="act-bnt">
                                    <button
                                      class="delete-bnt delete-bnt"
                                      onClick={() =>
                                        this.handleUserEditClick(report)
                                      }
                                    >
                                      <i class="material-icons">create</i>
                                    </button>
                                    <button
                                      className="delete-bnt"
                                      onClick={() => this.deleteReport(report)}
                                    >
                                      <i class="fa fa-trash-o"></i>
                                    </button>
                                  </div>
                                </span>
                              </div>
                            );
                          })}

                          <FieldArray
                            name="job_cleaning_reports"
                            error={error}
                            component={this.renderAreaMembers}
                            formValues={formValues}
                          />

                          {/* you can remover this row */}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* save and preview button */}
                <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                  <div className="btn-hs-icon">
                    <button
                      type="button"
                      className="bnt bnt-normal"
                      onClick={this.showPdf}
                    >
                      <i className="material-icons">get_app</i>
                      {Strings.download_report}
                    </button>
                  </div>
                  <div className="btn-hs-icon">
                    <button
                      type="button"
                      className="bnt bnt-normal"
                      onClick={this.showModal}
                    >
                      <i className="material-icons">remove_red_eye</i>
                      {Strings.preview_btn}
                    </button>
                  </div>
                  <div className="btn-hs-icon">
                    <button
                      type="submit"
                      className="bnt bnt-active"
                      /* onClick={() => this.onSubmit(this.props.formValues)} */ disabled={
                        !(
                          formValues.job_cleaning_reports &&
                          formValues.job_cleaning_reports.length > 0
                        )
                      }
                    >
                      <i className="material-icons">save</i> {Strings.save_btn}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        {/* Job Report Modal  */}
        {this.props.location &&
          this.props.location.state &&
          this.props.location.state.flag ? (
            <Modal
              title="Basic Modal"
              visible={this.state.visible}
              onOk={this.handleCancel}
              // footer={null}
              // okText={Strings.email_job_docs_bnt}
              width="100%"
              className="job-doc-preview"
              onCancel={this.handleCancel}
            >
              <PreviewJobReport />
            </Modal>
          ) : (
            <Modal
              title="Basic Modal"
              visible={this.state.visible}
              onOk={this.handleOk}
              // footer={null}
              okText={Strings.email_job_docs_bnt}
              width="100%"
              className="job-doc-preview"
              onCancel={this.handleCancel}
            >
              <PreviewJobReport />
            </Modal>
          )}

        {/* history popup  */}
        <Modal
          title="Basic Modal"
          visible={this.state.hisVisible}
          okButtonProps={{ style: { display: "none" } }}
          width="100%"
          className="job-doc-preview job-report-history"
          onCancel={this.hisHandleCancel}
        >
          <HistoryJobReport versionNo={this.state.versionNo} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    formValues:
      state.form && state.form.jobReport && state.form.jobReport.values
        ? state.form.jobReport.values
        : {},
    job:
      state.sAJobMgmt.jobDetails.job_details &&
        state.sAJobMgmt.jobDetails.job_details[0]
        ? state.sAJobMgmt.jobDetails.job_details[0]
        : {},
    jobReports: state.sAJobMgmt.jobReports,
    filePath: state.sAJobMgmt.filePath,
    versionCount: state.sAJobMgmt.versionCount,
    versionArray: state.sAJobMgmt.versions
  };
};

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch)
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: "jobReport",
    validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(JobReport);
