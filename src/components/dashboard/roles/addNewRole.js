import React from "react";
import { Icon, Modal, Dropdown, notification, Tooltip } from "antd";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import ScrollArea from "react-scrollbar";

import { validate } from "../../../utils/Validations/roleValidation";
import { customInput } from "../../common/custom-input";
import { CustomSelect } from "../../common/customSelect";
import * as actions from "../../../actions/roleManagementActions";
import * as rolePermissionAction from "../../../actions/permissionManagementAction";
import { CustomSwitch } from "../../common/customSwitch";
import { Strings } from "../../../dataProvider/localize";
import { ADMIN_DETAILS, VALIDATE_STATUS } from "../../../dataProvider/constant";
import { CustomCheckbox } from "../../../components/common/customCheckbox";
import { getStorage, handleFocus, DeepTrim } from "../../../utils/common";
import $ from "jquery";
// import { customAutoCompleteTags } from '../../common/customAutoCompleteTags';

class AddNewRole extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: "block",
      height: 0,
      cardExpnadBtn: true,
      tags: [],
      suggestions: this.props.jobCalendarLables && this.props.jobCalendarLables.map((item) => ({ id: item.id, name: item.name }))
    };
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS))
      ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
      : null;
  }

  componentDidMount() {
    console.log(this.state.suggestions)
  }

  onSubmit = async formData => {
    formData = await DeepTrim(formData);

    formData.active = +formData.active;

    var finalFormData = new FormData();
    let access_control_id = [];
    Object.keys(formData).forEach(key => {
      if (key.includes("access_") && formData[key] === true) {
        access_control_id.push(key.replace("access_", ""));
      }
    });
    console.log("formData", formData, access_control_id);
    this.props.action
      .addRole(formData)
      .then(res => {
        if (res && res.role.id) {
          finalFormData.append("access_control_id", access_control_id);
          finalFormData.append("role_id", res.role.id);
          finalFormData.append("organisation_id", this.currentOrganization);

          this.props.rolePermissionAction
            .addRolePermission(finalFormData)
            .then(message => {
              this.props.reset();
              if (message) {
                notification.success({
                  message: Strings.success_title,
                  description: Strings.role_create_success,
                  onClick: () => { },
                  className: "ant-success"
                });
              }
            });
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
  };

  handleCancel = () => {
    this.setState({ displayEdit: "none" });
  };

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn });
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  };

  handleDelete = (i) => {
    const tags = this.state.tags.slice(0)
    tags.splice(i, 1)
    this.setState({ tags })
  }

  handleAddition = (tag) => {
    const tags = [].concat(this.state.tags, tag)
    this.setState({ tags })
  }

  render() {
    const { handleSubmit } = this.props;

    return (
      <div
        className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}
      >
        <div className="row">
          <div className="col-md-12 col-lg-8">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <div className="sf-card-wrap">
                {/* zoom button  */}
                <div className="card-expands">
                  <button
                    type="button"
                    onClick={this.handleExpand}
                    className="exapnd-bnt normal-bnt"
                  >
                    <Icon
                      type={
                        this.state.cardExpnadBtn
                          ? "fullscreen"
                          : "fullscreen-exit"
                      }
                    />
                  </button>
                </div>
                <div className="sf-card">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Role Details</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body mt-2">
                    <fieldset className="form-group sf-form">
                      <Field
                        label={Strings.role_name}
                        placeholder={Strings.role_name}
                        name="name"
                        type="text"
                        component={customInput}
                      />
                    </fieldset>
                    <fieldset className="form-group sf-form role-jb-ccld-tbl">
                      <Field
                        label={Strings.role_job_calendar_lables}
                        name="job_calendar_templates"
                        placeholder={Strings.job_calendar_templates}
                        options={
                          this.props.jobCalendarLables
                            ? this.props.jobCalendarLables.map(item => {
                              return { value: item.id, title: item.name };
                            })
                            : []
                        }
                        component={CustomSelect}
                        mode="multiple"
                      />
                    </fieldset>

                    {/* <fieldset className="form-group sf-form role-jb-ccld-tbl">
                      <Field
                        label={Strings.role_job_calendar_lables}
                        name="job_calendar_templates_tags"
                        placeholder={Strings.job_calendar_templates}
                        handleAddition={this.handleAddition}
                        handleDelete={this.handleDelete}
                        tags={this.state.tags}
                        suggestions={this.state.suggestions}
                        // options={
                        //   this.props.jobCalendarLables
                        //     ? this.props.jobCalendarLables.map(item => {
                        //       return { value: item.id, title: item.name };
                        //     })
                        //     : []
                        // }
                        component={CustomSelect}
                        mode="multiple"
                      />
                    </fieldset> */}

                    <fieldset className="form-group sf-form">
                      <Field
                        name="active"
                        id="active"
                        label={Strings.role_status}
                        component={CustomSwitch}
                      />
                    </fieldset>
                  </div>
                </div>

                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.permission}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body">
                    <ScrollArea
                      speed={0.8}
                      smoothScrolling={true}
                      className="sf-scroll"
                      horizontal={false}
                    >
                      {this.props.accessControlsByModule &&
                        this.props.accessControlsByModule.map(moduleName => {
                          return (
                            <div className="more-role-prmison sf-row-bx role-per-lists">
                              <h4>{moduleName ? moduleName.name : ""}</h4>
                              {moduleName.access_types &&
                                moduleName.access_types.map(access => (
                                  <div className="role-sub-access">
                                    <h5>{access.name}</h5>
                                    <div className="sf-chkbx-group">
                                      {access.values.length > 0
                                        ? access.values.map(access_control => {
                                          return (
                                            <Tooltip
                                              title={access_control.tooltip}
                                            >
                                              <div className="permission-items">
                                                <Field
                                                  name={
                                                    "access_" +
                                                    access_control.id
                                                  }
                                                  label={access_control.title}
                                                  component={CustomCheckbox}
                                                />
                                              </div>
                                            </Tooltip>
                                          );
                                        })
                                        : ""}
                                    </div>
                                  </div>
                                ))}
                            </div>
                          );
                        })}
                    </ScrollArea>
                  </div>
                </div>

                {/* zoom save button  */}
                <div className="row zoom-save-bnt">
                  <div className="col-md-12">
                    <div className="all-btn d-flex justify-content-end mt-4">
                      <div className="btn-hs-icon">
                        <button type="submit" className="bnt bnt-active">
                          <Icon type="save" theme="filled" /> {Strings.save_btn}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="all-btn d-flex justify-content-end mt-4">
                <div className="btn-hs-icon">
                  <button type="submit" className="bnt bnt-active">
                    <Icon type="save" theme="filled" /> {Strings.save_btn}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    roles: state.roleManagement.roles,
    jobCalendarLables: state.roleManagement.job_calendar_lables,
    accessControlsByModule:
      state.accessControlManagement.accessControlsByModule,
    initialValues: {
      active: true,
      organisation_id: JSON.parse(getStorage(ADMIN_DETAILS))
        ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
        : null,
      job_calendar_templates: []
    }
  };
};

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    rolePermissionAction: bindActionCreators(rolePermissionAction, dispatch)
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: "addNewRole",
    validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AddNewRole);
