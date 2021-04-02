import React, { Component } from "react";
import { connect } from "react-redux";
import { Field, FieldArray, FormSection } from "redux-form";

import { Strings } from "../../../../dataProvider/localize";
import { customInput } from "../../../common/custom-input";
import { CustomDatepicker } from "../../../common/customDatepicker";
import { Upload, Collapse, Icon, Modal } from "antd";
import {
  taskNameRequired,
  isTaskStartDateRequired,
  taskEstimateRequired,
  isRequired
} from "../../../../utils/Validations/scopeDocValidation";

import AddAreas from "./AddAreas";
import { CustomAutoCompleteSearch } from "../../../common/customAutoCompleteSearch";
import { customRadioGroup } from "../../../common/customEsitmateRadioGroup";
import moment from "moment";
import { renderTaskEquipments, renderTaskMisc } from "../TaskEqupMisc";
import { currencyFormat } from "../../../../utils/common";
import { calculateEstimate } from "../ViewEditScopeDoc";
import { cutomExpandableText } from "../../../common/cutomExpandableText";
import { CustomSelect } from "../../../common/customSelect";
import * as actions from "../../../../actions/scopeDocActions";
import Camera from 'react-html5-camera-photo';
import 'react-html5-camera-photo/build/css/index.css';
const Dragger = Upload.Dragger;
const { Panel } = Collapse;

const validateFrequency = values => {
  if (values) {
    var res = values
      .trim()
      .toLowerCase()
      .split("_");

    if (res.length > 0) {
      var isnum = /^\d+$/.test(res[0]);
      var inital = res[0].toLowerCase();
      if (
        res.length === 1 &&
        !(
          inital == "day" ||
          inital == "month" ||
          inital == "week" ||
          inital == "month" ||
          inital == "year" ||
          inital == "fortnight"
        )
      ) {
        return "Invalid frequency";
      }

      var inital1 = res.length > 1 ? res[1].toLowerCase() : "";
      if (
        res.length > 1 &&
        !(
          (isnum && inital1 == "day") ||
          inital1 == "days" ||
          inital1 == "week" ||
          inital1 == "weeks" ||
          inital1 == "month" ||
          inital1 == "months" ||
          inital1 == "year" ||
          inital1 == "years" ||
          inital1 == "fortnight" ||
          inital1 == "fortnights"
        )
      ) {
        return "Invalid frequency";
      }
      if (res.length > 2) {
        return "Invalid frequency";
      }
    }
  }

  return undefined;
};

const validateDuration = values => {
  if (values) {
    var res = values
      .trim()
      .toLowerCase()
      .split("_");

    if (res.length > 0) {
      var isnum = /^\d+$/.test(res[0]);
      console.log(res);

      if (res.length > 0) {
        var isnum = /^\d+$/.test(res[0]);
        var inital = res[0].toLowerCase();
        if (
          res.length === 1 &&
          !(
            inital == "day" ||
            inital == "month" ||
            inital == "week" ||
            inital == "month" ||
            inital == "year" ||
            inital == "fortnight"
          )
        ) {
          return "Invalid Duration";
        }

        var inital1 = res.length > 1 ? res[1].toLowerCase() : "";
        if (
          res.length > 1 &&
          !(
            (isnum && inital1 == "day") ||
            inital1 == "days" ||
            inital1 == "week" ||
            inital1 == "weeks" ||
            inital1 == "month" ||
            inital1 == "months" ||
            inital1 == "year" ||
            inital1 == "years" ||
            inital1 == "fortnight" ||
            inital1 == "fortnights"
          )
        ) {
          return "Invalid Duration";
        }

        if (res.length > 2) {
          return "Invalid Duration";
        }
      }
    }
  }

  return undefined;
};

export class AddTasks extends Component {
  frequencies = ["Day", "Week", "Month", "Year"];
  durations = ["Day", "Week", "Fortnight", "Month", "Year"];

  state = {
    list: [],
    estimateTypes: [],
    frequencyDataSource: [],
    durationDataSource: [],
    calculated_value: 0
  };

  componentDidMount() {
    if (this.props.getTaskTags) this.props.getTaskTags();
  }

