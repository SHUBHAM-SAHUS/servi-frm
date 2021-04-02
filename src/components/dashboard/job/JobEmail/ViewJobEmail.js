import React from 'react';
import { Dropdown, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../../actions/scopeDocActions';
import * as actionEmail from '../../../../actions/emailTemplateAction'
import { JobDocsEmailvalidate } from '../../../../utils/Validations/emailQuoteValidation';
import { customInput } from '../../../common/custom-input';
import { Strings } from '../../../../dataProvider/localize';
import { goBack, handleFocus } from '../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import { getStorage } from '../../../../utils/common';
import EmailEditor from './EmailEditor';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { withRouter } from 'react-router-dom';
import { DeepTrim } from '../../../../utils/common';

import { ERROR_NOTIFICATION_KEY } from '../../../../config';

class ViewJobEmail extends React.Component {
    job_doc_no;
    quote_number;
    client_id;
    org_id;
    constructor(props) {
        super(props);
        this.state = {
            toggleCc: false,
            toggleBcc: false,
            editorState: '',
            togleSearch: true
        }
        this.props.change('from_field', JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).email_address : this.props.emailTemplateList.from_email);
        var subject = this.props.emailTemplateList && this.props.emailTemplateList.subject ? this.props.emailTemplateList.subject : []
        if (subject.includes("{{job_number}}")) {
            subject = subject.replace("{{job_number}}", this.props.selectedScopDoc && this.props.selectedScopDoc.length > 0 && this.props.selectedScopDoc[0] && this.props.selectedScopDoc[0].job_doc_number)
        }
        if (subject.includes("{{user_name}}")) {
            subject = subject.replace("{{user_name}}", JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
                (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : '')
        }
        this.props.change('subject', subject);
        this.props.change('to_field', this.props.selectedScopDoc && this.props.selectedScopDoc.length > 0 && this.props.selectedScopDoc[0] && this.props.selectedScopDoc[0].client_person.email ? this.props.selectedScopDoc[0].client_person.email : '');
        this.props.change('from_profile', this.props.selectedScopDoc && this.props.selectedScopDoc.length > 0 && this.props.selectedScopDoc[0] && this.props.selectedScopDoc[0].organisation_name ? this.props.selectedScopDoc[0].organisation_name : '');
        this.props.change('client_id', this.props.selectedScopDoc && this.props.selectedScopDoc.length > 0 && this.props.selectedScopDoc[0] && this.props.selectedScopDoc[0].client_id ? this.props.selectedScopDoc[0].client_id : '');
        this.props.change('quote_number', this.props.selectedScopDoc && this.props.selectedScopDoc.length > 0 && this.props.selectedScopDoc[0] && this.props.selectedScopDoc[0].quote_number ? this.props.selectedScopDoc[0].quote_number : '')

        this.job_doc_no = this.props.selectedScopDoc && this.props.selectedScopDoc.length > 0 && this.props.selectedScopDoc[0] && this.props.selectedScopDoc[0].job_doc_number
        this.loginUserName = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " + JSON.parse(getStorage(ADMIN_DETAILS)).last_name : null;
        this.loginUserRoleName = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).role.role_name : null;
    }

    componentDidMount() {
        const slug = 'job_doc_to_client' // sending static value for slug
        this.job_doc_no = this.props.location && this.props.location.state && this.props.location.state.job_doc_number;
        this.quote_number = this.props.location && this.props.location.state && this.props.location.state.quote_number;
        this.client_id = this.props.location && this.props.location.state && this.props.location.state.client_id;
        this.org_id = this.props.location && this.props.location.state && this.props.location.state.org_id;

        this.props.emailAction.getEmailTemplate(slug)
            .then(flag => {
                this.editorState();
                var subject = this.props.emailTemplateList && this.props.emailTemplateList.subject ? this.props.emailTemplateList.subject : []
                if (subject.includes("{{job_number}}")) {
                    subject = subject.replace("{{job_number}}", this.props.location && this.props.location.state && this.props.location.state.job_doc_number)
                }
                if (subject.includes("{{user_name}}")) {
                    subject = subject.replace("{{user_name}}", JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " + JSON.parse(getStorage(ADMIN_DETAILS)).last_name : " ")
                }
                this.props.change('subject', subject);
            }).catch(message => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.success_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                })
            });
    }

    componentWillReceiveProps(newProps) {
        this.state = {
            editorState: '',
            togleSearch: true,
            toggleCc: this.props.initialValues && this.props.initialValues.cc_field && this.props.initialValues.cc_field !== '' ? true : false,
            toggleBcc: this.props.initialValues && this.props.initialValues.bcc_field && this.props.initialValues.bcc_field !== '' ? true : false,
        }
        this.editorState();
        if (this.props.jobDocEmailDetails && this.props.jobDocEmailDetails.to_field) {
            this.props.change('to_field', this.props.jobDocEmailDetails && this.props.jobDocEmailDetails.to_field);
        }
        if (this.props.jobDocEmailDetails && this.props.jobDocEmailDetails.subject) {
            this.props.change('subject', this.props.jobDocEmailDetails.subject);
        }
        this.props.change('from_field', JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).email_address : this.props.emailTemplateList.from_email);
    }

    editorState = () => {
        var body = this.props.emailTemplateList && this.props.emailTemplateList.body ? this.props.emailTemplateList.body : '';
        if (this.props.location && this.props.location.state && this.props.location.state.job_doc_number) {
            if (body.includes("{{link}}")) {
                body = body.replace("{{link}}", `<a href='${window.location.origin + '/job_docs_preview?job_doc_no=' + this.props.location.state.job_doc_number}' target='_blank'>click here</a>`)
            }
        }

        if (body.includes("{{user_name}}")) {
            body = body.replace("{{user_name}}", JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " + JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '')
        }
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
        this.props.history.push('/dashboard/jobDocuments');
        // goBack(this.props)
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSubmit = async formData => {
        const jobId = getStorage('JOB_ID');
        formData = await DeepTrim(formData);

        var formValues = { ...formData }
        var content = ''

        let jobLink = `${window.location.origin}/client/job-doc-preview/${jobId}`;

        // if (this.props.location && this.props.location.state && this.props.location.state.job_doc_number) {
        // }

        var value = this.state.editorState === '' ? '' : draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        formValues.message = this.state.editorState === '' ? this.editorState() : value

        delete formValues.job_doc_number;
        formValues.job_doc_link = jobLink
        formValues.job_doc_number = this.job_doc_no;
        formValues.quote_number = this.quote_number
        formValues.client_id = this.client_id;
        formValues.org_id = this.org_id
        this.props.action.sendJobDocEmail(formValues)
            .then((res) => {
                this.props.history.push('/dashboard/jobDocuments');
                notification.success({
                    message: Strings.success_title,
                    description: "Email Sent",
                    onClick: () => { },
                    className: 'ant-success'
                    //onOK: goBack(this.props)
                });
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }

    render() {
        const { handleSubmit, jobDocEmailDetails } = this.props;
        return (
            <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <div className="sf-card-wrap">
                        <div className="sf-card scope-v-value">
                            <div className="sf-card-head d-flex justify-content-between align-items-start">
                                <div className="doc-vlue">Document #:
                      <span>{this.props.location && this.props.location.state && this.props.location.state.job_doc_number}</span>
                                </div>
                                <strong className="doc-v-usr"><span>{this.loginUserRoleName}:</span>{this.loginUserName}</strong>
                            </div>
                        </div>
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.send_job_document}asdsad</h2>
                                <div className="info-btn disable-dot-menu">
                                    <Dropdown className="more-info" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body">
                                <div className="user-p-notxt send-email d-flex justify-content-start">
                                    <img alt="" src="/images/owl-img.png" />
                                    <span>This job document will be sent to {jobDocEmailDetails && jobDocEmailDetails.client && jobDocEmailDetails.client.name ? jobDocEmailDetails.client.name : ''}
                                        on email id {jobDocEmailDetails && jobDocEmailDetails.to_field ? jobDocEmailDetails.to_field : this.props.selectedScopDoc && this.props.selectedScopDoc.client_person && this.props.selectedScopDoc.client_person.email}.
                                        If you wish to speak to the client and give them a heads up call them on their number
                                    {jobDocEmailDetails && jobDocEmailDetails.client && jobDocEmailDetails.client.phone ? jobDocEmailDetails.client.phone : ''}.</span>
                                </div>
                                <div className="email-form">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.from_profile}
                                            name="from_profile"
                                            type="text"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form bcc-userid">
                                        <div className="cc-bcc-email">
                                            <button onClick={(event) => this.handleCcToggle(event)} className="normal-bnt">Cc</button>
                                            <button onClick={(event) => this.handleBccToggle(event)} className="normal-bnt">Bcc</button>
                                        </div>
                                        <Field
                                            label={Strings.from_txt}
                                            name="from_field"
                                            type="text"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.to_txt}
                                            name="to_field"
                                            type="text"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    {/* cc and bcc fields here */}
                                    <div className="bcc-fields">
                                        <fieldset className={this.state.toggleCc ? 'form-group sf-form' : 'form-group sf-form d-none'}>
                                            <Field
                                                label="Cc"
                                                name="cc_field"
                                                type="text"
                                                id="name"
                                                component={customInput} />
                                        </fieldset>
                                        <fieldset className={this.state.toggleBcc ? 'form-group sf-form' : 'form-group sf-form d-none'}>
                                            <Field
                                                label="Bcc"
                                                name="bcc_field"
                                                type="text"
                                                id="name"
                                                component={customInput} />
                                        </fieldset>
                                    </div>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.subject_txt}
                                            name="subject"
                                            type="text"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    <div className="form-group sf-form rich-textbox">
                                        <label>{Strings.message_txt}</label>
                                        <div className="sf-rich-txtbox">
                                            <fieldset>
                                                <Field
                                                    name="message"
                                                    type="text"
                                                    id="name"
                                                    editorState={this.state.editorState === '' ? this.editorState() : this.state.editorState}
                                                    onEditorStateChange={this.onEditorStateChange}
                                                    component={EmailEditor} />
                                            </fieldset>
                                        </div>
                                    </div>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.validity}
                                            name="validity"
                                            type="text"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                        <div className="btn-hs-icon">
                            <button type="button" className="bnt bnt-normal" onClick={this.cancel}>
                                {Strings.cancel_btn}</button>
                        </div>
                        <div className="btn-hs-icon">
                            <button type="submit" className="bnt bnt-active">
                                {Strings.send_btn}</button>
                        </div>
                    </div>
                </form>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    console.log("MY PROPS::::: ", ownProps);
    console.log("MY STATES::::: ", state);

    var value = {}
    value = state.scopeDocs && state.scopeDocs.jobDocEmailDetails ? state.scopeDocs.jobDocEmailDetails : null;
    return {
        jobDocEmailDetails: (value ? value : {}),
        initialValues: (value ? value : {}),
        selectedScopDoc: state.scopeDocs.scopeDocsDetails,
        emailTemplateList: state.emailTemplate && state.emailTemplate.emailTemplateList &&
            state.emailTemplate.emailTemplateList[0] ? state.emailTemplate.emailTemplateList[0] : {}
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
        emailAction: bindActionCreators(actionEmail, dispatch)
    }
}

export default compose(
    withRouter,
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'ViewJobEmail', validate: JobDocsEmailvalidate,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(ViewJobEmail)