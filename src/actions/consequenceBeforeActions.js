import {
    GET_CONSEQUENCE_BEFORE_CONTROL_GET,
    GET_CONSEQUENCE_BEFORE_CONTROL_URL,
    INIT_CONSEQUENCE_BEFORE_CONTROL_LIST,
    GET_CONSEQUENCE_BEFORE_CONTROL_BY_EXPAND,
    GET_CONSEQUENCE_BEFORE_CONTROL_BY_SEARCH
} from '../dataProvider/constant';
import {
    startSipnner, stopSipnner, startMiniSpinner, startScrollSpinner, stopMiniSpinner,
    stopScrollSpinner
} from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';

const getAllConsequenceBeforeApi = dispatch => {
    return scopeAxiosInstance.get(GET_CONSEQUENCE_BEFORE_CONTROL_URL)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_CONSEQUENCE_BEFORE_CONTROL_GET,
                    payload: res.data.data.Consequences
                })
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const getAllConsequenceBefore = () => dispatch => {
    startSipnner(dispatch);
    return getAllConsequenceBeforeApi(dispatch);
}

export const initConsequenceBefore = () => dispatch => {
    return initAllConsequenceBeforeApi(dispatch)
}

const initAllConsequenceBeforeApi = dispatch => {
    startSipnner(dispatch)

    const searchKey = '';
    const pageNumber = 1;

    const url = `${GET_CONSEQUENCE_BEFORE_CONTROL_URL}?search_key=${searchKey}&page=${pageNumber}`

    return scopeAxiosInstance.get(url)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: INIT_CONSEQUENCE_BEFORE_CONTROL_LIST,
                    payload: res.data.data.Consequences
                })
                return Promise.resolve()
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const searchExpandConsequenceBeforeList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

    searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

    const url = `${GET_CONSEQUENCE_BEFORE_CONTROL_URL}?search_key=${searchKey}&page=${pageNumber}`
    return scopeAxiosInstance.get(url)
        .then(res => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            if (res.data.status && !searching) {
                dispatch({
                    type: GET_CONSEQUENCE_BEFORE_CONTROL_BY_EXPAND,
                    payload: res.data.data.Consequences
                })
                return Promise.resolve(res.data.data.Consequences.length)
            } else {
                dispatch({
                    type: GET_CONSEQUENCE_BEFORE_CONTROL_BY_SEARCH,
                    payload: res.data.data.Consequences,
                })
                return Promise.resolve(res.data.data.Consequences.length)
            }
        })
        .catch(error => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const addConsequenceBefore = formData => dispatch => {
    startSipnner(dispatch);
    return scopeAxiosInstance.post(GET_CONSEQUENCE_BEFORE_CONTROL_URL, formData)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                //getAllConsequenceBeforeApi(dispatch)
                initAllConsequenceBeforeApi(dispatch)
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const updateConsequenceBefore = formData => dispatch => {
    startSipnner(dispatch);
    return scopeAxiosInstance.put(GET_CONSEQUENCE_BEFORE_CONTROL_URL, formData)
        .then(async res => {
            stopSipnner(dispatch)
            if (res.data.status) {
                await getAllConsequenceBeforeApi(dispatch)
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}