import React from 'react';
import { List, Avatar, Icon, AutoComplete, Input, notification, Spin } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ScrollArea from 'react-scrollbar';

import * as actions from '../../../actions/scopeDocActions';
import { Strings } from '../../../dataProvider/localize';
import { abbrivationStr } from '../../../utils/common';

class TaskTagsSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seacrhValue: '',
      viewButton: true,
      activeId: null,
      showSpinner: true,
      allLoaded: false
    }
  }

  componentDidMount() {
    // if (this.props.roles.length < 10) {
    //   this.setState({ viewButton: false });
    // }
  }

  componentWillReceiveProps(props) {
    if (!props.location.pathname.includes("showTaskTags"))
      this.setState({ activeId: null });

    if (props.roles.length !== this.props.roles.length) {
      if (props.roles.length < 10) {
        this.setState({ viewButton: false, allLoaded: true })
      }
    }
  }

  handleOrganizationClick = (roleId) => {
    this.setState({ activeId: roleId });
  }

  handleSearchChange = (searchValue) => {
    this.setState({
      ...this.state,
      searchValue: searchValue,
    });
    if (searchValue.length >= 3) {
      this.props.action.searchExpandTaskTagsList(searchValue, 1, true)
        .then(listLength => {
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
      this.props.action.initTaskTags()
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
    this.props.action.searchExpandTaskTagsList(this.state.searchValue, this.props.pageNumber + 1, false)
      .then((listLength) => {
        this.setState({ viewButton: false }, () => {
          if (listLength < 10) {
            this.setState({ allLoaded: true })
          }
        });
      })
      .catch((message) => {
        this.setState({ viewButton: false });
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
      this.props.action.searchExpandTaskTagsList(this.state.searchValue, this.props.pageNumber + 1, false, true)
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
    const dataSource = this.props.roles && this.props.roles.length > 0 ? this.props.roles : []
    return (
      <div className={this.props.togleSearch ? "col-md-3 mb-4 sf-searchbar" : "col-md-3 mb-4 closed sf-searchbar"}>
        <button onClick={this.props.handleSearchToggle} className="bnt-searchbar open"><Icon type="left" /></button>
        <div className="sf-card">
          <div id="stickAutoComplete" className="sf-card-head">
            {/* search text box  */}
            <div className="auto-search-txt search-lists">
              <AutoComplete
                className="certain-category-search"
                dropdownClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 300 }}
                size="large"
                style={{ width: '100%' }}
                // dataSource={this.state.viewButton ? dataSource.map(role => role.name).slice(0, 5) : dataSource.map(role => role.name)}
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
          <div className={this.state.viewButton && this.props.roles.length >= 10 ? "sf-search-body" : "sf-search-body add-height"}>
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
                      this.state.activeId === item.id ? "active" : "disable-lists" : ""} onClick={() => this.handleOrganizationClick(item.id)} >
                      <Link to={{ pathname: this.props.match.path + '/showTaskTags', state: item.id }}>
                        <List.Item.Meta
                          avatar={<label>{abbrivationStr(item.tag_name)}</label>}
                          title={item.tag_name}
                        />
                      </Link>
                    </List.Item>
                  )}
                />
              </ScrollArea>
            </div>

            {
              this.state.viewButton && this.props.roles.length >= 10
                ? <div className="sf-card-footer d-flex align-items-end justify-content-center">
                  <button className="v-all-org" onClick={this.handelViewAllClick}>{"View All Task Tgas"}</button>
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
    roles: state.scopeDocs.taskTags,
    pageNumber: state.scopeDocs.currentPageNumberTags,
    showMiniSpinner: state.auth.showMiniSpinner,
    showScrollSpinner: state.auth.showScrollSpinner
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(TaskTagsSearch))