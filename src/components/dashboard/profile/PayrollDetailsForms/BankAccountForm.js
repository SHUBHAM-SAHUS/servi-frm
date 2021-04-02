import React from 'react';
import { Icon, Dropdown, Menu, Modal, notification } from 'antd';
import { reduxForm, Field, isDirty } from 'redux-form';
import { backAccountValidation } from '../../../../utils/Validations/payrollDetailsVallidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../../common/custom-input';
import * as actions from '../../../../actions/profileManagementActions';
import { Strings } from '../../../../dataProvider/localize';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../../dataProvider/constant';
import { getStorage, handleFocus, DeepTrim } from '../../../../utils/common';


class BankAccountForm extends React.Component {
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

        formData = { ...formData, 'profile_progress': this.props.profileComplete }
        console.log(formData)
        this.props.action.updateUserBankDetails(formData)
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
                <div className="sf-card mt-3" >
                    <div className="sf-card-head abb-1 d-flex justify-content-between">
                        <h2 className="sf-pg-heading">{Strings.bank_account_details}
                            {/* <span className="sf-sub-hd">{Strings.bank_acc_para}</span> */}
                        </h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={this.editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        <div className="row">

                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.bank_account_name}
                                        name="bank_ac_name"
                                        placeholder={Strings.bank_ac_name_payrole}
                                        type="text"
                                        id="bank_ac_name"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.bank_name}
                                        name="bank_name"
                                        placeholder={Strings.bank_name_payrole}
                                        type="text"
                                        id="bank_name"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.bank_bsb}
                                        name="bank_bsb"
                                        placeholder={Strings.bank_bsb_payrole}
                                        type="text"
                                        id="bank_bsb"
                                        maxLength="6"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.bank_account_no}
                                        name="bank_ac_number"
                                        placeholder={Strings.bank_ac_number_payrole}
                                        type="text"
                                        id="bank_ac_number"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            {!this.confirm_bank_ac_no_flag
                                ?
                                <div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.confirm_bank_ac_no}
                                            name="cnf_bank_ac_no"
                                            placeholder="Re-enter you bank account number"
                                            type="text"
                                            id="cnf_bank_ac_no"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                                :
                                <div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form text-box-disable">
                                        <Field
                                            label={Strings.confirm_bank_ac_no}
                                            name="cnf_bank_ac_no1"
                                            placeholder="Re-enter you bank account number"
                                            type="text"
                                            disabled
                                            id="cnf_bank_ac_no"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                            }
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
    let temp = state.profileManagement && state.profileManagement.profile && state.profileManagement.profile[0];
    if (temp && temp.payroll_details) {
        value = {
            ...value, id: temp.payroll_details.id, bank_ac_name: temp.payroll_details.bank_ac_name, bank_name: temp.payroll_details.bank_name,
            bank_bsb: temp.payroll_details.bank_bsb, bank_ac_number: temp.payroll_details.bank_ac_number
        }
    }
    return {
        formValues: state.form && state.form.BankAccountForm &&
            state.form.BankAccountForm.values ? state.form.BankAccountForm.values : {},
        initialValues: (value ? value : ''),
        isDirty: isDirty('BankAccountForm')(state),
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
        form: 'BankAccountForm', validate: backAccountValidation, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(BankAccountForm)