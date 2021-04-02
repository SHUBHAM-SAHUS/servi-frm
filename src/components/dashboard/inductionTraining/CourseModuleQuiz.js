
import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { notification, Radio } from 'antd';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';

import * as actions from '../../../actions/inductionTrainingAction';
import { CustomCheckbox } from '../../common/customCheckbox';

class CourseModuleQuiz extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            value: 0,
            questionIndex: 1
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
        console.log('radio checked', e.target.value);
        this.setState({
            value: e.target.value,
        });
    };

    onSubmit = formData => {
    }

    render() {
        const { current, questionIndex } = this.state;
        const { handleSubmit, moduleDetails, moduleList } = this.props;
        let lastModule = moduleList && moduleList.length - 1;
        const finishButtonToggle = moduleList[lastModule].id === moduleDetails.id;

        return (<form onSubmit={handleSubmit(this.onSubmit)}>
            <div className="quiz-body">
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
                                            <Radio.Group onChange={this.onChange} value={this.state.value}>
                                                <Radio value={answer_index}>{answer && answer.answer_text ? answer.answer_text : ''}</Radio>
                                            </Radio.Group>
                                        </div>))
                                        : moduleDetails && moduleDetails.module_questions && moduleDetails.module_questions[current] && moduleDetails.module_questions[current].question && moduleDetails.module_questions[current].question.answers && moduleDetails.module_questions[current].question.answers.length > 0 && moduleDetails.module_questions[current].question.answers.map((answer, answer_index) => (<div className="quiz-type">
                                            <Field
                                                label={answer && answer.answer_text ? answer.answer_text : ''}
                                                name={answer_index}
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
                                <button className="bnt bnt-active" type="button" onClick={() => notification.success({
                                    message: 'Good!',
                                    description: 'You did good. You PASSED in this quiz.',
                                    onClick: () => { },
                                    className: 'ant-success'
                                }
                                )}>
                                    Done</button>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* finish button */}
            {finishButtonToggle ? <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                <div className="btn-hs-icon">
                    <button type="submit" className="bnt bnt-active">
                        <i className="material-icons">check</i>Finish</button>
                </div>
            </div> : <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                    <div className="btn-hs-icon">
                        <button type="submit" className="bnt bnt-active">
                            <i className="material-icons">check</i>Next</button>
                    </div>
                </div>}
        </form>)
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
    reduxForm({ form: 'CourseModuleQuiz', enableReinitialize: true })
)(CourseModuleQuiz)