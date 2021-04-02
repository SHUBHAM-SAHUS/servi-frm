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
import * as rolesActions from '../../../actions/roleManagementActions';
import { CustomSwitch } from '../../common/customSwitch';
import { VALIDATE_STATUS, ADMIN_DETAILS } from '../../../dataProvider/constant';
import { handleFocus } from '../../../utils/common';
import { DeepTrim, getStorage } from '../../../utils/common';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch'



class AddClientNewPerson extends React.Component {

    componentDidMount() {
        const adminDetails = JSON.parse(getStorage(ADMIN_DETAILS))
        const currentOrganization = adminDetails && adminDetails.organisation;
        //this.props.rolesActions.getRoles(currentOrganization.id);
        this.props.action.getClientPersonRoles();
    }

    onSubmit = async formData => {
        formData = await DeepTrim(formData);
        console.log("FORM DATA >>>>> ", formData);

        let selectedRole = null;

        try {
            selectedRole = this.props.roles.find(item => item.name.toLowerCase()
                === formData.role_name.toLowerCase());
        } catch (err) {
            selectedRole = this.props.roles.find(item =>
                item.id == formData.role_name)

        }


        let data = {};
        data.client_id = this.props.selectedClient && this.props.selectedClient.id;
        let clientPerson = [{
            name: formData.name,
            phone: formData.phone,
            email: formData.email,
            active: formData.active,
            quote_requested_by: null,
            role_id: selectedRole && selectedRole.id ? selectedRole.id : null,
            role_name: selectedRole && selectedRole.role_name ? selectedRole.role_name : formData.role_name,

        }]
        data.client_person = clientPerson;
        if (formData && formData.sites && formData.sites.length > 0) {
            data.sites = formData.sites;
        }

        this.props.action.addContactPerson(data)
            .then(async (message) => {
                this.addPerson = [];
                this.props.reset();
                this.props.handleCancel();
                if (message) {
                    notification.success({
                        message: Strings.success_title,
                        description: Strings.client_create_success,
                        onClick: () => { },
                        className: 'ant-success'
                    });
                }
                await this.props.action.getClientPersonRoles();
                this.props.action.getClientDetails(data.client_id);
            })
            .catch((error) => {
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
                        placeholder={Strings.contact_name_clnt}
                        type="text"
                        component={customInput}
                    />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label='Email'
                        name="email"
                        placeholder={Strings.email_clnt}
                        type="text"
                        component={customInput}
                    />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label='Phone'
                        name="phone"
                        type="text"
                        component={customInput}
                    />
                </fieldset>
                <fieldset className="form-group sf-form">
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
                <fieldset className="form-group sf-form">
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
                    <h4 className="sf-sm-hd sf-pg-heading">{'Add Primary Contact Person'}</h4>
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
                                    {Strings.add_txt}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    var value = state.clientManagement && state.clientManagement.clientDetails ? state.clientManagement.clientDetails[0] : null;
    return {
        sites: state.clientManagement && state.clientManagement.sitesList,
        initialValues: { sites: [], active: true },
        formValues: state.form && state.form.AddClientNewPerson &&
            state.form.AddClientNewPerson.values ? state.form.AddClientNewPerson.values : {},
        isDirty: isDirty('AddClientNewPerson')(state),
        selectedClient: value ? value : {},
        roles: state.clientManagement.roles,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
        rolesActions: bindActionCreators(rolesActions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'AddClientNewPerson', validate: clientDetailsValidate, enableReinitialize: true, destroyOnUnmount: false,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(AddClientNewPerson)