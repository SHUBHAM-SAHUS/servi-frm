import {
  GENRERATE_QUOTE_URL, QUOTE_URL, ADMIN_URL, GET_ADMIN_LIST, ADMIN_APPROVAL_URL
  , ACCEPT_QUOTE_URL, CLIENT_ACCEPT_URL, OUTSOURCE_JOB_URL, SPLIT_JOB_URL,
  SELECT_TASK_URL
} from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'
import { scopeDocDetails } from './scopeDocActions';

export const generateQuote = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(GENRERATE_QUOTE_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const updateQuote = formData => dispatch => {

  startSipnner(dispatch);
  var files = [];
  var finalFormData = new FormData();
  Object.keys(formData).forEach(key => {
    if (key === "conditions") {
      finalFormData.append(key, formData[key])
    }
    else
      finalFormData.append(key, JSON.stringify(formData[key]))
  })

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
                    })
                  })
                  delete task[keyOfTask];
                }
              })
            })
          }
        })
      })
    }
  })

  finalFormData.append('fileMap', JSON.stringify(files));

  return scopeAxiosInstance.put(QUOTE_URL, finalFormData)
    .then(async res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        await scopeDocDetails(formData.scope_docs_id, dispatch);
        return Promise.resolve(res.data);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error)
    });
}

export const adminListGet = () => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(ADMIN_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ADMIN_LIST,
          payload: res.data.data.admins
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const adminApproval = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(ADMIN_APPROVAL_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        scopeDocDetails(formData.scope_doc_id, dispatch);
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const acceptQuote = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(ACCEPT_QUOTE_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        scopeDocDetails(formData.scope_doc_id, dispatch);
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const clientAcceptanceMannual = (formData, scope_doc_id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(CLIENT_ACCEPT_URL, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        await scopeDocDetails(scope_doc_id, dispatch);
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response : Strings.network_error)
    });
}

export const outsourceJob = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(OUTSOURCE_JOB_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const splitJob = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(SPLIT_JOB_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const taskSelection = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(SELECT_TASK_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}