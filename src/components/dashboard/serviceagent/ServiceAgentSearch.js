import React from "react";
import { List, Avatar, Icon, AutoComplete, Input, notification, Spin } from "antd";
import { connect } from "react-redux";
import * as actions from "../../../actions/organizationAction";
import { Link } from "react-router-dom";
import { withRouter } from "react-router-dom";
import * as orgUseraActions from "../../../actions/organizationUserAction";
import * as orgBillingActions from "../../../actions/organizationBillingAction";
import { bindActionCreators } from "redux";
import { Strings } from "../../../dataProvider/localize";
import ScrollArea from 'react-scrollbar';
import { abbrivationStr } from '../../../utils/common'

class ServiceAgentSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seacrhValue: "",
      viewButton: true,
      activeId: null,
      allLoaded: false
    };
  }

  componentWillReceiveProps(props) {
    if (!props.location.pathname.includes("showServiceAgent"))
      this.state.activeId = null;

    if (props.serviceAgents && props.serviceAgents.length !== this.props.serviceAgents.length) {
      if (props.serviceAgents.length < 10) {
        this.setState({ viewButton: false, allLoaded: true })
      }
    }
  }

  componentDidMount() {
    // if (this.props.serviceAgents.length < 10) {
    //   this.setState({ viewButton: false });
    // }
  }

  handleSearchChange = (searchValue) => {
    this.setState({
      ...this.state,
      searchValue: searchValue,
    });
    if (searchValue.length >= 3) {
      this.props.action.searchExpandServiceAgentList(searchValue, 1, true)
        .then((listLength) => {
          if (listLength < 10) {
            this.setState({ viewButton: false })
          } else {
            this.setState({ viewButton: true, allLoaded: false })
          }
        })
        .catch((message) => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        });
    } else if (searchValue.length === 0) {
      this.props.action.initServiceAgentList()
        .then((flag) => {
          this.setState({ viewButton: true, allLoaded: false })
        })
        .catch((message) => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        });
    }
  }

  handelViewAllClick = () => {
    this.props.action.searchExpandServiceAgentList(this.state.searchValue, this.props.pageNumber + 1, false)
      .then((listLength) => {
        this.setState({ viewButton: false }, () => {
          if (listLength < 10) {
            this.setState({ allLoaded: true })
          }
        });
      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  handleScroll = (value) => {
    if (!this.state.allLoaded && value.topPosition && ((value.containerHeight + value.topPosition) >= value.realHeight)) {
      this.props.action.searchExpandServiceAgentList(this.state.searchValue, this.props.pageNumber + 1, false, true)
        .then((listLength) => {
          if (listLength < 10)
            this.setState({ allLoaded: true })
        })
        .catch((message) => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        });
    }
  }

  handleOrganizationClick = organId => {
    this.setState({ activeId: organId });
    this.props.orgUseraActions.getOrganizationUsers(organId);
    this.props.orgBillingActions.getOrganizationBillingDetails(organId);
  };


  render() {
    const dataSource = this.props.serviceAgents && this.props.serviceAgents.length > 0 ? this.props.serviceAgents : []
    return (
      <div className={this.props.togleSearch ? "col-md-3 mb-4 sf-searchbar" : "col-md-3 mb-4 closed sf-searchbar"}>
        <button onClick={this.props.handleSearchToggle} className="bnt-searchbar open"><Icon type="left" /></button>
        <div className="sf-card">
          <div className="sf-card-head">
            {/* search text box  */}
            <div id="stickAutoComplete" className="auto-search-txt search-lists">
              <AutoComplete
                className="certain-category-search"
                dropdownClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 300 }}
                size="large"
                style={{ width: "100%" }}
                onChange={this.handleSearchChange}
                placeholder={Strings.search_placeholder}
                optionLabelProp="value"
                getPopupContainer={() => document.getElementById('stickAutoComplete')}
              >
                <Input className={this.props.showMiniSpinner ? "list-search-spin" : ""} suffix={
                  !this.props.showMiniSpinner
                    ? <Icon type="search" />
                    : <Spin indicator={<Icon type="loading" spin />} />
                } />
              </AutoComplete>
            </div>
            {/* search text box  */}
          </div>
          <div className={this.state.viewButton && (this.props.serviceAgents && (this.props.serviceAgents.length >= 10)) ? "sf-search-body" : "sf-search-body add-height"}>
            {
              this.props.showScrollSpinner
                ? <div className="search-list-spin"><Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} /></div>
                : null
            }
            <div className={dataSource.length > 10 ? "sf-card-body p-0 search-lists-bar" : "sf-card-body p-0"}>
              <ScrollArea id="actualScrollArea" speed={0.8} smoothScrolling={true} className="sf-scroll" onScroll={(value) => { this.handleScroll(value) }} horizontal={false}>
                <List className="sf-service-list"
                  itemLayout="horizontal"
                  dataSource={dataSource}
                  renderItem={item => (
                    <List.Item
                      className={
                        this.state.activeId != null
                          ? this.state.activeId === item.id
                            ? "active"
                            : "disable-lists"
                          : ""
                      }
                      onClick={() => this.handleOrganizationClick(item.id)}
                    >
                      <Link
                        to={{
                          pathname: this.props.match.path + "/showServiceAgent",
                          state: item.id
                        }}
                      >
                        <List.Item.Meta
                          avatar={
                            item.logo ?
                              <Avatar
                                src={
                                  item.logo ? item.logo : "/images/sf-list-img.png"
                                }
                                shape="circle"
                                size="default"
                              /> :
                              <label>{abbrivationStr(item.name)}</label>
                          }
                          title={item.name}
                        />
                      </Link>
                    </List.Item>
                  )}
                />
              </ScrollArea>
            </div>

            {
              this.state.viewButton && (this.props.serviceAgents && (this.props.serviceAgents.length >= 10))
                ? <div className="sf-card-footer d-flex align-items-end justify-content-center">
                  <button className="v-all-org" onClick={this.handelViewAllClick}>{Strings.view_all_service_agents}</button>
                </div>
                : null
            }

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    serviceAgents: state.organization.serviceAgents,
    pageNumber: state.organization.currentPageNumber,
    showMiniSpinner: state.auth.showMiniSpinner,
    showScrollSpinner: state.auth.showScrollSpinner,
  };
};

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    orgUseraActions: bindActionCreators(orgUseraActions, dispatch),
    orgBillingActions: bindActionCreators(orgBillingActions, dispatch)
  };
};

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToprops
  )(ServiceAgentSearch)
);
