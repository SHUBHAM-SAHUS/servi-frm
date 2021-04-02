import {
	ROLE_GET_ROLES, INIT_ROLES_LIST,
	GET_ROLES_BY_EXPAND,
	GET_ROLES_BY_SEARCH
} from '../dataProvider/constant';

const DEFAULT_STATE = {
	currentPageNumber: 1,
	roles: [],
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case ROLE_GET_ROLES:
			return { ...state, roles: action.payload, job_calendar_lables: action.job_calendar_lables };
		case INIT_ROLES_LIST:
			state.roles = []
			
			return {
				...state,
				roles: action.payload,
				currentPageNumber: 1,
				job_calendar_lables: action.job_calendar_lables
			}
		case GET_ROLES_BY_EXPAND:
			const roles = [...state.roles, ...action.payload]
			const updatedList = roles.filter((obj, pos, arr) => {
				return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
			});
			return {
				...state,
				roles: updatedList,
				currentPageNumber: state.currentPageNumber + 1,
				job_calendar_lables: action.job_calendar_lables
			}
		case GET_ROLES_BY_SEARCH:
			return {
				...state,
				roles: action.payload,
				currentPageNumber: 1,
				job_calendar_lables: action.job_calendar_lables
			}
		default:
			return state;
	}
}