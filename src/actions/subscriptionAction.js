import { SUBSCRIPT_GET_SUBSCRIPTS, SUBSCRIPT_URL } from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'


const getAllSubscriptionApi = dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(SUBSCRIPT_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SUBSCRIPT_GET_SUBSCRIPTS,
          payload: res.data.data.subscriptions
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getSubscription = () => dispatch => {
  return getAllSubscriptionApi(dispatch);
}

export const addSubscription = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(SUBSCRIPT_URL, formData)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        getAllSubscriptionApi(dispatch)
        return Promise.resolve(res.data.data.subscription);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const updateSubscription = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.put(SUBSCRIPT_URL, formData)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        getAllSubscriptionApi(dispatch)
        return Promise.resolve(res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

