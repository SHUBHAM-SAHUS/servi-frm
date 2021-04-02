import {
  JOB_DETAILS_URL,
  JOB_DETAILS, TASK_JOB_DETAILS
} from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'


export const getJobDetails = job_number => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(JOB_DETAILS_URL + '?job_number=' + job_number)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: JOB_DETAILS,
          payload: res.data.data
        })
        return Promise.resolve(res.data.data);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getTaskJobDetails = job_number => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(JOB_DETAILS_URL + '?job_id=' + job_number)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: TASK_JOB_DETAILS,
          payload: res.data.data.job_details[0]
        })
        return Promise.resolve(res.data.data);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}