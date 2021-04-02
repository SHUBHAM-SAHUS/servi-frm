import {
  ROLE_GET_ROLES, ROLES_URL,
  INIT_ORG_CERTI_LIST,
  GET_ORG_CERTIFICATES,
  GET_ORG_CERTI,
  GET_ORG_CERTI_LIST_BY_EXPAND,
  GET_ORG_CERTI_LIST_BY_SEARCH,
  ADMIN_DETAILS
} from '../dataProvider/constant'
import { startSipnner, stopSipnner, stopMiniSpinner, startMiniSpinner, stopScrollSpinner, startScrollSpinner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'
import { getStorage } from '../utils/common';

const getAllOrgCerti = (org_id, dispatch) => {
  startSipnner(dispatch);
  const url = GET_ORG_CERTIFICATES + '?organisation_id=' + org_id
  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ORG_CERTI,
          payload: res.data.data.certificateList
        })
        return Promise.resolve(true)
      }

    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getOrgCerti = org_id => dispatch => {
  return getAllOrgCerti(org_id, dispatch);

}

export const initOrgCerti = () => dispatch => {
  return initAllOrgCertiApi(dispatch)
}

const initAllOrgCertiApi = dispatch => {
  startSipnner(dispatch)

  const searchKey = '';
  const pageNumber = 1;

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${GET_ORG_CERTIFICATES}?organisation_id=${org_id}&search_key=${searchKey}&page=${pageNumber}`

  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INIT_ORG_CERTI_LIST,
          payload: res.data.data.certificateList
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const searchExpandOrgCertifcateList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

  searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${GET_ORG_CERTIFICATES}?organisation_id=${org_id}&search_key=${searchKey}&page=${pageNumber}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      if (res.data.status && !searching) {
        dispatch({
          type: GET_ORG_CERTI_LIST_BY_EXPAND,
          payload: res.data.data.certificateList
        })
        return Promise.resolve(res.data.data.certificateList.length)
      } else {
        dispatch({
          type: GET_ORG_CERTI_LIST_BY_SEARCH,
          payload: res.data.data.certificateList
        })
        return Promise.resolve(res.data.data.certificateList.length)
      }
    })
    .catch(error => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const updateCerti = (formData, org_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put("/org-certificates", formData)
    .then(async res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        await getAllOrgCerti(org_id, dispatch)
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error)
    });
}

export const addOrgCerti = (formData, org_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post("/org-certificates", formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllOrgCerti(org_id, dispatch)
        initAllOrgCertiApi(dispatch)
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error)
    });
}