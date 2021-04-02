import {
	GET_PHOTOS_DOCS_FILE, GET_JOB_REPORT, JOB_DETAILS, GET_SWMS_SIGN, USER_LICENCES, JOB_SIGNOFF, GET_JOB_MEMBERS, GET_JOB_REPORT_VERSION_HISTORY
	, GET_SWMS_HISTORY
} from '../dataProvider/constant';

const DEFAULT_STATE = {
	docFileList: [],
	jobReports: [],
	filePath: '',
	jobDetails: {},
	swmsSignDetails: [],
	signOffDetails: {},
	userLicence: {},
	jobMembers: [],
	versionCount: 0,
	versions: [],
	jobReportVersionHistory: [],
	swmsVersion: 0,
	swmsSignHistory: [],
}

export default (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case GET_PHOTOS_DOCS_FILE:
			return { ...state, docFileList: action.payload };
		case GET_JOB_REPORT:
			const versionArray = [];
			for (let count = 1; count <= action.versionCount; count++) {
				versionArray.push(count)
			}
			return {
				...state,
				jobReports: action.payload,
				filePath: action.filePath,
				versionCount: action.versionCount,
				versions: versionArray
			};
		case JOB_DETAILS:
			return {
				...state,
				jobDetails: action.payload
			}
		case GET_SWMS_SIGN:
			return { ...state, swmsSignDetails: action.payload, swmsVersion: action.total_versions }
		case GET_SWMS_HISTORY:
			return { ...state, swmsSignHistory: action.payload}
		case JOB_SIGNOFF:
			return { ...state, signOffDetails: action.payload }
		case USER_LICENCES:
			return { ...state, userLicence: action.payload }

		case GET_JOB_MEMBERS:
			return { ...state, jobMembers: action.payload }
		case GET_JOB_REPORT_VERSION_HISTORY:
			return { ...state, jobReportVersionHistory: action.payload, filePath: action.filePath };
		default:
			return state;
	}
}