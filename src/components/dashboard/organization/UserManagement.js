import React from 'react';
import moment from 'moment';
import { reduxForm } from 'redux-form';
import { validate } from '../../../utils/Validations/roleValidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Upload, Icon, Menu, Dropdown, Progress, Select, Modal, notification } from 'antd';
import * as actions from '../../../actions/organizationUserAction';
import OrganizationUserList from './OrganizationUserList';
import { ORG_USERS_URL, USER_NAME, ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { Strings } from '../../../dataProvider/localize';
import OrganisationUserPermissions from './OrganisationUserPermissions';
import { BASE_API_URL } from '../../../dataProvider/env.config';
import { goBack, handleFocus } from '../../../utils/common';
import { getStorage, setStorage } from '../../../utils/common';
import $ from 'jquery';
import { ERROR_NOTIFICATION_KEY } from '../../../config';

const Dragger = Upload.Dragger;

// select box Radio

const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

class UserManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      fileUploadStatus: '',
      startDate: '',
      endDate: '',
      loaderPercent: 0,
      uploading: '',
      selectedUser: false,
      roleId: '',
      responseData: '',
      displayEdit: 'none',
      selectedUserName: '',
      org_user_name: '',
      cardExpnadBtn: true,
      fileUploaded: false,
      originalFileName: '',
      errorMessage: '',
      inlineUsers: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUserDetails = this.handleUserDetails.bind(this);
    console.log(this.props.location.state)
    this.currentOrganization = (typeof this.props.location.state !== 'object') ? this.props.location.state :
      JSON.parse(getStorage(ADMIN_DETAILS)) ?
        JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    this.handleUserDetails = this.handleUserDetails.bind(this);
    this.loginUserName = JSON.parse(getStorage(ADMIN_DETAILS)) && JSON.parse(getStorage(ADMIN_DETAILS)).name ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
      (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : '';
    this.props.actions.getOrganizationUsers(this.currentOrganization);
  }

  componentDidMount() {
    var inlineUsers = [...this.props.users]
    this.setState({
      inlineUsers: inlineUsers
    })
  }

  hideEditPermission = () => {
    this.setState({
      displayEdit: 'none',
    })
  }

  showInviteUser = () => {
    var inlineUsers = [...this.props.users]
    this.setState({
      inlineUsers: inlineUsers
    })
    this.props.history.push({ pathname: '/dashboard/inviteUsers', state: this.props.users })
  }

  // select radio button
  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };
  menu = (
    <Menu>
      <Menu.Item onClick={() => this.showInviteUser()}>
        Invite Users
      </Menu.Item>
    </Menu>
  );

  onSubmit = (formData) => {
    this.props.reset();
  }

  handleChange = info => {
    if (info && info.file && info.file.name) {
      this.setState({ originalFileName: info.file.name });
    }
    this.setState({ startDate: moment().format('MMM DD YYYY hh:mm:ss'), errorMessage: '' });
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    this.setState({ fileList: fileList });
    this.setState({ loaderPercent: info.file.percent, uploading: info.file.status });
    const status = info.file.status;

    if (status === 'done') {
      this.setState({ endDate: moment().format('MMM DD YYYY hh:mm:ss') });
      if (info.file && info.file.response && info.file.response.data) {
        this.setState({
          fileUploadStatus: 'Success',
          responseData: info.file.response.data,
          fileUploaded: true
        })
      }

      this.props.actions.getOrganizationUsers(this.currentOrganization)

      notification.success({
        message: Strings.success_title,
        description: info.file.response.message ? info.file.response.message : Strings.success_title,
        onClick: () => { },
        className: 'ant-success'
      });

    } else if (status === 'error') {
      this.setState({ endDate: moment().format('MMM DD YYYY hh:mm:ss'), errorMessage: '' });
      if (info.file.response) {
        if (info.file.response.data) {
          if (info.file.response.data.error_type == 1 && info.file.response.data.invald_messages && info.file.response.data.invald_messages.length > 0) {
            this.setState({ errorMessage: info.file.response.data.invald_messages[0].message });
          }

          this.setState({
            fileUploadStatus: 'Failed',
            responseData: info.file.response.data,
            fileUploaded: true
          })

          var invalidMessages = <table className="rap-cell-table add-user-table table" >
            <tr>
              <th>{"Row Number"}</th>
              <th>{"Message"}</th>
              <th></th>
            </tr>
            {info.file.response.data.invald_messages.map((item) => (
              <tr key={item.line_no}>
                <td>{item.line_no}</td>
                <td>{item.message}</td>
              </tr>
            ))}
          </table>
          if (info.file.response.data.error_type == 2) {
            notification.error({
              key: ERROR_NOTIFICATION_KEY,
              message: Strings.error_title,
              description: invalidMessages,
              onClick: () => { },
              className: 'ant-error'
            });
          }
        }
      }
      this.props.actions.getOrganizationUsers(this.currentOrganization)
    }
  };

  removeFromInlineUserList = (user) => {
    var arr = []
    for (var i = 0; i < this.state.inlineUsers.length; i++) {
      if (this.state.inlineUsers[i]['user_name'] != user.user_name) {
        arr.push(this.state.inlineUsers[i])
      } else {
        //console.log(user)
      }
    }

    if (arr.length > 0) {
      this.setState({ inlineUsers: arr })
    }
  }


  handleUserDetails(user_id, role_id, name, org_user_name) {
    this.setState({
      selectedUser: user_id,
      roleId: role_id,
      displayEdit: 'block',
      selectedUserName: name,
      org_user_name: org_user_name
    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  render() {
    var accessControl = JSON.parse(getStorage(ACCESS_CONTROL))["userManagement"].permissions;
    /**Permissions for the module */
    var permissions = {
      sf_org_bulk_user: accessControl.findIndex(acess => acess.control_name === 'sf_org_bulk_user'),
      sf_org_invite_users: accessControl.findIndex(acess => acess.control_name === 'sf_org_invite_users'),
      sf_org_list_users: accessControl.findIndex(acess => acess.control_name === 'sf_org_list_users')
    }


    const props = {
      accept: '.csv',
      action: BASE_API_URL + ORG_USERS_URL,
      onChange: this.handleChange,
      name: 'file',
      multiple: false,
      data: { organisation_id: this.currentOrganization }
    };
    const { users } = this.props;
    return (
      <div>
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd"><Icon type="arrow-left" onClick={() => goBack(this.props)} />User Management</h2>
          <div className="sf-steps-status sf-step-2">
            <div className="sf-steps-row">
              <div className="sf-st-item active">
                <div className="iconbx">
                  <i className="material-icons">people</i></div>
                <span>{Strings.user_wizard_user}</span>
              </div>
              <div className="sf-st-item active">
                <div className="iconbx">
                  <i className="material-icons">vpn_key</i></div>
                <span>{Strings.user_wizard_permissions}</span>
              </div>
            </div>
            <div className="sf-st-item sf-prog">
              <Progress
                type="circle"
                strokeColor={'#03a791'}
                width={40}
                strokeWidth={12}
                percent={"100"}
                format={
                  (percent) => percent + '%'} />
              <span>Progress</span>
            </div>
          </div>
          <div />
        </div>
        {/* inner header  */}

        <div className="main-container">
          <div className="row">
            <div className="col-md-9">
              <div className="sf-card-wrap">
                {/* zoom button  */}
                <div className="card-expands">
                  <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                    <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                </div>
                <div className={permissions.sf_org_bulk_user !== -1 ? "sf-card" : "d-none"} >
                  <div className="sf-card-body">

                    <div className="row">
                      <div className="col-lg-6 col-md-6 col-sm-12 d-flex flex-column justify-content-center">
                        <div className="bulk-import-files">
                          <i className="material-icons wnt-img">group_add</i>
                          <div className="blki-msg">
                            <h5> {Strings.user_bulk_import_que} </h5>
                            <span>Easily upload users by importing records in .csv format. You can <a href='https://dev-sf-store.s3-ap-southeast-2.amazonaws.com/sample-files/sample_user_bulk_upload.csv' >click here</a> to download simple CSV template ready to import.</span>
                          </div>
                        </div>

                        {this.state.fileUploaded ? <div className="bulk-import-details">
                          <strong>{`${Strings.user_import_summary} "${this.state.originalFileName}"`}</strong>
                          <ul className="imp-sum-us">
                            <li><span>{Strings.user_imported_by} :</span> {this.loginUserName ? this.loginUserName : ''}</li>
                            <li><span>{Strings.user_started} :</span> {this.state.startDate.toString()}</li>
                            <li><span>{Strings.user_started} :</span> {this.state.endDate.toString()}</li>
                          </ul>

                          <ul className="imp-status-us">
                            <li>
                              <b>{this.state.responseData.added_rows ? this.state.responseData.added_rows : 0}</b>
                              <span>{Strings.user_add}</span></li>
                            <li>
                              <b>{this.state.responseData.updated_rows ? this.state.responseData.updated_rows : 0}</b>
                              <span>{Strings.user_update}</span></li>

                            {this.state.responseData.invalid_rows_count ? <li className="error"><b>{this.state.responseData.invalid_rows_count}</b>
                              <span>{Strings.user_error}</span> </li> : <li><b>{0}</b>
                                <span>{Strings.user_error}</span> </li>}
                            <li>
                              <b>{this.state.responseData.duplicate_rows_count ? this.state.responseData.duplicate_rows_count : 0}</b>
                              <span>{Strings.user_dublicate}</span></li>
                          </ul>
                        </div> : null}
                      </div>

                      <div className="col-lg-6 col-md-6 col-sm-12">
                        <div className="upload-sfv-file">
                          <Dragger {...props} fileList={this.state.fileList}>
                            <p className="ant-upload-drag-icon">
                              <i class="material-icons">cloud_upload</i>
                            </p>
                            <p className="ant-upload-text">Choose file to upload</p>
                            <p className="ant-upload-hint">
                              {Strings.img_upload_text}
                            </p>
                            <div className="file-up-msg">
                              {this.state.loaderPercent !== 0 ? <Progress percent={this.state.loaderPercent} /> : null}
                              {this.state.uploading === 'uploading' ? <span className="uplod-txt">Uploading...</span> : null}
                              {this.state.fileUploadStatus === 'Success' ? <span className="uplf-success"><Icon type="check" /> {this.state.fileUploadStatus}</span> : this.state.fileUploadStatus === '' ? null : <span className="uplf-failed"><Icon type="warning" theme="filled" />{this.state.fileUploadStatus}</span>}
                            </div>
                          </Dragger>
                        </div>
                        {this.state.errorMessage ? <div className="big-error">{this.state.errorMessage}</div>
                          : null}
                      </div>
                    </div>

                  </div>
                </div>

                {/* user list table */}

                <div className={permissions.sf_org_list_users !== -1 ? "sf-card mt-4" : "d-none"}>
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Users</h2>
                    <div className="info-btn">
                      {permissions.sf_org_invite_users !== -1 ?
                        <Dropdown className="more-info" overlay={this.menu}><i className="material-icons">more_vert</i>
                        </Dropdown> : <Dropdown className="more-info disable-drop-menu" disabled overlay={''}>
                          <i className="material-icons">more_vert</i>
                        </Dropdown>}
                    </div>
                  </div>
                  <OrganizationUserList
                    orgUsers={users}
                    usersLength={users.length}
                    inlineUsers={this.state.inlineUsers}
                    handleUserDetails={this.handleUserDetails}
                    change={this.props.change}
                    hideEditPermission={this.hideEditPermission}
                    removeFromInlineUserList={this.removeFromInlineUserList}
                  />
                </div>
              </div>
            </div>

            {
              this.state.displayEdit === "block"
                ? <OrganisationUserPermissions
                  selectedUserName={this.state.selectedUserName}
                  roleid={this.state.roleId}
                  userid={this.state.selectedUser}
                  org_id={this.currentOrganization}
                  displayFlag={this.state.displayEdit}
                  hideEditPermission={this.hideEditPermission}
                  org_user_name={this.state.org_user_name}
                />
                : <div className="col-md-3">
                  <div className="sf-card">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                      <h4 className="sf-sm-hd sf-pg-heading">{Strings.perm_title}</h4>
                    </div>

                    <div className="sf-card-body">
                      <div className="user-p-notxt d-flex justify-content-between">
                        <img alt="" src="/images/owl-img.png" />
                        <span>{Strings.perm_info_text}</span>
                      </div>
                    </div>
                  </div>
                </div>
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    users: state.organizationUsers.users
  }
}

const mapDispatchToprops = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({ form: 'userManagement', validate ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(UserManagement);