import {
  INDUSTRY_GET_INDUSTRIES, GET_INDUSTRY_URL, GET_SERVICE_URL,
  SERVICE_GET_SERVICES, CATEGORY_GET_CATEGORIES, CATEGORIES_URL,
  SUB_CATEGORIES_URL, SUB_CATEGORY_GET_SUB_CATEGORIES
} from '../dataProvider/constant';
import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';

const getAllIndustryApi = dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(GET_INDUSTRY_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INDUSTRY_GET_INDUSTRIES,
          payload: res.data.data.industries
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getIndustries = () => dispatch => {
  return getAllIndustryApi(dispatch);
}

export const getServices = () => dispatch => {
  startSipnner(dispatch);
  let url = GET_SERVICE_URL
  return axiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SERVICE_GET_SERVICES,
          payload: res.data.data.services
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

const getAllCategoriesApi = dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(CATEGORIES_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: CATEGORY_GET_CATEGORIES,
          payload: res.data.data.categories
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getCategories = () => dispatch => {
  return getAllCategoriesApi(dispatch);
}

const getAllSubCategoriesApi = dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(SUB_CATEGORIES_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SUB_CATEGORY_GET_SUB_CATEGORIES,
          payload: res.data.data.sub_categories //map with categories during API integration
        })
        return Promise.resolve(true)
      }

    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getSubCategories = () => dispatch => {
  return getAllSubCategoriesApi(dispatch);
}