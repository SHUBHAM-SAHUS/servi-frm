import { Modal, notification, Radio } from "antd";
import RadioGroup from "antd/lib/radio/group";
import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { Field, reduxForm } from "redux-form";
import * as actions from "../../../../../actions/staffCalendarActions";
import { CustomCheckbox } from "../../../../common/customCheckbox";
import moment from "moment";
import { Strings } from "../../../../../dataProvider/localize";
import TaskFileViews from "../../taskFilesView";

class AllocationInstance extends React.Component {
  constructor(props) {
    super(props);
    this.state = { viewTaskFiles: false, licences: [] };
  }

  componentDidMount() {}

  onSubmit = (formData) => {
    const { inst } = this.props;
    console.log("Allocate Inst", formData);
    let data = [{ id: inst.id }];
    let staff = [];
    Object.keys(formData).forEach((key) => {
      if (formData[key] && key.includes("staff_")) {
        const uname = key.split("_")[1];
        const location = Object.keys(formData).find((k) =>
          k.includes(uname + "_")
        );
        if (formData[location] && location) {
          let loc = location.split("_")[1];
          staff.push({ user_name: uname, start_time_type: loc });
        }
      }
    });
    data[0].staff = staff;
    this.props.action
      .sendNotification({ job_schedule: data })
      .then((message) => {
        this.props.action.getAllocationsInstance(inst.job_id);
        notification.success({
          message: Strings.success_title,
          description: message ? message : Strings.generic_error,
          onClick: () => {},
          className: "ant-success",
        });
      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => {},
          className: "ant-error",
        });
      });
  };

  viewLicences = (lics) => {
    this.setState({
      licences: lics && lics.map((li) => li.image),
      viewTaskFiles: true,
    });
  };

  updateAlloc = () => {
    const { inst, allTasks, onStaffClick } = this.props;
    const task = allTasks.find(
      (tsk) => inst.tasks && inst.tasks[0] && tsk.id === inst.tasks[0].id
    );
    if (task) {
      onStaffClick(task, inst);
    }
  };

  render() {
    const { inst, handleSubmit } = this.props;
    const { viewTaskFiles, licences } = this.state;
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        <div className="sf-card mt-2 container position-relative">
          <div className="sf-card-body">
            <div className="sf-card-body row tsk-book-body site-s-body flex-nowrap">
              <div className="view-text-value lbl-b  ">
                <i class="material-icons">date_range</i>
                <label> Date</label>
                <span>
                  {inst.shift_date &&
                    moment(inst.shift_date).format("MM-DD-YYYY")}
                </span>
              </div>
              <div className="view-text-value lbl-b ">
                <i class="material-icons">schedule</i>
                <label> Yard</label>
                <span>{inst.yard_time}</span>
              </div>
              <div className="view-text-value lbl-b  ">
                <i class="material-icons">schedule</i>
                <label> Site</label>
                <span>{inst.site_time}</span>
              </div>
              <div className="view-text-value lbl-b  ">
                <i class="material-icons">schedule</i>
                <label> Finish</label>
                <span>{inst.finish_time}</span>
              </div>

              <div className="view-text-value lbl-b ">
                <label> Allocated Tasks :</label>
              </div>
              <div class="sf-card-inn-bg scop-inn-bg d-flex flex-wrap view-text-value">
                {inst.tasks &&
                  inst.tasks.map((tsk) => (
                    <span className="mr-3"> {tsk.job_task_label} </span>
                  ))}
              </div>
            </div>
            <div className="row tsk-book-body site-s-body flex-nowrap ">
              <div class="sf-c-table ">
                <div class="tr">
                  <span class="th"></span>
                  <span class="th">Position</span>
                  <span class="th">Name</span>
                  <span class="th">Phone number</span>
                  <span class="th">Yard</span>
                  <span class="th">Site</span>
                  <span class="th">Allocation</span>
                  <span class="th">Sign In</span>
                  <span class="th">SWMS</span>
                  <span class="th">Report</span>
                  <span class="th">Update</span>
                  <span class="th">Sign Out</span>
                  <span class="th">Lisences</span>
                  <span class="th">induction</span>
                </div>
                {inst.staffs &&
                  inst.staffs.map((staff) => (
                    <>
                      <div class="tr">
                        <span class="td">
                          <Field
                            component={CustomCheckbox}
                            name={`staff_${staff.user_name}`}
                          />
                        </span>
                        <span class="td">{staff.role_name}</span>
                        <span class="td">{staff.staff_name}</span>
                        <span class="td">{staff.phone_number}</span>
                        <span class="td">
                          <Field
                            name={`${staff.user_name}_yard`}
                            component={CustomCheckbox}
                          />
                        </span>
                        <span class="td">
                          <Field
                            name={`${staff.user_name}_site`}
                            component={CustomCheckbox}
                          />
                        </span>
                        <span class="td">
                          <span
                            className={
                              "dot " +
                              (staff.job_shift_accept_status === 1
                                ? "bg-org"
                                : staff.job_shift_accept_status === 2
                                ? "bg-green"
                                : staff.job_shift_accept_status === 1
                                ? "bg-red"
                                : "")
                            }
                          />
                        </span>
                        <span class="td">
                          <span
                            className={
                              "dot " +
                              (staff.shift_sign_in_and_sign_out === 1
                                ? "bg-green"
                                : "")
                            }
                          />
                        </span>
                        <span class="td">
                          <span
                            className={
                              "dot " +
                              (staff.swms_completed === 1 ? "bg-green" : "")
                            }
                          />
                        </span>
                        <span class="td">
                          <span
                            className={
                              "dot " +
                              (staff.report_completed === 1 ? "bg-green" : "")
                            }
                          />
                        </span>
                        <span class="td">
                          <span
                            className={
                              "dot " +
                              (staff.shift_updated === 1 ? "bg-green" : "")
                            }
                          />
                        </span>
                        <span class="td">
                          <span
                            className={
                              "dot " +
                              (staff.shift_sign_in_and_sign_out === 2
                                ? "bg-green"
                                : "")
                            }
                          />
                        </span>
                        <span class="td">
                          <button
                            class="delete-bnt profle-view-bnt"
                            type="button"
                            onClick={() => this.viewLicences(staff.licences)}
                          >
                            <i class="material-icons">visibility</i>
                          </button>
                        </span>
                        <span class="td">
                          <button
                            class="delete-bnt profle-view-bnt"
                            type="button"
                          >
                            <i class="material-icons">visibility</i>
                          </button>
                        </span>
                      </div>
                    </>
                  ))}
              </div>
            </div>
            <div className=" row tsk-book-body site-s-body">
              <div className="view-text-value">
                <label>Vehicles</label>
                <span>{inst.vehicles}</span>
              </div>
              <div className="view-text-value">
                <label>Shift Instructions </label>
                <span>{inst.shift_instructions}</span>
              </div>
            </div>
            <div class="all-btn d-flex justify-content-end mt-4 sc-doc-bnt sm-bnt">
              <div class="btn-hs-icon">
                <button
                  type="button"
                  class="bnt bnt-normal"
                  onClick={this.updateAlloc}
                >
                  Update Allocation
                </button>
              </div>
              <div class="btn-hs-icon">
                <button type="submit" class="bnt bnt-active">
                  Send Notification
                </button>
              </div>
            </div>
          </div>
          <Modal
            visible={viewTaskFiles}
            className="job-img-gallery"
            zIndex="99999"
            footer={null}
            onCancel={() => this.setState({ viewTaskFiles: false })}
          >
            <TaskFileViews taskFiles={licences} />
          </Modal>
        </div>
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    allocateInstances: state.staffCalendar.allocateInstances,
  };
};

const mapDispatchToprops = (dispatch) => {
  return {
    action: bindActionCreators(actions, dispatch),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    enableReinitialize: true,
  })
)(AllocationInstance);
