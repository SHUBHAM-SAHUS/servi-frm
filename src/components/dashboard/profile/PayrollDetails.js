import React from 'react';
import { Icon, Dropdown, Menu, Modal, notification } from 'antd';
import { reduxForm, Field, isDirty } from 'redux-form';
import { pyrollDetailsValidation } from '../../../utils/Validations/payrollDetailsVallidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import * as actions from '../../../actions/profileManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { CustomCheckbox } from '../../../components/common/customCheckbox';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../utils/common';
import { isNumber, isValidABN } from '../../../utils/Validations/scopeDocValidation';
import { DeepTrim } from '../../../utils/common';
import PayrollDetailsForm from './PayrollDetailsForms/PayrollDetailsForm';
import SuperFundForm from './PayrollDetailsForms/SuperFundForm';
import BankAccountForm from './PayrollDetailsForms/BankAccountForm';

class PayrollDetails extends React.Component {
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

    render() {
        return (
            <form>
                {/* Payroll Details */}
                <div>
                    <PayrollDetailsForm />
                </div>

                {/* Super Fund Provider */}
                <div>
                    <SuperFundForm />
                </div>

                {/* Bank Account Details */}
                <div>
                    <BankAccountForm />
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    var value = state.profileManagement && state.profileManagement.profile && state.profileManagement.profile[0]
        && state.profileManagement.profile[0].payroll_details;
    if (value && value.phone_no) {
        value = { ...value, phone_number: value && value.phone_no }
    }

    return {
        formValues: state.form && state.form.PayrollDetails &&
            state.form.PayrollDetails.values ? state.form.PayrollDetails.values : {},
        initialValues: (value ? value : ''),
        isDirty: isDirty('PayrollDetails')(state),
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
        form: 'PayrollDetails', enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(PayrollDetails)