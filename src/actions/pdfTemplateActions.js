import {
    GET_PDF_TEMPLATE,
    GET_PDF_TEMPLATE_DETAIL,
    GET_PDF_TEMPLATE_URL,
    GET_PDF_TEMPLATE_DETAIL_URL,
    GET_PDF_DROP_DOWN,
    GET_PDF_DROP_DOWN_URL,
    GET_ALL_PDF_TEMPLATE_URL,
    INIT_PDF_TEMPLATE,
    GET_PDF_TEMPLATE_LIST_BY_EXPAND,
    GET_PDF_TEMPLATE_LIST_BY_SEARCH,
    ADMIN_DETAILS
} from '../dataProvider/constant';
import { startSipnner, stopSipnner, stopMiniSpinner, startMiniSpinner, stopScrollSpinner, startScrollSpinner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';
import { getStorage } from '../utils/common';


const getAllPdfTemplateApi = dispatch => {
    startSipnner(dispatch);
    return axiosInstance.get(GET_ALL_PDF_TEMPLATE_URL)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_PDF_TEMPLATE,
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

export const getPdfTemplate = () => dispatch => {
    return getAllPdfTemplateApi(dispatch);
}

export const initPdfTemplate = () => dispatch => {
    return initAllPdfTemplateApi(dispatch)
}

const initAllPdfTemplateApi = dispatch => {
    startSipnner(dispatch)

    const searchKey = '';
    const pageNumber = 1;

    const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    const url = `${GET_ALL_PDF_TEMPLATE_URL}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`

    return axiosInstance.get(url)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: INIT_PDF_TEMPLATE,
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

export const searchExpandPdfTemplateList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

    searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

    const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    const url = `${GET_ALL_PDF_TEMPLATE_URL}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}`
    return axiosInstance.get(url)
        .then(res => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            if (res.data.status && !searching) {
                dispatch({
                    type: GET_PDF_TEMPLATE_LIST_BY_EXPAND,
                    payload: res.data.data.result.Items,
                })
                return Promise.resolve(res.data.data.result.Items.length)
            } else {
                dispatch({
                    type: GET_PDF_TEMPLATE_LIST_BY_SEARCH,
                    payload: res.data.data.result.Items,
                })
                return Promise.resolve(res.data.data.result.Items.length)
            }
        })
        .catch(error => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const addPdfTemplate = formData => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.post(GET_PDF_TEMPLATE_URL, formData)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                getAllPdfTemplateApi(dispatch)
                //initPdfTemplate()
                return Promise.resolve(res && res.data && res.data.message)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const updatePdfTemplate = formData => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.put(GET_PDF_TEMPLATE_URL, formData)
        .then(async res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                await getAllPdfTemplateApi(dispatch)
                return Promise.resolve(res && res.data && res.data.message)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const getPdfTemplateDatail = (slug) => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.get(GET_PDF_TEMPLATE_DETAIL_URL + '?slug=' + slug)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_PDF_TEMPLATE_DETAIL,
                    payload: res.data.data.result.Items
                })
                return Promise.resolve(res && res.data)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}


export const getPdfDropDown = () => dispatch => {
    startSipnner(dispatch)
    return axiosInstance.get(GET_PDF_DROP_DOWN_URL)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_PDF_DROP_DOWN,
                    payload: res.data.data.result
                })
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}