import React from 'react';
import { Icon, Dropdown, Pagination, Menu, Progress, Tabs, Upload, message, Button } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../../../utils/Validations/subscriptionValidate';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import { customTextarea } from '../../common/customTextarea';
import * as actions from '../../../actions/organizationAction';
import { Strings } from '../../../dataProvider/localize';
import { CustomCheckbox } from '../../../components/common/customCheckbox';
import { CustomDatepicker } from '../../common/customDatepicker';
import $ from 'jquery';

import PersonalDetails from './PersonalDetails';
import ViewPersonalDetails from './ViewPersonalDetails';
import PayrollDetails from './PayrollDetails';
import Licences from './Licences';
import MedicalDeclaration from './MedicalDeclaration';
import Rostering from './Rostering';
import { goBack, handleFocus } from '../../../utils/common'

const { TabPane } = Tabs;
const Dragger = Upload.Dragger;

// upload user profile pic

const props = {
    name: 'file',
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

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
    }


    changeTabKey = (key) => {
        this.setState({ currentKey: key })
    }

    dynamicTabContent = () => {
        if (this.state.currentKey === '1') {
            return null
        }
        else
            return null;
    }

    handlePanelView = () => {
        this.setState({ panelView: !this.state.panelView })
    }

    onSubmit = (formData) => {

    }

    // more info
    editMenu = (
        <Menu>
            <Menu.Item onClick={this.handleEditClick}>{Strings.menu_edit_org}</Menu.Item>
        </Menu>
    )

    render() {

        const { handleSubmit } = this.props;

        return (
            <div className="sf-page-layout">
                {/* inner header  */}
                <div className="dash-header">
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() => goBack(this.props)} />
                        {Strings.induction_txt}
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
                                                <h2>4</h2>
                                                <span>Jobs to do</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="course-items">
                                            <i class="glyph-item" data-icon="&#xe081;"></i>
                                            <div className="course-value-dtl">
                                                <h2>2</h2>
                                                <span>Starting today</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="course-items">
                                            <i class="glyph-item" data-icon="&#xe081;"></i>
                                            <div className="course-value-dtl">
                                                <h2>1</h2>
                                                <span>Due this week</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-3">
                                        <div className="course-items">
                                            <i class="glyph-item" data-icon="&#xe081;"></i>
                                            <div className="course-value-dtl">
                                                <h2>1</h2>
                                                <span>Due next week</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="courses-lists">
                                <Tabs className="fillters-courses" onChange={this.changeTabKey} type="card">
                                    <TabPane tab={<div className="tab-item">{Strings.all_txt}</div>} key="1">
                                        <div className="job-manager-wrap">

                                            {/* job status and other.. */}
                                            <div className="job-status-lists">
                                                <div className="job-mr-head d-flex justify-content-between">
                                                    <div className="col job-mr-w">
                                                        <div className="jobmr-status">
                                                            <div className="sts-circle">
                                                                <span>Not</span>
                                                                started
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col job-dtl-w">
                                                        <div className="job-mr-details">
                                                            <h2 className="job-name-id">RMIT Tender, Job # JHC921XP1902</h2>
                                                            <div className="job-mr-time">
                                                                <span><i className="fa fa-calendar"></i> 10-03-2019</span>
                                                                <span><i className="fa fa-clock-o"></i> 08:00 AM</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col job-act-w">
                                                        <button type="button" onClick={this.handlePanelView} className="normal-bnt open-job-bnt"><i class="material-icons">keyboard_arrow_down</i></button>
                                                        <div className="job-action-area">
                                                            <span>Job Starts In:</span>
                                                            <strong>09:59:36</strong>
                                                            <button type="button" className="bnt bnt-normal">Start Job</button>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* show hide this section when click the down arrow button */}
                                                <div className={this.state.panelView ? "job-mr-body" : "job-mr-body d-none"}>
                                                    <div className="row">
                                                        <div className="col-md-10 job-reports-wrap">
                                                            <div className="sf-card has-shadow">
                                                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                                                    <h2 className="sf-pg-heading">Service Details</h2>
                                                                    <div className="info-btn disable-dot-menu">
                                                                        <Dropdown className="more-info" disabled>
                                                                            <i className="material-icons">more_vert</i>
                                                                        </Dropdown>
                                                                    </div>
                                                                </div>
                                                                <div className="sf-card-body">
                                                                    <div className="data-v-row">
                                                                        <div className="data-v-col">
                                                                            <div className="view-text-value">
                                                                                <label>Job Name</label>
                                                                                <span>RMIT Tender</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="data-v-col">
                                                                            <div className="view-text-value">
                                                                                <label>Site Name</label>
                                                                                <span>Smith Co.</span>
                                                                            </div>
                                                                        </div>
                                                                        <div className="data-v-col">
                                                                            <div className="view-text-value">
                                                                                <label>Address</label>
                                                                                <span>200 Sydney Road, Victoria 3022</span>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                    <div className="service-table">
                                                                        <div className="sf-job-doc-bg sAgent-calnd-row">
                                                                            <div className="data-v-row">
                                                                                <div className="data-v-col">
                                                                                    <div className="view-text-value">
                                                                                        <label>Roof Cleaning</label>
                                                                                        <span>Lorem ipsum dolor sit amet, conse adipiscing elit, dolor sit amet, conse adipiscing elit</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="data-v-col">
                                                                                    <div className="view-text-value">
                                                                                        <label>Area</label>
                                                                                        <span>Gymnasium, Kitchen</span>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div className="data-v-row sAgent-note justify-content-between">
                                                                                <div className="data-v-col">
                                                                                    <div className="view-text-value">
                                                                                        <label>Notes</label>
                                                                                        <span>Lorem ipsum dolor sit amet, conse adipiscing elit, dolor sit amet, conse adipiscing elit</span>
                                                                                    </div>
                                                                                </div>
                                                                                <div className="job-note-pic">
                                                                                    <img src="[object Object]" alt="img" />
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>

                                                            <div className="sf-card has-shadow mt-3">
                                                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                                                    <h2 className="sf-pg-heading">Licences</h2>
                                                                    <div className="info-btn disable-dot-menu">
                                                                        <Dropdown className="more-info" disabled>
                                                                            <i className="material-icons">more_vert</i>
                                                                        </Dropdown>
                                                                    </div>
                                                                </div>
                                                                <div className="sf-card-body">
                                                                    {/* slider */}
                                                                    <div id="licencesSlider" class="carousel slide" data-interval="false" data-ride="carousel">
                                                                        <div class="carousel-inner">
                                                                            <div class="carousel-item active">
                                                                                <div className="licence-slider row">
                                                                                    <div className="col-md-3">
                                                                                        <div className="licence-list">
                                                                                            <img src="../images/licence-pic.png" />
                                                                                            <div className="li-details">
                                                                                                <h3>Drivers Licence</h3>
                                                                                                <ul className="li-lists">
                                                                                                    <li><span>Number:</span> 234324</li>
                                                                                                    <li><span>Issued By:</span> GOVT</li>
                                                                                                    <li><span>Issue Date:</span> 25/09/2019</li>
                                                                                                    <li><span>Expiry Date:</span> 25/12/2019</li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="licence-list">
                                                                                            <img src="../images/licence-pic.png" />
                                                                                            <div className="li-details">
                                                                                                <h3>Drivers Licence</h3>
                                                                                                <ul className="li-lists">
                                                                                                    <li><span>Number:</span> 234324</li>
                                                                                                    <li><span>Issued By:</span> GOVT</li>
                                                                                                    <li><span>Issue Date:</span> 25 09 2019</li>
                                                                                                    <li><span>Expiry Date:</span> 25/12/2019</li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="licence-list">
                                                                                            <img src="../images/licence-pic.png" />
                                                                                            <div className="li-details">
                                                                                                <h3>Drivers Licence</h3>
                                                                                                <ul className="li-lists">
                                                                                                    <li><span>Number:</span> 234324</li>
                                                                                                    <li><span>Issued By:</span> GOVT</li>
                                                                                                    <li><span>Issue Date:</span> 25 09 2019</li>
                                                                                                    <li><span>Expiry Date:</span> 25/12/2019</li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                    <div className="col-md-3">
                                                                                        <div className="licence-list">
                                                                                            <img src="../images/licence-pic.png" />
                                                                                            <div className="li-details">
                                                                                                <h3>Drivers Licence</h3>
                                                                                                <ul className="li-lists">
                                                                                                    <li><span>Number:</span> 234324</li>
                                                                                                    <li><span>Issued By:</span> GOVT</li>
                                                                                                    <li><span>Issue Date:</span> 25 09 2019</li>
                                                                                                    <li><span>Expiry Date:</span> 25/12/2019</li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                            <div class="carousel-item">
                                                                                <div className="licence-slider row">
                                                                                    <div className="col-md-3">
                                                                                        <div className="licence-list">
                                                                                            <img src="../images/licence-pic.png" />
                                                                                            <div className="li-details">
                                                                                                <h3>Drivers Licence</h3>
                                                                                                <ul className="li-lists">
                                                                                                    <li><span>Number:</span> 234324</li>
                                                                                                    <li><span>Issued By:</span> GOVT</li>
                                                                                                    <li><span>Issue Date:</span> 25 09 2019</li>
                                                                                                    <li><span>Expiry Date:</span> 25/12/2019</li>
                                                                                                </ul>
                                                                                            </div>
                                                                                        </div>
                                                                                    </div>
                                                                                </div>
                                                                            </div>
                                                                        </div>
                                                                        <div className="slider-nav">
                                                                            <a class="carousel-control-prev" href="#licencesSlider" role="button" data-slide="prev">
                                                                                <i class="material-icons" aria-hidden="true">keyboard_arrow_left</i>
                                                                            </a>
                                                                            <a class="carousel-control-next" href="#licencesSlider" role="button" data-slide="next">
                                                                                <i class="material-icons" aria-hidden="true">keyboard_arrow_right</i>
                                                                            </a>
                                                                        </div>
                                                                    </div>

                                                                    {/* slider */}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        {/* Right panel:  All Tools  */}
                                                        <div className="col-md-2 reports-tools">
                                                            <div className="sf-card sf-shadow">
                                                                <div className="sf-card-body px-0">
                                                                    <div className="jobs-detail-tools">
                                                                        <div className="tools-lists">
                                                                            <button className="tools-items normal-bnt color-1">
                                                                                <i className="sficon sf-sign-swms"></i>
                                                                                <span>sign swms</span>
                                                                            </button>
                                                                            <button className="tools-items normal-bnt color-3">
                                                                                <i class="fa fa-file-text-o"></i>
                                                                                <span>JOB REPORT</span>
                                                                            </button>
                                                                            <button className="tools-items normal-bnt color-4">
                                                                                <i class="fa fa-scissors"></i>
                                                                                <span>HAZARD REPORT</span>
                                                                            </button>
                                                                            <button className="tools-items normal-bnt color-5">
                                                                                <i className="sficon sf-incident-report"></i>
                                                                                <span>INCIDENT REPORT</span>
                                                                            </button>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* job started */}
                                            <div className="job-status-lists job-started-list">
                                                <div className="job-mr-head d-flex justify-content-between">
                                                    <div className="col job-mr-w">
                                                        <div className="jobmr-status jb-started-status">
                                                            <div className="sts-circle">
                                                                <span><i class="fa fa-hourglass-start"></i></span>
                                                                STARTED
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col job-dtl-w">
                                                        <div className="job-mr-details">
                                                            <h2 className="job-name-id">RMIT Tender, Job # JHC921XP1902</h2>
                                                            <div className="job-mr-time">
                                                                <span><i className="fa fa-calendar"></i> 10-03-2019</span>
                                                                <span><i className="fa fa-clock-o"></i> 08:00 AM</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col job-act-w">
                                                        <div className="job-action-area">
                                                            <button type="button" className="normal-bnt open-job-bnt"><i class="material-icons">keyboard_arrow_down</i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* job request list display here */}
                                            <div className="job-status-lists job-request-box">
                                                <div className="job-mr-head d-flex justify-content-between">
                                                    <div className="col job-mr-w">
                                                        <div className="jobmr-status jb-request-status">
                                                            <div className="sts-circle">
                                                                <span>2h</span>
                                                                30 min
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col job-dtl-w">
                                                        <div className="job-mr-details">
                                                            <h2 className="job-name-id">RMIT Tender, Job # JHC921XP1902</h2>
                                                            <div className="job-mr-time">
                                                                <span><i className="fa fa-calendar"></i> 10-03-2019</span>
                                                                <span><i className="fa fa-clock-o"></i> 08:00 AM</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col job-act-w">
                                                        <div className="job-action-area">
                                                            <button type="button" className="bnt bnt-active">
                                                                <i class="fa fa-thumbs-o-up"></i>Yeah, Accept!</button>
                                                            <button type="button" className="bnt bnt-normal">
                                                                <i class="fa fa-thumbs-o-down"></i>Not Interested</button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                        <div className="d-none sf-card has-shadow">
                                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                                <h2 className="sf-pg-heading">Inductions Required</h2>
                                                <div className="info-btn disable-dot-menu">
                                                    <Dropdown className="more-info" disabled>
                                                        <i className="material-icons">more_vert</i>
                                                    </Dropdown>
                                                </div>
                                            </div>
                                            <div className="sf-card-body mt-2">
                                                <div className="sf-course-wrap">
                                                    <div className="row">
                                                        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                            <div className="sf-courses">
                                                                <div className="cors-img">
                                                                    <img src="../images/course-1.png" />
                                                                </div>
                                                                <div className="cors-contnt">
                                                                    <h4>Workplace Induction Training</h4>
                                                                    <div className="sfc-progbr">
                                                                        <Progress strokeWidth={4} strokeColor={"#03A791"} percent={25} /> <span className="prnt-txt">Completed</span>
                                                                    </div>
                                                                    <span className="sfc-total-time"><Icon type="clock-circle" /> 2h 15m</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                            <div className="sf-courses">
                                                                <div className="cors-img">
                                                                    <img src="../images/course-2.png" />
                                                                </div>
                                                                <div className="cors-contnt">
                                                                    <h4>Workplace Induction Training</h4>
                                                                    <div className="sfc-progbr">
                                                                        <Progress strokeWidth={4} strokeColor={"#03A791"} percent={25} /> <span className="prnt-txt">Completed</span>
                                                                    </div>
                                                                    <span className="sfc-total-time"><Icon type="clock-circle" /> 2h 15m</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                                            <div className="sf-courses">
                                                                <div className="cors-img">
                                                                    <img src="../images/course-1.png" />
                                                                </div>
                                                                <div className="cors-contnt">
                                                                    <h4>Workplace Induction Training</h4>
                                                                    <div className="sfc-progbr">
                                                                        <Progress strokeWidth={4} strokeColor={"#03A791"} percent={0} /> <span className="prnt-txt">Completed</span>
                                                                    </div>
                                                                    <span className="sfc-total-time"><Icon type="clock-circle" /> 2h 15m</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item">New</div>} key="2">
                                        <h1>New Job</h1>
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item">In Progress</div>} key="3">
                                        <h1>In Progress Job</h1>
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item">Completed</div>} key="4">
                                        <h1>Completed</h1>
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

    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'jobManager', validate ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(JobManager)