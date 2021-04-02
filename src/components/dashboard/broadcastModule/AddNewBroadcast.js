import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Dropdown, Icon, notification, Upload } from 'antd';
import {
    reduxForm,
    Field,
    isDirty
} from 'redux-form';
import $ from 'jquery';

import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import emailEditor from '../../common/EmailEditor';
import { getStorage, handleFocus } from '../../../utils/common';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { CustomDatepicker } from '../../common/customDatepicker';
import * as actions from '../../../actions/roleManagementActions';
import * as broadActions from '../../../actions/broadcastActions';
import moment from 'moment';
import { CustomSelect } from '../../common/customSelect';
import { braodcastValidate } from '../../../utils/Validations/broadcastValidation';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { customTextarea } from '../../common/customTextarea';


const Dragger = Upload.Dragger;

export class AddNewBroadcast extends Component {
    blobData = ''
    max_chars = 119;
    constructor(props) {
        super(props);
        this.state = {
            editorState: '',
            togleSearch: true,
            cardExpnadBtn: true,
            adminDetails: JSON.parse(getStorage('ADMIN_DETAILS')),
            fileList: [],
            chars_left: this.max_chars,
        }
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;

    }

    editorState = () => {
        var body = this.props.emailTemplateList && this.props.emailTemplateList.body ? this.props.emailTemplateList.body : '';

        const html = body
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            this.setState({
                editorState: editorState
            });
            return editorState
        }
    }

    onSubmit = (formData) => {
        formData.title = formData.title.split('---')[0].trim();
        formData.role = JSON.stringify(formData.roles)
        //formData.body = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        formData.send_date = moment(formData.send_date._d).format('YYYY-MM-DD HH:mm:ss');

        var finalFormData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'attachment') {
                formData[key].forEach(broadcastFile => {
                    finalFormData.append('files', broadcastFile.originFileObj)
                })
            }
            else {
                finalFormData.append(key, formData[key]);
            }
        });
        this.props.broadAction.addBroadcast(finalFormData)
            .then((message) => {
                this.setState({ editorState: '' })
                this.setState({ file: [] })
                this.props.reset()
                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                });
                this.props.broadAction.initBroadcast()
            })
            .catch(message => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            })
    }

    handleSearchToggle = () => {
        this.setState({ togleSearch: !this.state.togleSearch })
    }

    handleCcToggle = (event) => {
        event.preventDefault();
        this.setState({ toggleCc: !this.state.toggleCc })
    }

    handleBccToggle = (event) => {
        event.preventDefault();
        this.setState({ toggleBcc: !this.state.toggleBcc })
    }

    cancel = () => {
        this.props.onCancel();
    }

    componentDidMount(props) {
        this.props.action.getRoles(this.currentOrganization);
    }

    onEditorStateChange = (editorState) => {

        this.setState({
            editorState,
        });
    };

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    }

    handlePreUpload = (file, fileList) => {
        this.setState(prevState => {
            return {
                fileList: [...prevState.fileList, file]
            }
        })
        return false;
    }

    handleChange = info => {
        this.setState({ fileList: [...info.fileList] })
        if (this.state.fileList.length === 0 && info.file.status !== 'removed') {
            this.props.change('attachment', info.fileList)
        } else if (this.state.fileList.length > 0 && info.file.status !== 'removed') {
            this.props.change('attachment', info.fileList)
        }
    }

    handleRemove = file => {
        file.status = 'removed';
        this.setState(prevState => {
            const fileIndex = prevState.fileList.indexOf(file);
            const newFileList = prevState.fileList.slice();
            newFileList.splice(fileIndex, 1);
            if (newFileList.length > 0) {
                this.props.change('attachment', newFileList)
                return {
                    fileList: newFileList,
                };
            } else {
                delete this.props.formValues.attachment;
                return {
                    fileList: []
                }
            }
        });
    }

    onChangeBody = e => {
        let input = e.target.value;
        this.setState({
            chars_left: this.max_chars - input.length
        });
    }

    render() {
        const { handleSubmit, roles } = this.props;
        const attachmentProps = {
            accept: ".jpeg,.jpg,.png,.pdf,.docx",
            multiple: true,
            listType: "picture-card",
            fileList: this.state.fileList,
            beforeUpload: this.handlePreUpload,
            onChange: this.handleChange,
            onRemove: this.handleRemove,
        };

        return (
            // <div className="sf-page-layout">
            <div className={this.props.togleSearch ? "col-md-9 sf-page-layout" : "col-md-9 col-md-srch"}>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <div className="sf-card-wrap">
                        <div className="card-expands">
                            <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                                <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                        </div>
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">Broadcast Details</h2>
                                <div className="info-btn disable-dot-menu">
                                    <Dropdown className="more-info" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body">
                                <div className="email-form">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.broadcast_title_txt}
                                            placeholder={Strings.title_broadcast}
                                            name="title"
                                            id="title"
                                            type="text"
                                            component={customInput} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form bcc-userid">
                                        <Field
                                            label={Strings.broadcast_roles}
                                            name="roles"
                                            placeholder={Strings.roles_broadcast}
                                            id="roles"
                                            mode="multiple"
                                            filterOption={(input, option) => (
                                                option.props.children.toLowerCase()
                                                    .indexOf(input.toLowerCase()) >= 0
                                            )}
                                            options={roles && roles.map(role => ({
                                                title: role.name,
                                                value: role.id
                                            }))}
                                            component={CustomSelect} />
                                    </fieldset>
                                    <div className="form-group sf-form rich-textbox">
                                        <label>{Strings.body_txt}</label>
                                        <div className="sf-rich-txtbox">
                                            <fieldset>
                                                <Field
                                                    name="body"
                                                    placeholder="Body"
                                                    type="text"
                                                    id="body"
                                                    onChange={this.onChangeBody}
                                                    maxLength={this.max_chars}
                                                    // editorState={this.state.editorState === '' ? this.editorState() : this.state.editorState}
                                                    // onEditorStateChange={this.onEditorStateChange}
                                                    component={customTextarea} />
                                            </fieldset>
                                            <p>{this.state.chars_left}/{this.max_chars}</p>
                                        </div>
                                    </div>
                                    <div className="sf-form">
                                        <label>{Strings.broadcast_attachment_txt}</label>
                                        <div className="upload-sfv-file add-equipment-img upeqip-pic sm-drbx">
                                            <Dragger
                                                {...attachmentProps}>
                                                <p className="ant-upload-drag-icon">
                                                    <i class="material-icons">cloud_upload</i>
                                                </p>
                                                <p className="ant-upload-text">Choose file to upload</p>
                                                <p className="ant-upload-hint">
                                                    {Strings.img_drag_drop_text}
                                                </p>
                                            </Dragger>
                                        </div>
                                    </div>
                                    <div className="col-md-4 col-sm-6 col-sm-12">
                                        <fieldset className="form-group sf-form">
                                            <Field
                                                label={Strings.broadcast_date_time}
                                                placeholder={moment(new Date()).format('YYYY-MM-DD HH:mm:ss')}
                                                name="send_date"
                                                id="send_date"
                                                showTime
                                                component={CustomDatepicker} />
                                        </fieldset>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                            <div className="btn-hs-icon">
                                <button type="submit" className="bnt bnt-active">
                                    {Strings.save_btn}</button>
                            </div>
                        </div>
                    </div>
                    {/* <div className="all-btn d-flex justify-content-end mt-4">
            <div className="btn-hs-icon">
              <button type="submit" className="bnt bnt-active">
                <i class="material-icons">save</i> {Strings.save_btn}</button>
            </div>
          </div> */}
                </form>
            </div>
            //</div>
        );
    }
}

const mapStateToProps = (state) => ({
    roles: state.roleManagement.roles,
    isDirty: isDirty('AddNewBroadcast')(state),
    initialValues: { roles: [] },
    formValues: state.form && state.form.AddNewBroadcast && state.form.AddNewBroadcast.values,
})

const mapDispatchToProps = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
        broadAction: bindActionCreators(broadActions, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'AddNewBroadcast', validate: braodcastValidate,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(AddNewBroadcast)
