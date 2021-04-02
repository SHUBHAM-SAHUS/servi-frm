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
	FINISH,
	NST_SHOW_EMAIL,
	NST_SHOW_MOBILE
} from '../../dataProvider/constant';
import { isPrimitive } from 'util';
import { goBack, handleFocus } from '../../utils/common'
import { removeLoginData } from '../../utils/sessions'
import { authRedirect } from '../../utils/common'
import { countryCodes } from '../../dataProvider/countryCodes'
import { CustomSelect } from '../common/customSelect';
import { DeepTrim } from '../../utils/common';



class ForgotUserName extends React.Component {
	componentDidMount() {
		authRedirect(this.props.history);
	}
	onSubmit = async (formData) => {
		formData = await DeepTrim(formData);

		this.props.forgetUser(formData)
			.then((message) => {
				this.props.cleanErrorMsg()
				if (this.props.forgetUserStatus && this.props.forgetUserType === FINISH) {
					notification.success({
						message: Strings.success_title,
						description: message ? message : Strings.generic_error, onClick: () => { },
						className: 'ant-success'
						// onOk: () => this.props.history.push('/signin')
					})
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
					<h2 className="sf-lg-heading">{Strings.forgot_username_title}</h2>
					<form onSubmit={handleSubmit(this.onSubmit)}>
						{/* <fieldset className="userTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
							<Field
								name="user_name"
								type="text"
								id="user_name"
								label={Strings.forgot_username_placeholder_enter_username}
								placeholder={Strings.forgot_username_placeholder_enter_username}
								component={customInput} />
						</fieldset>

						{this.props.forgetUserStatus
							? this.props.forgetUserType === NST_SHOW_MOBILE
								? ( */}
						<div className="forgot-co-code">
							<fieldset className="sf-form co-code-txt no-label">
								<Field
									name={`country_code`}
									type="text"
									showSearch={1}
									options={countryCodes.map(country => ({
										title: country.dial_code,
										value: country.dial_code
									}))}
									component={CustomSelect}
								/>
							</fieldset>
							<fieldset className="userTxtbox fldset-box">
								{/* <Field
								name={`country_code`}
								type="text"
								showSearch={1}
								defaultValue="+61"
								options={countryCodes.map(country => ({
									title: country.dial_code,
									value: country.dial_code
								}))}
								component={CustomSelect}
							/> */}
								{/* <svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M6.62 10.79c1.44 2.83 3.76 5.14 6.59 6.59l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.57.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.25 1.02l-2.2 2.2z" /></svg> */}
								<Field
									name="phone"
									// name="user_name"
									type="text"
									id="phone"
									label={Strings.forgot_username_placeholder_enter_mobile_no}
									placeholder={Strings.forgot_username_placeholder_enter_mobile_no}
									component={customInput} />
							</fieldset>
						</div>
						{/* )
								: ( */}
						<fieldset className="userTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
							<Field
								// name="email"
								name="email"
								type="text"
								id="email"
								label={Strings.forgot_username_placeholder_enter_email}
								placeholder={Strings.forgot_username_placeholder_enter_email}
								component={customInput} />
						</fieldset>
						{/* )
							: null
						} */}
						{
							this.props.errorMessage
								? <div className="alert alert-danger">
									{this.props.errorMessage}
								</div>
								: null
						}
						<button type="submit" className="sf-btn">{Strings.forgot_username_btn_send_msg}</button>
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
		forgetUserStatus: state.auth.forgetUserStatus,
		forgetUserType: state.auth.forgetUserType
	}
}

export default compose(
	connect(mapStateToProps, actions),
	reduxForm({ form: 'ForgotUserName', validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    } })
)(ForgotUserName)