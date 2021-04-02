import {
  GET_COMPLETED_JOBS, GET_COMPLETED_JOB_DETAIL, COMPLETED_JOBS, COMPLETED_JOB_DETAIL,
  ACCEPT_COMPLETED_JOB, SEND_JOB_FOR_APPROVAL, APPROVE_COMPLETED_JOB, ADMIN_DETAILS,
  INIT_COMPLETED_JOBS_LIST,
  GET_COMPLETED_JOBS_LIST_BY_EXPAND,
  GET_COMPLETED_JOBS_LIST_BY_SEARCH
} from '../dataProvider/constant'
import { startSipnner, stopSipnner, stopMiniSpinner, startMiniSpinner, stopScrollSpinner, startScrollSpinner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'
import { getStorage } from '../utils/common';


export const getAllCompletedJobs = () => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(GET_COMPLETED_JOBS)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: COMPLETED_JOBS,
          payload: res.data.data.job_details
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getCompletedJobDetail = (job_number) => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(GET_COMPLETED_JOB_DETAIL + '?job_number=' + job_number)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: COMPLETED_JOB_DETAIL,
          payload: res.data.data.job_details[0]
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}


export const acceptCompletedJob = (job_number) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(ACCEPT_COMPLETED_JOB, { job_number: job_number })
    .then(async res => {
      stopSipnner(dispatch);

      if (res.data.status) {
        await getCompletedJobDetail(dispatch)
        return Promise.resolve(res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const sendJobForApproval = (job_number, approver_user_name) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(SEND_JOB_FOR_APPROVAL, { job_number: job_number, approver_user_name: approver_user_name })
    .then(async res => {
      stopSipnner(dispatch);

      if (res.data.status) {
        await getCompletedJobDetail(dispatch)
        return Promise.resolve(res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const approveCompletedJob = (job_number, approver_user_name, approve_status) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(APPROVE_COMPLETED_JOB, { job_number: job_number, approver_user_name: approver_user_name, approve_status: approve_status })
    .then(async res => {
      stopSipnner(dispatch);

      if (res.data.status) {
        await getCompletedJobDetail(dispatch)
        return Promise.resolve(res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const initCompletedJobs = () => dispatch => {
  return initAllCompletedJobs(dispatch)
}

const initAllCompletedJobs = dispatch => {
  startSipnner(dispatch)

  const searchKey = '';
  const pageNumber = 1;

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${GET_COMPLETED_JOBS}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`

  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INIT_COMPLETED_JOBS_LIST,
          payload: res.data.data.job_details
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const searchExpandCompletedJobsList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

  searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${GET_COMPLETED_JOBS}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      if (res.data.status && !searching) {
        dispatch({
          type: GET_COMPLETED_JOBS_LIST_BY_EXPAND,
          payload: res.data.data.job_details,
        })
        return Promise.resolve(res.data.data.job_details.length)
      } else {
        dispatch({
          type: GET_COMPLETED_JOBS_LIST_BY_SEARCH,
          payload: res.data.data.job_details,
        })
        return Promise.resolve(res.data.data.job_details.length)
      }
    })
    .catch(error => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}
