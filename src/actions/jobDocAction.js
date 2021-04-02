import {
  GENERATE_JOB_DOC_URL,
  DEFAULT_STAFF_ALLOCATED_USERS,
  GET_ORGANISATION_CERTIFICATE_URL,
  GET_SERVICE_AGENT_ALL_STAFF_URL,
  SCOPE_DOC_DETAILS_URL,
  JOB_DOC_URL,
  GET_SCOPE_DOC_DETAILS,
  ORG_USER_LIST,
  GET_JOB_DOCUMENTS,
  UPLOAD_JOB_DOC_PDF_URL,
  JOB_DOC_HISTORY_URL,
  GET_JOB_DOC_VERSION_HISTORY,
  GET_JOB_DOC_CLIENT_PREVIEW_URL,
  GET_DETAILS_SITES,
  SET_STAFF_LIST,
  SET_LICENCES_TYPE,
  SET_SELECTED_DOCUMENTS,
  GET_TOTAL_JOBDOC_VERSION
} from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import axiosInstance from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize'

export const generateJobDocNumber = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(GENERATE_JOB_DOC_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
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

export const getDefaultAllocatedUsers = org_id => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(DEFAULT_STAFF_ALLOCATED_USERS + '?organisation_id=' + org_id)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
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

export const getOrganisationCertificates = org_id => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(GET_ORGANISATION_CERTIFICATE_URL + '?organisation_id=' + org_id)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.data.certificateList)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getServiceAgentAllStaff = service_agent_id => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(GET_SERVICE_AGENT_ALL_STAFF_URL + '?organisation_id=' + service_agent_id)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: ORG_USER_LIST,
          payload: res.data.data.org_users
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

export const createJobDoc = (formData, scope_doc_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(JOB_DOC_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      scopeDocDetails(scope_doc_id, dispatch);
      if (res.data.status) {
        return Promise.resolve({ message: res.data.message, job_doc_number: res.data.data.job_doc_number })
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const updateJobDoc = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(JOB_DOC_URL, formData)
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

export const scopeDocDetails = (scope_id, dispatch) => {
  startSipnner(dispatch)
  const url = SCOPE_DOC_DETAILS_URL + '?id=' + scope_id
  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_SCOPE_DOC_DETAILS,
          payload: res.data.data.scope_docs
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getJobDocument = data => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(GET_JOB_DOCUMENTS + '?id=' + data)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        return Promise.resolve(res.data.data)
      }
    }).catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const uploadJobDocPdf = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(UPLOAD_JOB_DOC_PDF_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getJobDocVersionHistory = (jobDocNumber, jobDocVersion) => dispatch => {
  startSipnner(dispatch);
  const url = `${JOB_DOC_HISTORY_URL}?job_doc_no=${jobDocNumber}&version=${jobDocVersion}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      console.log('Response')
      stopSipnner(dispatch)
      if (res.data.status) {
        let history = res.data.data.job_doc_history[0];
        dispatch({
          type: GET_JOB_DOC_VERSION_HISTORY,
          payload: res.data.data.job_doc_history[0]
        })

        dispatch({
          type: GET_DETAILS_SITES,
          payload: history.job_doc_data.job_details
      })
      dispatch({
          type: SET_STAFF_LIST,
          payload: history.job_doc_data.job_doc_details
      })
      dispatch({
          type: SET_LICENCES_TYPE,
          payload: history.job_doc_data.licience_types
      })
      dispatch({
          type: GET_TOTAL_JOBDOC_VERSION,
          payload:history.job_doc_data.total_versions
      })
      dispatch(setJobDocumentFromApiResult(history.job_doc_data.job_doc_details));

        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      console.log('Error')
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error : Strings.network_error)
    });
}


export const setJobDocumentFromApiResult = (jobDocDetail) => dispatch => {
  let documents = [];
  if (jobDocDetail && jobDocDetail.length > 0) {
      jobDocDetail.map(job => {
          if (job.job_doc_orgs_certificates && job.job_doc_orgs_certificates.length > 0) {
              job.job_doc_orgs_certificates.map(doc => {
                  documents.push(doc.orgs_certificate_id)
              })
          }
      })
      dispatch({
          type: SET_SELECTED_DOCUMENTS,
          payload: documents
      })
  }
}

export const getJobDetailsForClientPreview = jobDocNumber => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(GET_JOB_DOC_CLIENT_PREVIEW_URL + '?job_doc_no=' + jobDocNumber)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.data.job_doc_details);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}