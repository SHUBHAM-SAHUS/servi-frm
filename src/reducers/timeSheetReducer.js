import {
  ORG_TIME_SHEET_LIST,
  COMPLETED_JOB_LIST, GET_INVOICES,
  INIT_JOB_TIME_SHEET_LIST,
  GET_JOB_TIME_SHEET_LIST_BY_EXPAND,
  GET_JOB_TIME_SHEET_LIST_BY_SEARCH
} from "../dataProvider/constant";

const INITIAL_STATE = {
  currentPageNumber: 1,
  timeSheetList: {},
  jobsList: [],
  invoices: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case ORG_TIME_SHEET_LIST:
      return {
        ...state,
        timeSheetList: action.payload
      }
    case COMPLETED_JOB_LIST:
      return {
        ...state,
        jobsList: action.jobsList
      }
    case GET_INVOICES:
      return {
        ...state,
        invoices: action.payload
      }
    case INIT_JOB_TIME_SHEET_LIST:
      state.jobsList = []
      return {
        ...state,
        jobsList: action.payload,
        currentPageNumber: 1
      }
    case GET_JOB_TIME_SHEET_LIST_BY_EXPAND:
      const jobsList = [...state.jobsList, ...action.payload]
      const updatedList = jobsList.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
      });
      return {
        ...state,
        jobsList: updatedList,
        currentPageNumber: state.currentPageNumber + 1,
      }
    case GET_JOB_TIME_SHEET_LIST_BY_SEARCH:
      return {
        ...state,
        jobsList: action.payload,
        currentPageNumber: 1
      }
    default:
      return {
        ...state
      }
  }
}