import {
	SWMS_GET_ORG_SWMS, SWMS_GET_TASK_SWMS, SWMS_GET_SWMS_CONTROL,
	TOOLBOX_TALK_ITEMS, TOOLBOX_TALK, JOB_TOOLBOX_TALK_DETAIL, JOB_TOOLBOX_TALK
} from '../dataProvider/constant';

const DEFAULT_STATE = {
	orgSWMS: {},
	taskSWMS: [],
	swmsControl: {},
	toolboxTalkItems: [],
	toolboxTalk: [],
	jobToolBoxTalk: [],
	jobToolBoxTalkDetail: {}
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case SWMS_GET_ORG_SWMS:
			return { ...state, orgSWMS: action.payload }
		case SWMS_GET_TASK_SWMS:
			return { ...state, taskSWMS: action.payload }
		case SWMS_GET_SWMS_CONTROL:
			return { ...state, swmsControl: action.payload }
		case TOOLBOX_TALK_ITEMS:
			return { ...state, toolboxTalkItems: action.payload }
		case TOOLBOX_TALK:
			return { ...state, toolboxTalk: action.payload }
		case JOB_TOOLBOX_TALK:
			return { ...state, jobToolBoxTalk: action.payload }
		case JOB_TOOLBOX_TALK_DETAIL:
			return { ...state, jobToolBoxTalkDetail: action.payload }
		default:
			return state;
	}
}