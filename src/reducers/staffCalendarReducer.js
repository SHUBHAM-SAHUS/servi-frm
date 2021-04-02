import {
  STAFF_CALENDAR_GET_JOBS_LIST,
  CALENDAR_GET_ACCOUNT_MANAGERS_LIST,
  GET_SA_STAFF,
  GET_ALLOCATE,
} from "../dataProvider/constant";

const INITIAL_STATE = {
  staffJobsList: [],
  accountManagersList: [],
  zones: [],
  accountManagers: [],
  stateNames: [],
  siteSupervisor: [],
  stateStaff: [],
  allocateInstances: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case STAFF_CALENDAR_GET_JOBS_LIST:
      return {
        ...state,
        staffJobsList: action.jobs,
        stateNames: action.stateNames,
      };
    case CALENDAR_GET_ACCOUNT_MANAGERS_LIST:
      return {
        ...state,
        accountManagersList: action.payload,
      };
    case GET_SA_STAFF:
      return {
        ...state,
        siteSupervisor: action.payload.site_supervisors,
        stateStaff: action.payload.states,
      };
    case GET_ALLOCATE:
      return {
        ...state,
        allocateInstances: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
