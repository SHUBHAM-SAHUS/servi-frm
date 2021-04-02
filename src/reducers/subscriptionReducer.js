import {
	SUBSCRIPT_GET_SUBSCRIPTS
} from '../dataProvider/constant';

const DEFAULT_STATE = {
	subscriptions: [],
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SUBSCRIPT_GET_SUBSCRIPTS : 
			return {...state, subscriptions: action.payload}
		default:
			return state;
	}
}