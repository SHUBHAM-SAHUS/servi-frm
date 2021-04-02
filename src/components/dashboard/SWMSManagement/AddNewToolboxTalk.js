import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Icon, Modal, Dropdown, Menu, notification, Upload, message } from 'antd';
import {
    reduxForm,
    Field,
    FieldArray
} from 'redux-form';
import $ from 'jquery';
import { validate } from '../../../utils/Validations/industryValidation';
import { customInput } from '../../common/custom-input';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { customTextarea } from '../../common/customTextarea';
import * as actions from '../../../actions/SWMSAction';
import { CustomSwitch } from '../../common/customSwitch'
import { Strings } from '../../../dataProvider/localize';
import { handleFocus, DeepTrim } from '../../../utils/common';
import emailEditor from '../../common/EmailEditor';
import { CustomOption } from '../../common/customInputEditorOption';
import draftToHtml from 'draftjs-to-html';
import { convertToRaw, ContentState, EditorState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import HtmlParser from 'react-html-parser';

const { Dragger } = Upload;

class AddNewToolboxTalk extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cardExpnadBtn: true }
    }

    onSubmit = async (formData) => {
        var finalForm = new FormData();
        formData.toolbox_talk_item = [];
        formData.item_id = [];
        formData.toolbox_talk_item_temp.forEach(itemArray => {
            if (this.props.toolboxTalkItems.find(item => item.id == itemArray.item_name)) {
                formData.item_id.push(parseInt(itemArray.item_name))
            } else {
                formData.toolbox_talk_item.push(itemArray);
            }
        })
        formData.toolbox_talk_attachments.forEach(attach => {
            if (attach.attachment_file && attach.attachment_file.length > 0) {
                finalForm.append("attachments", attach.attachment_file[0]);
            }
        })
        formData = await DeepTrim(formData);
        Object.keys(formData).forEach(key => {
            if (key == "toolbox_talk_attachments" || key == "toolbox_talk_item" || key == "item_id") {
                finalForm.append(key, JSON.stringify(formData[key]))
            }
            else
                finalForm.append(key, formData[key])
        }
        )
        if (this.props.initialValues && this.props.initialValues.id >= 0)
            this.props.updateToolbox(finalForm).then((flag) => {
                this.props.reset();
                this.props.onClose();
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
        else
            this.props.addToolbox(finalForm).then((flag) => {
                this.props.reset();
                this.props.onClose();
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });

    }

    shouldComponentUpdate(nextProps) {
        if (!nextProps.initialValues || !this.props.initialValues) {
            this.props.destroy("ViewEditToolBoxTalk");
        }
        else if (nextProps.initialValues.id !== this.props.initialValues.id) {
            this.props.destroy("ViewEditToolBoxTalk");
        }
        return true;
    }

    onEditorStateChange = (editorState, index) => {
        this.props.change(`toolbox_talk_item_temp[${index}].comment_temp`, editorState)
        this.props.change(`toolbox_talk_item_temp[${index}].comment`, draftToHtml(convertToRaw(editorState.getCurrentContent())))
    };

    editorState = (value, index) => {
        var body = value ? value : '';

        const html = body
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.props.change(`toolbox_talk_item_temp[${index}].comment_temp`, editorState)
            return editorState
        }
    }

    renderItems = ({ fields, meta: { error, submitFailed } }) => (
        <>
            {fields.length > 0 ?

                fields.map((member, index) => (<div className="tr">
                    <span className="td">
                        <fieldset className="sf-form">
                            <Field
                                name={`${member}.item_name`}
                                placeholder={"Tool Talk Item Name"}
                                type="text"
                                dataSource={this.props.toolboxTalkItems.map(item => ({ text: item.item_name, value: item.id }))}
                                component={CustomAutoCompleteSearch}
                            // onSelect={(value) => this.props.change("item_id",
                            //     [...this.props.formValues.item_id ? this.props.formValues.item_id : [], value])}
                            />
                        </fieldset>
                    </span>
                    <span className="td">
                        {this.props.toolboxTalkItems.find(item => this.props.formValues &&
                            this.props.formValues.toolbox_talk_item_temp
                            && this.props.formValues.toolbox_talk_item_temp[index] &&
                            item.id == this.props.formValues.toolbox_talk_item_temp[index].item_name) ?
                            <label>{
                                this.props.toolboxTalkItems.find(item => item.id == this.props.formValues.toolbox_talk_item_temp[index].item_name).item}</label>
                            :
                            < fieldset className="sf-form">
                                <Field
                                    name={`${member}.item`}
                                    placeholder={"Item"}
                                    type="text"
                                    component={customInput}
                                />
                            </fieldset>}
                    </span>
                    <span className="td dynamic-html-cnt">
                        {this.props.toolboxTalkItems.find(item => this.props.formValues &&
                            this.props.formValues.toolbox_talk_item_temp &&
                            this.props.formValues.toolbox_talk_item_temp[index] &&
                            item.id == this.props.formValues.toolbox_talk_item_temp[index].item_name
                        ) ?
                            <label>{
                                this.props.toolboxTalkItems.find(item =>
                                    item.id == this.props.formValues.toolbox_talk_item_temp[index].item_name
                                )
                                && HtmlParser(this.props.toolboxTalkItems.find(item =>
                                    item.id == this.props.formValues.toolbox_talk_item_temp[index].item_name
                                ).comment)}</label>
                            :
                            < fieldset className="sf-form">
                                <Field
                                    name={`${member}.comment_temp`}
                                    placeholder={"Comment"}
                                    type="text"
                                    component={emailEditor}
                                    toolbarCustomButtons={[<CustomOption />]}
                                    editorState={this.props.formValues && this.props.formValues.toolbox_talk_item_temp
                                        && this.props.formValues.toolbox_talk_item_temp[index]
                                        && this.props.formValues.toolbox_talk_item_temp[index].comment_temp
                                        ? this.props.formValues.toolbox_talk_item_temp[index].comment_temp : this.editorState(
                                            this.props.initialValues && this.props.initialValues.id && this.props.initialValues.toolbox_talk_item_temp
                                                && this.props.initialValues.toolbox_talk_item_temp[index] ?
                                                this.props.initialValues.toolbox_talk_item_temp[index].comment : "", index
                                        )}
                                    onEditorStateChange={(editorState) => this.onEditorStateChange(editorState, index)}

                                />
                            </fieldset>}

                    </span>
                    <span className="td">
                        <button type="button" className="delete-bnt delete-bnt" onClick={() => fields.remove(index)}>
                            <i className="fa fa-trash-o"></i></button>
                    </span>
                </div>))

                : null
            }
            <div className="btn-hs-icon sm-bnt bnt-error">
                <button type="button" class="normal-bnt add-task-bnt add-line-bnt" onClick={() => fields.push({})}>
                    <i class="material-icons">add</i><span>Add Item</span>
                </button>

                {submitFailed && error && <span className="error-input">{error}</span>}
            </div>
        </>

    )
    uploadPicProps = {
        multiple: false,
        accept: ".jpeg,.jpg,.png,.pdf,.doc,.docx",
        onRemove: this.removeFile

    };
    renderAttachments = ({ fields, meta: { error, submitFailed } }) => (
        <>
            {fields.length > 0 ?

                fields.map((member, index) => (<div className="tr">
                    <span className="td">
                        <fieldset className="form-group sf-form">
                            <Field
                                name={`${member}.attachment_name`}
                                type="text"
                                id="attachment_name"
                                component={customInput} />
                        </fieldset>
                    </span>
                    <span className="td">
                        <div className="logo-upload">
                            {this.props.initialValues && this.props.initialValues.toolbox_talk_attachments
                                && this.props.initialValues.toolbox_talk_attachments[index]
                                && this.props.initialValues.toolbox_talk_attachments[index]
                                && this.props.initialValues.toolbox_talk_attachments[index].file_name ?
                                <a download href={this.props.initialValues.toolbox_talk_attachments[index].file_name}>Download document</a>
                                : <Dragger  {...this.uploadPicProps}
                                    beforeUpload={(info) => {
                                        this.props.change(`toolbox_talk_attachments[${index}].attachment_file`, [info])
                                        return false
                                    }}
                                    fileList={this.props.formValues.toolbox_talk_attachments[index].attachment_file}
                                    onRemove={() => this.props.change(`toolbox_talk_attachments[${index}].attachment_file`, [])}
                                >
                                    <p className="ant-upload-drag-icon">
                                        <i class="anticon material-icons">cloud_upload</i>
                                    </p>
                                    <p className="ant-upload-text">{Strings.img_upload_text}</p>
                                </Dragger>}
                        </div>
                    </span>
                    <span className="td">
                        <button type="button" className="delete-bnt delete-bnt" onClick={() => fields.remove(index)}>
                            <i className="fa fa-trash-o"></i></button>
                    </span>
                </div>))

                : null
            }
            <div className="btn-hs-icon sm-bnt bnt-error">
                <button type="button" class="normal-bnt add-task-bnt add-line-bnt" onClick={() => fields.push({})}>
                    <i class="material-icons">add</i><span>Add Attachment</span>
                </button>

                {submitFailed && error && <span className="error-input">{error}</span>}
            </div>
        </>

    )

    render() {
        const { handleSubmit } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit)} className="antt-form">
                <div className="sf-card-wrap p-0 no-shadow">
                    <div className="sf-card">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h2 className="sf-pg-heading">Toolbox Talk</h2>
                            <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled overlay={''}>
                                    <i className="material-icons">more_vert</i>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="sf-card-body mt-2">
                            <div className="row">
                                <div className="col-md-4">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label="Toolbox Talk Name"
                                            name="toolbox_name"
                                            placeholder=""
                                            type="text"
                                            id="toolbox_name"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                            </div>
                            <div className="toolbox-table">
                                <div className="sf-c-table tbox-table">
                                    <div className="tr">
                                        <span className="th">Item Name</span>
                                        <span className="th">Item Description</span>
                                        <span className="th">Component</span>
                                        <span className="th"></span>
                                    </div>

                                    {/* use map from here */}
                                    <FieldArray name="toolbox_talk_item_temp" component={this.renderItems}></FieldArray>


                                </div>

                            </div>
                        </div>
                    </div>

                    {/* Attachment and Notes */}
                    <div className="sf-card mt-4">
                        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                            <h2 className="sf-pg-heading">Attachments/Notes</h2>
                            <div className="info-btn disable-dot-menu">
                                <Dropdown className="more-info" disabled overlay={''}>
                                    <i className="material-icons">more_vert</i>
                                </Dropdown>
                            </div>
                        </div>
                        <div className="sf-card-body mt-2">
                            <div className="toolbox-table tool-talk-attach">
                                <div className="sf-c-table tbox-table">
                                    <div className="tr">
                                        <span className="th">Attachment Name</span>
                                        <span className="th">Attachment</span>
                                        <span className="th"></span>
                                    </div>
                                    {/* use map from here */}
                                    <FieldArray name="toolbox_talk_attachments" component={this.renderAttachments}></FieldArray>


                                </div>

                            </div>

                            <fieldset className="sf-form form-group">
                                <Field
                                    label="Notes"
                                    name="notes"
                                    placeholder=""
                                    type="text"
                                    id=""
                                    component={customTextarea} />
                            </fieldset>

                        </div>
                    </div>
                </div>
                {/* buttons */}
                <div className="all-btn d-flex justify-content-end mt-4">
                    <div className="btn-hs-icon">
                        <button type="button" className="bnt bnt-normal"
                            onClick={() => { this.props.reset(); this.props.onClose(); }}>Cancel</button>
                    </div>
                    <div className="btn-hs-icon">
                        <button type="submit" className="bnt bnt-active">{Strings.save_btn}</button>
                    </div>
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        toolboxTalkItems: state.swmsReducer.toolboxTalkItems,
        formValues: state.form.addNewToolboxTalk && state.form.addNewToolboxTalk.values,
        // initialValues: { item_id: [] }
    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({
        form: 'addNewToolboxTalk', validate, onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        },
        enableReinitialize: true
    })
)(AddNewToolboxTalk)