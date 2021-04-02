import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Icon, Dropdown, Menu, Progress, Tabs, Upload, message, Button, Modal, notification } from 'antd';
import { reduxForm, Field, getFormSyncErrors } from 'redux-form';
import { compose, bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { goBack, getStorage, authRedirect, handleFocus } from '../../../utils/common';
import { Strings } from '../../../dataProvider/localize';
import { customInput } from '../../common/custom-input';
import { removeLoginData } from '../../../utils/sessions'
import { validate } from '../../../utils/validations';
import PasswordStrengthMeter from '../../common/PasswordStrengthMeter';
import { DeepTrim } from '../../../utils/common';

import * as actions from '../../../actions';

import {
    VALIDATE_STATUS,
    JWT_ACCESS_TOKEN,
    JWT_ID_TOKEN,
    MFA_STA
} from '../../../dataProvider/constant';

export class ChangePassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: ''
        }
        this.onSubmit = this.onSubmit.bind(this);
        this.passwordStrength = this.passwordStrength.bind(this);
    }

	/* componentDidMount(){
		authRedirect(this.props.history);
	} */
    onSubmit=async (formData) => {
        formData = await DeepTrim(formData);

        this.props.changePassword(formData)
            .then((message) => {
                this.setState({
                    password: '',
                    confirmPassword: ''
                })
                this.props.reset()
                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                })
                this.props.history.push('/dashboard/dashboard');
            })
            .catch((error) => {
                this.setState({
                    password: '',
                    confirmPassword: ''
                })
                if (error.status !== VALIDATE_STATUS)
                    this.props.reset()
                notification.error({
                    message: Strings.error_title,
                    description: error && error.data && error.data.message ? error.data.message : Strings.generic_error,
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
            <div className="sf-page-layout" >
                {/* inner header  */}
                <div className="dash-header" >
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() => goBack(this.props)} />{Strings.change_password}</h2>
                </div>
                {/* inner header  */}
                <div className="main-container" >
                    <div className="row">
                        <div className="col-md-8">
                            <div className="sf-card-wrap">
                                <div className="sf-change-pass">
                                    <form onSubmit={handleSubmit(this.onSubmit)}>
                                        <fieldset className="userTxtbox fldset-box sf-form form-group">
                                            <Field
                                                name="old_password"
                                                type="password"
                                                id="old_password"
                                                label="Old Password"
                                                component={customInput} />
                                        </fieldset>
                                        <fieldset className="userTxtbox fldset-box sf-form form-group">
                                            <Field
                                                name="new_password"
                                                type="password"
                                                component={customInput}
                                                onChange={this.passwordStrength}
                                                label="New Password"
                                                id="password" />
                                            <PasswordStrengthMeter password={this.state.password} />
                                        </fieldset>

                                        <fieldset className="userTxtbox fldset-box sf-form form-group">
                                            <Field
                                                name="confirm_password"
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
                                        <button type="submit" className="bnt bnt-active">{Strings.change_password}</button>
                                    </form>
                                </div>
                            </div>
                        </div>
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

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'ChangePassword', validate ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(ChangePassword)
