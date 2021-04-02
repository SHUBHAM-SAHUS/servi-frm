import React from 'react';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, notification } from 'antd';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch'
import * as actions from '../../../actions/clientManagementActions';
import {
    isRequired,
    siteNameRequired,
    siteCityRequired,
    siteAddressRequired,
    siteStateRequired,
    siteZipRequired,
} from '../../../utils/Validations/scopeDocValidation';
import { countries, handleFocus, DeepTrim } from '../../../utils/common';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage } from '../../../utils/common';
import { CustomSwitch } from '../../common/customSwitch';

class AddClientSite extends React.Component {

    onSubmit = async formData => {
        formData = await DeepTrim(formData);
        if (this.props.selectedClient && this.props.selectedClient.id) {
            formData.client_id = this.props.selectedClient.id;
            this.props.action.addClientSite(formData)
                .then((flag) => {
                    this.handleCancel();
                    notification.success({
                        message: Strings.success_title,
                        description: flag,
                        onClick: () => { },
                        className: 'ant-success'
                    });
                    this.props.action.getSitesList(formData.client_id)
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
    }

    handleCancel = () => {
        this.props.reset();
        this.props.handleCancel()
    }

    render() {
        const { handleSubmit } = this.props;
        const sitesSection = (
            <div className="client-add-site-dtl">
                <fieldset className="form-group sf-form">
                    <Field
                        label={Strings.site_name}
                        name="site_name"
                        type="text"
                        validate={siteNameRequired}
                        component={customInput}
                    />
                </fieldset>

                <fieldset className="form-group sf-form">
                    <Field
                        label={Strings.street_add_txt}
                        name="street_address"
                        type="text"
                        validate={siteAddressRequired}
                        component={customInput} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label={Strings.city_txt}
                        name="city"
                        type="text"
                        validate={siteCityRequired}
                        component={customInput} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label={Strings.state_txt}
                        name="state"
                        type="text"
                        validate={siteStateRequired}
                        component={customInput} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label={Strings.zip_code_no}
                        name="zip_code"
                        type="text"
                        validate={siteZipRequired}
                        component={customInput} />
                </fieldset>
                <fieldset className="form-group sf-form lsico">
                    <Field
                        label={Strings.country_txt}
                        name="country"
                        type="text"
                        dataSource={countries.map(country => ({ text: country, value: country.toString() }))}
                        validate={isRequired}
                        component={CustomAutoCompleteSearch} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label={Strings.user_table_active}
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
                    <h4 className="sf-sm-hd sf-pg-heading">Add Client Site</h4>
                    <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                </div>
                <div className="sf-card-body doc-update-task mt-2">
                    <form onSubmit={handleSubmit(this.onSubmit)} >
                        {sitesSection}
                        <div className="all-btn multibnt">
                            <div className="btn-hs-icon d-flex justify-content-between">
                                <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                                    {Strings.cancel_btn}</button>
                                <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                    {Strings.save_btn}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    var OrgSACountry = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).country : null;
    return {
        sites: state.clientManagement && state.clientManagement.sitesList,
        initialValues: { country: OrgSACountry, active: true },
        formValues: state.form && state.form.AddClientSite &&
            state.form.AddClientSite.values ? state.form.AddClientSite.values : {},
        isDirty: isDirty('AddClientSite')(state),
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
        form: 'AddClientSite', enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(AddClientSite)