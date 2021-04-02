import React from 'react';
import { Icon, Menu, Dropdown, Modal, Collapse, Upload, notification, Radio, } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { getStorage, setStorage, currencyFormat, handleFocus } from '../../../utils/common';
import $ from 'jquery';

import { validate } from '../../../utils/Validations/roleValidation';
import { customInput } from '../../common/custom-input';
import { CustomSwitch } from '../../common/customSwitch';
import * as actions from '../../../actions/inductionTrainingAction';
import * as rolePermissionAction from '../../../actions/roleManagementActions';
import * as equipmentManagementActions from '../../../actions/equipmentManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { CustomCheckbox } from '../../../components/common/customCheckbox';
import { ADMIN_DETAILS, ACCESS_CONTROL, VALIDATE_STATUS } from '../../../dataProvider/constant';
import moment from 'moment';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { DeepTrim } from '../../../utils/common';
import { CustomDatepicker } from '../../common/customDatepicker';
import { customTextarea } from '../../common/customTextarea';
import { CustomSelect } from '../../common/customSelect';
import AddModule from './AddModule';


const { Panel } = Collapse;
const { Dragger } = Upload;

class EditInductionManagement extends React.Component {
  tags = ["Tag1", "Tag2", "Tag3"]
  status = [{ value: 0, title: "Published" }, { value: 1, title: "Draft" }, { value: 2, title: "Inactive" }]
  roles = [{ id: 109, name: 'Admin' }, { id: 110, name: 'Staff' }, { id: 116, name: 'Supervisor' }, { id: 120, name: 'Acc Manager' }]

  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'none',
      displayImageEdit: 'none',
      cardExpnadBtn: true,
      displayAddTestAndTag: 'none',
      fileList: [],
      displayView: 'block',
      file_name: [],
      editModule: false,
      selectedModule: {},
      displaySetting: 'none'
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  handleEditClick = () => {
    this.setState({ displayEdit: 'block', displayView: 'none' });
    this.setState({ displayImageEdit: 'none', displaySetting: 'none', editModule: false, });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleImageEdit = () => {

    this.setState({ editModule: false, displayImageEdit: 'block', displayView: 'none', displaySetting: 'none' });
    this.setState({ displayEdit: 'none' });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleCancel = () => {
    this.setState({ displayEdit: 'none', displayView: 'block', editModule: false, });
  }

  handleImageCancel = () => {
    this.setState({ editModule: false, displayImageEdit: 'none', displayView: 'block', displaySetting: 'none' });
  }

  onSubmitEquipmentDetails = async (formData) => {
    formData = await DeepTrim(formData);

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
    formData.equipment_purchase_date = formData.equipment_purchase_date && formData.equipment_purchase_date._d
    formData.equipment_destroy_date = formData.equipment_destroy_date && formData.equipment_destroy_date._d
    formData.services = services;

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


  componentDidMount() {
    this.props.roleAction.getRoles(JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null)
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
      this.setState({ editModule: false, displayImageEdit: 'none', displayView: 'block', displaySetting: "none" });
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

  handleEditModule = (module_id) => {
    this.setState({ displayEdit: 'none', displayView: 'block', editModule: false }, () => {
      var module = this.props.courseModuleList.find(mod => mod.id == module_id)
      this.setState({ editModule: true, selectedModule: module })
    });
  }
  handleSettingEdit = () => {
    this.setState({ editModule: false, displayImageEdit: 'none', displayView: 'none', displaySetting: 'block', displayEdit: 'none' });

  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);
    // formData.status = this.state.statusValue
    // formData.required_by_everyone = this.state.value
    if (formData.required_by_everyone == 1) {
      formData.org_role = this.props.roles && this.props.roles.map(role => role.id)
    }

    this.props.action.updateCourses(formData)
      .then(message => {
        // this.props.reset();
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: message,
            onClick: () => { },
            className: 'ant-success'
          });
        }
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

  render() {

    const { handleSubmit, togleSearch, equipmentDetails, services, equipmentsList, initialValues, formValues, selectedCourse } = this.props;
    var selectedEquipment = equipmentDetails && equipmentDetails.equipmentList && equipmentDetails.equipmentList.length > 0 ? equipmentDetails.equipmentList[0] : '';
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
      fileList: this.props.formValues && this.props.formValues.incidentFiles && this.props.formValues.incidentFiles.length && this.props.formValues.incidentFiles.length > 0 ? this.props.formValues.incidentFiles : this.state.fileList,
      beforeUpload: this.handlePreUpload,
      onChange: this.handleFileChange,
      onRemove: this.handleFileRemove
    };


    var menu = (<Menu>
      <Menu.Item onClick={this.handleEditClick}>
        {"Edit"}
      </Menu.Item>
    </Menu>);

    var permissionMenu = (
      <Menu>
        <Menu.Item onClick={this.handleImageEdit}>
          {"Edit"}
        </Menu.Item>
      </Menu>
    );

    var settingsMenu = (
      <Menu>
        <Menu.Item onClick={this.handleSettingEdit}>
          {"Edit"}
        </Menu.Item>
      </Menu>
    );

    const imageProps = {
      accept: ".jpeg,.jpg,.png",
      multiple: false,
      listType: "picture-card",
      // fileList: [formValues && formValues.cover_file],
      beforeUpload: (file) => { this.props.change("cover_file", file); return false },
      onRemove: () => this.props.change("cover_file", undefined)
    };

    const videoProps = {
      accept: ".mp4",
      multiple: false,
      listType: "picture-card",
      // fileList: [formValues && formValues.course_video],
      beforeUpload: (file) => { this.props.change("course_video", file); return false },
      onRemove: () => this.props.change("course_video", undefined)
    };



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
                  <h2 className="sf-pg-heading">{Strings.ind_add_new_course}</h2>
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
                        <label>{Strings.ind_name}</label>
                        <span>{selectedCourse.name}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{"Short description"}</label>
                        <span>{selectedCourse.detailed_description}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value pr-3">
                        <label>{"Course Description"}</label>
                        <span>{selectedCourse.short_description}</span>
                      </div>
                    </div>
                  </div>

                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Cover image</label>
                        {selectedCourse.course_cover_file ?
                          <img className="cover-img-vid" src={selectedCourse.course_cover_file} /> : null}
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value vido-covr">
                        <label>Cover video</label>
                        {selectedCourse.course_cover_video ? <a href={selectedCourse.course_cover_video} target="_blank" >
                          <i className="material-icons">videocam</i>
                        </a> : null}
                      </div>
                    </div>

                  </div>
                </div>
              </div>

              {/* ------------- content --------------- */}
              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{"Content"}</h2>
                  <div className="info-btn">
                    <Dropdown className="more-info" overlay={permissionMenu}>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>

                <div className="sf-card-body">
                  <div className="sf-c-table org-user-table">
                    <div className="tr">
                      <span className="th">Module Name</span>
                      <span className="th"></span>
                    </div>
                    {selectedCourse && selectedCourse.course_module_mappings
                      && selectedCourse.course_module_mappings.map(mod =>
                        <div className="tr">
                          <span className="td">{mod.course_module && mod.course_module.name}</span>
                          <span className="td">
                            <button className="delete-bnt" type="button" onClick={() => this.handleEditModule(mod.module_id)}>
                              <i className="material-icons">create</i></button>
                          </span>
                        </div>)}
                  </div>
                </div>
              </div>

              {/* ------------- Setting --------------- */}
              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{"Setting"}</h2>
                  <div className="info-btn">
                    <Dropdown className="more-info" overlay={settingsMenu}>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>

                <div className="sf-card-body">
                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Required by everyone</label>
                        <span>{selectedCourse.required_by_everyone ? "Yes" : "No"}</span>
                      </div>
                    </div>

                    {/* show hide div */}
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Or Select Organisation Roles</label>
                        <span>{selectedCourse.course_roles && selectedCourse.course_roles.length > 0 &&
                          selectedCourse.course_roles.map(role => role.name).toString()}</span>
                      </div>
                    </div>
                  </div>

                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Tags</label>
                        <span>{selectedCourse.tags && selectedCourse.tags.toString()}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Expiration</label>
                        <span>{selectedCourse.expiration}</span>
                      </div>
                    </div>
                  </div>
                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>Status</label>
                      <span>{selectedCourse.status ? selectedCourse.status == 1 ? "Draft" : "Inactive" : "Published"}</span>
                    </div>
                  </div>


                </div>
              </div>


            </div>
          </div>

          {/* Edit */}
          <div className="col-lg-4 col-md-12">
            {/* Update Equipment Details */}
            <div className="sf-card mb-4" style={{
              display:
                //  "none"
                this.state.displayEdit
            }}>
              <form onSubmit={handleSubmit(this.onSubmit)} >
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h4 className="sf-sm-hd sf-pg-heading">Update Course Details</h4>
                </div>
                <div className="sf-card-body mt-2">
                  <fieldset className="form-group sf-form select-wibg">
                    <Field
                      label={Strings.ind_name}
                      name="name"
                      placeholder={Strings.ind_name}
                      id="name"
                      type="text"
                      component={customInput} />
                  </fieldset>
                  <fieldset className="form-group sf-form">
                    <Field
                      label={"Short description"}
                      placeholder={"Short description"}
                      name="short_description"
                      type="text"
                      id="short_description"
                      component={customTextarea} />
                  </fieldset>
                  <fieldset className="form-group sf-form">
                    <Field
                      label={"Course Description"}
                      placeholder={"Course Description"}
                      name="detailed_description"
                      type="text"
                      id="detailed_description"
                      component={customTextarea} />
                  </fieldset>

                  <div className="logo-upload scope-upload form-group sf-form up-course-files full-width-pic">
                    <label>Cover image</label>
                    <Dragger
                      {...imageProps}>
                      <p className="ant-upload-drag-icon">
                        <i class="material-icons">cloud_upload</i>
                      </p>
                      <p className="ant-upload-text">Choose file to upload</p>
                      <p className="ant-upload-hint">
                        {Strings.img_drag_drop_text}
                      </p>
                    </Dragger>
                  </div>

                  <div className="logo-upload scope-upload form-group sf-form up-course-files">
                    <label>Cover video</label>
                    <Dragger
                      {...videoProps}>
                      <p className="ant-upload-drag-icon">
                        <i className="material-icons">cloud_upload</i>
                      </p>
                      <p className="ant-upload-text">Choose file to upload</p>
                      <p className="ant-upload-hint">
                        {Strings.img_drag_drop_text}
                      </p>
                    </Dragger>
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

            {this.state.editModule ? <div className="sf-card mb-4" >
              <AddModule initialValues={this.state.selectedModule} onCancle={this.handleCancel} />
            </div> : null}

            {/* Update upload Images */}
            <div className="sf-card mb-4" style={{
              display:
                // "none"
                this.state.displayImageEdit
            }}>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">Update content</h4>
              </div>
              <form onSubmit={handleSubmit(this.onSubmit)} >
                <div className="sf-card-body mt-2">
                  <fieldset className="form-group sf-form select-wibg autoheight-box">
                    <Field
                      label={"Module"}
                      name="course_modules"
                      id="course_modules"
                      mode="multiple"
                      placeholder="Module Name"
                      filterOption={(input, option) => (
                        option.props.children.toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      )}
                      options={this.props.courseModuleList && this.props.courseModuleList.map(module => ({
                        title: module.name,
                        value: module.id
                      }))}
                      component={CustomSelect} />
                  </fieldset>
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

            <div className="sf-card mb-4" style={{
              display:
                // "none"
                this.state.displaySetting
            }}>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">Update Settings</h4>
              </div>
              <form onSubmit={handleSubmit(this.onSubmit)} >
                <div className="sf-card-body mt-2">
                  <fieldset className="form-group sf-form bcc-userid">
                    <Field
                      label={"Required by everyone"}
                      name="required_by_everyone"
                      options={[{
                        title: "Yes",
                        value: 1
                      }, {
                        title: "No",
                        value: 0
                      }]}
                      component={CustomSelect} />
                  </fieldset>
                  {formValues && formValues.required_by_everyone == 0 ? <fieldset className="form-group sf-form bcc-userid autoheight-box">
                    <Field
                      label={Strings.broadcast_roles}
                      name="org_role"
                      placeholder={Strings.roles_broadcast}
                      id="org_role"
                      mode="multiple"
                      // validate={this.state.value === 0 ? isRequired : []}
                      filterOption={(input, option) => (
                        option.props.children.toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      )}
                      options={this.props.roles && this.props.roles.map(role => ({
                        title: role.name,
                        value: role.id
                      }))}
                      component={CustomSelect} />
                  </fieldset> : null}

                  <fieldset className="form-group sf-form select-wibg autoheight-box">
                    <Field
                      label={"Tags"}
                      name="tags"
                      type="multiple"
                      mode="tags"
                      placeholder="Tags"
                      options={this.tags && this.tags.map(tag => ({ title: tag, value: tag }))}
                      component={CustomSelect} />
                  </fieldset>
                  <fieldset className="form-group sf-form lsico">
                    <Field
                      label={"Expiration"}
                      name="expiration"
                      id="expiration"
                      type="number"
                      component={customInput} />
                  </fieldset>
                  <fieldset className="form-group sf-form bcc-userid">
                    <Field
                      label={"Status"}
                      name="status"
                      options={this.status}
                      component={CustomSelect} />
                  </fieldset>
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
  var selectedCourse = state.inductionTraining && state.inductionTraining.coursesList && ownProps.location
    && ownProps.location.state ? state.inductionTraining.coursesList.find(course => course.id == ownProps.location.state) :
    {}

  return {
    roles: state.roleManagement.roles,
    initialValues: selectedCourse,

    formValues: state.form.EditInductionManagement && state.form.EditInductionManagement.values,

    /* Selected course  */
    selectedCourse: selectedCourse,
    courseModuleList: state.inductionTraining && state.inductionTraining.courseModuleList,
    courseModuleList: state.inductionTraining && state.inductionTraining.courseModuleList,


  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    roleAction: bindActionCreators(rolePermissionAction, dispatch),
    equipmentActions: bindActionCreators(equipmentManagementActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'EditInductionManagement', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(EditInductionManagement)


