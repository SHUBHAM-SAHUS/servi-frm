import axios from 'axios';
import {
	AUTH_ERROR, AUTH_SIGN_UP, AUTH_SIGN_IN,
	AUTH_SIGN_OUT, AUTH_SIGNIN_URL, AUTH_SIGNUP_URL,
	AUTH_CODE_URL, START_SPINNER, JWT_SESSION_TOKEN,
	JWT_ID_TOKEN, JWT_ACCESS_TOKEN, JWT_REFRESH_TOKEN,
	USER_NAME, LOGIN, AUTH_FORGOT_PASS_URL,
	AUTH_FORGOT_PASS, AUTH_RESET_URL, AUTH_RESET,
	AUTH_FORGOT_USER_URL, AUTH_FORGOT_USER, AUTH_CLEAN_STORE,
	LOGOUT_URL, ADMIN_DETAILS, ACCESS_CONTROL,
	FIRST_TIME_LOGIN, VERIFY_ATTRIBUTE_URL, PAYMENT_DETAILS, CHANGE_PASSWORD_URL, CLEAR_ERROR
} from '../dataProvider/constant';
import { storeLoginData, removeLoginData } from '../utils/sessions'
import { Strings } from '../dataProvider/localize';
import { stopSipnner, startSipnner } from '../utils/spinner';
import axiosInstance, { scopeAxiosInstance } from '../dataProvider/axiosHelper';
import {
	BASE_API_URL
} from '../dataProvider/env.config';
import { getStorage, setStorage } from '../utils/common';

export const signUp = data => dispatch => {
	startSipnner(dispatch)
	data = {
		user_name: getStorage(USER_NAME),
		new_password: data.confirmPassword,
		login_session: getStorage(JWT_SESSION_TOKEN)
	};
	return axios.post(BASE_API_URL + AUTH_SIGNUP_URL, data)
		.then(res => {
			stopSipnner(dispatch);
			if (res.data.status) {
				if (res.data.data.type === LOGIN) {
					storeLoginData(res);
				}
				else {
					setStorage(JWT_SESSION_TOKEN, res.data.data.auth_data.session_token);
					setStorage(USER_NAME, data.user_name);
				}
				dispatch({
					type: AUTH_SIGN_UP,
					secondStepStatus: res.data.status,
					authType: res.data.data.type
				});
				return Promise.resolve(res.data.data.type);
			} else {
				dispatch({
					type: AUTH_ERROR,
					secondStepStatus: res.data.status
				});
				return Promise.reject(res.data.message ? res.data.message : Strings.generic_error)
			}
		})
		.catch(error => {
			stopSipnner(dispatch);
			dispatch({
				type: AUTH_ERROR,
				payload: error.response ? error.response.data.message : error.message,
				secondStepStatus: 0
			});
			return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
		});
}


export const signIn = data => dispatch => {
	startSipnner(dispatch)
	return axiosInstance.post(BASE_API_URL + AUTH_SIGNIN_URL, data)
		.then(res => {
			stopSipnner(dispatch);
			if (res.data.status) {
				if (res.data.data.type === LOGIN) {
					storeLoginData(res);
					setStorage(USER_NAME, data.user_name);
				}
				else {
					setStorage(JWT_SESSION_TOKEN, res.data.data.auth_data.session_token);
					setStorage(USER_NAME, data.user_name);
				}
				dispatch({
					type: AUTH_SIGN_IN,
					authType: res.data.data.type,
					loginStatus: res.data.status,
					idleTime: res.data.data.idle_time
				});
				return Promise.resolve(res);
			} else {
				dispatch({
					type: AUTH_ERROR,
					payload: res.data.message,
					loginStatus: res.data.status
				});
				return Promise.reject(res.data.message ? res.data.message : Strings.generic_error)
			}
		})
		.catch(error => {
			stopSipnner(dispatch);
			dispatch({
				type: AUTH_ERROR,
				payload: error.response ? error.response.data.message : Strings.network_error,
				loginStatus: 0
			});
			return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
		});
}


export const forgotPass = data => dispatch => {
	startSipnner(dispatch)
	return axios.post(BASE_API_URL + AUTH_FORGOT_PASS_URL, data)
		.then(res => {
			stopSipnner(dispatch);
			if (res.data.status) {
				setStorage(USER_NAME, data.user_name);
				dispatch({
					type: AUTH_FORGOT_PASS,
					forgotPassStatus: res.data.status
				});
				return Promise.resolve(res.data.message);
			} else {
				dispatch({
					type: AUTH_ERROR,
					payload: res.data.message,
					forgotPassStatus: res.data.status
				});
				return Promise.reject(res.data.message ? res.data.message : Strings.generic_error)
			}
		})
		.catch(error => {
			stopSipnner(dispatch);
			dispatch({
				type: AUTH_ERROR,
				payload: error.response ? error.response.data.message : error.message,
				forgotPassStatus: 0
			});
			return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
		});
}


