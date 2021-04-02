import {
  GET_EMAIL_TEMPLATE,
  GET_EMAIL_TEMPLATE_CONTENT,
  GET_EMAIL_TEMPLATE_MASTERS,
  GET_EMAIL_TEMPLATE_DETAILS,
  GET_EMAIL_TEMPLATE_DROPDOWN,
} from '../dataProvider/constant';

const INITIAL_STATE = {
  emailTemplateList: [],
  emailTemplateContent: {},
  emailTemplateDropdowns: [],
  emailTemplateMastersList: [],
  emailTemplateMastersDetails: []
}

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case GET_EMAIL_TEMPLATE:
      return {
        ...state,
        emailTemplateList: action.payload
      }
    case GET_EMAIL_TEMPLATE_DROPDOWN:
      return {
        ...state,
        emailTemplateDropdowns: action.payload
      }
    case GET_EMAIL_TEMPLATE_MASTERS:
      return {
        ...state,
        emailTemplateMastersList: action.payload
      }
    case GET_EMAIL_TEMPLATE_CONTENT:
      return {
        ...state,
        emailTemplateContent: action.payload
      }
    case GET_EMAIL_TEMPLATE_DETAILS:
      return {
        ...state,
        emailTemplateDetails: action.payload
      }
    default:
      return {
        ...state
      }
  }
}