import {
    GET_SMS_TEMPLATE_LIST,
    GET_SMS_TEMPLATE_DETAILS,
    GET_SMS_DROP_DOWN,
    INIT_SMS_TEMPLATE_LIST,
    GET_SMS_TEMPLATE_LIST_BY_EXPAND,
    GET_SMS_TEMPLATE_LIST_BY_SEARCH
} from "../dataProvider/constant";

const DEFAULT_STATE = {
    currentPageNumber: 1,
    smsTemplateList: [],
    smsTemplateDetails: [],
    smsDropDown: []
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case GET_SMS_TEMPLATE_LIST:
            return {
                ...state,
                smsTemplateList: action.payload
            }
        case GET_SMS_TEMPLATE_DETAILS:
            return {
                ...state,
                smsTemplateDetails: action.payload
            }
        case GET_SMS_DROP_DOWN:
            return {
                ...state,
                smsDropDown: action.payload
            }
        case INIT_SMS_TEMPLATE_LIST:
            state.smsTemplateList = []
            return {
                ...state,
                smsTemplateList: action.payload,
                currentPageNumber: 1
            }
        case GET_SMS_TEMPLATE_LIST_BY_EXPAND:
            const smsTemplateList = [...state.smsTemplateList, ...action.payload]
            const updatedList = smsTemplateList.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj.slug).indexOf(obj.slug) === pos;
            });
            return {
                ...state,
                smsTemplateList: updatedList,
                currentPageNumber: state.currentPageNumber + 1,
            }
        case GET_SMS_TEMPLATE_LIST_BY_SEARCH:
            return {
                ...state,
                smsTemplateList: action.payload,
                currentPageNumber: 1
            }
        default:
            return state
    }
}
