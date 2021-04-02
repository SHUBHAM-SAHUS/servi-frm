import {
  GET_BROADCAST,
  BROADCAST_URL,
  GET_BROADCAST_DETIALS,
  ADMIN_DETAILS,
  INIT_BROADCAST_LIST,
  GET_BROADCAST_LIST_BY_EXPAND,
  GET_BROADCAST_LIST_BY_SEARCH
} from '../dataProvider/constant';
import { startSipnner, stopSipnner, startMiniSpinner, startScrollSpinner, stopMiniSpinner, stopScrollSpinner } from '../utils/spinner';
import axiosInstance, { scopeAxiosInstance } from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';
import { getStorage } from '../utils/common';

export const getAllBroadcast = () => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(BROADCAST_URL)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        dispatch({
          type: GET_BROADCAST,
          payload: res.data.data.result
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const initBroadcast = () => dispatch => {
  return initAllBroadcastApi(dispatch)
}

const initAllBroadcastApi = dispatch => {
  startSipnner(dispatch)

  const searchKey = '';
  const pageNumber = 1;

  const url = `${BROADCAST_URL}?search_key=${searchKey}&page=${pageNumber}`

  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INIT_BROADCAST_LIST,
          payload: res.data.data.result
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const searchExpandBroadcastList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

  searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

  const url = `${BROADCAST_URL}?search_key=${searchKey}&page=${pageNumber}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      if (res.data.status && !searching) {
        dispatch({
          type: GET_BROADCAST_LIST_BY_EXPAND,
          payload: res.data.data.result,
        })
        return Promise.resolve(res.data.data.result.length)
      } else {
        dispatch({
          type: GET_BROADCAST_LIST_BY_SEARCH,
          payload: res.data.data.result,
        })
        return Promise.resolve(res.data.data.result.length)
      }
    })
    .catch(error => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const addBroadcast = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(BROADCAST_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}
const getBroadcastDetailsById = (broadcastId, dispatch) => {
  return getBroadcastDetails(broadcastId, dispatch);
}

export const getBroadcastDetails = (broadcastId) => dispatch => {
  startSipnner(dispatch);
  const url = `${BROADCAST_URL}?id=${broadcastId}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_BROADCAST_DETIALS,
          payload: res.data.data.result[0]
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const updateBroadcast = formData => dispatch => {
  // let id = equipmentId ? equipmentId : formData.id;

  startSipnner(dispatch);
  return scopeAxiosInstance.put(BROADCAST_URL, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        // await getEquipmentDetailsById(id, dispatch);
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}