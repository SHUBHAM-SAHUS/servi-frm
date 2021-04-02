import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";
import authReducer from "./auth";
import roleManagementReducer from "./roleManagementReducer";
import organizationReducer from "./organizationReducer";
import organizationUsersReducer from "./organizationUserReducer";
import organizationBillingReducer from "./organizationBillingReducer";
import industryManagementReducer from "./industryManagementReducer";
import permissionManagementReducer from './permissionManagementReducer';
import accessControlManagementReducer from './accessControlManagementReducer';
import subscriptionReducer from './subscriptionReducer';
import scopeDocsReducer from './scopeDocReducer';
import swmsReducer from './swmsReducer';
import clientManagementReducer from './clientManagementReducer'
import jobCalenderReducer from "./jobCalendarReducer";
import equipmentManagementReducer from './equipmentManagementReducer'
import jobDocReducer from "./jobDocReducer";
import sAJobMgmtReducer from './SAJobMgmtReducer';
import serviceAgentJobCalendarReducer from './serviceAgentJobCalendarReducer';
import jobReducer from './jobReducer';
import profileManagementReducer from "./profileManagementReducer"
import sAIncidentReportReducer from './SAIncidentReportReducer'
import completedJobManagementReducer from './jobManagementReducer'
import timeSheetReducer from './timeSheetReducer'
import jobManagerReducer from "./jobManagerReducer";
import orgCertiReducer from './orgCertiReducer';
import staffCalendarReducer from './staffCalendarReducer'
import invoiceReducer from "./invoiceReducer";
import emailTemplateReducer from "./emailTemplateReducer";
import pdfTemplateReducer from "./pdfTemplateReducer";
import smsTemplateReducer from "./smsTemplateReducer";
import inductionTrainingReducer from "./inductionTrainingReducer";
import advanceSeacrhReducer from './advanceSearchReducer'
import broadcastReducer from "./broadcastReducer"
import likelyhoodBeforeControlReducer from './likelyhoodBeforeControlReducer';
import consequenceBeforeReducer from './consequenceBeforeReducer';

import adminTimesheetReducer from './adminTimeSheetReducer'

import bookingCalendarReducer from './bookingCalendarReducer'
import jobDocumentsReducer from './jobDocumentsReducer';
import jobDetailsReducer from './jobDetailsReducer';

const appReducer = combineReducers({
  form: formReducer,
  auth: authReducer,
  roleManagement: roleManagementReducer,
  organization: organizationReducer,
  organizationUsers: organizationUsersReducer,
  organizationBilling: organizationBillingReducer,
  industryManagement: industryManagementReducer,
  permissionByRoleManagement: permissionManagementReducer,
  accessControlManagement: accessControlManagementReducer,
  subscription: subscriptionReducer,
  scopeDocs: scopeDocsReducer,
  swmsReducer: swmsReducer,
  clientManagement: clientManagementReducer,
  jobsManagement: jobCalenderReducer,
  equipmentManagement: equipmentManagementReducer,
  jobdocManagement: jobDocReducer,
  sAJobMgmt: sAJobMgmtReducer,
  sAJobCalendar: serviceAgentJobCalendarReducer,
  jobManagement: jobReducer,
  profileManagement: profileManagementReducer,
  sAIncidentManagement: sAIncidentReportReducer,
  completedJobManagement: completedJobManagementReducer,
  timeSheet: timeSheetReducer,
  jobManger: jobManagerReducer,
  orgCerti: orgCertiReducer,
  staffCalendar: staffCalendarReducer,
  invoice: invoiceReducer,
  emailTemplate: emailTemplateReducer,
  pdfTemplate: pdfTemplateReducer,
  smsTemplate: smsTemplateReducer,
  inductionTraining: inductionTrainingReducer,
  advanceSeacrh: advanceSeacrhReducer,
  broadCast: broadcastReducer,
  likelyhoodBeforeControl: likelyhoodBeforeControlReducer,
  beforeConsequenceControl: consequenceBeforeReducer,

  adminTimesheet: adminTimesheetReducer,
  bookingCalendar: bookingCalendarReducer,
  jobDocuments: jobDocumentsReducer,
  jobDetailsReducer: jobDetailsReducer,
});

export default (state, action) => {
  if (action.type === 'USER_LOGOUT') {
    state = undefined
  }
  return appReducer(state, action)
}
