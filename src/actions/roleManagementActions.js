import {
  ROLE_GET_ROLES, ROLES_URL, INIT_ROLES_LIST,
  GET_ROLES_BY_EXPAND,
  GET_ROLES_BY_SEARCH, ADMIN_DETAILS
} from '../dataProvider/constant'
import { startSipnner, stopSipnner, stopMiniSpinner, startMiniSpinner, stopScrollSpinner, startScrollSpinner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'
import { getStorage } from '../utils/common';


const getAllRolesApi = (org_id, dispatch) => {
  startSipnner(dispatch);
  return axiosInstance.get(ROLES_URL + '?organisation_id=' + org_id)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: ROLE_GET_ROLES,
          payload: res.data.data.roles,
          job_calendar_lables: res.data.data.job_calendar_lables ? res.data.data.job_calendar_lables : null,
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getRoles = org_id => dispatch => {
  return getAllRolesApi(org_id, dispatch);
}

export const initRoles = () => dispatch => {
  return initAllRolesApi(dispatch)
}

const initAllRolesApi = dispatch => {
  startSipnner(dispatch)

  const searchKey = '';
  const pageNumber = 1;

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${ROLES_URL}?organisation_id=${org_id}&search_key=${searchKey}&page=${pageNumber}`

  return axiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INIT_ROLES_LIST,
          payload: res.data.data.roles,
          job_calendar_lables: res.data.data.job_calendar_lables ? res.data.data.job_calendar_lables : null,
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const searchExpandRolesList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

  searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${ROLES_URL}?organisation_id=${org_id}&search_key=${searchKey}&page=${pageNumber}`
  //const url = `${ROLES_URL}?search_key=${searchKey}&page=${pageNumber}`
  return axiosInstance.get(url)
    .then(res => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      if (res.data.status && !searching) {
        dispatch({
          type: GET_ROLES_BY_EXPAND,
          payload: res.data.data.roles,
          job_calendar_lables: res.data.data.job_calendar_lables ? res.data.data.job_calendar_lables : null,
        })
        return Promise.resolve(res.data.data.roles.length)
      } else {
        dispatch({
          type: GET_ROLES_BY_SEARCH,
          payload: res.data.data.roles,
          job_calendar_lables: res.data.data.job_calendar_lables ? res.data.data.job_calendar_lables : null,
        })
        return Promise.resolve(res.data.data.roles.length)
      }
    })
    .catch(error => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const addRole = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(ROLES_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        initAllRolesApi(dispatch)
        return Promise.resolve(res.data.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error)
    });
}

export const updateRole = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.put(ROLES_URL, formData)
    .then(async res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        await getAllRolesApi(formData.organisation_id, dispatch)
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error)
    });
}
