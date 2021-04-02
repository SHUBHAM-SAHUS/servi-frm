import React from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import * as actions from '../../../actions/roleManagementActions';
import * as broadActions from '../../../actions/broadcastActions';

import BroadcastSearch from './BroadcastSearch';
import AddNewBroadcast from './AddNewBroadcast';
import ViewEditBroadcast from './ViewEditBroadcast';
import { Strings } from '../../../dataProvider/localize';
import { goBack } from '../../../utils/common';

const mapRouteToTitle = {
  '/dashboard/broadcast/create_broadcast': Strings.broadcast_title
}

export class Broadcast extends React.Component {
  constructor(props) {
    super(props);
    this.state = { togleSearch: true }
    this.createBroadcastHandler()
  }

  componentDidMount() {
    // this.props.broadAction.initBroadcast()
    //   .then(() => {
    //     if (this.props.location.state && this.props.location.state.fromLink)
    //       this.createBroadcastHandler()
    //   })
    //   .catch((message) => {
    //     notification.error({
    //       key: ERROR_NOTIFICATION_KEY,
    //       message: Strings.error_title,
    //       description: message ? message : Strings.generic_error,
    //       onClick: () => { },
    //       className: 'ant-error'
    //     });
    //   });
  }

  createBroadcastHandler = () => {
    this.props.history.push(this.props.match.path + '/create_broadcast')
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
            {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : Strings.broadcast_title}
          </h2>
          <div class="oh-cont">
            <button className="bnt bnt-active" onClick={this.createBroadcastHandler}>{Strings.add_broadcast_btn}</button>
          </div>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            {/* Left section */}
            <BroadcastSearch toggleSearch={this.handleSearchToggle} togleSearch={this.state.togleSearch} />
            {/* center section  */}
            <Route path={this.props.match.path + '/show_broadcast'} render={(props) => <ViewEditBroadcast {...props} togleSearch={this.state.togleSearch} />} />
            <Route path={this.props.match.path + '/create_broadcast'} render={(props) => <AddNewBroadcast {...props} togleSearch={this.state.togleSearch} />} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    roles: state.roleManagement.roles,
    broadcastList: state.broadCast.broadcastList,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    broadAction: bindActionCreators(broadActions, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(Broadcast)