import React from 'react';
import { Icon, Menu, Dropdown, Modal, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { getStorage, setStorage, handleFocus } from '../../../utils/common';

import { validate } from '../../../utils/Validations/roleValidation';
import { customInput } from '../../common/custom-input';
import { CustomSwitch } from '../../common/customSwitch';
import * as actions from '../../../actions/roleManagementActions';
import * as rolePermissionAction from '../../../actions/permissionManagementAction';
import { Strings } from '../../../dataProvider/localize';
import { CustomCheckbox } from '../../common/customCheckbox';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { customTextarea } from '../../common/customTextarea';
import { CustomDatepicker } from '../../common/customDatepicker';
import { DeepTrim } from '../../../utils/common';


class EditScopeDoc extends React.Component {
    constructor(props) {
        super(props);
        this.state = { displayEdit: 'none', displayPermissionEdit: 'none' }
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }

    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        formData.active = +formData.active;
        var finalFormData = new FormData();
        let access_control_id = []
        Object.keys(formData).forEach(key => {
            if (formData[key] === true) {
                access_control_id.push(key);
            }
        })
        if (this.state.displayEdit === 'block') {
            this.props.action.updateRole(formData).then((message) => {
                this.handleCancel();
                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                });
            }).catch((error) => {
                if (error.status == VALIDATE_STATUS) {
                  notification.warning({
                    message: Strings.validate_title,
                    description: error && error.data && typeof error.data.message == 'string'
                      ? error.data.message : Strings.generic_validate,
                    onClick: () => { },
                    className: 'ant-warning'
                  });
                } else {
                  notification.error({
                    message: Strings.error_title,
                    description: error && error.data && error.data.message && typeof error.data.message == 'string'
                      ? error.data.message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                  });
                }
              });
        } else {
            finalFormData.append("access_control_id", access_control_id);
            finalFormData.append("role_id", formData.id);
            finalFormData.append("organisation_id", this.currentOrganization);
            this.props.rolePermissionAction.addRolePermission(finalFormData).then((res) => {
                if (res) {
                    notification.success({
                        message: Strings.success_title,
                        description: Strings.role_update_success,
                        onClick: () => { },
                        className: 'ant-success'
                    });
                    this.props.rolePermissionAction.getPermissionsByRole(formData.id)
                }
                this.handlePermissionCancel();
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
        }
    }

    handleEditClick = () => {
        this.setState({ displayEdit: 'block' });
        this.setState({ displayPermissionEdit: 'none' });
    }

    handlePermissionEditClick = () => {
        this.setState({ displayPermissionEdit: 'block' });
        this.setState({ displayEdit: 'none' });
    }

    handleQuoteClick = () => {
        this.props.history.push('./sendQuoteMail')
    }

    handleCancel = () => {
        this.setState({ displayEdit: 'none' });
    }

    handlePermissionCancel = () => {
        this.setState({ displayPermissionEdit: 'none' });
    }

    render() {
        const { handleSubmit } = this.props;
        var role = this.props.roles.find(role => role.id === this.props.location.state)
        var menu = (<Menu>
            <Menu.Item onClick={this.handleEditClick}>
                {Strings.update_task_txt}
            </Menu.Item>
        </Menu>);

        var permissionMenu = (<Menu>
            <Menu.Item onClick={this.handlePermissionEditClick}>
                {Strings.role_edit_title}
            </Menu.Item>
        </Menu>);

        return (
            <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
                <div className="row">
                    <div className="col-lg-8 col-md-12 mb-4">
                        <div className="sf-card-wrap">

                            <div className="sf-card scope-v-value">
                                <div className="sf-card-head d-flex justify-content-between align-items-start">
                                    <div className="doc-vlue">Scope Document #: <span>QHC921XP1902-123 <i class="material-icons">lock</i></span>
                                        <div className="quote doc-vlue">Scope #: <span>QHC921XP1902-123</span></div>
                                    </div>
                                    <strong className="doc-v-usr"><span>BDM:</span>Alex Smith</strong>
                                </div>
                            </div>

                            <div className="sf-card mt-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">{Strings.client_details}</h2>
                                    <div className="info-btn">
                                        {/* Drop down for card */}
                                        <Dropdown className="more-info" overlay={menu}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                        {/*Drop down*/}
                                    </div>
                                </div>

                                <div className="sf-card-body">
                                    <div className="row">
                                        <div className="col-md-9 col-sm-9">
                                            <div className="data-v-row">
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.name_txt}</label>
                                                        <span>Adam Smith</span>
                                                    </div>
                                                </div>
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.org_pri_person}</label>
                                                        <span>Adam</span>
                                                    </div>
                                                </div>
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.phone_no_txt}</label>
                                                        <span>Adam</span>
                                                    </div>
                                                </div>
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.email_txt}</label>
                                                        <span>adamsmith@smithco.com</span>
                                                    </div>
                                                </div>
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.address_txt}</label>
                                                        <span>200 Sydney Road, Victoria 3022</span>
                                                    </div>
                                                </div>
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.abn_txt}</label>
                                                        <span>234567890</span>
                                                    </div>
                                                </div>
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.quote_request_by}</label>
                                                        <span>10-03-2019</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                                            <div className="client-fdbk">Pending Client Approval</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="sf-card mt-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">{Strings.site_service_details}</h2>
                                    <div className="info-btn">
                                        {/* Drop down for card */}
                                        <Dropdown className="more-info" overlay={menu}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                        {/*Drop down*/}
                                    </div>
                                </div>

                                <div className="sf-card-body">
                                    <div className="add-n-site">
                                        <div className="data-v-row">
                                            <div className="data-v-col">
                                                <div className="view-text-value">
                                                    <label>{Strings.job_name}</label>
                                                    <span>RMIT Tender</span>
                                                </div>
                                            </div>
                                            <div className="data-v-col">
                                                <div className="view-text-value">
                                                    <label>{Strings.site_name}</label>
                                                    <span>Smith Co.</span>
                                                </div>
                                            </div>
                                            <div className="data-v-col">
                                                <div className="view-text-value">
                                                    <label>{Strings.address_txt}</label>
                                                    <span>200 Sydney Road, Victoria 3022</span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* ----------------------------
                                                site service details
                                        ---------------------------- */}
                                        <div className="site-ser-table">
                                            <div className="site-ser-view">
                                                <div className="site-s-head">
                                                    <button className="dragde-bnt normal-bnt">
                                                        <i className="fa fa-ellipsis-h" ></i>
                                                        <i className="fa fa-ellipsis-h" ></i>
                                                    </button>
                                                    <div className="view-text-value">
                                                        <label>Roof Cleaning</label>
                                                        <span>Lorem ipsum dolor sit amet, conse adipiscing elit, dolor sit amet, conse adipiscing elit</span>
                                                    </div>
                                                    <div className="doc-action-bnt">
                                                        <button className="normal-bnt"><i class="fa fa-pencil"></i></button>
                                                        <button className="normal-bnt"><i class="fa fa-trash-o"></i></button>
                                                    </div>
                                                </div>

                                                <div className="site-s-body">
                                                    <div className="d-flex justify-content-between">
                                                        <div className="data-v-row">
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.area_txt}</label>
                                                                    <span>Gymnasium, Kitchen</span>
                                                                </div>
                                                            </div>
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.estimate_txt}</label>
                                                                    <span>2 Days</span>
                                                                </div>
                                                            </div>
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.frequency_txt}</label>
                                                                    <span>Monthly</span>
                                                                </div>
                                                            </div>
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.duration_txt}</label>
                                                                    <span>5 Years</span>
                                                                </div>
                                                            </div>
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.start_date_txt}</label>
                                                                    <span>12-03-2019</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="doc-sr-img">
                                                            <img src="/images/doc-se-pic.png" />
                                                        </div>
                                                    </div>

                                                    <div className="site-s-footer d-flex">
                                                        <div className="view-text-value">
                                                            <label>Notes</label>
                                                            <span>Lorem ipsum dolor sit amet, conse adipiscing elit, dolor sit amet, conse adipiscing elit</span>
                                                        </div>
                                                        {/* quote value  */}
                                                        <div className="quote-vlue">
                                                            <fieldset className="form-group sf-form">
                                                                <Field
                                                                    label="Value"
                                                                    name="name"
                                                                    type="text"
                                                                    id="name"
                                                                    component={customInput} />
                                                            </fieldset>
                                                            <div className="view-text-value">
                                                                <label>Value</label>
                                                                <span>100</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="site-ser-view">
                                                <div className="site-s-head">
                                                    <button className="dragde-bnt normal-bnt">
                                                        <i className="fa fa-ellipsis-h" ></i>
                                                        <i className="fa fa-ellipsis-h" ></i>
                                                    </button>
                                                    <div className="site-s-footer d-flex">
                                                        <div className="view-text-value">
                                                            <label>Notes</label>
                                                            <span>Lorem ipsum dolor sit amet, conse adipiscing elit, dolor sit amet, conse adipiscing elit</span>
                                                        </div>
                                                        {/* quote value  */}
                                                        <div className="quote-vlue">
                                                            <fieldset className="form-group sf-form">
                                                                <Field
                                                                    label="Value"
                                                                    name="name"
                                                                    type="text"
                                                                    id="name"
                                                                    component={customInput} />
                                                            </fieldset>
                                                            <div className="view-text-value">
                                                                <label>Value</label>
                                                                <span>100</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="doc-action-bnt">
                                                        <button className="normal-bnt"><i class="fa fa-pencil"></i></button>
                                                        <button className="normal-bnt"><i class="fa fa-trash-o"></i></button>
                                                    </div>
                                                </div>

                                                <div className="site-s-body">
                                                    <div className="d-flex justify-content-between">
                                                        <div className="data-v-row">
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.area_txt}</label>
                                                                    <span>Gymnasium, Kitchen</span>
                                                                </div>
                                                            </div>
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.estimate_txt}</label>
                                                                    <span>2 Days</span>
                                                                </div>
                                                            </div>
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.frequency_txt}</label>
                                                                    <span>Monthly</span>
                                                                </div>
                                                            </div>
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.duration_txt}</label>
                                                                    <span>5 Years</span>
                                                                </div>
                                                            </div>
                                                            <div className="data-v-col">
                                                                <div className="view-text-value">
                                                                    <label>{Strings.start_date_txt}</label>
                                                                    <span>12-03-2019</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="doc-sr-img">
                                                            <img src="/images/doc-se-pic.png" />
                                                        </div>
                                                    </div>

                                                    <div className="site-s-footer">
                                                        <div className="view-text-value">
                                                            <label>Notes</label>
                                                            <span>Lorem ipsum dolor sit amet, conse adipiscing elit, dolor sit amet, conse adipiscing elit</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* ----------------------------
                                                    End
                                        ---------------------------- */}
                                        <button className="normal-bnt add-line-bnt mt-3">
                                            <i class="material-icons">add</i>
                                            <span>{Strings.add_task_txt}</span>
                                        </button>
                                    </div>
                                    <div className="btn-hs-icon sm-bnt">
                                        <button className="bnt bnt-normal" type="button">{Strings.add_site_btn}</button>
                                    </div>

                                    {/* quote total value */}
                                    <div className="quote-total">
                                        <div className="quote-table">
                                            <table>
                                                <tr>
                                                    <th>Subtotal (Exc GST)</th>
                                                    <th>$0.00</th>
                                                </tr>
                                                <tr>
                                                    <td>Total (Inc GST)</td>
                                                    <td><strong>$0.00</strong></td>
                                                </tr>
                                            </table>
                                        </div>
                                    </div>

                                </div>
                            </div>

                            {/* Internal Notes */}
                            <div className="sf-card mt-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">{Strings.internal_notes}</h2>
                                    {/* Drop down for card */}
                                    <Dropdown className="more-info" overlay={menu}>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                    {/*Drop down*/}
                                </div>
                                <div className="sf-card-body">
                                    <div className="view-internal-note">
                                        <span>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque felis tortor, sodales a urna non, tristique congue eros. Integer ut luctus purus. </span>
                                        <span className="note-dtls">By Adam Smith, 14th Jan 2019</span>
                                    </div>
                                    <div className="btn-hs-icon sm-bnt">
                                        <button className="bnt bnt-normal" type="button">{Strings.add_new_task_txt}</button>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                            <div className="btn-hs-icon">
                                <button type="submit" className="bnt bnt-normal">
                                    <i class="material-icons">send</i> {Strings.send_for_admin_approval_bnt}</button>
                            </div>
                            <div className="btn-hs-icon">
                                <button type="submit" className="bnt bnt-normal">
                                    <i class="material-icons">remove_red_eye</i> {Strings.preview_btn}</button>
                            </div>
                            <div className="btn-hs-icon">
                                <button type="submit" className="bnt bnt-normal">
                                    <i class="material-icons">assignment</i> {Strings.generate_quote_btn}</button>
                            </div>
                            <div className="btn-hs-icon">
                                <button onClick={this.handleQuoteClick} type="submit" className="bnt bnt-normal">
                                    <i class="fa fa-envelope-o"></i> {Strings.email_quote_to_client_bnt}</button>
                            </div>
                            <div className="btn-hs-icon">
                                <button type="submit" className="bnt bnt-active">
                                    <i class="material-icons">save</i> {Strings.save_btn}</button>
                            </div>
                        </div>

                    </div>


                    {/* ------------------------
                         Right panel
                    ------------------------ */}

                    <div className="col-lg-4 col-md-12" style={{ display: this.state.displayEdit }}>
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h4 className="sf-sm-hd sf-pg-heading">{Strings.update_task_txt}</h4>
                                <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                            </div>
                            <div className="sf-card-body doc-update-task mt-2">
                                <form onSubmit={handleSubmit(this.onSubmit)} >
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.task_name}
                                            name="name"
                                            type="name"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.description_txt}
                                            name="name"
                                            type="name"
                                            id="name"
                                            component={customTextarea} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.area_txt}
                                            name="name"
                                            type="name"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <label>{Strings.estimate_txt}</label>
                                        <div className="estimate-lists">
                                            <span className="est-items">
                                                <input type="text" placeholder="2" />
                                                <span>D</span>
                                            </span>
                                            <span className="est-items">
                                                <input type="text" placeholder="2" />
                                                <span>H</span>
                                            </span>
                                            <span className="est-items">
                                                <input type="text" placeholder="2" />
                                                <span>S</span>
                                            </span>
                                            <span className="est-items">
                                                <input type="text" placeholder="2" />
                                                <span>M<sup>2</sup></span>
                                            </span>
                                        </div>
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.frequency_txt}
                                            name="name"
                                            type="name"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.duration_txt}
                                            name="name"
                                            type="name"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form lsico">
                                        <Field
                                            label={Strings.date_txt}
                                            name="name"
                                            type="name"
                                            id="name"
                                            component={CustomDatepicker} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.note_txt}
                                            name="name"
                                            type="name"
                                            id="name"
                                            component={customTextarea} />
                                    </fieldset>

                                    <div className="all-btn multibnt">
                                        <div className="btn-hs-icon d-flex justify-content-between">
                                            <button onClick={this.handleCancel} className="bnt bnt-normal" type="button">
                                                {Strings.cancel_btn}</button>
                                            <button type="submit" className="bnt bnt-active">
                                                {Strings.update_btn}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* update role Permission */}
                    <div className="col-lg-4 col-md-12" style={{ display: this.state.displayPermissionEdit }}>
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h4 className="sf-sm-hd sf-pg-heading">{Strings.role_edit_title}</h4>
                                <button class="closed-btn" onClick={this.handlePermissionCancel}><Icon type="close" /></button>
                            </div>
                            <div className="sf-card-body">
                                <form onSubmit={handleSubmit(this.onSubmit)} >
                                    {this.props.accessControlsByModule.length > 0 ? this.props.accessControlsByModule.map(modulesName => {
                                        return <div className="more-role-prmison sf-row-bx edit-pr-items">
                                            <h4>{modulesName.name}</h4>
                                            <div className="sf-chkbx-group">
                                                {modulesName.values.length > 0 ? modulesName.values.map(access_control => {
                                                    return <div key={access_control.id} className="edit-pr-list">

                                                        <Field name={access_control.id.toString()} label={access_control.title} component={CustomCheckbox} />

                                                    </div>
                                                }) : ''}
                                            </div>
                                        </div>
                                    }) : ''}

                                    <div className="all-btn multibnt">
                                        <div className="btn-hs-icon d-flex justify-content-between">
                                            <button onClick={this.handlePermissionCancel} className="bnt bnt-normal" type="button">
                                                {Strings.cancel_btn}</button>
                                            <button type="submit" className="bnt bnt-active">
                                                {Strings.update_btn}</button>
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
    var value = state.roleManagement.roles.find(role => role.id === ownProps.location.state);
    if (state.permissionByRoleManagement.permissionByRole && state.permissionByRoleManagement.permissionByRole.length > 0) {
        state.permissionByRoleManagement.permissionByRole.map(moduleName => {
            if (moduleName.values && moduleName.values.length) {
                moduleName.values.map(access_control => {
                    if (access_control.access_control_id && access_control.role_id === ownProps.location.state) {
                        if (value !== undefined)
                            value[access_control.access_control_id] = true;
                    }
                    return value;
                })
            }
            return value;
        });
    }

    return {
        roles: state.roleManagement.roles,
        accessControlsByModule: state.accessControlManagement.accessControlsByModule,
        permissionByRole: state.permissionByRoleManagement.permissionByRole,
        initialValues: value
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
        rolePermissionAction: bindActionCreators(rolePermissionAction, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'editScopeDoc', validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(EditScopeDoc)


