import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Strings } from '../../../../dataProvider/localize'
import { Icon, Steps, Modal } from 'antd';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { goBack } from '../../../../utils/common';
import moment from 'moment'
import { Route, Link, Switch, BrowserRouter, withRouter, Redirect } from 'react-router-dom'

const mapRouteToTitle = {
  '/dashboard/reports': 'Reports'
}

export class Reports extends Component {

  handleIncidentClick = () => {
    this.props.history.push(this.props.match.path + '/incident-reports')
  }

  handleHazardClick = () => {
    this.props.history.push(this.props.match.path + '/hazard-reports')
  }

  render() {

    const renderCards = (
      <div className="main-container" >
        <div className="sf-card-wrap">
          <div className="row">
            <div className="col-md-4">
              <button className="reports-bnt normal-bnt">
                <div className="report-icon"><i className="material-icons">insert_chart</i></div>
                <h3>Create New Report</h3>
                <span>Vivamus facilisis, tellus luctus dictum auctor, massa mauris elementum enim, ut iaculis neque.</span>
              </button>
            </div>
            <div className="col-md-4">
              <button type="button" onClick={this.handleIncidentClick} className="reports-bnt normal-bnt">
              <div className="report-icon"><i className="sficon sf-man-with-arm-injury"></i></div>
                <h3>Incident Reports</h3>
                <span>Vivamus facilisis, tellus luctus dictum auctor, massa mauris elementum enim, ut iaculis neque.</span>
              </button>
            </div>
            <div className="col-md-4">
              <button type="button" onClick={this.handleHazardClick} className="reports-bnt normal-bnt">
                <div className="report-icon"><i className="sficon sf-fire-hazard-sign"></i></div>
                <h3>Hazard Reports</h3>
                <span>Vivamus facilisis, tellus luctus dictum auctor, massa mauris elementum enim, ut iaculis neque.</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className="sf-page-layout" >
        {/* inner header  */}
        <div className="dash-header" >
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            Reports
          </h2>
        </div>
        {/* inner header  */}
        {renderCards}
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = {

}

export default connect(mapStateToProps, mapDispatchToProps)(Reports)
