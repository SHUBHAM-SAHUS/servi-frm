import {
  SCOPE_DOC_QUOTE_LIST_URL,
  GET_SCOPE_DOC_QUOTE_LIST,
  ADMIN_DETAILS,
  SCOPE_DOC_CLIENT_URL,
  GET_CLIENT_ABN_LIST,
  CLIENT_PERSON_URL,
  GET_PRIMARY_PERSON_LIST,
  ORG_SITE_LIST_URL,
  GET_SITE_LIST,
  ORG_TASK_LIST_URL,
  GET_TASK_LIST,
  CALENDAR_GET_ACCOUNT_MANAGER_URL,
  GET_ACCOUNT_MANAGER, ALL_SCOPE_FILTER_URL, GET_ALL_SCOPE_FILTER
} from "../dataProvider/constant";
import { startSipnner, stopSipnner } from "../utils/spinner";
import { scopeAxiosInstance } from "../dataProvider/axiosHelper";
import { Strings } from "../dataProvider/localize";
import { getStorage } from "../utils/common";
import { getAdvanceSearchArgs } from "./scopeDocActions";

export const getScopedocQuoteList = () => dispatch => {
  // startSipnner(dispatch);
  return scopeAxiosInstance
    .get(
      SCOPE_DOC_QUOTE_LIST_URL +
      "?organisation_id=" +
      JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    )
    .then(res => {
      // stopSipnner(dispatch);
      dispatch({
        type: GET_SCOPE_DOC_QUOTE_LIST,
        payload: res.data.data.quote_numbers,
        scopeNumbers: res.data.data.scope_doc_numbers,
        jobNames: res.data.data.job_names,
        modifiedBy: res.data.data.modified_by,
        createdBy: res.data.data.created_by
      });
      return Promise.resolve(res.data.message);
    })
    .catch(error => {
      // stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getClientABN = () => dispatch => {
  // startSipnner(dispatch);
  return scopeAxiosInstance
    .get(
      SCOPE_DOC_CLIENT_URL +
      "?organisation_id=" +
      JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    )
    .then(res => {
      // stopSipnner(dispatch);
      dispatch({
        type: GET_CLIENT_ABN_LIST,
        payload: res.data.data.clients
      });
      return Promise.resolve(res.data.message);
    })
    .catch(error => {
      // stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getClientPrimaryContact = () => dispatch => {
  // startSipnner(dispatch);
  return scopeAxiosInstance
    .get(
      CLIENT_PERSON_URL +
      "?organisation_id=" +
      JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    )
    .then(res => {
      // stopSipnner(dispatch);
      dispatch({
        type: GET_PRIMARY_PERSON_LIST,
        payload: res.data.data.client_persons_list
      });
      return Promise.resolve(res.data.message);
    })
    .catch(error => {
      // stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getOrgSiteList = () => dispatch => {
  // startSipnner(dispatch);
  return scopeAxiosInstance
    .get(
      ORG_SITE_LIST_URL +
      "?organisation_id=" +
      JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    )
    .then(res => {
      // stopSipnner(dispatch);
      dispatch({
        type: GET_SITE_LIST,
        // payload: res.data.data.job_names,
        siteName: res.data.data.site_names,
        siteAddress: res.data.data.site_address,
        siteCities: res.data.data.site_cities,
        siteState: res.data.data.site_states,
        siteContries: res.data.data.site_countries
      });
      return Promise.resolve(res.data.message);
    })
    .catch(error => {
      // stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getOrgTaskList = () => dispatch => {
  // startSipnner(dispatch);
  return scopeAxiosInstance
    .get(
      ORG_TASK_LIST_URL +
      "?organisation_id=" +
      JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    )
    .then(res => {
      // stopSipnner(dispatch);
      dispatch({
        type: GET_TASK_LIST,
        payload: res.data.data.tasks,
        areasList: res.data.data.areas,
        accMngList: res.data.data.acc_manager_list
      });
      return Promise.resolve(res.data.message);
    })
    .catch(error => {
      // stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getAccManager = () => dispatch => {
  // startSipnner(dispatch);
  return scopeAxiosInstance
    .get(
      CALENDAR_GET_ACCOUNT_MANAGER_URL +
      "?organisation_id=" +
      JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    )
    .then(res => {
      // stopSipnner(dispatch);
      dispatch({
        type: GET_ACCOUNT_MANAGER,
        payload: res.data.data.account_managers
      });
      return Promise.resolve(res.data.message);
    })
    .catch(error => {
      // stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

/* New Filter Item API */
export const getScopeDocFilters = (advanceSearchValues = {}) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(
      ALL_SCOPE_FILTER_URL +
      "?id=" +
      JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id + getAdvanceSearchArgs(advanceSearchValues)
    )
    .then(res => {
      stopSipnner(dispatch);
      dispatch({
        type: GET_ALL_SCOPE_FILTER,
        payload: res.data.data.scope_docs
      });
      return Promise.resolve(res.data.message);
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

