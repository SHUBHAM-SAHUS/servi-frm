import {
  ADD_CHEMICAL_URL,
  ADD_TOOL_URL,
  ADD_SWMS_URL,
  ADD_PPE_URL,
  ADD_HRW_URL,
  SWMS_GET_ORG_SWMS,
  GET_ORG_SWMS,
  GET_TASK_SWMS,
  SWMS_GET_TASK_SWMS,
  GET_ALL_SWMS_CONTROL_URL,
  SWMS_GET_SWMS_CONTROL,
  SWMS_CATEGORY_URL,
  TOOLBOX_TALK_ITEMS_URL,
  TOOLBOX_TALK_ITEMS,
  TOOLBOX_TALK_URL,
  TOOLBOX_TALK,
  SCOPE_DOC_SWMS,
  JOB_TOOLBOX_TALK_URL,
  JOB_TOOLBOX_TALK_DETAIL_URL,
  JOB_TOOLBOX_TALK,
  JOB_TOOLBOX_TALK_DETAIL,
} from "../dataProvider/constant";
import { startSipnner, stopSipnner } from "../utils/spinner";
import { scopeAxiosInstance } from "../dataProvider/axiosHelper";
import { Strings } from "../dataProvider/localize";
import { scopeDocDetails } from "./scopeDocActions";
import { DeepTrim } from "../utils/common";

