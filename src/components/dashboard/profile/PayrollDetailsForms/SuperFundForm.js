import React from 'react';
import { Icon, Dropdown, Menu, Modal, notification } from 'antd';
import { reduxForm, Field, isDirty } from 'redux-form';
import { superFundValidation } from '../../../../utils/Validations/payrollDetailsVallidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../../common/custom-input';
import * as actions from '../../../../actions/profileManagementActions';
import { Strings } from '../../../../dataProvider/localize';
import { CustomCheckbox } from '../../../../components/common/customCheckbox';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../../dataProvider/constant';
import { getStorage, handleFocus, DeepTrim } from '../../../../utils/common';

class SuperFundForm extends React.Component {
    paymentMothod = ['eWAY']
    confirm_bank_ac_no_flag = true
    constructor(props) {
        super(props);
        this.state = {
            // checked: false,
            // superfundprovider: 'block'
        }

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    // more info
    editMenu = (
        <Menu>
            <Menu.Item onClick={this.handleEditClick}>{Strings.menu_edit_org}</Menu.Item>
        </Menu>
    )

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);

        if (formData.is_super_ac) {
            formData = { ...formData, fund_name: null, fund_abn: null, usi: null, phone_number: null, payment_method: null, bsb: null, ac_no: null, ac_name: null }
            this.props.change('fund_name', null)
            this.props.change('fund_abn', null)
            this.props.change('usi', null)
            this.props.change('phone_number', null)
            this.props.change('payment_method', null)
            this.props.change('bsb', null)
            this.props.change('ac_no', null)
            this.props.change('ac_name', null)
        }

        formData = { ...formData, 'phone_no': formData.phone_number, 'org_id': this.org_user_id, 'user_name': this.org_user_name, 'profile_progress': this.props.profileComplete }
        delete formData.phone_number
        console.log(formData)
        this.props.action.updateUserSuperFund(formData)
            .then(flag => {
                notification.success({
                    message: Strings.success_title,
                    description: flag,
                    onClick: () => { },
                    className: 'ant-success'
                });
                this.props.action.getOrgUserDetails(this.org_user_id, this.org_user_name);
            }).catch((error) => {
                if (error.status === VALIDATE_STATUS) {
                    notification.warning({
                        message: Strings.validate_title,
                        description: error && error.data && typeof error.data.message == 'string'
                            ? error.data.message : Strings.generic_validate,
                        onClick: () => { },
                        className: 'ant-success'
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

    componentDidMount() {
        if (this.props.initialValues && this.props.initialValues.is_super_ac === 1) {
            this.setState({
                superfundprovider: 'none'
            })
        } else {
            this.setState({
                superfundprovider: 'block'
            })
        }
    }

    componentDidUpdate(prevProps, prevState) {
        if (this.props.initialValues.bank_ac_number !== parseInt(this.props.formValues.bank_ac_number)) {
            this.confirm_bank_ac_no_flag = false
        }
        if (this.props.initialValues.bank_ac_number === parseInt(this.props.formValues.bank_ac_number)) {
            this.confirm_bank_ac_no_flag = true
        }
    }

    handleChecked = (e) => {
        console.log(e.target.checked)
        if (!e.target.checked) {
            this.setState({
                superfundprovider: 'block'
            })
        } else {
            this.setState({
                superfundprovider: 'none'
            })
        }
    }

    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit)} >

                {/* Super Fund Provider */}

                <div className="sf-card mt-3" >
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.super_fund_provider}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={this.editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    {this.state.superfundprovider === 'block' ?
                        <div className="sf-card-body mt-2 pb-0" style={{ display: this.state.superfundprovider }}>
                            <div className="row">

                                <div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.fund_name}
                                            name="fund_name"
                                            type="text"
                                            id="fund_name"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                                <div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.fund_abn}
                                            name="fund_abn"
                                            type="text"
                                            id="fund_abn"
                                            maxLength="11"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                                <div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.usi_txt}
                                            name="usi"
                                            type="text"
                                            id="usi"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                                <div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.phone_no_txt}
                                            name="phone_number"
                                            type="text"
                                            id="phone_number"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                                {/* <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.payment_method_txt}
                                        name="payment_method"
                                        placeholder="Select Payment Method"
                                        type="text"
                                        id="payment_method"
                                        options={this.paymentMothod && this.paymentMothod.map((pay) => ({
                                            title: pay,
                                            value: pay
                                        }))}
                                        component={CustomSelect} />
                                </fieldset>
                            </div> */}
                                <div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.bsb_txt}
                                            name="bsb"
                                            type="text"
                                            id="bsb"
                                            maxLength="6"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                                <div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.account_no_txt}
                                            name="ac_no"
                                            type="text"
                                            id="ac_no"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                                <div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.account_name_txt}
                                            name="ac_name"
                                            type="text"
                                            id="ac_name"
                                            component={customInput} />
                                    </fieldset>
                                </div>

                                {/* <div className="col-lg-12">
                                <div className="sf-chkbx-group">
                                    <Field
                                        name="read_only"
                                        label={Strings.super_acc_check}
                                        checked={this.state.checked}
                                        onChange={this.handleChecked}
                                        component={CustomCheckbox} />
                                </div>
                            </div> */}

                            </div>

                        </div>
                        :
                        ''
                    }
                    <div className="col-lg-12 col-lg-12 py-3">
                        <div className="sf-chkbx-group">
                            <Field
                                name="is_super_ac"
                                label={Strings.super_acc_check}
                                // checked={this.state.checked}
                                onChange={this.handleChecked}
                                component={CustomCheckbox} />
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
    // var value = state.profileManagement && state.profileManagement.profile && state.profileManagement.profile[0]
    //     && state.profileManagement.profile[0].payroll_details;
    // if (value && value.phone_no) {
    //     value = { ...value, phone_number: value && value.phone_no }
    // }
    let value = {}
    let temp = state.profileManagement && state.profileManagement.profile && state.profileManagement.profile[0];
    if (temp && temp.payroll_details) {
        value = {
            ...value, id: temp.payroll_details.id, fund_name: temp.payroll_details.fund_name, fund_abn: temp.payroll_details.fund_abn,
            usi: temp.payroll_details.usi, phone_number: temp.payroll_details.phone_no, bsb: temp.payroll_details.bsb,
            ac_no: temp.payroll_details.ac_no, ac_name: temp.payroll_details.ac_name, is_super_ac: temp.payroll_details.is_super_ac
        }
    }

    return {
        formValues: state.form && state.form.SuperFundForm &&
            state.form.SuperFundForm.values ? state.form.SuperFundForm.values : {},
        initialValues: (value ? value : ''),
        isDirty: isDirty('SuperFundForm')(state),
        profileComplete: state.profileManagement && state.profileManagement.profileComplete
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
        form: 'SuperFundForm', validate: superFundValidation, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(SuperFundForm)