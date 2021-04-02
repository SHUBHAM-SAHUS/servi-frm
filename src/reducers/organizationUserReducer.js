import {
	ORG_USERS
} from '../dataProvider/constant';

const DEFAULT_STATE = {
	users: [],
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case ORG_USERS:
			return{...state, users: action.payload};
		default:
			return state;
	}
}