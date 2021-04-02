import React from 'react'
import * as dates from 'date-arithmetic'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import moment from 'moment'
import { Navigate } from 'react-big-calendar'
import $ from 'jquery';

class CustomDay extends React.Component {
  render() {
    let { date } = this.props
    let range = CustomDay.range(date)

    return <TimeGrid {...this.props} range={range} eventOffset={15} />
  }
}

CustomDay.range = date => {
  let start = moment(date).startOf('day')
  let end =  moment(date).endOf('day')

  let current = start
  let range = []

  while (dates.lte(current, end, 'day')) {
    range.push(current)
    current = dates.add(current, 1, 'day')
  }

  return range
}

CustomDay.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add(date, -1, 'day')

    case Navigate.NEXT:
      return dates.add(date, 1, 'day')

    default:
      return date
  }
}

CustomDay.title = date => {
  let day = moment(date).format('ddd');
  let monthAndDay = moment(date).format('MMM DD')
  let year = moment(date).format('YYYY')
  return (
    <div id="day-display">
      {`${day}, ${monthAndDay}, ${year}`}
    </div>
  )
}

export default CustomDay