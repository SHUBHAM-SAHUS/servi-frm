import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Modal, notification } from 'antd';
import { Strings } from '../../dataProvider/localize';
import * as actions from '../../actions';
import { customInput } from '../common/custom-input';
import { validate } from '../../utils/validations';
import { handleFocus, DeepTrim } from '../../utils/common';

class VerifyAttributes extends React.Component {
    constructor(props) {
        super(props);
    }

    onSubmit = async (formData) => {
		formData = await DeepTrim(formData);

        let data;
        const query = new URLSearchParams(this.props.location.search);
        const attribute = query.get('attr');
        const userName = query.get('user_name');
        if (attribute == 'PHONE') {
            data = { phone_code: formData.login_code, user_name: userName }
        } else {
            data = { email_code: formData.login_code, user_name: userName }
        }

        this.props.actions.verifyAttributes(data).then((message) => {
            //success
            notification.success({
                message: Strings.success_title,
                description: message ? message : Strings.verify_account_msg,
                // onOk: () => this.props.history.push('/signin')
                onClick: () => { },
				className: 'ant-success'
            })
            this.props.history.push('/signin')
            this.props.actions.cleanErrorMsg()

        }).catch((message) => {
            //error
            notification.error({
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
				className: 'ant-error'
                // onOk: () => this.props.history.push('/signin')
            })
            this.props.history.push('/signin')
        });
    }

    render() {
        const query = new URLSearchParams(this.props.location.search);
        const attribute = query.get('attr');
        const { handleSubmit } = this.props;
        let headerStr = 'Verify ' + (attribute == 'PHONE' ? 'Phone' : 'Email')
        return (
            <div>
                <div className="sf-login">
                    <img className="sf-logo" src="../images/service_form_big.png" alt="SF logo" />
                    <h2 className="sf-lg-heading">{headerStr}</h2>
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <fieldset className="passTxtbox fldset-box">
                            <svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
                            <Field
                                name="login_code"
                                type="text"
                                label={Strings.verify_account_placeholder_otp}
                                placeholder={Strings.verify_account_placeholder_otp}
                                component={customInput} />
                        </fieldset>

                        {this.props.errorMessage ?
                            <div className="alert alert-danger">
                                {this.props.errorMessage}
                            </div> : null}
                        <button type="submit" className="sf-btn">{Strings.verify_account_btn_submit}</button>
                    </form>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        errorMessage: state.auth.errorMessage,
        secondStepStatus: state.auth.secondStepStatus
    }
}

const mapDispatchToprops = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'VerifyAttributes', validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    } })
)(VerifyAttributes)