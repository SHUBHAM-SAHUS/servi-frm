import React, { Component } from 'react'
import { connect } from 'react-redux'
import { reduxForm, Field } from 'redux-form';
import { Upload, Icon, message, Modal, Menu, Dropdown, notification } from 'antd';
import { Strings } from '../../../dataProvider/localize';

import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomCheckbox } from '../../common/customCheckbox';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { customTextarea } from '../../common/customTextarea';

import { bindActionCreators } from 'redux';
import * as equipmentManagementActions from '../../../actions/equipmentManagementActions';
import moment from 'moment';
import { DeepTrim } from '../../../utils/common';


const { Dragger } = Upload;

export class AddTestAndTag extends Component {

  state = {
    fileList: [],
  }

  handlePreUpload = (file, fileList) => {
    this.setState({ fileList: [file] });
    return false;
  }

  handleChange = info => {
    if (this.state.fileList.length === 0 && info.file.status !== 'removed') {
      this.setState({ fileList: [...info.fileList] })
      this.props.change('licenseFile', info.file)
    }
    if (this.state.fileList.length > 0) {
      let fileList = [...info.fileList];
      fileList = fileList.slice(-1);
      this.setState({ fileList })
      this.props.change('licenseFile', info.file)
    }
  }

  handleRemove = file => {
    file.status = 'removed';
    this.setState({ fileList: [] });
    delete this.props.formValues.licenseFile;
  }

  onSubmitAddTestAndTag = async (formData) => {
    formData = await DeepTrim(formData);

    var finalFormData = new FormData();
    var testerObj = {};
    testerObj.id = formData.tester;
    testerObj.license_type = formData.license_type;
    testerObj.license_expiry = formData.license_expiry;
    this.props.testers.map(tester => {
      if (tester.id == formData.tester) {
        testerObj.tester = tester.tester;
      }
    })
    if (this.state.fileList.length > 0) {
      finalFormData.append('license_file', this.state.fileList);
    }
    finalFormData.append('test_date', formData.test_date);
    finalFormData.append('test_type', formData.test_type);
    finalFormData.append('next_test_date', formData.next_test_date);
    finalFormData.append('result', formData.result);
    finalFormData.append('tester', JSON.stringify(testerObj));
    finalFormData.append('equ_id', formData.id);
    this.props.equipmentActions.addTestAndTag(finalFormData, formData.id).then(message => {
      notification.success({
        message: Strings.success_title,
        description: Strings.equipment_test_and_tag_added_success,
        onClick: () => { },
        className: 'ant-success'
      });
    }).catch(message => {
      notification.error({
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    })
  }

  handleTesterSelection = testerId => {
    const testerData = this.props.testers.find(tester => tester.id == testerId);
    this.props.change('license_type', testerData.license_type)
    this.props.change('license_expiry', testerData.license_expiry)
  }

  disableTestDate = (current) => {
    var startDate = moment(new Date());
    return current && current.valueOf() > startDate;
  }

  disableLicenseExpiry = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  render() {
    const fileProps = {
      accept: ".jpeg,.jpg,.png",
      multiple: false,
      listType: "picture",
      fileList: this.state.fileList,
      beforeUpload: this.handlePreUpload,
      onChange: this.handleChange,
      onRemove: this.handleRemove,
    };

    const { isFromEdit, display, allTestType, testers, handleSubmit, resultList } = this.props;
    const dynamicClasses = ["sf-card"];
    if (isFromEdit && display === 'none') {
      dynamicClasses.push('d-none');
    }
    return (
      <div className={dynamicClasses.join(' ')}>
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h4 className="sf-sm-hd sf-pg-heading">{Strings.test_tag_txt}</h4>
          <div className="info-btn">
          </div>
        </div>
        <div className="sf-card-body mt-2" >
          <form onSubmit={handleSubmit(this.onSubmitAddTestAndTag)} >
            <fieldset className="form-group sf-form lsico">
              <Field
                label="Test Date"
                name="test_date"
                placeholder={moment(new Date()).format("YYYY-MM-DD")}
                type="date"
                id="test_date"
                disabledDate={this.disableTestDate}
                component={CustomDatepicker} />
            </fieldset>
            <fieldset className="form-group sf-form select-wibg">
              <Field
                label="Test Type"
                name="test_type"
                placeholder={Strings.test_type_ceq}
                type="text"
                dataSource={allTestType && allTestType.map((item, index) => {
                  return {
                    text: item.test_type,
                    value: item.id
                  }
                })}
                component={CustomAutoCompleteSearch} />
            </fieldset>
            <fieldset className="form-group sf-form select-wibg">
              <Field
                label="Tester"
                name="tester"
                placeholder={Strings.tester_ceq}
                type="text"
                dataSource={testers && testers.map(item => {
                  return {
                    text: item.tester,
                    value: item.id
                  }
                })}
                component={CustomAutoCompleteSearch}
                onSelect={(value) => { this.handleTesterSelection(value) }}
              />
            </fieldset>
            <fieldset className="form-group sf-form select-wibg">
              <Field
                label="Tester License Type"
                name="license_type"
                placeholder={Strings.license_type_ceq}
                type="text"
                dataSource={testers && testers.map(item => {
                  return {
                    text: item.license_type,
                    value: item.license_type
                  }
                })}
                component={CustomAutoCompleteSearch} />
            </fieldset>
            <fieldset className="form-group sf-form lsico">
              <label style={{ display: 'inline-block' }}>
                <p>Tester License</p>
              </label>
              <div className="sm-upload-box">
                <Dragger {...fileProps}>
                  <p className="ant-upload-drag-icon">
                    <i class="anticon material-icons">cloud_upload</i>
                  </p>
                  <p className="ant-upload-text">{Strings.img_upload_text}</p>
                </Dragger>
              </div>
            </fieldset>
            <fieldset className="form-group sf-form lsico">
              <Field
                label="Tester License Expiry"
                name="license_expiry"
                type="date"
                id="tester_license_expiry"
                disabledDate={this.disableLicenseExpiry}
                component={CustomDatepicker} />
            </fieldset>
            <fieldset className="form-group sf-form">
              <Field
                label="Result"
                name="result"
                placeholder={Strings.result_ceq}
                type="text"
                dataSource={resultList && resultList.map((item, index) => {
                  return {
                    text: item.result,
                    value: item.result
                  }
                })}
                component={CustomAutoCompleteSearch} />
            </fieldset>
            <fieldset className="form-group sf-form lsico">
              <Field
                label="Next Test Date"
                name="next_test_date"
                placeholder=""
                type="date"
                id="next_test_date"
                disabledDate={this.disableLicenseExpiry}
                component={CustomDatepicker} />
            </fieldset>
            {
              isFromEdit
                ? <div className="btn-hs-icon">
                  <button type="submit" className="bnt bnt-active">
                    <Icon type="save" theme="filled" />{Strings.save_btn}</button>
                </div>
                : null
            }
          </form>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    testers: state.equipmentManagement.testersList,
    formValues: state.form.AddNewEquipment.values,
    allTestType: state.equipmentManagement.allTestType,
    resultList: state.equipmentManagement.resultList
  }
}

const mapDispatchToProps = dispatch => {
  return {
    equipmentActions: bindActionCreators(equipmentManagementActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddTestAndTag);
