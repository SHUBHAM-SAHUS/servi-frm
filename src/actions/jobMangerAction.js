import { Strings } from '../dataProvider/localize';
import axiosInstance, { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { startSipnner, stopSipnner } from '../utils/spinner';
import {
  ACCEPT_SHIFT_URL, JOB_STATUS_URL,
  USER_JOBS_URL, GET_USER_JOBS,
  RESTART_JOB_URL,
  SEND_JOB_NOTIFICATION_URL
} from '../dataProvider/constant';

export const getUserJobs = () => dispatch => {
  return getAllUserJobs(dispatch)
}

const getAllUserJobs = (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(USER_JOBS_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_USER_JOBS,
          payload: res.data.data.job_details
        })
        return Promise.resolve(res.data.data.message)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const acceptDeclineShift = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(ACCEPT_SHIFT_URL, formData)
    .then(async res => {
      stopSipnner(dispatch);
      await getAllUserJobs(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const updateJobStatus = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(JOB_STATUS_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      getAllUserJobs(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const restartJob = jobId => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(RESTART_JOB_URL, { id: jobId })
    .then(/* async */ res => {
      stopSipnner(dispatch);
      // await getAllUserJobs(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}
export const sendJobNotificationStatus = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(SEND_JOB_NOTIFICATION_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}