import axios from 'axios';
import {
  ORGANIZATION_GET_ORGANIZATION, ORGANIZATION_URL,
  SERVICE_AGENT_URL, SA_GET_SERVICEAGENT, ADMIN_DETAILS,
  SA_GET_OTHER_SERVICEAGENT, SERVICE_AGENT_CONNECT_URL,
  UPDATE_SA_INDUS_URL, ORG_DETAIL_URL, GET_ORG_DETAILS,
  DELETE_SA_SERVICE,
  INIT_SERVICE_AGENT_LIST,
  GET_SERVICE_AGENT_LIST_BY_EXPAND,
  GET_SERVICE_AGENT_LIST_BY_SEARCH,
  ORG_USERS_URL,
  USER_PROFILE
} from '../dataProvider/constant'
import { startSipnner, stopSipnner, stopMiniSpinner, startMiniSpinner, stopScrollSpinner, startScrollSpinner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize'
import {
  BASE_API_URL
} from '../dataProvider/env.config';
import { getStorage } from '../utils/common';


const getAllOrganizationApi = dispatch => {
  startSipnner(dispatch)
  return axiosInstance.get(ORGANIZATION_URL)
    .then(res => {
      if (res.data.status) {
        dispatch({
          type: ORGANIZATION_GET_ORGANIZATION,
          payload: res.data.data.organisations
        })
        stopSipnner(dispatch);
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getOrganization = () => dispatch => {
  return getAllOrganizationApi(dispatch);
}

export const addOrganization = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(BASE_API_URL + ORGANIZATION_URL, formData/* , {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  } */)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        getAllOrganizationApi(dispatch)
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response : Strings.network_error);
    });
}

export const updateOrganization = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.put(BASE_API_URL + ORGANIZATION_URL, formData/* , {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  } */)
    .then(async res => {
      if (res.data.status) {
        stopSipnner(dispatch)
        getAllOrganizationApi(dispatch);
        await getCurrentOrgDetailsApi(dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error);
    });
}

const getAllServiceAgentApi = (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance.get(SERVICE_AGENT_URL + '?id=' + JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id)
    .then(res => {
      if (res.data.status) {
        dispatch({
          type: SA_GET_SERVICEAGENT,
          payload: res.data.data.service_agents
        })
        stopSipnner(dispatch);
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getServiceAgent = () => dispatch => {
  return getAllServiceAgentApi(dispatch)
}

export const initServiceAgentList = () => dispatch => {
  return initAllServiceAgentListApi(dispatch)
}

const initAllServiceAgentListApi = (dispatch) => {
  startSipnner(dispatch)

  const searchKey = '';
  const pageNumber = 1;

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
  //const url = SERVICE_AGENT_URL + '?id=' + org_id
  const url = `${SERVICE_AGENT_URL}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`

  return axiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INIT_SERVICE_AGENT_LIST,
          payload: res.data.data.service_agents
        })
        return Promise.resolve(res.data.data.service_agents.length)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const searchExpandServiceAgentList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

  searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)
  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${SERVICE_AGENT_URL}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`
  return axiosInstance.get(url)
    .then(res => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      if (res.data.status && !searching) {
        dispatch({
          type: GET_SERVICE_AGENT_LIST_BY_EXPAND,
          payload: res.data.data.service_agents
        })
        return Promise.resolve(res.data.data.service_agents.length)
      } else {
        dispatch({
          type: GET_SERVICE_AGENT_LIST_BY_SEARCH,
          payload: res.data.data.service_agents
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getOtherServiceAgent = () => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(SERVICE_AGENT_URL + '?id=' + JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id + '&other_service_agents=' + 1)
    .then(res => {
      if (res.data.status) {
        dispatch({
          type: SA_GET_OTHER_SERVICEAGENT,
          payload: res.data.data.service_agents
        })
        stopSipnner(dispatch);
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const connectServiceAgent = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(SERVICE_AGENT_CONNECT_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        initAllServiceAgentListApi(dispatch)
        return Promise.resolve(res.data.data)
      }
      else {
        return Promise.reject({ response: { data: { message: res.data.message } } });
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}


export const updateServiceAgentService = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.put(UPDATE_SA_INDUS_URL, formData)
    .then(async res => {
      if (res.data.status) {
        await getAllServiceAgentApi(dispatch)
        await getCurrentOrgDetailsApi(dispatch)
        stopSipnner(dispatch)
        return Promise.resolve(res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error);
    });
}

export const deleteSAService = (data) => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.delete(DELETE_SA_SERVICE, { data: data })
    .then(res => {
      if (res.data.status) {
        getAllServiceAgentApi(dispatch)
        getCurrentOrgDetailsApi(dispatch)
        stopSipnner(dispatch);
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const deleteSAIndustry = (data) => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.delete(UPDATE_SA_INDUS_URL, { data: data })
    .then(res => {
      if (res.data.status) {
        getAllServiceAgentApi(dispatch)
        getCurrentOrgDetailsApi(dispatch)
        stopSipnner(dispatch);
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getCurrentOrgDetails = () => dispatch => {
  return getCurrentOrgDetailsApi(dispatch);
}

const getCurrentOrgDetailsApi = dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(ORG_DETAIL_URL)
    .then(res => {
      if (res.data.status) {
        dispatch({
          type: GET_ORG_DETAILS,
          payload: res.data.data.organisation_detail,
          conncted_orgs: res.data.data.conncted_orgs
        })
        stopSipnner(dispatch);
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getCurrentOrganization = dispatch => {
  return getCurrentOrgDetailsApi(dispatch);
}

export const getOrgUserDetails = (org_user_id, org_user_name, role_id) => dispatch => {
  startSipnner(dispatch)
  return axiosInstance.get(`${ORG_USERS_URL}?org_user_id=${org_user_id}&org_user_name=${org_user_name}&role_id=${role_id}`)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        dispatch({
          type: USER_PROFILE,
          payload: res.data.data.orgUsers[0],
        })
        return Promise.resolve(true)
      }
    }).catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.message ? error.response && error.response.data.message : Strings.network_error)
    })
}