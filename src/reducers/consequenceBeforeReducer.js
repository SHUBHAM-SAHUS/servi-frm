import {
    GET_CONSEQUENCE_BEFORE_CONTROL_GET,
    INIT_CONSEQUENCE_BEFORE_CONTROL_LIST,
    GET_CONSEQUENCE_BEFORE_CONTROL_BY_EXPAND,
    GET_CONSEQUENCE_BEFORE_CONTROL_BY_SEARCH
} from '../dataProvider/constant';

const DEFAULT_STATE = {
    currentPageNumber: 1,
    consequenceBeforeControls: [],
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case GET_CONSEQUENCE_BEFORE_CONTROL_GET:
            return { ...state, consequenceBeforeControls: action.payload };
        case INIT_CONSEQUENCE_BEFORE_CONTROL_LIST:
            state.consequenceBeforeControls = []
            return {
                ...state,
                consequenceBeforeControls: action.payload,
                currentPageNumber: 1
            }
        case GET_CONSEQUENCE_BEFORE_CONTROL_BY_EXPAND:
            const consequenceBeforeControls = [...state.consequenceBeforeControls, ...action.payload]
            const updatedList = consequenceBeforeControls.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
            });
            return {
                ...state,
                consequenceBeforeControls: updatedList,
                currentPageNumber: state.currentPageNumber + 1,
            }
        case GET_CONSEQUENCE_BEFORE_CONTROL_BY_SEARCH:
            return {
                ...state,
                consequenceBeforeControls: action.payload,
                currentPageNumber: 1
            }
        default:
            return state;
    }
} 