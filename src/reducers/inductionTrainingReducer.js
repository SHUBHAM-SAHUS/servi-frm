import {
    GET_COURSES,
    GET_COURSE_DETAILS,
    INIT_COURSE_LIST,
    GET_COURSE_LIST_BY_SEARCH,
    GET_COURSE_MODULE_LIST,
    GET_COURSE_LIST_BY_SEARCH_BY_EXPAND
} from '../dataProvider/constant';

const INITIAL_STATE = {
    courses: [],
    count: 0,
    course_details: {},
    one_course_completed: '',
    s3_base_path_url: '',
    coursesList: [],
    currentPageNumber: 1,
    courseModuleList: []
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_COURSES:
            return {
                ...state,
                courses: action.payload,
                count: action.count,
                one_course_completed: action.one_course_completed,
                s3_base_path_url: action.s3_base_path_url
            }
        case GET_COURSE_DETAILS:
            return {
                ...state,
                course_details: action.payload
            }
        case INIT_COURSE_LIST:
            return {
                ...state,
                coursesList: action.payload,
                currentPageNumber: 1
            }
        case GET_COURSE_LIST_BY_SEARCH:
            return {
                ...state,
                coursesList: action.payload,
                currentPageNumber: 1
            }
        case GET_COURSE_LIST_BY_SEARCH_BY_EXPAND:
            const coursesList = [...state.coursesList, ...action.payload]
            const updatedList = coursesList.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
            });
            return {
                ...state,
                coursesList: updatedList,
                currentPageNumber: state.currentPageNumber + 1,
            }
        case GET_COURSE_MODULE_LIST:
            return {
                ...state,
                courseModuleList: action.payload
            }
        default:
            return {
                ...state
            }
    }
}