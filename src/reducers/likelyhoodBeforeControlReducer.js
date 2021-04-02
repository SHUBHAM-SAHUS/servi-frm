import {
    GET_LIKELYHOOD_BEFORE_CONTROL_GET,
    INIT_LIKELYHOOD_BEFORE_CONTROL_LIST,
    GET_LIKELYHOOD_BEFORE_CONTROL_BY_EXPAND,
    GET_LIKELYHOOD_BEFORE_CONTROL_BY_SEARCH,
} from '../dataProvider/constant';

const DEFAULT_STATE = {
    currentPageNumber: 1,
    likelyhoodBeforeControls: [],
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case GET_LIKELYHOOD_BEFORE_CONTROL_GET:
            return { ...state, likelyhoodBeforeControls: action.payload };
        case INIT_LIKELYHOOD_BEFORE_CONTROL_LIST:
            state.likelyhoodBeforeControls = []
            return {
                ...state,
                likelyhoodBeforeControls: action.payload,
                currentPageNumber: 1
            }
        case GET_LIKELYHOOD_BEFORE_CONTROL_BY_EXPAND:
            const likelyhoodBeforeControls = [...state.likelyhoodBeforeControls, ...action.payload]
            const updatedList = likelyhoodBeforeControls.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
            });
            return {
                ...state,
                likelyhoodBeforeControls: updatedList,
                currentPageNumber: state.currentPageNumber + 1,
            }
        case GET_LIKELYHOOD_BEFORE_CONTROL_BY_SEARCH:
            return {
                ...state,
                likelyhoodBeforeControls: action.payload,
                currentPageNumber: 1
            }
        default:
            return state;
    }
}