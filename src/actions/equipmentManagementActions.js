import {
  USER_NAME,
  TESTERS_URL,
  ADMIN_DETAILS,
  EQUIPMENTS_URL,
  TEST_AND_TAG_URL,
  EQUIPMENT_RESULT,
  EQUIPMENT_RESULT_URL,
  GET_TEST_TYPE_AND_TAG,
  EQUIPMENT_SERVICES_URL,
  EQUIPMENT_GET_TESTERS_LIST,
  EQUIPMENT_GET_EQUIPMENTS_LIST,
  EQUIPMENT_GET_EQUIPMENT_DETAILS,
  EQUIPMENT_GET_ASSOCIATED_SERVICES,
  EQUIPMENT_GET_TEST_AND_TAG_HISTORY,
  INIT_EQUIPMENT_LIST,
  GET_EQUIPMENT_LIST_BY_EXPAND,
  GET_EQUIPMENT_LIST_BY_SEARCH,
  EQUIPMENT_EXPORTDATA_URL,
  EQUIPMENT_LIST_URL,
  GET_EQUIPMENT_LIST_ADVANCE_SEARCH
} from '../dataProvider/constant'

import {
  BASE_SCOPE_API_URL
} from '../dataProvider/env.config';

import axios from 'axios';
import { getStorage } from '../utils/common';
import { Strings } from '../dataProvider/localize'
import { startSipnner, stopSipnner, stopMiniSpinner, startMiniSpinner, stopScrollSpinner, startScrollSpinner } from '../utils/spinner';
import axiosInstance, { scopeAxiosInstance } from '../dataProvider/axiosHelper'


export const initEquipments = advanceSeacrhOpt => dispatch => {
  var args = "";
  if (advanceSeacrhOpt) {
    args = getAdvanceSearchArgs(advanceSeacrhOpt);
  }
  return initAllEquipmentsApi(dispatch, args)
}

