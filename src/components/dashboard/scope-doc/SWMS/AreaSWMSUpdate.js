import React from "react";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import {
  Icon,
  Collapse,
  Modal,
  message,
  Checkbox,
  notification,
  Popover,
} from "antd";
import { Strings } from "../../../../dataProvider/localize";
import { CustomCheckbox } from "../../../common/customCheckbox";
import { validate } from "../../../../utils/Validations/scopeDocValidation";
import $ from "jquery";
import ScrollArea from "react-scrollbar";
import * as actions from "../../../../actions/SWMSAction";
import * as scopeDocAction from "../../../../actions/scopeDocActions";
import { handleFocus, DeepTrim } from "../../../../utils/common";
import { viewDefaults } from "../../SWMSManagement/ViewEditSWMSActivity";
import AddSWMSForm from "./AddSWMSForm";
import AddPPEForm from "./AddPPEForm";
import AddToolTypeForm from "./AddToolTypeForm";
import AddHRWForm from "./AddHRWForm";
import AddChemicalForm from "./AddChemicalForm";
import moment from "moment";
const Panel = Collapse.Panel;

class AreaSWMSUpdate extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showAddSWMS: "none",
      showAddChem: "none",
      showAddPPE: "none",
      showAddTool: "none",
      showHRW: "none",
    };
  }

  onSubmit = async (task) => {
    // formData = await DeepTrim(formData);

    var { taskSWMS, selectedScopeDoc, job_id } = this.props;
    this.props.action
      .addSWMStoTask({
        swms_document: JSON.stringify(taskSWMS),
        scope_docs_id: selectedScopeDoc.id,
        job_id: job_id,
      })
      .then((message) => {
        this.props.scopeDocAction.getScopeDoc();
        notification.success({
          message: Strings.success_title,
          description: message,
          onClick: () => {},
          className: "ant-success",
        });
        // this.props.handleCancel();
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

  handleCancel = () => {
    this.setState({ showAddSWMS: "none" });
  };

  handleAddSWMS = () => {
    this.setState({ showAddSWMS: "block" });
  };

  handlePPECancel = () => {
    this.setState({ showAddPPE: "none" });
  };

  handleAddPPE = () => {
    this.setState({ showAddPPE: "block" });
  };

  handleChemCancel = () => {
    this.setState({ showAddChem: "none" });
  };

  handleAddChem = () => {
    this.setState({ showAddChem: "block" });
  };

  handleToolCancel = () => {
    this.setState({ showAddTool: "none" });
  };

  handleAddTool = () => {
    this.setState({ showAddTool: "block" });
  };

  handleHRWCancel = () => {
    this.setState({ showHRW: "none" });
  };

  handleAddHRW = () => {
    this.setState({ showHRW: "block" });
  };

  componentDidUpdate() {
    $(document).ready(function () {
      $(window).bind("scroll", function () {
        var navHeight =
          $("header.ant-layout-header").height() +
          $(".dash-header").height() +
          10;
        var windowHeight = $(window).height() - 15;
        var swmsMainDivW = $(".swms-dymic-w").width();
        if ($(window).scrollTop() > navHeight) {
          $(".scdo-sidebar").addClass("fixed");
          $(".scdo-sidebar").css("width", swmsMainDivW);
          $(".scdo-sidebar.fixed .scrollarea.sf-scroll").css(
            "max-height",
            windowHeight
          );
        } else {
          $(".scdo-sidebar").removeClass("fixed");
          $(".scdo-sidebar").css("width", "auto");
          $(".scdo-sidebar .scrollarea.sf-scroll").css("max-height", "none");
        }
      });
    });
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.selectedScopeDoc.id !== this.props.selectedScopeDoc.id) {
      this.props.destroy("areaSWMSUpdate");
    }
    return true;
  }

  checkDefaults = (defaults) => {
    var defaultArr;
    try {
      defaultArr = JSON.parse(defaults);
    } catch (err) {
      return;
    }
    defaultArr.forEach((def) => {
      switch (def.split("|")[0]) {
        case "ppes":
          this.onCheckChange(def.split("|")[1], true, "ppe_id");
          break;
        case "tools":
          this.onCheckChange(def.split("|")[1], true, "tool_id");
          break;
        case "high_risk_works":
          this.onCheckChange(def.split("|")[1], true, "high_risk_work_id");
          break;
        case "sds":
          this.onCheckChange(def.split("|")[1], true, "sds_id");
          break;
        default:
          break;
      }
    });
  };

  checkCategory = (id, checked) => {
    var swmsArray =
      this.props.orgSWMS &&
      this.props.orgSWMS.swms &&
      this.props.orgSWMS.swms.filter((swm) => swm.swms_category_id == id);
    if (swmsArray && swmsArray.length > 0) {
      swmsArray.forEach((swm) => {
        this.onCheckChange(swm.id, checked, "swms_id", swm.defaults);
      });
    }
  };

  onCheckChange = (id, checked, docString, defaults) => {
    var {
      formValues,
      taskSWMS,
      selectedSiteTaskSWMS,
      selectedSiteItem,
    } = this.props;
    if (docString === "category_id") {
      this.checkCategory(id, checked);
    }

    if (checked && defaults) {
      this.checkDefaults(defaults);
    }

    ["site_id", "task_id"].forEach((swmsMapKey, index) => {
      let areaSWMSIndex;
      let key;
      if (index === 0) {
        areaSWMSIndex = taskSWMS.findIndex(
          (area) => area.site_id == selectedSiteItem.site_id
        );
        key = selectedSiteItem.site_id;
      } else if (index === 1) {
        areaSWMSIndex = taskSWMS.findIndex(
          (area) => area.task_id == selectedSiteTaskSWMS.id
        );
        key = selectedSiteTaskSWMS.id;
      }

      if (checked) {
        if (areaSWMSIndex !== -1) {
          if (taskSWMS[areaSWMSIndex][docString]) {
            if (!taskSWMS[areaSWMSIndex][docString].includes(id.toString()))
              taskSWMS[areaSWMSIndex][docString].push(id.toString());
          } else {
            taskSWMS[areaSWMSIndex][docString] = [];
            taskSWMS[areaSWMSIndex][docString].push(id.toString());
          }
        } else if (areaSWMSIndex === -1 && swmsMapKey) {
          var taskSwmsObj = {
            ppe_id: [],
            swms_id: [],
            tool_id: [],
            high_risk_work_id: [],
            sds_id: [],
            category_id: [],
            tool_box_talk_id: [],
          };
          taskSwmsObj[swmsMapKey] = key;
          taskSwmsObj[docString].push(id.toString());
          taskSWMS.push(taskSwmsObj);
        }
      } else {
        if (docString === "swms_id") {
          const activity =
            this.props.orgSWMS &&
            this.props.orgSWMS.swms &&
            this.props.orgSWMS.swms.find((swm) => swm.id == id);
          if (activity) {
            const catIndex = taskSWMS[areaSWMSIndex]["category_id"].findIndex(
              (act) => act == activity.swms_category_id
            );
            if (catIndex !== -1) {
              taskSWMS[areaSWMSIndex]["category_id"].splice(catIndex, 1);
            }
          }
        }

        if (
          areaSWMSIndex !== -1 &&
          taskSWMS[areaSWMSIndex][docString].includes(id.toString())
        ) {
          var swmsIndex = taskSWMS[areaSWMSIndex][docString].findIndex(
            (swm) => swm === id.toString()
          );
          if (swmsIndex !== -1) {
            taskSWMS[areaSWMSIndex][docString].splice(swmsIndex, 1);
          }
        }
      }
    });

    if (
      selectedSiteTaskSWMS &&
      selectedSiteTaskSWMS.areas &&
      selectedSiteTaskSWMS.areas.length > 0
    ) {
      selectedSiteTaskSWMS.areas.forEach((are) => {
        let areaSWMSIndex = taskSWMS.findIndex(
          (area) => area.area_id == are.id
        );
        let swmsMapKey = "area_id";
        let key = are.id;

        if (checked) {
          if (areaSWMSIndex !== -1) {
            if (taskSWMS[areaSWMSIndex][docString]) {
              if (!taskSWMS[areaSWMSIndex][docString].includes(id.toString()))
                taskSWMS[areaSWMSIndex][docString].push(id.toString());
            } else {
              taskSWMS[areaSWMSIndex][docString] = [];
              taskSWMS[areaSWMSIndex][docString].push(id.toString());
            }
          } else if (areaSWMSIndex === -1 && swmsMapKey) {
            var taskSwmsObj = {
              ppe_id: [],
              swms_id: [],
              tool_id: [],
              high_risk_work_id: [],
              sds_id: [],
              category_id: [],
              tool_box_talk_id: [],
            };
            taskSwmsObj[swmsMapKey] = key;
            taskSwmsObj[docString].push(id.toString());
            taskSWMS.push(taskSwmsObj);
          }
        } else {
          if (docString === "swms_id") {
            const activity =
              this.props.orgSWMS &&
              this.props.orgSWMS.swms &&
              this.props.orgSWMS.swms.find((swm) => swm.id == id);
            if (activity) {
              const catIndex = taskSWMS[areaSWMSIndex]["category_id"].findIndex(
                (act) => act == activity.swms_category_id
              );
              if (catIndex !== -1) {
                taskSWMS[areaSWMSIndex]["category_id"].splice(catIndex, 1);
              }
            }
          }

          if (
            areaSWMSIndex !== -1 &&
            taskSWMS[areaSWMSIndex][docString].includes(id.toString())
          ) {
            var swmsIndex = taskSWMS[areaSWMSIndex][docString].findIndex(
              (swm) => swm === id.toString()
            );
            if (swmsIndex !== -1) {
              taskSWMS[areaSWMSIndex][docString].splice(swmsIndex, 1);
            }
          }
        }
      });
    }

    /* Object.keys(formValues).forEach(key => {
      if (formValues[key]) {
        var areaSWMSIndex
        var swmsMapKey
        switch (key.split("_")[0]) {
          case "site":
            areaSWMSIndex = taskSWMS.findIndex(area => area.site_id == key.split("_")[1])
            swmsMapKey = "site_id"
            break;
          case "task":
            areaSWMSIndex = taskSWMS.findIndex(area => area.task_id == key.split("_")[1])
            swmsMapKey = "task_id"
            break;
          case "area":
            areaSWMSIndex = taskSWMS.findIndex(area => area.area_id == key.split("_")[1])
            swmsMapKey = "area_id"
            break;
          default:
            areaSWMSIndex = -1
            break;

        }
        if (checked) {
          if (areaSWMSIndex !== -1) {
            if (taskSWMS[areaSWMSIndex][docString]) {
              if (!taskSWMS[areaSWMSIndex][docString].includes(id.toString()))
                taskSWMS[areaSWMSIndex][docString].push(id.toString())
            }
            else {
              taskSWMS[areaSWMSIndex][docString] = [];
              taskSWMS[areaSWMSIndex][docString].push(id.toString())
            }
          }
          else if (areaSWMSIndex === -1 && swmsMapKey) {
            var taskSwmsObj = {
              ppe_id: [], swms_id: [], tool_id: [], high_risk_work_id: []
              , sds_id: [], category_id: [], tool_box_talk_id: []
            };
            taskSwmsObj[swmsMapKey] = key.split("_")[1];
            taskSwmsObj[docString].push(id.toString());
            taskSWMS.push(taskSwmsObj);
          }
        }
        else {


          if (docString === "swms_id") {
            const activity = this.props.orgSWMS && this.props.orgSWMS.swms &&
              this.props.orgSWMS.swms.find(swm => swm.id == id);
            if (activity) {
              const catIndex = taskSWMS[areaSWMSIndex]["category_id"].findIndex(act => act == activity.swms_category_id)
              if (catIndex !== -1) {
                taskSWMS[areaSWMSIndex]["category_id"].splice(catIndex, 1);
              }
            }
          }


          if (areaSWMSIndex !== -1 && taskSWMS[areaSWMSIndex][docString].includes(id.toString())) {
            var swmsIndex = taskSWMS[areaSWMSIndex][docString].findIndex(swm => swm === id.toString());
            if (swmsIndex !== -1) {
              taskSWMS[areaSWMSIndex][docString].splice(swmsIndex, 1);
            }
          }
        }
      }
    }); */
    this.props.action.changeTaskSWMS(taskSWMS).then((flag) => {
      this.setState({});
    });
  };

  evaluateSelections = (formValues, taskSWMS) => {
    var selectedSwms = [],
      selectedPPE = [],
      selectedTool = [],
      selectedHRW = [],
      selectedSDS = [],
      selectedCat = [],
      selectedToolBOx = [];

    let areaSWMSIndex = taskSWMS.findIndex(
      (area) => area.task_id == this.props.selectedSiteTaskSWMS.id
    );

    if (areaSWMSIndex !== -1) {
      selectedSwms = [
        ...selectedSwms,
        taskSWMS[areaSWMSIndex].swms_id ? taskSWMS[areaSWMSIndex].swms_id : [],
      ];
      selectedPPE = [
        ...selectedPPE,
        taskSWMS[areaSWMSIndex].ppe_id ? taskSWMS[areaSWMSIndex].ppe_id : [],
      ];
      selectedTool = [
        ...selectedTool,
        taskSWMS[areaSWMSIndex].tool_id ? taskSWMS[areaSWMSIndex].tool_id : [],
      ];
      selectedHRW = [
        ...selectedHRW,
        taskSWMS[areaSWMSIndex].high_risk_work_id
          ? taskSWMS[areaSWMSIndex].high_risk_work_id
          : [],
      ];
      selectedSDS = [
        ...selectedSDS,
        taskSWMS[areaSWMSIndex].sds_id ? taskSWMS[areaSWMSIndex].sds_id : [],
      ];
      selectedCat = [
        ...selectedCat,
        taskSWMS[areaSWMSIndex].category_id
          ? taskSWMS[areaSWMSIndex].category_id
          : [],
      ];
      selectedToolBOx = [
        ...selectedToolBOx,
        taskSWMS[areaSWMSIndex].tool_box_talk_id
          ? taskSWMS[areaSWMSIndex].tool_box_talk_id
          : [],
      ];
    } else {
      selectedSwms = [...selectedSwms, []];
      selectedPPE = [...selectedPPE, []];
      selectedTool = [...selectedTool, []];
      selectedHRW = [...selectedHRW, []];
      selectedSDS = [...selectedSDS, []];
      selectedCat = [...selectedCat, []];
      selectedToolBOx = [...selectedToolBOx, []];
    }

    /* Object.keys(formValues).forEach(key => {
      if (formValues[key]) {
        var areaSWMSIndex;
        switch (key.split("_")[0]) {
          case "site":
            areaSWMSIndex = taskSWMS.findIndex(area => area.site_id == key.split("_")[1])
            break;
          case "task":
            areaSWMSIndex = taskSWMS.findIndex(area => area.task_id == key.split("_")[1])
            break;
          case "area":
            areaSWMSIndex = taskSWMS.findIndex(area => area.area_id == key.split("_")[1])
            break;
          default:
            areaSWMSIndex = -1
            break;

        }

        if (areaSWMSIndex !== -1) {
          selectedSwms = [...selectedSwms, (taskSWMS[areaSWMSIndex].swms_id ? taskSWMS[areaSWMSIndex].swms_id : [])];
          selectedPPE = [...selectedPPE, (taskSWMS[areaSWMSIndex].ppe_id ? taskSWMS[areaSWMSIndex].ppe_id : [])]
          selectedTool = [...selectedTool, (taskSWMS[areaSWMSIndex].tool_id ? taskSWMS[areaSWMSIndex].tool_id : [])];
          selectedHRW = [...selectedHRW, (taskSWMS[areaSWMSIndex].high_risk_work_id ? taskSWMS[areaSWMSIndex].high_risk_work_id : [])];
          selectedSDS = [...selectedSDS, (taskSWMS[areaSWMSIndex].sds_id ? taskSWMS[areaSWMSIndex].sds_id : [])];
          selectedCat = [...selectedCat, (taskSWMS[areaSWMSIndex].category_id ? taskSWMS[areaSWMSIndex].category_id : [])]
          selectedToolBOx = [...selectedToolBOx, (taskSWMS[areaSWMSIndex].tool_box_talk_id ? taskSWMS[areaSWMSIndex].tool_box_talk_id : [])]
        }
        else {
          selectedSwms = [...selectedSwms, []];
          selectedPPE = [...selectedPPE, []];
          selectedTool = [...selectedTool, []];
          selectedHRW = [...selectedHRW, []];
          selectedSDS = [...selectedSDS, []];
          selectedCat = [...selectedCat, []];
          selectedToolBOx = [...selectedToolBOx, []];
        }
      }

    }); */
    if (selectedSwms.length > 0)
      selectedSwms = selectedSwms.reduce((a, b) =>
        a.filter((c) => b.includes(c))
      );
    if (selectedPPE.length > 0)
      selectedPPE = selectedPPE.reduce((a, b) =>
        a.filter((c) => b.includes(c))
      );
    if (selectedTool.length > 0)
      selectedTool = selectedTool.reduce((a, b) =>
        a.filter((c) => b.includes(c))
      );
    if (selectedHRW.length > 0)
      selectedHRW = selectedHRW.reduce((a, b) =>
        a.filter((c) => b.includes(c))
      );
    if (selectedSDS.length > 0)
      selectedSDS = selectedSDS.reduce((a, b) =>
        a.filter((c) => b.includes(c))
      );
    if (selectedCat.length > 0)
      selectedCat = selectedCat.reduce((a, b) =>
        a.filter((c) => b.includes(c))
      );
    if (selectedToolBOx.length > 0)
      selectedToolBOx = selectedToolBOx.reduce((a, b) =>
        a.filter((c) => b.includes(c))
      );

    return {
      selectedSwms,
      selectedPPE,
      selectedTool,
      selectedHRW,
      selectedSDS,
      selectedCat,
      selectedToolBOx,
    };
  };
  removeDuplicates = (myArr, prop) => {
    return myArr.filter((obj, pos, arr) => {
      return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
    });
  };
  render() {
    const {
      handleSubmit,
      selectedSiteTaskSWMS,
      orgSWMS,
      formValues,
      taskSWMS,
      selectedScopeDoc,
      toolboxTalk,
      allTasks,
      selectedSWMSId,
    } = this.props;
    const selectedSwmId = selectedSWMSId && selectedSWMSId.toString();

    const {
      selectedSwms,
      selectedPPE,
      selectedTool,
      selectedHRW,
      selectedSDS,
      selectedCat,
      selectedToolBOx,
    } = this.evaluateSelections(formValues, taskSWMS);

    let taskArray = [],
      areaArray = [];
    selectedScopeDoc.sites &&
      selectedScopeDoc.sites.map((site) => {
        if (site.tasks && site.tasks.length > 0) {
          taskArray = [...taskArray, ...site.tasks];
          site.tasks.map((task) => {
            if (task.areas && task.areas.length > 0) {
              areaArray = [...areaArray, ...task.areas];
            }
          });
        }
      });
    return (
      <div className="scdo-sidebar">
        <ScrollArea
          speed={0.8}
          stopScrollPropagation={true}
          smoothScrolling={true}
          className="sf-scroll"
          horizontal={false}
        >
          <div className="sf-card">
            <Collapse
              className="sf-collps-rt doc-collapse"
              defaultActiveKey={[selectedSwmId]}
              expandIcon={({ isActive }) => (
                <Icon type="caret-down" rotate={isActive ? 180 : 0} />
              )}
              activeKey={
                this.state.expanded ? this.state.expanded : selectedSwmId
              }
              onChange={(args) => this.setState({ expanded: args })}
              accordion
            >
              {/* <Panel header={Strings.swms_txt} key="2" className="sc-doc-panel"> */}
              <div className="sf-card-body">
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{"Client"}</label>
                    <span>
                      {selectedScopeDoc &&
                        selectedScopeDoc.client &&
                        selectedScopeDoc.client.name}
                    </span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{"Contact"}</label>
                    <span>
                      {selectedScopeDoc &&
                        selectedScopeDoc.client &&
                        selectedScopeDoc.primary_contact_person}
                    </span>
                  </div>
                </div>
                <div className="data-v-col">
                  <div className="view-text-value">
                    <label>{"Job"}</label>
                    <span>
                      {selectedScopeDoc &&
                        selectedScopeDoc.client &&
                        selectedScopeDoc.job_name}
                    </span>
                  </div>
                </div>
              </div>
              {/* <form onSubmit={handleSubmit(this.onSubmit)} >
                  <div className="sf-card-body pbx-5">
                    <div className="sf-checkbox-b">
                      <div className="sf-roles-group add-sub-mod">
                        {this.removeDuplicates(taskArray, "id").map(task => <Field
                          name={"task_" + task.id}
                          label={task.task_name}
                          component={CustomCheckbox} />)
                        }
                      </div>
                    </div>
                  </div>
                </form> */}
              {/* </Panel> */}

              {/* <Panel header={"Sites"} key="1" className="sc-doc-panel">
                <form onSubmit={handleSubmit(this.onSubmit)} >
                  <div className="sf-card-body pbx-5">
                    <div className="sf-checkbox-b">
                      <div className="sf-roles-group add-sub-mod">
                        {selectedScopeDoc.sites && selectedScopeDoc.sites && selectedScopeDoc.sites.length > 0
                          && this.removeDuplicates(selectedScopeDoc.sites, "site_id").map(site =>
                            <Field
                              name={site.site && "site_" + site.site.id}
                              label={site.site && site.site.site_name}
                              component={CustomCheckbox} />)}

                      </div>
                    </div>
                  </div>
                </form>
              </Panel>


              <Panel header={Strings.area_txt} key="3" className="sc-doc-panel">
                <form onSubmit={handleSubmit(this.onSubmit)} >
                  <div className="sf-card-body pbx-5">
                    <div className="sf-checkbox-b">
                      <div className="sf-roles-group add-sub-mod">

                        {
                          this.removeDuplicates(areaArray, "id").map(area => <Field
                            name={"area_" + area.id}
                            label={area.area_name}
                            component={CustomCheckbox} />)
                        }
                      </div>
                    </div>
                  </div>
                </form>
              </Panel> */}

              {allTasks &&
                allTasks.length &&
                allTasks.map((task, index) => (
                  <Panel
                    key={task.id}
                    className="sc-doc-panel"
                    header={
                      <div className="d-flex justify-content-between scope-doc-task-header-panel align-items-center">
                        <h3 className="swms-hd">
                          <span className="rfcl-img">
                            <img src="/images/roof-cleaning.png" alt="" />
                          </span>
                          {task.task_label}
                        </h3>
                        {selectedCat.length > 0 ||
                        selectedPPE.length > 0 ||
                        selectedTool.length > 0 ||
                        selectedHRW.length > 0 ||
                        selectedToolBOx.length > 0 ? (
                          <span class="material-icons icon-task-panel">
                            check
                          </span>
                        ) : (
                          <span class="material-icons icon-task-panel">
                            clear
                          </span>
                        )}
                      </div>
                    }
                  >
                    <div className="sf-card-body">
                      {/* <div className="data-v-col">
                    <div className="view-text-value">
                      <label>{"Task #" + selectedSiteTaskSWMS && selectedSiteTaskSWMS.task_order}</label>
                    </div>
                  </div> */}
                      <div className="data-v-col">
                        <div className="view-text-value">
                          <label>{"Scheduled Date"}</label>
                          <span>
                            {task.start_date &&
                              moment(task.start_date).format("DD-MM-YYYY")}
                          </span>
                        </div>
                      </div>
                      <div className="data-v-col">
                        <div className="view-text-value">
                          <label>{"Scope"}</label>
                          <span>{task.task_name || ""}</span>
                        </div>
                      </div>

                      <div className="data-v-col">
                        <div className="view-text-value">
                          <label>{"Area"}</label>
                          <span>
                            {task.areas
                              ? task.areas.map((area) => area.area_name + ",")
                              : ""}
                          </span>
                        </div>
                      </div>

                      <div className="data-v-col">
                        <div className="view-text-value">
                          <label>{"Notes"}</label>
                          <span>{task.note}</span>
                        </div>
                      </div>

                      <Collapse
                        className="sf-collps-rt swms-collapse"
                        defaultActiveKey={[]}
                        expandIcon={({ isActive }) => (
                          <Icon type="caret-down" rotate={isActive ? 180 : 0} />
                        )}
                      >
                        <Panel
                          header={
                            selectedCat && selectedCat.length > 0 ? (
                              <>
                                SWMS Activity{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    check
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                SWMS Activity{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    cancel
                                  </span>
                                </div>
                              </>
                            )
                          }
                          key="2-0"
                          className="swms-panel"
                        >
                          <div className="swms-body">
                            <div className="swms-check-list">
                              {orgSWMS &&
                                orgSWMS.swms_cat &&
                                orgSWMS.swms_cat.map((cat) => (
                                  <>
                                    {/* <Checkbox
                                onChange={(e) => this.onCheckChange(cat.id, e.target.checked, 'category_id')} checked={
                                  selectedCat.includes(cat.id.toString())
                                }><strong className="category-head">{cat.category}</strong></Checkbox> */}
                                    <label class="customcheck">
                                      <input
                                        type="checkbox"
                                        onChange={(e) =>
                                          this.onCheckChange(
                                            cat.id,
                                            e.target.checked,
                                            "category_id"
                                          )
                                        }
                                        checked={
                                          selectedCat.includes(
                                            cat.id.toString()
                                          )
                                            ? true
                                            : false
                                        }
                                      />
                                      <span class="checkmark"></span>
                                      <strong class="category-head">
                                        {cat.category}
                                      </strong>
                                      <div class="sub-swms-act"></div>
                                    </label>
                                    <div className="sub-swms-act">
                                      {this.props.orgSWMS &&
                                        this.props.orgSWMS.swms &&
                                        this.props.orgSWMS.swms
                                          .filter(
                                            (swm) =>
                                              swm.swms_category_id == cat.id
                                          )
                                          .map((swm) => (
                                            <>
                                              {/* <label class="customcheck">
                                       <input type="checkbox" 
                                         onChange={(e) => this.onCheckChange(swm.id, e.target.checked, 'swms_id', swm.defaults)}
                             checked={
                              selectedSwms.includes(swm.id.toString()) ? true : false
                                 }
                             />
                            <span class="checkmark"></span>
                            <strong class="category-head">{swm.activity}</strong>
                            <div class="sub-swms-act"></div>
                          </label> */}
                                              <Checkbox
                                                onChange={(e) =>
                                                  this.onCheckChange(
                                                    swm.id,
                                                    e.target.checked,
                                                    "swms_id",
                                                    swm.defaults
                                                  )
                                                }
                                                checked={selectedSwms.includes(
                                                  swm.id.toString()
                                                )}
                                              >
                                                {swm.activity}
                                              </Checkbox>
                                              <Popover
                                                className="swms-popup-dtl"
                                                content={
                                                  <div className="sf-c-table org-user-table swms-view-table">
                                                    <div className="tr">
                                                      {/* <span className="th">Activity</span> */}
                                                      <span className="th">
                                                        Category
                                                      </span>
                                                      <span className="th">
                                                        Potential Hazards
                                                      </span>
                                                      {/* <span className="th">Likelihood (before controls) </span>
                                            <span className="th">Consequence (before controls)</span> */}
                                                      <span className="th">
                                                        Risk (before)
                                                      </span>
                                                      <span className="th">
                                                        Control Measures
                                                      </span>
                                                      {/* <span className="th">Likelihood (after controls) </span>
                                            <span className="th">Consequence (after controls)</span> */}
                                                      <span className="th">
                                                        Risk (after)
                                                      </span>
                                                      <span className="th">
                                                        Person Responsible
                                                      </span>
                                                      {/* <span className="th">Defaults</span>
                                            <span className="th">Active</span> */}
                                                    </div>
                                                    <div className="tr">
                                                      {/* <span className="td">{swm.activity}</span> */}
                                                      <span className="td">
                                                        {swm.swms_category_id &&
                                                          orgSWMS.swms_cat &&
                                                          orgSWMS.swms_cat.find(
                                                            (cat) =>
                                                              cat.id ==
                                                              swm.swms_category_id
                                                          ) &&
                                                          orgSWMS.swms_cat.find(
                                                            (cat) =>
                                                              cat.id ==
                                                              swm.swms_category_id
                                                          ).category}
                                                      </span>
                                                      <span className="td">
                                                        {swm.hazard}
                                                      </span>
                                                      {/* <span className="td">{swm.likelihood_before_controls}</span>
                                            <span className="td">{swm.consequence_before_controls}</span> */}
                                                      <span className="td">
                                                        {"some text"}
                                                      </span>
                                                      <span className="td">
                                                        {swm.control_measures}
                                                      </span>
                                                      {/* <span className="td">{swm.likelihood_after_controls}</span>
                                            <span className="td">{swm.consequence_after_controls}</span> */}
                                                      <span className="td">
                                                        {"Some text"}
                                                      </span>
                                                      <span className="td">
                                                        {swm.person_responsible}
                                                      </span>
                                                      {/* <span className="td">{viewDefaults(swm.defaults, orgSWMS)}</span>
                                            <span className="td">{Boolean(swm.active).toString()}</span> */}
                                                    </div>
                                                  </div>
                                                }
                                                placement="topRight"
                                                overlayClassName="swms-act-popup"
                                                title="Activity"
                                              >
                                                <strong className="swms-info-st">
                                                  <i class="material-icons">
                                                    info
                                                  </i>
                                                </strong>
                                              </Popover>
                                            </>
                                          ))}
                                    </div>
                                  </>
                                ))}
                            </div>
                            <button
                              className="normal-bnt add-line-bnt mt-3"
                              onClick={this.handleAddSWMS}
                              type="button"
                            >
                              <i class="material-icons">add</i>
                              <span>{Strings.add_new_swms_document}</span>
                            </button>
                          </div>
                          {/* --------------------------
                                Add New SWMS Document Items
                                --------------------------*/}
                          <div
                            className="sf-card add-swms-pnl"
                            style={{ display: this.state.showAddSWMS }}
                          >
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-start">
                              <h4 className="sf-sm-hd sf-pg-heading">
                                Add New SWMS Activity
                              </h4>
                              <button
                                class="closed-btn"
                                onClick={this.handleCancel}
                                type="button"
                              >
                                <Icon type="close" />
                              </button>
                            </div>
                            <div className="sf-card-body doc-update-task">
                              <AddSWMSForm close={this.handleCancel} />
                            </div>
                          </div>
                          {/* ----- End -----*/}
                        </Panel>

                        {/* <Panel header="SWMS Activity" key="2-1" className="swms-panel">
                      <div className="swms-body">
                        <div className="swms-check-list">
                          {orgSWMS && orgSWMS.swms && orgSWMS.swms.map(swm =>
                            <Checkbox
                              onChange={(e) => this.onCheckChange(swm.id, e.target.checked, 'swms_id', swm.defaults)} checked={
                                selectedSwms.includes(swm.id.toString())
                              }>{swm.activity}</Checkbox>
                          )}
                        </div>


                      </div>


                    </Panel> */}

                        <Panel
                          header={
                            selectedPPE && selectedPPE.length > 0 ? (
                              <>
                                PPE{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    check
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                PPE{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    cancel
                                  </span>
                                </div>
                              </>
                            )
                          }
                          key="2-2"
                          className="swms-panel"
                        >
                          <div className="swms-body">
                            <div className="swms-check-list">
                              {orgSWMS &&
                                orgSWMS.ppes &&
                                orgSWMS.ppes.map((ppe) => (
                                  // <Checkbox className="customcheck"
                                  //   onChange={(e) => this.onCheckChange(ppe.id, e.target.checked, 'ppe_id')}
                                  //   checked={
                                  //     selectedPPE.includes(ppe.id.toString()) ? true : false
                                  //   }><span className="dd">sdfsdfsd</span>{ppe.name}</Checkbox>
                                  <label class="customcheck">
                                    <input
                                      type="checkbox"
                                      onChange={(e) =>
                                        this.onCheckChange(
                                          ppe.id,
                                          e.target.checked,
                                          "ppe_id"
                                        )
                                      }
                                      checked={
                                        selectedPPE.includes(ppe.id.toString())
                                          ? true
                                          : false
                                      }
                                    />
                                    <span class="checkmark"></span>
                                    <strong class="category-head">
                                      {ppe.name}
                                    </strong>
                                  </label>
                                ))}
                            </div>
                            <button
                              className="normal-bnt add-line-bnt mt-3"
                              onClick={this.handleAddPPE}
                              type="button"
                            >
                              <i class="material-icons">add</i>
                              <span>Add New PPE</span>
                            </button>
                          </div>

                          {/* --------------------------
                                Add New PPE Items 
                                --------------------------*/}
                          <div
                            className="sf-card add-swms-pnl"
                            style={{ display: this.state.showAddPPE }}
                          >
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                              <h4 className="sf-sm-hd sf-pg-heading">
                                Add New PPE
                              </h4>
                              <button
                                class="closed-btn"
                                onClick={this.handlePPECancel}
                                type="button"
                              >
                                <Icon type="close" />
                              </button>
                            </div>
                            <div className="sf-card-body">
                              <AddPPEForm close={this.handlePPECancel} />
                            </div>
                          </div>
                          {/* ----- End -----*/}
                        </Panel>

                        <Panel
                          header={
                            selectedTool && selectedTool.length > 0 ? (
                              <>
                                Tool Type{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    check
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                Tool Type{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    cancel
                                  </span>
                                </div>
                              </>
                            )
                          }
                          key="2-3"
                          className="swms-panel"
                        >
                          <div className="swms-check-list">
                            {orgSWMS &&
                              orgSWMS.tools &&
                              orgSWMS.tools.map((tool) => (
                                // <Checkbox
                                //   onChange={(e) => this.onCheckChange(tool.id, e.target.checked, 'tool_id', tool.defaults)}
                                //   checked={
                                //     selectedTool.includes(tool.id.toString())
                                //   }>{tool.name}</Checkbox>

                                <label class="customcheck">
                                  <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      this.onCheckChange(
                                        tool.id,
                                        e.target.checked,
                                        "tool_id",
                                        tool.defaults
                                      )
                                    }
                                    checked={
                                      selectedTool.includes(tool.id.toString())
                                        ? true
                                        : false
                                    }
                                  />
                                  <span class="checkmark"></span>
                                  <strong class="category-head">
                                    {tool.name}
                                  </strong>
                                  <div class="sub-swms-act"></div>
                                </label>
                              ))}
                          </div>
                          <button
                            className="normal-bnt add-line-bnt mt-3"
                            onClick={this.handleAddTool}
                            type="button"
                          >
                            <i class="material-icons">add</i>
                            <span>Add New Tool Type</span>
                          </button>
                          {/* --------------------------
                                Add New Tool type Items 
                                --------------------------*/}
                          <div
                            className="sf-card add-swms-pnl"
                            style={{ display: this.state.showAddTool }}
                          >
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                              <h4 className="sf-sm-hd sf-pg-heading">
                                Add New Tool Type
                              </h4>
                              <button
                                class="closed-btn"
                                onClick={this.handleToolCancel}
                                type="button"
                              >
                                <Icon type="close" />
                              </button>
                            </div>
                            <div className="sf-card-body">
                              <AddToolTypeForm close={this.handleToolCancel} />
                            </div>
                          </div>
                          {/* ----- End -----*/}
                        </Panel>

                        <Panel
                          header={
                            selectedHRW && selectedHRW.length > 0 ? (
                              <>
                                High Risk{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    check
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                High Risk{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    cancel
                                  </span>
                                </div>
                              </>
                            )
                          }
                          key="2-4"
                          className="swms-panel"
                        >
                          <div className="swms-check-list">
                            {orgSWMS &&
                              orgSWMS.high_risk_works &&
                              orgSWMS.high_risk_works.map((hrw) => (
                                // <Checkbox
                                //   onChange={(e) => this.onCheckChange(hrw.id, e.target.checked, 'high_risk_work_id', hrw.defaults)}
                                //   checked={
                                //     selectedHRW.includes(hrw.id.toString())
                                //   }>{hrw.name}</Checkbox>
                                <label class="customcheck">
                                  <input
                                    type="checkbox"
                                    onChange={(e) =>
                                      this.onCheckChange(
                                        hrw.id,
                                        e.target.checked,
                                        "high_risk_work_id",
                                        hrw.defaults
                                      )
                                    }
                                    checked={
                                      selectedHRW.includes(hrw.id.toString())
                                        ? true
                                        : false
                                    }
                                  />
                                  <span class="checkmark"></span>
                                  <strong class="category-head">
                                    {hrw.name}
                                  </strong>
                                  <div class="sub-swms-act"></div>
                                </label>
                              ))}
                          </div>
                          <button
                            className="normal-bnt add-line-bnt mt-3"
                            onClick={this.handleAddHRW}
                            type="button"
                          >
                            <i class="material-icons">add</i>
                            <span>Add High risk work</span>
                          </button>
                          {/* --------------------------
                                Add High Risk Work Names
                                --------------------------*/}
                          <div
                            className="sf-card add-swms-pnl"
                            style={{ display: this.state.showHRW }}
                          >
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                              <h4 className="sf-sm-hd sf-pg-heading">
                                Add High risk work
                              </h4>
                              <button
                                class="closed-btn"
                                onClick={this.handleHRWCancel}
                                type="button"
                              >
                                <Icon type="close" />
                              </button>
                            </div>
                            <div className="sf-card-body">
                              <AddHRWForm close={this.handleHRWCancel} />
                            </div>
                          </div>
                          {/* ----- End -----*/}
                        </Panel>

                        {/* <Panel header="Chemicals" key="2-5" className="swms-panel">
                      <div className="swms-check-list">
                        {orgSWMS && orgSWMS.sds && orgSWMS.sds.map(sd =>
                          <Checkbox
                            onChange={(e) => this.onCheckChange(sd.id, e.target.checked, 'sds_id', sd.defaults)}
                            checked={
                              selectedSDS.includes(sd.id.toString())
                            }><div className="chemocal-dtl">
                              <div className="cheml-txt">{sd.name}<span className="exp-dt">Expiry: {sd.expiry.split('T')[0]}</span></div>
                              <a href={sd.document} target="_blank">View Document</a>
                            </div>
                          </Checkbox>
                        )}
                      </div>
                      <button className="normal-bnt add-line-bnt mt-3" onClick={this.handleAddChem} type='button'>
                        <i class="material-icons">add</i>
                        <span>Add Chemicals</span>
                      </button>
 */}
                        {/* --------------------------
                                Add New Chemical Items 
                                --------------------------*/}
                        {/* <div className="sf-card add-swms-pnl mb-0" style={{ display: this.state.showAddChem }}>
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                          <h4 className="sf-sm-hd sf-pg-heading">Add New Chemical</h4>
                          <button class="closed-btn" onClick={this.handleChemCancel} type='button'><Icon type="close" /></button>
                        </div>
                        <div className="sf-card-body">
                          <AddChemicalForm close={this.handleChemCancel} />
                        </div>
                      </div> */}
                        {/* ----- End -----*/}
                        {/*                     </Panel>
                         */}
                        <Panel
                          header={
                            selectedToolBOx && selectedToolBOx.length > 0 ? (
                              <>
                                Toolbox Talk{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    check
                                  </span>
                                </div>
                              </>
                            ) : (
                              <>
                                Toolbox Talk{" "}
                                <div className="float-right mr-4">
                                  <span class="material-icons tick-ico">
                                    cancel
                                  </span>
                                </div>
                              </>
                            )
                          }
                          key="2-6"
                          className="swms-panel"
                        >
                          <div className="swms-body">
                            <div className="swms-check-list">
                              {toolboxTalk &&
                                toolboxTalk.map((cat) => (
                                  // <Checkbox
                                  //   onChange={(e) => this.onCheckChange(cat.id, e.target.checked, 'tool_box_talk_id')} checked={
                                  //     selectedToolBOx.includes(cat.id.toString())
                                  //   }>{cat.toolbox_name}</Checkbox>
                                  <label class="customcheck">
                                    <input
                                      type="checkbox"
                                      onChange={(e) =>
                                        this.onCheckChange(
                                          cat.id,
                                          e.target.checked,
                                          "tool_box_talk_id"
                                        )
                                      }
                                      checked={
                                        selectedToolBOx.includes(
                                          cat.id.toString()
                                        )
                                          ? true
                                          : false
                                      }
                                    />
                                    <span class="checkmark"></span>
                                    <strong class="category-head">
                                      {cat.toolbox_name}
                                    </strong>
                                    <div class="sub-swms-act"></div>
                                  </label>
                                ))}
                            </div>
                          </div>
                        </Panel>
                      </Collapse>

                      <div className="sf-card-footer">
                        <div className="all-btn multibnt">
                          <div className="btn-hs-icon d-flex justify-content-between">
                            <button
                              onClick={this.props.handleCancel}
                              className="bnt bnt-normal"
                              type="button"
                            >
                              {Strings.cancel_btn}
                            </button>
                            <button
                              type="button"
                              onClick={() => this.onSubmit(task)}
                              className="bnt bnt-active"
                            >
                              {Strings.update_btn}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Panel>
                ))}
            </Collapse>
          </div>
        </ScrollArea>
      </div>
    );
  }
}

const mapStateToProps = (state, { selectedSiteTaskSWMS }) => {
  /*  var value = {}
   if (selectedSiteTaskSWMS.areas) {
     selectedSiteTaskSWMS.areas.forEach(area => {
       value[area.id] = false;
     });
   } */
  var value = state.scopeDocs.scopeDocsDetails
    ? state.scopeDocs.scopeDocsDetails[0]
    : {};

  return {
    // initialValues:  {},
    orgSWMS: state.swmsReducer.orgSWMS,
    taskSWMS: state.swmsReducer.taskSWMS,
    formValues:
      state.form.areaSWMSUpdate && state.form.areaSWMSUpdate.values
        ? state.form.areaSWMSUpdate.values
        : {},
    selectedScopeDoc: value ? value : {},
    toolboxTalk: state.swmsReducer.toolboxTalk,
    likelyhoodBeforeControls:
      state.likelyhoodBeforeControl.likelyhoodBeforeControls,
    consequenceBeforeControls:
      state.beforeConsequenceControl &&
      state.beforeConsequenceControl.consequenceBeforeControls,
    // intialValues: value
  };
};

const mapDispatchToprops = (dispatch) => {
  return {
    action: bindActionCreators(actions, dispatch),
    scopeDocAction: bindActionCreators(scopeDocAction, dispatch),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: "areaSWMSUpdate",
    validate,
    enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    },
  })
)(AreaSWMSUpdate);
