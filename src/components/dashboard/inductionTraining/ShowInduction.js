import React from 'react';
import { Icon, Collapse } from 'antd';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import $ from 'jquery';
import * as actions from '../../../actions/inductionTrainingAction';
import CourseModuleQuiz from './CourseModuleQuiz';
import { getStorage } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
class ShowInduction extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            cardExpnadBtn: true,
        }
        this.user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    getCourseDetailsByCourseId = (id) => {
        this.props.action.getCourseDetailsApi(id, this.user_id);
    }

    componentDidMount() {
        this.getCourseDetailsByCourseId(this.props.location.state);
    }

    componentDidUpdate(prevProps) {
        if (this.props.location.state !== prevProps.location.state) {
            this.getCourseDetailsByCourseId(this.props.location.state);
        }
    }

    // expand center card 
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    }


    render() {
        const { Panel } = Collapse;
        const { course_details } = this.props;
        console.log("@ course_details  ::::", course_details);
        return (
            <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
                <div className="sf-card-wrap">
                    {/* zoom button  */}
                    <div className="card-expands">
                        <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                            <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                    </div>
                    <div className="sf-card srch-indc-wrap">
                        <div className="search-ind-cors">
                            <button className="bnt bnt-active indc-co-bnt"><i className="material-icons">school</i></button>
                            <h2>{course_details && course_details.name ? course_details.name : ''}</h2>
                        </div>
                    </div>
                    <div className="sf-card mt-4">
                        <div className="sf-card-body mt-2">
                            <div className="view-text-value mt-2">
                                <label>Course Info</label>
                                <span>{course_details && course_details.detailed_description ? course_details.detailed_description : ''}</span>
                            </div>
                        </div>
                    </div>
                    <div className="course-wrap-card mt-4">
                        <Collapse bordered={false} accordion>
                            {course_details && course_details.course_module_mappings && course_details.course_module_mappings.length > 0 ? course_details.course_module_mappings.map((moduleDetails, index) => {
                                return <Panel className="induc-cors-items" header={moduleDetails && moduleDetails.course_module && moduleDetails.course_module.name ? moduleDetails.course_module.name : ''} key={index}>
                                    <div className="course-item-content">
                                        <div className="view-text-value mt-2">
                                            <label>Info</label>
                                            <span>{moduleDetails && moduleDetails.course_module && moduleDetails.course_module.description ? moduleDetails.course_module.description : ''}</span>
                                        </div>
                                        <div className="row mt-4">
                                            <div className="col-md-4">
                                                <div className="view-text-value co-attach">
                                                    <label>Content</label>
                                                    <div className="attached-file-co">
                                                        <span className="file-name"><i class="fa fa-file-pdf-o"></i></span>
                                                        <a href={course_details && course_details.s3BasePathUrl && moduleDetails && moduleDetails.course_module && moduleDetails.course_module.content_file ? course_details.s3BasePathUrl + moduleDetails.course_module.content_file : ''}>{moduleDetails && moduleDetails.course_module && moduleDetails.course_module.content_file ? moduleDetails.course_module.content_file : ''}</a>
                                                    </div>
                                                </div>
                                                <div className="view-text-value co-attach mt-3">
                                                    <label>External Link</label>
                                                    <a className="course-url" href={moduleDetails && moduleDetails.course_module && moduleDetails.course_module.external_provider_link ? moduleDetails.course_module.external_provider_link : ''} target="_blank">{moduleDetails && moduleDetails.course_module && moduleDetails.course_module.external_provider_link ? moduleDetails.course_module.external_provider_link : ''}</a>
                                                </div>
                                            </div>
                                            <div className="col-md-8">
                                                <div className="quiz-head">
                                                    <h2 className="quiz-heading">Quiz</h2>
                                                    <div className="quiz-time">
                                                        <i class="material-icons">timer</i>
                                                        <span>{moduleDetails && moduleDetails.course_module && moduleDetails.course_module.duration ? moduleDetails.course_module.duration : ''}</span>
                                                    </div>
                                                </div>
                                                {moduleDetails && moduleDetails ? <CourseModuleQuiz moduleDetails={moduleDetails} moduleList={course_details && course_details.course_module_mappings} /> : null}
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                            }) : null}
                        </Collapse>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        course_details: state.inductionTraining.course_details
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'ShowInduction' })
)(ShowInduction)


