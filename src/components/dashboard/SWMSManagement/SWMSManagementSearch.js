import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { Strings } from '../../../dataProvider/localize';
import { bindActionCreators } from "redux";
import * as actions from '../../../actions/industryManagementAction';

class SWMSManagementSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      viewButton: true,
      activeId: null
    }
  }

  componentDidMount() {
  }

  render() {

    return (
      <div className={"col-md-2 mb-4 sf-searchbar"}>
        {/* <button onClick={this.props.handleSearchToggle} className="bnt-searchbar open"><Icon type="left" /></button> */}
        <div className="sf-card">
          <div className={"sf-search-body"}>
            <div className={this.state.viewButton ? "sf-card-body p-0" : "sf-card-body p-0 search-lists-bar"}>

              <div className="swms-mgnt-nav">
                <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/view_edit_SWMS_category' }}>
                  <i class="material-icons">autorenew</i>
                  <span>SWMS Category</span>
                </Link>
                <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/view_edit_SWMS_Activity' }}>
                  <i class="material-icons">autorenew</i>
                  <span>SWMS Activity</span>
                </Link>
                <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/view_edit_PPE' }}>
                  <i class="material-icons">autorenew</i>
                  <span>PPE</span>
                </Link>
                <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/view_edit_tool_type' }}>
                  <i class="material-icons">autorenew</i>
                  <span>Tool Type</span>
                </Link>
                <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/view_edit_high_risk_work' }}>
                  <i class="material-icons">autorenew</i>
                  <span>High Risk Work</span>
                </Link>

                <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/view_edit_chemicals' }}>
                  <i class="material-icons">autorenew</i>
                  <span>Chemicals</span>
                </Link>
                <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/view_edit_toolbox_talk_items' }}>
                  <i class="material-icons">autorenew</i>
                  <span>Toolbox Talk Items</span>
                </Link>
                <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/view_edit_toolbox_talk' }}>
                  <i class="material-icons">autorenew</i>
                  <span>Toolbox Talk</span>
                </Link>
                {/* <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/showSWMSManagement' }}>
                  <i class="material-icons">autorenew</i>
                  <span>Likelihood</span>
                </Link>
                <Link className="sm-nav-items" to={{ pathname: this.props.match.path + '/showSWMSManagement' }}>
                  <i class="material-icons">autorenew</i>
                  <span>Consequence</span>
                </Link> */}
              </div>

            </div>

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {

  };
};

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  };
};

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(SWMSManagementSearch))