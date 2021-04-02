import {
    GET_LIKELYHOOD_BEFORE_CONTROL_GET,
    GET_LIKELYHOOD_BEFORE_CONTROL_URL,
    INIT_LIKELYHOOD_BEFORE_CONTROL_LIST,
    GET_LIKELYHOOD_BEFORE_CONTROL_BY_EXPAND,
    GET_LIKELYHOOD_BEFORE_CONTROL_BY_SEARCH,
} from '../dataProvider/constant';
import {
    startSipnner, stopSipnner, startMiniSpinner, startScrollSpinner, stopMiniSpinner,
    stopScrollSpinner
} from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';

const getAllLikelyhoodBeforeControlApi = dispatch => {
    return scopeAxiosInstance.get(GET_LIKELYHOOD_BEFORE_CONTROL_URL)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_LIKELYHOOD_BEFORE_CONTROL_GET,
                    payload: res.data.data.likelihood_before
                })
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const getLikelyhoodBeforeControl = () => dispatch => {
    startSipnner(dispatch);
    return getAllLikelyhoodBeforeControlApi(dispatch);
}

export const initLikelyhoodBeforeControl = () => dispatch => {
    return initAllLikelyhoodBeforeControlApi(dispatch)
}

const initAllLikelyhoodBeforeControlApi = dispatch => {
    startSipnner(dispatch)

    const searchKey = '';
    const pageNumber = 1;

    const url = `${GET_LIKELYHOOD_BEFORE_CONTROL_URL}?search_key=${searchKey}&page=${pageNumber}`

    return scopeAxiosInstance.get(url)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: INIT_LIKELYHOOD_BEFORE_CONTROL_LIST,
                    payload: res.data.data.likelihood_before
                })
                return Promise.resolve()
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const searchExpandLikelyhoodBeforeControlList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

    searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

    const url = `${GET_LIKELYHOOD_BEFORE_CONTROL_URL}?search_key=${searchKey}&page=${pageNumber}`
    return scopeAxiosInstance.get(url)
        .then(res => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            if (res.data.status && !searching) {
                dispatch({
                    type: GET_LIKELYHOOD_BEFORE_CONTROL_BY_EXPAND,
                    payload: res.data.data.likelihood_before,
                })
                return Promise.resolve(res.data.data.likelihood_before.length)
            } else {
                dispatch({
                    type: GET_LIKELYHOOD_BEFORE_CONTROL_BY_SEARCH,
                    payload: res.data.data.likelihood_before,
                })
                return Promise.resolve(res.data.data.likelihood_before.length)
            }
        })
        .catch(error => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const addLikekyhoodBeforeContol = formData => dispatch => {
    startSipnner(dispatch);
    return scopeAxiosInstance.post(GET_LIKELYHOOD_BEFORE_CONTROL_URL, formData)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                //getAllLikelyhoodBeforeControlApi(dispatch)
                initLikelyhoodBeforeControl(dispatch)
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const updateLikelyhoodBeforeControl = formData => dispatch => {
    startSipnner(dispatch);
    return scopeAxiosInstance.put(GET_LIKELYHOOD_BEFORE_CONTROL_URL, formData)
        .then(async res => {
            stopSipnner(dispatch)
            if (res.data.status) {
                await getAllLikelyhoodBeforeControlApi(dispatch)
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}