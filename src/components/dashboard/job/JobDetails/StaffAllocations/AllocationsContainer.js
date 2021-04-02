import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { Field, reduxForm } from "redux-form";
import * as actions from "../../../../../actions/staffCalendarActions";
import AllocationInstance from "./AllocationInstance";

class AllocationsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.action.getAllocationsInstance(this.props.jobDetails.id);
  }

  render() {
    const { allocateInstances, allTasks, onStaffClick } = this.props;
    return (
      <>
        {allocateInstances &&
          allocateInstances.map((inst) => (
            <AllocationInstance
              inst={inst}
              form={"AllocationInstance_" + inst.id}
              allTasks={allTasks}
              onStaffClick={onStaffClick}
            />
          ))}
      </>
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
    form: "AllocationsContainer",
    enableReinitialize: true,
  })
)(AllocationsContainer);
