import React from 'react';
import { Upload, Icon, message, Modal, Menu, Dropdown, notification } from 'antd';
import { reduxForm, Field, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import $ from 'jquery';

import { validate } from '../../../utils/Validations/equipmentValidations';
import { customInput } from '../../common/custom-input';
import * as actions from '../../../actions/roleManagementActions';
import * as rolePermissionAction from '../../../actions/permissionManagementAction';
import * as equipmentManagementActions from '../../../actions/equipmentManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { CustomCheckbox } from '../../common/customCheckbox';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { getStorage, handleFocus } from '../../../utils/common';
import { AddTestAndTag } from './AddTestAndTag';
import { DeepTrim } from '../../../utils/common';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomSwitch } from '../../common/customSwitch';
import { customTextarea } from '../../common/customTextarea';
import { CustomSelect } from '../../common/customSelect';
import moment from 'moment';


// upload images
const { Dragger } = Upload;

class AddNewEquipment extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'block',
      height: 0,
      cardExpandBtn: true,
      fileList: [],
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  componentDidMount() {
    $('.upeqip-pic').addClass('sm-drbx');
  }


  componentDidUpdate(prevProps, prevState) {
    // if (this.state.fileList.length > 0) {
    //   $('.upeqip-pic').addClass('sm-drbx');
    // } else {
    //   $('.upeqip-pic').removeClass('sm-drbx')
    // }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.formObject && "syncErrors" in props.formObject && Object.keys(props.formObject.syncErrors).length > 0) {

    }
  }

  beforeSubmit = () => {
    let values = this.props.formValues
    if (values && (values.test_date || values.test_type || values.tester || values.license_type || values.license_expiry || values.result || values.next_test_date)) {
      if (!(values && values.test_date && values.test_type && values.tester && values.license_type && values.license_expiry && values.result && values.next_test_date)) {
        if (this.state.cardExpandBtn === false) {
          this.handleExpand()
        }
      }
    }
  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);
    formData.status = formData.status ? 1 : 0

    if (formData.hasOwnProperty('services') && Object.keys(formData['services']).length > 0) {
      const services = [];
      Object.keys(formData['services']).forEach(key => {
        services.push({ "service_id": key })
      })
      formData['services'] = services;
    }

    formData['test_date'] = formData.test_date && formData.test_date._d;
    formData['license_expiry'] = formData.license_expiry && formData.license_expiry._d;
    formData['next_test_date'] = formData.next_test_date && formData.next_test_date._d;
    formData.purchase_date = moment(formData.purchase_date && formData.purchase_date._d).format('YYYY-MM-DD')
    formData.destroy_after_date = moment(formData.destroy_after_date && formData.destroy_after_date._d).format('YYYY-MM-DD')

    formData.status = formData.status ? 1 : 0;

    this.props.equipmentActions.addEquipment(formData)
      .then(flag => {
        this.props.reset();
        this.setState({
          // fileList: [],
        })
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: Strings.equipment_create_success,
            onClick: () => { },
            className: 'ant-success'
          });
        }
      })
      .then(() => {
        this.props.history.push('./')

      })
      .catch((error) => {
        if (error.status == VALIDATE_STATUS) {
          notification.warning({
            message: Strings.validate_title,
            description: error && error.data && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_validate,
            onClick: () => { },
            className: 'ant-warning'
          });
        } else {
          notification.error({
            message: Strings.error_title,
            description: error && error.data && error.data.message && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        }
      });
  }

  handlePreUpload = (file) => {
    this.setState(prevState => {
      return {
        fileList: [...prevState.fileList, file]
      }
    })
    return false;
  }

  handleChange = info => {
    this.setState({ fileList: [...info.fileList] })
    if (this.state.fileList.length === 0 && info.file.status !== 'removed') {
      this.props.change('equipmentFiles', info.file)
    } else if (this.state.fileList.length > 0 && info.file.status !== 'removed') {
      this.props.change('equipmentFiles', info.fileList)
    }
  }

  handleRemove = file => {
    file.status = 'removed';
    this.setState(prevState => {
      const fileIndex = prevState.fileList.indexOf(file);
      const newFileList = prevState.fileList.slice();
      newFileList.splice(fileIndex, 1);
      if (newFileList.length > 0) {
        this.props.change('equipmentFiles', newFileList)
        return {
          fileList: newFileList,
        };
      } else {
        delete this.props.formValues.equipmentFiles;
        return {
          fileList: []
        }
      }
    });
  }

  handleCancel = () => {
    this.setState({ displayEdit: 'none' });
  }

  handleCard = () => {

  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpandBtn: !this.state.cardExpandBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  getYears() {
    let currentYear = new Date().getFullYear()
    let yearArray = [];
    for (var i = 0; i < 30; i++) {
      yearArray.push(currentYear.toString())
      currentYear = currentYear - 1;
    }
    return yearArray
  }

  render() {
    const fileProps = {
      accept: ".jpeg,.jpg,.png,.pdf,.docx",
      multiple: true,
      listType: "picture-card",
      fileList: this.state.fileList,
      beforeUpload: this.handlePreUpload,
      onChange: this.handleChange,
      onRemove: this.handleRemove
    };

    const { handleSubmit, togleSearch, equipments, services, } = this.props;
    var menu = (
      <Menu>
        <Menu.Item onClick={this.handleEditClick}>
          Equipment
        </Menu.Item>
      </Menu>
    );

    const detailsSection = (
      <div className="col-md-12 col-lg-8">
        <div className="sf-card-wrap">
          {/* zoom button  */}
          <div className="card-expands">
            <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
              <Icon type={this.state.cardExpandBtn ? "fullscreen" : "fullscreen-exit"} /></button>
          </div>
          <div className="sf-card">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.equipment_details}</h2>
              <div className="info-btn disable-dot-menu">
                <Dropdown className="more-info" disabled overlay={menu}>
                  <i className="material-icons">more_vert</i>
                </Dropdown>
              </div>
            </div>
            <div className="sf-card-body mt-2">
              <div className="row">
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_name}
                      name="name"
                      placeholder={Strings.name_ued}
                      type="text"
                      dataSource={equipments && equipments.map(item => {
                        return {
                          text: item.name,
                          value: item.name.toString()
                        }
                      })}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_id}
                      name="equipment_id"
                      placeholder={Strings.equipment_id_ued}
                      type="text"
                      dataSource={equipments && equipments.map((item, index) => {
                        return {
                          text: item.equipment_id,
                          value: item.id
                        }
                      })}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.type_txt}
                      placeholder={Strings.type_ued}
                      name="type"
                      type="text"
                      dataSource={equipments && equipments.map(item => {
                        return {
                          text: item.type,
                          value: item.id
                        }
                      })}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.group_txt}
                      placeholder={Strings.equ_group_ued}
                      name="equ_group"
                      type="text"
                      dataSource={equipments && equipments.map(item => {
                        return {
                          text: item.equ_group,
                          value: item.id
                        }
                      })}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_cost}
                      name="cost"
                      placeholder={Strings.cost_ued}
                      type="number"
                      component={customInput} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_year_of_manufacture}
                      name="manufacture_year"
                      type="text"
                      placeholder="yyyy"
                      dataSource={this.getYears().map(year => ({ text: year, value: year }))}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_manufacture_batch_no}
                      name="manufacture_batch_no"
                      placeholder={Strings.eq_manufacture_batch_no}
                      id="manufacture_batch_no"
                      type="text"
                      component={customInput} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_serial_no}
                      name="serial_no"
                      placeholder={Strings.eq_serial_no}
                      id="serial_no"
                      type="text"
                      component={customInput} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_brand}
                      name="brand"
                      placeholder={Strings.eq_brand}
                      id="brand"
                      type="text"
                      component={customInput} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <label>{Strings.equipment_purchase_date}</label>
                    <Field
                      placeholder={moment(new Date()).format("YYYY-MM-DD")}
                      name="purchase_date"
                      id="purchase_date"
                      type="text"
                      component={CustomDatepicker} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <label>{Strings.equipment_destroy_date}</label>
                    <Field
                      placeholder={moment(new Date()).format("YYYY-MM-DD")}
                      name="destroy_after_date"
                      id="destroy_after_date"
                      type="text"
                      component={CustomDatepicker} />
                  </fieldset>
                </div>
                <div className="col-sm-12 col-md-6">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_status}
                      name="status"
                      id="status"
                      component={CustomSwitch} />
                  </fieldset>
                </div>
                <div className="col-sm-12">
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.equipment_notes}
                      placeholder={Strings.equipment_notes}
                      name="notes"
                      type="text"
                      id="notes"
                      component={customTextarea} />
                  </fieldset>
                </div>
              </div>

            </div>
          </div>

          <div className="sf-card mt-4">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.upload_images}</h2>
              <div className="info-btn disable-dot-menu">
                <Dropdown className="more-info" disabled overlay={menu}>
                  <i className="material-icons">more_vert</i>
                </Dropdown>
              </div>
            </div>
            <div className="sf-card-body mt-2">
              <div className="upload-sfv-file add-equipment-img upeqip-pic">
                <Dragger
                  {...fileProps}>
                  <p className="ant-upload-drag-icon">
                    <i class="material-icons">cloud_upload</i>
                  </p>
                  <p className="ant-upload-text">Choose file to upload</p>
                  <p className="ant-upload-hint">
                    {Strings.img_drag_drop_text}
                  </p>
                </Dragger>
              </div>
            </div>

          </div>

          {/* zoom save button  */}
          <div className="row zoom-save-bnt">
            <div className="col-md-12">
              <div className="all-btn d-flex justify-content-end mt-4">
                <div className="btn-hs-icon">
                  <a href='' onClick={this.beforeSubmit}>
                    <button type="submit" className="bnt bnt-active"
                    >
                      <Icon type="save" theme="filled" /> {Strings.save_btn}</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="all-btn d-flex justify-content-end mt-4">
          <div className="btn-hs-icon">
            <button type="submit" className="bnt bnt-active">
              <Icon type="save" theme="filled" /> {Strings.save_btn}</button>
          </div>
        </div>
      </div>
    )

    const servicesSection = (
      <div className="sf-card mt-4">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h4 className="sf-sm-hd sf-pg-heading">Link to Services</h4>
        </div>
        <div className="sf-card-body mt-2">
          {/* <div > */}
          <FormSection name="services" className="sf-roles-group add-sub-mod">
            {services.map(service => {
              return (
                <Field
                  label={service.service_name}
                  name={service.id}
                  component={CustomCheckbox} />
              )
            })}
          </FormSection>
          {/* </div> */}
        </div>
      </div>
    )

    return (

      < div className={togleSearch ? "col-md-9" : "col-md-9 col-md-srch"} >
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="row">
            {detailsSection}
            <div className="col-lg-4 col-md-12">
              <AddTestAndTag
                {...this.props}
                isFromAdd
                onLicenseChange={this.handleLicenseChange}
                submissionStatus={this.state.submitted}
              />
              {servicesSection}
            </div>
          </div>
        </form>
      </div >
    );
  }
}

const mapStateToProps = (state) => {
  return {
    roles: state.roleManagement.roles,
    services: state.industryManagement.services,
    testers: state.equipmentManagement.testersList,
    equipments: state.equipmentManagement.equipmentsList,
    formObject: state.form.AddNewEquipment,
    formValues: state.form.AddNewEquipment && state.form.AddNewEquipment.values,
    accessControlsByModule: state.accessControlManagement.accessControlsByModule,
    initialValues: { organisation_id: JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null },
    allTestType: state.equipmentManagement.allTestType,
    resultList: state.equipmentManagement.resultList
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    rolePermissionAction: bindActionCreators(rolePermissionAction, dispatch),
    equipmentActions: bindActionCreators(equipmentManagementActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'AddNewEquipment', validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AddNewEquipment)