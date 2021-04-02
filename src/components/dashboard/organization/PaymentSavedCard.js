// ViewEditOrganization
import React from 'react';
import { List, Avatar, Icon, Menu, Dropdown, Switch, Modal, Upload, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../../../utils/Validations/organizationValidaton';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../actions/paymentAction';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, PAYMENT_DETAILS, ORGANIZATIONS_LIST, SELECTED_ORG } from '../../../dataProvider/constant';
import * as authAction from '../../../actions/index';
import { getStorage, setStorage, handleFocus } from '../../../utils/common';

class PaymentSavedCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = { displayEdit: 'none', fileList: [] }
    }


    handleCancel = () => {
        Modal.confirm({
            title: Strings.warning_title,
            content: Strings.cancel_payment_warning_msg,
            cancelText: Strings.confirm_cancel_btn,
            onOk: () => {
                this.props.authAction.signOut();
                this.props.history.push({ pathname: '/signin' });
            }
        });
    }

    onSubmit = () => {
        const data = {
            total_amount: JSON.parse(getStorage(PAYMENT_DETAILS)).subscription_amount,
            org_id: JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id,
            org_user_id: JSON.parse(getStorage(ADMIN_DETAILS)).id,
            eway_token: JSON.parse(getStorage(PAYMENT_DETAILS)).eway_token
        }
        this.props.paymentAction.addPayment(data)
            .then((message) => {
                var paymentDetails = JSON.parse(getStorage(PAYMENT_DETAILS));
                paymentDetails.is_payment_due = 0;
                setStorage(PAYMENT_DETAILS, JSON.stringify(paymentDetails));

                var orgList = JSON.parse(getStorage(ORGANIZATIONS_LIST));
                orgList.forEach((org, index) => {
                    if (index.toString() === getStorage(SELECTED_ORG).toString()) {
                        org.is_payment_due = 0;
                    }
                });
                setStorage(ORGANIZATIONS_LIST, JSON.stringify(orgList));


                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                    // onOk: () => this.props.history.push('/dashboard/dashboard')
                });
                this.props.history.push('/dashboard/dashboard')
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }


    render() {
        const paymentDetails = JSON.parse(getStorage(PAYMENT_DETAILS))
        const cardDetails = paymentDetails.card_details;
        return (

            <div>
                <div className="main-container">
                    <div className="row justify-content-center">
                        <div className="col-sm-12 col-md-6 col-lg-6">
                            <div className="sf-card sf-mcard">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">{Strings.add_pay_meth_title}</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body">

                                    <h2 className="due-pay"> {Strings.payment_due_text}
                                        <span>{paymentDetails.subscription_amount}</span></h2>
                                    <div className="saved-pay-card">
                                        <div className="sp-card-dtl">
                                            <label>Card Number</label>
                                            <span>{cardDetails.Number}</span>
                                        </div>
                                        <div className="sp-card-dtl">
                                            <label>Card On Name</label>
                                            <span>{cardDetails.Name}</span>
                                        </div>
                                        <div className="row spdts">
                                            <div className="col-md-6">
                                                <div className="sp-card-dtl">
                                                    <label>Expiry</label>
                                                    <span>{cardDetails.ExpiryMonth} / {cardDetails.ExpiryYear}</span>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                <div className="sp-card-dtl">
                                                    <label>cvv</label>
                                                    <span>xxxx</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="all-btn multibnt payment-bnt">
                                        <div className="btn-hs-icon d-flex justify-content-end">
                                            <button onClick={
                                                () => this.props.history.push('/dashboard/AddPaymentDetails')
                                            } className="bnt bnt-normal" type='button'>
                                                {Strings.new_card_btn}</button>
                                            <button onClick={this.handleCancel} className="bnt bnt-normal" type='button'>
                                                {Strings.cancel_btn}</button>
                                            <button type="submit" onClick={this.onSubmit} className="bnt bnt-active">
                                                {Strings.pay_btn}</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
    }
}

const mapDispatchToprops = dispatch => {
    return {
        authAction: bindActionCreators(authAction, dispatch),
        paymentAction: bindActionCreators(actions, dispatch),
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'paymentSavedCard', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    } })
)(PaymentSavedCard)