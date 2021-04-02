import React from 'react'
// import events from './events'
import { connect } from 'react-redux';
import { compose } from 'redux';
import $ from 'jquery';
import {
  Calendar,
  momentLocalizer,
  Views
} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

import CustomDay from './CustomDay'
import CustomWeek from './CustomWeek'

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
      calendarView: props.view,
      jobView: true,
    }
  }

  componentDidMount() {
    if (this.props.events.length) {
      this.setState({ events: this.state.jobView ? this.props.parentEvents : this.props.events });
    }
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

    // if (nextProps.events.length) {
    //   state.events = nextProps.events;
    // }
    if (state.calendarView !== nextProps.view) {
      state.calendarView = nextProps.view
    }

    if (state.jobView) {
      state.events = nextProps.parentEvents

      if (nextProps.selectedOrganizations && nextProps.selectedOrganizations.length > 0) {
        state.events = state.events.filter(event => {
          if ((event.hasOwnProperty("org_id") && nextProps.selectedOrganizations.includes(event.org_id))) {
            return event;
          }
        })
      }

      if (nextProps.accepted) {
        state.events = state.events.filter(event => {
          if ((event.hasOwnProperty("job_accept_status") && event.job_accept_status === 1)) {
            return event;
          }
        })
      }

      if (nextProps.new) {
        state.events = state.events.filter(event => {
          if (!event.hasOwnProperty("job_accept_status") || (event.hasOwnProperty("job_accept_status") && event.job_accept_status === 0)) {
            return event;
          }
        })
      }

      if (nextProps.started) {
        state.events = state.events.filter(event => {
          if (event.hasOwnProperty("job_status") && (event.job_status === 1)) {
            return event;
          }
        })
      }

      if (nextProps.paused) {
        state.events = state.events.filter(event => {
          if (event.hasOwnProperty("job_status") && (event.job_status === 2)) {
            return event;
          }
        })
      }

      if (nextProps.completed) {
        state.events = state.events.filter(event => {
          if (event.hasOwnProperty("job_status") && (event.job_status === 3)) {
            return event;
          }
        })
      }

      if (nextProps.accountManager) {
        state.events = state.events.filter(event => {
          if (event.user_name && nextProps.accountManager) {
            if ((event.user_name.toString()).toLowerCase() === (nextProps.accountManager.toString()).toLowerCase()) {
              return event;
            }
          }
        })
      }

      if (nextProps.selectedState.hasOwnProperty("stateName")) {
        state.events = state.events.filter(event => {
          if (event.state && nextProps.selectedState && nextProps.selectedState.stateName) {
            if ((event.state.toString()).toLowerCase() === (nextProps.selectedState.stateName.toString()).toLowerCase()) {
              return event
            }
          }
        })
      }

      if (nextProps.signedOff) {
        state.events = state.events.filter(event => {
          if (event.hasOwnProperty("job_sheet_sign_off_status") && event.job_sheet_sign_off_status === 1) {
            return event;
          }
        })
      }

      if (nextProps.invoiced) {
        state.events = state.events.filter(event => {
          if (event.hasOwnProperty("invoiced") && event.invoiced === 1) {
            return event;
          }
        })
      }
    }
  }

  handleEventSelection = event => {
    if (event.isJob) {
      console.log(event.booked)
      const events = [];
      event.sites.forEach(site => site.tasks.forEach(task => events.push(this.formatTaskForCalendar(task))))
      this.setState({
        ...this.state,
        events: events,
        jobView: false,
      }, /* () => this.setState({ view: "month" }, () => this.setState({ view: this.props.view }, */() => this.props.onEventSelection(event))/* )) */
    } else {
      console.log(event.booked)
    }
  }

  eventColorSetter = (event, start, end, isSelected) => {
    if ((event.hasOwnProperty("job_filter_status") && event.job_filter_status >= 5) || (event.hasOwnProperty("task_status") && event.task_status >= 5)) {
      return {
        style: {
          backgroundColor: "#4A90E2"
        }
      }
    }

    if ((event.hasOwnProperty("job_filter_status") && event.job_filter_status < 5) || (event.hasOwnProperty("task_status") && event.task_status < 5)) {
      return {
        style: {
          backgroundColor: "#D0021B"
        }
      }
    }
  }

// eventColorSetter = (event, start, end, isSelected) => {
//   if (event.hasOwnProperty("job_status") && event.job_status === 3) {
//     return {
//       style: {
//         backgroundColor: "#4A4A4A"
//       }
//     }
//   } else if (event.hasOwnProperty("job_status") && event.job_status === 2) {
//     return {
//       style: {
//         backgroundColor: "#F5A623"
//       }
//     }
//   } else if (event.hasOwnProperty("job_status") && event.job_status === 1) {
//     return {
//       style: {
//         backgroundColor: "#7ED321"
//       }
//     }
//   } else if (event.hasOwnProperty("job_accept_status") && event.job_accept_status === 1) {
//     return {
//       style: {
//         backgroundColor: "#4A90E2"
//       }
//     }
//   } else if (event.hasOwnProperty("job_accept_status") && event.job_accept_status === 0) {
//     return {
//       style: {
//         backgroundColor: "#D0021B"
//       }
//     }
//   } else {
//     return {
//       style: {
//         backgroundColor: "#D0021B"
//       }
//     }
//   }
// }

formatTaskForCalendar = (task) => {
  task.start = task.start_date;
  task.end = task.end_date;
  task.title = task.task_title;
  task.isJob = false;
  // admin_approve_status, client_approve_status, invoiced, job_sheet_sign_off_status, job_status, outsource_status, allocated, user_name, booked, quote_number, job_name
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
        popup
        defaultView={Views.MONTH}
        defaultDate={new Date()}
        onSelectEvent={this.handleEventSelection}
        views={{
          day: CustomDay,
          week: CustomWeek,
          month: true
        }}
        eventPropGetter={this.eventColorSetter}
      />
    </>
  )
}
}

const mapStateToProps = (state) => {
  return {
    events: state.sAJobCalendar.jobsList,
    parentEvents: state.sAJobCalendar.parentJobs
  }
}

const mapDispatchToprops = dispatch => {
  return {

  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToprops)
)(CoreCalendar)
