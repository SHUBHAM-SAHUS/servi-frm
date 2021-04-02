import {
  PERMISSION_URL,
  ROLES_URL,
  GET_PERMISSION_BY_ROLE,
  GET_ROLE_PERMISSION_URL,
  GET_PERMISSION_BY_ALL_ROLE
} from '../dataProvider/constant';
import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';

export const getPermissionsByRole = role_id => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(ROLES_URL + '?id=' + role_id)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_PERMISSION_BY_ROLE,
          payload: res.data.data.permissions
        })
        return Promise.resolve(res.data.data.permissions)
      }

    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getPermissionsByAllRole = () => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(GET_ROLE_PERMISSION_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_PERMISSION_BY_ALL_ROLE,
          payload: res.data.data.roles
        })
        return Promise.resolve(res.data.data.roles)
      }

    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const addRolePermission = (formData) => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.put(PERMISSION_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

