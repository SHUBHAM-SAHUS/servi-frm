import React from 'react'
import Organization from './organization/organization';
import Clients from './clients/Clients'
import RolesManagement from './roles/rolesManagement';
import DashBoard from './dashboard/Dashboard';
import Profile from './profile/Profile';
import { Strings } from '../../dataProvider/localize';
import ServiceAgent from './serviceagent/ServiceAgent';
import UserManagement from './organization/UserManagement';
import Induction from './profile/Induction';
import JobManager from './jobManager/JobManager';
import ScopeDoc from '../dashboard/scope-doc/ScopeDoc';
import JobCalender from '../dashboard/job/jobCalender';
import Equipment from '../dashboard/equipment/Equipment';
import InductionManagementModule from '../dashboard/inductionManagementModule/InductionManagementModule';
import ServiceAgentCalendar from '../dashboard/serviceagent/ServiceAgentCalendar/ServiceAgentCalendar';
import ServiceAgentJob from '../dashboard/ServiceAgentJobManagement/serviceAgentJob'
import JobManagement from '../dashboard/jobManagementModule/JobManagement'
import IncidentReportsAssignment from './serviceAgentJobMgmt/reports/hazardReportsAssignment/HazardReportsAssignment'
import Reports from '../dashboard/serviceAgentJobMgmt/reports/Reports'
import AddHazardReport from '../dashboard/serviceAgentJobMgmt/addHazardReport/AddHazardReport'
import AddIncidentReport from '../dashboard/serviceAgentJobMgmt/addIncidentReport/AddIncidentReport'
import EmailTemplateManagement from '../dashboard/EmailTemplateManagement/EmailTemplateManagement'
import SWMSManagement from './SWMSManagement/SWMSManagement'

import { Icon } from 'antd'
import { omit } from 'rc-mentions/lib/util';
import { ReportRoutes } from './serviceAgentJobMgmt/reports/ReportRoutes';
import CertiManagement from './organisationCertificates/CertiManagement';
import StaffCalendar from './ServiceAgentStaff/StaffCalendar/StaffCalendar';
import PDFTemplateManagement from './PDFTemplateManagement/PDFTemplateManagement';
import smsTemplate from './smsTemplate/smsTemplate';
import InductionManagement from './inductionTraining/InductionManagement';
import OrgInternalCalendar from './serviceagent/ServiceAgentCalendar/OrgInternalCalendar';
import TaskTags from './TaskTags/TaskTags';
import { Broadcast } from './broadcastModule/Broadcast';
import TimeSheets from './timeSheets/TimeSheets';
import JobDocuments from '../dashboard/job-documents';
import JobDocumentsPreview from '../dashboard/job-documents/job-doc-preview';

export const NAV_MENU = [

  {
    iconType: (icon) => <Icon type={icon ? icon : "dashboard"} theme="filled"></Icon>,
    linkTo: "/dashboard",
    component: DashBoard,
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/profile",
    component: Profile
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/organization",
    component: Organization,
    description: " sdfghjkl dfghjkl; ertyuio"
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/clients",
    component: Clients
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/scopedoc",
    component: ScopeDoc
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    theme: "filled",
    linkTo: "/rolesmanagement",
    component: RolesManagement,
    description: " sdfghjkl dfghjkl; ertyuio"
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: '/userManagement',
    component: UserManagement
  },

  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/ServiceAgent",
    component: ServiceAgent
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/job_management",
    component: JobManager
  },
  {
    iconType: (icon) => <div className="anticon" ><i class=" fa fa-file-text-o"></i></div>,
    linkTo: "/jobDocuments",
    component: JobDocuments
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/equipment",
    component: Equipment
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/service_agent_staff_calendar",
    component: ServiceAgentCalendar
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/reports",
    component: ReportRoutes
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/org_manage_completed_job",
    component: JobManagement
  },

  // {
  //   iconType: () => <i class="anticon material-icons">perm_contact_calendar</i>,
  //   linkTo: "/org_manage_completed_job",
  //   component: JobManagement
  // },

  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/organisationCertificates",
    component: CertiManagement
  },

  // {
  //   iconType: () => <i class="anticon material-icons">school</i>,
  //   linkTo: "/organisationCertificates",
  //   component: InductionManagement
  // },

  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/staff_calendar",
    component: StaffCalendar
  },
  {
    title: "Email Management",
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    theme: "filled",
    linkTo: "/manage_email_templates",
    component: EmailTemplateManagement
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/pdf_template_management",
    component: PDFTemplateManagement
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/smsTemplate",
    component: smsTemplate
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/timesheet-management",
    component: TimeSheets
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/induction_management",
    component: InductionManagementModule
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/internal_calendar",
    component: OrgInternalCalendar
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/taskTags",
    component: TaskTags
  },
  {
    iconType: (icon) => <i class="anticon material-icons">{icon ? icon : "account_balance"}</i>,
    linkTo: "/broadcast",
    component: Broadcast
  },
  {
    title: "SWMS Management",
    iconType: () => <i class="anticon material-icons">event_seat</i>,
    theme: "filled",
    linkTo: "/org_swms_management",
    component: SWMSManagement
  }
]