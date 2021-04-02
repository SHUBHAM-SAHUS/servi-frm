import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter, Link } from "react-router-dom";
import moment from 'moment';
import { List, Icon, AutoComplete, Input, Modal, notification, Spin, Avatar } from 'antd';
import { Strings } from '../../../dataProvider/localize';
import * as actions from '../../../actions/clientManagementActions';
import { abbrivationStr } from '../../../utils/common';
import { getStorage } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import * as scopeDocActions from '../../../actions/scopeDocActions';
import ScrollArea from 'react-scrollbar';
import { ERROR_NOTIFICATION_KEY } from '../../../config';

class ScopeDocSearch extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      searchValue: '',
      viewButton: true,
      activeId: null,
      allLoaded: false,
    }
  }

  componentWillReceiveProps(props) {
    if (!props.location.pathname.includes("showClient"))
      this.setState({ activeId: null });

    if (props.clients.length !== this.props.clients.length) {
      if (props.clients.length < 10) {
        this.setState({ viewButton: false, allLoaded: true })
      }
    }
  }

  handleClientClick = clientId => {
    this.props.action.getSitesList(clientId)
      .then((flag) => {

      })
      .catch((message) => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });

    this.props.action.getClientDetails(clientId)
      .then((flag) => {
        this.props.history.push({ pathname: this.props.match.path + '/showClient', state: clientId })
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

  handleSearchChange = (searchValue) => {
    this.setState({
      ...this.state,
      searchValue: searchValue,
    });
    if (searchValue.length >= 3) {
      this.props.action.searchExpandClientList(searchValue, 1, true)
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
      var currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
      this.props.action.initClientsList(currentOrganization)
        .then((listLength) => {
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
    this.props.action.searchExpandClientList(this.state.searchValue, this.props.pageNumber + 1, false)
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
      this.props.action.searchExpandClientList(this.state.searchValue, this.props.pageNumber + 1, false, true)
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

  render() {
    const dataSource = this.props.clients && this.props.clients.length > 0 ? this.props.clients : [];
    return (
      <div className={this.props.toggleSearch ? "col-md-3 mb-4 sf-searchbar" : "col-md-3 mb-4 closed sf-searchbar"}>
        <button onClick={this.props.handleSearchToggle} className="bnt-searchbar open"><Icon type="left" /></button>
        <div id="stickAutoComplete" className="sf-card">
          <div className="sf-card-head">
            <div className="auto-search-txt search-lists">
              <AutoComplete
                className="certain-category-search"
                dropdownClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 300 }}
                size="large"
                style={{ width: '100%' }}
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
          </div>
          <div className={this.state.viewButton && this.props.clients.length >= 10 ? "sf-search-body" : "sf-search-body add-height"}>
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
                    <List.Item className={this.state.activeId != null ?
                      this.state.activeId === item.id ? "active" : "disable-lists" : ""} onClick={() => this.handleClientClick(item.id)} >
                      <Link>
                        <List.Item.Meta
                          avatar={
                            item.client_logo ?
                              <Avatar
                                src={
                                  item.client_logo ? item.client_logo : "/images/sf-list-img.png"
                                }
                                shape="circle"
                                size="default"
                              /> :
                              <label>{abbrivationStr(item.name)}</label>
                          }
                          title={item.name}
                          description={
                            <div className="ant-list-item-meta-description">
                              {/* <span>{item.abn_acn}</span> */}
                              <span>{item.address}</span>
                            </div>
                          }
                        />
                      </Link>
                    </List.Item>
                  )}
                />
              </ScrollArea>
            </div>

            {
              this.state.viewButton && this.props.clients.length >= 10
                ? <div className="sf-card-footer d-flex align-items-end justify-content-center">
                  <button className="v-all-org" onClick={this.handelViewAllClick}>{Strings.view_all_clients}</button>
                </div>
                : null
            }

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    scopeDocs: state.scopeDocs.scopeDocs,
    clients: state.clientManagement.clients,
    pageNumber: state.clientManagement.currentPageNumber,
    showMiniSpinner: state.auth.showMiniSpinner,
    showScrollSpinner: state.auth.showScrollSpinner,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    scopeDocActions: bindActionCreators(scopeDocActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(ScopeDocSearch))