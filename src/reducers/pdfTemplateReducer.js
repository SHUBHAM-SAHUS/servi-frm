import {
    GET_PDF_TEMPLATE,
    GET_PDF_TEMPLATE_DETAIL,
    GET_PDF_DROP_DOWN,
    INIT_PDF_TEMPLATE,
    GET_PDF_TEMPLATE_LIST_BY_EXPAND,
    GET_PDF_TEMPLATE_LIST_BY_SEARCH,
} from '../dataProvider/constant';

const DEFAULT_STATE = {
    currentPageNumber: 1,
    pdfTemplateList: [],
    pdfTemplateDetail: [],
    pdfDropDown: []
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case GET_PDF_TEMPLATE:
            return { ...state, pdfTemplateList: action.payload };
        case GET_PDF_TEMPLATE_DETAIL:
            return { ...state, pdfTemplateDetail: action.payload }
        case GET_PDF_DROP_DOWN:
            return { ...state, pdfDropDown: action.payload }
        case INIT_PDF_TEMPLATE:
            state.pdfTemplateList = []
            return {
                ...state,
                pdfTemplateList: action.payload,
                currentPageNumber: 1
            }
        case GET_PDF_TEMPLATE_LIST_BY_EXPAND:
            const pdfTemplateList = [...state.pdfTemplateList, ...action.payload]
            const updatedList = pdfTemplateList.filter((obj, pos, arr) => {
                return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
            });
            return {
                ...state,
                pdfTemplateList: updatedList,
                currentPageNumber: state.currentPageNumber + 1,
            }
        case GET_PDF_TEMPLATE_LIST_BY_SEARCH:
            return {
                ...state,
                pdfTemplateList: action.payload,
                currentPageNumber: 1
            }
        default:
            return state;
    }
}