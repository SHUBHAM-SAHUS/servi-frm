import {
    INVOICE_DETAILS
  } from "../dataProvider/constant";
  
  const INITIAL_STATE = {
    invoiceDetails: []
  }
  
  export default (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case INVOICE_DETAILS:
        return {
          ...state,
          invoiceDetails: action.invoiceDetails
        }
  
      default:
        return {
          ...state
        }
    }
  }