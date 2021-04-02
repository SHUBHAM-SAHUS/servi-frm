import {
    GET_ACCESS_CONTROL_BY_MODULE
} from '../dataProvider/constant';

const DEFAULT_STATE = {
    accessControlsByModule: []
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case GET_ACCESS_CONTROL_BY_MODULE:
            return { ...state, accessControlsByModule: action.payload };
        default:
            return state;
    }
}