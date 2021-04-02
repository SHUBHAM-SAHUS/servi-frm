import {
    ADMIN_TIMESHEET_FILTERS, ADMIN_TIMESHEET, OWN_TIME_SHEET
} from "../dataProvider/constant";

const INITIAL_STATE = {
    sataffList: [],
    saList: [],
    timeSheetsList: [],
    ownTimeSheet: {}
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case ADMIN_TIMESHEET_FILTERS:
            return {
                ...state,
                sataffList: action.payload.staff_list,
                saList: action.payload.sa_list
            }
        case ADMIN_TIMESHEET:
            return {
                ...state,
                timeSheetsList: action.payload

            }
        case OWN_TIME_SHEET:
            return {
                ...state,
                ownTimeSheet: action.payload

            }
        default:
            return {
                ...state
            }
    }
}