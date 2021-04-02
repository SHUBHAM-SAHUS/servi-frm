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
      events: []
    }
  }

  componentDidMount() {
    if (this.props.events.length) {
      this.setState({ events: this.props.events });
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
    if (nextProps.events.length) {
      state.events = nextProps.events;
    }

    if (nextProps.accepted) {
      state.events = state.events.filter(event => {
        if ((event.hasOwnProperty("job_shift_accept_status") && event.job_shift_accept_status === 1)) {
          return event;
        }
      })
    }

    if (nextProps.new) {
      state.events = state.events.filter(event => {
        if ((event.hasOwnProperty("job_shift_accept_status") && event.job_shift_accept_status === 0)) {
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
        if (event.user_name) {
          if ((event.user_name.toString()).toLowerCase() === (nextProps.accountManager.toString()).toLowerCase()) {
            return event;
          }
        }
      })
    }

    if (nextProps.selectedState.hasOwnProperty("stateName")) {
      state.events = state.events.filter(event => {
        if (event.state) {
          if ((event.state.toString()).toLowerCase() === (nextProps.selectedState.stateName.toString()).toLowerCase()) {
            return event
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

  eventColorSetter = (event, start, end, isSelected) => {
    if (event.hasOwnProperty("job_status") && event.job_status === 3) {
      return {
        style: {
          backgroundColor: "#4A4A4A"
        }
      }
    } /* else if (event.hasOwnProperty("job_status") && event.job_status === 2) {
      return {
        style: {
          backgroundColor: "#F5A623"
        }
      }
    } */ else if (event.hasOwnProperty("job_status") && event.job_status === 1) {
      return {
        style: {
          backgroundColor: "#0070c0"
        }
      }
    } else if (event.hasOwnProperty("job_shift_accept_status") && event.job_shift_accept_status === 1) {
      return {
        style: {
          backgroundColor: "#4a4a4a"
        }
      }
    } else if (event.hasOwnProperty("job_shift_accept_status") && event.job_shift_accept_status === 0) {
      return {
        style: {
          backgroundColor: "#7ed321"
        }
      }
    }
  }

  render() {
    return (
      <DragAndDropCalendar
        localizer={localizer}
        events={this.state.events}
        popup
        defaultView={Views.MONTH}
        defaultDate={new Date()}
        onSelectEvent={this.props.onEventSelection}
        views={{
          day: CustomDay,
          week: CustomWeek,
          month: true
        }}
        eventPropGetter={this.eventColorSetter}
      />
    )
  }
}

const mapStateToProps = (state) => {
  return {
    events: state.staffCalendar.staffJobsList,
    accountManagers: state.jobsManagement.accountManagersList
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
