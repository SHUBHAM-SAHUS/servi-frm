// ViewEditOrganization
import React from 'react';
import { Modal, Dropdown, notification } from 'antd';
import { reduxForm } from 'redux-form';
import { validate } from '../../../utils/Validations/organizationValidaton';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../actions/paymentAction';
import * as organizationAction from '../../../actions/organizationAction';
import { Strings } from '../../../dataProvider/localize';
import { handleFocus } from '../../../utils/common';


class ServiceAgentMakePayment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayDifferentCard: false,
            fileList: [],
            disablePay: false,
        }
    }


    showDifferentCard = () => {
        this.props.showDifferentCard()
    }

    onSubmit = () => {
        this.setState({ disablePay: true, })
        const selectedSubscription = this.props.subscriptions.find(subscript => subscript.subscription_id === this.props.subscriptionID)
        const data = {
            subscription_id: this.props.subscriptionID,
            total_amount: selectedSubscription.amount,
            org_id: this.props.agentID,//JSON.parse(getStorage(ADMIN_DETAILS)).id,
            //org_user_id: JSON.parse(getStorage(ADMIN_DETAILS)).id,
            eway_token: this.props.billingDetails.card_details.eway_token,
        }
        this.props.paymentAction.addPayment(data)
            .then((message) => {
                this.props.organizationAction.getServiceAgent()
                this.setState({ disablePay: false })
                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                    // onOk: () => this.props.dissmissSubscriptionPayment()
                });
                this.props.dissmissSubscriptionPayment()
            }).catch((message) => {
                this.setState({ disablePay: false })
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }


    render() {
        const cardDetails = this.props.billingDetails.card_details;
        const selectedSubscription = this.props.subscriptions.find(subscript => subscript.subscription_id === this.props.subscriptionID)
        return (
            <div className="sf-card sf-mcard">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.add_pay_meth_title}</h2>
                    <div className="info-btn disable-dot-menu">
                        <Dropdown className="more-info" disabled>
                            <i className="material-icons">more_vert</i>
                        </Dropdown>
                    </div>>
                </div>
                <div className="sf-card-body">

                    <h2 className="due-pay"> {Strings.payment_due_text}
                        <span>{selectedSubscription ? selectedSubscription.amount : ''}</span></h2>
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
                            <button className="bnt bnt-normal" type='button' onClick={this.showDifferentCard}>
                                {Strings.new_card_btn} </button>
                            <button onClick={this.props.dissmissSubscriptionPayment} className="bnt bnt-normal" type='button'>
                                {Strings.cancel_btn}</button>
                            <button type="submit" disabled={this.state.disablePay} onClick={this.onSubmit} className="bnt bnt-active">
                                {Strings.pay_btn}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        billingDetails: state.organizationBilling.billingDetails,
        subscriptions: state.subscription.subscriptions,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        //authAction: bindActionCreators(authAction, dispatch),
        paymentAction: bindActionCreators(actions, dispatch),
        organizationAction: bindActionCreators(organizationAction, dispatch)
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'ServiceAgentMakePayment', validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(ServiceAgentMakePayment)