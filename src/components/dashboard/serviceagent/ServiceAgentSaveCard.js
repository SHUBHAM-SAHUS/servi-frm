// ViewEditOrganization
import React from 'react';
import { Modal, Dropdown, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
//import { validate } from '../../../utils/Validations/organizationValidaton';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import { CustomSwitch } from '../../common/customSwitch';
import { validate } from '../../../utils/Validations/billingValidation';
import * as actions from '../../../actions/paymentAction';
import { Strings } from '../../../dataProvider/localize';
import { EWAY_CLIENT_KEY } from '../../../dataProvider/env.config';
import { detectCardType } from '../../../utils/detectCardType';
import * as organizationAction from '../../../actions/organizationAction';
import { handleFocus, DeepTrim } from '../../../utils/common';

class ServiceAgentSaveCard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayEdit: 'none',
            fileList: [],
            disablePay: false,
        }
    }

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);
        this.setState({ disablePay: true, })
        const selectedSubscription = this.props.subscriptions.find(subscript => subscript.subscription_id === this.props.subscriptionID)

        var tempFormData = { ...formData };
        tempFormData.subscription_id = this.props.subscriptionID;
        tempFormData.total_amount = selectedSubscription.amount;
        tempFormData.save_card = +tempFormData.save_card;
        tempFormData.card_number = window.eCrypt.encryptValue(tempFormData.card_number, EWAY_CLIENT_KEY);
        tempFormData.cvn = window.eCrypt.encryptValue(tempFormData.cvn, EWAY_CLIENT_KEY);
        this.props.paymentAction.addPayment(tempFormData).then((message) => {
            //this.props.reset();
            this.setState({ disablePay: false, })
            this.props.organizationAction.getServiceAgent()
            notification.success({
                message: Strings.success_title,
                description: message,
                onClick: () => { },
                className: 'ant-success'
                // onOk: () => this.props.dissmissSubscriptionPayment()
            });
            this.props.dissmissSubscriptionPayment()
        }).catch((message) => {
            this.setState({ disablePay: false, })
            notification.error({
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
            });
        });
    }

    getYears() {
        let currentYear = new Date().getFullYear()
        let yearArray = [];
        for (var i = 0; i < 20; i++) {
            yearArray.push(currentYear.toString())
            currentYear = currentYear + 1;
        }
        return yearArray
    }

    months = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
    title = ["Mr.", "Ms.", "Mrs.", "Miss", "Dr.", "Sir.", "Prof."]

    showSavedCardPage = () => {
        this.props.showCard()
    }

    render() {
        const { handleSubmit } = this.props;
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
                    <h2 className="due-pay">{Strings.payment_due_text} <span>{this.props.initialValues.total_amount}</span></h2>

                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <div className="saved-pay-card add-nm-card">
                            <div className="row">
                                <div className="col-md-3 col-xs-6">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label="Title"
                                            name="titlex"
                                            type="text"
                                            placeholder="mm"
                                            options={this.title.map(title => ({ title: title, value: title }))}
                                            component={CustomSelect} />
                                    </fieldset>
                                </div>
                                <div className="col-md-9 col-xs-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.card_name_title}
                                            name="card_name"
                                            type="text"
                                            id=""
                                            component={customInput} />
                                    </fieldset>
                                </div>
                            </div>

                            <fieldset className="form-group sf-form hascarddtl">
                                <Field
                                    label={Strings.card_number_pay}
                                    name="card_number"
                                    type="text"
                                    id=""
                                    component={customInput} />
                                <div className={"ewcard-icons " + detectCardType(this.props.formValues.card_number)}>
                                    <span className='visa-card'><img src="/images/visa-icon.png" /></span>
                                    <span className='master-card'><img src="/images/master-icon.png" /></span>
                                    <span className='amex-card'><img src="/images/amexpress-icon.png" /></span>
                                    <span className='dinner-card'><img src="/images/dinersclub-icons.png" /></span>
                                </div>
                            </fieldset>

                            <div className="row">
                                <div className="col-md-8">
                                    <div className="form-group sf-form">
                                        <label>{Strings.card_expdate}</label>
                                        <div className="time-o-dtl pay-date-slt">
                                            <Field
                                                name="card_expiry_month"
                                                type="text"
                                                placeholder="mm"
                                                options={this.months.map(month => ({ title: month, value: month }))}
                                                component={CustomSelect} />
                                            <Field
                                                name="card_expiry_year"
                                                type="text"
                                                placeholder="yy"
                                                options={this.getYears().map(year => ({ title: year.substr(-2), value: year.substr(-2) }))}
                                                component={CustomSelect} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.card_cvv}
                                            name="cvn"
                                            type="text"
                                            placeholder="cvv"
                                            id=""
                                            component={customInput} />
                                    </fieldset>
                                </div>
                            </div>

                            <fieldset className="form-group sf-form">
                                <Field
                                    label={Strings.save_card}
                                    name="save_card"
                                    component={CustomSwitch} />
                            </fieldset>
                        </div>

                        <div className="all-btn multibnt payment-bnt">
                            <div className="btn-hs-icon d-flex justify-content-end">
                                {(this.props.billingDetails.card_details != null) ?
                                    <button onClick={this.showSavedCardPage} className="bnt bnt-normal" type='button'>
                                        {Strings.saved_card_btn}</button> :
                                    null}

                                <button onClick={this.props.dissmissSubscriptionPayment} className="bnt bnt-normal" type='button'>
                                    {Strings.cancel_btn}</button>
                                <button type="submit" disabled={this.state.disablePay} className="bnt bnt-active">
                                    {Strings.pay_btn}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    const selectedSubscription = state.subscription.subscriptions.find(subscript => subscript.subscription_id === ownProps.subscriptionID)
    return {
        subscriptions: state.subscription.subscriptions,
        initialValues: {
            total_amount: selectedSubscription ? selectedSubscription.amount : null,
            org_id: ownProps.agentID,//JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).id : null,
            //org_user_id: JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).id : null,
        },
        formValues: state.form.addPaymentDetails ? state.form.addPaymentDetails.values : {},
        billingDetails: state.organizationBilling.billingDetails,

    }
}

const mapDispatchToprops = dispatch => {
    return {
        paymentAction: bindActionCreators(actions, dispatch),
        organizationAction: bindActionCreators(organizationAction, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'ServiceAgentSaveCard', validate: validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(ServiceAgentSaveCard)