import {
    GET_SMS_TEMPLATE_LIST,
    GET_SMS_TEMPLATE_DETAILS,
    SMS_TEMPLATE_URL,
    GET_SMS_TEMPLATE_DETAIL_URL,
    ADD_UPDATE_SMS_TEMPLATE_URL,
    GET_SMS_DROP_DOWN,
    GET_SMS_DROP_DOWN_URL,
    INIT_SMS_TEMPLATE_LIST,
    GET_SMS_TEMPLATE_LIST_BY_EXPAND,
    GET_SMS_TEMPLATE_LIST_BY_SEARCH,
    ADMIN_DETAILS
} from "../dataProvider/constant";
import { startSipnner, stopSipnner, stopMiniSpinner, startMiniSpinner, stopScrollSpinner, startScrollSpinner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';
import { getStorage } from '../utils/common';

const getAllSmsTemplateApi = dispatch => {
    startSipnner(dispatch);
    return axiosInstance.get(SMS_TEMPLATE_URL)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_SMS_TEMPLATE_LIST,
                    payload: res.data.data.result.Items
                })
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const getSmsTemplate = () => dispatch => {
    return getAllSmsTemplateApi(dispatch);
}

export const initSmsTemplate = () => dispatch => {
    return initAllSmsTemplateApi(dispatch)
}

const initAllSmsTemplateApi = dispatch => {
    startSipnner(dispatch)

    const searchKey = '';
    const pageNumber = 1;

    const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    const url = `${SMS_TEMPLATE_URL}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`

    return axiosInstance.get(url)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: INIT_SMS_TEMPLATE_LIST,
                    payload: res.data.data.result.Items
                })
                return Promise.resolve()
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const searchExpandSmsTemplateList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

    searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

    const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    const url = `${SMS_TEMPLATE_URL}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`
    return axiosInstance.get(url)
        .then(res => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            if (res.data.status && !searching) {
                dispatch({
                    type: GET_SMS_TEMPLATE_LIST_BY_EXPAND,
                    payload: res.data.data.result.Items,
                })
                return Promise.resolve(res.data.data.result.Items.length)
            } else {
                dispatch({
                    type: GET_SMS_TEMPLATE_LIST_BY_SEARCH,
                    payload: res.data.data.result.Items,
                })
                return Promise.resolve(res.data.data.result.length)
            }
        })
        .catch(error => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const getSmsTemplateDetails = (slug) => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.get(GET_SMS_TEMPLATE_DETAIL_URL + '?slug=' + slug)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_SMS_TEMPLATE_DETAILS,
                    payload: res.data.data.result.Items
                })
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const addSmsTemplate = (formData) => dispatch => {
    startSipnner(dispatch)
    return axiosInstance.post(ADD_UPDATE_SMS_TEMPLATE_URL, formData)
        .then(res => {
            stopSipnner(dispatch)
            if (res.data.status) {
                //initSmsTemplate()
                getAllSmsTemplateApi(dispatch)
                return Promise.resolve(res && res.data && res.data.message)
            }
        }).catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response : Strings.network_error)
        })
}

export const updateSmsTemplate = (formData) => dispatch => {
    startSipnner(dispatch)
    return axiosInstance.put(ADD_UPDATE_SMS_TEMPLATE_URL, formData)
        .then(res => {
            stopSipnner(dispatch)
            if (res.data.status) {
                getAllSmsTemplateApi(dispatch)
                return Promise.resolve(res && res.data && res.data.message)
            }
        }).catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response : Strings.network_error)
        })
}

export const getSmsDropDown = () => dispatch => {
    startSipnner(dispatch)
    return axiosInstance.get(GET_SMS_DROP_DOWN_URL)
        .then(res => {
            stopSipnner(dispatch)
            if (res.data.status) {
                dispatch({
                    type: GET_SMS_DROP_DOWN,
                    payload: res.data.data.result
                })
                return Promise.resolve(true)
            }
        }).catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}