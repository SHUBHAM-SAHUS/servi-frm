import {
    GET_PERMISSION_BY_ROLE,
    GET_PERMISSION_BY_ALL_ROLE
} from '../dataProvider/constant';

const DEFAULT_STATE = {
    permissionByRole: [],
    permissionByAllRole: []
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case GET_PERMISSION_BY_ROLE:
            return { ...state, permissionByRole: action.payload };

        case GET_PERMISSION_BY_ALL_ROLE:
            return { ...state, permissionByAllRole: action.payload };
        default:
            return state;
    }
}