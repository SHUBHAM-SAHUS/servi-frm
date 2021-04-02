import React from "react";
import { Icon, Modal, Dropdown, notification, Tooltip, Tabs } from "antd";
import { reduxForm, Field, FieldArray, FormSection } from "redux-form";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import ScrollArea from "react-scrollbar";

import { validate } from "../../../utils/Validations/roleValidation";
import { customInput } from "../../common/custom-input";
import { CustomSelect } from "../../common/customSelect";
import * as actions from '../../../actions/inductionTrainingAction';
import { CustomSwitch } from "../../common/customSwitch";
import { Strings } from "../../../dataProvider/localize";
import { ADMIN_DETAILS, VALIDATE_STATUS } from "../../../dataProvider/constant";
import { CustomCheckbox } from "../../../components/common/customCheckbox";
import { getStorage, handleFocus, DeepTrim } from "../../../utils/common";
import $ from "jquery";
import { customTextarea } from "../../common/customTextarea";
import Dragger from "antd/lib/upload/Dragger";
const { TabPane } = Tabs;



class AddModule extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayEdit: "block",
            height: 0,
            cardExpnadBtn: true,
        };
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS))
            ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
            : null;
    }
    componentDidMount() {
        console.log("Mounted Module", this.props.initialValues);
    }
    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        formData["quiz_mandatory"] = +formData["quiz_mandatory"];

        var finalFormData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key == "question_answers" || key == "tags") {
                finalFormData.append(key, JSON.stringify(formData[key]));
            } else {
                finalFormData.append(key, formData[key]);
            }
        });
        console.log("formData", formData);
        if (this.props.initialValues && this.props.initialValues.id) {
            this.props.action.updateModule(finalFormData)
                .then(message => {
                    this.props.action.getCourseModule();
                    this.props.action.initCourses()
                    notification.success({
                        message: Strings.success_title,
                        description: message ? message : Strings.success_title,
                        onClick: () => { },
                        className: 'ant-success'
                    });
                    this.props.onCancle()
                })
                .catch(message => {
                    notification.error({
                        message: Strings.error_title,
                        description: message ? message : Strings.generic_error,
                        onClick: () => { },
                        className: "ant-error"
                    });
                });
        }
        else
            this.props.action.
                addNewModule(finalFormData)
                .then(message => {
                    this.props.action.getCourseModule();
                    this.props.action.initCourses();
                    notification.success({
                        message: Strings.success_title,
                        description: message ? message : Strings.success_title,
                        onClick: () => { },
                        className: 'ant-success'
                    });
                    this.props.onCancle()
                })
                .catch(message => {
                    notification.error({
                        message: Strings.error_title,
                        description: message ? message : Strings.generic_error,
                        onClick: () => { },
                        className: "ant-error"
                    });
                });
    };

    handleCancel = () => {
        this.setState({ displayEdit: "none" });
    };

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn });
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    };

    renderOptions = ({ fields, meta: { error, submitFailed } }) => {
        if (fields.length === 0)
            fields.push({});
        return <div className="tbs-qz-cont">
            {fields.map((member, index) =>
                <>
                    <div className="tbs-quiz-choice">
                        <fieldset className="sf-form select-wibg">
                            {index === fields.length - 1 ?
                                <button type="button" className="add-m-choice bnt"><i className="material-icons"
                                    onClick={() => fields.push({})}>add_circle_outline</i></button> :
                                <button type="button" className="add-m-choice bnt non-active"
                                    onClick={() => fields.remove(index)}>
                                    <i className="material-icons">remove_circle_outline</i></button>}
                            <Field
                                label={"Choice #" + (index + 1)}
                                name={`${member}.answer_text`}
                                placeholder="Choice"
                                id="brand"
                                type="text"
                                component={customInput} />
                        </fieldset>
                        <Field label="Select If correct" name={`${member}.correct`} component={CustomCheckbox} />
                    </div>

                </>)}
        </div>
    }

    renderQuestions = ({ fields, meta: { error, submitFailed } }) => {
        return <>{fields.map((member, index) => (
            <Tabs type="card" activeKey={this.props.formValues && this.props.formValues.question_answers
                && this.props.formValues.question_answers[index] && this.props.formValues.question_answers[index].question_type ?
                this.props.formValues.question_answers[index].question_type.toString() : this.props.initialValues && this.props.initialValues.question_answers
                    && this.props.initialValues.question_answers[index] && this.props.initialValues.question_answers[index].question_type ?
                    this.props.initialValues.question_answers[index].question_type.toString() : "1"}
                onChange={(key) => this.props.change(`question_answers[${index}].question_type`, key)}
            >
                <TabPane tab="Multiple Choice" key="1"
                // onclick={() => this.props.change(`question_answers[${index}].question_type`, "1")}
                >
                    <div className="quiz-contnt">
                        <div className="qiz-dlt-bnt">
                            <fieldset className="form-group sf-form select-wibg">
                                <Field
                                    label={"Question #" + (index + 1)}
                                    name={`${member}.question_text`}
                                    placeholder="Question"
                                    id="brand"
                                    type="text"
                                    component={customInput} />
                            </fieldset>
                            <button type="button" class="normal-bnt" onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button>
                        </div>
                        {/* quiz choice here */}
                        <FieldArray name={`${member}.answers`} component={this.renderOptions} />
                        <div className="max-cho-t-show">
                            <fieldset className="sf-form select-wibg">
                                <Field
                                    label={"Max choices to show"}
                                    name="max_choices"
                                    id="brand"
                                    type="text"
                                    component={customInput} />
                            </fieldset>
                        </div>
                    </div>
                </TabPane>
                <TabPane tab="True/False" key="2"
                // onclick={() => { this.props.change(`question_answers[${index}].question_type`, "2") }}
                >
                    <div className="quiz-contnt">
                        {/* quiz choice here */}
                        <div className="tbs-qz-cont">
                            <div className="tbs-quiz-choice">
                                <fieldset className="sf-form select-wibg">
                                    <Field
                                        label={"Question #" + (index + 1)}
                                        name={`${member}.question_text`}
                                        placeholder="Question"
                                        id="brand"
                                        type="text"
                                        component={customInput} />
                                </fieldset>
                                <button type="button" class="normal-bnt" onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button>

                                <Field label="Select if true" name={`${member}.answers[0].correct`}
                                    onChange={() => this.props.change(`question_answers[${index}].answers[0].answer_text`, "True")} component={CustomCheckbox} />
                                <Field label="Select if false" name={`${member}.answers[1].correct`} component={CustomCheckbox}
                                    onChange={() => this.props.change(`question_answers[${index}].answers[1].answer_text`, "False")} />
                            </div>
                        </div>
                    </div>
                </TabPane>
                {submitFailed && error && <span className="error-input">{error}</span>}
            </Tabs>))
        }
            <div className="d-flex justify-content-end mt-3">
                <button type="button" className="normal-bnt add-task-bnt add-line-bnt"
                    onClick={() => fields.push({ question_type: "1" })}>
                    <span className="material-icons">add</span> Add Quiz</button>
            </div>
        </>
    }

    render() {
        const { handleSubmit, formValues } = this.props;
        const uploadPicProps = {
            beforeUpload: file => {
                this.props.change("fileList", [file]);
                this.props.change("file", file);
                return false;
            },
            multiple: false,
            onChange: (info) => {
                // this.setState({ fileList: [info.file] })
            },
            accept: ".jpeg,.jpg,.png,.pdf,.docx,.doc",
            fileList: formValues.fileList ? formValues.fileList : [],
            onRemove: () => {
                this.props.change("fileList", []);
                this.props.change("file", undefined)
            },
        }

        return (
            <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h4 className="sf-sm-hd sf-pg-heading">Add New Module</h4>
                </div>
                <div className="sf-card-body">
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <fieldset className="form-group sf-form select-wibg">
                            <Field
                                label={Strings.ind_name}
                                name="name"
                                placeholder={Strings.ind_name}
                                type="text"
                                component={customInput} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={"Course Description"}
                                placeholder={"Course Description"}
                                name="description"
                                type="text"
                                id="notes"
                                component={customTextarea} />
                        </fieldset>
                        <div className="logo-upload scope-upload form-group sf-form">
                            <label className="mb-2">Add Content File</label>
                            <Dragger
                                {...uploadPicProps}>
                                <p className="ant-upload-drag-icon">
                                    <i className="material-icons">cloud_upload</i>
                                </p>
                                <p className="ant-upload-text">Choose file to upload</p>
                                <p className="ant-upload-hint">
                                    {Strings.img_drag_drop_text}
                                </p>
                            </Dragger>
                        </div>
                        <fieldset className="form-group sf-form select-wibg">
                            <Field
                                label={"External Provider Name"}
                                name="external_provider_name"
                                placeholder={"External Provider Name"}
                                id="brand"
                                type="text"
                                component={customInput} />
                        </fieldset>
                        <fieldset className="form-group sf-form select-wibg">
                            <Field
                                label={"External Link"}
                                name="external_provider_link"
                                placeholder={"https://"}
                                id="brand"
                                type="text"
                                component={customInput} />
                        </fieldset>
                        <fieldset className="form-group sf-form select-wibg trtc-minut">
                            <Field
                                label={"Time Required To Complete"}
                                name="duration"
                                id="brand"
                                type="text"
                                component={customInput} />
                            <div className="trtc-mt">
                                <span>minutes</span>
                                <button type="button" className="bnt"><i className="material-icons">gavel</i></button>
                            </div>
                        </fieldset>
                        <fieldset className="form-group sf-form select-wibg autoheight-box">
                            <Field
                                label={"Content Tags"}
                                name="tags"
                                id="brand"
                                type="text"
                                mode="tags"
                                options={[{ title: "Tag 1", value: "Tag 1" }, { title: "Tag 2", value: "Tag 2" },
                                { title: "Tag 3", value: "Tag 3" }]}
                                component={CustomSelect} />
                        </fieldset>
                        {/* question */}
                        <div className="quiz-tabs-wrap">
                            <FieldArray name="question_answers" component={this.renderQuestions} />

                            {/* quiz settings */}
                            <div className="quiz-settings">
                                <h2 className="qz-hding">Quiz Settings</h2>
                                <Field label="This quiz is mandatory" name="quiz_mandatory" component={CustomCheckbox} />
                                <div className="qz-st-pass">
                                    <h3>To pass user must get </h3>
                                    <div className="qz-st-input">
                                        <fieldset className="sf-form">
                                            <Field
                                                name="number_to_pass"
                                                id="brand"
                                                type="number"
                                                component={customInput} />
                                        </fieldset>
                                        <span className="qz-or">of</span>
                                        <fieldset className="sf-form">
                                            <Field
                                                placeholder="2"
                                                name="questions_to_display"
                                                id="brand"
                                                type="number"
                                                component={customInput} />
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        {/* button */}
                        <div className="all-btn multibnt mt-4">
                            <div className="btn-hs-icon d-flex justify-content-between">
                                <button className="bnt bnt-normal" type="button" onClick={this.props.onCancle}>Cancel</button>
                                <button type="submit" className="bnt bnt-active">Save</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        formValues: state.form.AddModule && state.form.AddModule.values ?
            state.form.AddModule.values : {}
    }

}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
    };
};

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: "AddModule", enableReinitialize: true,
        validate,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(AddModule);
