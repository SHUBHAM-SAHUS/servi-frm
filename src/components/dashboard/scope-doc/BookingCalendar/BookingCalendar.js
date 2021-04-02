import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux';
import { notification } from 'antd';
import * as scopeDocActions from '../../../../actions/scopeDocActions'

import * as bookingCalendarActions from '../../../../actions/bookingCalendarActions'

import CoreCalendar from './CoreCalendar/CoreCalendar'

export class BookingCalendar extends Component {
    state = {
        view: 'MONTH',
        selectedTasks: [],
        selectedForDisapproval: []
    }

    componentDidMount() {
        this.props.actions.getBookedJobsList(this.props.quoteDetails)
            .then(res => {

            })
            .catch(err => {
                notification.error({
                    message: "Error!",
                    description: "Could not fetch jobs",
                    onClick: () => { },
                    className: 'ant-error'
                });
            })
    }

    handleTaskSelection = (taskId, jobId) => {
        if (jobId) {
            const selectedForDisapproval = [...this.state.selectedForDisapproval]
            const found = selectedForDisapproval.findIndex(task => task === taskId)
            if (found === -1) {
                selectedForDisapproval.push(taskId)
            }
            this.setState({ selectedForDisapproval })
            this.props.actions.selectTasksForDisapproval(jobId, selectedForDisapproval)
            return
        } else {
            const selectedTasks = [...this.state.selectedTasks];
            const found = selectedTasks.findIndex(task => task === taskId)
            if (found === -1) {
                selectedTasks.push(taskId)
            }
            this.setState({ selectedTasks })
        }
    }

    clearBookedTasks = () => {
        this.setState({ selectedTasks: [], selectedForDisapproval: [] })
        this.props.actions.clearTasksForDisapproval()
    }

    static getDerivedStateFromProps(props, state) {

    }

    handleCreateJob = () => {
        this.props.actions.createJob(this.props.quoteId, this.state.selectedTasks)
            .then(res => {
                this.clearBookedTasks()
                this.props.actions.getBookedJobsList(this.props.quoteDetails)
            })
            .then(res => {
                this.props.scopeDocActions.getScopeDoc()
            })
            .then(() => {
                notification.success({
                    message: "Success!",
                    description: "Job Created Successfully",
                    onClick: () => { },
                    className: 'ant-success'
                });
            })
            .catch(err => {

            })
    }

    handleUpdateJob = () => {
        this.props.actions.updateJob(this.props.quoteId, this.state.selectedForDisapproval)
            .then(() => {
                this.props.actions.getBookedJobsList(this.props.quoteDetails)
            })
            .then(() => {
                this.props.scopeDocActions.getScopeDoc()
            })
            .then(() => {
                notification.success({
                    message: "Success!",
                    description: "Job Updated Successfully",
                    onClick: () => { },
                    className: 'ant-success'
                });
            })
            .catch(err => {
                notification.error({
                    message: "Error!",
                    description: "Could not update job",
                    onClick: () => { },
                    className: 'ant-error'
                });
            })
    }

    render() {
        return (
            <>
                <div className="row status-bnt">
                    <button type="button" className="reset" onClick={this.props.onGoBack}>Back to Quote</button>
                    <button type="button" className="reset" onClick={this.clearBookedTasks}>Clear Selection</button>
                    <button type="button" className="reset update-job" onClick={this.handleUpdateJob} disabled={this.state.selectedForDisapproval.length === 0}>Update Job</button>
                    <button type="button" className="reset create-job" onClick={this.handleCreateJob} disabled={this.state.selectedTasks.length === 0}>Create Job</button>
                </div>
                <div className="row">
                    <div className="sf-card sf-shadow booking-calendar-container">
                        <div className="sf-card-body p-0">
                            <div className="job-calendar-view">
                                <CoreCalendar
                                    view={this.state.view}
                                    searchString={this.state.searchString}
                                    onEventSelect={this.handleTaskSelection}
                                    selectedTasks={this.state.selectedTasks}
                                    selectedForDisapproval={this.state.selectedForDisapproval}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const mapStateToProps = (state) => ({
    jobs: state.bookingCalendar.jobsList,
})

const mapDispatchToProps = dispatch => ({
    actions: bindActionCreators(bookingCalendarActions, dispatch),
    scopeDocActions: bindActionCreators(scopeDocActions, dispatch)
})

export default connect(mapStateToProps, mapDispatchToProps)(BookingCalendar)