  handleChange = info => {
    let fileList = [...info.fileList];
    // 2. Read from response and show file link
    fileList = fileList.map(file => {
      if (file.response) {
        // Component will show file.url:link
        file.url = file.response.url;
      }
      return file;
    });
    this.setState({ list: fileList });
  };

  handleFrequencySearch = value => {
    var letterNumber = /^[1-9]+$/;
    var array = value.split(" ");
    if (value.match(letterNumber)) {
      let postfix = value > 1 ? "s" : "";
      this.setState({
        frequencyDataSource: !value
          ? []
          : this.frequencies.map(title => ({
            text: value + " " + title + postfix,
            value: (value + "_" + title + postfix).toUpperCase()
          }))
      });
    } else if (array.length > 1 && !isNaN(array[0])) {
      let postfix = array[0] > 1 ? "s" : "";
      let filterValue = this.frequencies.filter(val => {
        return val.toLowerCase().includes(array[1].toLowerCase());
      });
      this.setState({
        frequencyDataSource: !value
          ? []
          : filterValue.map(title => ({
            text: array[0] + " " + title + postfix,
            value: (array[0] + "_" + title + postfix).toUpperCase()
          }))
      });
    } else {
      this.setState({
        frequencyDataSource: !value
          ? []
          : this.frequencies.map(title => ({
            text: title,
            value: title.toString().toUpperCase()
          }))
      });
    }
  };

  handleDurationSearch = value => {
    var letterNumber = /^[1-9]+$/;
    var array = value.split(" ");

    if (value.match(letterNumber)) {
      let post = value > 1 ? "s" : "";
      this.setState({
        durationDataSource: !value
          ? []
          : this.durations.map(title => ({
            text: value + " " + title + post,
            value: (value + "_" + title + post).toUpperCase()
          }))
      });
    } else if (array.length > 1 && !isNaN(array[0])) {
      let postfix = array[0] > 1 ? "s" : "";
      let filterValue = this.durations.filter(val => {
        return val.toLowerCase().includes(array[1].toLowerCase());
      });
      this.setState({
        durationDataSource: !value
          ? []
          : filterValue.map(title => ({
            text: array[0] + " " + title + postfix,
            value: (array[0] + "_" + title + postfix).toUpperCase()
          }))
      });
    } else {
      this.setState({
        durationDataSource: !value
          ? []
          : this.durations.map(title => ({
            text: title,
            value: title.toString().toUpperCase()
          }))
      });
    }
  };

  handleEstimateChange = (e, position) => {
    const activeEstimates = [...this.state.estimateTypes];
    activeEstimates[position] = e.target.value;
    this.setState({ estimateTypes: activeEstimates });
  };

