import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { reduxForm } from "redux-form";
import * as actions from "../../../../actions/roleManagementActions";
import { handleFocus } from "../../../../utils/common";
import TaskBookingCard from "./TaskBookingCard";

class TaskContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {}

  render() {
    const {
      sites,
      account_manager_name,
      admin_name,
      onStaffClick,
    } = this.props;
    return (
      <div className="sf-card mt-4">
        <div className="sf-card-body">
          {sites &&
            sites.map((site) => (
              <>
                <div className="row">
                  <div className="col-md-9 col-sm-9">
                    <div className="data-v-row mt-3">
                      <div className="data-v-col">
                        <div className="view-text-value">
                          <label>Site Name</label>
                          <span>{site.site_name}</span>
                        </div>
                      </div>
                      <div className="data-v-col">
                        <div className="view-text-value">
                          <label>Address</label>
                          <span>{site.street_address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {site.tasks &&
                  site.tasks.map((task) => (
                    <TaskBookingCard
                      onSwmsClick={this.props.onSwmsClick}
                      task={task}
                      account_manager_name={account_manager_name}
                      admin_name={admin_name}
                      selectedSiteItem={site}
                      onStaffClick={onStaffClick}
                    />
                  ))}
              </>
            ))}
        </div>
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
    form: "TaskContainer",
    enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    },
  })
)(TaskContainer);
