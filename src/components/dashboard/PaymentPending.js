// ViewEditOrganization
import React from 'react';
import { Modal, } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../../utils/Validations/billingValidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../actions/paymentAction';
import { Strings } from '../../dataProvider/localize';
import * as authAction from '../../actions/index';
import { handleFocus } from '../../utils/common';

class PaymentPending extends React.Component {
  constructor(props) {
    super(props);
    this.state = { displayEdit: 'none', fileList: [] }
  }


  render() {
    const { handleSubmit } = this.props;
    return (

      <div>

        <div className="main-container">
          <div className="row justify-content-center">
            <div className="col-sm-12 col-md-6 col-lg-6">
              <div className="sf-card sf-mcard">
                <div className="sf-card-body">
                  Payment required, please contact your Service Farm administrator.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {

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
  reduxForm({ form: 'PaymentPending', validate, enableReinitialize: true ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(PaymentPending)