  disableDate = current => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  };

  /* calculate amount for task */

  calulateTotal(index) {
    var { formValues } = this.props;
    var equipments =
      this.props.editChange !== null
        ? this.props.isSiteTask
          ? this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values &&
          this.props.ViewEditScopeDoc.values.sitetask &&
          this.props.ViewEditScopeDoc.values.sitetask[
          this.props.site_index
          ] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
          index
          ] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
            index
          ].equipments
          : this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values.sites &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks[index] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks[index].equipments
        : undefined;
    var miscs =
      this.props.editChange !== null
        ? this.props.isSiteTask
          ? this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values &&
          this.props.ViewEditScopeDoc.values.sitetask &&
          this.props.ViewEditScopeDoc.values.sitetask[
          this.props.site_index
          ] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
          index
          ] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
            index
          ].miscellaneous
          : this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values.sites &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks[index] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks[index].miscellaneous
        : undefined;

    var adjustment =
      this.props.editChange !== null
        ? this.props.isSiteTask
          ? this.props.ViewEditScopeDoc &&
            this.props.ViewEditScopeDoc.values &&
            this.props.ViewEditScopeDoc.values.sitetask &&
            this.props.ViewEditScopeDoc.values.sitetask[
            this.props.site_index
            ] &&
            this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
            index
            ] &&
            this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
              index
            ].adjustment_value
            ? this.props.ViewEditScopeDoc.values.sitetask[
              this.props.site_index
            ][index].adjustment_value
            : 0
          : this.props.ViewEditScopeDoc &&
            this.props.ViewEditScopeDoc.values.sites &&
            this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex] &&
            this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
              .tasks &&
            this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
              .tasks[index] &&
            this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
              .tasks[index].adjustment_value
            ? this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
              .tasks[index].adjustment_value
            : 0
        : 0;

    var estimate =
      this.props.editChange !== null
        ? this.props.isSiteTask
          ? this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values &&
          this.props.ViewEditScopeDoc.values.sitetask &&
          this.props.ViewEditScopeDoc.values.sitetask[
          this.props.site_index
          ] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
          index
          ] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
            index
          ].estimate
          : this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values.sites &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks[index] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks[index].estimate
        : undefined;
    var estimate_total = estimate ? calculateEstimate(estimate) : 0;

    var total = 0;
    if (equipments)
      total = equipments.reduce((acc, curr) => {
        if (curr.equipment_cost) return acc + parseFloat(curr.equipment_cost);
        else return acc;
      }, total);
    if (miscs)
      total = miscs.reduce((acc, curr) => {
        if (curr.miscellaneous_cost)
          return acc + parseFloat(curr.miscellaneous_cost);
        else return acc;
      }, total);
    // this.setState({ calculated_value: (total + parseFloat(estimate_total)) });
    total = total + parseFloat(estimate_total) + parseFloat(adjustment);
    if (this.props.editChange) {
      if (this.props.isSiteTask) {
        if (
          this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values &&
          this.props.ViewEditScopeDoc.values.sitetask &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
          index
          ] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
            index
          ].amount !== undefined
        ) {
          if (
            this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
              index
            ].amount != total
          ) {
            this.props.editChange(
              `sitetask[${this.props.site_index}][${index}].amount`,
              total
            );
            this.props.editChange(
              `sitetask[${this.props.site_index}][${index}].calculated_value`,
              total - parseFloat(adjustment)
            );
          }
        } else if (
          this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values &&
          this.props.ViewEditScopeDoc.values.sitetask &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
          index
          ] &&
          this.props.ViewEditScopeDoc.values.sitetask[this.props.site_index][
            index
          ].amount === undefined
        ) {
          this.props.editChange(
            `sitetask[${this.props.site_index}][${index}].amount`,
            total
          );
          this.props.editChange(
            `sitetask[${this.props.site_index}][${index}].calculated_value`,
            total - parseFloat(adjustment)
          );
        }
      } else {
        if (
          this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values.sites &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex].tasks[
          index
          ] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex].tasks[
            index
          ].amount !== undefined
        ) {
          if (
            this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
              .tasks[index].amount != total
          ) {
            this.props.editChange(
              `sites[${this.props.siteIndex}].tasks[${index}].amount`,
              total
            );
            this.props.editChange(
              `sites[${this.props.siteIndex}].tasks[${index}].calculated_value`,
              total - parseFloat(adjustment)
            );
          }
        } else if (
          this.props.ViewEditScopeDoc &&
          this.props.ViewEditScopeDoc.values.sites &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
            .tasks &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex].tasks[
          index
          ] &&
          this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex].tasks[
            index
          ].amount === undefined
        ) {
          this.props.editChange(
            `sites[${this.props.siteIndex}].tasks[${index}].amount`,
            total
          );
          this.props.editChange(
            `sites[${this.props.siteIndex}].tasks[${index}].calculated_value`,
            total - parseFloat(adjustment)
          );
        }
      }
    }

    return { total: total, calculated_value: total - parseFloat(adjustment) };
    /* Object.keys(formValues).filter(key => key.startsWith('value$')) */
  }

  render() {
    var {
      fields,
      generateQuote,
      site_item,
      taskTags,
      meta: { error, submitFailed }
    } = this.props;

    if (this.props.scopeDocForm && this.props.scopeDocForm.values) {
    }

    if (fields.length === 0 && !this.props.isFromEdit) {
      fields.push({
        site_id: this.props.siteItem && this.props.siteItem.site_id,
        site_name:
          this.props.siteItem &&
          this.props.siteItem.site &&
          this.props.siteItem.site.site_name,
        additional_tags: [],
        adjustment_value: 0
      });
      // fields.push({ start_date: new Date() });
    }

    const uploadPicProps = {
      accept: ".jpeg,.jpg,.png",
      name: "filename",
      multiple: "true",
      listType: "picture",
      status: "done"
    };

    return (
      <>
        {fields.map((task, index) => {
          {
            /* if (this.props.isFromEdit) {
            this.props.editChange(`${task}.site_id`, this.props.siteItem.site_id)
            this.props.editChange(`${task}.site_name`, this.props.siteItem && this.props.siteItem.site && this.props.siteItem.site.site_name);
          } */
          }
          return (
            <div className="estm-lists">
              {this.state.visible ? <Modal
                title="Take photos for task"
                visible={this.state.visible}
                onOk={() => this.setState({ visible: false })}
                onCancel={() => this.setState({ visible: false })}
                zIndex="99999"
                width="100%"

              >
                <Camera onTakePhoto={(dataUri) => { console.log("@arish", dataUri); }}
                />
              </Modal> : null}
              <div className="sc-add-task mt-1">
                <button
                  type="button"
                  style={{ display: "block" }}
                  className="delete-task-btn normal-bnt"
                  onClick={() => fields.remove(index)}
                >
                  <i class="fa fa-trash-o"></i>
                </button>
                <div className="row">
                  <div className="col-md-6">
                    <fieldset className="form-group sf-form">
                      <Field
                        label={Strings.task_name}
                        name={`${task}.task_name`}
                        placeholder={Strings.task_name_sd_task}
                        type="text"
                        validate={taskNameRequired}
                        component={cutomExpandableText}
                      />
                    </fieldset>
                    <fieldset className="form-group sf-form">
                      <FieldArray
                        name={`${task}.areas`}
                        placeholder={Strings.area_name_sd_task}
                        component={AddAreas}
                      />
                    </fieldset>
                    {/* <fieldset className="form-group sf-form">
                      <Field
                        label={Strings.description_txt}
                        name={`${task}.description`}
                        placeholder={Strings.description_sd_task}
                        type="text"
                        component={customInput} />
                    </fieldset> */}
                    {/* <fieldset className="form-group sf-form adal-task-tags">
                      <Field
                        label={"Additional Task Tags"}
                        name={`${task}.additional_tags`}
                        placeholder={Strings.description_sd_task}
                        type="text"
                        mode="multiple"
                        options={
                          taskTags &&
                          taskTags.map(tag => ({
                            title: tag.tag_name,
                            value: tag.id
                          }))
                        }
                        component={CustomSelect}
                      />
                    </fieldset> */}
                  </div>
                  <div className="col-md-6">
                    <FormSection name={`${task}.estimate`}>
                      <div className="add-estimate-scdo">
                        <div className="form-group sf-form esti-tabs">
                          <label>{Strings.estimate_txt}</label>
                          <div className="sf-checkbox-b estimate-rd-bnt">
                            <div className="sf-roles-group">
                              <Field
                                name={`estimate_type`}
                                type="text"
                                component={customRadioGroup}
                                onChange={e =>
                                  this.handleEstimateChange(e, index)
                                }
                                defaultValue={0}
                                validate={taskEstimateRequired}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="esti-tabs-items">
                          {/* Hours click button details */}
                          {this.state.estimateTypes[index] === "hours" ? (
                            <div className="row esti-hrs-dtl">
                              <div className="col-md-3">
                                <fieldset className="form-group sf-form">
                                  <Field
                                    label="Staff:"
                                    name="staff"
                                    type="number"
                                    component={customInput}
                                    validate={taskEstimateRequired}
                                  />
                                </fieldset>
                              </div>
                              <div className="col-md-3">
                                <fieldset className="form-group sf-form">
                                  <Field
                                    label="Hours:"
                                    name="hours"
                                    type="number"
                                    component={customInput}
                                    validate={taskEstimateRequired}
                                  />
                                </fieldset>
                              </div>
                              <div className="col-md-3">
                                <fieldset className="form-group sf-form">
                                  <Field
                                    label="Days:"
                                    name="days"
                                    type="number"
                                    component={customInput}
                                    validate={taskEstimateRequired}
                                  />
                                </fieldset>
                              </div>
                              <div className="col-md-3">
                                <fieldset className="form-group sf-form">
                                  <Field
                                    label="Rate:"
                                    name="rate"
                                    type="number"
                                    component={customInput}
                                    validate={taskEstimateRequired}
                                  />
                                </fieldset>
                              </div>
                            </div>
                          ) : this.state.estimateTypes[index] === "area" ? (
                            <div className="row ">
                              <div className="col-md-6">
                                <fieldset className="form-group sf-form">
                                  <Field
                                    label="SQM:"
                                    name="sqm"
                                    type="number"
                                    component={customInput}
                                    validate={taskEstimateRequired}
                                  />
                                </fieldset>
                              </div>
                              <div className="col-md-6">
                                <fieldset className="form-group sf-form">
                                  <Field
                                    label="Rate:"
                                    name="rate"
                                    type="number"
                                    component={customInput}
                                    validate={taskEstimateRequired}
                                  />
                                </fieldset>
                              </div>
                            </div>
                          ) : this.state.estimateTypes[index] === "quant" ? (
                            <div className="row">
                              <div className="col-md-6">
                                <fieldset className="form-group sf-form">
                                  <Field
                                    label="Quantity:"
                                    name="quant"
                                    type="number"
                                    component={customInput}
                                    validate={taskEstimateRequired}
                                  />
                                </fieldset>
                              </div>
                              <div className="col-md-6">
                                <fieldset className="form-group sf-form">
                                  <Field
                                    label="Rate:"
                                    name="rate"
                                    type="number"
                                    component={customInput}
                                    validate={taskEstimateRequired}
                                  />
                                </fieldset>
                              </div>
                            </div>
                          ) : null}
                        </div>
                        {/* add new estimate */}
                      </div>
                    </FormSection>

                    <div className="logo-upload scope-upload">
                      <Dragger
                        {...uploadPicProps}
                        beforeUpload={(file, fileList) => {
                          if (this.props.isFromEdit) {
                            this.props.editChange(`${task}.files`, fileList);
                            return false;
                          } else {
                            if (this.props.isSiteTask) {
                              this.props.editChange(
                                `sitetask[${this.props.site_index}][${index}].files`,
                                fileList
                              );
                            } else
                              this.props.addChange(`${task}.files`, fileList);
                            return false;
                          }
                        }}
                        onRemove={file => {
                          if (this.props.isFromEdit) {
                            this.props.editChange(`${task}.files`, null);
                            this.setState({ list: [] });
                            return false;
                          } else {
                            this.setState(prevState => {
                              const fileIndex = prevState.list.indexOf(file);
                              const newFileList = prevState.list.slice();
                              newFileList.splice(fileIndex, 1);
                              if (newFileList.length > 0) {
                                this.props.addChange(
                                  `${task}.files`,
                                  newFileList
                                );
                                return {
                                  list: newFileList
                                };
                              } else {
                                return {
                                  list: []
                                };
                              }
                            });
                          }
                        }}
                        onChange={info => {
                          if (this.props.scopeDocForm) {
                            this.props.addChange(`${task}.files`, [
                              ...info.fileList
                            ]);
                          } else {
                            if (this.props.isSiteTask) {
                              this.props.editChange(
                                `sitetask[${this.props.site_index}][${index}].files`,
                                [...info.fileList]
                              );
                            } else
                              this.props.editChange(`${task}.files`, [
                                ...info.fileList
                              ]);
                            // this.props.editChange(`${task}.files`,
                            //   this.props.ViewEditScopeDoc
                            //     && this.props.ViewEditScopeDoc.values.sites
                            //     && this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex]
                            //     && this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex].tasks
                            //     && this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex].tasks[index]
                            //     && this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex].tasks[index].files
                            //     ? [...this.props.ViewEditScopeDoc.values.sites[this.props.siteIndex].tasks[index].files, info.file]
                            //     : [info.file])
                          }
                        }}
                        fileList={
                          this.props.editChange !== null
                            ? this.props.isSiteTask
                              ? this.props.ViewEditScopeDoc &&
                                this.props.ViewEditScopeDoc.values &&
                                this.props.ViewEditScopeDoc.values.sitetask &&
                                this.props.ViewEditScopeDoc.values.sitetask[
                                this.props.site_index
                                ] &&
                                this.props.ViewEditScopeDoc.values.sitetask[
                                this.props.site_index
                                ][index] &&
                                this.props.ViewEditScopeDoc.values.sitetask[
                                  this.props.site_index
                                ][index].files
                                ? this.props.ViewEditScopeDoc.values.sitetask[
                                  this.props.site_index
                                ][index].files
                                : []
                              : this.props.ViewEditScopeDoc &&
                                this.props.ViewEditScopeDoc.values.sites &&
                                this.props.ViewEditScopeDoc.values.sites[
                                this.props.siteIndex
                                ] &&
                                this.props.ViewEditScopeDoc.values.sites[
                                  this.props.siteIndex
                                ].tasks &&
                                this.props.ViewEditScopeDoc.values.sites[
                                  this.props.siteIndex
                                ].tasks[index] &&
                                this.props.ViewEditScopeDoc.values.sites[
                                  this.props.siteIndex
                                ].tasks[index].files
                                ? this.props.ViewEditScopeDoc.values.sites[
                                  this.props.siteIndex
                                ].tasks[index].files
                                : []
                            : this.props.scopeDocForm &&
                              this.props.scopeDocForm.values.sites &&
                              this.props.scopeDocForm.values.sites[
                              this.props.siteIndex
                              ] &&
                              this.props.scopeDocForm.values.sites[
                                this.props.siteIndex
                              ].tasks &&
                              this.props.scopeDocForm.values.sites[
                                this.props.siteIndex
                              ].tasks[index] &&
                              this.props.scopeDocForm.values.sites[
                                this.props.siteIndex
                              ].tasks[index].files
                              ? this.props.scopeDocForm.values.sites[
                                this.props.siteIndex
                              ].tasks[index].files
                              : []
                        }
                      >
                        <p className="ant-upload-drag-icon">
                          <i class="material-icons">cloud_upload</i>
                        </p>
                        <p className="ant-upload-text">
                          {Strings.img_upload_text}
                        </p>
                      </Dragger>
                      

                    </div>
                    <button
                        type="button"
                        style={{ display: "block" }}
                        className="normal-bnt"
                        onClick={() => this.setState({ visible: true })}
                      >
                        <span class="material-icons">
                          add_a_photo</span>
                      </button>
                  </div>

                  {/* task level equipment and misc */}
                  <div className="col-lg-12">
                    {generateQuote ? (
                      <div className="add-task-eqmicell">
                        {/*  <div className="equip-miscell-dtl">
                          <div className="eq-mill-view esti-data-view">
                            <label className="e-m-lbl">Equipments</label>
                            <div
                              className="esti-table"
                              onClick={this.handleChildClick}
                            >
                              <FieldArray
                                name={`${task}.equipments`}
                                equipmentList={this.props.equipmentList}
                                component={renderTaskEquipments}
                              />
                            </div>
                          </div>
                        </div> */}

                        {/* <div className="equip-miscell-dtl miscell-equip-dtl">
                          <div className="eq-mill-view esti-data-view">
                            <label className="e-m-lbl">Additional Costs</label>
                            <div
                              className="esti-table"
                              onClick={this.handleChildClick}
                            >
                              <FieldArray
                                name={`${task}.miscellaneous`}
                                component={renderTaskMisc}
                              />
                            </div>
                          </div>
                        </div> */}
                        {/* 
                        <div className="calculate-dtl">
                          <div className="data-v-row no-note-brder">
                            <div className="data-v-col">
                              <div className="view-text-value">
                                <label>Calculated</label>
                                <span>
                                  {currencyFormat(
                                    this.calulateTotal(index).calculated_value
                                  )}
                                </span>
                              </div>
                            </div>

                            <div className="data-v-col">
                              <div className="quote-vlue qto-position-st">
                                <fieldset className="form-group sf-form w-currency-symbl">
                                  <Field
                                    label="Adjustment"
                                    name={`${task}.adjustment_value`}
                                    type="number"
                                    // validate={isRequired}
                                    id="name"
                                    component={customInput}
                                  />
                                </fieldset>
                              </div>
                            </div>
                            <div className="data-v-col">
                              <div className="view-text-value">
                                <label>{"Total"}</label>
                                <span>
                                  {currencyFormat(
                                    this.calulateTotal(index).total
                                  )}
                                </span>
                              </div>
                            </div>
                             <div className="col-md-3">
                          <fieldset className="form-group sf-form quote-vlu-txt">
                            <Field
                              label="Value"
                              name={`${task}.amount`}
                              type="text"
                              id="name"
                              validate={isRequired}
                              component={customInput} />
                          </fieldset>
                        </div> 
                          </div>
                        </div> */}
                      </div>
                    ) : null}
                  </div>
                  {/* ------------------------------- */}

                  <div className="col-lg-12">
                    <div className="row">
                      <div className="col-md-6">
                        <fieldset className="form-group sf-form">
                          <Field
                            label={Strings.note_txt}
                            name={`${task}.note`}
                            type="text"
                            component={customInput}
                          />
                        </fieldset>
                      </div>


                      {/* <div className={generateQuote ? "col-md-3" : "col-md-6"}>
                        <fieldset className="form-group sf-form lsico">
                          <Field
                            label={Strings.sugg_start_date_txt}
                            name={`${task}.start_date`}
                            type="date"
                            placeholder={moment(new Date()).format(
                              "YYYY-MM-DD"
                            )}
                            validate={isTaskStartDateRequired}
                            disabledDate={this.disableDate}
                            component={CustomDatepicker}
                          />
                        </fieldset>
                      </div> */}
                    </div>
                  </div>
                </div>

                {/* button click show hide div */}
                {/* <Collapse
                  className="show-frquency-box"
                  bordered={false}
                  defaultActiveKey={["0"]}
                  expandIcon={({ isActive }) => (
                    <Icon type="down" rotate={isActive ? 0 : 180} />
                  )}
                >
                  <Panel header="Show Frequency" key="1">
                    <div className="row">
                      <div className="col-lg-4 col-sm-6 col-sm-12">
                        <fieldset className="form-group sf-form">
                          <Field
                            label={Strings.task_duration_txt}
                            name={`${task}.duration`}
                            type="text"
                            dataSource={this.state.durationDataSource}
                            component={CustomAutoCompleteSearch}
                            onSearch={this.handleDurationSearch}
                            validate={validateDuration}
                          />
                        </fieldset>
                      </div>
                      <div className="col-lg-4 col-sm-6 col-sm-12">
                        <fieldset className="form-group sf-form">
                          <Field
                            label={Strings.repeat_txt}
                            name={`${task}.frequency`}
                            type="text"
                            dataSource={this.state.frequencyDataSource}
                            component={CustomAutoCompleteSearch}
                            onSearch={this.handleFrequencySearch}
                            validate={validateFrequency}
                          />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                          <Field
                            label="Frequency End Date"
                            name={`${task}.frequency_end_date`}
                            type="date"
                            id="frequency_end_date"
                            component={CustomDatepicker} />
                        </fieldset>
                      </div>
                      <div className="col-lg-4 col-sm-6 col-sm-12"></div>
                    </div>
                  </Panel>
                </Collapse> */}
              </div>
            </div>
          );
        })}
        <button
          className="normal-bnt add-task-bnt add-line-bnt mt-3"
          type="button"
          onClick={() =>
            fields.push({
              site_id: this.props.siteItem && this.props.siteItem.site_id,
              site_name:
                this.props.siteItem &&
                this.props.siteItem.site &&
                this.props.siteItem.site.site_name,
              additional_tags: [],
              adjustment_value: 0
            })
          }
        >
          <i class="material-icons">add</i>
          <span>{Strings.add_task_txt}</span>
        </button>
      </>
    );
  }
}

const mapStateToProps = state => {
  return {
    scopeDocForm: state.form.addNewScopeDoc,
    ViewEditScopeDoc: state.form.ViewEditScopeDoc
    // taskTags: state.scopeDocs.taskTags ? state.scopeDocs.taskTags : [],
  };
};

export default connect(mapStateToProps, actions)(AddTasks);
