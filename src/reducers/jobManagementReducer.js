import {
	COMPLETED_JOBS, COMPLETED_JOB_DETAIL,
	INIT_COMPLETED_JOBS_LIST,
	GET_COMPLETED_JOBS_LIST_BY_EXPAND,
	GET_COMPLETED_JOBS_LIST_BY_SEARCH
} from '../dataProvider/constant';

const DEFAULT_STATE = {
	currentPageNumber: 1,
	completedJobList: [],
	completedJobDetail: []
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case COMPLETED_JOBS:
			return { ...state, completedJobList: action.payload };
		case COMPLETED_JOB_DETAIL:
			return { ...state, completedJobDetail: action.payload };

		case INIT_COMPLETED_JOBS_LIST:
			state.completedJobList = []
			return {
				...state,
				completedJobList: action.payload,
				currentPageNumber: 1
			}
		case GET_COMPLETED_JOBS_LIST_BY_EXPAND:
			const completedJobList = [...state.completedJobList, ...action.payload]
			const updatedList = completedJobList.filter((obj, pos, arr) => {
				return arr.map(mapObj => mapObj.id).indexOf(obj.id) === pos;
			});
			return {
				...state,
				completedJobList: updatedList,
				currentPageNumber: state.currentPageNumber + 1,
			}
		case GET_COMPLETED_JOBS_LIST_BY_SEARCH:
			return {
				...state,
				completedJobList: action.payload,
				currentPageNumber: 1
			}
		default:
			return state;
	}
}