import React from 'react';
import { Icon, Table, Modal, Dropdown, notification } from 'antd';
import { connect } from 'react-redux';
import * as actions from '../../../actions/organizationUserAction';
import { Strings } from '../../../dataProvider/localize';
import { goBack } from '../../../utils/common';

class InviteUsers extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedRowKeys: [] };
  }

  onSelectChange = selectedRowKeys => {
    this.setState({ selectedRowKeys });
  };

  data = this.props.users.map(user => {
    return {
      key: user.id, name: user.name + " " + (user.last_name ? user.last_name : ""),
      email_address: user.email_address,
      phone_number: `${user.country_code}${user.phone_number}`,
      "role.name": user.role.name,
      smsCode: user.user_name,
      emailCode: user.user_name,
      is_authorized: user.is_authorized
    }
  })

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
      if (Boolean(user.is_authorized)) {
        return (
          <button onClick={() => this.props.resendAtrributeCode(
            { org_user_name: user_name, attribute: 'PHONE' }).catch((message) => this.errorMessage(message))}>Resend SMS</button>
        )
      }
    }
  }, {
    title: Strings.user_table_email_code,
    dataIndex: 'emailCode',
    render: (user_name, user) => {
      if (Boolean(user.is_authorized)) {
        return (
          <button onClick={() => this.props.resendAtrributeCode(
            { org_user_name: user_name, attribute: 'EMAIL' }).catch((message) => this.errorMessage(message))}>Resend Email</button>
        )
      }
    }
  }]

  handleInviteClick = () => {
    const inviteUsersIds = { id: this.state.selectedRowKeys }
    this.props.inviteUsers(inviteUsersIds).then((flag) => {
      this.setState({ selectedRowKeys: [] });
    }).catch((message) => {
      notification.error({
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
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
    };
    return (
      <>
        <div className="dash-header">
          <h2 className="page-mn-hd"><Icon type="arrow-left" onClick={() => goBack(this.props)} />Invite Users</h2>

          <div className="sf-steps-status">
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
          </div>

          <div />
        </div>
        <div className="main-container">
          <div className="sf-card">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.invite_users}</h2>
              <div className="info-btn disable-dot-menu">
                <Dropdown className="more-info" disabled>
                  <i className="material-icons">more_vert</i>
                </Dropdown>
              </div>
            </div>
            <div className="sf-card-body">
              <Table className="invite-user" rowSelection={rowSelection} columns={this.columns} dataSource={this.data} />
              <button className="bnt bnt-active" onClick={this.handleInviteClick}>{Strings.invite_btn}</button>
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