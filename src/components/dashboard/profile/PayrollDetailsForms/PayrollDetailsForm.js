import React from 'react';
import { Icon, Dropdown, Menu, Modal, notification } from 'antd';
import { reduxForm, Field, isDirty } from 'redux-form';
import { pyrollDetailsValidation } from '../../../../utils/Validations/payrollDetailsVallidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../../common/custom-input';
import * as actions from '../../../../actions/profileManagementActions';
import { Strings } from '../../../../dataProvider/localize';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../../dataProvider/constant';
import { getStorage, handleFocus, DeepTrim } from '../../../../utils/common';
import { isNumber, isValidABN } from '../../../../utils/Validations/scopeDocValidation';

class PayrollDetailsForm extends React.Component {
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

        // formData = { ...formData, 'phone_no': formData.phone_number, 'org_id': this.org_user_id, 'user_name': this.org_user_name, 'profile_progress': this.props.profileComplete }
        formData = { ...formData, 'profile_progress': this.props.profileComplete }

        console.log(formData)
        this.props.action.updateUserPayroll(formData)
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
            <form onSubmit={handleSubmit(this.onSubmit)
            } >

                {/* Personal Details */}

                <div className="sf-card" >
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.tab_payroll_dtl}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={this.editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        <div className="row">

                            {/* <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.employment_commenced_txt}
                                        name="emp_commenced"
                                        type="text"
                                        id="emp_commenced"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.employment_status}
                                        name="emp_status"
                                        type="text"
                                        id="emp_status"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.employment_type}
                                        name="emp_type"
                                        type="text"
                                        id="emp_type"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.hrs_of_work_week}
                                        name="hrs_of_work_week"
                                        type="text"
                                        id="hrs_of_work_week"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.regular_hrs_rate}
                                        name="regular_hrs_rate"
                                        type="text"
                                        id="regular_hrs_rate"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.overtime_hrs_rate}
                                        name="overtime_hrs_rate"
                                        type="text"
                                        id="overtime_hrs_rate"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.double_ov_hr_rate}
                                        name="double_ov_hr_rate"
                                        type="text"
                                        id="double_ov_hr_rate"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.agreed_pay_period}
                                        name="agreed_pay_period"
                                        type="text"
                                        id="agreed_pay_period"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.agreed_pay_day}
                                        name="agreed_pay_day"
                                        type="text"
                                        id="agreed_pay_day"
                                        component={customInput} />
                                </fieldset>
                            </div> */}
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.abn_txt}
                                        name="abn"
                                        placeholder={Strings.abn_payrole}
                                        type="text"
                                        id="abn"
                                        validate={this.props.formValues.abn !== undefined && this.props.formValues.abn !== '' ? isValidABN : []}
                                        maxLength="11"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.tfn_txt}
                                        name="tfn"
                                        placeholder={Strings.tfn_payrole}
                                        type="text"
                                        id="tfn"
                                        validate={isNumber}
                                        maxLength="9"
                                        component={customInput} />
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
    let temp = state.profileManagement && state.profileManagement.profile && state.profileManagement.profile[0];
    if (temp && temp.payroll_details) {
        value = { ...value, id: temp.payroll_details.id, abn: temp.payroll_details.abn, tfn: temp.payroll_details.tfn }
    }

    /*  if (value && value.phone_no) {
         value = { ...value, phone_number: value && value.phone_no }
     } */

    return {
        formValues: state.form && state.form.PayrollDetailsForm &&
            state.form.PayrollDetailsForm.values ? state.form.PayrollDetailsForm.values : {},
        initialValues: (value ? value : ''),
        isDirty: isDirty('PayrollDetailsForm')(state),
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
        form: 'PayrollDetailsForm', validate: pyrollDetailsValidation, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(PayrollDetailsForm)