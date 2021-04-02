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
import { residentialAddressValidation } from '../../../../utils/Validations/profileValidation';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';
import { CustomCheckbox } from '../../../common/customCheckbox';

class ResidentialAddressForm extends React.Component {

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

    componentDidMount(){
        this.props.action.getStates()
    }

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);
        formData = { ...formData, 'profile_progress': this.props.profileComplete }

        this.props.action.updateOrgUserResidentialAddress(formData)
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
        const { handleSubmit, initialValues, statesList } = this.props;
        const editMenu = (
            <Menu>
                <Menu.Item></Menu.Item>
            </Menu>
        )

        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>

                <div className="sf-card mt-3">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.res_address_txt}</h2>
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
                                        label={Strings.street_add_txt}
                                        name="street_address"
                                        placeholder={Strings.street_address_acc_pd}
                                        type="text"
                                        id="street_address"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.city_txt}
                                        name="city"
                                        placeholder={Strings.city_acc_pd}
                                        type="text"
                                        id="city"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.state_txt}
                                        name="state_id"
                                        placeholder={Strings.state_acc_pd}
                                        options={statesList.map(state=>({title: state.name, value: state.id}))}
                                        component={CustomSelect} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label="Suburb"
                                        name="suburb"
                                        type="text"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.zip_code_no}
                                        name="zip_code"
                                        type="text"
                                        id="zip_code"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.country_txt}
                                        name="country"
                                        type="text"
                                        id="country"
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
                ...value, id: item.id, street_address: item.street_address, city: item.city, state: item.state, zip_code: item.zip_code,
                country: item.country
            }
        }
    }
    return {
        formValues: state.form && state.form.ResidentialAddressForm &&
            state.form.ResidentialAddressForm.values ? state.form.ResidentialAddressForm.values : {},
        isDirty: isDirty('ResidentialAddressForm')(state),
        profileComplete: state.profileManagement && state.profileManagement.profileComplete,
        profile: state.profileManagement && state.profileManagement.profile,
        initialValues: value ? value : {},
        statesList: state.profileManagement.statesList,
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
        form: 'ResidentialAddressForm', validate: residentialAddressValidation, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(ResidentialAddressForm)