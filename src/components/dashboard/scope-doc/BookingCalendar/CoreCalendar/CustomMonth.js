import React from 'react'
import * as dates from 'date-arithmetic'
import TimeGrid from 'react-big-calendar/lib/TimeGrid'
import { Navigate } from 'react-big-calendar'
import moment from 'moment'

class CustomMonth extends React.Component {
  render() {
    let { date } = this.props
    let range = CustomMonth.range(date)

    return <TimeGrid {...this.props} range={range} eventOffset={15}/>
  }
}

CustomMonth.range = date => {
  let start = moment(date).startOf('month')
  let end = moment(date).endOf('month')

  let current = start
  let range = []

  while (dates.lte(current, end, 'day')) {
    range.push(current)
    current = dates.add(current, 1, 'day')
  }

  return range
}

CustomMonth.navigate = (date, action) => {
  switch (action) {
    case Navigate.PREVIOUS:
      return dates.add(date, -30, 'day')

    case Navigate.NEXT:
      return dates.add(date, 30, 'day')

    default:
      return date
  }
}

CustomMonth.title = date => {
  return `Custom Month`
}

export default CustomMonth