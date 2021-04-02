import React from 'react';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, notification } from 'antd';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { CustomSelect } from '../../common/customSelect';
import { clientDetailsValidate } from '../../../utils/Validations/scopeDocValidation';
import * as actions from '../../../actions/clientManagementActions';
import { CustomSwitch } from '../../common/customSwitch';
import { handleFocus, DeepTrim } from '../../../utils/common';
import { VALIDATE_STATUS } from '../../../dataProvider/constant';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch'

class EditClientPersonDetails extends React.Component {
    onSubmit = async formData => {
        formData = await DeepTrim(formData);
        let selectedRole = null;
        try {
            selectedRole = this.props.roles.find(item => item.name.toLowerCase()
                === formData.role_name.toLowerCase());
        } catch (err) {
            selectedRole = this.props.roles.find(item =>
                item.id == formData.role_name)
        }
        let role_id = selectedRole && selectedRole.id ? selectedRole.id : null;
        let role_name = selectedRole && selectedRole.role_name ? selectedRole.role_name : formData.role_name;

        formData = { ...formData, role_id: role_id, role_name: role_name }

        this.props.action.editContactPerson(formData)
            .then((flag) => {
                this.handleCancel();
                notification.success({
                    message: Strings.success_title,
                    description: flag,
                    onClick: () => { },
                    className: 'ant-success'
                });
                //this.props.action.getClientPersonRoles();
                this.props.action.getClientDetails(formData.client_id)
                    .then((flag) => {
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
    }

    handleEditPerson = (data) => {
        this.props.onPersonUpdate(data)
        this.props.reset()
    }

    handleCancel = () => {
        this.props.reset();
        this.props.handleCancel()
    }

    render() {
        const { handleSubmit, sites } = this.props;
        const activeSites = sites.filter(item => item.active === 1);

        const primaryPersonSection = (
            <div>
                <fieldset className="sf-form form-group">
                    <Field
                        label='Primary Contact Name'
                        name="name"
                        type="text"
                        component={customInput}
                    />
                </fieldset>
                <fieldset className="sf-form form-group">
                    <Field
                        label='Email'
                        name="email"
                        type="text"
                        component={customInput}
                    />
                </fieldset>
                <fieldset className="sf-form form-group">
                    <Field
                        label='Phone'
                        name="phone"
                        type="text"
                        component={customInput}
                    />
                </fieldset>
                <fieldset className="sf-form form-group">
                    {/* <Field
                        label="Role"
                        name="role_id"
                        placeholder={Strings.role_id_sau}
                        type="text"
                        options={this.props.roles ? this.props.roles.map(role => ({ title: role.name, value: role.id })) : []}
                        component={CustomSelect}
                    /> */}
                    <Field
                        label="Role Name"
                        name="role_name"
                        placeholder={Strings.role_name}
                        type="text"
                        dataSource={this.props.roles ? this.props.roles.map(role => ({
                            text: role.role_name,
                            value: role.id
                        })) : ""}
                        component={CustomAutoCompleteSearch}

                    />
                </fieldset>
                <fieldset className="form-group sf-form auto-height-txt">
                    <Field
                        label="Sites"
                        name="sites"
                        type="text"
                        mode="multiple"
                        filterOption={(input, option) => (
                            option.props.children.toLowerCase()
                                .indexOf(input.toLowerCase()) >= 0
                        )}
                        options={activeSites.map(site => ({
                            title: site.site_name,
                            value: site.id
                        }))}
                        component={CustomSelect}
                    />
                </fieldset>
                <fieldset className="sf-form form-group">
                    <Field
                        label='Active'
                        name="active"
                        id="active"
                        component={CustomSwitch}
                    />
                </fieldset>
            </div>
        )

        return (
            <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h4 className="sf-sm-hd sf-pg-heading">{0 ? Strings.scope_doc_edit_client_title : 'Edit Primary Contact Person'}</h4>
                    <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                </div>
                <div className="sf-card-body doc-update-task mt-2">
                    <form onSubmit={handleSubmit(this.onSubmit)} >
                        {primaryPersonSection}
                        <div className="all-btn multibnt">
                            <div className="btn-hs-icon d-flex justify-content-between">
                                <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                                    {Strings.cancel_btn}</button>

                                <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                    {Strings.update_btn}</button>

                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        sites: state.clientManagement && state.clientManagement.sitesList,
        formValues: state.form && state.form.EditClientPersonDetails &&
            state.form.EditClientPersonDetails.values ? state.form.EditClientPersonDetails.values : {},
        isDirty: isDirty('EditClientPersonDetails')(state),
        roles: state.clientManagement.roles,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'EditClientPersonDetails', validate: clientDetailsValidate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(EditClientPersonDetails)