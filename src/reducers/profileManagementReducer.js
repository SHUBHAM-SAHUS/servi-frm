import {
  PROFILE_MANAGEMENT,
  PROFILE_GET_SUB_CATEGORY_LIST,
  PROFILE_LEAVE_TYPE,
  PROFILE_LICENCES_TYPE,
  PROFILE_COMPLETE,
  STATES_LIST,
} from "../dataProvider/constant";

const INITIAL_STATE = {
  profile: [],
  leaveType: [],
  subCategoryList: [],
  licenceType: [],
  profileImageUrl: "",
  profileProgress: 0,
  profileComplete: 0,
  statesList: [],
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case PROFILE_MANAGEMENT:
      return {
        ...state,
        profile: action.payload,
        profileImageUrl: action.profilePic,
        profileProgress: action.profileProgress,
      };
    case PROFILE_GET_SUB_CATEGORY_LIST:
      return {
        ...state,
        subCategoryList: action.payload,
      };
    case PROFILE_LEAVE_TYPE:
      return {
        ...state,
        leaveType: action.payload,
      };
    case PROFILE_LICENCES_TYPE:
      return {
        ...state,
        licenceType: action.payload,
      };
    case PROFILE_COMPLETE:
      return {
        ...state,
        profileComplete: action.payload,
      };
    case STATES_LIST:
      return {
        ...state,
        statesList: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
