import {
  GET_ALL_INCIDENTS,
  INCIDENT_REPORT_DETAILS,
  GET_INCIDENT_CATEGORIES,
  HAZARD_REPORT_DETAILS,
  GET_ALL_HAZARDS,
  GET_ALL_INCIDENTS_BY_JOBS,
  GET_ALL_HAZARDS_By_JOB,
  GET_RISK_CONTROL, GET_ACTION_ASSIGN,
  
  HAZARD_DETAILS
} from '../dataProvider/constant';

const DEFAULT_STATE = {
  incidentCategories: [],
  allIncidentReports: [],
  incidentReportDetails: [],
  allHazardReports: [],
  hazardReportDetails: [],
  allIncidentReportsByJob: [],
  allHazardReportsByJob: [],
  riskControls: [],
  actionAssign: {},
  allLikelihood: [],
  allConsequences: [],
  riskControls: [],
  hazardDetails: []
}

export default (state = DEFAULT_STATE, action) => {

  switch (action.type) {
    case GET_INCIDENT_CATEGORIES:
      return {
        ...state,
        incidentCategories: action.categories
      }
    case INCIDENT_REPORT_DETAILS:
      return {
        ...state,
        incidentReportDetails: action.incidentReportDetails
      }
    case GET_ALL_INCIDENTS:
      return {
        ...state,
        allIncidentReports: action.incidentReports
      }
    case HAZARD_REPORT_DETAILS:
      return {
        ...state,
        hazardReportDetails: action.hazardReportDetails
      }
    case GET_ALL_HAZARDS:
      return {
        ...state,
        allHazardReports: action.hazardReports
      }
    case GET_ALL_INCIDENTS_BY_JOBS:
      return {
        ...state,
        allIncidentReportsByJob: action.payload
      }
    case GET_ALL_HAZARDS_By_JOB:
      return {
        ...state,
        allHazardReportsByJob: action.payload
      }
    case 'GET_ALL_LIKELIHOOD_BEFORE_CONTROL':
      return {
        ...state,
        allLikelihood: action.payload
      }
    case 'GET_ALL_BEFORE_CONSEQUENCES':
      return {
        ...state,
        allConsequences: action.payload
      }
    case GET_RISK_CONTROL:
      return {
        ...state,
        riskControls: action.payload
      }
    case GET_ACTION_ASSIGN:
      return {
        ...state,
        actionAssign: action.payload.length > 0 ? action.payload[0] : {}
      }
    case HAZARD_DETAILS:
      return {
        ...state,
        hazardDetails: action.payload
      }
    default:
      return state;
  }
}