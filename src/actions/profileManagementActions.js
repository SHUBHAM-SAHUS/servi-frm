import {
  PROFILE_MANAGEMENT,
  ORG_USERS_URL,
  ORG_USER_DETAILS_URL,
  ORG_USER_PAYROLL_URL,
  ORG_USER_LICENCE_URL,
  ORG_USER_MEDICAL_DECLARATION_URL,
  ORG_USER_ADD_LEAVE_URL,
  PROFILE_LEAVE_TYPE,
  ORG_USER_LEAVE_TYPE_URL,
  PROFILE_LICENCES_TYPE,
  ORG_USER_LICENCES_TYPE_URL,
  ORG_USER_ROSTERING_URL,
  ORG_USER_UP_PRO_IMG__URL,
  ORG_USER_VERIFY_ATTR,
  RESEND_VERIFY_ATTR,
  ORG_USER_RESIDENTIAL_ADDRESS_URL,
  ORG_USER_EXPERIENCE_URL,
  ORG_USER_EERGENCY_CONTACT_URL,
  ORG_USER_SUPER_FUND_URL,
  ORG_USER_BANK_DETAIL_URL,
  STATES_URL,
  STATES_LIST,
} from "../dataProvider/constant";
import { startSipnner, stopSipnner } from "../utils/spinner";
import axiosInstance from "../dataProvider/axiosHelper";
import { Strings } from "../dataProvider/localize";

export const getOrgUserDetails = (org_user_id, org_user_name, page_no) => (
  dispatch
) => {
  startSipnner(dispatch);
  return axiosInstance
    .get(
      `${ORG_USERS_URL}?org_user_id=${org_user_id}&org_user_name=${org_user_name}&page_no=${
        page_no ? page_no : 1
      }`
    )
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: PROFILE_MANAGEMENT,
          payload: res.data.data.orgUsers,
          profilePic:
            res &&
            res.data &&
            res.data.data &&
            res.data.data.orgUsers[0] &&
            res.data.data.orgUsers[0].profile_pic,
          profileProgress:
            res &&
            res.data &&
            res.data.data &&
            res.data.data.orgUsers[0] &&
            res.data.data.orgUsers[0].profile_progress,
        });
        return Promise.resolve(true);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.message
          ? error.response && error.response.data.message
          : Strings.network_error
      );
    });
};

export const updateOrgUserDetails = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .put(ORG_USER_DETAILS_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const updateOrgUserPersonalDetails = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .put(ORG_USER_DETAILS_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const updateOrgUserResidentialAddress = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .put(ORG_USER_RESIDENTIAL_ADDRESS_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const updateOrgUserExperience = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .put(ORG_USER_EXPERIENCE_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const updateOrgUserEmergencyContact = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .put(ORG_USER_EERGENCY_CONTACT_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const updateUserPayroll = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .post(ORG_USER_PAYROLL_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const updateUserSuperFund = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .post(ORG_USER_SUPER_FUND_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const updateUserBankDetails = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .post(ORG_USER_BANK_DETAIL_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const adNewLicencesApi = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .post(ORG_USER_LICENCE_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const addMedicalDeclaration = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .post(ORG_USER_MEDICAL_DECLARATION_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const getLeaveType = () => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .get(ORG_USER_LEAVE_TYPE_URL)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: PROFILE_LEAVE_TYPE,
          payload: res.data.data.leave_type,
        });
        return Promise.resolve(true);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error ? error : Strings.network_error);
    });
};

export const addTimeOffRequest = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .post(ORG_USER_ADD_LEAVE_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const getLicencesType = () => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .get(ORG_USER_LICENCES_TYPE_URL)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: PROFILE_LICENCES_TYPE,
          payload: res.data.data.license_type_list,
        });
        return Promise.resolve(true);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error ? error : Strings.network_error);
    });
};

export const deleteLicence = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .delete(ORG_USER_LICENCE_URL, {
      data: { id: formData.id, profile_progress: formData.profile_progress },
    })
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.message ? error.response.data.message : Strings.network_error
      );
    });
};

export const updateRostering = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .post(ORG_USER_ROSTERING_URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const uploadProfileImage = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .put(ORG_USER_UP_PRO_IMG__URL, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const verifyAttr = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .post(ORG_USER_VERIFY_ATTR, formData)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response : Strings.network_error
      );
    });
};

export const resendVerifyAttr = (data) => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .get(RESEND_VERIFY_ATTR + "?attr=" + data)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getStates = () => (dispatch) => {
  startSipnner(dispatch);
  return axiosInstance
    .get(STATES_URL)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: STATES_LIST,
          payload: res.data.data,
        });
        return Promise.resolve(true);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error ? error : Strings.network_error);
    });
};
