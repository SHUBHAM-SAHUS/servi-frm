import React from 'react';
import { Icon, Menu, Progress, Tabs } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../../../utils/Validations/subscriptionValidate';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Strings } from '../../../dataProvider/localize';
import * as jobManagerAction from '../../../actions/jobMangerAction'
import { goBack, handleFocus } from '../../../utils/common';
import JobListView from './JobListView'
import moment from 'moment';
import * as userActions from '../../../actions/profileManagementActions';

const { TabPane } = Tabs;

// upload user profile pic



class JobManager extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentKey: '1',
            subscriptLevelSection: false,
            orgDetailsSection: false,
            orgUserSection: false,
            formCompletion: 0,
            panelView: true
        }
    }

    // slider script
    componentDidMount() {
        this.props.jobManagerAction.getUserJobs()
            .then(() => this.props.userActions.getLicencesType())

    }


    changeTabKey = (key) => {
        this.setState({ currentKey: key })
    }

    handlePanelView = () => {
        this.setState({ panelView: !this.state.panelView })
    }

    onSubmit = (formData) => {

    }


    render() {

        const { handleSubmit, userJobs, history, location } = this.props;
        const startingToday = [] /* userJobs.filter(job => moment(job.job_shifts[0].job_scheduled_shifts[0].shift_date).isSame(new Date, 'day')) */
        const startingWeek = []/* userJobs.filter(job => moment(job.job_shifts[0].job_scheduled_shifts[0].shift_date).isSame(new Date, 'week')) */
        const startingNxtWeek = [] /* userJobs.filter(job => moment(job.job_shifts[0].job_scheduled_shifts[0].shift_date).subtract(7, 'days').isSame(new Date, 'week')) */

        return (
            <div className="sf-page-layout">
                {/* inner header  */}
                <div className="dash-header">
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() => goBack(this.props)} />
                        Job Manager
                    </h2>
                </div>
                {/* inner header  */}
                <div className="main-container">
                    <div className="sf-card">
                        <div className="sf-card-body">
                            <div className="courses-dtls">
                                <div className="row">
                                    <div className="col-md-3">
                                        <div className="course-items">
                                            <i class="glyph-item" data-icon="&#xe052;"></i>
                                            <div className="course-value-dtl">
                                                <h2>{userJobs.length}</h2>
                                                <span>Jobs to do</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="course-items">
                                            <i class="glyph-item" data-icon="&#xe081;"></i>
                                            <div className="course-value-dtl">
                                                <h2>{startingToday.length}</h2>
                                                <span>Starting today</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="course-items">
                                            <i class="glyph-item" data-icon="&#xe081;"></i>
                                            <div className="course-value-dtl">
                                                <h2>{startingWeek.length}</h2>
                                                <span>Due this week</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="course-items">
                                            <i class="glyph-item" data-icon="&#xe081;"></i>
                                            <div className="course-value-dtl">
                                                <h2>{startingNxtWeek.length}</h2>
                                                <span>Due next week</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="courses-lists">
                                <Tabs className="fillters-courses" onChange={this.changeTabKey} type="card">
                                    <TabPane tab={<div className="tab-item">{Strings.all_txt}</div>} key="1">
                                        <JobListView displayJobs={userJobs} history location />
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item">New</div>} key="2">
                                        <JobListView displayJobs={userJobs.filter(job => job.job_status === 0)} />
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item">In Progress</div>} key="3">
                                        <JobListView displayJobs={userJobs.filter(job => job.job_status === 1 || job.job_status === 2)}
                                            history={history} location={location} />
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item">Completed</div>} key="4">
                                        <JobListView displayJobs={userJobs.filter(job => job.job_status === 3)} />
                                    </TabPane>
                                    <TabPane tab={<div className="tab-item">Rejected</div>} key="5">
                                        <JobListView displayJobs={userJobs.filter(job => job.job_shift_accept_status === 2)} />
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        userJobs: state.jobManger.userJobs,
    }
}

const mapDispatchToprops = dispatch => ({
    jobManagerAction: bindActionCreators(jobManagerAction, dispatch),
    userActions: bindActionCreators(userActions, dispatch)

})

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'jobManager', validate ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(JobManager)