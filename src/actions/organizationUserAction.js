import axios from 'axios';
import { ORG_USERS_URL, ORG_USERS, INVITE_USERS_URL, RESEND_CODE, ORG_USERS_DELETE_URL, ORG_USER_ROLE } from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'

const getOrganizationUsersDetails = (org_id, dispatch) => {
  startSipnner(dispatch);
  const orgUserUrl = ORG_USERS_URL + '?org_user_id=' + org_id;
  return axiosInstance.get(orgUserUrl)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status === 1) {
        dispatch({
          type: ORG_USERS,
          payload: res.data.data.orgUsers,
        });
      }
    })
    .catch(() => {
      stopSipnner(dispatch);
    });
}

export const getOrganizationUsers = org_id => dispatch => {
  return getOrganizationUsersDetails(org_id, dispatch);
}

export const inviteUsers = userId => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(INVITE_USERS_URL, userId)
    .then(res => {
      stopSipnner(dispatch);
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? {
        message: error.response.data.message,
        invalidUsers: error.response.data.data.invalidUsers
      }
        : { message: Strings.network_error, invalidUsers: [] })
    });
}

export const resendAtrributeCode = userData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(RESEND_CODE, userData)
    .then(res => {
      stopSipnner(dispatch);
      return Promise.resolve(true);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const updateOrganizationUser = (formData, org_id) => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.put(ORG_USER_ROLE, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        await getOrganizationUsersDetails(org_id, dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const updateUsersFromView = (formData, org_id) => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.put(ORG_USERS_URL, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        await getOrganizationUsersDetails(org_id, dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response && error.response.data ? error.response.data.message : Strings.network_error);
    });
}

export const deleteOrganizationUser = (param, org_id) => dispatch => {
  startSipnner(dispatch);

  return axiosInstance.delete(ORG_USERS_DELETE_URL, { data: param })
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getOrganizationUsersDetails(org_id, dispatch);
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}