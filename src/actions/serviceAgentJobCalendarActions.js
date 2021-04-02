import {
  ADMIN_DETAILS,
  JOB_STAFF_URL,
  JOB_DETAILS_URL,
  JOB_SCHEDULE_URL,
  SA_JOB_GET_SUPERVISORS,
  GET_JOB_SUPERVISORS_URL,
  SA_JOB_GET_SELECTED_TASK,
  SA_JOB_CALENDAR_GET_JOBS,
  SA_JOB_CALENDAR_GET_STAFF,
  EDIT_JOB_SCHEDULE_SHIFTS_URL,
  SA_JOB_GET_SITE_SUPERVISORS,
  GET_JOB_SITE_SUPERVISORS_URL,
  GET_ALL_ACCOUNT_MANAGER_TASKS_URL,
  GET_CONNECTED_ORG,
  GET_CONNECTED_LIST,
  CLIENT_NAME_ORG_NAME,
  CLIENT_CONTACT,
  QUOTE_NUMBER,
  SITE_NAMES,
  QUOTE_TOTAL_BUDGET_TOTAL,
  JOB_NAME
} from '../dataProvider/constant'

import { startSipnner, stopSipnner } from '../utils/spinner';
import axiosInstance, { scopeAxiosInstance } from '../dataProvider/axiosHelper'
import { Strings } from '../dataProvider/localize'
import { getStorage } from '../utils/common';
import moment from 'moment';

