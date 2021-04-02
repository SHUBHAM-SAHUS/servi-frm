import {
	ORGANIZATION_GET_ORGANIZATION, SA_GET_SERVICEAGENT, SA_GET_OTHER_SERVICEAGENT, GET_ORG_DETAILS,
	INIT_SERVICE_AGENT_LIST,
	GET_SERVICE_AGENT_LIST_BY_EXPAND,
	GET_SERVICE_AGENT_LIST_BY_SEARCH,
	PROFILE_MANAGEMENT,
	USER_PROFILE
} from '../dataProvider/constant';

const DEFAULT_STATE = {
	currentPageNumber: 1,
	organizations: [],
	serviceAgents: [],
	otherServiceAgents: [],
	organizationDetails: {},
	connectedOrg: [],
	userProfile: []
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case ORGANIZATION_GET_ORGANIZATION:
			return { ...state, organizations: action.payload }
		case SA_GET_SERVICEAGENT:
			return { ...state, serviceAgents: action.payload }
		case SA_GET_OTHER_SERVICEAGENT:
			return { ...state, otherServiceAgents: action.payload }
		case GET_ORG_DETAILS:
			return { ...state, organizationDetails: action.payload, connectedOrg: action.conncted_orgs }
		case INIT_SERVICE_AGENT_LIST:
			state.serviceAgents = []
			return {
				...state,
				serviceAgents: action.payload,
				currentPageNumber: 1
			}
		case GET_SERVICE_AGENT_LIST_BY_EXPAND:
			const serviceAgents = [...state.serviceAgents, ...action.payload]
			const updatedList = serviceAgents.filter((obj, pos, arr) => {
				return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
			});
			return {
				...state,
				serviceAgents: updatedList,
				currentPageNumber: state.currentPageNumber + 1,
			}
		case GET_SERVICE_AGENT_LIST_BY_SEARCH:
			return {
				...state,
				serviceAgents: action.payload,
				currentPageNumber: 1
			}
		case USER_PROFILE:
			return {
				...state,
				userProfile: action.payload
			}
		default:
			return state;
	}
}