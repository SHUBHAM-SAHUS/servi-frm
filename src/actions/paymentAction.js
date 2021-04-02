import { PAYMENT_URL, GET_CARD_DETAILS_URL } from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'


export const addPayment = formData => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(PAYMENT_URL, formData)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        return Promise.resolve(res.data.message);
      } else {
        return Promise.reject({ response: { data: { message: res.data.message } } });
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

