import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { notification } from 'antd';
import { Strings } from '../../dataProvider/localize'
import * as actions from '../../actions';
import { customInput } from '../common/custom-input';
import { validate } from '../../utils/validations';
import GoogleCaptcha from '../common/GoogleCaptcha';
import {
	MFA_STA,
	SET_PWD,
	JWT_SESSION_TOKEN,
	LOGIN,
	JWT_ID_TOKEN,
	JWT_ACCESS_TOKEN,
	USER_NAME,
	REMEMBER_ME
} from '../../dataProvider/constant';
import { getStorage, setStorage, authRedirect, handleFocus, DeepTrim } from '../../utils/common';

class SignIn extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			password: '',
			count: 0,
			fromChild: '',
			rememberMeChecked: false
		}
		this.passwordStrength = this.passwordStrength.bind(this);
		this.handleData = this.handleData.bind(this);
	}

	componentDidMount() {
		authRedirect(this.props.history);
		this.props.resetReduxStore();
	}

	onSubmit = async (formData) => {
		formData = await DeepTrim(formData);

		this.props.signIn(formData)
			.then((res) => {
				this.props.cleanErrorMsg()
				if (this.props.loginStatus) {
					setStorage(REMEMBER_ME, this.state.rememberMeChecked)
				}
				if (this.props.loginStatus && this.props.authType === MFA_STA && getStorage(JWT_SESSION_TOKEN)) {
					this.props.history.push('/signin_code');
				}
				else if (this.props.loginStatus && this.props.authType === SET_PWD && getStorage(JWT_SESSION_TOKEN)) {
					this.props.history.push('/signup');
				}
				else if (this.props.loginStatus && this.props.authType === LOGIN && getStorage(JWT_ID_TOKEN) && getStorage(JWT_ACCESS_TOKEN)) {
					this.props.history.push('/dashboard');
				}
			})
			.catch((message) => {
				if (this.props.errorMessage) {
					this.setState({
						count: this.state.count + 1
					})
				} else {
					return notification.error({
						message: Strings.error_title,
						description: message ? message : Strings.generic_error, onClick: () => { },
						className: 'ant-error'
					});
				}
			});
	}

	passwordStrength(e) {
		this.setState({
			password: e.target.value
		});
	}

	handleData(data) {
		this.setState({
			fromChild: data
		});
	}

	handleRememberMe = (event) => {
		this.setState({ rememberMeChecked: event.target.checked })
	}

	handleNotMeClick = () => {
		// localStorage.removeItem(USER_NAME);
		sessionStorage.removeItem(USER_NAME);
		this.setState({})
	}

	render() {
		const { handleSubmit } = this.props;
		return (
			<div>
				<div className="sf-login">
					<img className="sf-logo" src="../images/service_form_big.png" alt="SF logo" />
					<h2 className="sf-lg-heading">{Strings.sign_in_title_login}</h2>
					<form onSubmit={handleSubmit(this.onSubmit)}>
						<fieldset className="userTxtbox fldset-box outr-notme">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
							<Field
								name="email_address"
								type="text"
								id="email_address"
								label={Strings.sign_in_email_label}
								placeholder={Strings.sign_in_email_placeholder}
								readonly={getStorage(USER_NAME) ? true : false}
								component={customInput} />
							{getStorage(USER_NAME) ? <button className="notmetxt" onClick={this.handleNotMeClick} type="button">Not me</button> : null}
						</fieldset>

						<fieldset className="passTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
							<Field
								name="password"
								type="password"
								id="password"
								placeholder={Strings.sign_in_password_label}
								label={Strings.sign_in_password_placeholder}
								onChange={this.passwordStrength}
								component={customInput} />
						</fieldset>


						{this.props.errorMessage ?
							<div className="alert alert-danger">
								{this.props.errorMessage}
							</div> : null}
						{this.state.count > 2 ?
							<div className="sf-g-captcah">
								<GoogleCaptcha handlerFromParant={this.handleData} />
							</div> :
							null}
						{this.state.count > 2 && this.state.fromChild !== "Verified" ? <button type="submit" className="sf-btn" disabled>{Strings.sign_in_btn_sign_in}</button> : <button type="submit" className="sf-btn">{Strings.sign_in_btn_sign_in}</button>}
						{this.state.count > 2 ?
							<div className="forgt-pass">{Strings.sign_in_forgot_password} <Link onClick={() => this.props.cleanErrorMsg()}
								key='forgotpass' to='/forgotpass'>{Strings.sign_in_password}</Link> | <Link
									onClick={() => this.props.cleanErrorMsg()}
									key='forgotusername' to='/Forgotusername'>{Strings.sign_in_forgot_username}</Link>
							</div> : null}

						<div className="rember-me">
							<input className="styled-checkbox" id="styled-checkbox-1" type="checkbox" value="value1" onChange={this.handleRememberMe} />
							<label for="styled-checkbox-1">{Strings.sign_in_remember_me}</label>
						</div>

					</form>
				</div>
			</div>

		)
	}
}

const mapStateToProps = (state) => {
	if (getStorage(USER_NAME)) {
		var initialValues = { user_name: getStorage(USER_NAME) };
	}
	return {
		errorMessage: state.auth.errorMessage,
		authType: state.auth.authType,
		loginStatus: state.auth.loginStatus,
		initialValues: initialValues ? initialValues : {}
	}
}

export const SignInComponent = connect(mapStateToProps, actions)(SignIn);
export default compose(
	connect(mapStateToProps, actions),
	reduxForm({
		form: 'signin', validate,
		onSubmitFail: (errors, dispatch, sub, props) => {
			handleFocus(errors, "#");
		}
	})
)(SignIn)