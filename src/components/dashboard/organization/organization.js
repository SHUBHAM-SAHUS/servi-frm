import React from 'react';
import { Icon, Modal, Progress, notification } from 'antd';
import { connect } from 'react-redux';
import * as orgUserActions from '../../../actions/organizationUserAction';
import ViewEditOrganization from './ViewEditOrganization';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import * as orgActions from '../../../actions/organizationAction';
import * as orgBillingActions from "../../../actions/organizationBillingAction";
import { bindActionCreators } from 'redux';
import { goBack } from '../../../utils/common';
import { getStorage } from '../../../utils/common'
import { ERROR_NOTIFICATION_KEY } from '../../../config';

class Organization extends React.Component {
  constructor(props) {
    super(props);
    var organId = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null
    const fetchDetails = [
      this.props.organizationAction.getOrganization(),
      this.props.billingAction.getOrganizationBillingDetails(organId),
      this.props.orgUserAction.getOrganizationUsers(organId),
    ]
    this.state = {}
    Promise.all(fetchDetails.map(singleFetch => {
      return singleFetch
        .then(() => { })
    }))
      .then(() => { })
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
    // this.props.organizationAction.getOrganization();
    // this.props.billingAction.getOrganizationBillingDetails(organId);
    // this.props.orgUserAction.getOrganizationUsers(organId);
  }

  componentWillReceiveProps(props) {
    this.state.formCompletion = 78;
    this.state.billingSection = false;
    var values = {}
    if (props.formValues && props.formValues.values) {
      values = props.formValues.values
    }
    if (props.billingDetails.billing_email_address && props.billingDetails.billing_address) {
      this.state.formCompletion = 100;
      this.state.billingSection = true;
    } else {
      if (values.billing_email_address && values.billing_address)
        this.state.billingSection = true;
      var percentage = 0;
      percentage = (Object.keys(values)
        .filter(key => ((key === 'billing_email_address' && values[key]) || (key === 'billing_address' && values[key]))).length) * 11;
      this.state.formCompletion += percentage
    }

  }

  render() {

    return (
      <div>
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            {Strings.org_title}
          </h2>
          <div className="sf-steps-status" >
            <div className="sf-steps-row">
              <div className={"sf-st-item active"}>
                <div className="iconbx">
                  <i className="material-icons">assignment</i>
                </div>
                <span>{Strings.org_wizard_detail}</span>
              </div>
              <div className={this.state.billingSection ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i className="material-icons">attach_money</i>
                </div>
                <span>{"Billing"}</span>
              </div>
              <div className={"sf-st-item active"}>
                <div className="iconbx">
                  <i className="material-icons">group</i>
                </div>
                <span>{Strings.org_wizard_user}</span>
              </div>
              <div className={"sf-st-item active"}>
                <div className="iconbx">
                  <i className="material-icons">subscriptions</i>
                </div>
                <span>{Strings.org_wizard_sub}</span>
              </div>
            </div>
            <div className="sf-st-item sf-prog">
              <Progress type="circle" strokeColor={'#03a791'} width={40} strokeWidth={12} percent={this.state.formCompletion} format={
                (percent) => percent + '%'} />
              <span>{Strings.org_wizard_progress}</span>
            </div>
          </div>
          <div />
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            {/* center section  */}
            <ViewEditOrganization history={this.props.history} />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToprops = dispatch => {
  return {
    organizationAction: bindActionCreators(orgActions, dispatch),
    orgUserAction: bindActionCreators(orgUserActions, dispatch),
    billingAction: bindActionCreators(orgBillingActions, dispatch)
  }
}
const mapStateToProps = (state) => {
  return {
    billingDetails: state.organizationBilling.billingDetails,
    formValues: state.form.editBillingAddress,
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(Organization)