import {
  SCOPE_DOC_URL,
  GET_SCOPE_DOC_LIST,
  GET_SCOPE_DOC_DETAILS,
  SCOPE_DOC_DETAILS_URL,
  SCOPE_DOC_SITE_URL,
  ADMIN_DETAILS,
  USER_NAME,
  SCOPE_DOC_CLIENT_URL,
  SCOPE_DOC_TASK_URL,
  ADD_SCOPE_DOC_URL,
  SCOPE_DOC_GET_SITES,
  SCOPE_DOC_GET_SITES_LIST,
  SCOPE_DOC_GET_CLIENTS_LIST,
  SCOPE_DOC_GET_PRIMARY_PERSONS_LIST,
  SCOPE_DOC_EMAIL_QUOTE_URL, SAVE_QUOTE_URL, SITE_URL, SITES_LIST_BY_PERSON,
  GET_SITES_BY_PERSON, SCOPE_DOC_EQUIPMENTS_URL, SCOPE_DOC_GET_EQUIPMENT_LIST,
  JOB_DOC_EMAIL_URL, JOB_DOC_GET_EMAIL_LIST, JOB_DOC_GET_EMAIL_DETAILS, JOB_DOC_EMAIL_DETAILS_URL, GET_JOB_DOC_DETAILS_URL,
  GET_JOB_DOC_DATAILS, SWMS_SHEET_EMAIL_URL, EMAIL_JOB_REPORT_URL, GET_JOB_DOC_DETAILS, UPDATE_CLIENT_URL, REORDER_TASK_URL,
  GET_SCOPE_DOC_LIST_BY_EXPAND, GET_SCOPE_DOC_LIST_BY_SEARCH,
  INIT_SCOPE_DOCS_LIST, SCOPE_DOC_HISTORY_URL, GET_SCOPE_DOC_VERSION_HISTORY,
  TASK_TAGS_URL, GET_TASK_TAGS, GET_TASK_TAGS_LIST_BY_EXPAND, REBOOK_QUOTE_URL,
  SWMS_COMPLETED_URL, SAVE_SCOPE_DOC_JOB, BOOK_JOB_URL
} from '../dataProvider/constant'

import {
  startSipnner,
  stopSipnner,
  stopMiniSpinner,
  startMiniSpinner,
  stopScrollSpinner,
  startScrollSpinner
} from "../utils/spinner";
import { scopeAxiosInstance } from "../dataProvider/axiosHelper";
import { Strings } from "../dataProvider/localize";
import { getStorage } from "../utils/common";

export const getScopeDoc = () => dispatch => {
  return getAllScopeDocsApi(dispatch);
};

const getAllScopeDocsApi = dispatch => {
  startSipnner(dispatch);
  const org_id = JSON.parse(getStorage(ADMIN_DETAILS))
    ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    : null;
  const url = SCOPE_DOC_URL + "?id=" + org_id;
  return scopeAxiosInstance
    .get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_SCOPE_DOC_LIST,
          payload: res.data.data.scope_docs
        });
        return Promise.resolve();
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const initScopeDocs = advanceSeacrhOpt => dispatch => {
  var args = "";
  if (advanceSeacrhOpt) {
    args = getAdvanceSearchArgs(advanceSeacrhOpt);
  }
  return initAllScopeDocsApi(dispatch, args);
};

const initAllScopeDocsApi = (dispatch, args) => {
  startSipnner(dispatch);

  const searchKey = "";
  const pageNumber = 1;

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS))
    ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    : null;
  const url =
    `${SCOPE_DOC_URL}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}` +
    args;

  return scopeAxiosInstance
    .get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INIT_SCOPE_DOCS_LIST,
          payload: res.data.data.scope_docs
        });
        return Promise.resolve();
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getAdvanceSearchArgs = advanceSeacrhOpt => {
  if (
    Object.keys(advanceSeacrhOpt) &&
    Object.keys(advanceSeacrhOpt).length > 0
  ) {
    var args = "";
    Object.keys(advanceSeacrhOpt).forEach(key => {
      // args = `${args}&${key}=${JSON.stringify(advanceSeacrhOpt[key])}`
      args = `${args}&${key}=${encodeURIComponent(JSON.stringify(advanceSeacrhOpt[key]))}`;
    });
    return args;
  }
  return "";
};

