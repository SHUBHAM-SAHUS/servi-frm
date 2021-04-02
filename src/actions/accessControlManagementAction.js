import {
  ACCESS_CONTROL_URL,
  GET_ACCESS_CONTROL_BY_MODULE
} from '../dataProvider/constant';
import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper';
import { Strings } from '../dataProvider/localize';

const getAllAccessControlByModuleApi = dispatch => {
  startSipnner(dispatch);
  return axiosInstance.get(ACCESS_CONTROL_URL)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ACCESS_CONTROL_BY_MODULE,
          payload: res.data.data.access_controls
        })
        return Promise.resolve(true)
      }

    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getAccessControlsByModule = () => dispatch => {
  return getAllAccessControlByModuleApi(dispatch);
}