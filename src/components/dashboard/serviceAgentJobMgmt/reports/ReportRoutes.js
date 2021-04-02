import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Reports } from './Reports'
import { Route, Link, Switch, BrowserRouter, withRouter, Redirect } from 'react-router-dom'
import HazardReportsAssignment from './hazardReportsAssignment/HazardReportsAssignment';
import IncidentReportsAssignment from './IncidentReportsAssignment/IncidentReportsAssignment'

export class ReportRoutes extends Component {
  render() {
    return (
      <div>
        <Switch>
          <Route path='/dashboard/reports' exact component={Reports} />
          <Route path={this.props.match.path + '/incident-reports'} component={IncidentReportsAssignment} />
          <Route path={this.props.match.path + '/hazard-reports'} component={HazardReportsAssignment} />
        </Switch>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default connect(mapStateToProps, mapDispatchToProps)(ReportRoutes)
