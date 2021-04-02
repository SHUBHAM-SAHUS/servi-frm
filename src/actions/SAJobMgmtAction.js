import {
  JOB_URL, JOB_DETAILS, JOB_SIGNOFF, LOCK_SIGN_URL,
  GET_SWMS_SIGN, USER_LICENCES, JOB_REPORT_URL,
  GET_JOB_REPORT, PHOTOS_DOCS_URL, JOB_DETAILS_URL,
  GET_JOB_MEMBERS, JOB_MEMBERS_LIST, SIGNOFF_SHEET_URL,
  SWMS_SIGN_DETAIL_URL, GET_PHOTOS_DOCS_FILE,
  EMAIL_JOB_REPORT_URL, JOB_ALLOCATED_USER_URL, GET_SWMS_HISTORY,
  JOB_SCHEDULE_SHIFT_URL, USER_LICIENCE_DETAILS_URL, GET_JOB_REPORT_VERSION_HISTORY, SWMS_SIGN_DETAIL_HISTORY_URL, JOB_REPORT_HISTORY_URL, ADD_JOB_NOTES_URL, SEARCH_ORG_JOB_STAFF_URL
} from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance, { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize';

export const getPhotosDocsFileList = job_id => dispatch => {
  return getAllPhotosDocsFileAPI(dispatch, job_id)
}

const getAllPhotosDocsFileAPI = (dispatch, job_id) => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(PHOTOS_DOCS_URL + '?job_id=' + job_id)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_PHOTOS_DOCS_FILE,
          payload: res.data.data.job_photo_docs
        })
        return Promise.resolve(res.data.data.org_users)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const deletePhotosDocsFile = (formdata) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.delete(PHOTOS_DOCS_URL, { data: formdata })
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllPhotosDocsFileAPI(dispatch, formdata.job_id);
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const saveJobReport = (formData, job_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(JOB_REPORT_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      getAllJobReportAPI(dispatch, job_id)
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

export const getJobReport = (job_id, job_number) => dispatch => {
  return getAllJobReportAPI(dispatch, job_id, job_number)
}

const getAllJobReportAPI = (dispatch, job_id, job_number) => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(JOB_REPORT_URL + (job_id ? '?job_id=' + job_id : '?job_number=' + job_number))
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_JOB_REPORT,
          payload: res.data.data.job_cleaning_report,
          filePath: res.data.data.file_path,
          versionCount: res.data.data.total_versions
        })
        return Promise.resolve(res.data.data)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const updateJobReport = (formData, job_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(JOB_REPORT_URL, formData)
    .then(async res => {
      stopSipnner(dispatch);
      await getAllJobReportAPI(dispatch, job_id)
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

export const deleteReport = (formdata) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.delete(JOB_REPORT_URL, { data: formdata })
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllJobReportAPI(dispatch, formdata.job_id);
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const sendEmailJobReport = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(EMAIL_JOB_REPORT_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getJobDetails = job_number => dispatch => {
  return getUpdatedJobDetails(dispatch, job_number)
}

const getUpdatedJobDetails = (dispatch, job_number) => {
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
export const updateJob = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(JOB_URL, formData)
    .then(async res => {
      await getUpdatedJobDetails(dispatch, formData.job_number)
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
export const getSWMSSignDetails = job_number => dispatch => {
  return getAllgetSWMSSignDetails(dispatch, job_number)
}

const getAllgetSWMSSignDetails = (dispatch, job_number) => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(SWMS_SIGN_DETAIL_URL + '?job_number=' + job_number)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_SWMS_SIGN,
          payload: res.data.data.job_swms_sign,
          total_versions: res.data.data.total_versions
        })
        return Promise.resolve(res.data.data.org_users)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const addJobSWMSSign = (formData, job_number) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(SWMS_SIGN_DETAIL_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllgetSWMSSignDetails(dispatch, job_number)
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}


export const lockSignatureProcess = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(LOCK_SIGN_URL, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        await getAllgetSWMSSignDetails(dispatch, formData.job_number)
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const updateJobScheduleShift = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(JOB_SCHEDULE_SHIFT_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      getUpdatedJobDetails(dispatch, formData.job_number)
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

export const getJobSignOff = job_number => dispatch => {
  return getAllJobSignOff(dispatch, job_number)
}

const getAllJobSignOff = (dispatch, job_number) => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(SIGNOFF_SHEET_URL + '?job_number=' + job_number)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: JOB_SIGNOFF,
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

export const deleteJobScheduleShift = (shift_id, job_number) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.delete(JOB_SCHEDULE_SHIFT_URL + '?id=' + shift_id)
    .then(res => {
      stopSipnner(dispatch);
      getUpdatedJobDetails(dispatch, job_number)
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

export const getSingleUserLicences = user_name => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(USER_LICIENCE_DETAILS_URL + '?license_user_name=' + user_name)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: USER_LICENCES,
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

export const signOffJobSheet = (formData, job_number) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(SIGNOFF_SHEET_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      getAllJobSignOff(dispatch, job_number);
      return Promise.resolve(res.data.message);

    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const updateUserSiteTime = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(JOB_ALLOCATED_USER_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      getUpdatedJobDetails(dispatch, formData.job_number)
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



export const getJobMembers = job_id => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(JOB_MEMBERS_LIST + '?job_id=' + job_id)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_JOB_MEMBERS,
          payload: res.data.data.staff_list
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

export const getJobReportVersionHistory = (job_id, job_number, version) => dispatch => {
  startSipnner(dispatch);
  const url = `${JOB_REPORT_HISTORY_URL}?job_id=${job_id}&job_number=${job_number}&version=${version}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_JOB_REPORT_VERSION_HISTORY,
          payload: res.data.data.job_cleaning_report,
          filePath: res.data.data.file_path,
        })
        return Promise.resolve(res.data.data)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getSWMSHistory = (job_number, version) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(SWMS_SIGN_DETAIL_HISTORY_URL + '?job_number=' + job_number + "&version=" + version)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_SWMS_HISTORY,
          payload: res.data.data.job_swms_sign,
        })
        return Promise.resolve(res.data.data.org_users)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getStaffBySearchKey = (searchKey, shift_date, site_time, yard_time, finish_time, shift_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${SEARCH_ORG_JOB_STAFF_URL}?key=${searchKey}`, {
    headers: {
      'shift_date': shift_date,
      'site_time': site_time,
      'yard_time': yard_time,
      'finish_time': finish_time,
      'shift_id': shift_id ? shift_id : null
    }
  }).then(res => {
    stopSipnner(dispatch);
    if (res.data.status) {
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

export const addJobNotes = (formData, job_number) => dispatch => {
  startSipnner(dispatch);

  return scopeAxiosInstance.post(ADD_JOB_NOTES_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getUpdatedJobDetails(dispatch, job_number);
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}