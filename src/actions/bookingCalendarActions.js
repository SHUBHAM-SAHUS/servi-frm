import moment from 'moment'
import { scopeAxiosInstance } from "../dataProvider/axiosHelper";
import {
    startSipnner,
    stopSipnner
} from "../utils/spinner";
import {
    BOOKING_CALENDAR_GET_JOBS_LIST,
    HIGHLIGHT_JOB_TASKS,
    SELECT_TASKS_FOR_DISAPROVAL,
    SET_BOOKING_CALENDAR_STATE,
    CLEAR_TASKS_FOR_DISAPROVAL
} from "../dataProvider/constant";
import { Strings } from "../dataProvider/localize";

export const getBookedJobsList = (scopeDocDetails) => dispatch => {
    startSipnner(dispatch);
    try {
        const jobs = []
        const bookedTaskIds = []
        let quoteId = "";

        scopeDocDetails.quotes[0].quote_managements.forEach(task => {
            if (!!task.quote_task_label && task.booked_for_calendar) {
                jobs.push(task)
                bookedTaskIds.push(task.id)
            }
        })

        const url = `/booked-job?quote_id=${scopeDocDetails.quotes[0].id}`
        scopeAxiosInstance.get(url)
            .then(res => {
                if (res.data.status) {
                    quoteId = res.data.data
                        && res.data.data.quote_booked_jobs
                        && res.data.data.quote_booked_jobs[0]
                        && res.data.data.quote_booked_jobs[0].id
                        ? res.data.data.quote_booked_jobs[0].id
                        : '101';

                    res.data.data.quote_booked_jobs
                        && res.data.data.quote_booked_jobs[0]
                        && res.data.data.quote_booked_jobs[0].jobs
                        && res.data.data.quote_booked_jobs[0].jobs.forEach(bookedJob => {
                            bookedJob.quote_managements.forEach(job => {
                                const index = bookedTaskIds.findIndex(id => id === job.id)
                                if (index !== -1) {
                                    job.is_job = true;
                                    job.job_id = bookedJob.id
                                    job.job_label = bookedJob.job_label;
                                    job.job_number = bookedJob.job_number;
                                    jobs.splice(index, 1, job)
                                }
                            })
                        })
                    jobs.forEach(job => {
                        if (job.quote_task_label) {
                            job.title = job.quote_task_label
                        }
                        job.start = moment(job.start_date)._d;
                        if (job.end_date) {
                            job.end = moment(job.end_date)._d;
                        } else {
                            job.end = moment(job.start_date)._d;
                        }

                    })
                }
                stopSipnner(dispatch);
                dispatch({
                    type: BOOKING_CALENDAR_GET_JOBS_LIST,
                    jobs: jobs,
                    quoteId: quoteId
                })
            })
            .catch(err => {
                stopSipnner(dispatch);
                console.log(err)
                return Promise.reject(err);
            })
        return Promise.resolve('Jobs fetched successfully');
    } catch (err) {
        return Promise.reject(err);
    }
}

export const createJob = (quoteId, taskIds) => dispatch => {
    startSipnner(dispatch);
    const url = '/booked-job'
    const formData = {
        quote_id: quoteId,
        quote_management_ids: JSON.stringify(taskIds)
    }
    return scopeAxiosInstance.post(url, formData)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status === 1) {
                return Promise.resolve(res.data)
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const highlightJobTasks = (newTaskList, selectedTasks) => dispatch => {
    startSipnner(dispatch);
    dispatch({
        type: HIGHLIGHT_JOB_TASKS,
        tasks: newTaskList,
        selectedTasks: selectedTasks
    })
    stopSipnner(dispatch);
    return
}

export const selectTasksForDisapproval = (jobId, selectedTaskIds) => dispatch => {
    startSipnner(dispatch);
    dispatch({
        type: SELECT_TASKS_FOR_DISAPROVAL,
        selectedJobId: jobId,
        selectedTasksForDisapproval: selectedTaskIds
    })
    stopSipnner(dispatch);
    return
}

export const updateJob = (quoteId, selectedTaskIds) => dispatch => {
    startSipnner(dispatch);
    const url = '/booked-job'
    const formData = {
        quote_id: quoteId,
        quote_management_ids: JSON.stringify(selectedTaskIds)
    }
    return scopeAxiosInstance.put(url, formData)
        .then(res => {
            stopSipnner(dispatch);
            if (res.data.status === 1) {
                return Promise.resolve(res.data)
            }
        })
        .catch(error => {
            stopSipnner(dispatch);
            return Promise.reject(error.response ? error.response.data.message : Strings.network_error)
        })
}

export const setBookingCalendarStatus = (status) => dispatch => {
    startSipnner(dispatch);
    dispatch({
        type: SET_BOOKING_CALENDAR_STATE,
        payload: status
    })
    stopSipnner(dispatch);
    return
}

export const enableTaskSelection = (taskIds) => dispatch => {

}

export const clearTasksForDisapproval = () => dispatch => {
    startSipnner(dispatch);
    dispatch({
        type: CLEAR_TASKS_FOR_DISAPROVAL
    })
    stopSipnner(dispatch);
    return
}