import axios from 'axios';
import {
  JWT_ACCESS_TOKEN,
  JWT_ID_TOKEN,
  USER_NAME,
  ADMIN_DETAILS,
  JWT_REFRESH_TOKEN,
  RENEW_ACCESS_URL
} from '../dataProvider/constant';
import {
  BASE_API_URL,
  BASE_SCOPE_API_URL
} from '../dataProvider/env.config';
import { getStorage, setStorage } from '../utils/common';
import { Store } from '../index';
import { logoutUser } from '../actions/index';

const axiosInstance = axios.create({
  baseURL: BASE_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  },
})

axiosInstance.defaults.params = {}

const renewAccess = async () => {
  return axiosInstance.post(RENEW_ACCESS_URL)
    .then(res => {
      if (res.data.status) {
        //Restored JWT_REFRESH_TOKEN,JWT_ID_TOKEN and JWT_ACCESS_TOKEN
        setStorage(JWT_REFRESH_TOKEN, res.data.data.auth_data.refresh_token);
        setStorage(JWT_ID_TOKEN, res.data.data.auth_data.id_token);
        setStorage(JWT_ACCESS_TOKEN, res.data.data.auth_data.access_token);
        return Promise.resolve(true);
      }
    }).catch(error => {
      return Promise.resolve(false);
    })
}

axiosInstance.interceptors.request.use((request) => {
  return requestInterceptor(request)
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  // If request is UNAUTHORIZED then call token refresh web service and again call old web service with updated token
  const { status } = error.response;
  if (status === 401) {
    let res = await renewAccess();
    if (res) {
      return axiosInstance();
    }
  } else if (status === 403) {
    logoutUser(Store.dispatch);
    return Promise.reject(error);
  } else return Promise.reject(error);
});

/**Scope doc axios instance */
export const scopeAxiosInstance = axios.create({
  baseURL: BASE_SCOPE_API_URL,
  timeout: 60000,
  headers: {
    'Content-Type': 'application/json'
  },
})

scopeAxiosInstance.defaults.params = {}

scopeAxiosInstance.interceptors.request.use((request) => {
  return requestInterceptor(request)
}, (error) => {
  return Promise.reject(error);
});

scopeAxiosInstance.interceptors.response.use((response) => {
  return response;
}, async (error) => {
  // If request is UNAUTHORIZED then call token refresh web service and again call old web service with updated token
  const { status } = error.response;
  if (status === 401) {
    let res = await renewAccess();
    if (res) {
      return axiosInstance();
    }
  } else if (status === 403) {
    logoutUser(Store.dispatch);
    return Promise.reject(error);
  } else return Promise.reject(error);
});

/**request interceptor for all instances */
const requestInterceptor = (request) => {
  if (getStorage(JWT_ACCESS_TOKEN) && getStorage(JWT_ID_TOKEN) &&
    getStorage(USER_NAME) && getStorage(ADMIN_DETAILS) && getStorage(USER_NAME) && getStorage(JWT_REFRESH_TOKEN)) {
    request.headers.refreshtoken = getStorage(JWT_REFRESH_TOKEN);
    request.headers.accessToken = getStorage(JWT_ACCESS_TOKEN);
    request.headers.accessId = getStorage(JWT_ID_TOKEN);
    request.headers.user_name = getStorage(USER_NAME);
    request.headers.org_id = JSON.stringify(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id);
    request.headers.user_name = getStorage(USER_NAME);
  }


  if (getStorage(ADMIN_DETAILS)) {
    /*  if (request.method === 'get') {
       request.params["org_id"] = JSON.stringify(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id);
       request.params["user_name"] = getStorage(USER_NAME);
     }
 
     else if (request.method === "put" || request.method === "post") {
 
       request.data.organisation_id = JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id;
       request.data.user_name = getStorage(USER_NAME);
       //  request.data = JSON.stringify(data);
 
 
     } */
  }
  return request;
}

export default axiosInstance;
