import {
    CALENDAR_GET_ACCOUNT_MANAGERS_LIST,
    BOOKING_CALENDAR_GET_JOBS_LIST,
    HIGHLIGHT_JOB_TASKS,
    SELECT_TASKS_FOR_DISAPROVAL,
    SET_BOOKING_CALENDAR_STATE,
    CLEAR_TASKS_FOR_DISAPROVAL,
    RELEASE_JOB_TASKS
} from "../dataProvider/constant";

const INITIAL_STATE = {
    showBookingCalendar: false,
    jobsList: [],
    accountManagersList: [],
    quoteId: "",
    zones: [],
    accountManagers: [],
    stateNames: [],
    parentJobs: [],
    selectedTasks: [],
    selectedTasksForDisapproval: [],
    selectedQuoteId: ''
}

export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
        case BOOKING_CALENDAR_GET_JOBS_LIST:
            return {
                ...state,
                jobsList: action.jobs,
                quoteId: action.quoteId
            }
        case CALENDAR_GET_ACCOUNT_MANAGERS_LIST:
            return {
                ...state,
                accountManagersList: action.payload
            }
        case HIGHLIGHT_JOB_TASKS:
            return {
                ...state,
                jobsList: action.tasks,
                selectedTasks: action.selectedTasks
            }
        case RELEASE_JOB_TASKS:
            return {
                ...state,
                jobsList: action.tasks,
                selectedTasks: []
            }
        case SELECT_TASKS_FOR_DISAPROVAL:
            state.jobsList.forEach((task, index) => {
                if (task.job_id === action.selectedJobId) {
                    if (action.selectedTasksForDisapproval.includes(task.id)) {
                        task.is_selected_for_disapproval = true
                    }
                }
            })
            return {
                ...state,
                jobsList: state.jobsList,
            }
        case CLEAR_TASKS_FOR_DISAPROVAL:
            state.jobsList.forEach((task, index) => {
                task.is_selected_for_disapproval = false
            })
            return {
                ...state,
                jobsList: state.jobsList
            }
        case SET_BOOKING_CALENDAR_STATE:
            return {
                ...state,
                showBookingCalendar: action.payload
            }
        default:
            return {
                ...state
            }
    }
}