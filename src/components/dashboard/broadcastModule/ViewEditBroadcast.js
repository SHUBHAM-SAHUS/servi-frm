import React, { Component } from 'react';
import {
  Icon,
  Menu,
  Dropdown,
  notification,
  Upload
} from 'antd';
import $ from 'jquery';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { handleFocus } from '../../../utils/common';
import { reduxForm, Field, isDirty } from 'redux-form';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect'
import emailEditor from '../../common/EmailEditor';
import { Strings } from '../../../dataProvider/localize';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import ReactHtmlParser from 'react-html-parser';
import draftToHtml from 'draftjs-to-html';
import * as actions from '../../../actions/roleManagementActions';
import * as broadActions from '../../../actions/broadcastActions';
import moment from 'moment';
import { braodcastValidate } from '../../../utils/Validations/broadcastValidation';
import { CustomDateTimePicker } from '../../common/customDateTimePicker';
import { customTextarea } from '../../common/customTextarea';

const Dragger = Upload.Dragger;

export class ViewEditBroadcast extends Component {
  max_chars = 119;

  state = {
    displayEdit: false,
    cardExpnadBtn: true,
    editorState: '',
    dropdowns: {
      role: []
    },
    file_name: [],
    chars_left: this.max_chars,
    fileList: []
  }

