import React from 'react';
import { List, Icon, AutoComplete, Input, Modal, Spin, notification } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ScrollArea from 'react-scrollbar';
import { Strings } from '../../../dataProvider/localize';
import * as jobManagementAction from '../../../actions/jobManagementAction';
import { abbrivationStr } from '../../../utils/common';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
class JobManagementSearch extends React.Component {
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

  componentWillReceiveProps(props) {
    if (!props.location.pathname.includes("showJob"))
      this.setState({ activeId: null });
  }

  handleJobClick = (job) => {
    this.setState({ activeId: job.id });
    this.props.history.push({ pathname: this.props.match.path + '/showJob', state: job });

    this.props.jobManagementAction.getCompletedJobDetail(job.job_number)
      .then(() => {

      })
      .catch(message => {
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
      searchValue: searchValue,
    });
    if (searchValue.length >= 3) {
      this.props.jobManagementAction.searchExpandCompletedJobsList(searchValue, 1, true)
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
      this.props.jobManagementAction.initCompletedJobs()
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
    this.props.jobManagementAction.searchExpandCompletedJobsList(this.state.searchValue, this.props.pageNumber + 1, false)
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
    // console.log('containerHeight', value.containerHeight)
    // console.log('realHeight', value.realHeight)
    // console.log('topPosition', value.topPosition)
    if (!this.state.allLoaded && value.topPosition && ((value.containerHeight + value.topPosition) >= value.realHeight)) {
      this.props.jobManagementAction.searchExpandCompletedJobsList(this.state.searchValue, this.props.pageNumber + 1, false, true)
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
    const dataSource = this.props.completedJobList && this.props.completedJobList.length > 0 ? this.props.completedJobList : []
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
          <div className="sf-search-body">
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
                      this.state.activeId === item.id ? "active" : "disable-lists" : ""} onClick={() => this.handleJobClick(item)} >

                      <Link to={{ pathname: this.props.match.path + '/showJob', state: item.id }}>
                        <List.Item.Meta
                          avatar={<label>{abbrivationStr(item && item.site_contact_name ? item.site_contact_name : '')}</label>}
                          title={item && item.job_number ? item.job_number : ''}
                        />
                      </Link>
                    </List.Item>
                  )}
                />
              </ScrollArea>
            </div>
            <div className="sf-card-footer d-flex align-items-end justify-content-center" >
              {
                this.state.viewButton && this.props.completedJobList >= 10
                  ? <button className="v-all-org" onClick={this.handelViewAllClick}>{Strings.view_all_jobs_txt}</button>
                  : null
              }
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {


  return {
    completedJobList: state.completedJobManagement.completedJobList,
    completedJobDetail: state.completedJobManagement.completedJobDetail,
    pageNumber: state.completedJobManagement.currentPageNumber,
    showMiniSpinner: state.auth.showMiniSpinner,
    showScrollSpinner: state.auth.showScrollSpinner
  }
}

const mapDispatchToprops = dispatch => {
  return {
    jobManagementAction: bindActionCreators(jobManagementAction, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(JobManagementSearch))