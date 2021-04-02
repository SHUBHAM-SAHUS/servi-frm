import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { notification } from 'antd';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';

import * as actions from '../../../actions/inductionTrainingAction';
import { CustomCheckbox } from '../../common/customCheckbox';
import { customRadioGroup } from '../../common/customRadioGroup';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { getStorage } from '../../../utils/common';
import { Strings } from '../../../dataProvider/localize';
import { validate } from '../../../utils/Validations/courseQuizValidation';
import * as profileActions from '../../../actions/profileManagementActions';


class CourseModuleQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            value: 0,
            questionIndex: 1,
            disabledDone: false,
            startDate: '',
            disableFinish: false
        }
        this.user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }
    componentDidMount() {
        if (this.props.moduleDetails && this.props.moduleDetails.module_questions && this.props.moduleDetails.module_questions.length > 0) {
            this.props.moduleDetails.module_questions.forEach(que => {
                if (que && que.question && que.question.user_question_answer === null) {
                    this.setState({ disabledDone: true, startDate: new Date() });
                }
            })
        }
        if (this.props.disabledFinishButton) {
            this.setState({ disableFinish: true })
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps && prevProps.moduleDetails && this.props.moduleDetails && prevProps.moduleDetails.course_id !== this.props.moduleDetails.course_id) {
            if (this.props.moduleDetails && this.props.moduleDetails.module_questions && this.props.moduleDetails.module_questions.length > 0) {
                this.props.moduleDetails.module_questions.forEach(que => {
                    if (que && que.question && que.question.user_question_answer === null) {
                        this.state.disabledDone = true;
                    }
                })
            }
        }
        else if (prevProps && prevProps.moduleDetails && this.props.moduleDetails && prevProps.moduleDetails.module_id !== this.props.moduleDetails.module_id) {
            if (this.props.moduleDetails && this.props.moduleDetails.module_questions && this.props.moduleDetails.module_questions.length > 0) {
                this.props.moduleDetails.module_questions.forEach(que => {
                    if (que && que.question && que.question.user_question_answer === null) {
                        this.state.disabledDone = true;
                    }
                })
            }
        }
        if (this.props.moduleDetails && this.props.moduleDetails.user_course_module_mapping && this.props.moduleDetails.user_course_module_mapping.ended_at) {
            this.state.disabledDone = false;
        }
    }

    // next Previous button
    prev = () => {
        if (this.state.current > 0) {
            const current = this.state.current - 1;
            const questionIndex = this.state.questionIndex - 1;
            this.setState({ current: current, questionIndex: questionIndex });
        }
    }
    next = () => {
        const current = this.state.current + 1;
        const questionIndex = this.state.questionIndex + 1;
        this.setState({ current: current, questionIndex: questionIndex });
    }

    onChange = e => {
        this.setState({
            value: e.target.value,
        });
    };

    handleOnSubmit() {
        let formData = this.props.formValues;
        let quiz = [];
        let data = {};
        for (let key in formData) {
            let splittedKeyArray = key.split('_');
            if (splittedKeyArray && splittedKeyArray[2]) {
                if (quiz && quiz.length > 0) {
                    let quizAnswerIds = [];
                    let duplicateFlag = false;
                    for (let q of quiz) {
                        if (q && q.question_id == splittedKeyArray[1]) {
                            duplicateFlag = true;
                            if (formData[key] === true) {
                                quizAnswerIds = q && q.answer_id;
                                quizAnswerIds.push(parseInt(splittedKeyArray[2]));
                            }
                        } else {
                            if (formData[key] === true) {
                                quizAnswerIds.push(parseInt(splittedKeyArray[2]));
                            }
                        }
                    }
                    if (duplicateFlag === false) {
                        if (quizAnswerIds && quizAnswerIds.length > 0) {
                            quiz.push({ 'question_id': parseInt(splittedKeyArray[1]), 'answer_id': quizAnswerIds });
                        }
                    }
                } else {
                    let quizAnswerIds = [];
                    if (formData[key] === true) {
                        quizAnswerIds.push(parseInt(splittedKeyArray[2]));
                        if (quizAnswerIds && quizAnswerIds.length > 0) {
                            quiz.push({ 'question_id': parseInt(splittedKeyArray[1]), 'answer_id': quizAnswerIds });
                        }
                    }
                }
            } else {
                let quizAnswerIds = [];
                quizAnswerIds.push(formData[key]);
                quiz.push({ 'question_id': parseInt(splittedKeyArray[1]), 'answer_id': quizAnswerIds });
            }
        }
        data.quiz = quiz;
        data.user_id = this.user_name ? this.user_name : '';
        data.course_id = this.props.moduleDetails && this.props.moduleDetails.course_id ? this.props.moduleDetails.course_id : '';
        data.module_id = this.props.moduleDetails && this.props.moduleDetails.module_id ? this.props.moduleDetails.module_id : '';
        if (this.props.moduleDetails && this.props.moduleDetails.module_questions && this.props.moduleDetails.module_questions.length === data.quiz.length) {
            this.props.action.addModuleQuestionAnswerByUser(data).then(message => {
                let userCourseModuleData = {
                    user_id: data && data.user_id ? data.user_id : '',
                    course_id: data && data.course_id ? data.course_id : '',
                    module_id: data && data.module_id ? data.module_id : '',
                    ended_at: new Date()
                }
                if (this.state.startDate) {
                    userCourseModuleData.start_date = this.state.startDate;
                }
                this.props.action.updateUserCourseModuleProgress(userCourseModuleData);
                if (message) {
                    this.setState({ disabledDone: false, disableFinish: false });
                    notification.success({
                        message: Strings.success_title,
                        description: message ? message : 'You have completed this module quiz.',
                        onClick: () => { },
                        className: 'ant-success'
                    });
                    let lastModule = this.props.moduleList && this.props.moduleList.length - 1;
                    const finishButtonToggle = this.props.moduleList[lastModule].id === this.props.moduleDetails.id;
                    if (!finishButtonToggle) {
                        this.props.nextPanel();
                    }
                }
            }).catch(message => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            })
        } else {
            notification.error({
                message: Strings.error_title,
                description: "Please solve all questions of this modules.",
                onClick: () => { },
                className: 'ant-error'
            });
        }
    }

    handleNext = () => {
        this.props.nextPanel()
    }
    handleFinishCourse = (course_id) => {
        let solvedFlag = true;
        if (this.props.moduleList && this.props.moduleList.length > 0) {
            this.props.moduleList.forEach(courseModule => {
                courseModule.module_questions.forEach(que => {
                    if (que && que.question && que.question.user_question_answer === null) {
                        solvedFlag = false;
                    }
                })
            })
            if (solvedFlag) {
                let userCourseData = {
                    user_id: this.user_name ? this.user_name : '',
                    course_id: course_id ? course_id : '',
                    ended_at: new Date(),
                    profile_progress: !this.props.one_course_completed ? this.props.profileComplete + 10 : this.props.profileComplete
                }
                this.props.action.updateUserCourseProgress(userCourseData).then(message => {
                    if (message) {
                        this.setState({ disableFinish: true });
                        notification.success({
                            message: Strings.success_title,
                            description: message ? message : 'You have completed this course.',
                            onClick: () => { },
                            className: 'ant-success'
                        });
                        this.props.action.getCourses(this.props.pageNo);
                        this.props.backToList();
                        this.props.reset();
                    }
                })
            } else {
                notification.error({
                    message: Strings.error_title,
                    description: "Please solve all questions of all modules.",
                    onClick: () => { },
                    className: 'ant-error'
                });
            }
        }
    }

    render() {
        const { current, questionIndex } = this.state;
        const { moduleDetails, moduleList, initialValues } = this.props;
        let lastModule = moduleList && moduleList.length - 1;
        const finishButtonToggle = moduleList[lastModule].id === moduleDetails.id;
        return (
            <>
                <div className={moduleDetails && moduleDetails.user_course_module_mapping === null ? "quiz-body quiz-body-disabled" : "quiz-body"}>
                    <div className="quiz-items">
                        <div className="quiz-options">
                            <div className="steps-content">
                                <h4 className="quiz-title">
                                    <strong>{moduleDetails && moduleDetails.module_questions.length > 0 && questionIndex}</strong>
                                    <span>{moduleDetails && moduleDetails.module_questions && moduleDetails.module_questions[current] && moduleDetails.module_questions[current].question && moduleDetails.module_questions[current].question.question_text ? moduleDetails.module_questions[current].question.question_text : ''}</span>
                                </h4>
                                <div className="quiz-choice">
                                    {
                                        moduleDetails && moduleDetails.module_questions && moduleDetails.module_questions[current] && moduleDetails.module_questions[current].question.question_type && moduleDetails.module_questions[current].question.question_type === 1
                                            ? moduleDetails && moduleDetails.module_questions && moduleDetails.module_questions[current] && moduleDetails.module_questions[current].question && moduleDetails.module_questions[current].question.answers && moduleDetails.module_questions[current].question.answers.length > 0 && moduleDetails.module_questions[current].question.answers.map((answer, answer_index) => (<div className="quiz-type">
                                                <Field
                                                    label={answer && answer.answer_text ? answer.answer_text : ''}
                                                    name={`$_${moduleDetails.module_questions[current].question.id}`}
                                                    onChange={(e) => this.setState({ value: e.target.value })}
                                                    defaultValue={0}
                                                    answer_index={answer && answer.id ? answer.id : ''}
                                                    answer_text={answer && answer.answer_text ? answer.answer_text : ''}
                                                    disabled={initialValues[`$_${moduleDetails.module_questions[current].question.id}`] || moduleDetails.module_questions[current].question.user_question_answer !== null}
                                                    component={customRadioGroup}
                                                    validate={validate}
                                                />
                                            </div>))
                                            : moduleDetails && moduleDetails.module_questions && moduleDetails.module_questions[current] && moduleDetails.module_questions[current].question && moduleDetails.module_questions[current].question.answers && moduleDetails.module_questions[current].question.answers.length > 0 && moduleDetails.module_questions[current].question.answers.map((answer, answer_index) => (<div className="quiz-type">
                                                <Field
                                                    label={answer && answer.answer_text ? answer.answer_text : ''}
                                                    name={`$_${moduleDetails.module_questions[current].question.id}_${answer && answer.id ? answer.id : ''}`}
                                                    disabled={initialValues[`$_${moduleDetails.module_questions[current].question.id}_${answer && answer.id ? answer.id : ''}`] || moduleDetails.module_questions[current].question.user_question_answer !== null}
                                                    component={CustomCheckbox}
                                                />
                                            </div>))
                                    }
                                </div>
                            </div>
                        </div>

                        {/* next Previous button */}
                        <div className="all-btn multibnt quiz-buttons mt-4">
                            <div className="btn-hs-icon d-flex justify-content-end">
                                {current > 0 && (
                                    <button className="bnt bnt-normal" type="button" onClick={() => this.prev()}>Previous</button>
                                )}
                                {current < moduleDetails.module_questions.length - 1 && (
                                    <button className="bnt bnt-active" type="button" onClick={() => this.next()}>
                                        Next</button>
                                )}
                                {current === moduleDetails.module_questions.length - 1 && (
                                    <button disabled={!this.state.disabledDone} className="bnt bnt-active" type="button" onClick={() => this.handleOnSubmit()}>Done</button>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* finish button */}
                {
                    finishButtonToggle ? <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                        <div className="btn-hs-icon">
                            <button disabled={this.state.disableFinish} type="button" onClick={() => { this.handleFinishCourse(moduleDetails.course_id) }} className="bnt bnt-active">
                                <i className="fa fa-check"></i>Finish</button>
                        </div>
                    </div> : <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                            <div className="btn-hs-icon">
                                <button disabled={this.state.disabledDone} type="button" className="bnt bnt-active" onClick={this.handleNext}>
                                    <i className="fa fa-check"></i>Next</button>
                            </div>
                        </div>
                }
            </>
        )
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        course_details: state.inductionTraining.course_details,
        formValues: state.form.CourseModuleQuiz && state.form.CourseModuleQuiz.values ? state.form.CourseModuleQuiz.values : {},
        profileComplete: state.profileManagement && state.profileManagement.profileComplete,
        personalValue: state.form && state.form.PesonalDetails,
        one_course_completed: state.inductionTraining && state.inductionTraining.one_course_completed ? state.inductionTraining.one_course_completed : false
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
        profileAction: bindActionCreators(profileActions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'CourseModuleQuiz', enableReinitialize: true })
)(CourseModuleQuiz)