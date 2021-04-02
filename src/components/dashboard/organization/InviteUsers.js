import React from 'react';
import { Table, Modal, Icon, Dropdown, Menu, notification } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../../../actions/organizationUserAction';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { getStorage, goBack, goBackBrowser } from '../../../utils/common';
import $ from 'jquery';

class InviteUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedRowKeys: [] };
  }

  componentDidMount() {
    $('.ant-table-wrapper.invite-user .ant-spin-nested-loading').insertBefore('button.bnt.bnt-active');
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  errorMessage = (message) => notification.error({
    message: Strings.error_title,
    description: message ? message : Strings.generic_error,
    onClick: () => { },
    className: 'ant-error'
  });

  columns = [{
    title: Strings.user_table_name,
    dataIndex: 'name'
  }, {
    title: Strings.user_table_email,
    dataIndex: 'email_address'
  }, {
    title: Strings.user_table_phone,
    dataIndex: 'phone_number'

  }, {
    title: Strings.user_table_role,
    dataIndex: "role.name"
  }, {
    title: Strings.user_table_sms,
    dataIndex: 'smsCode',
    render: (user_name, user) => {
      if (Boolean(user.is_authorized) && !user.phone_verified) {
        return (
          <button className="bnt-simple" onClick={() => this.props.resendAtrributeCode(
            { org_user_name: user_name, attribute: 'PHONE' })
            .then(() => this.props.getOrganizationUsers(JSON.parse(getStorage(ADMIN_DETAILS)) ?
              JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null))
            .catch((message) => this.errorMessage(message))}>Resend SMS</button>
        )
      }
    }
  }, {
    title: Strings.user_table_email_code,
    dataIndex: 'emailCode',
    render: (user_name, user) => {
      if (Boolean(user.is_authorized) && !user.email_verified) {
        return (
          <button className="bnt-simple" onClick={() => this.props.resendAtrributeCode(
            { org_user_name: user_name, attribute: 'EMAIL' })
            .then(() => this.props.getOrganizationUsers(JSON.parse(getStorage(ADMIN_DETAILS)) ?
              JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null))
            .catch((message) => this.errorMessage(message))}>Resend Email</button>
        )
      }
    }
  }]

  handleInviteClick = () => {
    if (!this.state.selectedRowKeys.length > 0) {
      notification.warning({
        message: Strings.warning_title,
        description: "Please select atleast one user to invite",
        onClick: () => { },
        className: 'ant-warning'
      });
      return
    }
    const inviteUsersIds = { id: this.state.selectedRowKeys, user_org_id: this.props.users[0].organisation_id }
    this.props.inviteUsers(inviteUsersIds).then((message) => {
      this.setState({ selectedRowKeys: [] });
      notification.success({
        message: Strings.success_title,
        description: message,
        onClick: () => { },
        className: 'ant-success'
      });
      this.props.getOrganizationUsers(this.props.users[0].organisation_id);
    }).catch((content) => {
      notification.error({
        message: Strings.error_title,
        description: content.message ? <div>{content.message}<br />{
          content.invalidUsers.map(id => <div><span>{this.props.users.find(user => user.user_name === id).name + " " + (this.props.users.find(user => user.user_name === id).last_name ?
            this.props.users.find(user => user.user_name === id).last_name : ''
          )}</span><br /></div>)
        }</div> : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });

  }

  render() {
    const { selectedRowKeys } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: this.onSelectChange,
      getCheckboxProps: record => ({
        disabled: Boolean(record.org_invitation_sent), // Column configuration not to be checked
      }),
    };
    const data = this.props.users.map(user => {
      return {
        key: user.id, name: user.name + " " + (user.last_name ? user.last_name : ''),
        email_address: user.email_address,
        phone_number: `${user.country_code}${user.phone_number}`,
        "role.name": user.role.name,
        smsCode: user.user_name,
        emailCode: user.user_name,
        is_authorized: user.is_authorized,
        phone_verified: user.phone_verified,
        email_verified: user.email_verified,
        org_invitation_sent: user.org_invitation_sent
      }
    })

    return (
      <>
        <div className="dash-header">
          <h2 className="page-mn-hd"><Icon type="arrow-left" onClick={() => 
          // goBack(this.props)
          goBackBrowser(this.props)
          } />Invite Users</h2>

          {/* <div className="sf-steps-status">
            <div className="sf-st-item">
              <div className="iconbx">
                <Icon type="usergroup-add" /></div>
              <span>{Strings.user_wizard_user}</span>
            </div>
            <div className="sf-st-item no-bp">
              <div className="iconbx key-rtic">
                <img alt="" src="/images/key-icon.png" /></div>
              <span>{Strings.user_wizard_permissions}</span>
            </div>
            <div className="sf-st-item sf-prog">
              <i>0%</i>
              <span>{Strings.org_wizard_progress}</span>
            </div>
          </div> */}

          <div />
        </div>
        <div className="main-container">
          <div className="sf-card">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.invite_users}</h2>
              <div className="info-btn disable-dot-menu">
                <Dropdown className="more-info" disabled overlay={''}>
                  <i className="material-icons">more_vert</i>
                </Dropdown>
              </div>
            </div>
            <div className="sf-card-body">
              <Table className="invite-user" rowSelection={rowSelection} columns={this.columns} dataSource={data} />
              <button className="bnt bnt-active mt-4 mb-2" onClick={this.handleInviteClick}>{Strings.invite_btn}</button>
            </div>
          </div>
        </div>
      </>
    )
  }
}
const mapStateToProps = (state) => {
  return {
    users: state.organizationUsers.users
  }
}

export default connect(mapStateToProps, actions)(InviteUsers);