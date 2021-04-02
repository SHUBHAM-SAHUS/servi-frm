import { ORG_BILLING_DETAILS } from "../dataProvider/constant";

const DEFAULT_STATE = {
  billingDetails: {}
};

export default (state = DEFAULT_STATE, action) => {
  switch (action.type) {
    case ORG_BILLING_DETAILS:
      return { ...state, billingDetails: action.payload };

    default:
      return state;
  }
};
