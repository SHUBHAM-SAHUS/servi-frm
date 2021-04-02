import React, { Component } from 'react';
import {
  List,
  Icon,
  AutoComplete,
  Input,
  notification,
  Spin
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Strings } from '../../../dataProvider/localize';
import { abbrivationStr } from '../../../utils/common';
import ScrollArea from 'react-scrollbar';
import * as broadActions from '../../../actions/broadcastActions';
import { ERROR_NOTIFICATION_KEY } from '../../../config';

export class BroadcastSearch extends Component {

  state = {
    searchValue: '',
    viewButton: true,
    activeId: null,
    allLoaded: false,
  }

  componentDidMount() {
    this.props.broadAction.initBroadcast()
      .then(() => {

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
  }

  static getDerivedStateFromProps(props, state) {
    if (props.location && !props.location.pathname.includes("show_broadcast")) { }
  }

  componentWillReceiveProps(props) {
    if (props.broadcastList.length !== this.props.broadcastList.length) {
      if (props.broadcastList.length < 10) {
        this.setState({ viewButton: false, allLoaded: true })
      }
    }
  }


  handleBroadcastItemClick = id => {
    this.setState({ activeId: id });
    this.props.broadAction.getBroadcastDetails(id)
      .then(() => {

      })
      .catch((message) => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  }

  handleSearchChange = (searchValue) => {
    this.setState({
      ...this.state,
      searchValue: searchValue
    });

    if (searchValue.length >= 3) {
      this.props.broadAction.searchExpandBroadcastList(searchValue, 1, true)
        .then(listLength => {
          if (listLength < 10) {
            this.setState({ viewButton: false })
          } else {
            this.setState({ viewButton: true })
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
      this.props.broadAction.initBroadcast()
        .then((flag) => {
          this.setState({ viewButton: true })
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

  handleViewAllClick = () => {
    this.props.broadAction.searchExpandBroadcastList(this.state.searchValue, this.props.pageNumber + 1, false)
      .then((listLength) => {
        this.setState({ viewButton: false });
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
      this.props.broadAction.searchExpandBroadcastList(this.state.searchValue, this.props.pageNumber + 1, false, true)
        .then((listLength) => {
          console.log("listLength", listLength)
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
    const dataSource = this.props.broadcastList.filter(broadcast => broadcast.title.toLowerCase().includes(this.state.searchValue.toLowerCase()));

    return (
      <div className={this.props.togleSearch ? "col-md-3 mb-4 sf-searchbar" : "col-md-3 mb-4 closed sf-searchbar"}>
        <button onClick={this.props.toggleSearch} className="bnt-searchbar open"><Icon type="left" /></button>
        <div className="sf-card">
          <div className="sf-card-head">
            {/* search text box  */}
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

          <div className={this.state.viewButton && this.props.broadcastList.length >= 10 ? "sf-search-body" : "sf-search-body add-height"}>
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
                      this.state.activeId === item.id ? "active" : "disable-lists" : ""} onClick={() => this.handleBroadcastItemClick(item.id)} >
                      <Link to={{ pathname: this.props.match.path + '/show_broadcast', state: item.id }}>
                        <List.Item.Meta
                          avatar={<label>{abbrivationStr(item.title)}</label>}
                          title={item.title}
                          description={
                            <div className="ant-list-item-meta-description">
                              {
                                item.sent_notification === 1
                                  ?
                                  <i className="ion-android-checkmark-circle check-list-item "></i>
                                  : null
                              }
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
              this.state.viewButton && this.props.broadcastList.length >= 10
                ? <div className="sf-card-footer d-flex align-items-end justify-content-center">
                  <button className="v-all-org" onClick={this.handleViewAllClick}>{Strings.view_all_broadcast}</button>
                </div>
                : null
            }

          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  broadcastList: state.broadCast.broadcastList,
  pageNumber: state.broadCast.currentPageNumber,
  showMiniSpinner: state.auth.showMiniSpinner,
  showScrollSpinner: state.auth.showScrollSpinner,
})

const mapDispatchToProps = dispatch => {
  return {
    broadAction: bindActionCreators(broadActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(BroadcastSearch))
