import React from "react";
import { Radio, Checkbox, Collapse, Modal, Icon, notification, Tooltip } from "antd";
import { reduxForm, isDirty } from "redux-form";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import * as actions from "../../../actions/permissionManagementAction";
import * as organizationUserAction from "../../../actions/organizationUserAction";
import { Strings } from "../../../dataProvider/localize";
import ScrollArea from "react-scrollbar";
import { handleFocus, DeepTrim } from "../../../utils/common";

const { Panel } = Collapse;

class OrganisationUserPermissions extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      permission: [],
      roleId: this.props.roleid,
      userId: this.props.userid,
      orgId: this.props.org_id
    };
    this.handleSizeChange = this.handleSizeChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    this.props.actions.getPermissionsByAllRole();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.userid !== this.props.userid) {
      this.setState({
        roleId: this.props.roleid,
        userId: this.props.userid,
        orgId: this.props.org_id
      });
    }
  }

  handleSizeChange(event) {
    this.props.change(`isDirty`, false);
    let role_id = event.target.value;
    if (this.state.roleId.toString() !== role_id.toString()) {
      this.setState({ roleId: role_id });
    }
    let filterPermissionArray =
      this.props.permissionByAllRole &&
      this.props.permissionByAllRole.find(
        element => element.id.toString() === role_id.toString()
      );
    if (filterPermissionArray && filterPermissionArray.permissions.length) {
      this.setState({ permission: filterPermissionArray.permissions });
    } else {
      this.setState({ permission: [] });
    }
  }

  onSubmit = async formdata => {
    formdata = await DeepTrim(formdata);

    var finalFormData = new FormData();
    finalFormData.append("id", this.state.userId);
    finalFormData.append("role_id", this.state.roleId);
    finalFormData.append("org_user_name", this.props.org_user_name);
    finalFormData.append("organisation_id", this.props.org_id);
    this.props.organizationUserAction
      .updateOrganizationUser(finalFormData, this.state.orgId)
      .then(message => {
        notification.success({
          message: Strings.success_title,
          description: message,
          onClick: () => {},
          className: "ant-error"
        });
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => {},
          className: "ant-error"
        });
      });
  };

  handleCancel = () => {
    this.props.hideEditPermission();
  };

  render() {
    const { handleSubmit, displayFlag } = this.props;
    var defaultPermissionArray =
      this.props.permissionByAllRole &&
      this.props.permissionByAllRole.find(
        item => item.id.toString() === this.state.roleId.toString()
      );
    return (
      <div className="col-md-3">
        <div
          className="sf-card mb-4"
          style={{ display: displayFlag === "none" ? "none" : "block" }}
        >
          <form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h4 className="sf-xs-hd sf-pg-heading">
                {Strings.perm_card_title}
                <span className="uhd-name">
                  ({this.props.selectedUserName})
                </span>
              </h4>
            </div>

            <div className="sf-card-body">
              <div className="user-mng-chkbx">
                <div className="sf-checkbox-b">
                  <div className="sf-roles-group">
                    <Radio.Group
                      onChange={this.handleSizeChange}
                      key={this.state.roleId && this.state.roleId.toString()}
                      defaultValue={
                        this.state.roleId && this.state.roleId.toString()
                      }
                    >
                      {this.props.permissionByAllRole &&
                      this.props.permissionByAllRole.length
                        ? this.props.permissionByAllRole.map(role => {
                            return (
                              <Radio.Button
                                defaultChecked={
                                  defaultPermissionArray &&
                                  defaultPermissionArray.id
                                }
                                key={role ? role.id : ""}
                                value={role ? role.id.toString() : ""}
                              >
                                <span className="rbp-btn">
                                  {role ? role.name : ""}
                                </span>
                              </Radio.Button>
                            );
                          })
                        : ""}
                    </Radio.Group>
                  </div>
                </div>

                <div className="more-role-prmison">
                  <Collapse
                    className="user-permis-list"
                    defaultActiveKey={["0"]}
                    accordion
                    expandIconPosition="right"
                    expandIcon={({ isActive }) => (
                      <Icon type="caret-right" rotate={isActive ? 90 : 0} />
                    )}
                  >
                    {defaultPermissionArray &&
                    defaultPermissionArray.permissions &&
                    defaultPermissionArray.permissions.length > 0
                      ? defaultPermissionArray.permissions.map(
                          (moduleDetails, index) => {
                            return (
                              <Panel
                                header={
                                  moduleDetails && moduleDetails.module_name
                                    ? moduleDetails.module_name
                                    : ""
                                }
                              >
                                <ScrollArea
                                  speed={0.8}
                                  smoothScrolling={true}
                                  className="sf-scroll"
                                  horizontal={false}
                                >
                                  {moduleDetails &&
                                  moduleDetails.module_permissions &&
                                  moduleDetails.module_permissions.length
                                    ? [
                                        ...new Set(
                                          moduleDetails.module_permissions.map(
                                            perm => perm.access_type
                                          )
                                        )
                                      ].map(type => (
                                        <div className="role-sub-access">
                                          <h5>{type}</h5>
                                          <div className="sf-chkbx-group sf-updt-roles chk-bullet">
                                            {moduleDetails.module_permissions.map(
                                              access_control => {
                                                if (
                                                  type ==
                                                  access_control.access_type
                                                )
                                                  return (
                                                    <Tooltip
                                                      title={
                                                        access_control.tooltip
                                                      }
                                                    >
                                                      <span>
                                                        {access_control &&
                                                        access_control.title
                                                          ? access_control.title
                                                          : ""}
                                                      </span>
                                                    </Tooltip>
                                                  );
                                              }
                                            )}
                                          </div>
                                        </div>
                                      ))
                                    : ""}
                                </ScrollArea>
                              </Panel>
                            );
                          }
                        )
                      : null}
                  </Collapse>
                </div>
              </div>
              <div className="all-btn multibnt mt-3">
                <div className="btn-hs-icon d-flex justify-content-between">
                  <button
                    onClick={this.handleCancel}
                    className="bnt bnt-normal"
                    disabled={!this.props.isDirty}
                  >
                    {Strings.cancel_btn}
                  </button>
                  <button
                    type="submit"
                    className="bnt bnt-active"
                    disabled={!this.props.isDirty}
                  >
                    {Strings.update_btn}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    permissionByAllRole: state.permissionByRoleManagement.permissionByAllRole,
    isDirty: isDirty("org_role_permission")(state)
  };
};

const mapDispatchToprops = dispatch => {
  return {
    actions: bindActionCreators(actions, dispatch),
    organizationUserAction: bindActionCreators(organizationUserAction, dispatch)
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: "org_role_permission",
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(OrganisationUserPermissions);
