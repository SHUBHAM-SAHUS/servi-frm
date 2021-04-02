import {
  GET_SCOPE_DOC_QUOTE_LIST,
  GET_CLIENT_ABN_LIST,
  GET_PRIMARY_PERSON_LIST,
  GET_SITE_LIST,
  GET_TASK_LIST,
  GET_ACCOUNT_MANAGER,
  GET_ALL_SCOPE_FILTER
} from "../dataProvider/constant";

const DEFAULT_STATE = {
  quotes: [],
  clients: [],
  scopedocNumbers: [],
  primaryPerson: [],
  jobNames: [],
  siteName: [],
  siteAddress: [],
  siteCities: [],
  siteState: [],
  siteContries: [],
  taskNameList: [],
  areasList: [],
  accMngList: [],
  createdBy: [],
  modifiedBy: []
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case GET_SCOPE_DOC_QUOTE_LIST:
      return {
        ...state,
        quotes: action.payload,
        scopedocNumbers: action.scopeNumbers,
        jobNames: action.jobNames,
        modifiedBy: action.modifiedBy,
        createdBy: action.createdBy
      };
    case GET_CLIENT_ABN_LIST:
      return {
        ...state,
        clients: action.payload
      };
    case GET_PRIMARY_PERSON_LIST:
      return {
        ...state,
        primaryPerson: action.payload
      };
    case GET_SITE_LIST:
      return {
        ...state,
        siteName: action.siteName,
        siteAddress: action.siteAddress,
        siteCities: action.siteCities,
        siteState: action.siteState,
        siteContries: action.siteContries
      };

    case GET_TASK_LIST:
      return {
        ...state,
        taskNameList: action.payload,
        areasList: action.areasList,
        accMngList: action.accMngList
      };

    case GET_ACCOUNT_MANAGER:
      return {
        ...state,
        accMngList: action.payload
      };

      case GET_ALL_SCOPE_FILTER:
        return {
          ...state,
          quotes: action.payload.quote_numbers,
          clients: action.payload.clients,
          scopedocNumbers: action.payload.scope_doc_numbers,
          primaryPerson: action.payload.client_persons_list,
          jobNames: action.payload.job_names,
          siteName: action.payload.site_names,
          siteAddress: action.payload.site_address,
          siteCities: action.payload.site_cities,
          siteState: action.payload.site_states,
          siteContries: action.payload.site_countries,
          taskNameList: action.payload.tasks,
          areasList: action.payload.areas,
          accMngList: action.payload.acc_manager_list,
          createdBy: action.payload.created_by,
          modifiedBy: action.payload.modified_by
        }

    default:
      return state;
  }
};
