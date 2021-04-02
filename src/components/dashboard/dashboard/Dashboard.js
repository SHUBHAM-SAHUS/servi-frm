import React from 'react';
import { Icon, Modal, Button, Progress } from 'antd';
import { getFormSyncErrors } from 'redux-form';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, FIRST_TIME_LOGIN } from '../../../dataProvider/constant'
import { goBack } from '../../../utils/common';
import { getStorage, setStorage } from '../../../utils/common'
import { connect } from 'react-redux';
import $ from 'jquery';
import { bindActionCreators } from 'redux';
import * as actions from '../../../actions/profileManagementActions';
import * as trainingAction from '../../../actions/inductionTrainingAction';
import Profile from '../profile/Profile';
import { Route } from 'react-router-dom';
import { messaging } from '../../../init-fcm'

import * as action from '../../../actions';
class DashBoard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stepsLeft: 0,
            userLicencesSection: false,
            userDetailsSection: false,
            userPayrollSection: false,
            userMedicalSection: false,
            userRosteringSection: false,
            userInductionTrainingSection: false,
        }
        if (getStorage(FIRST_TIME_LOGIN) == 1) {
            this.state = { visible: true };
        }
        else
            this.state = { visible: false };

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
        this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name)
            .then(res => {
                if (res) {
                    this.setProgress()
                }
            });
        const page = 1
        this.props.trainingAction.getCourses(page)
            .then(res => {
                if (res) {
                    this.setProgress()
                }
            });
    }

    // Video Tutorial popup Modal

    componentDidMount() {
        let message = '';

        const adminDetails = JSON.parse(getStorage(ADMIN_DETAILS))
        this.role = adminDetails && adminDetails.role && adminDetails.role.role_id;
        try {
            if (messaging) {
                messaging.requestPermission()
                    .then(async () => {
                        const tokenFirst = await messaging.getToken();
                        // console.log(token);
                        const tokenSecond = await messaging.getToken();

                        const data = {};
                        data.role_id = this.role;
                        data.token = tokenSecond;
                        this.props.action.allowNotification(data)
                            .then(res => {

                            })
                            .catch(err => {
                                console.log(err)
                            })
                    })
                    .then(res => {

                    })
                    .catch(function (err) {
                        console.log("Unable to get permission to notify.", err);
                    });

                navigator.serviceWorker.addEventListener("message", (message) => console.log(message));
            }
        } catch (err) {

        }



        // messaging.onMessage((payload) => console.log('Message received. ', payload));



        this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name)
            .then(res => {
                if (res) {
                    this.setProgress()
                }
            });
        const page = 1
        this.props.trainingAction.getCourses(page)
            .then(res => {
                if (res) {
                    this.setProgress()
                }
            });
    }

    componentDidUpdate(prevProps, prevState) {

        // const { profile } = this.props
        // const profile_progress = (profile && profile.profile_progress) ? profile.profile_progress : 0;

        // $('.ant-progress-bg').html('<span class="ant-progress-text d-block">' + profile_progress + '%</span>');

        const { profileProgress } = this.props
        const profile_progress = profileProgress ? profileProgress : 0;

        $('.ant-progress-bg').html('<span class="ant-progress-text d-block">' + profile_progress + '%</span>');
    }

    showModal = () => {
        this.setState({
            visible: true,
        });
    };

    handleOk = e => {
        this.setState({
            visible: false,
        });
    };

    setProgress = () => {
        const profile = this.props.profile && this.props.profile[0]

        var stepsLeft = 6
        this.setState({
            stepsLeft: stepsLeft,
        })

        if (profile && profile.name && profile.last_name && profile.date_of_birth
            && profile.gender && profile.email_address && profile.phone_number && profile.email_address) {
            stepsLeft--
            this.setState({
                stepsLeft: stepsLeft,
                userDetailsSection: true
            })
        }
        if (profile && profile.payroll_details) {
            stepsLeft--
            this.setState({
                stepsLeft: stepsLeft,
                userPayrollSection: true
            })
        }
        if (profile && profile.licences && profile.licences) {
            stepsLeft--
            this.setState({
                stepsLeft: stepsLeft,
                userLicencesSection: true
            })
        }
        if (profile && profile.medical_declarations) {
            stepsLeft--
            this.setState({
                stepsLeft: stepsLeft,
                userMedicalSection: true
            })
        }
        if (profile && profile.rostering) {
            stepsLeft--
            this.setState({
                stepsLeft: stepsLeft,
                userRosteringSection: true
            })
        }
        if (this.props.one_course_completed) {
            stepsLeft--
            this.setState({
                stepsLeft: stepsLeft,
                userInductionTrainingSection: true
            })
        }
    }

    handleCancel = e => {
        this.setState({
            visible: false,
        });
    };

    handleSendNotification = () => {
        try {
            if (messaging) {
                messaging.onMessage((payload) => {
                });
                messaging.onTokenRefresh(() => {
                    messaging.getToken()
                        .then((refreshedToken) => {
                            console.log('Token refreshed.');
                            // tokenElement.innerHTML = "Token is " + refreshedToken;
                        }).catch((err) => {
                            // errorElement.innerHTML = "Error: " + err;
                            console.log('Unable to retrieve refreshed token ', err);
                        });
                });
            }
        } catch (err) {

        }


    }

    render() {
        const { profileProgress, profile, one_course_completed } = this.props

        return (
            <div className="sf-page-layout">
                {/* inner header  */}
                <div className="dash-header">
                    <h2 className="page-mn-hd"><Icon type="arrow-left" onClick={() => goBack(this.props)} /> {Strings.ddash_title}</h2>
                    <div className="progress-dtl">
                        <div className="pro-hd">
                            <h3>Progress</h3>
                            <strong className="dash-steps">
                                <b>{profileProgress === 100 ? 0 : this.state.stepsLeft}</b>
                                <span>{this.state.stepsLeft === 1 || this.state.stepsLeft === 0 ? "Step Left" : "Steps Left"}</span>
                            </strong>
                        </div>
                        <div className="steps-progress">
                            <Progress percent={profileProgress} strokeWidth={14} strokeColor={'#03A791'} />
                        </div>
                    </div>
                    <div class="oh-cont">
                        <button className="bnt bnt-active" onClick={this.showModal}>{Strings.dd_intro_btn}</button>
                    </div>
                    <button className="normal-bnt" onClick={() => this.handleSendNotification()}>{"Send Notification"}</button>

                </div>
                {/* inner header  */}

                <div className="main-container">
                    <h3 className="dashb-heading">{Strings.dd_welcome_lg_hd}
                        {this.props && this.props.profile[0] && this.props.profile[0].name ?
                            this.props.profile[0].name + " " + (this.props.profile[0].last_name ? this.props.profile[0].last_name : "") : null
                        }</h3>
                    <div className="sf-card p-4">
                        <div className="sf-card-head sf-dashb">
                            <h4>{Strings.dd_letsget_sm_hd}</h4>
                            <p>{Strings.dd_pls_sure_para}</p>
                            <button class="closed-btn"><Icon type="close" /></button>
                        </div>

                        <div className="row">

                            <div className="col-md-4 col-sm-6">
                                {this.state.userDetailsSection ?
                                    <div className="sf-card sf-dash-items active">
                                        <i class="fa fa-check-circle"></i>
                                        <h5>Set up your Profile</h5>
                                        <p>Hi {this.props && this.props.profile[0] && this.props.profile[0].name ?
                                            this.props.profile[0].name : " "}, help us serve you better. Start here and tell us more about yourself and your experience!</p>
                                    </div>
                                    :
                                    <div className="sf-card sf-dash-items" onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: { ...this.props.location.state, key: "1" } })}>
                                        <i class="anticon material-icons">description</i>
                                        <h5>Set up your Profile</h5>
                                        <p>Hi {this.props && this.props.profile[0] && this.props.profile[0].name ?
                                            this.props.profile[0].name : " "}, help us serve you better. Start here and tell us more about yourself and your experience!</p>
                                    </div>
                                }
                            </div>

                            <div className="col-md-4 col-sm-6">
                                {this.state.userPayrollSection ?
                                    <div className="sf-card sf-dash-items active">
                                        <i class="fa fa-check-circle"></i>
                                        <h5>Set up your Payroll Details</h5>
                                        <p>Set here your Banking, Tax and Super Fund details.</p>
                                    </div>
                                    :
                                    <div className="sf-card sf-dash-items" onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: { ...this.props.location.state, key: "2" } })}>
                                        <i class="material-icons">attach_money</i>
                                        <h5>Set up your Payroll Details</h5>
                                        <p>Set here your Banking, Tax and Super Fund details.</p>
                                    </div>
                                }
                            </div>

                            <div className="col-md-4 col-sm-6">
                                {this.state.userLicencesSection ?
                                    <div className="sf-card sf-dash-items active">
                                        <i class="fa fa-check-circle"></i>
                                        <h5>Upload your Licences/Certificates</h5>
                                        <p>Add and upload Licenses and Certificates details.</p>
                                    </div>
                                    :
                                    <div className="sf-card sf-dash-items" onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: { ...this.props.location.state, key: "3" } })}>
                                        <i class="anticon material-icons">perm_contact_calendar</i>
                                        <h5>Upload your Licences/Certificates</h5>
                                        <p>Add and upload Licenses and Certificates details.</p>
                                    </div>
                                }
                            </div>

                            <div className="col-md-4 col-sm-6">
                                {this.state.userMedicalSection ?
                                    <div className="sf-card sf-dash-items active">
                                        <i class="fa fa-check-circle"></i>
                                        <h5>Sign your Medical Declaration</h5>
                                        <p>We want to make sure you are able to undertake the type of work we do. Read the information carefully and complete the form.</p>
                                    </div>
                                    :
                                    <div className="sf-card sf-dash-items" onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: { ...this.props.location.state, key: "4" } })}>
                                        <i class="material-icons">healing</i>
                                        <h5>Sign your Medical Declaration</h5>
                                        <p>We want to make sure you are able to undertake the type of work we do. Read the information carefully and complete the form.</p>
                                    </div>
                                }
                            </div>

                            <div className="col-md-4 col-sm-6">
                                {this.state.userRosteringSection ?
                                    <div className="sf-card sf-dash-items active">
                                        <i class="fa fa-check-circle"></i>
                                        <h5>Set up your Rostering</h5>
                                        <p>Provide for more information on our working schedules and let us know when and how often you are available to undertake jobs for us.</p>
                                    </div>
                                    :
                                    <div className="sf-card sf-dash-items" onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: { ...this.props.location.state, key: "5" } })}>
                                        <i class="material-icons">event_note</i>
                                        <h5>Set up your Rostering</h5>
                                        <p>Provide for more information on our working schedules and let us know when and how often you are available to undertake jobs for us.</p>
                                    </div>
                                }
                            </div>

                            <div className="col-md-4 col-sm-6">
                                {this.state.userInductionTrainingSection ?
                                    <div className="sf-card sf-dash-items active">
                                        <i class="fa fa-check-circle"></i>
                                        <h5>Complete your Induction</h5>
                                        <p>Before you can start working, you need more info on how we do things around here. Enter here to complete your Induction and Training modules.</p>
                                    </div>
                                    :
                                    <div className="sf-card sf-dash-items" onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: { ...this.props.location.state, key: "6" } })}>
                                        <i class="material-icons">chrome_reader_mode</i>
                                        <h5>Complete your Induction</h5>
                                        <p>Before you can start working, you need more info on how we do things around here. Enter here to complete your Induction and Training modules.</p>
                                    </div>
                                }
                            </div>

                        </div>

                    </div>

                </div>

                {/* Dashboard Module yet to be determined */}

                <div className="main-container dash-dtrmind d-none">
                    <h3 className="dashb-heading text-left">{Strings.dd_welcome_lg_hd}
                        {this.props && this.props.profile[0] && this.props.profile[0].name ?
                            this.props.profile[0].name + " " + (this.props.profile[0].last_name ? this.props.profile[0].last_name : "") : null
                        }</h3>

                    <div className="row">
                        <div className="col-lg-9 col-md-9 col-sm-12">
                            <div className="sf-card dash-dtrmn-card p-4">
                                <h1 className="dtrmin-hd">Dashboard modules yet to be determined</h1>
                            </div>
                        </div>

                        <div className="col-lg-3 col-md-3 col-sm-12">
                            <div className="sf-card">

                                <div className="sf-card-body">
                                    <div className="progress-dtl">
                                        <div className="pro-hd">
                                            <h3>Progress</h3>
                                            <strong className="dash-steps">
                                                <b>{this.state.stepsLeft}</b>
                                                <span>Steps Left</span>
                                            </strong>
                                        </div>
                                        <div className="steps-progress">
                                            <Progress percent={profileProgress} strokeWidth={14} strokeColor={'#03A791'} />
                                        </div>
                                        <ul className="steps-lists">
                                            {profile && profile.name && profile.last_name && profile.date_of_birth
                                                && profile.gender && profile.email_address && profile.phone_number && profile.email_address
                                                ?
                                                <li className="active" >
                                                    <i class="fa fa-check-circle"></i>
                                                    <span>
                                                        Set up your profile
                                                    </span>
                                                </li>
                                                :
                                                <li onClick={() => this.props.history.push('/dashboard/profile')}>
                                                    <i class="fa fa-check-circle"></i>
                                                    <span>Set up your profile</span>
                                                </li>
                                            }
                                            {profile && profile.payroll_details ?
                                                <li className="active" >
                                                    <i className="fa fa-check-circle"></i>
                                                    <span>Set up your payroll details</span>
                                                </li>
                                                :
                                                <li onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: "2" })}>
                                                    <i className="fa fa-check-circle"></i>
                                                    <span>Set up your payroll details</span>
                                                </li>
                                            }
                                            {profile && profile.licences ?
                                                <li className="active" >
                                                    <i className="material-icons">perm_contact_calendar</i>
                                                    <span>Upload your licences / certificates</span>
                                                </li>
                                                :
                                                <li onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: "3" })}>
                                                    <i className="material-icons">perm_contact_calendar</i>
                                                    <span>Upload your licences / certificates</span>
                                                </li>
                                            }
                                            {profile && profile.medical_declarations ?
                                                <li className="active">
                                                    <i className="material-icons">healing</i>
                                                    <span>Sign your medical declaration</span>
                                                </li>
                                                :
                                                <li onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: "4" })}>
                                                    <i className="material-icons">healing</i>
                                                    <span>Sign your medical declaration</span>
                                                </li>
                                            }
                                            {profile && profile.rostering ?
                                                <li className="active">
                                                    <i className="material-icons">event_note</i>
                                                    <span>Set up your rostering</span>
                                                </li>
                                                :
                                                <li onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: "5" })}>
                                                    <i className="material-icons">event_note</i>
                                                    <span>Set up your rostering</span>
                                                </li>
                                            }
                                            {one_course_completed ?
                                                <li className="active">
                                                    <i className="material-icons">chrome_reader_mode</i>
                                                    <span>Complete your induction</span>
                                                </li>
                                                :

                                                <li onClick={() => this.props.history.push({ pathname: '/dashboard/profile', state: "6" })}>
                                                    <i className="material-icons">chrome_reader_mode</i>
                                                    <span>Complete your induction</span>
                                                </li>
                                            }
                                        </ul>

                                    </div>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>


                <Modal className="sf-intro-modal" width="800px" title={
                    <div className="sf-modal-hd"><h3 className="dashb-heading">{Strings.dd_welcome_lg_hd}
                        {
                            this.props && this.props.profile[0] && this.props.profile[0].name ?
                                this.props.profile[0].name + " " + (this.props.profile[0].last_name ? this.props.profile[0].last_name : "") : null
                        }</h3>
                        <p>{Strings.dd_mpdal_para}</p></div>
                }
                    visible={this.state.visible} onOk={this.handleOk} onCancel={this.handleCancel}>
                    <div className="intro-video">
                        {/* <iframe src="https://player.vimeo.com/video/1084537" width="100%" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe> */}
                        <iframe src="https://dev-sf-store.s3-ap-southeast-2.amazonaws.com/intro-video/Service-Farm-Infographic-5.mp4" width="100%" height="400" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>
                    </div>
                </Modal>

            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profileProgress: state.profileManagement && state.profileManagement.profileProgress,
        one_course_completed: state.inductionTraining && state.inductionTraining.one_course_completed,
        profile: state.profileManagement && state.profileManagement.profile,
        profileImageUrl: state.profileManagement && state.profileManagement.profileImageUrl,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(actions, dispatch),
        trainingAction: bindActionCreators(trainingAction, dispatch),
        action: bindActionCreators(action, dispatch),
        resetStore: () => dispatch({ type: 'USER_LOGOUT' })
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(DashBoard)
