import React from "react";
import { Field, FieldArray } from "redux-form";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { Upload, Modal, notification } from "antd";
import { reduxForm } from "redux-form";
import * as action from "../../../../actions/SAJobMgmtAction";
import { customInput } from "../../../common/custom-input";
import { Strings } from "../../../../dataProvider/localize";
import { singleValidate } from "../../../../utils/Validations/jobReportValidation";
import { DeepTrim, getStorage } from "../../../../utils/common";
import {
  VALIDATE_STATUS,
  ADMIN_DETAILS
} from "../../../../dataProvider/constant";

class UpdateSingleReport extends React.Component {
  ////File upload funtion//////////
  handleChange = (fileList, keyName) => {
    this.props.change(`${keyName}`, fileList);
    this.props.change(`${keyName}_photo`, null);
  };

  handlePreUpload = () => {
    return false;
  };
  ////////////////

  onSubmit = async formData => {
    formData = await DeepTrim(formData);

    var fileIndex = 0;
    var finalForm = new FormData();
    //////////////////for location image//////////////////////////
    delete formData.location_photo;
    if (formData.location && formData.location.length > 0) {
      formData.temp_location_photo = [];
      formData.location.forEach((file, index) => {
        finalForm.append("files", file.originFileObj);
        formData.temp_location_photo[index] = fileIndex;
        fileIndex++;
      });
      formData.location_photo = formData.temp_location_photo;
      // finalForm.append('location_photo',JSON.stringify( formData.temp_location_photo))
    }
    ////////////////////For before image//////////////////////
    delete formData.before_photo;
    if (formData.before && formData.before.length > 0) {
      formData.temp_before_photo = [];
      formData.before.forEach((file, index) => {
        finalForm.append("files", file.originFileObj);
        formData.temp_before_photo[index] = fileIndex;
        fileIndex++;
      });
      formData.before_photo = formData.temp_before_photo;
      // finalForm.append('before_photo',JSON.stringify( formData.temp_before_photo))
    }
    ////////////////////For after image//////////////////////
    delete formData.after_photo;
    if (formData.after && formData.after.length > 0) {
      formData.temp_after_photo = [];
      formData.after.forEach((file, index) => {
        finalForm.append("files", file.originFileObj);
        formData.temp_after_photo[index] = fileIndex;
        fileIndex++;
      });
      formData.after_photo = formData.temp_after_photo;
      // finalForm.append('after_photo',JSON.stringify( formData.temp_after_photo))
    }
    finalForm.append("id", formData.id);
    var job_id = formData.job_id;
    finalForm.append("job_cleaning_reports", JSON.stringify([formData]));

    this.props
      .updateJobReport(finalForm, job_id)
      .then(flag => {
        this.props.reset();
        this.props.removeInlineUser(this.props.initialValues);
        notification.success({
          message: Strings.success_title,
          description: flag,
          onClick: () => {},
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
            onClick: () => {},
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
            onClick: () => {},
            className: "ant-error"
          });
        }
      });
  };

  render() {
    const uploadButton = (
      <div className="loadf-txt">
        <i class="material-icons">add_a_photo</i>
        <div className="ant-upload-text">Upload Image</div>
      </div>
    );
    const { handleSubmit, initialValues, formValues } = this.props;

    return (
      <form
        className="tr drag-row"
        onSubmit={handleSubmit(this.onSubmit)}
        key={initialValues.id}
      >
        <span className="td">
          <button class="dragde-bnt normal-bnt" type="button">
            <i class="fa fa-ellipsis-h"></i>
            <i class="fa fa-ellipsis-h"></i>
          </button>
        </span>
        <span className="td">
          <fieldset className="sf-form no-label">
            <Field name={`area`} type="text" component={customInput} />
          </fieldset>
        </span>
        <span className="td">
          <div className="location-afbf-pic">
            {formValues.location_photo &&
            JSON.parse(formValues.location_photo).length > 0
              ? JSON.parse(formValues.location_photo).map(url => (
                  <img width="100px" src={this.props.filePath + url} />
                ))
              : null}
            <Upload
              listType="picture-card"
              fileList={formValues.location ? formValues.location : []}
              beforeUpload={this.handlePreUpload}
              accept=".jpeg,.jpg,.png"
              onChange={({ fileList }) =>
                this.handleChange(fileList, "location")
              }
            >
              {formValues.location
                ? formValues.location.length >= 1
                  ? null
                  : uploadButton
                : uploadButton}
            </Upload>

            {/*  <Upload
                                listType="picture-card"
                                fileList={formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].location ?
                                    formValues.job_cleaning_reports[index].location : []}
                                beforeUpload={this.handlePreUpload}
                                onChange={({ fileList }) => this.handleChange(fileList, index, 'location')}
                            >
                                {formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].location ?
                                    formValues.job_cleaning_reports[index].location.length >= 1 ? null : uploadButton
                                    : uploadButton}
                            </Upload> */}
          </div>
        </span>
        <span className="td">
          <div className="location-afbf-pic">
            {formValues.before_photo &&
            JSON.parse(formValues.before_photo).length > 0
              ? JSON.parse(formValues.before_photo).map(url => (
                  <img width="100px" src={this.props.filePath + url} />
                ))
              : null}
            <Upload
              listType="picture-card"
              fileList={formValues.before ? formValues.before : []}
              accept=".jpeg,.jpg,.png"
              beforeUpload={this.handlePreUpload}
              onChange={({ fileList }) => this.handleChange(fileList, "before")}
            >
              {formValues.before
                ? formValues.before.length >= 1
                  ? null
                  : uploadButton
                : uploadButton}
            </Upload>

            {/*  <Upload
                                listType="picture-card"
                                fileList={formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].before ?
                                    formValues.job_cleaning_reports[index].before : []}
                                beforeUpload={this.handlePreUpload}
                                onChange={({ fileList }) => this.handleChange(fileList, index, 'before')}
                            >
                                {formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].before ?
                                    formValues.job_cleaning_reports[index].before.length >= 2 ? null : uploadButton
                                    : uploadButton}
                            </Upload> */}
          </div>
        </span>
        <span className="td">
          <div className="location-afbf-pic">
            {formValues.after_photo &&
            JSON.parse(formValues.after_photo).length > 0
              ? JSON.parse(formValues.after_photo).map(url => (
                  <img width="100px" src={this.props.filePath + url} />
                ))
              : null}
            <Upload
              listType="picture-card"
              fileList={formValues.after ? formValues.after : []}
              beforeUpload={this.handlePreUpload}
              accept=".jpeg,.jpg,.png"
              onChange={({ fileList }) => this.handleChange(fileList, "after")}
            >
              {formValues.after
                ? formValues.after.length >= 1
                  ? null
                  : uploadButton
                : uploadButton}
            </Upload>

            {/* <Upload
                                listType="picture-card"
                                fileList={formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].after ?
                                    formValues.job_cleaning_reports[index].after : []}
                                beforeUpload={this.handlePreUpload}
                                onChange={({ fileList }) => this.handleChange(fileList, index, 'after')}
                            >
                                {formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].after ?
                                    formValues.job_cleaning_reports[index].after.length >= 2 ? null : uploadButton
                                    : uploadButton}
                            </Upload> */}
          </div>
        </span>
        <span className="td">
          <fieldset className="sf-form no-label">
            <Field name={`note`} type="text" component={customInput} />
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
                        <Field name={`photo_taken_by`} type="text" component={customInput} />
                    </fieldset> */}
        </span>
        <span className="td">
          <button className="delete-bnt" type="submit">
            <i class="material-icons">save</i>
          </button>
          <button
            className="delete-bnt"
            type="button"
            onClick={() =>
              this.props.removeInlineUser(this.props.initialValues)
            }
          >
            <i class="material-icons">close</i>
          </button>
        </span>
      </form>
    );
  }
}

const mapStateToProps = (state, { serviceObject, form }) => {
  return {
    roles: state.roleManagement.roles,
    formValues:
      state.form[form] && state.form[form].values
        ? state.form[form].values
        : {
            photo_taken_by: JSON.parse(getStorage(ADMIN_DETAILS))
              ? JSON.parse(getStorage(ADMIN_DETAILS)).name +
                " " +
                (JSON.parse(getStorage(ADMIN_DETAILS)).last_name
                  ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name
                  : "")
              : ""
          },
    filePath: state.sAJobMgmt.filePath
  };
};

export default compose(
  connect(mapStateToProps, action),
  reduxForm({ validate: singleValidate, enableReinitialize: true })
)(UpdateSingleReport);
