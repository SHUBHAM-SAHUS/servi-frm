import React from 'react';
import {
  List,
  Avatar,
  Icon,
  AutoComplete,
  Input,
  Modal,
  notification,
  Spin
} from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import ScrollArea from 'react-scrollbar';
import { bindActionCreators } from 'redux';
import { withRouter } from "react-router-dom";

import { abbrivationStr } from '../../../utils/common';
import { Strings } from '../../../dataProvider/localize';
import * as actions from '../../../actions/inductionTrainingAction';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import moment from 'moment';

class InductionManagementSearch extends React.Component {
  state = {
    seacrhValue: '',
    viewButton: true,
    activeId: null,
    allLoaded: false,
  }

  componentDidMount() {
    // if (this.props.equipments.length < 10) {
    //   this.setState({ viewButton: false });
    // }
  }

  componentWillReceiveProps(props) {
    if (!props.location.pathname.includes("showInductionManagement"))
      this.setState({ activeId: null });

    if (props.coursesList.length !== this.props.coursesList.length) {
      if (props.coursesList.length < 10) {
        this.setState({ viewButton: false, allLoaded: true })
      }
    }
  }

  handleCourseClick = (courseId) => {
    this.props.history.push({ pathname: this.props.match.path + '/showInductionManagement', state: courseId })
    this.setState({ activeId: courseId });
    /* this.props.equipmentActions.getEquipmentDetails(courseId)
      .then((flag) => {
        this.props.history.push({ pathname: this.props.match.path + '/showInductionManagement', state: courseId })
      })
      .catch((message) => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      }); */
  }

  handelSearchChange = (searchValue) => {
    this.setState({
      ...this.state,
      searchValue: searchValue,
    });
    if (searchValue.length >= 3) {
      this.props.action.searchExpandCoursesList(searchValue, 1, true)
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
      this.props.action.initCourses()
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

  handelViewAllClick = () => {
    this.props.action.searchExpandCoursesList(this.state.searchValue, this.props.pageNumber + 1, false)
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
      this.props.action.searchExpandCoursesList(this.state.searchValue, this.props.pageNumber + 1, false, true)
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
    const dataSource = this.props.coursesList && this.props.coursesList.length > 0 ? this.props.coursesList : [];
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
                // dataSource={this.state.viewButton ? equipmentsList.map(equipment => equipment.name).slice(0, 5) : equipmentsList.map(equipment => equipment.name)}
                onChange={this.handelSearchChange}
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
          <div className={this.state.viewButton && this.props.coursesList.length >= 10 ? "sf-search-body" : "sf-search-body add-height"}>
            {
              this.props.showScrollSpinner
                ? <div className="search-list-spin"><Spin indicator={<Icon type="loading" style={{ fontSize: 24 }} spin />} /></div>
                : null
            }
            <div className={dataSource.length > 10 ? "sf-card-body p-0 search-lists-bar" : "sf-card-body p-0"}>
              <ScrollArea id="actualScrollArea" speed={0.8} smoothScrolling={true} className="sf-scroll" onScroll={(value) => { this.handleScroll(value) }} horizontal={false}>
                <List className="sf-service-list"
                  itemLayout="horizontal"
                  //dataSource={this.state.viewButton ? equipmentsList.slice(0, 10) : equipmentsList}
                  dataSource={dataSource}
                  renderItem={item => (
                    <List.Item className={this.state.activeId != null ?
                      this.state.activeId === item.id ? "active" : "disable-lists" : ""} onClick={() => this.handleCourseClick(item.id)} >
                      <Link to={{ pathname: this.props.match.path + '/showInductionManagement', state: item.id }}>
                        <List.Item.Meta
                          avatar={<label>{abbrivationStr(item.name)}</label>}
                          title={item.name}
                          description={
                            <div className="ant-list-item-meta-description">
                              {/* <span>{`${item.equipment_id}`}</span> */}
                              {/* <span>{`Exp: 10 Oct 2019`}</span> */}
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
              this.state.viewButton && this.props.coursesList.length >= 10
                ? <div className="sf-card-footer d-flex align-items-end justify-content-center">
                  <button className="v-all-org" onClick={this.handelViewAllClick}>{Strings.view_all_induction}</button>
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
    roles: state.roleManagement.roles,
    coursesList: state.inductionTraining && state.inductionTraining.coursesList,
    pageNumber: state.inductionTraining.currentPageNumber,
    showMiniSpinner: state.auth.showMiniSpinner,
    showScrollSpinner: state.auth.showScrollSpinner,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(InductionManagementSearch))