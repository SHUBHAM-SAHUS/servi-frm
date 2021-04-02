import {
  GET_ALL_HAZARDS,
  GET_ALL_INCIDENTS,
  INCIDENT_REPORT_DETAILS,
  GET_INCIDENT_CATEGORIES,
  HAZARD_REPORT_DETAILS,
  GET_ALL_INCIDENTS_BY_JOBS,
  GET_ALL_HAZARDS_By_JOB, RISK_CONTROL_URL, GET_RISK_CONTROL, GET_ACTION_ASSIGN,
  GET_LIKELIHOOD_URL,
  GET_CONSEQUENCES_URL,
  HAZARD_DETAILS
} from '../dataProvider/constant'
import {
  BASE_SCOPE_API_URL
} from '../dataProvider/env.config';
import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance, { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import axios from 'axios'
import { Strings } from '../dataProvider/localize';

export const addIncidentReport = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(BASE_SCOPE_API_URL + '/incident-report', formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response
        : Strings.network_error)
    });
}

export const getRiskControls = () => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(RISK_CONTROL_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_RISK_CONTROL,
          payload: res.data.data.result
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getIncidentCategories = () => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get('/incident-category')
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_INCIDENT_CATEGORIES,
          categories: res.data.data.category_list
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const addHazardReport = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(BASE_SCOPE_API_URL + '/hazard-report-new', formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response
        : Strings.network_error)
    });
}

export const getAllIncidents = orgId => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(`/incident-report?org_id=${orgId}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ALL_INCIDENTS,
          incidentReports: res.data.data.incident_report_list
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getIncidentDetails = (id, orgId, jobId) => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(BASE_SCOPE_API_URL + `/incident-report?id=${id}&job_id=${jobId}&org_id=${orgId}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INCIDENT_REPORT_DETAILS,
          incidentReportDetails: res.data.data
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getAllHazards = orgId => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(`/hazard-report?org_id=${orgId}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ALL_HAZARDS,
          hazardReports: res.data.data.hazardReportDetail
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getAllHazardsNew = orgId => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(`/hazard-report-new`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ALL_HAZARDS,
          hazardReports: res.data.data.hazardReportDetail
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getHazardDetailsNew = (id, orgId, jobId) => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(BASE_SCOPE_API_URL + `/hazard-report-new?id=${id}&job_id=${jobId}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: HAZARD_DETAILS,
          payload: res.data.data.hazard_reports_details
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getHazardDetails = (id, orgId, jobId) => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(BASE_SCOPE_API_URL + `/hazard-report?id=${id}&job_id=${jobId}&org_id=${orgId}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: HAZARD_REPORT_DETAILS,
          hazardReportDetails: res.data.data
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getAllIncidentsByJobId = (orgId, jobId) => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(`/incident-report?org_id=${orgId}&job_id=${jobId}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ALL_INCIDENTS_BY_JOBS,
          payload: res.data.data.incident_report_list
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getAllHazardsByJobId = (orgId, jobId) => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(`/hazard-report-new?org_id=${orgId}&job_id=${jobId}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ALL_HAZARDS_By_JOB,
          payload: res.data.data.hazardReportDetail
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getActionAssign = (actionID) => dispatch => {
  return getActionAssignApi(dispatch, actionID)
}

const getActionAssignApi = (dispatch, actionID) => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(`/incident-report-history?incident_corrective_id=${actionID}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ACTION_ASSIGN,
          payload: res.data.data.result
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const AssignCorrectiveAction = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post("/incident-report-history", formData)
    .then(res => {
      stopSipnner(dispatch);
      getActionAssignApi(dispatch, formData.incident_corrective_id)
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

export const AssignHazard = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put("/hazard-report-new", formData)
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

export const getAllLikelihoodBeforeControl = () => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(BASE_SCOPE_API_URL + GET_LIKELIHOOD_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: 'GET_ALL_LIKELIHOOD_BEFORE_CONTROL',
          payload: res.data.data.likelihood_before
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getAllBeforeConsequences = () => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.get(BASE_SCOPE_API_URL + GET_CONSEQUENCES_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: 'GET_ALL_BEFORE_CONSEQUENCES',
          payload: res.data.data.Consequences
        })
        return Promise.resolve()
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}