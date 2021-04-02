import React, { Component } from 'react'
import { Popover } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import AssignForm from './AssignForm'
import * as jobCalendarActions from '../../../../actions/jobCalendarActions'
import { withRouter } from 'react-router-dom'

export class AllocateManager extends Component {

  state = {
    visible: false
  }

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  handleCancel = () => {
    this.setState({ visible: false })
  }
  
  static getDerivedStateFromProps(props, state) {
  }

  render() {
    const { event } = this.props;

    return (
      event.client_approve_status === 3
        ? <Popover
            className="calendar-popover"
            placement="bottom"
            content={
              this.state.visible ? <AssignForm
                task={event}
                handleCancel={this.handleCancel}
              /> : null
            }
            trigger="click"
            visible={this.state.visible}
            onVisibleChange={this.handleVisibleChange}
            getPopupContainer={() => document.getElementById('calenderPopover')}
          >
            {event.title}
          </Popover>
        : event.title
    )
  }
}

const mapStateToProps = (state) => {
  return {
    accountManagers: state.jobsManagement.accountManagersList
  }
}

const mapDispatchToprops = dispatch => {
  return {
    jobCalendarActions: bindActionCreators(jobCalendarActions, dispatch),
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToprops),
)(AllocateManager)
