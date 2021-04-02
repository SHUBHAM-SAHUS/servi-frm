import React from 'react';
import { Icon } from 'antd';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import * as actions from '../../../actions/SWMSAction';
import SWMSManagementSearch from './SWMSManagementSearch';
import EditSWMSManagement from './EditSWMSManagement';
import { Strings } from '../../../dataProvider/localize';
import { goBack } from '../../../utils/common';
import ViewEditSWMSCategory from './ViewEditSWMSCategory';
import ViewEditSWMSActivity from './ViewEditSWMSActivity';
import * as consequncesAction from '../../../actions/consequenceBeforeActions'
import * as likelyHoodAction from '../../../actions/likelyhoodBeforeControlAction'
import { bindActionCreators } from 'redux';
import ViewEditPPE from './ViewEditPPE';
import ViewEditTool from './ViewEditTool';
import ViewEditHRW from './ViewEditHRW';
import ViewEditChemical from './ViewEditChemical';
import ViewEditToolBoxTalkItem from './ViewEditToolBoxTalkItem';
import ViewEditToolboxTalk from './ViewEditToolboxTalk';
class SWMSManagement extends React.Component {


  componentDidMount() {
    this.props.action.getOrgSWMS()
    this.props.likelyHoodAction.initLikelyhoodBeforeControl()
    this.props.consequncesAction.initConsequenceBefore()
    this.props.action.getToolboxItems()
    this.props.action.getToolbox()
    this.props.history.push(this.props.match.path + '/view_edit_SWMS_Activity')
  }

  render() {
    return (
      <div className="sf-page-layout">
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            SWMS Management
          </h2>

        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            {/* Left section */}
            <SWMSManagementSearch handleSearchToggle={this.handleSearchToggle} />
            {/* center section  */}
            <Route path={this.props.match.path + '/showSWMSManagement'}
              render={(props) => <EditSWMSManagement {...props} />} />
            <Route path={this.props.match.path + '/view_edit_SWMS_category'}
              render={(props) => <ViewEditSWMSCategory {...props} />} />
            <Route path={this.props.match.path + '/view_edit_SWMS_Activity'}
              render={(props) => <ViewEditSWMSActivity {...props} />} />
            <Route path={this.props.match.path + '/view_edit_PPE'}
              render={(props) => <ViewEditPPE {...props} />} />
            <Route path={this.props.match.path + '/view_edit_tool_type'}
              render={(props) => <ViewEditTool {...props} />} />
            <Route path={this.props.match.path + '/view_edit_high_risk_work'}
              render={(props) => <ViewEditHRW {...props} />} />
            <Route path={this.props.match.path + '/view_edit_chemicals'}
              render={(props) => <ViewEditChemical {...props} />} />
            <Route path={this.props.match.path + '/view_edit_toolbox_talk_items'}
              render={(props) => <ViewEditToolBoxTalkItem {...props} />} />
            <Route path={this.props.match.path + '/view_edit_toolbox_talk'}
              render={(props) => <ViewEditToolboxTalk {...props} />} />
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
    likelyHoodAction: bindActionCreators(likelyHoodAction, dispatch),
    consequncesAction: bindActionCreators(consequncesAction, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(SWMSManagement)