import React from 'react'
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { notification } from 'antd';
import $ from 'jquery';
import {
  Calendar,
  momentLocalizer,
  Views,
} from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import moment from 'moment'
import { withRouter } from 'react-router-dom'

import CustomDay from './CustomDay'
import CustomWeek from './CustomWeek'
import { getStorage } from '../../../../../utils/common'
import { ADMIN_DETAILS } from '../../../../../dataProvider/constant'

import * as bookingCalendarActions from '../../../../../actions/bookingCalendarActions'

import 'react-big-calendar/lib/css/react-big-calendar.css'
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css'

const DragAndDropCalendar = withDragAndDrop(Calendar)
const localizer = momentLocalizer(moment)

class CoreCalendar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      events: [],
      expand: false,
      calendarView: props.view,
    }
    this.adminDetails = JSON.parse(getStorage(ADMIN_DETAILS))
  }

  componentDidMount() {
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

  handleEventSelection = event => {
    if (event.is_selected_from_job_list) {
      this.props.onEventSelect(event.id, event.job_id);
      return;
    }

    if (event.is_job) {
      console.log("Original event", event)
      notification.warning({
        message: "Warning!",
        description: "This task is already part of another job",
        onClick: () => { },
        className: 'ant-warning'
      });
    } else {
      this.props.onEventSelect(event.id)
    }
  }

  eventColorSetter = (event, start, end, isSelected) => {
    if (event.booked_for_calendar === 0) {
      return {
        style: {
          backgroundColor: '#D0021B'
        }
      }
    } else if (this.props.selectedForDisapproval.length > 0 && event.is_selected_for_disapproval) {
      return {
        style: {
          // backgroundColor: '#D0021B',
          background: 'linear-gradient(135deg, #d0021b 14.29%, #ffbdbd 14.29%, #ffbdbd 50%, #d0021b 50%, #d0021b 64.29%, #ffbdbd 64.29%, #ffbdbd 100%)',
          // background: 'linear-gradient(135deg, #8e8e8e 14.29%, #d4d4d4 14.29%, #d4d4d4 50%, #8e8e8e 50%, #8e8e8e 64.29%, #d4d4d4 64.29%, #d4d4d4 100%)',
          backgroundSize: '7.00px 7.00px',
          color: 'black',
          fontWeight: 700
        }
      }
    } else if (event.hasOwnProperty("is_selected_from_job_list") && event.is_selected_from_job_list === true) {
      return {
        style: {
          backgroundColor: '#8E8E8E'
        }
      }
    } else if (event.hasOwnProperty("is_job") && event.is_job) {
      return {
        style: {
          backgroundColor: '#548235'
        }
      }
    } else if (this.props.selectedTasks.length > 0 && this.props.selectedTasks.findIndex(taskId => taskId === event.id) !== -1) {
      return {
        style: {
          backgroundColor: '#8E8E8E'
        }
      }
    } else {
      return {
        style: {
          backgroundColor: '#D0021B'
        }
      }
    }
  }

  render() {
    return (
      <>
        <DragAndDropCalendar
          localizer={localizer}
          events={this.props.events}
          selectable
          resizable
          eventPropGetter={this.eventColorSetter}
          defaultView={Views.MONTH}
          // view={this.state.calendarView}
          // onView={(view) => this.props.onCalendarView(view)}
          defaultDate={this.props.jumpToDate ? moment(this.props.jumpToDate)._d : new Date()}
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
    events: state.bookingCalendar.jobsList
  }
}

const mapDispatchToprops = dispatch => {
  return {
    actions: bindActionCreators(bookingCalendarActions, dispatch),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToprops)
)(CoreCalendar)
