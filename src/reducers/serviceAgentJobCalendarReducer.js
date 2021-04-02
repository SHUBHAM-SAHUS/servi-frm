import {
  SA_JOB_GET_SUPERVISORS,
  SA_JOB_CALENDAR_GET_JOBS,
  SA_JOB_GET_SELECTED_TASK,
  SA_JOB_CALENDAR_GET_STAFF,
  SA_JOB_GET_SITE_SUPERVISORS,
  GET_CONNECTED_ORG
} from '../dataProvider/constant'

const INITIAL_STATE = {
  jobsList: [],
  parentJobs: [],
  statesList: [],
  jobStaffMembers: [],
  supervisorsList: [],
  numberOfShifts: 0,
  selectedJobDetails: {},
  siteSupervisorsList: [],
  currentCalendarEvent: {},
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SA_JOB_CALENDAR_GET_JOBS:
      return {
        ...state,
        jobsList: action.jobs,
        statesList: action.states,
        parentJobs: action.parentJobs
      }
    case SA_JOB_CALENDAR_GET_STAFF:
      return {
        ...state,
        jobStaffMembers: action.jobStaff
      }
    case SA_JOB_GET_SUPERVISORS:
      return {
        ...state,
        supervisorsList: action.supervisors
      }
    case SA_JOB_GET_SITE_SUPERVISORS:
      return {
        ...state,
        siteSupervisorsList: action.siteSupervisors
      }
    case SA_JOB_GET_SELECTED_TASK:
      return {
        ...state,
        selectedJobDetails: action.selectedJobDetails,
        numberOfShifts: action.numberOfShifts,
        currentCalendarEvent: action.currentCalendarEvent,
        jobNotes: action.jobNotes,
      }
    case GET_CONNECTED_ORG:
      return {
        ...state,
        connectedOrg: action.connectedOrg,
      }
    default:
      return state
  }
}