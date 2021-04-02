import React from 'react'
import * as dates from 'date-arithmetic'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import { Navigate } from 'react-big-calendar'
import moment from 'moment'

class CustomWeek extends React.Component {
  render() {
    let { date } = this.props
    let range = CustomWeek.range(date)

    return <TimeGrid {...this.props} range={range} eventOffset={15} />
  }
}

CustomWeek.range = date => {
  let start = moment(date).startOf('week')
  let end = moment(date).endOf('week')

  let current = start
  let range = []

  while (dates.lte(current, end, 'day')) {
    range.push(current)
    current = dates.add(current, 1, 'day')
  }

  return range
}

CustomWeek.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add(date, -7, 'day')

    case Navigate.NEXT:
      return dates.add(date, 7, 'day')

    default:
      return date
  }
}

CustomWeek.title = date => {
  let start = date
  let end = dates.add(start, 6, 'day')
  return (
    <div>
      {`${moment(start).format('MMM DD')} - ${moment(end).format('MMM DD')}`}
    </div>
  )
}

export default CustomWeek