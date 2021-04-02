import React from 'react';
import { Upload, Icon, message, Modal, Menu, Dropdown, notification, Radio, Tabs } from 'antd';
import { reduxForm, Field, FormSection } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import $ from 'jquery';

import { validate } from '../../../utils/Validations/addCourseValidation';
import { customInput } from '../../common/custom-input';
import * as actions from '../../../actions/inductionTrainingAction';
import * as rolePermissionAction from '../../../actions/roleManagementActions';
import * as equipmentManagementActions from '../../../actions/equipmentManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { CustomCheckbox } from '../../common/customCheckbox';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { getStorage, handleFocus } from '../../../utils/common';
import { DeepTrim } from '../../../utils/common';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomSwitch } from '../../common/customSwitch';
import { customTextarea } from '../../common/customTextarea';
import { CustomSelect } from '../../common/customSelect';
import moment from 'moment';
import { isRequired } from '../../../utils/Validations/scopeDocValidation';
import AddModule from './AddModule';


// upload images
const { Dragger } = Upload;

class AddNewInductionManagement extends React.Component {
  roles = [{ id: 109, name: 'Admin' }, { id: 110, name: 'Staff' }, { id: 116, name: 'Supervisor' }, { id: 120, name: 'Acc Manager' }]
  status = [{ value: 0, text: "Published" }, { value: 1, text: "Draft" }, { value: 2, text: "Inactive" }]
  tags = ["Tag1", "Tag2", "Tag3"]
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'block',
      height: 0,
      cardExpandBtn: true,
      imageFile: [],
      videoFile: [],
      value: 1,
      statusValue: 0,
      addNewModule: false,
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  componentDidMount() {
    $('.upeqip-pic').addClass('sm-drbx');
    this.props.change('status', this.state.statusValue)
    this.props.change('required_by_everyone', this.state.value)

    this.props.action.getCourseModule();
    this.props.roleAction.getRoles(JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null)

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
    formData.status = this.state.statusValue
    // formData.required_by_everyone = this.state.value
    if (formData.required_by_everyone == 1) {
      formData.org_role = this.props.roles && this.props.roles.map(role => role.id)
    }
    console.log('formData', formData)
    if (formData.cover_file) {
      this.props.action.addCourse(formData)
        .then(message => {
          this.props.reset();
          this.setState({
            imageFile: [],
            videoFile: [],
            value: 1
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
    } else {
      notification.warning({
        message: Strings.validate_title,
        description: 'Please upload cover image.',
        className: 'ant-warning'
      });
    }
  }

  handleImagePreUpload = (file) => {
    this.setState(prevState => {
      return {
        imageFile: [...prevState.imageFile, file]
      }
    })
    return false;
  }

  handleImageChange = info => {
    this.setState({ imageFile: [...info.fileList] })
    if (this.state.imageFile.length === 0 && info.file.status !== 'removed') {
      this.props.change('cover_file', info.file)
    } else if (this.state.imageFile.length > 0 && info.file.status !== 'removed') {
      this.props.change('cover_file', info.fileList)
    }
  }

  handleImageRemove = file => {
    file.status = 'removed';
    this.setState(prevState => {
      const fileIndex = prevState.imageFile.indexOf(file);
      const newFileList = prevState.imageFile.slice();
      newFileList.splice(fileIndex, 1);
      if (newFileList.length > 0) {
        this.props.change('cover_file', newFileList)
        return {
          imageFile: newFileList,
        };
      } else {
        delete this.props.formValues.cover_file;
        return {
          imageFile: []
        }
      }
    });
  }

  handlePreUpload = (file) => {
    this.setState(prevState => {
      return {
        videoFile: [...prevState.videoFile, file]
      }
    })
    return false;
  }

  handleChange = info => {
    this.setState({ videoFile: [...info.fileList] })
    if (this.state.videoFile.length === 0 && info.file.status !== 'removed') {
      this.props.change('course_video', info.file)
    } else if (this.state.videoFile.length > 0 && info.file.status !== 'removed') {
      this.props.change('course_video', info.fileList)
    }
  }

  handleRemove = file => {
    file.status = 'removed';
    this.setState(prevState => {
      const fileIndex = prevState.videoFile.indexOf(file);
      const newFileList = prevState.videoFile.slice();
      newFileList.splice(fileIndex, 1);
      if (newFileList.length > 0) {
        this.props.change('course_video', newFileList)
        return {
          videoFile: newFileList,
        };
      } else {
        delete this.props.formValues.course_video;
        return {
          videoFile: []
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

  onChangeStatus = e => {
    this.setState({
      statusValue: e.target.value
    })
  }

  onChange = e => {
    this.setState({
      value: e.target.value,
    });
    this.props.change('required_by_everyone', e.target.value)
  };

  addNewModuleClick = () => {
    this.setState({
      addNewModule: true
    })
  }

  render() {


    const imageProps = {
      accept: ".jpeg,.jpg,.png",
      multiple: false,
      listType: "picture-card",
      fileList: this.state.imageFile,
      beforeUpload: this.handleImagePreUpload,
      onChange: this.handleImageChange,
      onRemove: this.handleImageRemove
    };

    const videoProps = {
      accept: ".mp4",
      multiple: false,
      listType: "picture-card",
      fileList: this.state.videoFile,
      beforeUpload: this.handlePreUpload,
      onChange: this.handleChange,
      onRemove: this.handleRemove
    };


    const { handleSubmit, togleSearch } = this.props;
    var menu = (
      <Menu>
        <Menu.Item onClick={this.handleEditClick}>
          Equipment
        </Menu.Item>
      </Menu>
    );

    const detailsSection = (
      <div className="col-md-12 col-lg-8">
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="sf-card-wrap">
            {/* zoom button  */}
            <div className="card-expands">
              <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                <Icon type={this.state.cardExpandBtn ? "fullscreen" : "fullscreen-exit"} /></button>
            </div>
            <div className="sf-card">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">{Strings.ind_add_new_course}</h2>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled overlay={menu}>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body">
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

                <div className="logo-upload scope-upload form-group sf-form up-course-files">
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
            </div>

            {/* ------------- content --------------- */}
            <div className="sf-card mt-4">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">{"Content"}</h2>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled overlay={menu}>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body mt-2">
                <div className="row">
                  <div className="col-sm-12 col-md-6 ad-cors-n-modul autoheight-box">
                    <fieldset className="form-group sf-form select-wibg">
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
                    <div className="d-flex justify-content-end">
                      <button type="button" className="normal-bnt add-task-bnt add-line-bnt" onClick={this.addNewModuleClick}>
                        <span className="material-icons" >add</span> Add New Module
                  </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ------------- Setting --------------- */}
            <div className="sf-card mt-4">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">{"Setting"}</h2>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled overlay={menu}>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body mt-2">
                <div className="row">
                  <div className="col-sm-6 col-md-4">
                    <div className="form-group sf-form">
                      <label>Required by everyone</label>
                      <div className="sf-roles-group">
                        <Radio.Group name="required_by_everyone" onChange={this.onChange} value={this.state.value}>
                          <Radio value={1}>Yes</Radio>
                          <Radio value={0}>No</Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  </div>
                  {this.state.value === 0
                    ?
                    <div className="col-sm-6 col-md-8">
                      <div className="form-group sf-form">
                        <label>Or Select Organisation Roles</label>
                        <div className="sf-roles-group so-check-role autoheight-box">
                          <fieldset className="form-group sf-form bcc-userid">
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
                          </fieldset>
                        </div>
                      </div>
                    </div>
                    :
                    null
                  }
                </div>
                <div className="row">
                  <div className="col-sm-12 col-md-6 autoheight-box">
                    <fieldset className="form-group sf-form select-wibg">
                      <Field
                        label={"Tags"}
                        name="tags"
                        type="multiple"
                        mode="tags"
                        placeholder="Tags"
                        options={this.tags && this.tags.map(tag => ({ title: tag, value: tag }))}
                        component={CustomSelect} />
                    </fieldset>
                  </div>
                  <div className="col-sm-12 col-md-6">
                    <fieldset className="form-group sf-form lsico">
                      <Field
                        label={"Expiration"}
                        name="expiration"
                        id="expiration"
                        type="number"
                        component={customInput} />
                    </fieldset>
                  </div>
                  <div className="col-sm-12">
                    <div className="form-group sf-form">
                      <label>Status</label>
                      <div className="sf-roles-group">
                        <Radio.Group name="status" onChange={this.onChangeStatus} value={this.state.statusValue}>
                          <Radio value={0}>Published</Radio>
                          <Radio value={1}>Draft</Radio>
                          <Radio value={2}>Inactive</Radio>
                        </Radio.Group>
                      </div>
                    </div>
                  </div>
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
        </form>
      </div>
    )

    // right side add new module


    return (

      <div className={togleSearch ? "col-md-9" : "col-md-9 col-md-srch"} >
        <div className="row">
          {detailsSection}
          {this.state.addNewModule ?
            <div className="col-lg-4 col-md-12">
              <AddModule onCancle={() => this.setState({ addNewModule: false })} initialValues={{ tags: [] }} />
            </div> : null}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    courseModuleList: state.inductionTraining && state.inductionTraining.courseModuleList,
    formValues: state.form.AddNewInductionManagement && state.form.AddNewInductionManagement.values,
    initialValues: { org_role: [], course_modules: [], tags: [] },
    roles: state.roleManagement.roles,

  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    roleAction: bindActionCreators(rolePermissionAction, dispatch),
    equipmentActions: bindActionCreators(equipmentManagementActions, dispatch),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'AddNewInductionManagement', validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AddNewInductionManagement)