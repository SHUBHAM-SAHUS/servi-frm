import React from 'react';
import { reduxForm, Field, FieldArray, isDirty, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, Modal, Upload, Radio, notification, Popconfirm } from 'antd';
import { Strings } from '../../../dataProvider/localize';
import { customInput } from '../../common/custom-input';
import { customTextarea } from '../../common/customTextarea';
import { CustomDatepicker } from '../../common/customDatepicker';
import { siteTaskValidate, isTaskStartDateRequired, taskEstimateRequired } from '../../../utils/Validations/scopeDocValidation';
import * as actions from '../../../actions/scopeDocActions';
import AddAreas from './AddNewScopeDoc/AddAreas'
import moment from 'moment'
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { customRadioGroup } from '../../common/customEsitmateRadioGroup'
import { handleFocus, DeepTrim, currencyFormat } from '../../../utils/common';
import { renderTaskEquipments, renderTaskMisc } from './TaskEqupMisc';
import { calculateEstimate } from './ViewEditScopeDoc'
import { getFormValues } from 'redux-form' // ES6
import { cutomExpandableText } from '../../common/cutomExpandableText';
import { CustomSelect } from '../../common/customSelect';
import $ from 'jquery';
import ScrollArea from 'react-scrollbar';

const Dragger = Upload.Dragger;


class EditSiteTask extends React.Component {

