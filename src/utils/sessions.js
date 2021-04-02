import {
	JWT_ID_TOKEN,
	JWT_ACCESS_TOKEN,
	JWT_REFRESH_TOKEN,
	USER_NAME,
	ADMIN_DETAILS,
	FIRST_TIME_LOGIN,
	PAYMENT_DETAILS,
	ACCESS_CONTROL, REMEMBER_ME,
	ORGANIZATIONS_LIST,
	SELECTED_ORG
} from '../dataProvider/constant'
import { getStorage, setStorage } from './common';
import { getCurrentOrganization } from '../actions/organizationAction';
import { Store } from '../index';

export const storeLoginData = (res, selectedOrg = 0) => {
	setStorage(JWT_ID_TOKEN, res.data.data.auth_data.id_token);
	setStorage(JWT_ACCESS_TOKEN, res.data.data.auth_data.access_token);
	setStorage(JWT_REFRESH_TOKEN, res.data.data.auth_data.refresh_token);
	setStorage(USER_NAME, res.data.data.admin_details.user_name);
	setStorage(ADMIN_DETAILS, JSON.stringify({
		...res.data.data.admin_details, organisation: res.data.data.organizations[selectedOrg],
		role: res.data.data.organizations[selectedOrg].role
	}));
	setStorage(FIRST_TIME_LOGIN, res.data.data.admin_details.first_time_login);
	setStorage(PAYMENT_DETAILS, JSON.stringify({
		subscription_amount: res.data.data.organizations[selectedOrg].subscription_amount,
		is_payment_due: res.data.data.organizations[selectedOrg].is_payment_due,

	}));
	setStorage(ACCESS_CONTROL,/*  JSON.stringify(accessControl.access_controls) */JSON.stringify(res.data.data.organizations[selectedOrg].access_controls));
	setStorage(ORGANIZATIONS_LIST, JSON.stringify(res.data.data.organizations));
	getCurrentOrganization(Store.dispatch);
}

export const changeOrganization = (selectedOrg = 0) => {
	setStorage(ADMIN_DETAILS, JSON.stringify({
		...JSON.parse(getStorage(ADMIN_DETAILS)), organisation: JSON.parse(getStorage(ORGANIZATIONS_LIST))[selectedOrg],
		role: JSON.parse(getStorage(ORGANIZATIONS_LIST))[selectedOrg].role
	}));
	setStorage(PAYMENT_DETAILS, JSON.stringify({
		subscription_amount: JSON.parse(getStorage(ORGANIZATIONS_LIST))[selectedOrg].subscription_amount,
		is_payment_due: JSON.parse(getStorage(ORGANIZATIONS_LIST))[selectedOrg].is_payment_due,
		eway_token: JSON.parse(getStorage(ORGANIZATIONS_LIST))[selectedOrg].eway_token,
		card_details: JSON.parse(getStorage(ORGANIZATIONS_LIST))[selectedOrg].card_details
	}));
	setStorage(ACCESS_CONTROL,/*  JSON.stringify(accessControl.access_controls) */JSON.stringify(JSON.parse(getStorage(ORGANIZATIONS_LIST))[selectedOrg].access_controls));
	getCurrentOrganization(Store.dispatch);
}

export const removeLoginData = () => {
	if (!JSON.parse(getStorage(REMEMBER_ME)))
		sessionStorage.removeItem(USER_NAME);
	sessionStorage.removeItem(JWT_ID_TOKEN);
	sessionStorage.removeItem(JWT_ACCESS_TOKEN);
	sessionStorage.removeItem(JWT_REFRESH_TOKEN);
	sessionStorage.removeItem(ADMIN_DETAILS);
	sessionStorage.removeItem(FIRST_TIME_LOGIN);
	sessionStorage.removeItem(PAYMENT_DETAILS);
	sessionStorage.removeItem(ACCESS_CONTROL);
	sessionStorage.removeItem(ORGANIZATIONS_LIST);
	sessionStorage.removeItem(SELECTED_ORG);
	/* localStorage.removeItem(USER_NAME);
localStorage.removeItem(JWT_ID_TOKEN);
localStorage.removeItem(JWT_ACCESS_TOKEN);
localStorage.removeItem(JWT_REFRESH_TOKEN);
localStorage.removeItem(ADMIN_DETAILS);
localStorage.removeItem(FIRST_TIME_LOGIN);
localStorage.removeItem(PAYMENT_DETAILS);
localStorage.removeItem(ACCESS_CONTROL);
localStorage.removeItem(ORGANIZATIONS_LIST);
localStorage.removeItem(SELECTED_ORG); */
}
