import {
    INDUSTRY_GET_INDUSTRIES, SERVICE_GET_SERVICES, CATEGORY_GET_CATEGORIES,
    SUB_CATEGORY_GET_SUB_CATEGORIES
} from '../dataProvider/constant';

const DEFAULT_STATE = {
    industries: [],
    services: [],
    categories: [],
    subCategories: []
}

export default (state = DEFAULT_STATE, action) => {
    switch (action.type) {
        case INDUSTRY_GET_INDUSTRIES:
            return { ...state, industries: action.payload };
        case SERVICE_GET_SERVICES:
            return { ...state, services: action.payload };
        case CATEGORY_GET_CATEGORIES:
            return { ...state, categories: action.payload };
        case SUB_CATEGORY_GET_SUB_CATEGORIES:
            return { ...state, subCategories: action.payload };
        default:
            return state;
    }
}