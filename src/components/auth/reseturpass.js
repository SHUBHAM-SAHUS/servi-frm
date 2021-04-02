import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, notification } from 'antd';
import { Strings } from '../../dataProvider/localize';
import * as actions from '../../actions';
import { customInput } from '../common/custom-input';
import { validate } from '../../utils/validations';
import PasswordStrengthMeter from '../common/PasswordStrengthMeter';
import { authRedirect, handleFocus } from '../../utils/common'

class Reseturpass extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			password: '',
			confirmPassword: ''
		}
		this.onSubmit = this.onSubmit.bind(this);
		this.passwordStrength = this.passwordStrength.bind(this);
	}

	onSubmit(formData) {
		delete formData.confirm_password;
		this.props.resetPass(formData).then(() => {
			this.props.cleanErrorMsg()
			if (this.props.resetStatus) {
				this.props.history.push('/signin');
			}
		}).catch((message) => {
			notification.error({
				message: Strings.error_title,
				description: message ? message : Strings.generic_error,
				onClick: () => { },
				className: 'ant-error'
			})
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
	componentDidMount() {
		authRedirect(this.props.history);
	}
	render() {
		const { handleSubmit } = this.props;
		return (
			<div>
				<div className="sf-login">
					<img className="sf-logo" src="../images/service_form_big.png" alt="SF logo" />
					<h2 className="sf-lg-heading">{Strings.reset_pass_title}</h2>
					<form onSubmit={handleSubmit(this.onSubmit)}>
						<fieldset className="passTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
							<Field
								name="password_reset_code"
								type="text"
								id="password_reset_code"
								label={Strings.reset_pass_placeholder_enter_code}
								placeholder={Strings.reset_pass_placeholder_enter_code}
								component={customInput} />
						</fieldset>
						<fieldset className="userTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
							<Field
								name="new_password"
								type="password"
								component={customInput}
								onChange={this.passwordStrength}
								label={Strings.reset_pass_placeholder_enter_password}
								placeholder={Strings.reset_pass_placeholder_enter_password}
								id="password" />
							<PasswordStrengthMeter password={this.state.password} />
						</fieldset>

						<fieldset className="userTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M0 0h24v24H0z" fill="none" /><path d="M12.65 10C11.83 7.67 9.61 6 7 6c-3.31 0-6 2.69-6 6s2.69 6 6 6c2.61 0 4.83-1.67 5.65-4H17v4h4v-4h2v-4H12.65zM7 14c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2z" /></svg>
							<Field
								name="confirm_password"
								type="password"
								component={customInput}
								onChange={this.confirmPasswordStrength}
								label={Strings.reset_pass_placeholder_cofirm_password}
								placeholder={Strings.reset_pass_placeholder_cofirm_password}
								id="new_password" />
							<PasswordStrengthMeter password={this.state.confirmPassword} />
						</fieldset>

						{this.props.errorMessage ?
							<div className="alert alert-danger">
								{this.props.errorMessage}
							</div> : null}

						<button type="submit" className="sf-btn">
							{Strings.reset_pass_btn_sign_up}
						</button>
					</form>
				</div>

			</div>

		)
	}
}

const mapStateToProps = (state) => {
	return {
		errorMessage: state.auth.errorMessage,
		resetStatus: state.auth.resetStatus
	}
}
export default compose(
	connect(mapStateToProps, actions),
	reduxForm({ form: 'resetPass', validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    } })
)(Reseturpass)