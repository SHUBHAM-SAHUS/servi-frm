import {
  CALENDAR_GET_JOBS_LIST,
  ASSIGN_SA_TO_TASK_URL,
  CALENDAR_GET_JOBS_URL,
  SCOPE_DOC_TASK_URL,
  CALENDAR_UPDATE_TASK_URL,
  CALENDAR_GET_ACCOUNT_MANAGER_URL,
  CALENDAR_GET_ACCOUNT_MANAGERS_LIST,
  ALLOCATE_ACCOUNT_MANAGER
} from '../dataProvider/constant'
import { startSipnner, stopSipnner } from '../utils/spinner';
import { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'
import { getStorage, groupBy, map_to_obj, resolveDurationToNumber } from '../utils/common'
import {
  ADMIN_DETAILS, CLIENT_NAME_ORG_NAME, CLIENT_CONTACT, QUOTE_NUMBER, SITE_NAMES,
  QUOTE_TOTAL_BUDGET_TOTAL, JOB_NAME
} from '../dataProvider/constant';
import moment from 'moment'


export const getAllJobs = quoteId => dispatch => {
  return getJobsList(quoteId, dispatch);
}

export const getJobsList = () => dispatch => {
  startSipnner(dispatch);
  const adminDetails = JSON.parse(getStorage(ADMIN_DETAILS))
  let url = adminDetails.role.slug !== "ACCOUNT_MANAGER"
    ? `${CALENDAR_GET_JOBS_URL}`
    : '/org-acm-calender-tasks'
  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {

        const quoteJobs = [];
        const stateNames = [];
        const parentJobs = [];

        let role = adminDetails.role;
        let selectedJobCalendarLabels = role.job_calendar_templates;

        if (res.data.data.jobs.length > 0) {
          res.data.data.jobs.forEach(job => {
            job.start = moment(job.job_start_date).startOf('day')._d;
            job.end = moment(job.job_end_date).endOf('day')._d;
            job.title = job.job_title;
            job.state = (job.sites && job.sites[0] && job.sites[0].state) ? job.sites[0].state : '';
            job.allDay = true;
            job.isJob = true;
            job.outsource_status = job.sites.every(site => site.tasks.every(task => task.outsource_status === 1)) === true ? 1 : 0;
            let taskIds = [];
            let disabledJob = 1;
            job.sites.forEach(site => {
              if (site.tasks.length > 0) {
                site.tasks.forEach(task => {
                  if (task.sub_tasks && task.sub_tasks.length > 0) {

                    quoteJobs.push(task);

                    task.sub_tasks.forEach(subTask => {
                      if (Object.keys(subTask).length > 0) {
                        var last8Digit = (job.quote_number).substr((job.quote_number).length - 8)
                        var amount = adminDetails.role.slug == "ACCOUNT_MANAGER" ? subTask.outsourced_budget : subTask.task_amount
                        var orgCode = subTask.service_agent_name && subTask.service_agent_name != null ? `${subTask.service_agent_org_code} ` : ''

                        var taskTitle = (adminDetails.role.role_name === 'Admin' || adminDetails.role.role_name === 'BDM') ? getTaskTitleAdminBDM(selectedJobCalendarLabels, job, site, subTask) : getTaskTitle(selectedJobCalendarLabels, job, site, subTask);

                        if (taskTitle.length == 0) {
                          taskTitle = `${orgCode}${last8Digit} - ${amount != null ? `$${amount} - ` : ''} ${site.site_name} - ${subTask.task_name}`
                        }
                        subTask.start = moment(subTask.start_date).startOf('day')._d;
                        subTask.end = moment(subTask.end_date).endOf('day')._d
                        subTask.title = taskTitle
                        subTask.title = subTask.task_title
                        subTask.state = site.state;
                        subTask.allDay = true;
                        subTask.client_id = job.client_id;
                        subTask.quote_id = job.quote_id;
                        subTask.quote_number = job.quote_number;
                        subTask.client_approve_status = job.client_approve_status;
                        subTask.admin_approve_status = job.admin_approve_status;
                        subTask.job_name = job.job_name;
                        subTask.booked = subTask.booked_for_calendar;

                        task.client_id = job.client_id;

                        quoteJobs.push(subTask);
                        taskIds.push(subTask.id);

                      }
                    })
                  } else {
                    var last8Digit = (job.quote_number).substr((job.quote_number).length - 8)
                    var amount = adminDetails.role.slug == "ACCOUNT_MANAGER" ? task.outsourced_budget : task.task_amount
                    var orgCode = task.service_agent_name && task.service_agent_name != null ? `${task.service_agent_org_code} ` : ''

                    var taskTitle = (adminDetails.role.role_name === 'Admin' || adminDetails.role.role_name === 'BDM') ? getTaskTitleAdminBDM(selectedJobCalendarLabels, job, site, task) : getTaskTitle(selectedJobCalendarLabels, job, site, task);

                    if (taskTitle.length == 0) {
                      taskTitle = `${orgCode}${last8Digit} - ${amount != null ? `$${amount} - ` : ''} ${site.site_name} - ${task.task_name}`

                    }

                    task.start = moment(task.start_date).startOf('day')._d;
                    task.end = moment(task.end_date).endOf('day')._d
                    task.title = task.task_title
                    task.state = site.state;
                    task.allDay = true;
                    task.client_id = job.client_id;
                    task.quote_id = job.quote_id;
                    task.quote_number = job.quote_number;
                    task.client_approve_status = job.client_approve_status;
                    task.admin_approve_status = job.admin_approve_status;
                    task.job_name = job.job_name;
                    task.booked = task.booked_for_calendar;
                    if (!job.account_manager) {
                      job.account_manager = task.user_name;
                    }
                    job.outsource_status = task.outsource_status;

                    quoteJobs.push(task);
                  }
                  taskIds.push(task.id);
                })

                for (let task of site.tasks) {
                  if (task.disable_start_date == 1) {
                    disabledJob = 1;
                    break;
                  }
                }
              }
            })

            job.disable_start_date = disabledJob;
            job.task_ids = taskIds;
            parentJobs.push(job);
          })

          res.data.data.jobs.forEach(job => {
            job.sites.forEach((site, index) => {
              stateNames.push({
                id: index + 1,
                name: site.state ? site.state : ""
              })

            })
          })

          const uniqueStates = [...new Set(stateNames.map(stateItem => stateItem.name.trim().toLowerCase()))];
          const statesData = uniqueStates.map((state, index) => ({
            name: state,
            id: index + 1
          }))

          dispatch({
            type: CALENDAR_GET_JOBS_LIST,
            jobs: quoteJobs,
            parentJobs: parentJobs,
            stateNames: statesData,
          })
        } else {
          quoteJobs.push([{
            start: moment('1947-08-15')._d,
            end: moment('1947-08-15')._d,
            isAllDay: false,
            title: ''
          }])

          dispatch({
            type: CALENDAR_GET_JOBS_LIST,
            jobs: quoteJobs,
            parentJobs: [],
            stateNames: [],
          })
        }
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getAccountManagersList = () => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(`${CALENDAR_GET_ACCOUNT_MANAGER_URL}`)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: CALENDAR_GET_ACCOUNT_MANAGERS_LIST,
          payload: res.data.data.account_managers,
        })
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const assignAccountManager = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(`${CALENDAR_UPDATE_TASK_URL}`, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        await getJobsList(dispatch);
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error);
    })
}

