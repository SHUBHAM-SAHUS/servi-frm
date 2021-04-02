import React from 'react';
import { Icon, Menu, Dropdown, Modal, Collapse, Upload, notification, } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { getStorage, setStorage, currencyFormat, handleFocus } from '../../../utils/common';
import $ from 'jquery';

import { validate } from '../../../utils/Validations/roleValidation';
import { customInput } from '../../common/custom-input';
import { CustomSwitch } from '../../common/customSwitch';
import * as actions from '../../../actions/roleManagementActions';
import * as rolePermissionAction from '../../../actions/permissionManagementAction';
import * as equipmentManagementActions from '../../../actions/equipmentManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { CustomCheckbox } from '../../../components/common/customCheckbox';
import { ADMIN_DETAILS, ACCESS_CONTROL, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { AddTestAndTag } from './AddTestAndTag';
import moment from 'moment';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { DeepTrim } from '../../../utils/common';
import { CustomDatepicker } from '../../common/customDatepicker';
import { customTextarea } from '../../common/customTextarea';
import { CustomSelect } from '../../common/customSelect';


const { Panel } = Collapse;
const { Dragger } = Upload;

class EditEquipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'none',
      displayImageEdit: 'none',
      cardExpnadBtn: true,
      displayAddTestAndTag: 'none',
      fileList: [],
      displayView: 'block',
      file_name: []
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  handleEditClick = () => {
    this.setState({ displayEdit: 'block', displayView: 'none' });
    this.setState({ displayImageEdit: 'none' });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.equipmentDetails.id !== prevProps.equipmentDetails.id) {
      if (this.props.equipmentDetails && this.props.equipmentDetails.equipmentList && this.props.equipmentDetails.equipmentList.length > 0 && this.props.equipmentDetails.equipmentList[0].file_name && this.props.equipmentDetails.equipmentList[0].equ_file_path) {
        var equipmentFiles = this.props.equipmentDetails.equipmentList[0].file_name.replace('["', '').replace('"]', '').replace(/\"/g, "").split(',');
        this.setState({ file_name: equipmentFiles });
        var existingFileArray = [];
        for (let file in equipmentFiles) {
          existingFileArray.push({
            uid: file,
            name: equipmentFiles[file],
            status: 'done',
            url: this.props.equipmentDetails.equipmentList[0].equ_file_path + equipmentFiles[file]
          });
        }
        this.setState({ fileList: existingFileArray });
      }
      this.setState({ displayImageEdit: 'block', displayView: 'none' });
      this.setState({ displayEdit: 'none' });
      if (!this.state.cardExpnadBtn) {
        this.handleExpand()
      }
    }
  }

  handleImageEdit = () => {
    if (this.props.equipmentDetails && this.props.equipmentDetails.equipmentList && this.props.equipmentDetails.equipmentList.length > 0 && this.props.equipmentDetails.equipmentList[0].file_name && this.props.equipmentDetails.equipmentList[0].equ_file_path) {
      var equipmentFiles = this.props.equipmentDetails.equipmentList[0].file_name.replace('["', '').replace('"]', '').replace(/\"/g, "").split(',');
      this.setState({ file_name: equipmentFiles });
      var existingFileArray = [];
      for (let file in equipmentFiles) {
        existingFileArray.push({
          uid: file,
          name: equipmentFiles[file],
          status: 'done',
          url: this.props.equipmentDetails.equipmentList[0].equ_file_path + equipmentFiles[file]
        });
      }
      this.setState({ fileList: existingFileArray });
    }
    this.setState({ displayImageEdit: 'block', displayView: 'none' });
    this.setState({ displayEdit: 'none' });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleCancel = () => {
    this.setState({ displayEdit: 'none', displayView: 'block' });
  }

  handleImageCancel = () => {
    this.setState({ displayImageEdit: 'none', displayView: 'block' });
  }

  onSubmitEquipmentDetails = async (formData) => {
    formData = await DeepTrim(formData);
    formData.status = formData.status ? 1 : 0

    var services = [];
    for (let key in formData) {
      let serviceId = key.split('_');
      if (serviceId[0] === 'service') {
        if (formData[key]) {
          let serviceObj = {
            service_id: serviceId[1]
          }
          services.push(serviceObj);
        }
      }
    }
    formData.purchase_date = moment(formData.purchase_date).format('YYYY-MM-DD')
    formData.destroy_after_date = moment(formData.destroy_after_date).format('YYYY-MM-DD')
    formData.services = services && services.length ? JSON.stringify(services) : [];

    this.props.equipmentActions.updateEquipment(formData).then(message => {
      this.setState({ displayEdit: 'none', displayView: 'block' });
      notification.success({
        message: Strings.success_title,
        description: Strings.equipment_update_success,
        onClick: () => { },
        className: 'ant-success'
      });
    }).catch(error => {
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
    })

  }

  onSubmitEquipmentImage = (formData) => {
    var finalFormData = new FormData();
    if (this.state.fileList.length > 0) {
      Object.keys(formData).map(key => {
        if (key === 'eqp_file_name') {
          Object.values(formData[key]).forEach(file => {
            if (file && file.name) {
              var filteredFile;
              if (this.props.equipmentDetails && this.props.equipmentDetails.equipmentList && this.props.equipmentDetails.equipmentList.length > 0 && this.props.equipmentDetails.equipmentList[0].file_name && this.props.equipmentDetails.equipmentList[0].equ_file_path) {
                var equipmentFiles = this.props.equipmentDetails.equipmentList[0].file_name.replace('["', '').replace('"]', '').replace(/\"/g, "").split(',');
                filteredFile = equipmentFiles.filter(item => item === file.name);
                if (filteredFile && filteredFile.length) {
                } else {
                  finalFormData.append('eqp_file_name', file.originFileObj);
                }
              }
            }
          })
        }
      });
    }
    finalFormData.append('id', formData.id);
    finalFormData.append('file_name', JSON.stringify(this.state.file_name));
    this.props.equipmentActions.updateEquipment(finalFormData, formData.id).then(message => {
      this.setState({ displayImageEdit: 'none', displayView: 'block' });
      notification.success({
        message: Strings.success_title,
        description: Strings.equipment_update_success,
        onClick: () => { },
        className: 'ant-success'
      });
    }).catch(error => {
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
    })
  }

  handlePreUpload = (file) => {
    return false;
  }

  handleFileChange = info => {
    this.setState({ fileList: info.fileList })
    this.props.change('eqp_file_name', info.fileList)
  }

  handleFileRemove = file => {
    var filteredFile = this.state.file_name.filter(item => item === file.name);
    if (filteredFile && filteredFile.length) {
      this.setState({ file_name: this.state.file_name.filter(item => item.toString() !== file.name.toString()) });
    }
    file.status = 'removed';
    this.setState(prevState => {
      const fileIndex = prevState.fileList.indexOf(file);
      const newFileList = prevState.fileList.slice();
      newFileList.splice(fileIndex, 1);
      if (newFileList.length > 0) {
        this.props.change('eqp_file_name', newFileList)
        return {
          fileList: newFileList,
        };
      } else {
        delete this.props.formValues.eqp_file_name;
        return {
          fileList: []
        }
      }
    });
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  handleAddTag = () => {
    this.setState({ displayAddTestAndTag: 'block' })
  }

  // roleAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["rolesmanagement"].permissions;
  // /**Permissions for the module */
  // permissions = {
  // }

  getYears() {
    let currentYear = new Date().getFullYear()
    let yearArray = [];
    for (var i = 0; i < 30; i++) {
      yearArray.push(currentYear.toString())
      currentYear = currentYear - 1;
    }
    return yearArray
  }

  downloadFile = (name, url) => {
    fetch(url)
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = name;
          a.click();
        }).catch(() => console.log("Can’t access " + url + " response. Blocked by browser?"));
      });
  }

  render() {

    const { handleSubmit, togleSearch, equipmentDetails, services, equipmentsList, initialValues, formValues } = this.props;
    var selectedEquipment = equipmentDetails && equipmentDetails.equipmentList && equipmentDetails.equipmentList.length > 0 ? equipmentDetails.equipmentList[0] : '';
    var equ_file_path = equipmentDetails && equipmentDetails.equipmentList && equipmentDetails.equipmentList.length > 0 ? equipmentDetails.equ_file_path : '';
    var equipmentFiles = selectedEquipment.file_name && selectedEquipment.file_name.replace('["', '').replace('"]', '').replace(/\"/g, "").split(',');

    var serviceArray = [];
    if (services && services.length > 0 && selectedEquipment && selectedEquipment.equipment_services && selectedEquipment.equipment_services.length > 0) {
      selectedEquipment.equipment_services.map(service => {
        let serviceObj = services.filter(item => item.id === service.service_id);
        return serviceArray.push(...serviceObj);
      })
    }

    const fileProps = {
      accept: ".jpeg,.jpg,.png,.pdf,.docx",
      multiple: true,
      listType: "picture-card",
      fileList: this.state.fileList,
      beforeUpload: this.handlePreUpload,
      onChange: this.handleFileChange,
      onRemove: this.handleFileRemove
    };


    var menu = (<Menu>
      <Menu.Item onClick={this.handleEditClick}>
        {Strings.update_equipment}
      </Menu.Item>
    </Menu>);

    var permissionMenu = (
      <Menu>
        <Menu.Item onClick={this.handleImageEdit}>
          {Strings.upload_equipment_image}
        </Menu.Item>
      </Menu>
    );


    return (
      <div className={togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <div className="row">
          <div className="col-lg-8 col-md-12 mb-4">
            <div className="sf-card-wrap">
              {/* zoom button  */}
              <div className="card-expands">
                <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                  <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
              </div>
              <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.equipment_details}</h2>
                  <div className="info-btn">
                    {/* Drop down for card */}
                    <Dropdown className="more-info" overlay={menu}>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                    {/*Drop down*/}
                  </div>
                </div>

                <div className="sf-card-body mt-2">

                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_name}</label>
                        <span>{selectedEquipment && selectedEquipment.name ? selectedEquipment.name : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_id}</label>
                        <span>{selectedEquipment && selectedEquipment.equipment_id ? selectedEquipment.equipment_id : ''}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value pr-3">
                        <label>{Strings.type_txt}</label>
                        <span>{selectedEquipment && selectedEquipment.type ? selectedEquipment.type : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.group_txt}</label>
                        <span>{selectedEquipment && selectedEquipment.equ_group ? selectedEquipment.equ_group : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_cost}</label>
                        <span>{selectedEquipment && selectedEquipment.cost ? currencyFormat(selectedEquipment.cost) : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_year_of_manufacture}</label>
                        <span>{selectedEquipment && selectedEquipment.manufacture_year ? selectedEquipment.manufacture_year : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_manufacture_batch_no}</label>
                        <span>{selectedEquipment && selectedEquipment.manufacture_batch_no ? selectedEquipment.manufacture_batch_no : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_serial_no}</label>
                        <span>{selectedEquipment && selectedEquipment.serial_no ? selectedEquipment.serial_no : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_brand}</label>
                        <span>{selectedEquipment && selectedEquipment.brand ? selectedEquipment.brand : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_purchase_date}</label>
                        <span>{selectedEquipment && selectedEquipment.purchase_date ? moment(selectedEquipment.purchase_date).format('DD-MM-YYYY') : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_destroy_date}</label>
                        <span>{selectedEquipment && selectedEquipment.destroy_after_date ? moment(selectedEquipment.destroy_after_date).format('DD-MM-YYYY') : ''}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_status}</label>
                        <span>{selectedEquipment && selectedEquipment.status === 1 ? 'Active' : 'Inactive'}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.equipment_notes}</label>
                        <span>{selectedEquipment && selectedEquipment.notes ? selectedEquipment.notes : ''}</span>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* perimission */}

              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.upload_images}</h2>
                  <div className="info-btn">
                    <Dropdown className="more-info" overlay={permissionMenu}>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>

                <div className="sf-card-body mt-2">
                  <div className="row eqip-view-pic">
                    {
                      equipmentFiles && equipmentFiles.length > 0
                        ? equipmentFiles.map(file => {
                          const fileUrl = selectedEquipment.equ_file_path ? selectedEquipment.equ_file_path + file : ''
                          return <div className="col-md-4">
                            {file && (file.includes('.PDF') || file.includes('.pdf'))
                              ?
                              <div className="equip-pic equip-pic-icons"><i class="fa fa-file-pdf-o"></i></div>
                              :
                              file && file.includes('.docx')
                                ?
                                <div className="equip-pic equip-pic-icons"><i class="fa fa-file-text-o"></i></div>
                                :
                                <div className="equip-pic">
                                  <img alt="equipmentImage" src={fileUrl} />
                                </div>
                            }
                            <button type='button' className="download-view">
                              <a href="#" onClick={() => this.downloadFile(file, fileUrl)}>
                                <i class="material-icons">get_app</i>
                              </a>
                            </button>
                            <button type='button' className="download-view ml-1">
                              <a href={fileUrl} target='blank'>
                                <i class="material-icons">visibility</i>
                              </a>
                            </button>
                          </div>
                        })
                        : null
                    }

                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Edit */}
          <div className="col-lg-4 col-md-12">
            {/* Update Equipment Details */}
            <div className="sf-card mb-4" style={{ display: this.state.displayEdit }}>
              <form onSubmit={handleSubmit(this.onSubmitEquipmentDetails)} >
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h4 className="sf-sm-hd sf-pg-heading">Update Equipment Details</h4>
                </div>
                <div className="sf-card-body mt-2">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_name}
                      name="name"
                      placeholder={Strings.name_ued}
                      type="text"
                      // dataSource={[]}
                      dataSource={equipmentsList && equipmentsList.map(item => {
                        return {
                          text: item.name,
                          value: item.name
                        }
                      })}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_id}
                      name="equipment_id"
                      placeholder={Strings.equipment_id_ued}
                      type="text"
                      dataSource={equipmentsList && equipmentsList.map(item => {
                        return {
                          text: item.equipment_id,
                          value: item.equipment_id
                        }
                      })}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.type_txt}
                      name="type"
                      placeholder={Strings.type_ued}
                      type="text"
                      dataSource={equipmentsList && equipmentsList.map(item => {
                        return {
                          text: item.type,
                          value: item.type
                        }
                      })}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.group_txt}
                      name="equ_group"
                      placeholder={Strings.equ_group_ued}
                      type="text"
                      dataSource={equipmentsList && equipmentsList.map(item => {
                        return {
                          text: item.equ_group,
                          value: item.equ_group
                        }
                      })}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_cost}
                      name="cost"
                      placeholder={Strings.cost_ued}
                      type="number"
                      component={customInput} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_year_of_manufacture}
                      name="manufacture_year"
                      placeholder="yyyy"
                      id="manufacture_year"
                      dataSource={this.getYears().map(year => ({ text: year, value: year }))}
                      component={CustomAutoCompleteSearch} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_manufacture_batch_no}
                      name="manufacture_batch_no"
                      placeholder={Strings.eq_manufacture_batch_no}
                      id="manufacture_batch_no"
                      type="text"
                      component={customInput} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_serial_no}
                      name="serial_no"
                      placeholder={Strings.eq_serial_no}
                      id="serial_no"
                      type="text"
                      component={customInput} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_brand}
                      name="brand"
                      placeholder={Strings.eq_brand}
                      id="brand"
                      type="text"
                      component={customInput} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <label>{Strings.equipment_purchase_date}</label>
                    <Field
                      name="purchase_date"
                      id="purchase_date"
                      type="text"
                      component={CustomDatepicker} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <label>{Strings.equipment_destroy_date}</label>
                    <Field
                      name="destroy_after_date"
                      id="destroy_after_date"
                      type="text"
                      component={CustomDatepicker} />
                  </fieldset>
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.equipment_status}
                      name="status"
                      id="status"
                      component={CustomSwitch} />
                  </fieldset>
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.equipment_notes}
                      name="notes"
                      type="text"
                      id="notes"
                      component={customTextarea} />
                  </fieldset>
                </div>
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h4 className="sf-sm-hd sf-pg-heading">Link to Services</h4>
                </div>
                <div className="sf-card-body mt-2">
                  <div className="sf-roles-group add-sub-mod">
                    {services.map(service => {
                      return (
                        <Field
                          label={service.service_name}
                          name={`service_${service.id}`}
                          component={CustomCheckbox} />
                      )
                    })}
                  </div>
                </div>
                <div className="all-btn multibnt px-3 pb-3">
                  <div className="btn-hs-icon d-flex justify-content-between">
                    <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" >
                      {Strings.cancel_btn}</button>
                    <button type="submit" className="bnt bnt-active" >
                      {Strings.update_btn}</button>
                  </div>
                </div>
              </form>
            </div>

            {/* Update upload Images */}
            <div className="sf-card mb-4" style={{ display: this.state.displayImageEdit }}>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">Update Images</h4>
              </div>
              <form onSubmit={handleSubmit(this.onSubmitEquipmentImage)} >
                <div className="sf-card-body mt-2">
                  {/* <div className="upload-sfv-file add-equipment-img upeqip-pic update-upload-img">
                    <Dragger
                      {...fileProps}
                    >
                      <p className="ant-upload-drag-icon">
                        <i class="material-icons">cloud_upload</i>
                      </p>
                      <p className="ant-upload-text">Choose file to upload</p>
                      <p className="ant-upload-hint">
                        {Strings.img_drag_drop_text}
                      </p>
                    </Dragger>
                  </div> */}
                  <div className="sm-upload-box">
                    <Dragger  {...fileProps}>
                      <p className="ant-upload-drag-icon">
                        <i class="anticon material-icons">cloud_upload</i>
                      </p>
                      <p className="ant-upload-text">{Strings.img_upload_text}</p>
                    </Dragger>
                  </div>
                  <div className="all-btn multibnt mt-4">
                    <div className="btn-hs-icon d-flex justify-content-between">
                      <button onClick={this.handleImageCancel} className="bnt bnt-normal" type="button" >
                        {Strings.cancel_btn}</button>
                      <button type="submit" className="bnt bnt-active" >
                        {Strings.update_btn}</button>
                    </div>
                  </div>
                </div>
              </form>
            </div>

            <div className="sf-card" style={{ display: this.state.displayView }}>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">Test & Tag History</h4>
              </div>
              <div className="sf-card-body mt-2 t-tag-history">
                <ul className="test-tag-lists">
                  {
                    selectedEquipment && selectedEquipment.test_and_tags && selectedEquipment.test_and_tags.length > 0 ? selectedEquipment.test_and_tags.map((test, index) => {
                      if (test && index < 3) {
                        return <li><span>{`Tested on ${moment(test.test_date ? test.test_date : '').format('DD-MM-YYYY')} by ${test.tester && test.tester.tester ? test.tester.tester : ''} - ${test.test_result && test.test_result ? test.test_result : ''}`}</span></li>
                      }
                    })
                      : "No test history"}
                </ul>
                <div className="tt-pre-history">
                  <Collapse className="show-frquency-box" bordered={false} accordion
                    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                    <Panel header="Previous History" key="1">
                      <ul className="test-tag-lists">
                        {selectedEquipment && selectedEquipment.test_and_tags && selectedEquipment.test_and_tags.length > 0 ? selectedEquipment.test_and_tags.map((test, index) => {
                          if (test && index >= 3) {
                            return <li><span>{`Tested on ${moment(test.test_date ? test.test_date : '').format('DD-MM-YYYY')} by ${test.tester && test.tester.tester ? test.tester.tester : ''} - ${test.test_result && test.test_result ? test.test_result : ''}`}</span></li>
                          }
                        }) : ''}
                      </ul>
                    </Panel>
                  </Collapse>
                </div>
                <AddTestAndTag
                  {...this.props}
                  isFromEdit
                  display={this.state.displayAddTestAndTag}
                />
                <button onClick={this.handleAddTag} disabled={this.state.displayAddTestAndTag === 'block' ? true : false} className="bnt bnt-active">{Strings.create_new_test_tag}</button>
              </div>
            </div>

            {/* link to services */}
            <div className="sf-card mt-4" style={{ display: this.state.displayView }}>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">Link to Services</h4>
              </div>
              <div className="sf-card-body mt-2">
                <div className="sf-roles-group add-sub-mod">
                  {serviceArray.map(service => {
                    return (
                      <Field
                        label={service && service.service_name ? service.service_name : ''}
                        name={service.id}
                        component={CustomCheckbox} />
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var value = state.equipmentManagement.equipmentDetails && state.equipmentManagement.equipmentDetails.equipmentList && state.equipmentManagement.equipmentDetails.equipmentList.length > 0 ? state.equipmentManagement.equipmentDetails.equipmentList[0] : {};
  value.equipment_services && value.equipment_services.forEach(service => {
    value[`service_${service.service_id}`] = true;
  })
  if (!value.manufacture_year) {
    value.manufacture_year = []
  }
  var initialValues = {
    ...value
  };

  return {
    roles: state.roleManagement.roles,
    services: state.industryManagement.services,
    testers: state.equipmentManagement.testersList,
    equipmentDetails: state.equipmentManagement.equipmentDetails,
    accessControlsByModule: state.accessControlManagement.accessControlsByModule,
    permissionByRole: state.permissionByRoleManagement.permissionByRole,
    initialValues: initialValues,
    allTestType: state.equipmentManagement.allTestType,
    equipmentsList: state.equipmentManagement.equipmentsList,
    formValues: state.form.EditEquipment && state.form.EditEquipment.values,
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
    form: 'EditEquipment', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(EditEquipment)


