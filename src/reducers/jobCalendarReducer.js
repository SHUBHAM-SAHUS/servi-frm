import {
  CALENDAR_GET_JOBS_LIST,
  CALENDAR_GET_ACCOUNT_MANAGERS_LIST
} from "../dataProvider/constant";

const INITIAL_STATE = {
  jobsList: [],
  accountManagersList: [],
  zones: [],
  accountManagers: [],
  stateNames: [],
  parentJobs: [],
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case CALENDAR_GET_JOBS_LIST:
      return {
        ...state,
        jobsList: action.jobs,
        stateNames: action.stateNames,
        zones: action.zones,
        parentJobs: action.parentJobs
      }
    case CALENDAR_GET_ACCOUNT_MANAGERS_LIST:
      return {
        ...state,
        accountManagersList: action.payload
      }
    default:
      return {
        ...state
      }
  }
}