import React from "react";
import { connect } from "react-redux";
import { bindActionCreators, compose } from "redux";
import { reduxForm } from "redux-form";
import * as actions from "../../../../actions/quoteAction";
import { handleFocus } from "../../../../utils/common";
import LinksHeader from "./LinksHeader";
import ClientDetails from "./ClientDetails";
import JobDetails from "./JobDetails";
import TaskContainer from "./TaskContainer";
import AreaSWMSUpdate from "../../scope-doc/SWMS/AreaSWMSUpdate";
import * as jobAction from "../../../../actions/jobAction";
import * as swmsAction from "../../../../actions/SWMSAction";
import * as consequncesAction from "../../../../actions/consequenceBeforeActions";
import * as likelyHoodAction from "../../../../actions/likelyhoodBeforeControlAction";
import * as staffCalendarActions from "../../../../actions/staffCalendarActions";
import StaffAllocateContainer from "./StaffAllocations/StaffAllocateContainer";
import AllocationsContainer from "./StaffAllocations/AllocationsContainer";

class JobDetailsContainer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSiteTaskSWMS: {},
      selectedSiteItem: {},
      allocate_task: [],
      selectedAllocate: {},
    };
  }

  componentDidMount() {
    const { jobDetails } = this.props;
    this.props.swmsAction.getJobSWMSByOrgIdAndJobId(
      jobDetails.org_id,
      jobDetails.id
    );
    this.props.swmsAction.getSWMSByTask(jobDetails.scope_doc_id, jobDetails.id);
    this.props.swmsAction.getToolbox();
    this.props.swmsAction.getSWMSControl();
    this.props.likelyHoodAction.initLikelyhoodBeforeControl();
    this.props.consequncesAction.initConsequenceBefore();
  }

  getAllTasks = (props) => {
    let allTasks = [];
    let sites =
      props && props.jobDetails && props.jobDetails.sites
        ? props.jobDetails.sites
        : this.props.jobDetails.sites;
    sites &&
      sites.forEach((site) => {
        allTasks = [
          ...allTasks,
          ...site.tasks.map((tsk) => ({
            ...tsk,
            task_label: tsk.job_task_label,
          })),
        ];
      });
    return allTasks;
  };
  onSwmsClick = (taskItem, selectedSiteItem) => {
    const { jobDetails } = this.props;
    this.props.swmsAction.getSWMSByTask(jobDetails.scope_doc_id, jobDetails.id);
    this.setState({
      showSWMS: true,
      allTasks: this.getAllTasks(),
      selectedSiteTaskSWMS: taskItem,
      selectedSiteItem: selectedSiteItem,
      showStaff: false,
    });
  };
  onStaffClick = (task, selectedAllocate) => {
    const allocate_task = [];
    const { jobDetails, staffCalendarActions } = this.props;
    staffCalendarActions.getSAStaff(task.service_agent_id);
    jobDetails &&
      jobDetails.sites &&
      jobDetails.sites.forEach((site) => {
        site.tasks &&
          site.tasks.forEach((tsk) =>
            tsk.service_agent_id === task.service_agent_id
              ? allocate_task.push(tsk)
              : false
          );
      });
    this.setState({
      showSWMS: false,
      showStaff: true,
      allocate_task,
      selectedAllocate,
    });
  };
  render() {
    const { jobDetails, action, jobAction } = this.props;
    const {
      selectedSiteTaskSWMS,
      selectedSiteItem,
      allTasks,
      allocate_task,
      selectedAllocate,
    } = this.state;
    return (
      <div className="sf-page-layout">
        {this.state.uploadLoader ? this.profileLoaderView : null}
        {/* inner header  */}
        <LinksHeader {...this.props} />
        {/* inner header  */}
        {/* ======= For:: Job Details View and Edit ::  ======== */}
        <div className="main-container">
          <div className="row">
            <div className="col-md-9 job-reports-wrap">
              <div className="sf-card-wrap">
                <ClientDetails
                  jobDetails={jobDetails}
                  clientAcceptanceMannual={action.clientAcceptanceMannual}
                  getTaskJobDetails={jobAction.getTaskJobDetails}
                />
                <JobDetails jobDetails={jobDetails} />
                <TaskContainer
                  onSwmsClick={this.onSwmsClick}
                  sites={jobDetails.sites}
                  account_manager_name={jobDetails.account_manager_name}
                  admin_name={jobDetails.admin_name}
                  onStaffClick={this.onStaffClick}
                />
                <AllocationsContainer
                  jobDetails={jobDetails}
                  allTasks={this.getAllTasks()}
                  onStaffClick={this.onStaffClick}
                />
              </div>
            </div>

            {/* RHS panel */}
            {this.state.showSWMS && (
              <div className="col-lg-3 col-md-12 swms-dymic-w">
                <AreaSWMSUpdate
                  selectedSiteTaskSWMS={selectedSiteTaskSWMS}
                  selectedSiteItem={selectedSiteItem}
                  allTasks={allTasks}
                  selectedSWMSId={selectedSiteTaskSWMS.id}
                  handleCancel={this.handleCancel}
                  job_id={jobDetails.id}
                />
              </div>
            )}
            {this.state.showStaff && (
              <div className="col-lg-3 col-md-12 swms-dymic-w">
                <StaffAllocateContainer
                  allocate_task={allocate_task}
                  initialValues={selectedAllocate}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    jobDetails: state.jobManagement.taskJobDetails,
  };
};

const mapDispatchToprops = (dispatch) => {
  return {
    action: bindActionCreators(actions, dispatch),
    jobAction: bindActionCreators(jobAction, dispatch),
    swmsAction: bindActionCreators(swmsAction, dispatch),
    likelyHoodAction: bindActionCreators(likelyHoodAction, dispatch),
    consequncesAction: bindActionCreators(consequncesAction, dispatch),
    staffCalendarActions: bindActionCreators(staffCalendarActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToprops
)(JobDetailsContainer);
