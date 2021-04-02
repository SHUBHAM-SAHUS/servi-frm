import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Icon, notification } from 'antd';
import { Strings } from '../../dataProvider/localize';
import * as actions from '../../actions';
import { customInput } from '../common/custom-input';
import { validate } from '../../utils/validations';
import {
	JWT_ACCESS_TOKEN,
	JWT_ID_TOKEN,
	JWT_SESSION_TOKEN
} from '../../dataProvider/constant';
import { goBack, handleFocus } from '../../utils/common'
import { removeLoginData } from '../../utils/sessions'
import { getStorage, authRedirect } from '../../utils/common';


class SignInCode extends React.Component {
	constructor(props) {
		super(props);
		this.onSubmit = this.onSubmit.bind(this);
	}

	onSubmit(formData) {
		this.props.signInNextStep(formData)
			.then((flag) => {
				this.props.cleanErrorMsg()
				if (this.props.secondStepStatus && getStorage(JWT_ACCESS_TOKEN) && getStorage(JWT_ID_TOKEN)) {
					this.props.history.push('/dashboard');
				} else if (!getStorage(JWT_SESSION_TOKEN)) {
					this.props.history.push('/signin')
				}
			})
			.catch((message) => {
				notification.error({
					message: Strings.error_title,
					description: message ? message : Strings.generic_error,
					onClick: () => { },
                    className: 'ant-error'
				})
			});
	}
	componentDidMount() {
		authRedirect(this.props.history);
	}
	handleGoBack = () => {
		removeLoginData();
		goBack(this.props);
	}

	render() {
		const { handleSubmit } = this.props;
		return (
			<div>
				<div className="sf-login">
					<img className="sf-logo" src="../images/service_form_big.png" alt="SF logo" />
					<h2 className="sf-lg-heading">{Strings.login_code_title}</h2>
					<form onSubmit={handleSubmit(this.onSubmit)}>
						<fieldset className="passTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
							<Field
								name="login_code"
								type="text"
								id="login_code"
								label={Strings.login_code_placeholder_enter_code}
								placeholder={Strings.login_code_placeholder_enter_code}
								component={customInput} />
						</fieldset>

						{this.props.errorMessage ?
							<div className="alert alert-danger">
								{this.props.errorMessage}
							</div> : null}
						<button type="submit" className="sf-btn">{Strings.login_code_btn_sign_in}</button>
					</form>
					<div className="pre-login-left-arrow">
						<Icon type="arrow-left" onClick={this.handleGoBack} />
					</div>
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

export default compose(
	connect(mapStateToProps, actions),
	reduxForm({ form: 'Signincode', validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    } })
)(SignInCode)