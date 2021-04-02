import {
  SERVICE_AGENT_STAFF_LIST,
  ORG_USER_LIST,
  GET_JOB_DOC_VERSION_HISTORY
} from "../dataProvider/constant";

const INITIAL_STATE = {
  serviceAgentStaffList: [],
  orgUSerList: [],
  jobDocVersionHistory: {}
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SERVICE_AGENT_STAFF_LIST:
      return {
        ...state,
        serviceAgentStaffList: action.payload
      }
    case ORG_USER_LIST:
      return {
        ...state,
        orgUSerList: action.payload
      }
    case GET_JOB_DOC_VERSION_HISTORY: {
      return {
        ...state,
        jobDocVersionHistory: action.payload
      }
    }
    default:
      return {
        ...state
      }
  }
}