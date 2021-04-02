import axios from "axios";
import { ORG_BILLING_DETAILS, ORG_BILLING_URL, ORG_UPDATE_CARD_URL } from "../dataProvider/constant";
import { startSipnner, stopSipnner } from "../utils/spinner";
import axiosInstance from "../dataProvider/axiosHelper";
import { Strings } from '../dataProvider/localize'

const getBillingDetails = (org_id, dispatch) => {
  startSipnner(dispatch);
  const orgUserUrl = ORG_BILLING_URL + "?id=" + org_id;
  return axiosInstance
    .get(orgUserUrl)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status === 1) {
        dispatch({
          type: ORG_BILLING_DETAILS,
          payload: res.data.data.orgBillingDetails,
        });
        return Promise.resolve(true);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
};

export const getOrganizationBillingDetails = org_id => dispatch => {
  return getBillingDetails(org_id, dispatch);
}

export const addBillingCardDetails = (formData, org_id) => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(ORG_BILLING_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getBillingDetails(org_id, dispatch);
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const updateBillingAddress = (formData, org_id) => dispatch => {
  startSipnner(dispatch);
  let form = { ...formData, id: org_id }
  return axiosInstance.put(ORG_BILLING_URL, form)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.status) {
        await getBillingDetails(org_id, dispatch);
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const updateCardDetails = (formData, org_id) => dispatch => {
  startSipnner(dispatch);
  return axiosInstance.post(ORG_UPDATE_CARD_URL, formData)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        getBillingDetails(org_id, dispatch);
        return Promise.resolve(true);
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}
