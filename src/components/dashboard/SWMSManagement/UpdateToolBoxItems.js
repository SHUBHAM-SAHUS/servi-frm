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
import { countryCodes } from '../../../dataProvider/countryCodes';
import validator from 'validator';
import { ValidationStrings } from './../../../dataProvider/localize'
import { DeepTrim } from '../../../utils/common';
import { VALIDATE_STATUS } from '../../../dataProvider/constant';
import { CustomSwitch } from '../../common/customSwitch';
import { customTextarea } from '../../common/customTextarea';
import { validate } from "../../../utils/Validations/SWMSValidation";
import htmlToDraft from 'html-to-draftjs';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import emailEditor from '../../common/EmailEditor';
import { CustomOption } from '../../common/customInputEditorOption';

const required = value => value ? undefined : "Required"

class UpdateToolBoxItems extends React.Component {



    onSubmit = async (formData) => {
        formData.active = +formData.active;
        formData = await DeepTrim(formData);

        this.props.updateToolboxItems(formData, formData.organisation_id)
            .then((message) => {
                notification.success({
                    message: Strings.success_title,
                    description: message ? message : "",
                    onClick: () => { },
                    className: 'ant-success'
                });
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
    editorState = (value) => {
        var body = value ? value : '';

        const html = body
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.props.change(`comment_temp`, editorState)
            return editorState
        }
    }

    onEditorStateChange = (editorState) => {
        this.props.change(`comment_temp`, editorState)
        this.props.change(`comment`, draftToHtml(convertToRaw(editorState.getCurrentContent())))
    };


    render() {

        const { handleSubmit, initialValues } = this.props;

        return (
            <form className="tr" onSubmit={handleSubmit(this.onSubmit)} key={initialValues.id}>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`item_name`}
                            type="text"
                            placeholder={"Toolbox Item Name"}
                            validate={required}
                            component={customInput}
                        />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`item`}
                            placeholder={"Item"}
                            type="text"
                            component={customInput}
                        />
                    </fieldset>
                </span>
                <span className="td dynamic-html-add">
                    <fieldset className="sf-form">
                        <Field
                            name={`comment_temp`}
                            placeholder={"Comment"}
                            type="text"
                            toolbarCustomButtons={[<CustomOption />]}
                            component={emailEditor}
                            editorState={this.props.formValues && this.props.formValues.comment_temp
                                ? this.props.formValues.comment_temp : this.editorState(initialValues.comment)}
                            onEditorStateChange={(editorState) => this.onEditorStateChange(editorState)}
                            validate={required}

                        />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`active`}
                            component={CustomSwitch}
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
        formValues: state.form['UpdateToolBoxItems' + initialValues.id] && state.form['UpdateToolBoxItems'
            + initialValues.id].values,
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({ enableReinitialize: true, validate })
)(UpdateToolBoxItems)