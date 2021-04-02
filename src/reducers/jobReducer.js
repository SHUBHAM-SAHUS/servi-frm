import { JOB_DETAILS, TASK_JOB_DETAILS } from "../dataProvider/constant";

const INITIAL_STATE = {
  jobDetails: {},
  taskJobDetails: {},
};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case JOB_DETAILS:
      return {
        ...state,
        jobDetails: action.payload,
      };
    case TASK_JOB_DETAILS:
      return {
        ...state,
        taskJobDetails: action.payload,
      };
    default:
      return {
        ...state,
      };
  }
};
