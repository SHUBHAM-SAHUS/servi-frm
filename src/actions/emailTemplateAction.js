import {
  GET_EMAIL_TEMPLATE,
  GET_EMAIL_CONTENT_URL,
  GET_EMAIL_TEMPLATE_URL,
  ADD_EMAIL_TEMPLATE_URL,
  GET_EMAIL_TEMPLATE_CONTENT,
  GET_EMAIL_TEMPLATE_MASTERS,
  GET_EMAIL_TEMPLATE_DETAILS,
  GET_EMAIL_TEMPLATE_DROPDOWN,
  EMAIL_TEMPLATES_DROPDOWN_URL,
  GET_EMAIL_TEMPLATE_DETAILS_URL,
} from '../dataProvider/constant';
import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';

export const getEmailDropdownItems = () => dispatch => {
  startSipnner(dispatch)
  return axiosInstance.get(EMAIL_TEMPLATES_DROPDOWN_URL)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        dispatch({
          type: GET_EMAIL_TEMPLATE_DROPDOWN,
          payload: res.data.data.result
        })
        return Promise.resolve(true)
      }
    }).catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getEmailTemplate = (slug) => dispatch => {
  startSipnner(dispatch)
  return axiosInstance.get(`${GET_EMAIL_CONTENT_URL}?slug=${slug}`)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        dispatch({
          type: GET_EMAIL_TEMPLATE,
          payload: res.data.data.result
        })
        return Promise.resolve(true)
      }
    }).catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getEmailTemplateContent = (slug) => dispatch => {
  startSipnner(dispatch)
  return axiosInstance.get(`${GET_EMAIL_CONTENT_URL}?slug=${slug}`)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        dispatch({
          type: GET_EMAIL_TEMPLATE_CONTENT,
          payload: res.data.data.result
        })
        return Promise.resolve(true)
      }
    }).catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getAllEmailTemplates = () => dispatch => {
  startSipnner(dispatch)
  return axiosInstance.get(GET_EMAIL_TEMPLATE_URL)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        dispatch({
          type: GET_EMAIL_TEMPLATE_MASTERS,
          payload: res.data.data.result
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const saveEmailTemplate = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(ADD_EMAIL_TEMPLATE_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getEmailTemplateDetails = slug => dispatch => {
  startSipnner(dispatch)
  return axiosInstance.get(`${GET_EMAIL_TEMPLATE_DETAILS_URL}?slug=${slug}`)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        dispatch({
          type: GET_EMAIL_TEMPLATE_DETAILS,
          payload: res.data.data.result
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const editEmailTemplate = formData => dispatch => {
  // console.log(formData)
  // return Promise.resolve(true)
  startSipnner(dispatch)
  return axiosInstance.put(`${GET_EMAIL_TEMPLATE_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}