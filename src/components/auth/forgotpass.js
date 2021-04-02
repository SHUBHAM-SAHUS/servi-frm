import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Icon, notification } from 'antd'
import { Strings } from '../../dataProvider/localize';
import * as actions from '../../actions';
import { customInput } from '../common/custom-input';
import { validate } from '../../utils/validations';

import { goBack, handleFocus } from '../../utils/common'
import { removeLoginData } from '../../utils/sessions'
import { authRedirect } from '../../utils/common'
import { DeepTrim } from '../../utils/common';



class Forgotpass extends React.Component {
	componentDidMount() {
		authRedirect(this.props.history);

	}
	onSubmit = async (formData) => {
		formData = await DeepTrim(formData);

		this.props.forgotPass(formData)
			.then((message) => {
				this.props.cleanErrorMsg()
				if (this.props.forgotPassStatus) {
					notification.success({
						message: Strings.success_title,
						description: message ? message : Strings.generic_error,
						// onOk: () => this.props.history.push('/reseturpass')
						onClick: () => { },
						className: 'ant-success'
					})
					this.props.history.push('/reseturpass')
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
					<h2 className="sf-lg-heading">{Strings.forgot_pass_title}</h2>
					<form onSubmit={handleSubmit(this.onSubmit)}>
						<fieldset className="userTxtbox fldset-box">
							<svg className="svg-ico-f" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" /><path d="M0 0h24v24H0z" fill="none" /></svg>
							<Field
								name="user_name"
								type="text"
								id="user_name"
								label={Strings.forgot_pass_placeholder_enter_username}
								placeholder={Strings.forgot_pass_placeholder_enter_username}
								component={customInput} />
						</fieldset>

						{
							this.props.errorMessage
								? <div className="alert alert-danger">
									{this.props.errorMessage}
								</div>
								: null
						}
						<button type="submit" className="sf-btn">{Strings.forgot_pass_btn_send_msg}</button>
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
		forgotPassStatus: state.auth.forgotPassStatus
	}
}

export default compose(
	connect(mapStateToProps, actions),
	reduxForm({
		form: 'forgotPass', validate,
		onSubmitFail: (errors, dispatch, sub, props) => {
			handleFocus(errors, "#");
		}
	})
)(Forgotpass)