const initAllEquipmentsApi = (dispatch, args) => {
  startSipnner(dispatch)
  const searchKey = '';
  const pageNumber = 1;

  //  const url = EQUIPMENTS_URL + '?id=' + org_id
  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${EQUIPMENTS_URL}?search_key=${searchKey}&page=${pageNumber}` + args

  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: INIT_EQUIPMENT_LIST,
          payload: res.data.data.equipmentList
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const searchExpandEquipmentList = (searchKey = '', pageNumber = 1, searching, scrolling, advanceSeacrhOpt) => dispatch => {
  var args = "";
  if (advanceSeacrhOpt) {
    args = getAdvanceSearchArgs(advanceSeacrhOpt);
  }

  searching ? startMiniSpinner(dispatch) : scrolling ? startScrollSpinner(dispatch) : startSipnner(dispatch)

  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${EQUIPMENTS_URL}?search_key=${searchKey}&page=${pageNumber}` + args
  return scopeAxiosInstance.get(url)
    .then(res => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      if (res.data.status && !searching) {
        dispatch({
          type: GET_EQUIPMENT_LIST_BY_EXPAND,
          payload: res.data.data.equipmentList
        })
        return Promise.resolve(res.data.data.equipmentList.length)
      } else {
        dispatch({
          type: GET_EQUIPMENT_LIST_BY_SEARCH,
          payload: res.data.data.equipmentList
        })
        return Promise.resolve(res.data.data.equipmentList.length)
      }
    })
    .catch(error => {
      searching ? stopMiniSpinner(dispatch) : scrolling ? stopScrollSpinner(dispatch) : stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

const getAdvanceSearchArgs = advanceSeacrhOpt => {
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

export const getAllEquipments = () => dispatch => {
  return getEquipmentsList(dispatch);
}

const getEquipmentsList = dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${EQUIPMENTS_URL}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: EQUIPMENT_GET_EQUIPMENTS_LIST,
          equipmentsList: res.data.data.equipmentList
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getTestersList = () => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${TESTERS_URL}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: EQUIPMENT_GET_TESTERS_LIST,
          testersList: res.data.data.tester_list
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const addEquipment = formData => dispatch => {
  startSipnner(dispatch);

  const finalFormData = new FormData();
  const files = [];
  const fileMap = [];

  Object.keys(formData).forEach(key => {
    if (key !== 'equipmentFiles' && key !== 'licenseFile' && key !== 'cost' && key !== 'services') {
      finalFormData.append(key, formData[key]);
    }

    if (key === 'services') {
      finalFormData.append('services', JSON.stringify(formData[key]))
    }

    if (key === 'cost') {
      finalFormData.append('cost', parseInt(formData[key]))
    }

    if (key === 'licenseFile') {
      files.push(formData[key]);
      finalFormData.append('files', formData[key])
      fileMap.push({ "name": "license" })
    }

    if (key === 'equipmentFiles') {
      if (formData[key].hasOwnProperty('length')) {
        formData[key].forEach(equipmentFile => {
          files.push(equipmentFile);
          finalFormData.append('files', equipmentFile.originFileObj)
          fileMap.push({ "name": "equipmentFile" })
        })
      }
      else {
        finalFormData.append('files', formData[key])
        fileMap.push({ "name": "equipmentFile" })
      }
    }
  });
  finalFormData.append("file_map", JSON.stringify(fileMap));

  return scopeAxiosInstance.post(
    BASE_SCOPE_API_URL + EQUIPMENTS_URL,
    finalFormData/* , {
    headers: {
      'org_id': JSON.stringify(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id),
      'user_name': getStorage(USER_NAME)
    }
  } */
  )
    .then(res => {
      stopSipnner(dispatch);
      //getEquipmentsList(dispatch);
      initAllEquipmentsApi(dispatch)
      if (res.data.data.status) {
      }
      return Promise.resolve(res.data.message && res.data.message)
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response : Strings.generic_validate);
    })
}

export const getEquipmentDetails = equipmentId => dispatch => {
  return getEquipmentDetailsById(equipmentId, dispatch);
}


const getEquipmentDetailsById = (equipmentId, dispatch) => {
  return equipmentDetails(equipmentId, dispatch);
}

export const equipmentDetails = (equipmentId, dispatch) => {
  startSipnner(dispatch);
  const url = `${EQUIPMENTS_URL}?id=${equipmentId}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: EQUIPMENT_GET_EQUIPMENT_DETAILS,
          equipmentDetails: res.data.data
        })
        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getServicesByEquipment = equipmentId => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${EQUIPMENT_SERVICES_URL}?equ_id=${equipmentId}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: EQUIPMENT_GET_ASSOCIATED_SERVICES,
          associatedServices: res.data.data.equipmentServicesList
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getTestAndTagHistory = equipmentId => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${TEST_AND_TAG_URL}?equ_id=${equipmentId}`)
    .then(res => {
      const testAndTag = res.data.data.testAndTagList.filter(item => item.equ_id.toString() === equipmentId)
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: EQUIPMENT_GET_TEST_AND_TAG_HISTORY,
          testAndTag: testAndTag
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getAllTestAndTagType = equipmentId => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${TEST_AND_TAG_URL}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_TEST_TYPE_AND_TAG,
          payload: res.data.data.test_and_tag_list
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const updateEquipment = (formData, equipmentId) => dispatch => {
  let id = equipmentId ? equipmentId : formData.id;
  startSipnner(dispatch);
  return scopeAxiosInstance.put(EQUIPMENTS_URL, formData)
    .then(async res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        await getEquipmentsList(dispatch);
        await getEquipmentDetailsById(id, dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error && error.response ? error.response : Strings.network_error)
    });
}

export const addTestAndTag = (formData, id) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(TEST_AND_TAG_URL, formData)
    .then(res => {
      stopSipnner(dispatch)
      if (res.data.status) {
        getEquipmentDetailsById(id, dispatch);
      }
      return Promise.resolve(res.data.message && res.data.message);
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error && error.response ? error.response.data.message : Strings.network_error)
    });
}

export const getEquipmentAllResult = () => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${EQUIPMENT_RESULT_URL}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: EQUIPMENT_RESULT,
          payload: res.data.data.resultList
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const equipmentExportData = (formData) => dispatch => {
  var args = "";
  if (formData) {
    args = getAdvanceSearchArgs(formData);
  }

  const url = `${EQUIPMENT_EXPORTDATA_URL}?` + args
  startSipnner(dispatch);
  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data && res.data.data && res.data.data.csv_file_link)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getEquipmentList = (advanceSearchValues = {}) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(EQUIPMENT_LIST_URL + "?name=" + advanceSearchValues)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_EQUIPMENT_LIST_ADVANCE_SEARCH,
          payload: res.data && res.data.data
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}