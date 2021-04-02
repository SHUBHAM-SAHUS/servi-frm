import React from 'react';
import { Icon, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';

import * as actions from '../../../actions/roleManagementActions';
import * as accessControlAction from '../../../actions/accessControlManagementAction';
import RoleSearch from './roleSearch';
import AddNewRole from './addNewRole';
import EditRole from './editRole';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { goBack } from '../../../utils/common';
import { getStorage, setStorage } from '../../../utils/common';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
const mapRouteToTitle = {
  '/dashboard/rolesmanagement/createRole': Strings.add_role_title
}

class RolesManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { togleSearch: true }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    this.props.accessControlAction.getAccessControlsByModule();
    this.props.action.initRoles().then((flag) => {
      if (this.permissions.org_create_role !== -1){
        if (this.props.location.state && this.props.location.state.fromLink)
          this.createRoleHandler();}
    }).catch((message) => {
      notification.error({
        key: ERROR_NOTIFICATION_KEY,
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });
  }

  createRoleHandler = () => {
    this.props.history.push(this.props.match.path + '/createRole')
  }

  handleSearchToggle = () => {
    this.setState({ togleSearch: !this.state.togleSearch })
  }

  roleAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["rolesmanagement"].permissions;
  /**Permissions for the module */
  permissions = {
    org_list_role: this.roleAccessControl.findIndex(acess => acess.control_name === 'org_list_role'),
    org_create_role: this.roleAccessControl.findIndex(acess => acess.control_name === 'org_create_role'),
  }


  render() {

    return (
      <div className="sf-page-layout">
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : Strings.role_title}
          </h2>

          <div class="oh-cont">
            {this.permissions.org_create_role !== -1 ?
              <button className="bnt bnt-active" onClick={this.createRoleHandler}>{Strings.add_role_btn}</button>
              : null}
          </div>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            {/* Left section */}
            {this.permissions.org_list_role !== -1 ?
              <RoleSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} />
              : null}
            {/* center section  */}
            <Route path={this.props.match.path + '/showRole'} render={(props) => <EditRole {...props} togleSearch={this.state.togleSearch} />} />
            <Route path={this.props.match.path + '/createRole'} render={(props) => <AddNewRole {...props} togleSearch={this.state.togleSearch} />} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    roles: state.roleManagement.roles,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    accessControlAction: bindActionCreators(accessControlAction, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(RolesManagement)