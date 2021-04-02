import React from 'react';
import { Collapse, Modal } from 'antd';
import { reduxForm } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../actions/inductionTrainingAction';
import CourseModuleQuiz from './CourseModuleQuiz';
import { getStorage } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { Player } from 'video-react';
import '../../../../node_modules/video-react/dist/video-react.css';
class ShowInductionDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentKey: 0,
            cardExpnadBtn: true,
            showPdfModal: false,
            showVideoModal: false,
            play: '',
            pdfFile: '',
            moduleFormValues: {},
            randomActiveKey: false,
        }
        this.user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    getCourseDetailsByCourseId = (id) => {
        this.props.action.getCourseDetailsApi(id, this.user_id).then(() => {
            if (this.props.course_details && this.props.course_details.course_module_mappings && this.props.course_details.course_module_mappings.length > 0) {
                let quizInitialValuesFlag = true;
                for (let i = 0; i < this.props.course_details.course_module_mappings.length; i++) {
                    if (this.props.course_details.course_module_mappings[i] && this.props.course_details.course_module_mappings[i].user_course_module_mapping === null) {
                        this.setState({ currentKey: i, randomActiveKey: true });
                        quizInitialValuesFlag = false;
                        break;
                    }
                    else if (this.props.course_details.course_module_mappings[i] && this.props.course_details.course_module_mappings[i].user_course_module_mapping && this.props.course_details.course_module_mappings[i].user_course_module_mapping.ended_at === null) {
                        this.setState({ currentKey: i, randomActiveKey: true });
                        quizInitialValuesFlag = false;
                        break;
                    }
                }
                if (quizInitialValuesFlag) {
                    let values = {};
                    let key = 0;
                    if (this.props.course_details && this.props.course_details.course_module_mappings && this.props.course_details.course_module_mappings.length > 0) {
                        let moduleDetails = this.props.course_details.course_module_mappings[key];
                        if (moduleDetails && moduleDetails.module_questions && moduleDetails.module_questions.length > 0) {
                            moduleDetails.module_questions.forEach(que => {
                                if (que && que.question && que.question.question_type === 1) {
                                    if (que.question.user_question_answer && que.question.user_question_answer !== null && que.question.user_question_answer.answer_id) {
                                        let answerArray = JSON.parse(que.question.user_question_answer.answer_id);
                                        if (answerArray && answerArray.length > 0) {
                                            answerArray.forEach(item => {
                                                let key = `$_${que.question.id}`
                                                if (item) {
                                                    values[key] = item;
                                                } else {
                                                    values[key] = '';
                                                }
                                            })
                                        }
                                    }
                                } else if (que && que.question && que.question.question_type === 2) {
                                    if (que.question.user_question_answer && que.question.user_question_answer !== null && que.question.user_question_answer.answer_id) {
                                        let answerArray = JSON.parse(que.question.user_question_answer.answer_id);
                                        if (answerArray && answerArray.length > 0) {
                                            answerArray.forEach(item => {
                                                let key = `$_${que.question.id}_${item}`
                                                if (item) {
                                                    values[key] = true;
                                                } else {
                                                    values[key] = '';
                                                }
                                            })
                                        }
                                    }
                                }
                            })
                        }
                    }
                    this.setState({ moduleFormValues: values })
                }
            }
        });
        let userCourseData = {
            user_id: this.user_id ? this.user_id : '',
            course_id: id ? id : ''
        }
        this.props.action.updateUserCourseProgress(userCourseData);
    }

    componentDidMount() {
        this.getCourseDetailsByCourseId(this.props.courseItemId);
    }

    componentDidUpdate(prevProps) {
        if (this.props.courseItemId !== prevProps.courseItemId) {
            this.getCourseDetailsByCourseId(this.props.courseItemId);
        }
    }

    handleBackToList = () => {
        this.props.backToList();
        this.props.reset();
    }

    handleModalClick = (data, module_id, course_id) => {
        if (data.includes(".pdf") || data.includes(".jpg")) {
            this.setState({
                showPdfModal: true,
                showVideoModal: false,
                pdfFile: data
            })
        } else {
            this.setState({
                showPdfModal: false,
                showVideoModal: true,
                play: data
            })
        }
        let userCourseModuleData = {
            user_id: this.user_id ? this.user_id : '',
            course_id: course_id ? course_id : '',
            module_id: module_id ? module_id : ''
        }
        if (course_id && module_id)
            this.props.action.updateUserCourseModuleProgress(userCourseModuleData);
    }

    handleModalOk = () => {
        if (this.player) {
            this.player.actions.pause()
            this.setState({
                showPdfModal: false,
                showVideoModal: false,
                play: ''
            })
        } else {
            this.setState({
                showPdfModal: false,
                showVideoModal: false,
                pdfFile: ''
            })
        }
    }

    onCollapseChange = (key) => {
        let values = {};
        if (this.props.course_details && this.props.course_details.course_module_mappings && this.props.course_details.course_module_mappings.length > 0) {
            let moduleDetails = this.props.course_details.course_module_mappings[key];
            if (moduleDetails && moduleDetails.module_questions && moduleDetails.module_questions.length > 0) {
                moduleDetails.module_questions.forEach(que => {
                    if (que && que.question && que.question.question_type === 1) {
                        if (que.question.user_question_answer && que.question.user_question_answer !== null && que.question.user_question_answer.answer_id) {
                            let answerArray = JSON.parse(que.question.user_question_answer.answer_id);
                            if (answerArray && answerArray.length > 0) {
                                answerArray.forEach(item => {
                                    let key = `$_${que.question.id}`
                                    if (item) {
                                        values[key] = item;
                                    } else {
                                        values[key] = '';
                                    }
                                })
                            }
                        }
                    } else if (que && que.question && que.question.question_type === 2) {
                        if (que.question.user_question_answer && que.question.user_question_answer !== null && que.question.user_question_answer.answer_id) {
                            let answerArray = JSON.parse(que.question.user_question_answer.answer_id);
                            if (answerArray && answerArray.length > 0) {
                                answerArray.forEach(item => {
                                    let key = `$_${que.question.id}_${item}`
                                    if (item) {
                                        values[key] = true;
                                    } else {
                                        values[key] = '';
                                    }
                                })
                            }
                        }
                    }
                })
            }
        }
        this.setState({
            currentKey: key, moduleFormValues: values
        })
    }

    handlePanel = () => {
        var key = parseInt(this.state.currentKey)
        this.onCollapseChange(key + 1)
    }

    handleExternalLink = (module_id, course_id) => {
        let userCourseModuleData = {
            user_id: this.user_id ? this.user_id : '',
            course_id: course_id ? course_id : '',
            module_id: module_id ? module_id : ''
        }
        this.props.action.updateUserCourseModuleProgress(userCourseModuleData);
    }

    render() {
        const { Panel } = Collapse;
        const { course_details } = this.props;
        return (
            <div className="course-item-content">
                <div className="sf-card srch-indc-wrap">
                    <div className="search-ind-cors">
                        <button className="bnt bnt-active indc-co-bnt"><i className="material-icons">school</i></button>
                        <label className="course-m-title">{course_details && course_details.name ? course_details.name : ''}</label>
                        <button type="button" title="Back to list" onClick={this.handleBackToList} className="course-list-bnt normal-bnt">
                            <i class="material-icons">view_module</i>
                        </button>
                    </div>
                </div>

                <div className="row">
                    <div className="col-md-8">
                        <div className="sf-card mt-4">
                            <div className="sf-card-body mt-2">
                                <div className="view-text-value mt-2">
                                    <label>Course Info</label>
                                    <span>{course_details && course_details.detailed_description ? course_details.detailed_description : ''}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4" onClick={() => this.handleModalClick(course_details.course_video ? course_details.s3_base_path_url + course_details.course_video : course_details.s3_base_path_url + course_details.cover_file)}>
                        <div className="sf-card mt-4">
                            <div className="sf-card-body mt-2">
                                <div className="course-thumb-file">
                                    <img src={course_details && course_details.s3_base_path_url && course_details.cover_file ? course_details.s3_base_path_url + course_details.cover_file : ''} alt="" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="course-wrap-card mt-4">
                    <Collapse bordered={false} accordion onChange={(key) => this.onCollapseChange(key)} activeKey={[this.state.currentKey]}>
                        {course_details && course_details.course_module_mappings && course_details.course_module_mappings.length > 0 ? course_details.course_module_mappings.map((moduleDetails, index) => {
                            let disabledPanel = false;
                            if (moduleDetails && moduleDetails.user_course_module_mapping === null && this.state.currentKey !== index) {
                                disabledPanel = true;
                            } else if (moduleDetails && moduleDetails.user_course_module_mapping && moduleDetails.user_course_module_mapping.ended_at === null && this.state.currentKey !== index) {
                                disabledPanel = true;
                            }
                            return <Panel className="induc-cors-items" header={moduleDetails && moduleDetails.course_module && moduleDetails.course_module.name ? moduleDetails.course_module.name : ''} key={index} disabled={disabledPanel}>
                                <div className="course-item-content">
                                    <div className="view-text-value mt-2">
                                        <label>Info</label>
                                        <span>{moduleDetails && moduleDetails.course_module && moduleDetails.course_module.description ? moduleDetails.course_module.description : ''}</span>
                                    </div>
                                    <div className="row mt-4">
                                        <div className="col-md-4">
                                            {moduleDetails && moduleDetails.course_module && moduleDetails.course_module.content_file
                                                ?
                                                <div className="view-text-value co-attach">
                                                    <label>Content</label>
                                                    <div className="attached-file-co">
                                                        <button onClick={() => this.handleModalClick(course_details.s3_base_path_url + moduleDetails.course_module.content_file, moduleDetails.module_id, moduleDetails.course_id)}>
                                                            {moduleDetails.course_module.content_file.includes(".pdf") ?
                                                                <span className="file-name">
                                                                    <i class="fa fa-file-pdf-o"></i></span> :
                                                                <span className="file-name video-file">
                                                                    <i class="fa fa-youtube-play"></i></span>
                                                            }
                                                        </button>
                                                        <a href="javascript:void()" onClick={() => this.handleModalClick(course_details.s3_base_path_url + moduleDetails.course_module.content_file, moduleDetails.module_id, moduleDetails.course_id)}>
                                                            {moduleDetails.course_module.content_title}
                                                        </a>
                                                    </div>
                                                </div>
                                                :
                                                ''
                                            }

                                            {moduleDetails && moduleDetails.course_module && moduleDetails.course_module.external_provider_link
                                                ?
                                                <div className="view-text-value co-attach mt-3">
                                                    <label>External Link</label>
                                                    <a className="course-url" onClick={() => this.handleExternalLink(moduleDetails.module_id, moduleDetails.course_id)} href={moduleDetails && moduleDetails.course_module && moduleDetails.course_module.external_provider_link ? moduleDetails.course_module.external_provider_link : ''} target="_blank">
                                                        <i class="material-icons">link</i>
                                                        {moduleDetails && moduleDetails.course_module && moduleDetails.course_module.link ? moduleDetails.course_module.link : ''}</a>
                                                </div>
                                                :
                                                ''
                                            }
                                        </div>
                                        <div className="col-md-8">
                                            <div className="quiz-head">
                                                <h2 className="quiz-heading">Quiz</h2>
                                                <div className="quiz-time">
                                                    <i class="material-icons">timer</i>
                                                    <span>
                                                        {moduleDetails && moduleDetails.course_module && moduleDetails.course_module.duration
                                                            ?
                                                            moduleDetails.course_module.duration.slice(0, 2) > 0
                                                                ?
                                                                moduleDetails.course_module.duration
                                                                :
                                                                moduleDetails.course_module.duration.substr(3)
                                                            : null
                                                        }
                                                    </span>
                                                </div>
                                            </div>
                                            {moduleDetails && moduleDetails ? <CourseModuleQuiz moduleDetails={moduleDetails} nextPanel={(defaultActiveKey) => this.handlePanel(defaultActiveKey)} moduleList={course_details && course_details.course_module_mappings} initialValues={this.state.moduleFormValues} backToList={this.handleBackToList} disabledFinishButton={course_details && course_details.user_course_mapping && course_details.user_course_mapping.ended_at} moduleEndDateFlag={this.state.randomActiveKey} pageNo={this.props.pageNo} /> : null}
                                        </div>
                                    </div>
                                </div>
                                {/* {moduleDetails && moduleDetails.course_module
                                    && moduleDetails.course_module.content_file && moduleDetails.course_module.content_file.includes('.pdf')
                                    ? */}
                                <Modal footer={null} className="sf-ic-module modal-pdf" destroyOnClose={true} maskClosable={false} centered visible={this.state.showPdfModal} onOk={this.handleModalOk} onCancel={this.handleModalOk} cancelText="Close" >

                                    <iframe
                                        title={moduleDetails && moduleDetails.course_module
                                            && moduleDetails.course_module.content_file}
                                        src={this.state.pdfFile
                                            ?
                                            this.state.pdfFile
                                            :
                                            ''
                                        }></iframe>
                                </Modal>
                                {/* : */}
                                <Modal footer={null} className="sf-ic-module modal-video" maskClosable={false} centered visible={this.state.showVideoModal} onOk={this.handleModalOk} onCancel={this.handleModalOk} okButtonProps={{ display: false }} cancelButtonProps={{ disabled: true }}>
                                    <Player
                                        ref={player => {
                                            this.player = player;
                                        }}
                                        autoPlay
                                        poster="/assets/poster.png"
                                        src={this.state.play
                                            ?
                                            this.state.play
                                            : ''
                                        }
                                    />
                                </Modal>
                                {/* } */}
                            </Panel>
                        }) : null}
                    </Collapse>
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
    reduxForm({ form: 'ShowInductionDetails' })
)(ShowInductionDetails)


