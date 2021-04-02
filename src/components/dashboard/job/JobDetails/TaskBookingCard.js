import { Modal } from "antd";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { reduxForm } from "redux-form";
import * as actions from "../../../../actions/roleManagementActions";
import { Strings } from "../../../../dataProvider/localize";
import { currencyFormat, handleFocus } from "../../../../utils/common";
import { calculateEstimate } from "../../scope-doc/ViewEditScopeDoc";
import TaskFileViews from "../../job/taskFilesView";
import moment from "moment";
const task_item = {
  estimate: {
    estimate_type: "hours",
    staff: 10,
    hours: 8,
    days: 10,
    rate: 15,
  },
  file: [
    {
      file_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Amazon_Web_Services_Logo.svg/1200px-Amazon_Web_Services_Logo.svg.png",
    },
    {
      file_url: "https://cdn.iconscout.com/icon/free/png-512/gitlab-282507.png",
    },
    {
      file_url:
        "https://3bu5rt3kig1aitd5o24s5qym-wpengine.netdna-ssl.com/wp-content/uploads/2018/07/webex-meetings-logo.png",
    },
  ],
};

class TaskBookingCard extends React.Component {
  state = { viewDetails: false };
  toggleView = () => {
    this.setState({ viewDetails: !this.state.viewDetails });
  };
  componentDidMount() {}
  handleTaskFileView = (files, e) => {
    e.stopPropagation();
    if (files && files.length > 0) {
      this.setState({
        viewTaskFiles: true,
        taskFiles: files,
      });
    }
  };
  render() {
    const { viewDetails, taskFiles, viewTaskFiles } = this.state;
    const {
      task,
      account_manager_name,
      admin_name,
      selectedSiteItem,
      onStaffClick,
    } = this.props;
    let statusClass = "",
      statusLabel = "Allocated";
    if (task.task_status === 1 || task.task_status === 2) {
      statusClass = "booked";
      statusLabel = "Booked";
    } else if (task.task_status === 5) {
      statusClass = "outsrc";
      statusLabel = "outsourced";
    }
    return (
      <div
        className={"card-tsk-book position-relative " + statusClass}
        data-label={statusLabel}
        bg-color="#03a791"
      >
        <div className="sf-card mt-2 container position-relative">
          <div className="sf-card-body row tsk-book-body site-s-body">
            <div className="col-4 d-flex flex-wrap">
              <div className="view-text-value lbl-b w-100">
                <label>{task.job_task_label}</label>
              </div>
              <div className="view-text-value w-100">
                <label>Scope</label>
                <span>{task.task_name}</span>
              </div>

              <div className="view-text-value w-100">
                <label>Area</label>
                <span>{task.area_name}</span>
              </div>
              <div className="view-text-value w-100">
                <button
                  class="jc-outsource normal-bnt  mt-1"
                  onClick={this.toggleView}
                  type="button"
                >
                  View More Details
                </button>
              </div>
            </div>

            <div className="col-5 d-flex flex-wrap container border-top-0 pt-0">
              <div className="row w-100">
                <div className="view-text-value col-7">
                  <label>Quote Value</label>
                  <span>{admin_name}</span>
                </div>
                <div className="view-text-value col align-self-end">
                  <span>${task.task_amount}</span>
                </div>
              </div>
              {account_manager_name && (
                <div className="row w-100">
                  <div className="view-text-value col-7">
                    <label>Allocated Value</label>
                    <span>{account_manager_name}</span>
                  </div>
                  <div className="view-text-value col align-self-end">
                    <span>${task.outsourced_budget}</span>
                  </div>
                </div>
              )}
              {task.service_agent_name && (
                <div className="row w-100">
                  <div className="view-text-value col-7">
                    <label>Outsourced Value</label>
                    <span>{task.service_agent_name}</span>
                  </div>
                  <div className="view-text-value col align-self-end">
                    <span>${task.outsourced_budget_to_sa}</span>
                  </div>
                </div>
              )}
            </div>

            <div className="col d-flex flex-wrap justify-content-end container border-top-0 pt-0">
              <div className="row button-spc ribion-offset">
                <button
                  className="normal-bnt"
                  type="button"
                  onClick={() => onStaffClick(task, selectedSiteItem)}
                  disabled={!task.service_agent_id}
                >
                  <i class="fa fa-users"></i>
                </button>
                <button
                  class="normal-bnt"
                  type="button"
                  onClick={() => this.props.onSwmsClick(task, selectedSiteItem)}
                >
                  <i class="sficon sf-hard-hat-solid"></i>
                </button>
              </div>
              <div className="w-100 row d-flex justify-content-end button-spc border-top-0 pt-0">
                <div className="view-text-value ">
                  <label>Start Date</label>
                  <span>
                    {task.start_date &&
                      moment(task.start_date).format("Do MMM YYYY")}
                  </span>
                </div>
              </div>
              <div className="w-100 row d-flex justify-content-end button-spc border-top-0 pt-0">
                <div className="view-text-value ">
                  <label>End Date</label>
                  <span>
                    {task.end_date &&
                      moment(task.end_date).format("Do MMM YYYY")}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Details */}
          {/* estimate details tables */}
          {viewDetails ? (
            <div className="sf-card-body row d-flex tsk-book-body site-s-body">
              {task.estimate ? (
                <div className="esti-data-view col-8">
                  <label className="esti-hrs-hd">
                    {Strings.estimate_txt}
                    <span className="qunty-rate">
                      {currencyFormat(calculateEstimate(task.estimate))}
                    </span>{" "}
                    <b>
                      {task.estimate &&
                        task.estimate.estimate_type &&
                        task.estimate.estimate_type.toUpperCase()}
                    </b>
                  </label>
                  <div className="esti-table">
                    {task.estimate &&
                    task.estimate.estimate_type === "hours" ? (
                      <table className="table">
                        <tr className="est-sc-thd">
                          <th>Staff</th>
                          <th>Hours</th>
                          <th>Days</th>
                          <th>Rate</th>
                        </tr>
                        <tr>
                          <td>{task.estimate.staff}</td>
                          <td>{task.estimate.hours}</td>
                          <td>{task.estimate.days}</td>
                          <td>{currencyFormat(task.estimate.rate)}</td>
                        </tr>
                      </table>
                    ) : task.estimate &&
                      task.estimate.estimate_type === "area" ? (
                      <table className="table">
                        <tr className="est-sc-thd">
                          <th>SQM</th>
                          <th>Rate</th>
                        </tr>
                        <tr>
                          <td>{task.estimate.sqm}</td>
                          <td>{currencyFormat(task.estimate.rate)}</td>
                        </tr>
                      </table>
                    ) : task.estimate &&
                      task.estimate.estimate_type === "quant" ? (
                      <table className="table">
                        <tr className="est-sc-thd">
                          <th>Quantity</th>
                          <th>Rate</th>
                        </tr>
                        <tr>
                          <td>{task.estimate.quant}</td>
                          <td>{currencyFormat(task.estimate.rate)}</td>
                        </tr>
                      </table>
                    ) : null}
                  </div>
                </div>
              ) : null}
              {task.file && task.file.length > 0 ? (
                <div className="col d-flex justify-content-end border-top-0">
                  <div
                    className="doc-sr-img "
                    onClick={(evt) => this.handleTaskFileView(task.file, evt)}
                  >
                    {task.file.length > 1 ? (
                      task.file.length > 9 ? (
                        <span className="sl-no-img">
                          <i class="material-icons">filter_9_plus</i>
                        </span>
                      ) : (
                        <span className="sl-no-img">
                          <i class="material-icons">{`filter_${task.file.length}`}</i>
                        </span>
                      )
                    ) : null}
                    <img
                      alt="taskImage"
                      src={task.file.length > 0 ? task.file[0] : ""}
                    />
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </div>
        {/* Modal for task images */}
        <Modal
          visible={viewTaskFiles}
          className="job-img-gallery"
          zIndex="99999"
          footer={null}
          onCancel={() => this.setState({ viewTaskFiles: false })}
        >
          <TaskFileViews taskFiles={taskFiles} />
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = (state) => {};

const mapDispatchToprops = (dispatch) => {
  return {
    action: bindActionCreators(actions, dispatch),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: "TaskBookingCard",
    enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    },
  })
)(TaskBookingCard);