export const getAllServiceAgentJobs = serviceAgentId => dispatch => {
  startSipnner(dispatch)
  const url = GET_ALL_ACCOUNT_MANAGER_TASKS_URL
  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {

        var jobs = [];
        const parentJobs = [];

        const states = [];

        let role = JSON.parse(getStorage(ADMIN_DETAILS)).role;
        let selectedJobCalendarLabels = role.job_calendar_templates;

        if (res.data.data.jobs.length > 0) {
          res.data.data.jobs.forEach((job, jobIndex) => {
            job.start = moment(job.job_start_date).startOf('day')._d;
            job.end = moment(job.job_end_date).endOf('day')._d;
            job.title = job.job_title ? job.job_title : `Job #${jobIndex + 1}`;
            job.state = (job.sites && job.sites[0] && job.sites[0].state) ? job.sites[0].state : '';
            job.allDay = true;
            job.isJob = true;
            job.job_number = job.job_number ? job.job_number : job.sites[0].tasks[0].job_number
            job.job_accept_status = job.sites.every(site => site.tasks.every(task => task.job_accept_status === 1)) === true ? 1 : 0;
            if (job.sites && job.sites.length > 0) {
              job.sites.forEach((site, index) => {
                states.push({
                  stateName: site.state,
                  stateId: index
                })

                if (site.tasks && site.tasks.length > 0) {
                  site.tasks.forEach(task => {
                    if (task.sub_tasks && task.sub_tasks.length > 0) {
                      task.sub_tasks.forEach(subTask => {
                        if (Object.keys(subTask).length > 0) {
                          if (subTask.job_accept_status != 2) {
                            subTask.start = moment(subTask.start_date).startOf('day')._d;;
                            subTask.end = moment(subTask.end_date).endOf('day')._d;

                            var taskTitle = getTaskTitle(selectedJobCalendarLabels, job, site, task);
                            if (taskTitle.length == 0) {
                              taskTitle = `[${task.job_number}] - ${site.site_name}`
                            }

                            //subTask.title = taskTitle;
                            subTask.title = subTask.task_title;

                            subTask.client_name = job.client_name
                            subTask.allDay = true
                            subTask.client_id = job.client_id
                            subTask.job_number = task.job_number
                            subTask.quote_number = job.quote_number
                            subTask.state = site.state
                            if (task.hasOwnProperty("job_accept_status")) {
                              subTask.job_accept_status = task.job_accept_status
                            }
                            jobs.push(subTask)
                          }
                        }
                      })
                    } else {
                      if (task.job_accept_status != 2) {
                        task.allDay = true
                        task.start = moment(task.start_date).startOf('day')._d;;
                        task.end = moment(task.end_date).endOf('day')._d;

                        var taskTitle = getTaskTitle(selectedJobCalendarLabels, job, site, task);
                        if (taskTitle.length == 0) {
                          taskTitle = `[${task.job_number}] - ${site.site_name}`
                        }

                        //task.title = taskTitle;
                        task.title = task.task_title;

                        task.client_name = job.client_name
                        task.client_id = job.client_id
                        task.quote_number = job.quote_number
                        task.state = site.state
                        jobs.push(task)
                      }
                    }
                  })
                }
              })
            }
            parentJobs.push(job);
          })

          const uniqueStates = [...new Set(states.map(stateItem => stateItem.stateName.trim().toLowerCase()))];
          const statesData = uniqueStates.map((state, index) => ({
            stateName: state,
            stateId: index + 1
          }))
          dispatch({
            type: SA_JOB_CALENDAR_GET_JOBS,
            jobs: jobs,
            parentJobs: parentJobs,
            states: statesData
          })
        } else {
          jobs.push([{
            start: moment('1947-08-15')._d,
            end: moment('1947-08-15')._d,
            isAllDay: false,
            title: ''
          }])

          dispatch({
            type: SA_JOB_CALENDAR_GET_JOBS,
            jobs: jobs,
            parentJobs: [],
            states: []
          })
        }

        return Promise.resolve()
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getServiceAgentStaffMembers = () => dispatch => {
  startSipnner(dispatch)
  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${JOB_STAFF_URL}?organisation_id=${org_id}`
  return scopeAxiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SA_JOB_CALENDAR_GET_STAFF,
          jobStaff: res.data.data.org_users
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const addTaskDetails = formData => dispatch => {
  startSipnner(dispatch);
  return scopeAxiosInstance.post(`${JOB_SCHEDULE_URL}`, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message && res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch)
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getSupervisorsList = () => dispatch => {
  startSipnner(dispatch);
  const orgId = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${GET_JOB_SUPERVISORS_URL}?organisation_id=${orgId}`
  return axiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SA_JOB_GET_SUPERVISORS,
          supervisors: res.data.data.resultList
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getSiteSupervisorsList = () => dispatch => {
  startSipnner(dispatch);
  const org_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  const url = `${GET_JOB_SITE_SUPERVISORS_URL}?organisation_id=${org_id}`
  return axiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: SA_JOB_GET_SITE_SUPERVISORS,
          siteSupervisors: res.data.data.resultList
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

export const getTaskDetails = event => dispatch => {
  return getSingleTaskDetails(dispatch, event)
}

const getSingleTaskDetails = (dispatch, event) => {
  startSipnner(dispatch);
  return scopeAxiosInstance.get(JOB_DETAILS_URL + '?job_number=' + event.job_number/*  + '&t=' + new Date() */)
    .then(res => {
      if (res.data.status) {
        stopSipnner(dispatch)
        dispatch({
          type: SA_JOB_GET_SELECTED_TASK,
          selectedJobDetails: res.data.data.job_details,
          numberOfShifts: res.data.data.number_of_shifts,
          currentCalendarEvent: event,
          jobNotes: res.data.data.job_notes ? res.data.data.job_notes : [],
        })
        return Promise.resolve(res.data.data);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const updateTaskDetails = (formData) => dispatch => {
  startSipnner(dispatch)
  return scopeAxiosInstance.put(EDIT_JOB_SCHEDULE_SHIFTS_URL, formData)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ?
        error.response.data.message
        : Strings.network_error)
    });
}

export const getAllConnectedOrg = () => dispatch => {
  startSipnner(dispatch)
  const url = GET_CONNECTED_LIST
  return axiosInstance.get(url)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_CONNECTED_ORG,
          connectedOrg: res.data.data.conncted_orgs
        })
        return Promise.resolve(true)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}

const getTaskTitle = (selectedJobCalendarLabels, job, site, task) => {

  let taskTitle = '';
  try {

    selectedJobCalendarLabels.forEach(label => {

      if (label.slug === CLIENT_NAME_ORG_NAME) {
        taskTitle = `${taskTitle} - ${job.client_name}`;
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
  } catch (err) {
    taskTitle = "";
  }

  taskTitle = taskTitle.trim(" ");
  if (taskTitle.charAt(0) == '-') {
    taskTitle = taskTitle.substr(1)
  }

  // console.log("taskTitle >>>>>>> ", taskTitle);

  return taskTitle;

}

export const updateJob = jobDetails => dispatch => {
  startSipnner(dispatch)
  const url = '/accept-decline-job-by-sa'
  return scopeAxiosInstance.put(url, jobDetails)
    .then(res => {
      stopSipnner(dispatch);
      if (res.data.status) {
        return Promise.resolve(res.data.message)
      }
    })
    .catch(error => {
      stopSipnner(dispatch);
      return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
    })
}