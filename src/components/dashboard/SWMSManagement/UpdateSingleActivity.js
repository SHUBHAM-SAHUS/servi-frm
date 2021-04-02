import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { notification } from 'antd';
import { reduxForm } from 'redux-form';
import * as action from '../../../actions/SWMSAction';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import { cutomExpandableText } from '../../common/cutomExpandableText';
import { countryCodes } from '../../../dataProvider/countryCodes';
import validator from 'validator';
import { ValidationStrings } from './../../../dataProvider/localize'
import { DeepTrim, calculateRisk } from '../../../utils/common';
import { VALIDATE_STATUS } from '../../../dataProvider/constant';
import { CustomSwitch } from '../../common/customSwitch';
import { customTextarea } from '../../common/customTextarea';
import { extactOptionsFroDefaults } from './ViewEditSWMSActivity';
import { validate } from "../../../utils/Validations/SWMSValidation";
import emailEditor from '../../common/EmailEditor';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { ContentState, EditorState, convertToRaw } from 'draft-js';

const required = value => value ? undefined : "Required"

class UpdateSingleActivity extends React.Component {



    onSubmit = async (formData) => {
        formData.active = +formData.active;
        formData = await DeepTrim(formData);

        this.props.updateSWMS(formData, formData.organisation_id)
            .then((flag) => {
                this.props.reset();
                this.props.removeInlineCat(this.props.initialValues);
            })
            .catch((error) => {
                if (error.status == VALIDATE_STATUS) {
                    notification.warning({
                        message: Strings.validate_title,
                        description: error && error.data && typeof error.data.message == 'string'
                            ? error.data.message : Strings.generic_validate,
                        onClick: () => { },
                        className: 'ant-warning'
                    });
                } else {
                    notification.error({
                        message: Strings.error_title,
                        description: error && error.data && error.data.message && typeof error.data.message == 'string'
                            ? error.data.message : Strings.generic_error,
                        onClick: () => { },
                        className: 'ant-error'
                    });
                }
            });

    }

    componentDidMount() {

    }

