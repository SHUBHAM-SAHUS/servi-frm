import React from 'react';
import { Icon, Dropdown, Menu, Modal, message, notification } from 'antd';
import { reduxForm, Field, FieldArray, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../../common/custom-input';
import { CustomSelect } from '../../../common/customSelect';
import {customCountrySelect} from '../../../common/customCountrySelect';
import { Strings } from '../../../../dataProvider/localize';
import { CustomDatepicker } from '../../../common/customDatepicker';
import moment from 'moment';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../../dataProvider/constant';
import { isRequired, isNumber } from '../../../../utils/Validations/scopeDocValidation';
import { countryCodes } from '../../../../dataProvider/countryCodes'
import { handleFocus, DeepTrim } from '../../../../utils/common';
import * as actions from '../../../../actions/profileManagementActions';
import { Link } from 'react-router-dom';
import { getStorage, setStorage, countries } from '../../../../utils/common';
import { emergencyContactValidation } from '../../../../utils/Validations/profileValidation';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';
import AddExperience from '../AddExperience';

class EmergencyContactForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            date: '',
            phnOtpErr: false,
            emailOtpErr: false
        }

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    static getDerivedStateFromProps(props, state) {
        var OrgSACountry = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).country : null;
        if (!props.formValues && props.formValues.ec_country || props.formValues && props.formValues.ec_country === '') {
            props.change(`ec_country`, OrgSACountry);
        }
    }

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);
        formData = { ...formData, 'profile_progress': this.props.profileComplete }

        console.log(formData)

        this.props.action.updateOrgUserEmergencyContact(formData)
            .then((flag) => {
                notification.success({
                    message: Strings.success_title,
                    description: flag,
                    onClick: () => { },
                    className: 'ant-success'
                });
                // this.props.onPersonDetails()
                // this.props.reset()
                this.props.action.getOrgUserDetails(this.org_user_id, this.org_user_name)
                    .then(() => {
                        setStorage(ADMIN_DETAILS, JSON.stringify({
                            ...JSON.parse(getStorage(ADMIN_DETAILS)),
                            name: this.props && this.props.profile && this.props.profile[0] && this.props.profile[0].name ?
                                this.props.profile[0].name : JSON.parse(getStorage(ADMIN_DETAILS)).name,
                            last_name: this.props && this.props.profile && this.props.profile[0] && this.props.profile[0].last_name ?
                                this.props.profile[0].last_name : JSON.parse(getStorage(ADMIN_DETAILS)).last_name
                        }));
                    });
            }).catch((error) => {
                if (error.status === VALIDATE_STATUS) {
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

    render() {
        const { handleSubmit, initialValues } = this.props;
        const editMenu = (
            <Menu>
                <Menu.Item></Menu.Item>
            </Menu>
        )

        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>
                <div className="sf-card mt-3">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.emergency_contact_dtl}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        <div className="row">

                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.full_name_txt}
                                        name="ec_full_name"
                                        placeholder={Strings.ec_full_name_acc_pd}
                                        type="text"
                                        id="ec_full_name"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.relationship_txt}
                                        name="relationship"
                                        placeholder={Strings.relationship_acc_pd}
                                        type="text"
                                        id="relationship"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.mobile_no_txt}
                                        name="ec_mobile_number"
                                        type="text"
                                        id="ec_mobile_number"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.email_txt}
                                        name="ec_email"
                                        placeholder={Strings.ec_email_acc_pd}
                                        type="text"
                                        id="ec_email"
                                        component={customInput} />
                                </fieldset>
                            </div>

                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.street_add_txt}
                                        name="ec_street_address"
                                        placeholder={Strings.street_address_acc_pd}
                                        type="text"
                                        id="ec_street_address"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.city_txt}
                                        name="ec_city"
                                        placeholder={Strings.city_acc_pd}
                                        type="text"
                                        id="ec_city"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.state_txt}
                                        name="ec_state"
                                        placeholder={Strings.state_acc_pd}
                                        type="text"
                                        id="ec_state"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.zip_code_no}
                                        name="ec_zip_code"
                                        type="text"
                                        id="ec_zip_code"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.country_txt}
                                        name="ec_country"
                                        type="text"
                                        id="ec_country"
                                        options={countries.map(country => ({ title: country, value: country.toString() }))}
                                        component={customCountrySelect} />
                                </fieldset>
                            </div>
                        </div>
                        <div className="all-btn d-flex justify-content-end mt-4">
                            <div className="btn-hs-icon">
                                <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                    <Icon type="save" theme="filled" /> Save</button>
                            </div>
                        </div>
                    </div>
                </div>

            </form>
        );
    }
}

const mapStateToProps = (state) => {
    let value = {}
    if (state.profileManagement && state.profileManagement.profile) {
        for (let item of state.profileManagement.profile) {
            value = {
                ...value, id: item.id, ec_full_name: item.ec_full_name, relationship: item.relationship, ec_mobile_number: item.ec_mobile_number, ec_email: item.ec_email,
                ec_street_address: item.ec_street_address, ec_city: item.ec_city, ec_state: item.ec_state, ec_zip_code: item.ec_zip_code,
                ec_country: item.ec_country
            }
        }
    }
    return {
        formValues: state.form && state.form.EmergencyContactForm &&
            state.form.EmergencyContactForm.values ? state.form.EmergencyContactForm.values : {},
        isDirty: isDirty('EmergencyContactForm')(state),
        profileComplete: state.profileManagement && state.profileManagement.profileComplete,
        profile: state.profileManagement && state.profileManagement.profile,
        initialValues: value ? value : {},
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
        form: 'EmergencyContactForm', validate: emergencyContactValidation, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(EmergencyContactForm)