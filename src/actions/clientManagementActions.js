import {
  CLIENTS_GET_CLIENTS_LIST,
  SCOPE_DOC_CLIENT_URL,
  ADMIN_DETAILS,
  CLIENTS_GET_SITES_LIST,
  GET_CLIENT_DETAILS,
  SCOPE_DOC_GET_SITES,
  CLIENT_PERSON_URL,
  INIT_CLIENT_LIST,
  GET_CLIENT_LIST_BY_EXPAND,
  GET_CLIENT_LIST_BY_SEARCH,
  CLIENT_SITE_URL,
  CLIENT_PERSON_ROLES_URL,
  ROLE_GET_ROLES
} from '../dataProvider/constant'
import { startSipnner, stopSipnner, stopMiniSpinner, startMiniSpinner, stopScrollSpinner, startScrollSpinner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'
import { getStorage } from '../utils/common';

export const initClientsList = (org_id) => dispatch => {
  return initAllClientsListApi(org_id, dispatch)
}

const initAllClientsListApi = (org_id, dispatch) => {
  startSipnner(dispatch)
  const searchKey = '';
  const pageNumber = 1;
  //const url = SCOPE_DOC_CLIENT_URL + '?organisation_id=' + org_id
  const url = `${SCOPE_DOC_CLIENT_URL}?organisation_id=${org_id}&search_key=${searchKey}&page=${pageNumber}`

  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INIT_CLIENT_LIST,
          payload: res.data.data.clients
        })
        return Promise.resolve(res.data.data.clients.length)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const searchExpandClientList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

  searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${SCOPE_DOC_CLIENT_URL}?organisation_id=${org_id}&search_key=${searchKey}&page=${pageNumber}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      if (res.data.status && !searching) {
        dispatch({
          type: GET_CLIENT_LIST_BY_EXPAND,
          payload: res.data.data.clients
        })
        return Promise.resolve(res.data.data.clients.length)
      } else {
        dispatch({
          type: GET_CLIENT_LIST_BY_SEARCH,
          payload: res.data.data.clients
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getClientsList = (org_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${SCOPE_DOC_CLIENT_URL}?organisation_id=${org_id}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: CLIENTS_GET_CLIENTS_LIST,
          payload: res.data.data.clients
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getClientDetails = (client_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${SCOPE_DOC_CLIENT_URL}?id=${client_id}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_CLIENT_DETAILS,
          payload: res.data.data.clients
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const addClient = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(`${SCOPE_DOC_CLIENT_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        initAllClientsListApi(formData.get('org_id'), dispatch)
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error)
    })
}

export const editClient = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(`${SCOPE_DOC_CLIENT_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error)
    })
}

export const editClientPerson = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(`${CLIENT_PERSON_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response : Strings.network_error)
    })
}

export const getSitesList = (client_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${SCOPE_DOC_GET_SITES}?id=${client_id}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: CLIENTS_GET_SITES_LIST,
          payload: res.data.data.sites
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const addContactPerson = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(`${CLIENT_PERSON_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response : Strings.network_error)
    })
}

export const editContactPerson = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(`${CLIENT_PERSON_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response : Strings.network_error)
    })
}
export const deleteContactPerson = (data) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.delete(`${CLIENT_PERSON_URL}`, { data: data })
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const updateClientSite = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(`${CLIENT_SITE_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response : Strings.network_error)
    })
}

export const addClientSite = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(`${CLIENT_SITE_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response : Strings.network_error)
    })
}

// delete client site
export const deleteClientSite = (data) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.delete(`${CLIENT_SITE_URL}`, { data: data })
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}



export const getClientPersonRoles = () => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(CLIENT_PERSON_ROLES_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: ROLE_GET_ROLES,
          payload: res.data.data.roles,
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}