export const signInNextStep = data => dispatch => {
	data = {
		auth_code: data.login_code,
		user_name: getStorage(USER_NAME),
		login_session: getStorage(JWT_SESSION_TOKEN)
	}
	startSipnner(dispatch)
	return axios.post(BASE_API_URL + AUTH_CODE_URL, data)
		.then(res => {
			stopSipnner(dispatch);
			if (res.data.status) {
				storeLoginData(res);
				sessionStorage.removeItem(JWT_SESSION_TOKEN);
				dispatch({
					type: AUTH_SIGN_UP,
					secondStepStatus: res.data.status,
					authType: res.data.data.type
				});
				return Promise.resolve(true);
			} else {
				dispatch({
					type: AUTH_ERROR,
					secondStepStatus: res.data.status
				});
			}
			return Promise.reject(res.data.message ? res.data.message : Strings.generic_error)
		})
		.catch(error => {
			stopSipnner(dispatch);
			dispatch({
				type: AUTH_ERROR,
				payload: error.response ? error.response.data.message : error.message,
				secondStepStatus: 0
			});
			return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
		});
}


export const resetPass = data => dispatch => {
	startSipnner(dispatch)
	data = { ...data, user_name: getStorage(USER_NAME) };
	return axios.post(BASE_API_URL + AUTH_RESET_URL, data)
		.then(res => {
			stopSipnner(dispatch);
			if (res.data.status) {
				dispatch({
					type: AUTH_RESET,
					resetStatus: res.data.status
				});
				return Promise.resolve(true);
			} else {
				dispatch({
					type: AUTH_ERROR,
					payload: res.data.message,
					resetStatus: res.data.status
				});
				return Promise.reject(res.data.message ? res.data.message : Strings.generic_error)
			}
		})
		.catch(error => {
			stopSipnner(dispatch);
			dispatch({
				type: AUTH_ERROR,
				payload: error.response ? error.response.data.message : error.message,
				resetStatus: 0
			});
			return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
		});
}


export const forgetUser = data => dispatch => {
	startSipnner(dispatch)
	data = { ...data };
	return axios.post(BASE_API_URL + AUTH_FORGOT_USER_URL, data)
		.then(res => {
			stopSipnner(dispatch);
			if (res.data.status) {
				dispatch({
					type: AUTH_FORGOT_USER,
					forgetUserStatus: res.data.status,
					forgetUserType: res.data.data.step
				});
				return Promise.resolve(res.data.message);
			} else {
				dispatch({
					type: AUTH_ERROR,
					payload: res.data.message,
					forgetUserStatus: res.data.status,
				});
				return Promise.reject(res.data.message ? res.data.message : Strings.generic_error)
			}
		})
		.catch(error => {
			stopSipnner(dispatch);
			dispatch({
				type: AUTH_ERROR,
				payload: error.response ? error.response.data.message : error.message,
				forgetUserStatus: 0
			});
			return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
		});
}


export const signOut = () => dispatch => {
	return logoutUser(dispatch);
}

export const logoutUser = (dispatch) => {
	const headers = {
		'Content-Type': 'application/json',
		'accessToken': getStorage(JWT_ACCESS_TOKEN),
		'accessId': getStorage(JWT_ID_TOKEN),
		'user_name': getStorage(USER_NAME)
	}
	removeLoginData();
	return axios.post(BASE_API_URL + LOGOUT_URL, null, { headers: headers })
		.then((response) => {
			startSipnner(dispatch)
			dispatch({
				type: AUTH_SIGN_OUT,
				payload: ''
			});
			stopSipnner(dispatch);
		})
		.catch((error) => {
			stopSipnner(dispatch);
		})
}

export const resetReduxStore = () => dispatch => {
	dispatch({
		type: AUTH_CLEAN_STORE
	})
}


export const verifyAttributes = (formData) => dispatch => {
	startSipnner(dispatch)
	return axiosInstance.post(BASE_API_URL + VERIFY_ATTRIBUTE_URL, formData)
		.then(res => {
			stopSipnner(dispatch)
			if (res.data.status) {
				return Promise.resolve(res.data.message);
			}
		})
		.catch(error => {
			stopSipnner(dispatch)
			return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
		});
}

export const changePassword = (formData) => dispatch => {
	startSipnner(dispatch)
	return axiosInstance.post(BASE_API_URL + CHANGE_PASSWORD_URL, formData)
		.then(res => {
			stopSipnner(dispatch)
			if (res.data.status) {
				return Promise.resolve(res.data.message);
			}
		})
		.catch(error => {
			stopSipnner(dispatch)
			return Promise.reject(error && error.response)
		});
}

export const cleanErrorMsg = () => dispatch => {
	dispatch({
		type: CLEAR_ERROR,
	});
}

export const allowNotification = (data) => dispatch => {
	startSipnner(dispatch)
	// alert('Hi')
	return scopeAxiosInstance.post('/fcm-token', data)
		.then(res => {
			stopSipnner(dispatch)
			if (res.data.status) {
				return Promise.resolve(res.data.message);
			}
		})
		.catch(error => {
			stopSipnner(dispatch)
			return Promise.reject(error && error.response)
		});
}