export const searchExpandScopeDocsList = (
  searchKey = "",
  pageNumber = 1,
  searching,
  scrolling,
  advanceSeacrhOpt
) => dispatch => {
  var args = "";
  if (advanceSeacrhOpt) {
    args = getAdvanceSearchArgs(advanceSeacrhOpt);
  }

  searching
    ? startMiniSpinner(dispatch)
    : scrolling
      ? startScrollSpinner(dispatch)
      : startSipnner(dispatch);

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS))
    ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    : null;
  const url =
    `${SCOPE_DOC_URL}?id=${org_id}&search_key=${searchKey}&page=${pageNumber}` +
    args;
  return scopeAxiosInstance
    .get(url)
    .then(res => {
      searching
        ? stopMiniSpinner(dispatch)
        : scrolling
          ? stopScrollSpinner(dispatch)
          : stopSipnner(dispatch);
      if (res.data.status && !searching) {
        dispatch({
          type: GET_SCOPE_DOC_LIST_BY_EXPAND,
          payload: res.data.data.scope_docs
        });
        return Promise.resolve(res.data.data.scope_docs.length);
      } else {
        dispatch({
          type: GET_SCOPE_DOC_LIST_BY_SEARCH,
          payload: res.data.data.scope_docs
        });
        return Promise.resolve(res.data.data.scope_docs.length);
      }
    })
    .catch(error => {
      searching
        ? stopMiniSpinner(dispatch)
        : scrolling
          ? stopScrollSpinner(dispatch)
          : stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getScopeDocDetails = (scope_id, task_id, quote_number) => dispatch => {
  return scopeDocDetails(scope_id, dispatch, task_id, quote_number);
};

export const scopeDocDetails = (
  scope_id,
  dispatch,
  task_id,
  quote_number,
  spinnerFlag = true
) => {
  if (spinnerFlag) startSipnner(dispatch);
  var url = SCOPE_DOC_DETAILS_URL + "?id=" + scope_id;
  if (task_id) {
    url = url + "&task_id=" + task_id;
  }
  if (quote_number) {
    url = url + "&quote_number=" + quote_number;
  }
  return scopeAxiosInstance
    .get(url)
    .then(res => {
      if (spinnerFlag) stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_SCOPE_DOC_DETAILS,
          payload: res.data.data.scope_docs,
          versionCount: res.data.data.total_versions,
          historyMetadata: res.data.data.history_details
        })
        return Promise.resolve("success")
      }
    })
    .catch(error => {
      if (spinnerFlag) stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const addScopeDoc = formData => dispatch => {
  startSipnner(dispatch);
  var finalFormData = new FormData();
  const files = [];
  Object.keys(formData).forEach(keyOfFormData => {
    if (keyOfFormData === "sites") {
      formData[keyOfFormData].forEach((site, siteIndex) => {
        Object.keys(site).forEach(keyOfSite => {
          if (keyOfSite === "tasks") {
            site[keyOfSite].forEach((task, taskIndex) => {
              Object.keys(task).forEach(keyOfTask => {
                if (keyOfTask === "files") {
                  task[keyOfTask].forEach((file, fileIndex) => {
                    finalFormData.append("files", file.originFileObj);
                    files.push({
                      site: `${site.site_id != null && site.site_id != undefined ? site.site_id : siteIndex}`,
                      task: `${taskIndex}`,
                      file: `${fileIndex}`,
                      filename: `${file.name}`
                    });
                  });
                }
              });
              task.estimate = task.estimate || 0;
            });
          }
        });
      });
    }
  });
  Object.keys(formData).forEach(key => {
    if (key !== 'job_name' && key !== "conditions")
      finalFormData.append(key, JSON.stringify(formData[key]));
    else
      finalFormData.append(key, formData[key]);
  });

  finalFormData.append("fileMap", JSON.stringify(files));

  return scopeAxiosInstance
    .post(ADD_SCOPE_DOC_URL, finalFormData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        initAllScopeDocsApi(dispatch);
      }
      return Promise.resolve(res.data);
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const UpdateScopeDoc = formData => dispatch => {
  startSipnner(dispatch);
  var files = [];
  var generateQuoteFlag = Boolean(formData.save_quote_flag);
  var finalFormData = new FormData();
  Object.keys(formData).forEach(key => {
    if (key === "conditions") {
      finalFormData.append(key, formData[key])
    } else
      finalFormData.append(key, JSON.stringify(formData[key]));
  });
  Object.keys(formData).forEach(keyOfFormData => {
    if (keyOfFormData === 'sites') {
      formData[keyOfFormData] && formData[keyOfFormData].forEach((site, siteIndex) => {
        Object.keys(site).forEach(keyOfSite => {
          if (keyOfSite === 'tasks') {
            site[keyOfSite] && site[keyOfSite].forEach((task, taskIndex) => {
              Object.keys(task).forEach(keyOfTask => {
                if (keyOfTask === 'files') {
                  task[keyOfTask] && task[keyOfTask].forEach((file, fileIndex) => {
                    finalFormData.append('files', file.originFileObj)
                    files.push({
                      site: `${task.site_id ? task.site_id : siteIndex}`,
                      task: `${taskIndex}`,
                      filename: `${file.name}`
                    });
                  });
                  delete task[keyOfTask];
                }
              });
            });
          }
        });
      });
    }
  });

  finalFormData.append("fileMap", JSON.stringify(files));

  return scopeAxiosInstance
    .post(generateQuoteFlag ? SAVE_QUOTE_URL : SITE_URL, finalFormData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        scopeDocDetails(formData.scope_docs_id, dispatch);
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const updateSiteService = (scope_id, formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(SCOPE_DOC_SITE_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        scopeDocDetails(scope_id, dispatch);
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error : Strings.network_error);
    });
};

export const updateClientDetails = (scope_id, formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(SCOPE_DOC_CLIENT_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        scopeDocDetails(scope_id, dispatch);
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error : Strings.network_error);
    });
};

export const updateSiteTask = (scope_id, formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(SCOPE_DOC_TASK_URL, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        await scopeDocDetails(scope_id, dispatch);
        return Promise.resolve(res.data);
      } else {
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const deleteSiteTask = (
  task_id,
  scope_docs_id,
  scope_id
) => dispatch => {
  startSipnner(dispatch);
  const param = {
    id: task_id,
    scope_docs_id: scope_docs_id
  };
  return scopeAxiosInstance
    .delete(SCOPE_DOC_TASK_URL, { data: param })
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        scopeDocDetails(scope_id, dispatch);
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getAllSites = client_id => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(`${SCOPE_DOC_GET_SITES}?id=${client_id}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SCOPE_DOC_GET_SITES_LIST,
          payload: res.data.data.sites
        });
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getClients = org_id => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(`${SCOPE_DOC_CLIENT_URL}?organisation_id=${org_id}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SCOPE_DOC_GET_CLIENTS_LIST,
          payload: res.data.data.clients
        });
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getPrimaryPersons = client_id => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(`${SCOPE_DOC_CLIENT_URL}?id=${client_id}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SCOPE_DOC_GET_PRIMARY_PERSONS_LIST,
          payload: res.data.data.clients[0].client_person
        });
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getSitesListByClientPerson = (clientId, personId) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(`${SITES_LIST_BY_PERSON}?client_id=${clientId}&person_id=${personId}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_SITES_BY_PERSON,
          payload: res.data.data.sites
        });
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const sendQuoteEmail = (scope_doc_id, formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(SCOPE_DOC_EMAIL_QUOTE_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
       return  scopeDocDetails(scope_doc_id, dispatch);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getEquipments = () => dispatch => {
  startSipnner(dispatch);
  const url = SCOPE_DOC_EQUIPMENTS_URL;
  return scopeAxiosInstance
    .get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SCOPE_DOC_GET_EQUIPMENT_LIST,
          payload: res.data.data.equipmentList
        });
        return Promise.resolve();
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const sendJobDocEmail = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(JOB_DOC_EMAIL_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getJobDocsEmails = () => dispatch => {
  startSipnner(dispatch);
  const url = JOB_DOC_EMAIL_URL;
  return scopeAxiosInstance
    .get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: JOB_DOC_GET_EMAIL_LIST,
          payload: res.data.data.jobDocEmailList
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getJobDocsEmailDetails = id => dispatch => {
  startSipnner(dispatch);
  const url = JOB_DOC_EMAIL_DETAILS_URL + "?id=" + id;
  return scopeAxiosInstance
    .get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: JOB_DOC_GET_EMAIL_DETAILS,
          payload: res.data.data.jobDocEmail
        });
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const sendSwmsSheetEmail = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(SWMS_SHEET_EMAIL_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getJobDocsDetails = job_doc_no => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(GET_JOB_DOC_DETAILS_URL + "?job_doc_no=" + job_doc_no)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_JOB_DOC_DETAILS,
          payload: res.data.data.job_doc_details[0],
          versionCount: res.data.data.total_versions
        });
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const rebookJob = taskDetails => dispatch => {
  startSipnner(dispatch);
  const finalFormData = {
    rebook_tasks: taskDetails
  };
  return scopeAxiosInstance
    .post("/rebook-job", finalFormData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const updateClientDetailInScopeDoc = (
  scope_doc_id,
  formData
) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(UPDATE_CLIENT_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        scopeDocDetails(scope_doc_id, dispatch);
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error : Strings.network_error);
    });
};

export const reorderTasks = (scope_id, formData) => dispatch => {
  // startSipnner(dispatch);
  return scopeAxiosInstance
    .put(REORDER_TASK_URL, formData)
    .then(res => {
      // stopSipnner(dispatch)
      if (res.data.status) {
        scopeDocDetails(scope_id, dispatch, undefined, false);
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      // stopSipnner(dispatch)
      return Promise.reject(error.response ? error : Strings.network_error);
    });
};

export const getScopeDocVersionHistory = (
  scopeDocId,
  scopeDocVersion
) => dispatch => {
  startSipnner(dispatch);
  const url = `${SCOPE_DOC_HISTORY_URL}?scope_doc_id=${scopeDocId}&version=${scopeDocVersion}`;
  return scopeAxiosInstance
    .get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_SCOPE_DOC_VERSION_HISTORY,
          payload: res.data.data.scope_doc_history[0]
        });
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error : Strings.network_error);
    });
}

