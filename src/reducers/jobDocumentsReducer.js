import {
    GET_JOB_STAFFLIST
} from "../dataProvider/constant";

const INITIAL_STATE = {
    staffList: []
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_JOB_STAFFLIST:
            return {
                ...state,
                staffList: action.payload
            }
        default:
            return {
                ...state
            }
    }
}