export const updateTask = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(`${CALENDAR_UPDATE_TASK_URL}`, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        await getJobsList(dispatch);
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error);
    })
}

export const simplyAssignSA = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(`${ASSIGN_SA_TO_TASK_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getJobsList(dispatch);
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error);
    })
}

export const updateTaskDateAndShifts = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put('/task-outsource-details', formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        getJobsList(dispatch);
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error);
    })
}

export const deleteSplitTask = (task_id, scope_docs_id) => dispatch => {
  startSipnner(dispatch);
  const param = {
    "id": task_id,
    "scope_docs_id": scope_docs_id
  }
  return scopeAxiosInstance.delete(SCOPE_DOC_TASK_URL, { data: param })
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    });
}

export const saveBudgetedTask = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(`${CALENDAR_UPDATE_TASK_URL}`, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        // await getJobsList(dispatch);
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error);
    })
}

const getTaskTitle = (selectedJobCalendarLabels, job, site, task) => {

  let taskTitle = '';
  try {

    selectedJobCalendarLabels.forEach(label => {
      if (label.slug === CLIENT_NAME_ORG_NAME) {
        let orgCode = task.service_agent_name && task.service_agent_name != null ? `${task.service_agent_org_code} ` : ''
        if (orgCode)
          taskTitle = `${taskTitle} - ${orgCode}`;
      }

      if (label.slug === CLIENT_CONTACT) {
        if (job.client_person_phone)
          taskTitle = `${taskTitle} - ${job.client_person_phone}`;
      }
      if (label.slug === QUOTE_NUMBER) {
        //last 8 digit
        if (job.quote_number)
          taskTitle = `${taskTitle} - ${(job.quote_number).substr((job.quote_number).length - 8)}`;
      }
      if (label.slug === SITE_NAMES) {
        if (site.site_name)
          taskTitle = `${taskTitle} - ${site.site_name}`;
      }
      if (label.slug === QUOTE_TOTAL_BUDGET_TOTAL) {
        let role = JSON.parse(getStorage(ADMIN_DETAILS)).role.slug;
        if (role === "ACCOUNT_MANAGER") {
          if (task.outsourced_budget)
            taskTitle = `${taskTitle} - $${task.outsourced_budget}`;
        } else {
          if (job.total_amount)
            taskTitle = `${taskTitle} - $${job.total_amount}`;
        }
      }

      if (label.slug === JOB_NAME) {
        if (job.job_name)
          taskTitle = `${taskTitle} - ${job.job_name}`;
      }

    })
    taskTitle = taskTitle.trim(" ");
    if (taskTitle.charAt(0) == '-') {
      taskTitle = taskTitle.substr(1)
    }

  } catch (err) {
    taskTitle = '';
  }
  return taskTitle;
}

const groupJobs = jobs => {
  const groupedJobs = map_to_obj(groupBy(jobs, job => job.quote_id))

  const displayableJobsList = []

  Object.keys(groupedJobs).forEach(key => {
    let startDates = []
    let finalJobIds = []
    groupedJobs[key].forEach(jobItem => {
      if (!startDates.includes(jobItem.start_date)) {
        startDates.push({
          id: jobItem.id,
          date: jobItem.start_date,
          duration: resolveDurationToNumber(jobItem.duration)
        })
      } else {
        let index = startDates.findIndex(dateItem => dateItem.date === jobItem.start_date)
        const dur = resolveDurationToNumber(jobItem.duration)
        if (dur > startDates[index].duration) {
          startDates[index] = {
            id: jobItem.id,
            date: jobItem.start_date,
            duration: dur
          }
        }
      }
    })
    finalJobIds = startDates.map(dateItem => dateItem.id);
    groupedJobs[key].forEach(jobItem => {
      if (finalJobIds.includes(jobItem.id)) {
        displayableJobsList.push(jobItem)
      }
    })
  })
  return displayableJobsList;
}

const getTaskTitleAdminBDM = (selectedJobCalendarLabels, job, site, task) => {
  return `| | ${job.quote_number} / $${job.total_amount} / ${job.job_name}`;
}

export const allocateAccountManager = (formData) => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.put(ALLOCATE_ACCOUNT_MANAGER, formData)
    .then(async res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error);
    })
}