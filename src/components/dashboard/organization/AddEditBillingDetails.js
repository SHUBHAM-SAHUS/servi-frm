import React from 'react';
import { Icon, Dropdown, Menu, Modal, Tooltip, notification } from 'antd';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { CustomSelect } from '../../common/customSelect';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { validate } from '../../../utils/Validations/billingValidation';
import * as orgBillingActions from "../../../actions/organizationBillingAction";
import { EWAY_CLIENT_KEY } from '../../../dataProvider/env.config';
import { detectCardType } from '../../../utils/detectCardType';
import { handleFocus, DeepTrim } from '../../../utils/common';


class AddEditBillingDetails extends React.Component {

  title = ["Mr.", "Ms.", "Mrs.", "Miss", "Dr.", "Sir.", "Prof."]

  constructor(props) {
    super(props);
    this.state = {
      months: ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
      years: this.getYears()
    }
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

  getCardType = (cardNum) => {
    let cardType = detectCardType(cardNum)
    if (cardType === "Visa") {
      return <span className='visa-card'><img alt="" src="/images/visa-icon.png" /></span>
    } else if (cardType === "mastercard") {
      return <span className='master-card'><img alt="" src="/images/master-icon.png" /></span>
    } else if (cardType === "amex") {
      return <span className='amex-card'><img alt="" src="/images/amexpress-icon.png" /></span>
    } else if (cardType === "dinner") {
      return <span className='master-card'><img alt="" src="/images/dinersclub-icons.png" /></span>
    }
  }

  handleCancel = () => {
    this.props.reset()
    this.props.handleCancel()
  }

  onSubmit = async (formData) => {
		formData = await DeepTrim(formData);
    const { organization } = this.props
    //encrypt card no & cvn
    const card_number = window.eCrypt.encryptValue(formData.card_number, EWAY_CLIENT_KEY);
    const cvn = window.eCrypt.encryptValue(formData.cvn, EWAY_CLIENT_KEY);

    let form = { ...formData, org_id: organization.id, card_number: card_number, cvn: cvn, save_card: '1' }
    this.props.orgBillingActions.updateCardDetails(form, organization.id)
      .then((flag) => {
        this.handleCancel()
        notification.success({
          message: Strings.success_title,
          description: Strings.update_payment_card_success,
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
      })
  }

  render() {
    const { handleSubmit, billingFlag, formValues } = this.props;
    return (
      <div className="sf-card mb-4" style={{ display: billingFlag == 'none' ? 'none' : 'block' }}>
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h4 className="sf-sm-hd sf-pg-heading"> {billingFlag === 'showAdd' ? Strings.add_pay_meth_title : Strings.update_pay_title}</h4>
          <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
        </div>
        <div className="sf-card-body mt-2">
          <form onSubmit={handleSubmit(this.onSubmit)} >
            <fieldset className="form-group sf-form">
              <Field
                label="Title"
                name="title"
                type="text"
                placeholder=""
                options={this.title.map(title => ({ title: title, value: title }))}
                component={CustomSelect} />
            </fieldset>
            <fieldset className="form-group sf-form">
              <Field
                label={Strings.card_name_title}
                name="card_name"
                placeholder={Strings.card_name_upi}
                type="text"
                id=""
                component={customInput} />
            </fieldset>
            <fieldset className="form-group sf-form hascarddtl">
              <Field
                label={Strings.card_number_pay}
                name="card_number"
                placeholder={Strings.card_number_upi}
                type="text"
                id=""
                maxLength={16}
                component={customInput} />
              <div className={"ewcard-icons " + detectCardType(this.props.formValues.card_number)}>
                {this.getCardType(this.props.formValues.card_number)}
              </div>
            </fieldset>
            <div className="sf-exp-dates" id="cvvTooltip">
              <div className="card-exp-drop">
                <div className="form-group sf-form">
                  <label>Expiry</label>
                  <div className="exp-slt-box">
                    <Field
                      // label='Expiry Month'
                      name='card_expiry_month'
                      type="text"
                      // placeholder={Strings.card_expiry_month_upi}
                      placeholder="mm"
                      id=""
                      options={this.state.months.map(subscript => ({ title: subscript, value: subscript }))}
                      component={CustomSelect} />
                    <Field
                      // label='Expiry Year'
                      name="card_expiry_year"
                      type="text"
                      // placeholder={Strings.card_expiry_year_upi}
                      placeholder="yy"
                      id=""
                      options={this.state.years.map(subscript =>
                        ({ title: subscript.substr(-2), value: subscript.substr(-2) }))}
                      component={CustomSelect} />
                  </div>
                </div>
              </div>
              <div className="ccv-cvc">
                <fieldset className="form-group sf-form">
                  <Field
                    label={Strings.card_cvv}
                    name="cvn"
                    type="text"
                    maxLength={3}
                    placeholder="cvv"
                    id=""
                    value="***"
                    component={customInput} />
                </fieldset>
                <span className="cvv-tooltip">
                  <Tooltip
                    placement="right"
                    title={<img src="/images/info-cvv-card.png" />}
                    getPopupContainer={() => document.getElementById('cvvTooltip')}
                  >
                    <button className="normal-bnt"><i className="material-icons">info_outline</i></button>
                  </Tooltip>
                </span>
              </div>
            </div>
            <div className="all-btn multibnt">
              <div className="btn-hs-icon d-flex justify-content-between">
                <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                  {Strings.cancel_btn}</button>
                {billingFlag === 'showAdd' ?
                  <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                    {Strings.save_btn}
                  </button> :
                  <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                    {Strings.update_btn}
                  </button>
                }
              </div>
            </div>

            {/*billingFlag == 'showAdd' ? null :
                            <div className="or-swtpay-bnt">
                                <div className="or-w-br"><span>or</span></div>
                                <button type="submit" className="bnt bnt-active">
                                    {Strings.switch_pay_mtod}
                                </button>
                            </div>
                            */}
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    billingDetails: state.organizationBilling.billingDetails,
    formValues: state.form.addEditBillingDetails && state.form.addEditBillingDetails.values ? state.form.addEditBillingDetails.values : {},
    isDirty: isDirty('addEditBillingDetails')(state),
    initialValues: {
      card_expiry_month: [],
      card_expiry_year: []
    }
  }
}

const mapDispatchToprops = dispatch => {
  return {
    orgBillingActions: bindActionCreators(orgBillingActions, dispatch)
  };
};

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'addEditBillingDetails', validate ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(AddEditBillingDetails)