  onSubmit = (formData) => {
    formData.title = formData.title.split('---')[0].trim();
    formData.role = JSON.stringify(formData.roles)
    ///formData.body = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    if (formData.send_date && formData.send_date._d)
      formData.send_date = moment(formData.send_date._d).utc().format('YYYY-MM-DD HH:mm:ss');
    else
      formData.send_date = moment(formData.send_date).utc().format('YYYY-MM-DD HH:mm:ss')

    var finalFormData = new FormData();
    if (this.state.fileList.length > 0) {
      Object.keys(formData).map(key => {
        if (key === 'broadcast_file_name') {
          Object.values(formData[key]).forEach(file => {
            if (file && file.name) {
              var filteredFile;
              if (this.props.broadcastDetails && this.props.broadcastDetails.attachment && this.props.broadcastDetails.attachment.length > 0 && this.props.broadcastDetails.broadcast_file_path) {
                var equipmentFiles = this.props.broadcastDetails.attachment
                filteredFile = equipmentFiles.filter(item => item === file.name);
                if (filteredFile && filteredFile.length) {
                } else {
                  finalFormData.append('files', file.originFileObj);
                }
              } else if (this.props.broadcastDetails && this.props.broadcastDetails.attachment.length === 0) {
                finalFormData.append('files', file.originFileObj);
              }
            }
          })
        }
      });
    }
    finalFormData.append('id', formData.id)
    finalFormData.append('title', formData.title)
    finalFormData.append('body', formData.body)
    finalFormData.append('file_name', JSON.stringify(this.state.file_name))
    finalFormData.append('send_date', formData.send_date)
    finalFormData.append('role', formData.role)

    this.props.broadAction.updateBroadcast(finalFormData)
      .then((message) => {
        this.setState({ editorState: '' })
        this.props.reset()
        notification.success({
          message: Strings.success_title,
          description: message,
          onClick: () => { },
          className: 'ant-success'
        });
        this.props.broadAction.getBroadcastDetails(formData.id)
        this.props.broadAction.initBroadcast()
        this.setState({ displayEdit: false })
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.broadcastDetails.id !== prevProps.broadcastDetails.id) {
      if (this.props.broadcastDetails && this.props.broadcastDetails.attachment && this.props.broadcastDetails.attachment.length > 0 && this.props.broadcastDetails.broadcast_file_path) {
        var boradcastFiles = this.props.broadcastDetails.attachment
        this.setState({ file_name: boradcastFiles });
        var existingFileArray = [];
        for (let file of this.props.broadcastDetails.attachment) {
          existingFileArray.push({
            uid: file,
            name: file,
            status: 'done',
            url: this.props.broadcastDetails.broadcast_file_path + file
          });
        }
        this.setState({ fileList: existingFileArray });
      } else if (this.props.broadcastDetails && this.props.broadcastDetails.attachment && this.props.broadcastDetails.attachment.length === 0) {
        this.setState({ fileList: [] });
      }

      if (this.props.broadcastDetails && this.props.broadcastDetails.body) {
        let input = this.props.broadcastDetails.body;
        this.setState({
          chars_left: this.max_chars - input.length
        });
      }
    }

  }

  handleEditClick = () => {
    if (this.props.broadcastDetails && this.props.broadcastDetails.attachment && this.props.broadcastDetails.attachment.length > 0 && this.props.broadcastDetails.broadcast_file_path) {
      var boradcastFiles = this.props.broadcastDetails.attachment
      this.setState({ file_name: boradcastFiles });

      var existingFileArray = [];
      for (let file of this.props.broadcastDetails.attachment) {
        existingFileArray.push({
          uid: file,
          name: file,
          status: 'done',
          url: this.props.broadcastDetails.broadcast_file_path + file
        });
      }
      this.setState({ fileList: existingFileArray });
    }
    this.setState({ displayEdit: true });
  }

  handleCancel = () => {
    this.setState({ displayEdit: false });
  }

  static getDerivedStateFromProps(props, state) {
    if (state && props.emailTemplateDetails && props.emailTemplateDetails[0] && props.emailTemplateDetails[0].slug.toString() !== props.location.state.toString()) {
      state.displayEdit = false
      state.editorState = ''
    }
  }

  editorState = () => {
    var body = this.props.broadcastDetails ? this.props.broadcastDetails.body : '';

    const html = body
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        editorState: editorState
      });
      return editorState
    }
  }

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  handlePreUpload = (file, fileList) => {
    return false;
  }

  handleChange = info => {
    this.setState({ fileList: info.fileList })
    this.props.change('broadcast_file_name', info.fileList)
  }

  handleRemove = file => {
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
        this.props.change('broadcast_file_name', newFileList)
        return {
          fileList: newFileList,
        };
      } else {
        delete this.props.formValues.broadcast_file_name;
        return {
          fileList: []
        }
      }
    });
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
        });
      });
  }

  onChangeBody = e => {
    let input = e.target.value;
    this.setState({
      chars_left: this.max_chars - input.length
    });
  }

  render() {
    const { handleSubmit, broadcastDetails, roles } = this.props;
    let selectedBroadcast = broadcastDetails
    let selectedRoles
    if (selectedBroadcast && typeof selectedBroadcast.role !== 'string') {
      selectedRoles = selectedBroadcast.role && selectedBroadcast.role.map((val, index) =>
        index === selectedBroadcast.role.length - 1 ? roles.find(role => role.id === val).name + '.' : roles.find(role => role.id === val).name + ', '
      )
    }
    var menu = !this.state.displayEdit
      ? <Menu>
        <Menu.Item onClick={this.handleEditClick}>
          Edit
          </Menu.Item>
      </Menu>
      : <></>

    const attachmentProps = {
      accept: ".jpeg,.jpg,.png,.pdf,.docx",
      multiple: true,
      listType: "picture-card",
      fileList: this.state.fileList,
      beforeUpload: this.handlePreUpload,
      onChange: this.handleChange,
      onRemove: this.handleRemove,
    };

    return (
      <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <div className="sf-card-wrap">
          {/* zoom button  */}
          <div className="card-expands">
            <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
              <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
          </div>
          <form onSubmit={handleSubmit(this.onSubmit)} >
            <div className="sf-card">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">Broadcast Details</h2>
                <div className={broadcastDetails.sent_notification === 1 ? "info-btn disable-dot-menu" : "info-btn"}>
                  {/* Drop down for card */}
                  <Dropdown className="more-info" overlay={menu} disabled={broadcastDetails.sent_notification === 1}>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                  {/*Drop down*/}
                </div>
              </div>

              {!this.state.displayEdit ?
                <div className="sf-card-body mt-2">
                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Title</label>
                        <span>{selectedBroadcast ? selectedBroadcast.title : ''}</span>
                      </div>
                    </div>
                  </div>

                  {selectedRoles && selectedRoles.length > 0 ?
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Roles</label>
                        <span>{selectedRoles}</span>
                      </div>
                    </div>
                    :
                    ''
                  }

                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>Body</label>
                      <span>{selectedBroadcast ? <div>{ReactHtmlParser(selectedBroadcast.body)}</div> : ''}</span>
                    </div>
                  </div>

                  <div className="data-v-col">
                    <label>Attachments</label>
                    <div className="view-text-value row mt-2">
                      {selectedBroadcast && selectedBroadcast.attachment && selectedBroadcast.attachment.length > 0 ?
                        selectedBroadcast.attachment.map(file => {
                          const fileUrl = selectedBroadcast.broadcast_file_path ? selectedBroadcast.broadcast_file_path + file : ''
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
                                  <img alt="AttachmentsFile" src={fileUrl} />
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
                        }) : null}
                    </div>
                  </div>

                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>Send Date/Time</label>
                      <span>{selectedBroadcast && selectedBroadcast.sent_notification === 1
                        ? moment.utc(selectedBroadcast.send_date).format('DD-MM-YYYY HH:mm:ss') + ' - Sent.' :
                        moment.utc(selectedBroadcast.send_date).format('DD-MM-YYYY HH:mm:ss')}</span>
                    </div>
                  </div>
                </div>
                :
                <div className="sf-card-body mt-2">
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.broadcast_title_txt}
                      placeholder={Strings.title_broadcast}
                      name="title"
                      id="title"
                      type="text"
                      component={customInput} />
                  </fieldset>
                  <fieldset className="form-group sf-form bcc-userid">
                    <Field
                      label={Strings.broadcast_roles}
                      name="roles"
                      placeholder={Strings.roles_broadcast}
                      id="roles"
                      mode="multiple"
                      filterOption={(input, option) => (
                        option.props.children.toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      )}
                      options={roles && roles.map(role => ({
                        title: role.name,
                        value: role.id
                      }))}
                      component={CustomSelect} />
                  </fieldset>
                  <div className="form-group sf-form rich-textbox">
                    <label>{Strings.body_txt}</label>
                    <div className="sf-rich-txtbox">
                      <fieldset>
                        <Field
                          name="body"
                          type="text"
                          id="body"
                          onChange={this.onChangeBody}
                          maxLength={this.max_chars}
                          // editorState={this.state.editorState === '' ? this.editorState() : this.state.editorState}
                          // onEditorStateChange={this.onEditorStateChange}
                          component={customTextarea} />
                      </fieldset>
                      <p>{this.state.chars_left}/{this.max_chars}</p>
                    </div>
                  </div>
                  <div className="sf-form">
                    <label>{Strings.broadcast_attachment_txt}</label>
                    <div className="upload-sfv-file add-equipment-img upeqip-pic sm-drbx">
                      <Dragger
                        {...attachmentProps}>
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
                  <div className="col-md-4 col-sm-6 col-sm-12">
                    <fieldset className="form-group sf-form">
                      <Field
                        label={Strings.broadcast_date_time}
                        name="send_date"
                        id="send_date"
                        showTime
                        component={CustomDateTimePicker} />
                    </fieldset>
                  </div>

                </div>
              }
            </div>
            {this.state.displayEdit ? <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt ">
              <div className="btn-hs-icon">
                <button onClick={this.handleCancel} className="bnt bnt-normal" type="button">
                  {Strings.cancel_btn}</button>
              </div>
              <div className="btn-hs-icon">
                <button type="submit" className="bnt bnt-active">
                  {Strings.update_btn}</button>
              </div>
            </div> : null}
          </form>
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state, ownProps) => {
  let value = state.broadCast.broadcastDetails

  if (value && value.role)
    value = { ...value, roles: value.role ? value.role : [] }
  return {
    roles: state.roleManagement && state.roleManagement.roles,
    broadcastDetails: state.broadCast && state.broadCast.broadcastDetails,
    isDirty: isDirty('ViewEditBroadcast')(state),

    initialValues: (value ? value : {}),
    formValues: state.form.ViewEditBroadcast && state.form.ViewEditBroadcast.values,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    broadAction: bindActionCreators(broadActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: "ViewEditBroadcast", validate: braodcastValidate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ViewEditBroadcast)