    editorState = (value, fieldName) => {
        var body = value ? value : '';

        const html = body
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.props.change(`${fieldName}_temp`, editorState)
            return editorState
        }
    }

    onEditorStateChange = (editorState, fieldName) => {
        this.props.change(`${fieldName}_temp`, editorState)
        this.props.change(fieldName, draftToHtml(convertToRaw(editorState.getCurrentContent())))
    };


    render() {

        const { handleSubmit, initialValues } = this.props;

        return (
            <form className="tr" onSubmit={handleSubmit(this.onSubmit)} key={initialValues.id}>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`activity`}
                            // placeholder={"Activity Name"}
                            type="text"
                            component={customInput}
                        />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`swms_category_id`}
                            type="name"
                            options={this.props.orgSWMS.swms_cat ? this.props.orgSWMS.swms_cat.map(obj => ({ value: obj.id, title: obj.category })) : []}
                            component={CustomSelect} dropdownMatchSelectWidth="true" />
                    </fieldset>
                </span>

                <span className="td">
                    <fieldset className="sf-form">
                        {/* <Field
                            name={`hazard`}
                            component={cutomExpandableText} /> */}
                        <Field
                            name={`hazard_temp`}
                            type="text"
                            component={emailEditor}
                            // toolbarCustomButtons={[<CustomOption />]}
                            options={['list']}
                            editorState={this.props.formValues && this.props.formValues.hazard_temp
                                ? this.props.formValues.hazard_temp : this.editorState(initialValues.hazard, 'hazard')}
                            onEditorStateChange={(editorState) => this.onEditorStateChange(editorState, 'hazard')}
                            validate={required}

                        />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`likelihood_before_controls`}
                            type="name"
                            options={this.props.likelyhoodBeforeControls ? this.props.likelyhoodBeforeControls.map(obj => ({
                                value: obj.id,
                                title: obj.order + ". " + obj.name
                            })) : []}
                            component={CustomSelect} dropdownMatchSelectWidth="true" />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`consequence_before_controls`}
                            type="name"
                            options={this.props.consequenceBeforeControls ? this.props.consequenceBeforeControls.map(obj => ({
                                value: obj.id,
                                title: obj.order + ". " + obj.name
                            })) : []}
                            component={CustomSelect} dropdownMatchSelectWidth="true" />
                    </fieldset>
                </span>
                <span className="td">
                    <label>{
                        calculateRisk(
                            this.props.likelyhoodBeforeControls && this.props.likelyhoodBeforeControls
                                .find(like => like.id == (this.props.formValues && this.props.formValues.likelihood_before_controls)) ?
                                this.props.likelyhoodBeforeControls
                                    .find(like => like.id == (this.props.formValues && this.props.formValues.likelihood_before_controls)) : null,
                            this.props.consequenceBeforeControls && this.props.consequenceBeforeControls
                                .find(conse => conse.id == (this.props.formValues && this.props.formValues.consequence_before_controls)) ?
                                this.props.consequenceBeforeControls
                                    .find(conse => conse.id == (this.props.formValues && this.props.formValues.consequence_before_controls)) : null
                        )
                    }</label>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        {/* <Field
                            name={`control_measures`}
                            component={cutomExpandableText} /> */}
                        <Field
                            name={`control_measures_temp`}
                            type="text"
                            component={emailEditor}
                            // toolbarCustomButtons={[<CustomOption />]}
                            options={['list']}
                            editorState={this.props.formValues && this.props.formValues.control_measures_temp
                                ? this.props.formValues.control_measures_temp : this.editorState(initialValues.control_measures, 'control_measures')}
                            onEditorStateChange={(editorState) => this.onEditorStateChange(editorState, 'control_measures')}
                            validate={required}

                        />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`likelihood_after_controls`}
                            type="name"
                            options={this.props.likelyhoodBeforeControls ? this.props.likelyhoodBeforeControls.map(obj => ({
                                value: obj.id, title:
                                    obj.order + ". " + obj.name
                            })) : []}
                            component={CustomSelect} dropdownMatchSelectWidth="true" />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`consequence_after_controls`}
                            type="name"
                            options={this.props.consequenceBeforeControls ? this.props.consequenceBeforeControls.map(obj => ({
                                value: obj.id, title:
                                    obj.order + ". " + obj.name
                            })) : []}
                            component={CustomSelect} dropdownMatchSelectWidth="true" />
                    </fieldset>
                </span>
                <span className="td">
                    <label>{calculateRisk(
                        this.props.likelyhoodBeforeControls && this.props.likelyhoodBeforeControls
                            .find(like => like.id == (this.props.formValues && this.props.formValues.likelihood_after_controls)) ?
                            this.props.likelyhoodBeforeControls
                                .find(like => like.id == (this.props.formValues && this.props.formValues.likelihood_after_controls)) : null,
                        this.props.consequenceBeforeControls && this.props.consequenceBeforeControls
                            .find(conse => conse.id == (this.props.formValues && this.props.formValues.consequence_after_controls)) ?
                            this.props.consequenceBeforeControls
                                .find(conse => conse.id == (this.props.formValues && this.props.formValues.consequence_after_controls)) : null
                    )} </label>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`person_responsible`}
                            type="name"
                            component={customInput} />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form defaults-activity autohtxtbox">
                        <Field
                            name={`defaults`}
                            mode="multiple"
                            options={extactOptionsFroDefaults(this.props.orgSWMS)}
                            component={CustomSelect} dropdownMatchSelectWidth="true" />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`active`}
                            component={CustomSwitch}
                        // onChange={(val) => this.props.Change(`active`, +val)}
                        />
                    </fieldset>
                </span>
                <span className="td">
                    <button className='delete-bnt' type='submit' >
                        <i class="material-icons">save</i>
                    </button>
                    <button className='delete-bnt' type='button' onClick={() => this.props.removeInlineCat(this.props.initialValues)} >
                        <i class="material-icons">close</i>
                    </button>
                </span>
            </form>

        )
    }
}

const mapStateToProps = (state, { serviceObject, initialValues }) => {
    return {
        orgSWMS: state.swmsReducer.orgSWMS,
        likelyhoodBeforeControls: state.likelyhoodBeforeControl.likelyhoodBeforeControls,
        consequenceBeforeControls: state.beforeConsequenceControl && state.beforeConsequenceControl.consequenceBeforeControls,
        formValues: state.form['UpdateSingleActivity' + initialValues.id] && state.form['UpdateSingleActivity' + initialValues.id].values,
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({ enableReinitialize: true, validate })
)(UpdateSingleActivity)