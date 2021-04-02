import {
	GET_ORG_CERTI,
	INIT_ORG_CERTI_LIST,
	GET_ORG_CERTI_LIST_BY_EXPAND,
	GET_ORG_CERTI_LIST_BY_SEARCH,
} from '../dataProvider/constant';

const DEFAULT_STATE = {
	currentPageNumber: 1,
	orgCerti: [],
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case GET_ORG_CERTI:
			return { ...state, orgCerti: action.payload };
		case INIT_ORG_CERTI_LIST:
			state.orgCerti = []
			return {
				...state,
				orgCerti: action.payload,
				currentPageNumber: 1
			}
		case GET_ORG_CERTI_LIST_BY_SEARCH:
			return {
				...state,
				orgCerti: action.payload,
				currentPageNumber: 1
			}
		case GET_ORG_CERTI_LIST_BY_EXPAND:
			const orgCerti = [...state.orgCerti, ...action.payload]
			const updatedList = orgCerti.filter((obj, pos, arr) => {
				return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
			});
			return {
				...state,
				orgCerti: updatedList,
				currentPageNumber: state.currentPageNumber + 1,
			}
		default:
			return state;
	}
}