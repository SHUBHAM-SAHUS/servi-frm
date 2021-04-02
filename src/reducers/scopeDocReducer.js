import {
  GET_SCOPE_DOC_LIST,
  INIT_SCOPE_DOCS_LIST,
  GET_SCOPE_DOC_LIST_BY_EXPAND,
  GET_SCOPE_DOC_LIST_BY_SEARCH,
  GET_SITES_BY_PERSON,
  GET_SCOPE_DOC_DETAILS,
  SCOPE_DOC_GET_SITES_LIST,
  SCOPE_DOC_GET_CLIENTS_LIST,
  SCOPE_DOC_GET_PRIMARY_PERSONS_LIST,
  GET_ADMIN_LIST,
  SCOPE_DOC_GET_EQUIPMENT_LIST,
  JOB_DOC_GET_EMAIL_LIST,
  JOB_DOC_GET_EMAIL_DETAILS,
  GET_JOB_DOC_DETAILS,
  GET_SCOPE_DOC_VERSION_HISTORY,
  SET_TOTAL_VERSIONS, GET_TASK_TAGS, GET_TASK_TAGS_LIST_BY_EXPAND
} from '../dataProvider/constant';
import _ from "lodash";

const DEFAULT_STATE = {
  currentPageNumber: 1,
  scopeDocs: [],
  scopeDocsDetails: [],
  sitesList: [],
  clientsList: [],
  primaryPersons: [],
  sitesListByPersons: [],
  adminList: [],
  equipmentList: [],
  jobDocEmailList: [],
  jobDocEmailDetails: {},
  jobDocsDetails: {},
  scopeDocVersionHistory: {},
  versionCount: 0,
  versions: [],
  historyMetadata: [],
  taskTags: [],
  currentPageNumberTags: 1
}

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_SCOPE_DOC_LIST: {
      return {
        ...state,
        scopeDocs: action.payload
      }
    }
    case INIT_SCOPE_DOCS_LIST:
      state.scopeDocs = []
      return {
        ...state,
        scopeDocs: action.payload,
        currentPageNumber: 1
      }
    case GET_SCOPE_DOC_LIST_BY_EXPAND:
      const scopeDocs = [...state.scopeDocs, ...action.payload]
      const updatedList = scopeDocs.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
      });
      return {
        ...state,
        scopeDocs: updatedList,
        currentPageNumber: state.currentPageNumber + 1,
      }
    case GET_SCOPE_DOC_LIST_BY_SEARCH:
      return {
        ...state,
        scopeDocs: action.payload,
        currentPageNumber: 1
      }
    case GET_SCOPE_DOC_DETAILS:
      const versionArray = [];
      for (let count = 1; count <= action.versionCount; count++) {
        versionArray.push(count)
      }
      return {
        ...state,
        scopeDocsDetails: action.payload,
        versionCount: action.versionCount,	
        versions: versionArray,
        historyMetadata: action.historyMetadata
      }
    case SCOPE_DOC_GET_SITES_LIST:
      return {
        ...state,
        sitesList: action.payload
      }
    case SCOPE_DOC_GET_CLIENTS_LIST:
      return {
        ...state,
        clientsList: action.payload
      }
    case SCOPE_DOC_GET_PRIMARY_PERSONS_LIST:
      return {
        ...state,
        primaryPersons: action.payload
      }
    case GET_SITES_BY_PERSON:
      return {
        ...state,
        sitesListByPersons: action.payload
      }
    case GET_ADMIN_LIST:
      return {
        ...state,
        adminList: action.payload
      }
    case SCOPE_DOC_GET_EQUIPMENT_LIST:
      return {
        ...state,
        equipmentList: action.payload
      }
    case JOB_DOC_GET_EMAIL_LIST:
      return {
        ...state,
        jobDocEmailList: action.payload
      }
    case JOB_DOC_GET_EMAIL_DETAILS:
      return {
        ...state,
        jobDocEmailDetails: action.payload
      }
    case GET_JOB_DOC_DETAILS:
      const jobDocVersionArray = [];
      for (let count = 1; count <= action.versionCount; count++) {
        jobDocVersionArray.push(count)
      }
      return {
        ...state,
        jobDocsDetails: action.payload,
        versionCount: action.versionCount,
        versions: jobDocVersionArray
      }
    case GET_SCOPE_DOC_VERSION_HISTORY:
      return {
        ...state,
        scopeDocVersionHistory: action.payload
      }
    case SET_TOTAL_VERSIONS:
      const scopeDocVersionArray = [];
      for (let count = 1; count <= action.payload; count++) {
        scopeDocVersionArray.push(count)
      }
      return {
        ...state,
        versionCount: action.payload,
        versions: scopeDocVersionArray
      }

    case GET_TASK_TAGS:
      return { ...state, taskTags: action.payload, currentPageNumberTags: 1 }

    case GET_TASK_TAGS_LIST_BY_EXPAND:
      const orgCerti = [...state.taskTags, ...action.payload]
      const updatedLst = orgCerti.filter((obj, pos, arr) => {
        return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
      });
      return {
        ...state,
        taskTags: updatedLst,
        currentPageNumberTags: state.currentPageNumberTags + 1,
      }
    default:
      return state;
  }
}