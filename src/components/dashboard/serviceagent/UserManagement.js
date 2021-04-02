import React from 'react';
import moment from 'moment';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../../../utils/Validations/roleValidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Upload, Icon, Menu, Dropdown, Progress, Select, Radio } from 'antd';
import * as actions from '../../../actions/organizationUserAction';
import OrganizationUserList from './ServiceAgentUserList';
import OrganisationUserPermissions from './ServiceAgentUserPermissions';
import { ORG_USERS_URL, USER_NAME } from '../../../dataProvider/constant';
import { Strings } from '../../../dataProvider/localize';
import {
  BASE_API_URL
} from '../../../dataProvider/env.config';
import { getStorage, setStorage, handleFocus } from '../../../utils/common';
import { goBack } from '../../../utils/common';



const Dragger = Upload.Dragger;

// select box Radio

const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
  children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

function handleChange(value) {
}

class UserManagement extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      fileList: [],
      added: 0,
      updated: 0,
      error: 0,
      duplicate: 0,
      errorMessage: '',
      fileUploadStatus: '',
      startDate: '',
      endDate: '',
      loginUser: getStorage(USER_NAME),
      loaderPercent: 0,
      uploading: '',
      selectedUser: false,
      inlineUsers: [],
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleUserDetails = this.handleUserDetails.bind(this);
  }

  componentDidMount() {
    var inlineUsers = [...this.props.users]
    this.setState({
      inlineUsers: inlineUsers
    })
  }

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

  hideEditPermission = () => {

  }

  // select radio button
  handleSizeChange = e => {
    this.setState({ size: e.target.value });
  };
  menu = (
    <Menu>
      <Menu.Item onClick={() => { this.props.history.push({ pathname: '/dashboard/inviteUsers', state: this.props.users }) }}>
        Invite Users
      </Menu.Item>
    </Menu>
  );

  onSubmit = (formData) => {
    this.props.reset();
  }

  handleChange = info => {
    this.setState({ startDate: moment().format('MMM DD YYYY hh:mm:ss') });
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    this.setState({ fileList });
    this.setState({ loaderPercent: info.file.percent, uploading: info.file.status });
    this.setState({ errorMessage: '' })
    const status = info.file.status;

    if (status === 'done') {
      this.setState({ endDate: moment().format('MMM DD YYYY hh:mm:ss') });
      this.setState({
        fileUploadStatus: 'Success',
        error: info.file.response.data.invalidRowsCount,
        added: info.file.response.data.addedRows,
        updated: info.file.response.data.updatedRows
      })
      this.props.getOrganizationUsers(this.props.location.state)
    } else if (status === 'error') {
      this.setState({ endDate: moment().format('MMM DD YYYY hh:mm:ss') });
      if (info.file.response) {
        this.setState({ errorMessage: info.file.response.message })
        if (info.file.response.data) {
          this.setState({
            fileUploadStatus: 'Failed',
            error: info.file.response.data.invalidRowsCount,
            added: info.file.response.data.addedRows,
            updated: info.file.response.data.updatedRows
          })
        }
      } else {
        this.setState({ errorMessage: 'ERR_EMPTY_RESPONSE' })
        this.setState({ fileUploadStatus: 'Failed' })
      }
      this.props.getOrganizationUsers(this.props.location.state)
    }
  };


  handleUserDetails(userId) {
    this.setState({
      selectedUser: userId
    });
    userId = 13;
    this.props.actions.getOrganizationUserPermissions(userId).then((res) => {
    }).catch((ex) => {
    });
  }

  render() {
    const props = {
      action: BASE_API_URL + ORG_USERS_URL,
      onChange: this.handleChange,
      name: 'file',
      multiple: false,
      data: { organisation_id: this.props.location.state }
    };
    const { users, handleSubmit } = this.props;
    return (
      <div>
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd"><Icon type="arrow-left" onClick={() => goBack(this.props)} />User Management</h2>

          <div className="sf-steps-status sf-step-2">
            <div className="sf-steps-row">
              <div className="sf-st-item">
                <div className="iconbx">
                  <i className="material-icons">people</i></div>
                <span>{Strings.user_wizard_user}</span>
              </div>
              <div className="sf-st-item">
                <div className="iconbx">
                  <i className="material-icons">vpn_key</i></div>
                <span>{Strings.user_wizard_permissions}</span>
              </div>
            </div>
            <div className="sf-st-item sf-prog">
              <i>0%</i>
              <span>{Strings.org_wizard_progress}</span>
            </div>
          </div>

          <div />
        </div>
        {/* inner header  */}

        <div className="main-container">
          <div className="row">
            <div className="col-md-9">
              <div className="sf-card">
                <div className="sf-card-body">

                  <div className="row">
                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="bulk-import-files">
                        <Icon type="usergroup-add" className="wnt-img" />
                        <div className="blki-msg">
                          <h5> {Strings.user_bulk_import_que} </h5>
                          <span>{Strings.user_bulk_import_info}</span>
                        </div>
                      </div>

                      <div className="bulk-import-details">
                        <strong>{Strings.user_import_summary}</strong>
                        <ul className="imp-sum-us">
                          <li><span>{Strings.user_imported_by} :</span> {this.state.loginUser}</li>
                          <li><span>{Strings.user_started} :</span> {this.state.startDate.toString()}</li>
                          <li><span>{Strings.user_started} :</span> {this.state.endDate.toString()}</li>
                        </ul>

                        <ul className="imp-status-us">
                          <li>
                            <b>{this.state.added}</b>
                            <span>{Strings.user_add}</span></li>
                          <li>
                            <b>{this.state.updated}</b>
                            <span>{Strings.user_update}</span></li>

                          {this.state.error > 0 ? <li className="error"><b>{this.state.error}</b>
                            <span>{Strings.user_error}</span> </li> : <li><b>{this.state.error}</b>
                              <span>{Strings.user_error}</span> </li>}
                          <li>
                            <b>{this.state.duplicate}</b>
                            <span>{Strings.user_dublicate}</span></li>
                        </ul>
                      </div>
                    </div>

                    <div className="col-lg-6 col-md-6 col-sm-12">
                      <div className="upload-sfv-file">
                        <Dragger {...props} fileList={this.state.fileList}>
                          <p className="ant-upload-drag-icon">
                            <Icon type="upload" />
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
                        {this.state.errorMessage && this.state.errorMessage.length > 1 ?
                          (<div className="big-error">  {this.state.errorMessage}</div>) : null}
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* user list table */}

              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">Users</h2>
                  <div className="info-btn">
                    <Dropdown className="more-info" overlay={this.menu}>
                      <a className="ant-dropdown-link">
                        <i className="material-icons">more_vert</i>
                      </a>
                    </Dropdown>
                  </div>
                </div>
                <OrganizationUserList
                  orgUsers={users}
                  handleUserDetails={this.handleUserDetails}
                  inlineUsers={this.state.inlineUsers}
                  hideEditPermission={this.hideEditPermission}
                  change={this.props.change}
                  usersLength={users.length}
                  removeFromInlineUserList={this.removeFromInlineUserList}
                />
              </div>
            </div>
            <OrganisationUserPermissions userId={this.state.selectedUser} />
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