import {
    GET_COURSES_URL,
    GET_COURSES,
    GET_COURSE_DETAILS,
    GET_COURSE_DETAILS_URL,
    ADD_MODULE_RESULT_URL,
    USER_COURSE_PROGRESS_URL,
    USER_COURSE_MODULE_PROGRESS_URL,
    INIT_COURSE_LIST,
    GET_COURSE_LIST_BY_SEARCH,
    GET_COURSES_LIST,
    GET_COURSES_MODULE,
    GET_COURSE_MODULE_LIST,
    NEW_MODULE_URL,
    GET_COURSE_LIST_BY_SEARCH_BY_EXPAND
} from '../dataProvider/constant';
import { startSipnner, stopSipnner, startMiniSpinner, startScrollSpinner, stopScrollSpinner, stopMiniSpinner } from '../utils/spinner';
import axiosInstance, { } from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';

export const getCourses = (page_no) => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.get(`${GET_COURSES_URL}?page_no=${page_no}`)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_COURSES,
                    payload: res.data.data.result.rows,
                    count: res.data.data.result.count,
                    one_course_completed: res.data.data.result.one_course_completed,
                    s3_base_path_url: res.data.data.result.s3_base_path_url
                })
                return Promise.resolve(true)
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

const getCourseDetailsByCourseId = (dispatch, id, user_id) => {
    startSipnner(dispatch);
    return axiosInstance.get(`${GET_COURSE_DETAILS_URL}?id=${id}`, {
        headers: {
            'user_id': user_id
        }
    }).then(res => {
        stopSipnner(dispatch);
        if (res.data.status && res.data.data && res.data.data.course_details.length > 0) {
            dispatch({
                type: GET_COURSE_DETAILS,
                payload: res.data.data.course_details[0]
            })
            return Promise.resolve(true)
        }
    })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const getCourseDetailsApi = (id, user_id) => dispatch => {
    return getCourseDetailsByCourseId(dispatch, id, user_id);
}

export const addModuleQuestionAnswerByUser = (data) => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.post(`${ADD_MODULE_RESULT_URL}`, data)
        .then(res => {
            // getCourseDetailsByCourseId(dispatch, data.course_id, data.user_id);
            stopSipnner(dispatch);
            if (res.data.status) {
                return Promise.resolve(res.data.message);
            } else {
                return Promise.reject(res.data.message);
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const updateUserCourseProgress = (data) => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.post(`${USER_COURSE_PROGRESS_URL}`, data)
        .then(res => {
            getCourseDetailsByCourseId(dispatch, data.course_id, data.user_id);
            stopSipnner(dispatch);
            if (res.data.status) {
                return Promise.resolve(res.data.message);
            } else {
                return Promise.reject(res.data.message);
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const updateUserCourseModuleProgress = (data) => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.post(`${USER_COURSE_MODULE_PROGRESS_URL}`, data)
        .then(res => {
            getCourseDetailsByCourseId(dispatch, data.course_id, data.user_id);
            stopSipnner(dispatch);
            if (res.data.status) {
                return Promise.resolve(res.data.message);
            } else {
                return Promise.reject(res.data.message);
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const initCourses = () => dispatch => {
    return initAllCoursesApi(dispatch)
}

const initAllCoursesApi = dispatch => {
    startSipnner(dispatch)
    const searchKey = '';
    const pageNumber = 1;

    const url = `${GET_COURSES_LIST}?search_key=${searchKey}&page=${pageNumber}`

    return axiosInstance.get(url)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: INIT_COURSE_LIST,
                    payload: res.data.data.course_list.rows
                })
                return Promise.resolve()
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const searchExpandCoursesList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

    searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

    const url = `${GET_COURSES_LIST}?search_key=${searchKey}&page=${pageNumber}`
    return axiosInstance.get(url)
        .then(res => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            if (res.data.status && !searching) {
                dispatch({
                    type: GET_COURSE_LIST_BY_SEARCH_BY_EXPAND,
                    payload: res.data.data.course_list.rows
                })
                return Promise.resolve(res.data.data.course_list.rows.length)
            } else {
                dispatch({
                    type: GET_COURSE_LIST_BY_SEARCH,
                    payload: res.data.data.course_list.rows
                })
                return Promise.resolve(res.data.data.course_list.rows.length)
            }
        })
        .catch(error => {
            searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const addCourse = (formData) => dispatch => {
    startSipnner(dispatch);
    const finalFormData = new FormData();

    Object.keys(formData).forEach(key => {
        if (key === 'org_role')
            finalFormData.append(key, JSON.stringify(formData[key]));

        else if (key === 'course_modules')
            finalFormData.append(key, JSON.stringify(formData[key]));

        else if (key === 'tags')
            finalFormData.append(key, JSON.stringify(formData[key]));
        else
            finalFormData.append(key, formData[key])
        /* 
                if (key === 'cover_file')
                    finalFormData.append('cover_file', formData[key])
        
                if (key === 'course_video')
                    finalFormData.append('course_video', formData[key])
        
                if (key !== 'org_role' && key !== 'course_modules' && key !== 'tags'
                    && key !== 'cover_file' && key !== 'course_video')
                    finalFormData.append(key, formData[key]) */
    });

    return axiosInstance.post(GET_COURSES_LIST, finalFormData)
        .then(res => {
            stopSipnner(dispatch);
            //getEquipmentsList(dispatch);
            initAllCoursesApi(dispatch)
            
            return Promise.resolve(res.data && res.data.message)
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response : Strings.generic_validate);
        })
}

export const getCourseModule = () => dispatch => {
    startSipnner(dispatch)

    const url = `${GET_COURSES_MODULE}`

    return axiosInstance.get(url)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status) {
                dispatch({
                    type: GET_COURSE_MODULE_LIST,
                    payload: res.data.data.course_module_list
                })
                return Promise.resolve()
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const addNewModule = (data) => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.post(`${NEW_MODULE_URL}`, data)
        .then(res => {
            // getCourseDetailsByCourseId(dispatch, data.course_id, data.user_id);
            stopSipnner(dispatch);
            if (res.data.status) {
                return Promise.resolve(res.data.message);
            } else {
                return Promise.reject(res.data.message);
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const updateModule = (data) => dispatch => {
    startSipnner(dispatch);
    return axiosInstance.put(`${NEW_MODULE_URL}`, data)
        .then(res => {
            // getCourseDetailsByCourseId(dispatch, data.course_id, data.user_id);
            stopSipnner(dispatch);
            if (res.data.status) {
                return Promise.resolve(res.data.message);
            } else {
                return Promise.reject(res.data.message);
            }
        })
        .catch(error => {
            stopSipnner(dispatch)
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        });
}

export const updateCourses = (formData) => dispatch => {
    startSipnner(dispatch);
    const finalFormData = new FormData();

    Object.keys(formData).forEach(key => {
        if (key === 'org_role')
            finalFormData.append(key, JSON.stringify(formData[key]));

        else if (key === 'course_modules')
            finalFormData.append(key, JSON.stringify(formData[key]));

        else if (key === 'tags')
            finalFormData.append(key, JSON.stringify(formData[key]));
        else
            finalFormData.append(key, formData[key])

    });

    return axiosInstance.put(GET_COURSES_LIST, finalFormData)
        .then(res => {
            stopSipnner(dispatch);
            //getEquipmentsList(dispatch);
            initAllCoursesApi(dispatch)

            return Promise.resolve(res.data && res.data.message)
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response : Strings.generic_validate);
        })
}