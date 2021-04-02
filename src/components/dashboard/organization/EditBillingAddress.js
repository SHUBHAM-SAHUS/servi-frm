import React from 'react';
import { Icon, Modal, notification } from 'antd';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { billingAddressValidate } from '../../../utils/Validations/billingValidation';
import * as orgBillingActions from "../../../actions/organizationBillingAction";
import { customTextarea } from '../../common/customTextarea';
import { handleFocus, DeepTrim } from '../../../utils/common';

class EditBillingAddress extends React.Component {

    onSubmit = async (formData) => {
		formData = await DeepTrim(formData);

        const { organization } = this.props
        this.props.orgBillingActions.updateBillingAddress(formData, organization.id)
            .then((flag) => {
                this.handleCancel()
                notification.success({
                    message: Strings.success_title,
                    description: Strings.update_billing_address_success_msg,
                    onClick: () => { },
                    className: 'ant-success'
                });
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }

    handleCancel = () => {
        this.props.reset()
        this.props.handleCancel()
    }

    render() {
        const { handleSubmit, addressInfoFlag } = this.props;
        return (
            <div className="sf-card mb-4" style={{ display: addressInfoFlag }}>
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h4 className="sf-sm-hd sf-pg-heading">Update Billing Info</h4>
                    <button class="closed-btn" onClick={this.props.handleCancel}><Icon type="close" /></button>
                </div>
                <div className="sf-card-body mt-2">
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.org_email}
                                name="billing_email_address"
                                placeholder={Strings.billing_email_address_org}
                                type="text"
                                id=""
                                component={customInput} />
                        </fieldset>

                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.org_address}
                                name="billing_address"
                                placeholder={Strings.billing_address_org}
                                type="text"
                                id="address"
                                component={customTextarea} />

                        </fieldset>

                        <div className="all-btn multibnt">
                            <div className="btn-hs-icon d-flex justify-content-between">
                                <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                                    {Strings.cancel_btn}</button>
                                <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                    {Strings.update_btn}</button>
                            </div>
                        </div>

                    </form>
                </div>
                {/**Subscription Details */}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        billingDetails: state.organizationBilling.billingDetails,
        initialValues: state.organizationBilling.billingDetails,
        isDirty: isDirty('editBillingAddress')(state),
    }
}

const mapDispatchToprops = dispatch => {
    return {
        orgBillingActions: bindActionCreators(orgBillingActions, dispatch)
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'editBillingAddress', validate: billingAddressValidate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    } })
)(EditBillingAddress)