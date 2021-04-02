import React from 'react';
import { Icon, Modal, Upload, Dropdown, Menu, notification, Pagination, Tabs, Empty } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';

import * as actions from '../../../actions/inductionTrainingAction';
import * as profileActions from '../../../actions/profileManagementActions';

import { Strings } from '../../../dataProvider/localize';
import $ from 'jquery';
import ShowInductionDetails from './ShowInductionDetails';
import { getStorage } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';

const { TabPane } = Tabs;

class ViewTrainingDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'block',
      height: 0,
      cardExpnadBtn: true,
      logoImageURL: '', file: [],
      panelView: true,
      courseList: true,
      shwoInductionDetails: false,
      couresId: null,
      pageNo: 1
    }

    this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
  }

  onSubmit = (formData) => {

  }

  componentDidUpdate(prevProps, prevState) {
    
  }

  handleCancel = () => {
    this.setState({ displayEdit: 'none', courseList: true, shwoInductionDetails: false });
    this.props.reset();
  }

  changeTabKey = (key) => {
    this.setState({ currentKey: key })
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  removeFile = () => this.setState({ file: [], logoImageURL: '' });

  handleChange = (page, pageSize) => {
    this.setState({
      pageNo: page
    })
    if (page) {
      this.props.trainingAction.getCourses(page);
    }
  };

  handleShowInduction = (id) => {
    if (id) {
      this.setState({
        shwoInductionDetails: true,
        couresId: id,
        courseList: false
      })
    }
  }

  render() {
    const { handleSubmit, courses, rowCount, s3_base_path_url } = this.props;
    const isExpiredEmpty = courses && courses.find(course => course.status === 4)
    const isToDoEmpty = courses && courses.find(course => course.status === null)
    return (
      <form onSubmit={handleSubmit(this.onSubmit)}>
        {this.state.courseList ?
          <div className="sf-card">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.induction_training}</h2>
              <div className="info-btn disable-dot-menu">
                <Dropdown className="more-info" disabled>
                  <i className="material-icons">more_vert</i>
                </Dropdown>
              </div>
            </div>
            <div className="sf-card-body mt-2">
              <div className="courses-lists course-induc">
                <Tabs tabBarExtraContent='' className="fillters-courses" onChange={this.changeTabKey} type="card">

                  <TabPane tab={<div className="tab-item">{Strings.my_courses}</div>} key="1">
                    {/* My Course tab */}
                    <div className="course-induc-list">
                      {courses.length === 0 ?
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        :
                        <div className="row">
                          {courses && courses.map(course =>
                            <div className="col-md-4" onClick={() => this.handleShowInduction(course.id)}>
                              <div className="course-ind-content">
                                <div className="cors-pic">
                                  <span className={course && course.status === null ? "co-ind-status to-do"
                                    : course && course.status === 2 ? "co-ind-status in-progress"
                                      : course && course.status === 3 ? "co-ind-status completed"
                                        : course && course.status === 4 ? "co-ind-status expired"
                                          : ''}>
                                    {course.status_text}
                                  </span>
                                  <img src={s3_base_path_url + course.cover_file} />
                                </div>
                                <h3 className="co-ind-title">{course.name}</h3>
                              </div>
                            </div>
                          )}
                        </div>
                      }
                    </div>
                    {/* End */}
                  </TabPane>

                  <TabPane tab={<div className="tab-item">{Strings.expired_course}</div>} key="2">
                    {/* Expired Course Tab */}
                    <div className="course-induc-list">
                      {!isExpiredEmpty ?
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        :
                        <div className="row">
                          {courses && courses.map(course =>
                            course.status === 4 ?
                              <div className="col-md-4" onClick={() => this.handleShowInduction(course.id)}>
                                <div className="course-ind-content">
                                  <div className="cors-pic">
                                    <span className="co-ind-status expired">{course.status_text}</span>
                                    <img src={s3_base_path_url + course.cover_file} />
                                  </div>
                                  <h3 className="co-ind-title">{course.name}</h3>
                                </div>
                              </div>
                              :
                              ''
                          )}
                        </div>
                      }
                    </div>
                    {/* End */}
                  </TabPane>

                  <TabPane tab={<div className="tab-item">{Strings.to_do_course}</div>} key="3">
                    {/* Todo Course tab */}
                    <div className="course-induc-list">
                      {!isToDoEmpty ?
                        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
                        :
                        <div className="row">
                          {courses && courses.map(course =>
                            course.status_text === 'To do' ?
                              <div className="col-md-4" onClick={() => this.handleShowInduction(course.id)}>
                                <div className="course-ind-content">
                                  <div className="cors-pic">
                                    <span className="co-ind-status to-do">{course.status_text}</span>
                                    <img src={s3_base_path_url + course.cover_file} />
                                  </div>
                                  <h3 className="co-ind-title">{course.name}</h3>
                                </div>
                              </div>
                              :
                              ''
                          )}
                        </div>
                      }
                    </div>
                    {/* End */}
                  </TabPane>

                </Tabs>
                {rowCount > 10
                  ?
                  <Pagination className="sf-pagination"
                    defaultCurrent={this.state.pageNo}
                    defaultPageSize={10}
                    total={rowCount}
                    onChange={this.handleChange}
                  />
                  :
                  ''
                }

              </div>
            </div>
          </div>
          :
          ''
        }
        {this.state.shwoInductionDetails ?
          <div >
            <ShowInductionDetails
              backToList={this.handleCancel}
              courseItemId={this.state.couresId}
              pageNo={this.state.pageNo}
            />
          </div>
          : null
        }

        {/* zoom save button  */}
        {/* <div className="row zoom-save-bnt">
              <div className="col-md-12">
                <div className="all-btn d-flex justify-content-end mt-4">
                  <div className="btn-hs-icon">
                    <button type="submit" className="bnt bnt-active">
                      <Icon type="save" theme="filled" /> {Strings.save_btn}</button>
                  </div>
                </div>
              </div>
            </div> */}

        {/* 
          <div className="all-btn d-flex justify-content-end mt-4">
            <div className="btn-hs-icon">
              <button type="submit" className="bnt bnt-active">
                <Icon type="save" theme="filled" /> {Strings.save_btn}</button>
            </div>
          </div> */}
      </form>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    courses: state.inductionTraining.courses,
    rowCount: state.inductionTraining.count,
    s3_base_path_url: state.inductionTraining.s3_base_path_url,
    profileComplete: state.profileManagement && state.profileManagement.profileComplete,
    personalValue: state.form && state.form.PesonalDetailsForm,
    one_course_completed: state.inductionTraining && state.inductionTraining.one_course_completed ? state.inductionTraining.one_course_completed : false,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    trainingAction: bindActionCreators(actions, dispatch),
    profileAction: bindActionCreators(profileActions, dispatch),

  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({ form: 'ViewTrainingDetails' })
)(ViewTrainingDetails)