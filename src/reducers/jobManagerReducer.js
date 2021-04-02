import {
    GET_USER_JOBS
} from "../dataProvider/constant";

const INITIAL_STATE = {
    userJobs: [],
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case GET_USER_JOBS:
            return {
                ...state,
                userJobs: action.payload
            }
       
        default:
            return {
                ...state
            }
    }
}