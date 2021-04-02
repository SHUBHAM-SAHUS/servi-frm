import {
  CALENDAR_GET_ACCOUNT_MANAGER_URL,
  CALENDAR_GET_ACCOUNT_MANAGERS_LIST,
  STAFF_CALENDAR_GET_JOBS_LIST,
  GET_SA_STAFF,
  GET_ALLOCATE,
} from "../dataProvider/constant";
import { startSipnner, stopSipnner } from "../utils/spinner";
import { scopeAxiosInstance } from "../dataProvider/axiosHelper";
import { Strings } from "../dataProvider/localize";
import moment from "moment";

export const getAllJobs = () => (dispatch) => {
  startSipnner(dispatch);
};

export const getStaffJobsList = () => (dispatch) => {
  startSipnner(dispatch);
  const url = "/user-job-calendar";
  return scopeAxiosInstance
    .get(url)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        const jobs = [];
        const states = [];

        if (res.data.data.jobs.length > 0) {
          res.data.data.jobs.forEach((job, index) => {
            if (job.tasks && job.tasks.length > 0) {
              if (job.state !== null) {
                states.push({
                  stateName: job.state,
                  stateId: index,
                });
              }

              job.tasks.forEach((task) => {
                task.start = moment(task.start_date).startOf("day")._d;
                task.end = moment(task.end_date).startOf("day")._d;
                task.title = task.task_name;
                task.state = job.state;
                task.job_id = job.id;
                task.allDay = true;
                task.site_name = job.site_name;
                task.client_id = job.client_id;
                jobs.push(task);
              });
            }
          });
          const uniqueStates = [
            ...new Set(
              states.map((stateItem) =>
                stateItem.stateName.trim().toLowerCase()
              )
            ),
          ];
          const statesData = uniqueStates.map((state, index) => ({
            stateName: state,
            stateId: index,
          }));
          dispatch({
            type: STAFF_CALENDAR_GET_JOBS_LIST,
            jobs: jobs,
            stateNames: statesData,
          });
        } else {
          jobs.push([
            {
              start: moment("1947-08-15")._d,
              end: moment("1947-08-15")._d,
              isAllDay: false,
              title: "",
            },
          ]);

          dispatch({
            type: STAFF_CALENDAR_GET_JOBS_LIST,
            jobs: jobs,
            stateNames: [],
          });
        }
        return Promise.resolve();
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getAccountManagersList = () => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(`${CALENDAR_GET_ACCOUNT_MANAGER_URL}`)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: CALENDAR_GET_ACCOUNT_MANAGERS_LIST,
          payload: res.data.data.account_managers,
        });
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const getSAStaff = (id) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(`/sa-staffs?service_agent_id=${id}`)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_SA_STAFF,
          payload: res.data.data,
        });
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const addJobShift = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(`/job-shifts`, formData)
    .then((res) => {
      stopSipnner(dispatch);
      return Promise.resolve(res.data.message && res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response && error.response.data
          ? error.response.data.message
          : Strings.network_error
      );
    });
};

export const getAllocationsInstance = (id) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .get(`/job-shifts?job_id=${id}`)
    .then((res) => {
      stopSipnner(dispatch);
      if (res.data.status) {
        dispatch({
          type: GET_ALLOCATE,
          payload: res.data.data.shift_allocations,
        });
        return Promise.resolve(res.data.message && res.data.message);
      }
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response ? error.response.data.message : Strings.network_error
      );
    });
};

export const sendNotification = (formData) => (dispatch) => {
  startSipnner(dispatch);
  return scopeAxiosInstance
    .post(`/send-job-notification`, formData)
    .then((res) => {
      stopSipnner(dispatch);
      return Promise.resolve(res.data.message && res.data.message);
    })
    .catch((error) => {
      stopSipnner(dispatch);
      return Promise.reject(
        error.response && error.response.data
          ? error.response.data.message
          : Strings.network_error
      );
    });
};
