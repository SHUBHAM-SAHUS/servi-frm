import {
    GET_DETAILS_SITES,
    GET_CERTIFICATES_LISTS,
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
} from "../dataProvider/constant";

const INITIAL_STATE = {
    jobDetails: [],
    certificateList: [],
    step: [1],
    staffList: [],
    selectedStaff: [],
    licencesTypes: [],
    selectedLicences: [],
    selectedDocuments: [],
    isViewJob: false,
    selecteduser: [],
    selectedStaffUsers: [],
    totalJobDocVersion: 0
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_DETAILS_SITES:
            return {
                ...state,
                jobDetails: action.payload
            }
        case GET_CERTIFICATES_LISTS:
            return {
                ...state,
                certificateList: action.payload
            }
        case SET_JOB_DOCUMENT_STEP:
            return {
                ...state,
                step: action.payload
            }
        case SET_STAFF_LIST:
            return {
                ...state,
                staffList: action.payload
            }
        case SET_ALL_ALLOCATED_SERVICE_STAFFS:
            return {
                ...state,
                selectedStaff: action.payload
            }
        case SET_LICENCES_TYPE:
            return {
                ...state,
                licencesTypes: action.payload
            }
        case SET_SELECTED_STAFF_LICENCES:
            return {
                ...state,
                selectedLicences: action.payload
            }
        case SET_SELECTED_DOCUMENTS:
            return {
                ...state,
                selectedDocuments: action.payload
            }
        case SET_JOB_VIEW:
            return {
                ...state,
                isViewJob: action.payload
            }
        case SET_SELECTED_USER:
            return {
                ...state,
                selecteduser: action.payload
            }
        case SET_SELECTED_STAFF_USERS:
            return {
                ...state,
                selectedStaffUsers: action.payload
            }
        case GET_TOTAL_JOBDOC_VERSION:
            return {
                ...state,
                totalJobDocVersion: action.payload
            }
        default:
            return {
                ...state
            }
    }
}