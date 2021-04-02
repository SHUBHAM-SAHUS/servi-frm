import React from "react";
import { Icon, Menu, Dropdown, Modal, notification, Tooltip } from "antd";
import { reduxForm, Field, isDirty } from "redux-form";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import { getStorage, setStorage, handleFocus } from "../../../utils/common";
import ScrollArea from "react-scrollbar";

import { validate } from "../../../utils/Validations/roleValidation";
import { customInput } from "../../common/custom-input";
import { CustomSelect } from "../../common/customSelect";
import { CustomSwitch } from "../../common/customSwitch";
import * as actions from "../../../actions/roleManagementActions";
import * as rolePermissionAction from "../../../actions/permissionManagementAction";
import { Strings } from "../../../dataProvider/localize";
import { CustomCheckbox } from "../../../components/common/customCheckbox";
import {
    ADMIN_DETAILS,
    ACCESS_CONTROL,
    VALIDATE_STATUS
} from "../../../dataProvider/constant";
import { DeepTrim } from "../../../utils/common";

import $ from "jquery";

class EditRole extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayEdit: "none",
            displayPermissionEdit: "none",
            cardExpnadBtn: true
        };
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS))
            ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
            : null;
    }

    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        formData.active = +formData.active;
        var finalFormData = new FormData();
        let access_control_id = [];
        Object.keys(formData).forEach(key => {
            if (formData[key] === true) {
                access_control_id.push(key);
            }
        });
        if (this.state.displayEdit === "block") {
            this.props.action
                .updateRole(formData)
                .then(message => {
                    this.handleCancel();
                    notification.success({
                        message: Strings.success_title,
                        description: message,
                        onClick: () => { },
                        className: "ant-success"
                    });
                })
                .catch(error => {
                    if (error.status == VALIDATE_STATUS) {
                        notification.warning({
                            message: Strings.validate_title,
                            description:
                                error && error.data && typeof error.data.message == "string"
                                    ? error.data.message
                                    : Strings.generic_validate,
                            onClick: () => { },
                            className: "ant-warning"
                        });
                    } else {
                        notification.error({
                            message: Strings.error_title,
                            description:
                                error &&
                                    error.data &&
                                    error.data.message &&
                                    typeof error.data.message == "string"
                                    ? error.data.message
                                    : Strings.generic_error,
                            onClick: () => { },
                            className: "ant-error"
                        });
                    }
                });
        } else {
            finalFormData.append("access_control_id", access_control_id);
            finalFormData.append("role_id", formData.id);
            finalFormData.append("organisation_id", this.currentOrganization);
            this.props.rolePermissionAction
                .addRolePermission(finalFormData)
                .then(res => {
                    if (res) {
                        notification.success({
                            message: Strings.success_title,
                            description: Strings.role_update_success,
                            onClick: () => { },
                            className: "ant-success"
                        });
                        this.props.rolePermissionAction.getPermissionsByRole(formData.id);
                    }
                    this.handlePermissionCancel();
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

    handleEditClick = () => {
        this.setState({ displayEdit: "block" });
        this.setState({ displayPermissionEdit: "none" });
        if (!this.state.cardExpnadBtn) {
            this.handleExpand();
        }
    };

    handlePermissionEditClick = () => {
        this.setState({ displayPermissionEdit: "block" });
        this.setState({ displayEdit: "none" });
        if (!this.state.cardExpnadBtn) {
            this.handleExpand();
        }
    };

    handleCancel = () => {
        this.setState({ displayEdit: "none" });
    };

    handlePermissionCancel = () => {
        this.setState({ displayPermissionEdit: "none" });
    };

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn });
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    };

    roleAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["rolesmanagement"]
        .permissions;
    /**Permissions for the module */
    permissions = {
        org_read_role: this.roleAccessControl.findIndex(
            acess => acess.control_name === "org_read_role"
        ),
        org_read_role_permission: this.roleAccessControl.findIndex(
            acess => acess.control_name === "org_read_role_permission"
        ),
        org_update_role: this.roleAccessControl.findIndex(
            acess => acess.control_name === "org_update_role"
        ),
        org_update_role_permission: this.roleAccessControl.findIndex(
            acess => acess.control_name === "org_update_role_permission"
        )
    };

    render() {
        const { handleSubmit } = this.props;
        var role = this.props.roles.find(
            role => role.id === this.props.location.state
        );

        var jobCalendarTemplates =
            role && role.job_calendar_templates
                ? role.job_calendar_templates.map(item => item.name).toString()
                : "";

        var menu = (
            <Menu>
                <Menu.Item onClick={this.handleEditClick}>
                    {Strings.menu_role_edit}
                </Menu.Item>
            </Menu>
        );

        var permissionMenu = (
            <Menu>
                <Menu.Item onClick={this.handlePermissionEditClick}>
                    {Strings.role_edit_title}
                </Menu.Item>
            </Menu>
        );

        return (
            <div
                className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}
            >
                <div className="row">
                    <div className="col-lg-8 col-md-12 mb-4">
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
                            <div
                                className={
                                    this.permissions.org_read_role !== -1 ? "sf-card" : "d-none"
                                }
                            >
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">{Strings.role_card}</h2>
                                    <div className="info-btn">
                                        {/* Drop down for card */}
                                        {this.permissions.org_update_role !== -1 ? (
                                            <Dropdown className="more-info" overlay={menu}>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        ) : (
                                                <Dropdown
                                                    className="more-info disable-drop-menu"
                                                    disabled
                                                >
                                                    <i className="material-icons">more_vert</i>
                                                </Dropdown>
                                            )}
                                        {/*Drop down*/}
                                    </div>
                                </div>

                                <div className="sf-card-body mt-2">
                                    <div className="data-v-row">
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.role_name}</label>
                                                <span>{role ? role.name : ""}</span>
                                            </div>
                                        </div>

                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.role_status}</label>
                                                <span>
                                                    {role ? Boolean(role.active).toString() : ""}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="data-v-row">
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.role_job_calendar_lables}</label>
                                                <span>{jobCalendarTemplates}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* perimission */}

                            <div
                                className={
                                    this.permissions.org_read_role_permission !== -1
                                        ? "sf-card mt-4"
                                        : "d-none"
                                }
                            >
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">{Strings.permission}</h2>
                                    <div className="info-btn">
                                        {/* Drop down for card */}
                                        {this.permissions.org_update_role_permission ? (
                                            <Dropdown className="more-info" overlay={permissionMenu}>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        ) : (
                                                <Dropdown
                                                    className="more-info disable-drop-menu"
                                                    disabled
                                                >
                                                    <i className="material-icons">more_vert</i>
                                                </Dropdown>
                                            )}
                                        {/*Drop down*/}
                                    </div>
                                </div>

                                <div className="sf-card-body mt-2">
                                    <ScrollArea
                                        speed={0.8}
                                        smoothScrolling={true}
                                        className="sf-scroll h750"
                                        horizontal={false}
                                    >
                                        <div className="vtrow-bx">
                                            {this.props.permissionByRole &&
                                                this.props.permissionByRole.map(moduleName => {
                                                    return (
                                                        <div className="view-text-value pr-3 view-perm-items">
                                                            <label>{moduleName ? moduleName.name : ""}</label>
                                                            {moduleName.values.length > 0
                                                                ? [
                                                                    ...new Set(
                                                                        moduleName.values.map(
                                                                            val => val.access_type
                                                                        )
                                                                    )
                                                                ].map(type => (
                                                                    <div className="role-sub-access">
                                                                        <h5>{type}</h5>
                                                                        <div className="sf-chkbx-group">
                                                                            {moduleName.values.map(
                                                                                access_control => {
                                                                                    if (
                                                                                        type == access_control.access_type
                                                                                    )
                                                                                        return (
                                                                                            <Tooltip
                                                                                                title={access_control.tooltip}
                                                                                            >
                                                                                                <span>
                                                                                                    {access_control
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
                                                        </div>
                                                    );
                                                })}
                                        </div>
                                    </ScrollArea>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit */}

                    <div
                        className="col-lg-4 col-md-12"
                        style={{ display: this.state.displayEdit }}
                    >
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h4 className="sf-sm-hd sf-pg-heading">Edit Role Details</h4>
                                <button class="closed-btn" onClick={this.handleCancel}>
                                    <Icon type="close" />
                                </button>
                            </div>
                            <div className="sf-card-body mt-2">
                                <form onSubmit={handleSubmit(this.onSubmit)}>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.role_name}
                                            name="name"
                                            type="name"
                                            id="name"
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
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            name="active"
                                            id="active"
                                            label={Strings.role_status}
                                            component={CustomSwitch}
                                        />
                                    </fieldset>

                                    <div className="all-btn multibnt">
                                        <div className="btn-hs-icon d-flex justify-content-between">
                                            <button
                                                onClick={this.handleCancel}
                                                className="bnt bnt-normal"
                                                type="button"
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
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* update role Permission */}
                    <div
                        className="col-lg-4 col-md-12"
                        style={{ display: this.state.displayPermissionEdit }}
                    >
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h4 className="sf-sm-hd sf-pg-heading">
                                    {Strings.role_edit_title}
                                </h4>
                                <button
                                    class="closed-btn"
                                    onClick={this.handlePermissionCancel}
                                >
                                    <Icon type="close" />
                                </button>
                            </div>
                            <div className="sf-card-body">
                                <form onSubmit={handleSubmit(this.onSubmit)}>
                                    {this.props.accessControlsByModule.length > 0
                                        ? this.props.accessControlsByModule.map(modulesName => {
                                            return (
                                                <div className="more-role-prmison  sf-row-bx edit-pr-items">
                                                    <h4>{modulesName.name}</h4>
                                                    {modulesName.access_types &&
                                                        modulesName.access_types.map(access => (
                                                            <div className="role-sub-access">
                                                                <h5>{access.name}</h5>
                                                                <div className="sf-chkbx-group">
                                                                    {access.values.length > 0
                                                                        ? access.values.map(access_control => {
                                                                            return (
                                                                                <Tooltip
                                                                                    title={access_control.tooltip}
                                                                                >
                                                                                    <div
                                                                                        key={access_control.id}
                                                                                        className="edit-pr-list"
                                                                                    >
                                                                                        <Field
                                                                                            name={access_control.id}
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
                                        })
                                        : ""}

                                    <div className="all-btn multibnt">
                                        <div className="btn-hs-icon d-flex justify-content-between">
                                            <button
                                                onClick={this.handlePermissionCancel}
                                                className="bnt bnt-normal"
                                                type="button"
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
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    var value = state.roleManagement.roles.find(
        role => role.id === ownProps.location.state
    );
    if (
        state.permissionByRoleManagement.permissionByRole &&
        state.permissionByRoleManagement.permissionByRole.length > 0
    ) {
        state.permissionByRoleManagement.permissionByRole.map(moduleName => {
            if (moduleName.values && moduleName.values.length) {
                moduleName.values.map(access_control => {
                    if (
                        access_control.access_control_id &&
                        access_control.role_id === ownProps.location.state
                    ) {
                        if (value !== undefined)
                            value[access_control.access_control_id] = true;
                    }
                    return value;
                });
            }
            return value;
        });
    }

    return {
        roles: state.roleManagement.roles,
        jobCalendarLables: state.roleManagement.job_calendar_lables,
        accessControlsByModule:
            state.accessControlManagement.accessControlsByModule,
        permissionByRole: state.permissionByRoleManagement.permissionByRole,
        initialValues: {
            ...value,
            job_calendar_templates: value.job_calendar_templates
                ? value.job_calendar_templates.map(item => {
                    return item.id;
                })
                : []
        },
        isDirty: isDirty("editRole")(state)
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
        form: "editRole",
        validate,
        enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(EditRole);
