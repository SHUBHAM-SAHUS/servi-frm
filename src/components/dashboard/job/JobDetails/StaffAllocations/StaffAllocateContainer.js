import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { Field, reduxForm } from "redux-form";
import { CustomDatepicker } from "../../../../common/customDatepicker";
import { CustomSelect } from "../../../../common/customSelect";
import { CustomTimePicker } from "../../../../common/customTimePicker";
import { CustomCheckbox } from "../../../../common/customCheckbox";
import { customInput } from "../../../../common/custom-input";
import { customTextarea } from "../../../../common/customTextarea";
import * as staffCalendarActions from "../../../../../actions/staffCalendarActions";
import { notification } from "antd";
import { Strings } from "../../../../../dataProvider/localize";
import moment from "moment";
class StaffAllocateContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { selectedTasks: [], state: null };
  }

  componentDidMount() {}

  selectTask = (id) => {
    const { selectedTasks } = this.state;
    const index = selectedTasks.findIndex((tsk) => tsk === id);
    if (index >= 0) {
      selectedTasks.splice(index, 1);
    } else {
      selectedTasks.push(id);
    }
    this.setState({ selectedTasks: selectedTasks });
  };
  onSubmit = (formData) => {
    const { allocate_task, staffCalendarActions, jobDetails } = this.props;
    formData.job_id = jobDetails.id;
    formData.shift_date = moment(formData.shift_date).format("YYYY-MM-DD");
    formData.yard_time = moment(formData.shift_date).format("hh:mm:ss");
    formData.site_time = moment(formData.shift_date).format("hh:mm:ss");
    formData.finish_time = moment(formData.shift_date).format("hh:mm:ss");
    formData.site_id =
      this.state.selectedTasks[0] &&
      allocate_task.find((tk) => tk.id === this.state.selectedTasks[0]) &&
      allocate_task.find((tk) => tk.id === this.state.selectedTasks[0]).site_id;
    const staffs = [];
    Object.keys(formData).forEach((key) => {
      if (key.includes("staff_") && formData[key]) {
        staffs.push(key.split("_")[1]);
      }
    });
    formData.staffs = staffs;
    formData.selected_tasks = this.state.selectedTasks;
    formData.acc_manager_user_name = this.props.jobDetails.acc_manager_user_name;
    formData.service_agent_id =
      allocate_task && allocate_task[0] && allocate_task[0].service_agent_id;
    staffCalendarActions
      .addJobShift(formData)
      .then((message) => {
        this.props.staffCalendarActions.getAllocationsInstance(jobDetails.id);

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
    console.log(formData);
  };
  render() {
    const { allocate_task, stateStaff, handleSubmit, jobDetails } = this.props;
    const { selectedTasks, state } = this.state;
    return (
      <div className="scdo-sidebar">
        <div className="sf-card sf-card-wrap">
          <div class="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h4 class="sf-sm-hd sf-pg-heading">Staff Allocation</h4>
          </div>
          <div className="sf-card-body jbdc-staff-list">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <fieldset className="form-group sf-form lsico">
                <Field
                  label={"Date"}
                  name="shift_date"
                  type="date"
                  disabledDate={this.disableDate}
                  component={CustomDatepicker}
                />
              </fieldset>
              <fieldset className="form-group sf-form">
                <Field
                  label="Yard"
                  name="yard_time"
                  component={CustomTimePicker}
                />
              </fieldset>
              <fieldset className="form-group sf-form">
                <Field
                  label="Site"
                  name="site_time"
                  component={CustomTimePicker}
                />
              </fieldset>
              <fieldset className="form-group sf-form">
                <Field
                  label="Finish"
                  name="finish_time"
                  component={CustomTimePicker}
                />
              </fieldset>
              <div className="text-left mb-2 staff-lists-datas sf-form">
                <label className="mb-2">Allocate Task</label>
                <div className="whiteback-staff sf-card allocate-staff-list">
                  <ul className="check-icon dash-stafflist">
                    {allocate_task.map((item) => {
                      return (
                        <li
                          key={item.id}
                          onClick={() => this.selectTask(item.id)}
                        >
                          {item.job_task_label}
                          {selectedTasks.includes(item.id) && (
                            <i className="fa fa-check" aria-hidden="true"></i>
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
              <div className="data-v-col">
                <div className="view-text-value">
                  <label>{"Allocated Manager"}</label>
                  <span>{jobDetails.account_manager_name}</span>
                </div>
              </div>
              <div className="data-v-col">
                <div className="view-text-value">
                  <label>{"Service Agent"}</label>
                  <span>
                    {allocate_task &&
                      allocate_task[0] &&
                      allocate_task[0].service_agent_name}
                  </span>
                </div>
              </div>
              <div className="whiteback-staff sf-card allocate-staff-list">
                <fieldset className="form-group sf-form">
                  <Field
                    label="Staff's State"
                    name="state_id"
                    component={CustomSelect}
                    options={stateStaff.map((state) => ({
                      title: state.name,
                      value: state.id,
                    }))}
                    onChange={(evt) => this.setState({ state: evt })}
                  />
                </fieldset>
                <fieldset className="form-group sf-form">
                  <Field
                    label="Allocated Site Supervisor"
                    name="site_supervisor_id"
                    component={CustomSelect}
                    options={
                      state &&
                      stateStaff.find((sta) => sta.id === state) &&
                      stateStaff
                        .find((sta) => sta.id === state)
                        .site_spervisors.map((supe) => ({
                          title: supe.first_name,
                          value: supe.user_name,
                        }))
                    }
                  />
                </fieldset>

                <fieldset className=" sf-form">
                  <label>Allocated Staff</label>
                </fieldset>
                <div
                  name="StaffList"
                  className="sf-roles-group d-flex flex-wrap staff-list"
                >
                  {state &&
                    stateStaff.find((sta) => sta.id === state) &&
                    stateStaff
                      .find((sta) => sta.id === state)
                      .staffs.map((staff) => (
                        <Field
                          label={
                            <label
                              className={
                                staff.staff_status === 1
                                  ? "green-uline"
                                  : staff.staff_status === 2
                                  ? "red-uline"
                                  : staff.staff_status === 3
                                  ? "purple-uline"
                                  : staff.staff_status === 4
                                  ? "blue-uline"
                                  : ""
                              }
                            >
                              {staff.first_name}
                            </label>
                          }
                          // disabled={staff.staff_status>0}
                          name={"staff_" + staff.user_name}
                          component={CustomCheckbox}
                        />
                      ))}
                </div>
              </div>
              <div className="site-s-body mt-2 pl-0">
                <div className="view-text-value pl-0 mt-1 mb-1">
                  <span>
                    <label className="green-uline">Green Underline: </label>
                    Staff allocated to this job
                  </span>
                  <span>
                    <label className="red-uline">Red Underline: </label>Staff
                    Unavailable
                  </span>
                  <span>
                    <label className="purple-uline">Purple Underline: </label>
                    Staff working night shift
                  </span>
                  <span>
                    <label className="blue-uline">Blue Underline: </label>
                    Staff allocated to other job
                  </span>
                </div>
              </div>
              <fieldset className="form-group sf-form">
                <Field
                  label="Vehicles"
                  name="vehicles"
                  type="text"
                  component={customInput}
                />
              </fieldset>
              <fieldset className="form-group sf-form">
                <Field
                  label="Shift instructions"
                  name="shift_instructions"
                  component={customTextarea}
                />
              </fieldset>
              <button type="submit" className="bnt bnt-active">
                Allocate
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    siteSupervisor: state.staffCalendar.siteSupervisor,
    stateStaff: state.staffCalendar.stateStaff,
    jobDetails: state.jobManagement.taskJobDetails,
  };
};

const mapDispatchToprops = (dispatch) => {
  return {
    staffCalendarActions: bindActionCreators(staffCalendarActions, dispatch),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: "StaffAllocateContainer",
    enableReinitialize: true,
  })
)(StaffAllocateContainer);
