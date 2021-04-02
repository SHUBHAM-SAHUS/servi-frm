import React from 'react';
import { Icon, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';

import * as actions from '../../../actions/scopeDocActions';
import TaskTagsSearch from './TaskTagsSearch';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { goBack } from '../../../utils/common';
import { getStorage, setStorage } from '../../../utils/common';
import EditTaskTags from './EditTaskTags';
import AddNewTaskTags from './AddNewTaskTags';
import { ERROR_NOTIFICATION_KEY } from '../../../config';

const mapRouteToTitle = {
  '/dashboard/taskTags/createTaskTags': "Add Task Tags"
}

class TaskTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = { togleSearch: true }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  componentDidMount() {
    this.props.action.initTaskTags(this.currentOrganization).then((flag) => {
      if (this.props.location.state && this.props.location.state.fromLink)
      this.createRoleHandler()
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
    this.props.history.push(this.props.match.path + '/createTaskTags')
  }

  handleSearchToggle = () => {
    this.setState({ togleSearch: !this.state.togleSearch })
  }

  render() {

    return (
      <div className="sf-page-layout">
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : "Task Tags"}
          </h2>

          <div class="oh-cont">
            {/*    {this.permissions.org_create_role !== -1 ? */}
            <button className="bnt bnt-active" onClick={this.createRoleHandler}>{"Add Task Tags"}</button>
            {/*  : null} */}
          </div>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            {/* Left section */}
            {/*  {this.permissions.org_list_role !== -1 ? */}
            <TaskTagsSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} />
            {/* : null} */}
            {/* center section  */}
            <Route path={this.props.match.path + '/showTaskTags'} render={(props) => <EditTaskTags {...props} togleSearch={this.state.togleSearch} />} />
            <Route path={this.props.match.path + '/createTaskTags'} render={(props) => <AddNewTaskTags {...props} togleSearch={this.state.togleSearch} />} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(TaskTags)