import {
  INVOICE_DETAILS,
  GET_PREVIEW_INVOICE
} from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'

export const getPreviewInvoiceList = (job_number) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${GET_PREVIEW_INVOICE}?job_number=${job_number}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INVOICE_DETAILS,
          invoiceDetails: res.data.data.invoice_details[0],
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}