  frequencies = ["Day", "Week", "Month", "Year"];
  durations = ["Day", "Week", "Fortnight", "Month", "Year"];

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      file: [],
      imageFileArray: [],
      frequencyDataSource: [],
      durationDataSource: [],
      estimate_type: null
    }
  }

  componentWillReceiveProps(props) {
    if (props.initialValues.id !== this.props.initialValues) {
      this.state.file = []
      if (props.initialValues && props.initialValues.file) {
        let fileList = props.fileItems
        this.setState({
          file: fileList
        })
      }
      if (!this.state.estimate_type && this.props.initialValues && this.props.initialValues.estimate &&
        this.props.initialValues.estimate.estimate_type && this.props.initialValues) {
        this.setState({ estimate_type: props.initialValues.estimate.estimate_type })
      }
    }
  }


  onSubmit = async formData => {
    formData = await DeepTrim(formData);
    let data = { ...formData }
    data.id = this.props.initialValues.id
    data.site_id = this.props.initialValues.site_id
    data.file = JSON.stringify(this.state.file)
    data.areas = JSON.stringify(data.areas)
    data.estimate = JSON.stringify(data.estimate)
    data.additional_tags = JSON.stringify(data.additional_tags)
    data.duration = data.duration ? data.duration.toUpperCase().split(' ').join('_') : ''
    data.frequency = data.frequency ? data.frequency.toUpperCase().split(' ').join('_') : ''
    data.start_date = data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : null;
    data.equipments = JSON.stringify(formData.equipments);
    data.miscellaneous = JSON.stringify(formData.miscellaneous);
    delete data.files
    delete data.isDirty
    if (this.props.selectedScopeDoc.quote_number) {
      data.scope_docs_id = this.props.selectedScopeDoc.id;
      data.quote_number = this.props.selectedScopeDoc.quote_number;
      data.client_id = this.props.selectedScopeDoc.client_id;
    }


    var finalFormData = new FormData();
    Object.keys(data).forEach(key => {
      finalFormData.append(key, data[key]);
    })
    if (this.state.imageFileArray && this.state.imageFileArray.length > 0) {
      this.state.imageFileArray.forEach(item => {
        finalFormData.append('files', item.originFileObj);
      })
    }



    this.props.action.updateSiteTask(this.props.selectedScopeDocID, finalFormData)
      .then((res) => {
        this.props.action.getScopeDoc();
        //this.props.reset()
        //this.handdleCancel()
        if (this.props.submitCallBack)
          this.props.submitCallBack()
        notification.success({
          message: Strings.success_title,
          description: res.message,
          onClick: () => { },
          className: 'ant-success'
        });
      }).catch((message) => {

        notification.error({
          message: Strings.error_title,
          description: message.message ? message.message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  handdleCancel = () => {
    this.props.reset()
    this.setState({
      fileList: [], imageFileArray: []
    })
    this.props.handleCancel()
  }

  removeUploadedFile = (file) => {
    this.props.change(`isDirty`, false)
    let files = this.state.file
    const fileList = files.map((item, index) => {
      if (item.name === file.name) {
        files.splice(index, 1);
      }
    })
    this.setState({
      file: files
    })
  }

  handleSelection = () => { }

  handleFrequencySearch = value => {
    var letterNumber = /^[ 1-9]+$/;
    var array = value.split(" ");

    if (value.match(letterNumber)) {
      let postfix = value > 1 ? "s" : ""
      this.setState({
        frequencyDataSource: !value ? [] : this.frequencies.map(title => ({ text: value + " " + title + postfix, value: value + " " + title + postfix })),
      });
    } else if (array.length > 1 && !isNaN(array[0])) {
      let postfix = array[0] > 1 ? "s" : ""
      let filterValue = this.frequencies.filter(val => {
        return val.toLowerCase().includes((array[1].toLowerCase()))
      })
      this.setState({
        frequencyDataSource: !value ? [] : filterValue.map(title => ({ text: array[0] + " " + title + postfix, value: array[0] + " " + title + postfix })),
      });
    } else {
      this.setState({
        frequencyDataSource: !value ? [] : this.frequencies.map(title => ({ text: title, value: title.toString() })),
      });
    }
  };

  handleDurationSearch = value => {
    var letterNumber = /^[1-9]+$/;
    var array = value.split(" ");

    if (value.match(letterNumber)) {
      let post = value > 1 ? "s" : ""
      this.setState({
        durationDataSource: !value ? [] : this.durations.map(title => ({ text: value + " " + title + post, value: value + " " + title + post })),
      });
    } else if (array.length > 1 && !isNaN(array[0])) {
      let postfix = array[0] > 1 ? "s" : ""
      let filterValue = this.durations.filter(val => {
        return val.toLowerCase().includes((array[1].toLowerCase()))
      })
      this.setState({
        durationDataSource: !value ? [] : filterValue.map(title => ({ text: array[0] + " " + title + postfix, value: array[0] + " " + title + postfix })),
      });
    } else {
      this.setState({
        durationDataSource: !value ? [] : this.durations.map(title => ({ text: title, value: title.toString() })),
      });
    }
  };

  componentDidMount() {
    $(document).ready(function () {

      var swmsMainDivW = $('.swms-dymic-w').width();
      $('.scdo-sidebar').css('width', swmsMainDivW);

      $(window).bind('scroll', function () {
        var navHeight = $('header.ant-layout-header').height() + $('.dash-header').height() + 10;
        var windowHeight = $(window).height() - 70;
        var swmsMainDivW = $('.swms-dymic-w').width();
        if ($(window).scrollTop() > navHeight) {
          $('.scdo-sidebar').addClass('fixed');
          $('.scdo-sidebar').css('width', swmsMainDivW);
          $('.scdo-sidebar.fixed .scrollarea.sf-scroll').css('max-height', windowHeight);
        }
        else {
          $('.scdo-sidebar').removeClass('fixed');
          $('.scdo-sidebar').css('width', 'auto');
          $('.scdo-sidebar .scrollarea.sf-scroll').css('max-height', 'none');
        }
      });
    });
  }

  disableDate = (current) => {
    var startDate = moment(new Date());
    // startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  calulateTotal() {
    var { formValues } = this.props;
    console.log("FORM VALUES:::::: ", formValues);

    var equipments = formValues.equipments
    var miscs = formValues.miscellaneous
    var estimate = calculateEstimate(formValues.estimate);
    var total = 0;
    if (equipments)
      total = equipments.reduce((acc, curr) => {
        if (curr.equipment_cost)
          return acc + parseFloat(curr.equipment_cost)
        else
          return acc
      }, total);
    if (miscs)
      total = miscs.reduce((acc, curr) => {
        if (curr.miscellaneous_cost)
          return acc + parseFloat(curr.miscellaneous_cost)
        else
          return acc
      }, total);
    total = total + parseFloat(estimate) + parseFloat(formValues.adjustment_value ? formValues.adjustment_value : 0);
    this.props.change(`amount`, total)
    this.props.change(`calculated_value`, total - parseFloat(formValues.adjustment_value ? formValues.adjustment_value : 0))
    return total - parseFloat(formValues.adjustment_value ? formValues.adjustment_value : 0)
    // return { total: total, calculated_value: total - parseFloat(formValues.adjustment_value) };
    /* Object.keys(formValues).filter(key => key.startsWith('value$')) */

  }

  render() {
    const { handleSubmit, initialValues, formValues, selectedScopeDoc, taskTags, allTasks } = this.props;
    const uploadPicProps = {
      multiple: true,
      showUploadList: true,
      listType: "picture",
      accept: ".jpeg,.jpg,.png",
      fileList: this.state.fileList,
      beforeUpload: file => {
        return false;
      },
      onChange: (info) => {
        this.props.change(`isDirty`, false)
        let fileList = [...new Set(info.fileList)];
        this.setState({ fileList: fileList, imageFileArray: fileList });
      },
      onRemove: (file) => {
        file.status = 'removed';
        this.setState(prevState => {
          const fileIndex = prevState.fileList.indexOf(file);
          const newFileList = prevState.fileList.slice();
          newFileList.splice(fileIndex, 1);
          if (newFileList.length > 0) {
            return {
              fileList: newFileList,
              imageFileArray: newFileList
            };
          } else {
            delete this.props.formValues.eqp_file_name;
            return {
              fileList: [],
              imageFileArray: []
            }
          }
        })
      }
    }

    return (
      //<div className="scdo-sidebar">
      <div className="sf-card" >
        {/* <ScrollArea speed={0.8} stopScrollPropagation={true} smoothScrolling={true} className="sf-scroll" horizontal={false}> */}
        <div className="sf-card-body doc-update-task mt-2">
          <form onSubmit={handleSubmit(this.onSubmit)} >
            <fieldset className="form-group sf-form">
              <Field
                label={Strings.task_name}
                name="task_name"
                type="text"
                id="task_name"
                component={cutomExpandableText} />
            </fieldset>
            {/*  <fieldset className="form-group sf-form">
              <Field
                label={Strings.description_txt}
                name="description"
                type="text"
                id="description"
                component={customTextarea} />
            </fieldset> */}

            <fieldset className="form-group sf-form adal-task-tags">
              <Field
                label={"Additional Task Tags"}
                name={`additional_tags`}
                placeholder={Strings.description_sd_task}
                type="text"
                mode="multiple"
                options={taskTags && taskTags.map(tag => ({ title: tag.tag_name, value: tag.id }))
                }
                component={CustomSelect} />
            </fieldset>

            <fieldset className="form-group sf-form">
              <FieldArray
                name="areas"
                component={AddAreas} />
            </fieldset>
            {/* <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.estimate_txt}
                                name="estimate"
                                type="text"
                                id="estimate"
                                component={customInput} />
                        </fieldset> */}
            <FormSection name={`estimate`}>

              <div className="add-estimate-scdo esti-w-bg">
                <div className="form-group sf-form esti-tabs">
                  <label>{Strings.estimate_txt} {/* <span className="qunty-rate">$1800</span> */}</label>
                  <div className="sf-checkbox-b estimate-rd-bnt">
                    <div className="sf-roles-group">
                      <Field
                        name={`estimate_type`}
                        type="text"
                        component={customRadioGroup}
                        onChange={(e) => this.setState({ estimate_type: e.target.value })}
                        defaultValue={0} validate={taskEstimateRequired} />
                    </div>
                  </div>
                </div>
                <div className="esti-tabs-items">
                  {/* Hours click button details */}
                  {this.state.estimate_type === "hours" ?
                    <div className="row esti-hrs-dtl">
                      <div className="col-md-3">
                        <fieldset className="form-group sf-form">
                          <Field label="Staff:" name="staff" type="number"
                            component={customInput} validate={taskEstimateRequired} />
                        </fieldset>
                      </div>
                      <div className="col-md-3">
                        <fieldset className="form-group sf-form">
                          <Field label="Hours:" name="hours" type="number"
                            component={customInput} validate={taskEstimateRequired} />
                        </fieldset>
                      </div>
                      <div className="col-md-3">
                        <fieldset className="form-group sf-form">
                          <Field label="Days:" name="days" type="number"
                            component={customInput} validate={taskEstimateRequired} />
                        </fieldset>
                      </div>
                      <div className="col-md-3">
                        <fieldset className="form-group sf-form">
                          <Field label="Rate:" name="rate" type="number"
                            component={customInput} validate={taskEstimateRequired} />
                        </fieldset>
                      </div>
                    </div> :
                    this.state.estimate_type === 'area' ?
                      <div className="row ">
                        <div className="col-md-6">
                          <fieldset className="form-group sf-form">
                            <Field label="SQM:" name="sqm" type="number"
                              component={customInput} validate={taskEstimateRequired} />
                          </fieldset>
                        </div>
                        <div className="col-md-6">
                          <fieldset className="form-group sf-form">
                            <Field label="Rate:" name="rate" type="number"
                              component={customInput} validate={taskEstimateRequired} />
                          </fieldset>
                        </div>
                      </div> :

                      this.state.estimate_type === 'quant' ? <div className="row ">
                        <div className="col-md-6">
                          <fieldset className="form-group sf-form">
                            <Field label="Quantity:" name="quant" type="number"
                              component={customInput} validate={taskEstimateRequired} />
                          </fieldset>
                        </div>
                        <div className="col-md-6">
                          <fieldset className="form-group sf-form">
                            <Field label="Rate:" name="rate" type="number"
                              component={customInput} validate={taskEstimateRequired} />
                          </fieldset>
                        </div>
                      </div> : null}
                </div>
              </div>
            </FormSection>
            <div className="data-v-col no-border">
              <div className="view-text-value">
                <label>Estimate Total</label>
                <span>$ {calculateEstimate(formValues.estimate)}</span>
              </div>
            </div>
            {/* quote fields */}

            {/* this.props.selectedScopeDoc.quote_number ? */
              <div className="eqml-adst-wrap">
                {/* <div className="eqip-sd-edit">
                      <label>Equipments</label>
                      <div className="eqip-input-pnl" onClick={this.handleChildClick}>
                        <FieldArray name={`equipments`}
                          equipmentList={this.props.equipmentList}
                          component={renderTaskEquipments} /></div>
                    </div> */}
                <div className="eqip-sd-edit">
                  <label>Additional Costs</label>
                  <div className="eqip-input-pnl" onClick={this.handleChildClick}><FieldArray name={`miscellaneous`}
                    component={renderTaskMisc} /></div>
                </div>
                <div className="cat-table-view calculate-dtl">
                  <div className="data-v-row no-note-brder">
                    <div className="data-v-col no-border">
                      <div className="view-text-value">
                        <label>Calculated</label>
                        <span>$ {this.calulateTotal()}</span>
                      </div>
                    </div>
                    <fieldset className="form-group sf-form w-currency-symbl">
                      <Field
                        label="Adjustment"
                        name={`adjustment_value`}
                        type="number"
                        // validate={isRequired}
                        id="name"
                        component={customInput}
                      />
                    </fieldset>
                    <div className="data-v-col no-border">
                      <div className="view-text-value">
                        <label>{"Total"}</label>
                        <span>$ {formValues.amount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
                  /* : null */}
            <fieldset className="form-group sf-form">
              <Field
                label={Strings.note_txt}
                name="note"
                type="text"
                id="note"
                component={customTextarea} />
            </fieldset>
            {/*  <fieldset className="form-group sf-form lsico">
                  <Field
                    label={Strings.expected_start_date_txt}
                    name="start_date"
                    type="date"
                    validate={isTaskStartDateRequired}
                    disabledDate={this.disableDate}
                    component={CustomDatepicker} />
                </fieldset>
                <fieldset className="form-group sf-form">
                  <Field
                    label={Strings.task_duration_txt}
                    name="duration"
                    type="name"
                    id="duration"
                    dataSource={this.state.durationDataSource}
                    component={CustomAutoCompleteSearch}
                    onSearch={this.handleDurationSearch}
                    onSelect={this.handleSelection} />
                </fieldset>
                <fieldset className="form-group sf-form">
                  <Field
                    label={Strings.repeat_txt}
                    name="frequency"
                    type="text"
                    id="frequency"
                    dataSource={this.state.frequencyDataSource}
                    component={CustomAutoCompleteSearch}
                    onSearch={this.handleFrequencySearch}
                    onSelect={this.handleSelection} />
                </fieldset>
                <fieldset className="form-group sf-form">
                  <Field
                    label="Frequency End Date"
                    name="frequency_end_date"
                    type="date"
                    id="frequency_end_date"
                    component={CustomDatepicker} />
                </fieldset> */}


            {/*  {this.props.selectedScopeDoc.quote_number ? <fieldset className="form-group sf-form">
              <Field
                label={Strings.quote_valu_text}
                name="amount"
                type="text"
                component={customInput} />
            </fieldset> : null} */}

            <div className="form-group sf-form">
              <div className="view-text-value sf-form">
                {this.state && this.state.file && this.state.file.length > 0 ?
                  <label>Images</label> : ''}
                <div className="files-lits-sc">
                  {this.state && this.state.file && this.state.file.length > 0
                    ? (this.state.file.map((item, index) => (
                      <div className="sc-upld-files">
                        <img alt="taskImage" src={item && item.file_url ? item.file_url : ''} />
                        <button type="button" className="normal-bnt" onClick={() => this.removeUploadedFile(item)}><i class="material-icons">close</i></button>
                      </div>
                    ))) : ""}
                </div>
              </div>
            </div>

            <div className="form-group sf-form">
              {/* <label className="upload-f">{"Add New File"}</label> */}
              <div className="sm-upload-box">
                <Dragger {...uploadPicProps} >
                  <p className="ant-upload-drag-icon">
                    <i class="material-icons">cloud_upload</i>
                  </p>
                  <p className="ant-upload-text">{Strings.img_upload_text}</p>
                </Dragger>
              </div>
            </div>
            <div className="all-btn multibnt update-bnt-w-popup">
              <div className="btn-hs-icon d-flex justify-content-between">
                <button onClick={this.handdleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                  {Strings.cancel_btn}</button>
                {
                  (selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].client_approve_status) && selectedScopeDoc.quotes[0].client_approve_status === 3
                    ? <Popconfirm className="update-spn" placement="rightTop" title={Strings.confirm_quote_update} okText="Yes" cancelText="No" onConfirm={() => this.onSubmit(this.props.formValues)}>
                      <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>{Strings.update_btn}</button>
                    </Popconfirm>
                    : <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                      {Strings.update_btn}</button>
                }
              </div>
            </div>
          </form>
        </div>
        {/* </ScrollArea> */}
      </div>
      // </div>
    );
  }
}

const mapStateToProps = (state, { initialValues }) => {
  return {
    scopeDocData: state.scopeDocs.scopeDocs,
    formValues: state.form['EditSiteTask' + initialValues.id] && state.form['EditSiteTask' + initialValues.id].values ? state.form['EditSiteTask' + initialValues.id].values : {},
    isDirty: isDirty(`EditSiteTask${initialValues.id}`)(state),
    equipmentList: state.scopeDocs.equipmentList ? state.scopeDocs.equipmentList : [],
    taskTags: state.scopeDocs.taskTags ? state.scopeDocs.taskTags : [],


  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'EditSiteTask', validate: siteTaskValidate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(EditSiteTask)