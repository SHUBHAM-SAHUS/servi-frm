import {
  ADMIN_DETAILS,
  JOB_TIME_SHEET_URL,
  ORG_TIME_SHEET_LIST,
  GET_COMPLETED_JOB_LIST,
  COMPLETED_JOB_LIST,
  SAVE_TIMESHEET_URL,
  APPROVE_TIMESHEET_URL,
  GET_INVOICES,
  INIT_JOB_TIME_SHEET_LIST,
  GET_JOB_TIME_SHEET_LIST_BY_EXPAND,
  GET_JOB_TIME_SHEET_LIST_BY_SEARCH
} from '../dataProvider/constant'
import { startSipnner, stopSipnner, stopMiniSpinner, startMiniSpinner, stopScrollSpinner, startScrollSpinner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'
import { getStorage } from '../utils/common';

export const getStaffTimeSheetList = (job_id) => dispatch => {
  return getUpdatedStaffTimeSheetList(dispatch, job_id);
}

export const getCompletedJobList = () => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${GET_COMPLETED_JOB_LIST}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: COMPLETED_JOB_LIST,
          jobsList: res.data.data.job_details,
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

const getUpdatedStaffTimeSheetList = (dispatch, job_id) => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${JOB_TIME_SHEET_URL}?job_id=${job_id}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: ORG_TIME_SHEET_LIST,
          payload: res.data.data,
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const initStaffTimeSheetList = () => dispatch => {
  return initAllStaffTimeSheetListApi(dispatch)
}

const initAllStaffTimeSheetListApi = dispatch => {
  startSipnner(dispatch)

  const searchKey = '';
  const pageNumber = 1;

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${GET_COMPLETED_JOB_LIST}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`

  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INIT_JOB_TIME_SHEET_LIST,
          payload: res.data.data.jobsList
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const searchExpandStaffTimeSheetList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

  searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${GET_COMPLETED_JOB_LIST}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      if (res.data.status && !searching) {
        dispatch({
          type: GET_JOB_TIME_SHEET_LIST_BY_EXPAND,
          payload: res.data.data.jobsList,
        })
        return Promise.resolve(res.data.data.jobsList.length)
      } else {
        dispatch({
          type: GET_JOB_TIME_SHEET_LIST_BY_SEARCH,
          payload: res.data.data.jobsList,
        })
        return Promise.resolve(res.data.data.jobsList.length)
      }
    })
    .catch(error => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const updateSingleStaff = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(JOB_TIME_SHEET_URL, formData)
    .then(res => {
      getUpdatedStaffTimeSheetList(dispatch, formData.job_id)
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

export const saveTimesheet = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(SAVE_TIMESHEET_URL, formData)
    .then(res => {
      getUpdatedStaffTimeSheetList(dispatch, formData.job_id)
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

export const approveTimesheet = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(APPROVE_TIMESHEET_URL, formData)
    .then(res => {
      getUpdatedStaffTimeSheetList(dispatch, formData.job_id)
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


export const approveJobReport = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post("/approve-job-report", formData)
    .then(res => {
      getUpdatedStaffTimeSheetList(dispatch, formData.job_id)
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


export const getInvoices = (job_number) => dispatch => {
  return getAllInvicesAPI(dispatch, job_number);
}


const getAllInvicesAPI = (dispatch, job_number) => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`/job-invoice?job_number=${job_number}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_INVOICES,
          payload: res.data.data.invoiceDetails,
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const saveInvoice = (formData, job_number) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post("/job-invoice", formData)
    .then(res => {
      getAllInvicesAPI(dispatch, job_number)
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

export const deleteSingleStaff = (user_name, timesheet_id, job_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.delete(JOB_TIME_SHEET_URL + '?user_name=' + user_name + '&id=' + timesheet_id)
    .then(res => {
      getUpdatedStaffTimeSheetList(dispatch, job_id)
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