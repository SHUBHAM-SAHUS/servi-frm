import { startSipnner, stopSipnner } from "../utils/spinner";
import { scopeAxiosInstance } from "../dataProvider/axiosHelper";
import { Strings } from "../dataProvider/localize";
import { getAdvanceSearchArgs } from './scopeDocActions.js';
import {
    ADMIN_TIMESHEET_FILTERS_URL, ADMIN_TIMESHEET_FILTERS, ADMIN_TIMESHEET_URL, ADMIN_TIMESHEET
    , OWN_TIME_SHEET_URL, OWN_TIME_SHEET
} from '../dataProvider/constant';

export const getTimeSheetFilters = () => dispatch => {
    return getAllTimeSheetFilters(dispatch)
}

const getAllTimeSheetFilters = dispatch => {
    startSipnner(dispatch)

    const url = ADMIN_TIMESHEET_FILTERS_URL

    return scopeAxiosInstance.get(url)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: ADMIN_TIMESHEET_FILTERS,
                    payload: res.data.data.timesheet
                })
                return Promise.resolve()
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const getAdminTimeSheets = (formData) => dispatch => {
    return getAllAdminTimeSheets(dispatch, formData)
}

const getAllAdminTimeSheets = (dispatch, formData) => {
    startSipnner(dispatch)
    var filterString = getAdvanceSearchArgs(formData)

    const url = ADMIN_TIMESHEET_URL + "?" + filterString

    return scopeAxiosInstance.get(url)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: ADMIN_TIMESHEET,
                    payload: res.data.data.timesheet
                })
                return Promise.resolve()
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const getOwnTimeSheet = (formData) => dispatch => {
    return getAllOwnTimeSheet(dispatch, formData)
}

const getAllOwnTimeSheet = (dispatch, formData) => {
    startSipnner(dispatch)
    // var filterString = getAdvanceSearchArgs(formData)

    const url = OWN_TIME_SHEET_URL

    return scopeAxiosInstance.get(url)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: OWN_TIME_SHEET,
                    payload: res.data.data
                })
                return Promise.resolve()
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const addOwnTimeSheet = (formData) => dispatch => {
    startSipnner(dispatch);
    return scopeAxiosInstance.post(OWN_TIME_SHEET_URL, formData)
        .then(res => {
            delete formData.timesheet_list
            getAllAdminTimeSheets(dispatch, formData)
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

export const updateOwnTimeSheet = (formData) => dispatch => {
    startSipnner(dispatch);
    return scopeAxiosInstance.put(OWN_TIME_SHEET_URL, formData)
        .then(res => {
            delete formData.timesheet_list
            getAllAdminTimeSheets(dispatch, formData.searchKeys)
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