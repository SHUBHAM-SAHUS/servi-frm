import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Icon, notification } from 'antd';
import {
	JWT_SESSION_TOKEN,
	JWT_ACCESS_TOKEN,
	JWT_ID_TOKEN,
	MFA_STA
} from '../../dataProvider/constant';
import * as actions from '../../actions';
import { customInput } from '../common/custom-input';
import { validate } from '../../utils/validations';
import PasswordStrengthMeter from '../common/PasswordStrengthMeter';
import { Strings } from '../../dataProvider/localize';
import { goBack, handleFocus } from '../../utils/common'
import { removeLoginData } from '../../utils/sessions'
import { getStorage, authRedirect } from '../../utils/common';
import { DeepTrim } from '../../utils/common';


class SignUp extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			confirmPassword: ''
		}
		this.onSubmit = this.onSubmit.bind(this);
		this.passwordStrength = this.passwordStrength.bind(this);
	}

	componentDidMount() {
		authRedirect(this.props.history);
	}
	onSubmit= async (formData) =>{
		formData = await DeepTrim(formData);

		this.props.signUp(formData)
			.then((flag) => {
				this.props.cleanErrorMsg()
				if (this.props.secondStepStatus && flag === MFA_STA && getStorage(JWT_SESSION_TOKEN)) {
					this.props.history.push('/signin_code');
				}
				else if (this.props.secondStepStatus && getStorage(JWT_ACCESS_TOKEN) && getStorage(JWT_ID_TOKEN)) {
					this.props.history.push('/dashboard');
				}
			})
			.catch((message) => {
				notification.error({
					message: Strings.error_title,
					description: message ? message : Strings.generic_error,
					onClick: () => { },
                    className: 'ant-error'
				});
			});
	}

	passwordStrength(e) {
		this.setState({
			password: e.target.value
		});
	}

	confirmPasswordStrength = (e) => {
		this.setState({
			confirmPassword: e.target.value
		});
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
					<h2 className="sf-lg-heading">{Strings.sign_up_title}</h2>
					<form onSubmit={handleSubmit(this.onSubmit)}>

						<fieldset className="userTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
							<Field
								name="password"
								type="password"
								component={customInput}
								onChange={this.passwordStrength}
								label={Strings.sign_up_password_label}
								id="password" />
							<PasswordStrengthMeter password={this.state.password} />
						</fieldset>

						<fieldset className="userTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
							<Field
								name="confirmPassword"
								type="password"
								component={customInput}
								onChange={this.confirmPasswordStrength}
								label={Strings.sign_up_confirm_password_label}
								id="password" />
							<PasswordStrengthMeter password={this.state.confirmPassword} />
						</fieldset>

						{
							this.props.errorMessage
								? <div>
									{this.props.errorMessage}
								</div>
								: null
						}

						<button type="submit" className="sf-btn">{Strings.sign_up_btn_sing_up}</button>

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
	reduxForm({ form: 'signup', validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    } })
)(SignUp)