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

class Induction extends React.Component {
    constructor(props) {
        super(props);
        this.state = { currentKey: '1', subscriptLevelSection: false, orgDetailsSection: false, orgUserSection: false, formCompletion: 0 }
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
            <div>
                {/* inner header  */}
                <div className="dash-header">
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() => goBack(this.props)} />
                        {Strings.induction_txt}
                    </h2>
                </div>
                {/* inner header  */}
                <div className="main-container">
                    <div className="row">
                        <div className="col-lg-9 col-md-9 col-sm-12">
                            <div className="sf-card">
                            
                            <div className="sf-card-body">

                                <div className="courses-dtls">
                                    <div className="row">

                                        <div className="col-md-4">
                                            <div className="course-items">
                                                <i class="glyph-item" data-icon="&#xe04c;"></i>
                                                <div className="course-value-dtl">
                                                    <h2>4</h2>
                                                    <span>Courses to do</span>            
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="course-items">
                                                <i class="glyph-item" data-icon="&#xe081;"></i>
                                                <div className="course-value-dtl">
                                                    <h2>2</h2>
                                                    <span>Overdue Courses</span>            
                                                </div>
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="course-items">
                                                <i class="glyph-item" data-icon="&#xe028;"></i>
                                                <div className="course-value-dtl">
                                                    <h2>1</h2>
                                                    <span>Completed Course</span>            
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                <div className="courses-lists">
                                <Tabs className="fillters-courses" onChange={this.changeTabKey} type="card">
                                    <TabPane tab={<div className="tab-item">{Strings.all_txt}</div>} key="1">
                                    <div className="sf-course-wrap">
                                       <div className="row">

                                           <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                               <div className="sf-courses">
                                                   <div className="cors-img">
                                                       <img src="../images/course-1.png"/>
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
                                                       <img src="../images/course-2.png"/>
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
                                                       <img src="../images/course-1.png"/>
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
                                           <div className="col-lg-3 col-md-4 col-sm-6 col-xs-12">
                                               <div className="sf-courses">
                                                   <div className="cors-img">
                                                       <img src="../images/course-2.png"/>
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
                                                       <img src="../images/course-1.png"/>
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
                                                       <img src="../images/course-2.png"/>
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
                                                       <img src="../images/course-1.png"/>
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
                                                       <img src="../images/course-2.png"/>
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


                                       </div>
                                            <Pagination className="sf-pagination" defaultCurrent={1} total={10} />
                                       </div>

                                    </TabPane>

                                    <TabPane tab={<div className="tab-item">{Strings.tab_payroll_dtl}</div>} key="2">
                                       
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item">{Strings.tab_licences}</div>} key="3">
                                       
                                    </TabPane>
                                </Tabs>
                                </div>
                                </div>


                            </div>
                        </div>



                        {/* ---------------------------- 
                                Right section
                        ---------------------------- */}

                        {/* user prifile pic and status */}

                        <div className="col-lg-3 col-md-3 col-sm-12">
                
                            {/* view user profile pic and content */}
                            <div className="sf-card">
                                <div className="user-profile-card">
                                    <div className="profile-pic ovhdn"><img src="/images/tony.png" /></div>
                                    <h5 className="user-title">Brett Sue <span>brett.sue@contraxct.com</span></h5>
                                </div>
                                <div className="usr-pro-body">
                                    <h3>Areas of Expertise</h3>
                                    <ul className="exp-details">
                                        <li>
                                            <span>Carpet Cleaning</span>
                                            <span>100 Hours</span>
                                        </li>
                                        <li>
                                            <span>Window Cleaning</span>
                                            <span>230 Hours</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="usr-pro-footer">
                                    <div className="pro-status">
                                        <strong>Jobs Completed</strong>
                                        <span>100</span>
                                    </div>
                                    <div className="pro-status">
                                        <strong>Last Online</strong>
                                        <span>2 days ago</span>
                                    </div>
                                </div>

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
    reduxForm({ form: 'Induction', validate ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(Induction)