import React from "react";
import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import moment from "moment";
import { List, Icon, AutoComplete, Input, Spin, notification } from "antd";
import { Strings } from "../../../dataProvider/localize";
import * as actions from "../../../actions/scopeDocActions";
import * as bookingCalendarActions from "../../../actions/bookingCalendarActions";
import ScrollArea from "react-scrollbar";
import { ERROR_NOTIFICATION_KEY } from "../../../config";
import { searchOptions } from "./AdvanceSearchOptions";

export class ScopeDocSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchValue: "",
      viewButton: true,
      activeId: null,
      showSpinner: true,
      allLoaded: false,
      viewJobs: [],
      selectedJobId: ''
    };
  }

  // componentWillReceiveProps(props) {
  //   if (!props.location.pathname.includes("showScopeDoc")) {
  //     this.setState({ activeId: null });
  //   }

  //   if (props.scopeDocs.length !== this.props.scopeDocs.length) {
  //     if (props.scopeDocs.length < 10) {
  //       this.props.setViewButton(false);
  //       this.setState({ /* viewButton: false, */ allLoaded: true });
  //     }
  //   }
  // }

  static getDerivedStateFromProps(props, state) {
    if (!props.location.pathname.includes("showScopeDoc")) {
      return {
        ...state,
        activeId: null
      }
    }

    if (!state.activeId) {
      state.activeId = props.history.location.state;
    }
  }

  handleScopeDocClick = (scopeDocId, clientId, quote_number) => {
    this.setState({ activeId: scopeDocId });
    this.props.action
      .getScopeDocDetails(scopeDocId, null, quote_number)
      .then(flag => {
        this.props.action.getPrimaryPersons(clientId);
        this.props.history.push({
          pathname: this.props.match.path + "/showScopeDoc",
          state: scopeDocId
        });
      })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: "ant-error"
        });
      });
  };

  handleSearchClick = () => {
    if (!this.props.togleSearch) {
      this.props.handleSearchToggle();
    }
  };

  handleSearchChange = searchValue => {
    this.setState({
      ...this.state,
      searchValue: searchValue
    });
    if (searchValue.length >= 3) {
      this.props.action
        .searchExpandScopeDocsList(
          searchValue,
          1,
          true,
          false,
          this.props.advanceSearchForm
        )
        .then(listLength => {
          if (listLength < 10) {
            this.props.setViewButton(false);
            // this.setState({ viewButton: false });
          } else {
            this.props.setViewButton(true);
            this.setState({ /* viewButton: true, */ allLoaded: false });
          }
        })
        .catch(message => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: "ant-error"
          });
        });
    } else if (searchValue.length === 0) {
      this.props.action
        .initScopeDocs()
        .then(flag => {
          this.props.setViewButton(true);
          this.setState({ /* viewButton: true, */ allLoaded: false });
        })
        .catch(message => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: "ant-error"
          });
        });
    }
  };

  handelViewAllClick = () => {
    this.props.action
      .searchExpandScopeDocsList(
        this.state.searchValue,
        this.props.pageNumber + 1,
        false,
        false,
        this.props.advanceSearchForm
      )
      .then(listLength => {
        this.props.setViewButton(false);
        this.setState(
          {
            /* viewButton: false */
          },
          () => {
            if (listLength < 10) {
              this.setState({ allLoaded: true });
            }
          }
        );
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: "ant-error"
        });
      });
  };

  handleScroll = value => {
    if (
      !this.state.allLoaded &&
      value.topPosition &&
      value.containerHeight + value.topPosition >= value.realHeight
    ) {
      this.props.action
        .searchExpandScopeDocsList(
          this.state.searchValue,
          this.props.pageNumber + 1,
          false,
          true,
          this.props.advanceSearchForm
        )
        .then(listLength => {
          if (listLength < 10) this.setState({ allLoaded: true });
        })
        .catch(message => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: "ant-error"
          });
        });
    }
  };

  handleViewJobs = (event, item) => {
    event.preventDefault()
    event.stopPropagation()
    if (this.state.viewJobs.includes(item.id)) {
      //User clicked on Hide Jobs
      const deleteValueAtIndex = this.state.viewJobs.indexOf(item.id);
      const updatedViewJobs = [...this.state.viewJobs];
      updatedViewJobs.splice(deleteValueAtIndex, 1)
      this.setState({ ...this.state, viewJobs: updatedViewJobs, selectedJobId: '' }, () => {
        this.props.jobs.forEach(task => {
          if (task.is_selected_from_job_list === true) {
            task.is_selected_from_job_list = false
          }
        })
        this.props.bookingCalendarActions.highlightJobTasks(this.props.jobs, [])
      })
    } else {
      //User clicked on View Jobs
      if (item.booked_jobs && item.booked_jobs.length > 0) {
        this.setState({ ...this.state, viewJobs: [...this.state.viewJobs, item.id] })
      }
    }
  }

  handleJobItemClick = (event, job) => {
    event.preventDefault();
    event.stopPropagation();
    this.setState({ ...this.state, selectedJobId: job.id })

    const updatedTaskList = [];

    const selectedTasks = this.props.jobs.filter(jobItem => jobItem.job_id === job.id)

    this.props.jobs.forEach((taskItem, index) => {
      const task = { ...taskItem }
      if (taskItem.job_id === job.id) {
        task.is_selected_from_job_list = true
      } else {
        task.is_selected_from_job_list = false
      }
      updatedTaskList.push(task)
    })

    this.props.bookingCalendarActions.highlightJobTasks(updatedTaskList, selectedTasks)
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.activeId !== this.state.activeId) {
      this.setState({ viewJobs: [], selectedJobId: '' })
    }
    if (this.state.selectedJobId !== prevState.selectedJobId) {
      this.props.bookingCalendarActions.clearTasksForDisapproval()
    }
  }

  render() {
    const dataSource =
      this.props.scopeDocs && this.props.scopeDocs.length > 0
        ? this.props.scopeDocs
        : [];

    return (
      <div
        className={
          this.props.togleSearch
            ? "col-md-3 mb-4 sf-searchbar"
            : "col-md-3 mb-4 closed sf-searchbar"
        }
      >
        <button
          onClick={this.props.handleSearchToggle}
          className="bnt-searchbar open"
        >
          <Icon type="left" />
        </button>
        <div id="stickAutoComplete" className="sf-card">
          <div className="sf-card-head">
            <div
              className="auto-search-txt search-lists"
              onClick={this.handleSearchClick}
            >
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
                getPopupContainer={() =>
                  document.getElementById("stickAutoComplete")
                }
              >
                <Input
                  className={
                    this.props.showMiniSpinner ? "list-search-spin" : ""
                  }
                  suffix={
                    !this.props.showMiniSpinner ? (
                      <Icon type="search" />
                    ) : (
                        <Spin indicator={<Icon type="loading" spin />} />
                      )
                  }
                />
              </AutoComplete>
              <div className="search-type-btn">
                {this.props.advanceSearch ? (
                  <button
                    className="normal-bnt"
                    onClick={this.props.toggleAdvanceSeacrh}
                  >
                    Basic Search
                  </button>
                ) : (
                    <button
                      className="normal-bnt"
                      onClick={this.props.toggleAdvanceSeacrh}
                    >
                      Advanced Search
                    </button>
                  )}
              </div>
            </div>
          </div>
          <div
            className={
              this.props.viewButton && this.props.scopeDocs.length >= 10
                ? "sf-search-body"
                : "sf-search-body add-height"
            }
          >
            {this.props.showScrollSpinner ? (
              <div className="search-list-spin">
                <Spin
                  indicator={
                    <Icon type="loading" style={{ fontSize: 24 }} spin />
                  }
                />
              </div>
            ) : null}
            <div
              className={
                dataSource.length > 10
                  ? "sf-card-body p-0 search-lists-bar"
                  : "sf-card-body p-0"
              }
            >
              <ScrollArea
                id="actualScrollArea"
                speed={0.8}
                smoothScrolling={true}
                className="sf-scroll"
                onScroll={value => {
                  this.handleScroll(value);
                }}
                horizontal={false}
              >
                <List
                  className="sf-service-list search-key-list"
                  itemLayout="horizontal"
                  dataSource={dataSource}
                  renderItem={(item, index) => (
                    <List.Item
                      className={
                        this.state.activeId != null
                          ? this.state.activeId === item.id
                            ? "active"
                            : "disable-lists"
                          : ""
                      }
                      onClick={() => {
                        if (item.quote_number) {
                          this.handleScopeDocClick(item.id, item.client.id, item.quote_number)
                        } else {
                          this.handleScopeDocClick(item.id, item.client.id)
                        }
                      }
                      }
                    >
                      <Link>
                        <List.Item.Meta
                          avatar={
                            // <label>{abbrivationStr(item.client.name)}</label>
                            <label>{item.created_by_initials}</label>
                          }
                          title={item.client.name}
                          description={
                            <div className="search-key-items">
                              <div className="ant-list-item-meta-description">
                                {item.quote_admin_approve_status &&
                                  item.quote_client_approve_status &&
                                  isNaN(
                                    parseInt(item.quote_admin_approve_status)
                                  ) &&
                                  isNaN(
                                    parseInt(item.quote_client_approve_status)
                                  ) ? null : item.quote_client_approve_status &&
                                    item.quote_client_approve_status.toString() ===
                                    "3" ? (
                                      <i className="ion-android-checkmark-circle check-list-item "></i>
                                    ) : item.quote_admin_approve_status &&
                                      item.quote_admin_approve_status.toString() ===
                                      "3" ? (
                                        <i className="ion-android-checkmark-circle check-list-item org-colr"></i>
                                      ) : null}
                                <span>
                                  {
                                    item
                                      && item.quote_number
                                      ? item.quote_number
                                      : item.scope_doc_code
                                  }
                                  {
                                    item.booked_jobs
                                      && item.booked_jobs[0]
                                      && item.booked_jobs[0].jobs
                                      ? <span>({item.booked_jobs[0].jobs.length} jobs)</span>
                                      : null
                                  }
                                </span>

                                <span className="quote-date">
                                  {moment(item.created_at).format(
                                    "DD MMM YYYY"
                                  )}
                                </span>

                              </div>{" "}
                              {
                                item && item.job_name ?
                                  <span className="search-keys">
                                    {"Quote Name:"}
                                    <strong>{item.job_name}</strong>
                                  </span> : <span></span>
                              }
                              {
                                item.booked_jobs && item.booked_jobs.length > 0
                                  ? (
                                    <button className="normal-bnt" id={`search_item_${item.id}`} type="button" onClick={(event) => this.handleViewJobs(event, item)}>
                                      {
                                        this.state.activeId === item.id
                                          ? (
                                            this.state.viewJobs.includes(item.id)
                                              ? "Hide Jobs"
                                              : "View Jobs"
                                          )
                                          : null
                                      }
                                    </button>
                                  )
                                  : null
                              }
                              {
                                this.state.viewJobs.includes(item.id) && item.booked_jobs && item.booked_jobs[0] && item.booked_jobs[0].jobs
                                  ? item.booked_jobs[0].jobs.map((job, jobIndex) =>
                                    <div className={this.state.selectedJobId === job.id ? "quote-job-item-selected" : "quote-job-item"} key={jobIndex}>
                                      <button onClick={(event) => this.handleJobItemClick(event, job)} className="normal-bnt">{job.job_label}</button>
                                      {/* <span style={{ marginLeft: "20px" }}>{moment(job.start_date).format("DD MMMM yyyy")}</span> */}
                                    </div>
                                  )
                                  : null
                              }
                              {this.props.advanceSearchForm &&
                                Object.keys(this.props.advanceSearchForm) &&
                                Object.keys(this.props.advanceSearchForm)
                                  .length > 0 &&
                                Object.keys(this.props.advanceSearchForm).map(
                                  key => {
                                    if (
                                      this.props.advanceSearchForm[key]
                                        .length &&
                                      this.props.advanceSearchForm[key].length >
                                      0 && key !== "client_id" && key !== "scope_doc_code"
                                      && key !== "quote_number" && key !== "created_at"
                                    ) {
                                      const optionValue = searchOptions(
                                        {}
                                      ).find(opt => opt.value === key);
                                      if (optionValue && item[key])
                                        return (
                                          <span className="search-keys">
                                            {optionValue.label}
                                            <strong>{item[key]}</strong>
                                          </span>
                                        );
                                    }
                                  }
                                )}
                            </div>
                          }
                        />
                      </Link>
                    </List.Item>
                  )}
                />
              </ScrollArea>
            </div>

            {this.props.viewButton && this.props.scopeDocs.length >= 10 ? (
              <div className="sf-card-footer d-flex align-items-end justify-content-center">
                <button className="v-all-org" onClick={this.handelViewAllClick}>
                  {Strings.view_more_scope_doc}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    scopeDocs: state.scopeDocs.scopeDocs,
    pageNumber: state.scopeDocs.currentPageNumber,
    showMiniSpinner: state.auth.showMiniSpinner,
    showScrollSpinner: state.auth.showScrollSpinner,
    advanceSearchForm: state.form.AdvanceSearch && state.form.AdvanceSearch.values,
    jobs: state.bookingCalendar.jobsList,
  };
};

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    bookingCalendarActions: bindActionCreators(bookingCalendarActions, dispatch)
  };
};

export default withRouter(
  connect(mapStateToProps, mapDispatchToprops)(ScopeDocSearch)
);
