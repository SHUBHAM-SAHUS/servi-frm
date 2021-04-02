import {
    GET_JOB_DOCUMENTS_ALL_STAFF_URL,
    GET_JOB_STAFFLIST,
    JOB_DETAILS,
    GET_DETAILS_SITES,
    JOB_CERTIFICATES,
    GET_CERTIFICATES_LISTS,
    POST_JOB_DETAILS,
    SET_JOB_DOCUMENT_STEP,
    SET_STAFF_LIST,
    SET_ALL_ALLOCATED_SERVICE_STAFFS,
    SET_LICENCES_TYPE,
    SET_SELECTED_STAFF_LICENCES,
    SET_SELECTED_STAFF_USERS,
    SET_SELECTED_USER,
    SET_SELECTED_DOCUMENTS,
    SET_JOB_VIEW,
    GET_TOTAL_JOBDOC_VERSION
} from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'
import { getStorage } from '../utils/common';

export const setJobDocumentStep = (step) => {
    return {
        type: SET_JOB_DOCUMENT_STEP,
        payload: step,
    }
}

export const setAllocatedServiceAgents = (staffs) => {
    return {
        type: SET_ALL_ALLOCATED_SERVICE_STAFFS,
        payload: staffs,
    }
}

export const setSeletedStaffLicences = (licence) => {
    return {
        type: SET_SELECTED_STAFF_LICENCES,
        payload: licence,
    }
}

export const setSeletedStaffUsers = (users) => {
    return {
        type: SET_SELECTED_STAFF_USERS,
        payload: users,
    }
}


export const setSelecteduser = (users) => {
    return {
        type: SET_SELECTED_USER,
        payload: users,
    }
}
export const setSelectedDocument = (documents) => {
    return {
        type: SET_SELECTED_DOCUMENTS,
        payload: documents,
    }
}

export const setJobView = (value) => {
    return {
        type: SET_JOB_VIEW,
        payload: value,
    }
}

export const getServiceAgentAllStaff = () => dispatch => {
    startSipnner(dispatch);
    return scopeAxiosInstance.get(GET_JOB_DOCUMENTS_ALL_STAFF_URL)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_JOB_STAFFLIST,
                    payload: res.data.data.service_agents
                })
                return Promise.resolve(res.data.data.service_agents)
            }
        })
        .catch((error) => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ?
                error.response.data.message
                : Strings.network_error)
        });
}

export const getJobDetails = (jobId) => dispatch => {
    startSipnner(dispatch);
    return scopeAxiosInstance.get(JOB_DETAILS + jobId)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_DETAILS_SITES,
                    payload: res.data.data.job_details
                })
                dispatch({
                    type: SET_STAFF_LIST,
                    payload: res.data.data.job_doc_details
                })
                dispatch({
                    type: SET_LICENCES_TYPE,
                    payload: res.data.data.licience_types
                })
                dispatch({
                    type: GET_TOTAL_JOBDOC_VERSION,
                    payload: res.data.data.total_versions
                })
                dispatch(setJobDocumentFromApiResult(res.data.data.job_doc_details));
                return Promise.resolve({ job_details: res.data.data.job_details, job_doc_details: res.data.data.job_doc_details })
            }
        })
        .catch((error) => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ?
                error.response.data.message
                : Strings.network_error)
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

export const getJobDocumentCertificates = () => dispatch => {
    startSipnner(dispatch);
    return scopeAxiosInstance.get(JOB_CERTIFICATES)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_CERTIFICATES_LISTS,
                    payload: res.data.data.certificateList
                })
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

export const setServiceAgentAllStaff = formData => dispatch => {
    startSipnner(dispatch);
    const jobId = getStorage('JOB_ID');
    return scopeAxiosInstance.post(`${POST_JOB_DETAILS}`, formData)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch(getJobDetails(jobId));
                return Promise.resolve(res.data.message && res.data.message)
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error);
        })
}

export const updateJobDocument = formData => dispatch => {
    startSipnner(dispatch);
    const jobId = getStorage('JOB_ID');
    return scopeAxiosInstance.put(`${POST_JOB_DETAILS}`, formData)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch(getJobDetails(jobId));
                return Promise.resolve(res.data.message && res.data.message)
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error);
        })
}

