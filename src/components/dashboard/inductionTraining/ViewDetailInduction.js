import React from 'react';
import { Icon, Modal, Upload, Dropdown, Menu, notification, Tabs } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';

import { validate } from '../../../utils/Validations/certificateValidations';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import * as actions from '../../../actions/orgCertificatesAction';
import { CustomSwitch } from '../../common/customSwitch'
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { getStorage } from '../../../utils/common';
import { customTextarea } from '../../common/customTextarea'
import { CustomDatepicker } from '../../common/customDatepicker';
import moment from 'moment'
import $ from 'jquery';
import { DeepTrim } from '../../../utils/common';

const { Dragger } = Upload;

const { TabPane } = Tabs;

class ViewDetailInduction extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'block',
      height: 0,
      cardExpnadBtn: true,
      logoImageURL: '', file: [],
      panelView: true
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);

    formData.active = +formData.active;
    formData.expiry_date = formData.expiry_date && formData.expiry_date.toString();
    var finalFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key != 'file_name')
        finalFormData.append(key, formData[key]);
    })
    if (this.state.file && this.state.file.length > 0 && this.state.file[0].originFileObj)
      finalFormData.append("file_name", this.state.file[0].originFileObj)
    this.props.action.addOrgCerti(finalFormData, formData.organisation_id)
      .then((message) => {
        this.setState({ file: [] });
        this.props.reset();
        notification.success({
          message: Strings.success_title,
          description: message,
          onClick: () => { },
          className: 'ant-success'
        });
      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  handleCancel = () => {
    this.setState({ displayEdit: 'none' });
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

  disableDate = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  render() {

    const { handleSubmit, courses } = this.props;
    console.log(courses)
    const uploadPicProps = {
      beforeUpload: file => {
        this.setState({
          file: [file],
        });
        return false;
      },
      listType: "picture",
      multiple: false,
      onChange: (info) => {
        // getBase64(info.file, imageUrl =>
        this.setState({
          // logoImageURL: imageUrl,
          file: [info.fileList[info.fileList.length - 1]]
        })
        // );
      },
      accept: ".jpeg,.jpg,.png,.pdf",
      fileList: this.state.file,
      onRemove: this.removeFile
    };

    const tabFilters = <div className="course-fllter">
      <Field
        label="Sort By"
        className="filter-txt"
        name="name"
        placeholder="Sort By"
        id="name"
        component={CustomSelect} />
      <i class="fa fa-lightbulb-o"></i>
    </div>;

    return (
      <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="sf-card-wrap">
            {/* zoom button  */}
            <div className="card-expands">
              <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
            </div>
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
                  <Tabs tabBarExtraContent={tabFilters} className="fillters-courses" onChange={this.changeTabKey} type="card">

                    <TabPane tab={<div className="tab-item">{Strings.my_courses}</div>} key="1">
                      {/* My Course tab */}
                      <div className="course-induc-list">
                        <div className="row">
                          {courses && courses.map(course =>
                            <div className="col-md-4">
                              <div className="course-ind-content">
                                <div className="cors-pic">
                                  <span className="co-ind-status completed">{course.status}</span>
                                  <img src="/images/course-name.jpg" />
                                </div>
                                <h3 className="co-ind-title">{course.name}</h3>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      {/* End */}
                    </TabPane>

                    <TabPane tab={<div className="tab-item">{Strings.expired_course}</div>} key="2">
                      {/* Expired Course Tab */}
                      <div className="course-induc-list">
                        <div className="row">
                          {courses && courses.map(course =>
                            course.status === 1 ?
                              <div className="col-md-4">
                                <div className="course-ind-content">
                                  <div className="cors-pic">
                                    <span className="co-ind-status completed">{Strings.induction_status_completed}</span>
                                    <img src="/images/course-name.jpg" />
                                  </div>
                                  <h3 className="co-ind-title">{course.name}</h3>
                                </div>
                              </div>
                              :
                              ''
                          )}
                        </div>
                      </div>
                      {/* End */}
                    </TabPane>

                    <TabPane tab={<div className="tab-item">{Strings.to_do_course}</div>} key="3">
                      {/* Todo Course tab */}
                      <div className="course-induc-list">
                        <div className="row">
                          {courses && courses.map(course =>
                            course.status === 3 ?
                              <div className="col-md-4">
                                <div className="course-ind-content">
                                  <div className="cors-pic">
                                    <span className="co-ind-status completed">{Strings.induction_status_todo}</span>
                                    <img src="/images/course-name.jpg" />
                                  </div>
                                  <h3 className="co-ind-title">{course.name}</h3>
                                </div>
                              </div> :
                              ''
                          )}
                        </div>
                      </div>
                      {/* End */}
                    </TabPane>

                  </Tabs>
                </div>
              </div>
            </div>

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

          </div>
          {/* 
          <div className="all-btn d-flex justify-content-end mt-4">
            <div className="btn-hs-icon">
              <button type="submit" className="bnt bnt-active">
                <Icon type="save" theme="filled" /> {Strings.save_btn}</button>
            </div>
          </div> */}
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    courses: state.inductionTraining.courses,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({ form: 'ViewDetailInduction', validate })
)(ViewDetailInduction)