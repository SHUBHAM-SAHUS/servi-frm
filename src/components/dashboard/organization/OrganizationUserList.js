import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Icon, Popconfirm, Modal, notification } from 'antd';
import * as actions from '../../../actions/organizationUserAction';
import { Strings } from '../../../dataProvider/localize';
import { ACCESS_CONTROL } from '../../../dataProvider/constant'
import { getStorage, setStorage } from '../../../utils/common';
import PerfectScrollbar from 'react-perfect-scrollbar'

class OrganizationUserList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { activeId: null, displayPermiComp: false, userLength: props.orgUsers.length };
    }

    handleUserClick = (user_id, role_id, name, org_user_name) => {
        this.props.handleUserDetails(user_id, role_id, name, org_user_name);
    };

    findObjectByKey(array, key, value) {
        for (var i = 0; i < array.length; i++) {
            if (array[i][key] === value) {
                return array[i];
            }
        }
        return null;
    }

    removeFromInlineUserList = (user) => {
        this.props.removeFromInlineUserList(user)
    }

    handdleDeleteUserClick = (user) => {
        if (user.role.org_default_role === 1 && this.props.users && this.props.users.filter(
            user => user.role.org_default_role == 1
        ).length < 2) {
            notification.error({
                message: Strings.error_title,
                description: Strings.user_list_delete_alert,
                onClick: () => { },
                className: 'ant-error'
            });
            return
        }

        this.props.actions.deleteOrganizationUser({
            organisation_id: user.organisation_id,
            user_name: user.user_name
        }, user.organisation_id).then(message => {
            this.props.hideEditPermission()
            this.removeFromInlineUserList(user)
            notification.success({
                message: Strings.success_title,
                description: message,
                onClick: () => { },
                className: 'ant-success'
            });
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
        var accessControl = JSON.parse(getStorage(ACCESS_CONTROL))["userManagement"].permissions;
        /**Permissions for the module */
        var permissions = {
            sf_org_update_user_permission: accessControl.findIndex(acess => acess.control_name === 'sf_org_update_user_permission'),
            sf_org_delete_user: accessControl.findIndex(acess => acess.control_name === 'sf_org_delete_user'),
        }

        return (
            <div className="sf-card-body">
                <PerfectScrollbar className="sf-ps-scroll" onScrollX>
                    <div className="sf-ps-scroll-content">
                        <table className="add-user-table table">
                            <tr>
                                <th>{Strings.user_table_name}</th>
                                <th>{Strings.user_table_email}</th>
                                <th>{Strings.user_table_phone}</th>
                                <th>{Strings.user_table_role}</th>
                                <th style={{ width: '80px' }}></th>
                            </tr>
                            {this.props.users.map((user, index) =>
                                <tr
                                    key={user.id}
                                    className={
                                        this.state.activeId != null
                                            ? this.state.activeId === user.id
                                                ? "active"
                                                : "disable-lists" :
                                            this.findObjectByKey(this.props.inlineUsers, 'user_name', user.user_name) === null ? "user-edit-options hlight-n-user" : "user-edit-options"
                                        //this.state.userLength < index + 1 && this.props.inlineUsers.indexOf(id => id == user.id) == -1 ? "user-edit-options hlight-n-user" : "user-edit-options"
                                        // : this.state.userLength < index + 1 ? "user-edit-options hlight-n-user" : "user-edit-options"
                                    }
                                >
                                    <td>{user.name + " " + (user.last_name ? user.last_name : "")}</td>
                                    <td>{user.email_address}</td>
                                    <td>{`${user.country_code}${user.phone_number}`}</td>
                                    <td>{user.role.name}</td>
                                    <td>
                                        <div id="user-edit">
                                            {permissions.sf_org_update_user_permission !== -1 ? <button className='delete-bnt' onClick={() => this.handleUserClick(user.id, user.role_id, user.name, user.user_name)}>
                                                <i class="material-icons">create</i>
                                            </button> : null}
                                            {permissions.sf_org_delete_user !== -1 ?
                                                <Popconfirm
                                                    title={Strings.user_list_confirm_delete_alert}
                                                    // icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                                    onConfirm={() => this.handdleDeleteUserClick(user)}
                                                    placement="topRight"
                                                    okText="Yes"
                                                    cancelText="No"
                                                    getPopupContainer={() => document.getElementById('user-edit')}
                                                >
                                                    <button className='delete-bnt' userId={user.id}>
                                                        <i class="fa fa-trash-o"></i>
                                                    </button>
                                                </Popconfirm> : null}
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </table>
                    </div>
                </PerfectScrollbar>
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
        actions: bindActionCreators(actions, dispatch),
    };
};

export default connect(mapStateToProps, mapDispatchToprops)(OrganizationUserList);