export const addSWMS = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(ADD_SWMS_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (formData.swms[0].job_id && formData.swms[0].org_id) {
        getAllSWMSByOrgIdAndJobId(
          formData.swms[0].org_id,
          formData.swms[0].job_id,
          dispatch
        );
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const updateSWMS = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(ADD_SWMS_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (formData.job_id && formData.org_id) {
        getAllSWMSByOrgIdAndJobId(formData.org_id, formData.job_id, dispatch);
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const deleteswmsActivity = (param) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .delete(ADD_SWMS_URL, { data: param })
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllOrgSWMSapi(dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const addPPE = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(ADD_PPE_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (formData.ppe[0].job_id && formData.ppe[0].org_id) {
        getAllSWMSByOrgIdAndJobId(
          formData.ppe[0].org_id,
          formData.ppe[0].job_id,
          dispatch
        );
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const updatePPE = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(ADD_PPE_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (formData.job_id && formData.org_id) {
        getAllSWMSByOrgIdAndJobId(formData.org_id, formData.job_id, dispatch);
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const deletePPE = (param) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .delete(ADD_PPE_URL, { data: param })
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllOrgSWMSapi(dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const addToolType = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(ADD_TOOL_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (formData.tools[0].job_id && formData.tools[0].org_id) {
        getAllSWMSByOrgIdAndJobId(
          formData.tools[0].org_id,
          formData.tools[0].job_id,
          dispatch
        );
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const updateToolType = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(ADD_TOOL_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (formData.job_id && formData.org_id) {
        getAllSWMSByOrgIdAndJobId(formData.org_id, formData.job_id, dispatch);
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};
export const deleteToolType = (param) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .delete(ADD_TOOL_URL, { data: param })
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllOrgSWMSapi(dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const addHRW = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(ADD_HRW_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (
        formData.high_risk_work[0].job_id &&
        formData.high_risk_work[0].org_id
      ) {
        getAllSWMSByOrgIdAndJobId(
          formData.high_risk_work[0].org_id,
          formData.high_risk_work[0].job_id,
          dispatch
        );
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const updateHRW = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(ADD_HRW_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (formData.job_id && formData.org_id) {
        getAllSWMSByOrgIdAndJobId(formData.org_id, formData.job_id, dispatch);
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};
export const deleteHRW = (param) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .delete(ADD_HRW_URL, { data: param })
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllOrgSWMSapi(dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};
export const addChemical = (formData, org_id, job_id) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(ADD_CHEMICAL_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      stopSipnner(dispatch);
      if (job_id && org_id) {
        getAllSWMSByOrgIdAndJobId(org_id, job_id, dispatch);
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const deleteChemical = (param) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .delete(ADD_CHEMICAL_URL, { data: param })
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllOrgSWMSapi(dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const updateChemical = (formData, org_id, job_id) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(ADD_CHEMICAL_URL, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((res) => {
      stopSipnner(dispatch);
      if (job_id && org_id) {
        getAllSWMSByOrgIdAndJobId(org_id, job_id, dispatch);
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

const getAllOrgSWMSapi = (dispatch) => {
  startSipnner(dispatch);
  scopeAxiosInstance
    .get(GET_ORG_SWMS)
    .then((res) => {
      stopSipnner(dispatch);
      dispatch({
        type: SWMS_GET_ORG_SWMS,
        payload: res.data.data.area_swms,
      });
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getOrgSWMS = () => (dispatch) => {
  return getAllOrgSWMSapi(dispatch);
};

const getAllSWMSByTaskApi = (dispatch, task_id, job_id) => {
  startSipnner(dispatch);
  scopeAxiosInstance
    .get(SCOPE_DOC_SWMS + "?scope_docs_id=" + task_id + "&job_id=" + job_id)
    .then((res) => {
      stopSipnner(dispatch);
      var areas = res.data.data.result;
      areas.forEach((area) => {
        if (area.swms_id) area.swms_id = area.swms_id.split(",");
        else area.swms_id = [];

        if (area.ppe_id) area.ppe_id = area.ppe_id.split(",");
        else area.ppe_id = [];

        if (area.tool_id) area.tool_id = area.tool_id.split(",");
        else area.tool_id = [];

        if (area.high_risk_work_id)
          area.high_risk_work_id = area.high_risk_work_id.split(",");
        else area.high_risk_work_id = [];

        if (area.sds_id) area.sds_id = area.sds_id.split(",");
        else area.sds_id = [];

        if (area.category_id) area.category_id = area.category_id.split(",");
        else area.category_id = [];

        if (area.tool_box_talk_id)
          area.tool_box_talk_id = area.tool_box_talk_id.split(",");
        else area.tool_box_talk_id = [];
      });
      dispatch({
        type: SWMS_GET_TASK_SWMS,
        payload: areas,
      });
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getSWMSByTask = (task_id, job_id) => (dispatch) => {
  return getAllSWMSByTaskApi(dispatch, task_id, job_id);
};

export const changeTaskSWMS = (taskSWMS) => (dispatch) => {
  dispatch({
    type: SWMS_GET_TASK_SWMS,
    payload: taskSWMS,
  });
  return Promise.resolve(true);
};

export const addSWMStoTask = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(SCOPE_DOC_SWMS, DeepTrim(formData))
    .then((res) => {
      scopeDocDetails(formData.scope_docs_id, dispatch, formData.task_id);
      stopSipnner(dispatch);
      if (formData.job_id && formData.org_id) {
        getAllSWMSByOrgIdAndJobId(formData.org_id, formData.job_id, dispatch);
      } else {
        getAllOrgSWMSapi(dispatch);
        getAllSWMSByTaskApi(dispatch, formData.scope_docs_id, formData.job_id);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

const getAllSWMSControlapi = (dispatch) => {
  startSipnner(dispatch);
  scopeAxiosInstance
    .get(GET_ALL_SWMS_CONTROL_URL)
    .then((res) => {
      stopSipnner(dispatch);
      dispatch({
        type: SWMS_GET_SWMS_CONTROL,
        payload: res.data.data.swms_controls,
      });
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getSWMSControl = () => (dispatch) => {
  return getAllSWMSControlapi(dispatch);
};

export const getAllSWMSByOrgIdAndJobId = (
  organisation_id,
  job_id,
  dispatch
) => {
  startSipnner(dispatch);
  scopeAxiosInstance
    .get(`${GET_ORG_SWMS}?organisation_id=${organisation_id}&job_id=${job_id}`)
    .then((res) => {
      stopSipnner(dispatch);
      dispatch({
        type: SWMS_GET_ORG_SWMS,
        payload: res.data.data.area_swms,
      });
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getJobSWMSByOrgIdAndJobId = (organisation_id, job_id) => (
  dispatch
) => {
  getAllSWMSByOrgIdAndJobId(organisation_id, job_id, dispatch);
};

/* for cruds */

export const addSWMSCat = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(SWMS_CATEGORY_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (formData.job_id && formData.org_id) {
        getAllSWMSByOrgIdAndJobId(formData.org_id, formData.job_id, dispatch);
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const updateSWMSCat = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(SWMS_CATEGORY_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (formData.job_id && formData.org_id) {
        getAllSWMSByOrgIdAndJobId(formData.org_id, formData.job_id, dispatch);
      } else {
        getAllOrgSWMSapi(dispatch);
      }
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const deleteswmsCat = (param) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .delete(SWMS_CATEGORY_URL, { data: param })
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllOrgSWMSapi(dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const addToolboxItems = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(TOOLBOX_TALK_ITEMS_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);

      getAllToolboxItemsapi(dispatch);

      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const updateToolboxItems = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(TOOLBOX_TALK_ITEMS_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);

      getAllToolboxItemsapi(dispatch);

      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

const getAllToolboxItemsapi = (dispatch) => {
  startSipnner(dispatch);
  scopeAxiosInstance
    .get(TOOLBOX_TALK_ITEMS_URL)
    .then((res) => {
      stopSipnner(dispatch);
      dispatch({
        type: TOOLBOX_TALK_ITEMS,
        payload: res.data.data.toolbox_talk_items,
      });
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getToolboxItems = () => (dispatch) => {
  return getAllToolboxItemsapi(dispatch);
};

export const deleteToolboxItem = (param) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .delete(TOOLBOX_TALK_ITEMS_URL, { data: param })
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllToolboxItemsapi(dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const addToolbox = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(TOOLBOX_TALK_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);

      getAllToolboxapi(dispatch);

      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const updateToolbox = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .put(TOOLBOX_TALK_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);

      getAllToolboxapi(dispatch);

      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const deleteToolbox = (param) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .delete(TOOLBOX_TALK_URL, { data: param })
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getAllToolboxapi(dispatch);
        return Promise.resolve(res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

const getAllToolboxapi = (dispatch) => {
  startSipnner(dispatch);
  scopeAxiosInstance
    .get(TOOLBOX_TALK_URL)
    .then((res) => {
      stopSipnner(dispatch);
      dispatch({
        type: TOOLBOX_TALK,
        payload: res.data.data.toolbox_talk,
      });
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getToolbox = () => (dispatch) => {
  return getAllToolboxapi(dispatch);
};

/* Job Toolbox Talk Actions */

const getAllJobToolboxapi = (dispatch, job_id) => {
  startSipnner(dispatch);
  scopeAxiosInstance
    .get(JOB_TOOLBOX_TALK_URL + "?job_id=" + job_id)
    .then((res) => {
      stopSipnner(dispatch);
      dispatch({
        type: JOB_TOOLBOX_TALK,
        payload: res.data.data.toolbox_talks,
      });
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getJobToolbox = (job_id) => (dispatch) => {
  return getAllJobToolboxapi(dispatch, job_id);
};

const getAllJobToolboxDetailapi = (dispatch, job_id, toolbox_talk_id) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(
      JOB_TOOLBOX_TALK_DETAIL_URL +
        "?job_id=" +
        job_id +
        "&toolbox_talk_id=" +
        toolbox_talk_id
    )
    .then((res) => {
      stopSipnner(dispatch);
      dispatch({
        type: JOB_TOOLBOX_TALK_DETAIL,
        payload: res.data.data,
      });
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getJobToolboxDetail = (job_id, toolbox_talk_id) => (dispatch) => {
  return getAllJobToolboxDetailapi(dispatch, job_id, toolbox_talk_id);
};

export const addJobToolbox = (formData, job_id, toolbox_talk_id) => (
  dispatch
) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(JOB_TOOLBOX_TALK_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      return getAllJobToolboxDetailapi(dispatch, job_id, toolbox_talk_id);
      return Promise.resolve(res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};