/* Task Tags */

const getAllTaskTags = (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(TASK_TAGS_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_TASK_TAGS,
          payload: res.data.data.task_tag
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getTaskTags = () => dispatch => {
  return getAllTaskTags(dispatch)
}

export const initTaskTags = () => dispatch => {
  return initAllTaskTagsApi(dispatch)
}

const initAllTaskTagsApi = dispatch => {
  startSipnner(dispatch)

  const searchKey = '';
  const pageNumber = 1;

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${TASK_TAGS_URL}?organisation_id=${org_id}&search_key=${searchKey}&page=${pageNumber}`

  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_TASK_TAGS,
          payload: res.data.data.task_tag
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const searchExpandTaskTagsList = (searchKey = '', pageNumber = 1, searching, scrolling) => dispatch => {

  searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${TASK_TAGS_URL}?organisation_id=${org_id}&search_key=${searchKey}&page=${pageNumber}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      if (res.data.status && !searching) {
        dispatch({
          type: GET_TASK_TAGS_LIST_BY_EXPAND,
          payload: res.data.data.task_tag
        })
        return Promise.resolve(res.data.data.task_tag.length)
      } else {
        dispatch({
          type: GET_TASK_TAGS,
          payload: res.data.data.task_tag
        })
        return Promise.resolve(res.data.data.task_tag.length)
      }
    })
    .catch(error => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const addTaskTags = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(TASK_TAGS_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        initAllTaskTagsApi(dispatch);
      }
      return Promise.resolve(res.data.message)
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response : Strings.network_error);
    })
}


export const updateTaskTag = (formData, org_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(TASK_TAGS_URL, formData)
    .then(async res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        await getAllTaskTags(dispatch)
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error)
    });
}

export const rebookQuote = (scopeDocId, quote_number) => dispatch => {
  startSipnner(dispatch);
  let formData = {
    scope_doc_id: scopeDocId,
    quote_number: quote_number
  }
  return scopeAxiosInstance.post(REBOOK_QUOTE_URL, formData)
    .then(async res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        if (res.data.data.quote_number) {
          scopeDocDetails(scopeDocId, dispatch, null, res.data.data.quote_number);
        }
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const swmsCompleted = scope_id => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(`${SWMS_COMPLETED_URL}?scope_doc_id=${scope_id}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SCOPE_DOC_GET_SITES_LIST,
          payload: res.data
        });
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const saveScopeDocJob = (scope_id, formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(SAVE_SCOPE_DOC_JOB, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        await scopeDocDetails(scope_id, dispatch);
        return Promise.resolve(res.data);
      } else {
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};
export const bookJob = (scopeDocId, quote_id) => dispatch => {
  startSipnner(dispatch);
  let formData = {
    scope_doc_id: scopeDocId,
    id: quote_id,
  }
  return scopeAxiosInstance.put(BOOK_JOB_URL, formData)
    .then(async res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        scopeDocDetails(scopeDocId, dispatch);

        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}
