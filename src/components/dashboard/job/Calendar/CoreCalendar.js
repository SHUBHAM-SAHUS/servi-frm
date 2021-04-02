import React from 'react'
// import events from './events'
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import * as jobCalendarActions from '../../../../actions/jobCalendarActions';
import { notification } from 'antd';
import { Strings } from '../../../../dataProvider/localize';
import $ from 'jquery';
import {
  Calendar,
  momentLocalizer,
  Views,
} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import AllocateManager from './AllocateManager'
import { withRouter } from 'react-router-dom'

import CustomDay from './CustomDay'
import CustomWeek from './CustomWeek'
import { getStorage } from '../../../../utils/common'
import { ACCESS_CONTROL, ADMIN_DETAILS } from '../../../../dataProvider/constant'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const DragAndDropCalendar = withDragAndDrop(Calendar)
const localizer = momentLocalizer(moment)

class CoreCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      events: [],
      expand: false,
      calendarView: props.view,
      jobView: true
    }
    this.moveEvent = this.moveEvent.bind(this)
    this.adminDetails = JSON.parse(getStorage(ADMIN_DETAILS))
  }

  componentDidMount() {
    this.setState({ events: this.state.jobView ? this.props.parentEvents : this.props.events });
    // add class for calendar in jquery 
    $(".rbc-toolbar > span:nth-child(1)").addClass("dwmt-nav");
    $(".rbc-toolbar > span:nth-child(3)").addClass("bn-nav");
    $(".rbc-btn-group.bn-nav button:nth-child(1)").addClass("day-bnt");
    $(".rbc-btn-group.bn-nav button:nth-child(2)").addClass("week-bnt");
    $(".rbc-btn-group.bn-nav button:nth-child(3)").addClass("month-bnt");
    $(".rbc-btn-group.dwmt-nav > button:nth-child(1)").addClass("today-bnt-c");
    $(".rbc-btn-group.dwmt-nav > button:nth-child(2), .rbc-btn-group.dwmt-nav > button:last-child").wrapAll("<div class='nb-date-nav'></div>");

    $(".rbc-toolbar-label").insertAfter(".rbc-btn-group.dwmt-nav .nb-date-nav button:first-child");
  }

  static getDerivedStateFromProps(nextProps, state) {

    if (state.calendarView !== nextProps.view) {
      state.calendarView = nextProps.view
    }

    if (state.jobView) {
      state.events = nextProps.parentEvents
    } else {
      state.events = [...state.backupEvents]
    }

    if (nextProps.filters.notApproved) {
      state.events = state.events.filter(event => {
        if ((event.hasOwnProperty("job_filter_status") && event.job_filter_status < 1) || (event.hasOwnProperty("task_status") && event.task_status < 1)) {
          return event;
        }
      })
    }

    if (nextProps.filters.invoiced) {
      state.events = state.events.filter(event => {
        if (event.hasOwnProperty("invoiced") && event.invoiced === 1) {
          return event;
        }
      })
    }

    if (nextProps.filters.signedOff) {
      state.events = state.events.filter(event => {
        if (event.hasOwnProperty("job_sheet_sign_off_status") && event.job_sheet_sign_off_status === 1) {
          return event;
        }
      })
    }

    if (nextProps.filters.completed) {
      state.events = state.events.filter(event => {
        if (event.hasOwnProperty("job_status") && event.job_status === 3) {
          return event;
        }
      })
    }

    if (nextProps.filters.paused) {
      state.events = state.events.filter(event => {
        if (event.hasOwnProperty("job_status") && event.job_status === 2) {
          return event;
        }
      })
    }

    if (nextProps.filters.started) {
      state.events = state.events.filter(event => {
        if (event.hasOwnProperty("job_status") && event.job_status === 1) {
          return event;
        }
      })
    }

    if (nextProps.filters.outsourced) {
      state.events = state.events.filter(event => {
        if ((event.hasOwnProperty("job_filter_status") && event.job_filter_status === 5) || (event.hasOwnProperty("task_status") && event.task_status === 5)) {
          return event;
        }
      })
    }

    if (nextProps.filters.allocated) {
      state.events = state.events.filter(event => {
        if ((event.hasOwnProperty("job_filter_status") && event.job_filter_status === 3) || (event.hasOwnProperty("task_status") && event.task_status === 3)) {
          return event;
        }
      })
    }

    if (nextProps.filters.booked) {
      state.events = state.events.filter(event => {
        if ((event.hasOwnProperty("job_filter_status") && event.job_filter_status === 1) || (event.hasOwnProperty("task_status") && event.task_status === 1)) {
          return event;
        }
      })
    }

    if (nextProps.dropdowns.accountMgr) {
      state.events = state.events.filter(event => {
        if (event.hasOwnProperty("user_name")) {
          if ((event.user_name && (event.user_name.toString()).toLowerCase() === (nextProps.dropdowns.accountMgr.toString()).toLowerCase())) {
            return event;
          }
        }
      })
    }

    if (nextProps.dropdowns.stateName) {
      state.events = state.events.filter(event => {
        if (event.hasOwnProperty("state")) {
          if ((event.state && (event.state.toString()).toLowerCase() === (nextProps.dropdowns.stateName.toString()).toLowerCase())) {
            return event;
          }
        }
      })
    }

    if (nextProps.searchString) {
      state.events = state.events.filter(event => {
        if ((event.quote_number && event.quote_number.includes(nextProps.searchString)) || (event.job_name && event.job_name.includes(nextProps.searchString))) {
          return event
        }
      })
    }

  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.jobView) {

    }
  }


  moveEvent({ event, start, end, isAllDay: droppedOnAllDaySlot }) {
    if (event.disable_start_date == 1) {
      notification.error({
        message: Strings.error_title,
        description: "You can not draged and dropped the started job.",
        onClick: () => { },
        className: 'ant-error'
      });

    } else {
      const { events } = this.state
      const idx = events.indexOf(event)
      let allDay = event.allDay

      if (!event.allDay && droppedOnAllDaySlot) {
        allDay = true
      } else if (event.allDay && !droppedOnAllDaySlot) {
        allDay = false
      }

      const updatedEvent = { ...event, start, end, allDay }
      const nextEvents = [...events]
      nextEvents.splice(idx, 1, updatedEvent)

      var formData = {};
      formData["task_id"] = event.id;
      formData["task_details"] = {
        "start_date": moment(start).format('YYYY-MM-DD'),
        "end_date": moment(end).format('YYYY-MM-DD')
      }
      formData["quote_id"] = event.quote_id;

      formData["task_ids"] = JSON.stringify([...new Set(event.task_ids)]);

      this.props.jobCalendarActions.updateTask(formData, event.quote_id)
        .then(flag => {
          this.props.jobCalendarActions.getJobsList(event.quote_id)
        })
        .then(() => {
          this.setState({
            events: this.props.events
          })
        })
        .catch(message => {
          notification.error({
            message: Strings.error_title,
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        })

    }
  }

  resizeEvent = ({ event, start, end }) => {
    var formData = {};
    let taskEndData = moment(end).subtract(1, 'd').format('YYYY-MM-DD')
    if (event.start_date != moment(start).format('YYYY-MM-DD')) {
      taskEndData = moment(end).format('YYYY-MM-DD')
    } else if (event.start_date == moment(start).format('YYYY-MM-DD') && event.end_date == taskEndData) {
      taskEndData = moment(end).format('YYYY-MM-DD')
    }
    formData["task_id"] = event.id;

    formData["task_details"] = {
      "start_date": moment(start).format('YYYY-MM-DD'),
      "end_date": taskEndData
    }
    formData["quote_id"] = event.quote_id;

    this.props.jobCalendarActions.updateTask(formData, event.quote_id)
      .then(flag => {
        this.props.jobCalendarActions.getJobsList(event.quote_id)
      })
      .then(() => {
        this.setState({
          events: this.props.events
        })
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  }

  handleEventSelection = event => {
    if (event.isJob) {
      console.log(event.job_filter_status);
      const events = [];
      event.sites.forEach(site => site.tasks.forEach(task => events.push(this.formatTaskForCalendar(task, event.acc_manager_user_name))))
      this.setState(
        {
          ...this.state,
          events: events,
          jobView: false,
          event_id: event.id,
          backupEvents: events
        },
        () => this.props.onTaskSelect(event))
    } else {
      console.log(event.task_status);
      console.warn('Mayday!')
    }
  }

  eventColorSetter = (event, start, end, isSelected) => {
    if (this.state.jobView) {
      // console.log('Job', event.job_filter_status)
      if (event.job_filter_status === 5) {
        return {
          style: {
            backgroundColor: "#00B0F0"
          }
        }
      }
      if (event.job_filter_status === 4) {
        return {
          style: {
            background: 'linear-gradient(135deg, #00b0f0 14.29%, #ffffff 14.29%, #ffffff 50%, #00b0f0 50%, #00b0f0 64.29%, #ffffff 64.29%, #ffffff 50%)',
            backgroundSize: '7.00px 7.00px',
            color: 'black',
            fontWeight: 600,
          }
        }
      }
      if (event.job_filter_status === 3) {
        return {
          style: {
            backgroundColor: "#4A90E2"
          }
        }
      }
      if (event.job_filter_status === 1) {
        return {
          style: {
            backgroundColor: "#548235"
          }
        }
      }
      if (event.job_filter_status < 1) {
        return {
          style: {
            backgroundColor: "#D0021B"
          }
        }
      }
    }

    if (!this.state.jobView) {
      // console.log('Task', event.task_status)
      if (event.task_status === 5) {
        return {
          style: {
            backgroundColor: "#00B0F0"
          }
        }
      }
      if (event.task_status === 4) {
        return {
          style: {
            background: 'linear-gradient(135deg, #00b0f0 14.29%, #ffffff 14.29%, #ffffff 50%, #00b0f0 50%, #00b0f0 64.29%, #ffffff 64.29%, #ffffff 50%)',
            backgroundSize: '7.00px 7.00px',
            color: 'black',
            fontWeight: 600,
          }
        }
      }
      if (event.task_status === 3) {
        return {
          style: {
            backgroundColor: "#4A90E2"
          }
        }
      }
      if (event.task_status === 1) {
        return {
          style: {
            backgroundColor: "#548235"
          }
        }
      }
      if (event.task_status < 1) {
        return {
          style: {
            backgroundColor: "#D0021B"
          }
        }
      }
    }
  }


  // eventColorSetter = (event, start, end, isSelected) => {

  //   /*
  //   STATUS_ORDER: [not_approved, invoiced, signed_off, completed, paused, started, outsouced, allocated, booked]
  //   */

  //   if (event.hasOwnProperty("invoiced") && event.invoiced === 1) {   //Condition for invoiced job
  //     return {
  //       style: {
  //         backgroundColor: "#ffff00"
  //       }
  //     }
  //   }

  //   if (event.hasOwnProperty("job_sheet_sign_off_status") && event.job_sheet_sign_off_status === 1) {   //Condition for job signed off
  //     return {
  //       style: {
  //         backgroundColor: "#7b1fa2"
  //       }
  //     }
  //   }

  //   if (event.hasOwnProperty("job_status") && event.job_status === 3) {   //Condition for completed job
  //     return {
  //       style: {
  //         backgroundColor: '#4a4a4a'
  //       }
  //     }
  //   }

  //   if (event.hasOwnProperty("job_status") && event.job_status === 2) {   //Condition for paused job
  //     return {
  //       style: {
  //         backgroundColor: '#f5a623'
  //       }
  //     }
  //   }

  //   if (event.hasOwnProperty("job_status") && event.job_status === 1) {   //Condition for started job
  //     return {
  //       style: {
  //         backgroundColor: '#7ED321'
  //       }
  //     }
  //   }

  //   if (event.hasOwnProperty("outsource_status") && event.outsource_status === 1) {   //Condition for outsourced job
  //     return {
  //       style: {
  //         backgroundColor: "#00b0f0"
  //       }
  //     }
  //   }

  //   if ((event.isJob && event.hasOwnProperty("acc_manager_user_name") && event.acc_manager_user_name !== null) || event.allocated_account_manager === true) {   //Condition for allocated job
  //     return {
  //       style: {
  //         backgroundColor: "#4A90E2"
  //       }
  //     }
  //   }

  //   if (event.partially_allocated_budget === true) {   //Condition for allocated job
  //     return {
  //       style: {
  //         backgroundColor: "#E3E3E3"
  //       }
  //     }
  //   }


  //   if (this.adminDetails.role.slug !== 'ACCOUNT_MANAGER' && event.hasOwnProperty("booked_for_calendar") && (event.booked_for_calendar === 0)) {
  //     return {
  //       style: {
  //         backgroundColor: "#D0021B"
  //       }
  //     }
  //   }

  //   if (this.adminDetails.role.slug !== 'ACCOUNT_MANAGER' && event.isJob && event.hasOwnProperty("booked") && event.booked === 1) {   //Condition for booked job
  //     return {
  //       style: {
  //         backgroundColor: '#548235'
  //       }
  //     }
  //   }

  //   if (this.adminDetails.role.slug !== 'ACCOUNT_MANAGER' && !event.isJob && event.hasOwnProperty("user_name") && event.user_name) {   //Condition for booked job
  //     return {
  //       style: {
  //         backgroundColor: '#548235'
  //       }
  //     }
  //   }

  //   if (this.adminDetails.role.slug !== 'ACCOUNT_MANAGER' && event.hasOwnProperty("client_approve_status") && event.client_approve_status === 3) {
  //     return {
  //       style: {
  //         backgroundColor: '#548235'
  //       }
  //     }
  //   }

  //   if (this.adminDetails.role.slug !== 'ACCOUNT_MANAGER' && event.hasOwnProperty("admin_approve_status") && event.admin_approve_status === 3) {
  //     return {
  //       style: {
  //         backgroundColor: '#18B87A'
  //       }
  //     }
  //   }
  // }

  calendarAccessControl = "job_calendar" in JSON.parse(getStorage(ACCESS_CONTROL)) ? JSON.parse(getStorage(ACCESS_CONTROL))["job_calendar"].permissions : [];
  permissions = {
    sf_job_calendar_controller_outsource_and_revoke_job: this.calendarAccessControl.findIndex(access => access.control_name === 'sf_job_calendar_controller_outsource_and_revoke_job'),
    sf_job_calendar_controller_job_calendar: this.calendarAccessControl.findIndex(access => access.control_name === 'sf_job_calendar_controller_job_calendar'),
    sf_job_calendar_controller_split_job: this.calendarAccessControl.findIndex(access => access.control_name === 'sf_job_calendar_controller_split_job'),
    sf_job_calendar_controller_outsource_job: this.calendarAccessControl.findIndex(access => access.control_name === 'sf_job_calendar_controller_outsource_job'),
    sf_job_calendar_controller_allocate_account_manager: this.calendarAccessControl.findIndex(access => access.control_name === 'sf_job_calendar_controller_allocate_account_manager')
  }

  formatTaskForCalendar = (task, flag) => {
    task.start = task.start_date;
    task.end = task.end_date;
    task.title = task.task_title;
    task.isJob = false;
    if (flag !== null && flag !== '') {
      task.allocated_account_manager = true;
    } else if (task.outsourced_budget !== 0) {
      task.partially_allocated_budget = true;
    } else {
      task.allocated_account_manager = false;
    }
    return task;
  }

  handleJobView = () => {
    this.setState({ jobView: !this.state.jobView })
    this.props.onChangeView(this.state.jobView)
  }

  render() {
    let jobTaskButtonText = this.state.jobView ? "Show Jobs" : "Show Jobs";
    return (
      <>
        <button className="bnt bnt-active job-task-bnt" type="button" disabled={this.state.jobView} onClick={this.handleJobView}>{jobTaskButtonText}</button>
        <DragAndDropCalendar
          localizer={localizer}
          events={this.state.events}
          onEventDrop={this.moveEvent}
          selectable
          resizable
          eventPropGetter={this.eventColorSetter}
          onEventResize={this.resizeEvent}
          defaultView={Views.MONTH}
          view={this.state.calendarView}
          defaultDate={this.props.jumpToDate ? moment(this.props.jumpToDate)._d : new Date()}
          onView={(view) => this.props.onCalendarView(view)}
          onSelectEvent={this.handleEventSelection}
          views={{
            day: CustomDay,
            week: CustomWeek,
            month: true
          }}
        />
      </>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.jobsManagement.jobsList,
    formValues: state.form.jobCalendar && state.form.jobCalendar.values,
    zones: state.jobsManagement.zones,
    states: state.jobsManagement.stateNames,
    accountManagers: state.jobsManagement.accountManagersList,
    parentEvents: state.jobsManagement.parentJobs
  }
}

const mapDispatchToprops = dispatch => {
  return {
    jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToprops)
)(CoreCalendar)
