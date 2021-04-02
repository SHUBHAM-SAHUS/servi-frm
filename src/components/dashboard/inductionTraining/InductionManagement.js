import React from 'react';
import { Icon, Modal } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';

import * as actions from '../../../actions/inductionTrainingAction';
import InductionSearch from './InductionSearch';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { goBack } from '../../../utils/common';
import { getStorage, setStorage } from '../../../utils/common';
import ViewDetailInduction from './ViewDetailInduction';
import ShowInduction from './ShowInduction';

const mapRouteToTitle = {
  '/dashboard/inductionTraining/createInduction': Strings.induction_training_title
}

class InductionManagement extends React.Component {
  constructor(props) {
    super(props);
    this.state = { togleSearch: true }
    this.createInductionHandler();
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  componentDidMount() {
    const page = 1
    this.props.action.getCourses(page);
  }

  createInductionHandler = () => {
    this.props.history.push(this.props.match.path + '/createInduction')
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
            {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : Strings.induction_training_title}
          </h2>

          <div class="oh-cont">
            {/*    {this.permissions.org_create_role !== -1 ? */}
            <button className="bnt bnt-active" onClick={this.createInductionHandler}>{Strings.induction_view_details_btn}</button>
            {/*  : null} */}
          </div>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            {/* Left section */}
            {/*  {this.permissions.org_list_role !== -1 ? */}
            <InductionSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} />
            {/* : null} */}
            {/* center section  */}
            <Route path={this.props.match.path + '/showInduction'} render={(props) => <ShowInduction {...props} togleSearch={this.state.togleSearch} />} />
            <Route path={this.props.match.path + '/createInduction'} render={(props) => <ViewDetailInduction {...props} togleSearch={this.state.togleSearch} />} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    courses: state.inductionTraining.courses,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(InductionManagement)