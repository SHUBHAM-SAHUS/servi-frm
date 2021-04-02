import React from 'react';
import { Modal, Icon, Dropdown, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../../actions/SAJobMgmtAction';
import * as actionEmail from '../../../../actions/emailTemplateAction'
import { JobDocsEmailvalidate } from '../../../../utils/Validations/emailQuoteValidation';
import { customInput } from '../../../common/custom-input';
import { Strings } from '../../../../dataProvider/localize';
import EmailEditor from '../../../common/EmailEditor';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { pdf } from '@react-pdf/renderer';
import JobReportPdf from './JobReportPdf';
import { goBack, handleFocus, goBackBrowser } from '../../../../utils/common';
import { getStorage } from '../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant'
import { ERROR_NOTIFICATION_KEY } from '../../../../config';


class EmailJobReport extends React.Component {
    blobData = ''
    constructor(props) {
        super(props);
        this.state = {
            toggleCc: false,
            toggleBcc: false,
            editorState: '',
            togleSearch: true,
            adminDetails: JSON.parse(getStorage(ADMIN_DETAILS))
        }
        // this.props.change('from_field', "prasad@tangible.tech");
        this.props.change('from_field', this.props.emailTemplateList && this.props.emailTemplateList.from_email === '{{from}}' ? this.state.adminDetails.email_address : this.props.emailTemplateList.from_email);
        this.props.change('from_profile', this.state.adminDetails.role.role_name);
        this.props.change('to_field', this.props.job && this.props.job.quote && this.props.job.quote.client && this.props.job.quote.client.contact_person_email);

    }


    editorState = () => {
        var body = this.props.emailTemplateList && this.props.emailTemplateList.body ? this.props.emailTemplateList.body : '';

        if (body.includes("{{user_name}}")) {
            body = body.replace("{{user_name}}", this.state.adminDetails ? this.state.adminDetails.name + " " + (this.adminDetails.last_name ? this.adminDetails.last_name : '') : '')
        }
        if (body.includes("{{pdf_link}}")) {
            // body = body.replace("{{pdf_link}}", `<a href='${window.location.origin + '/job_report_preview?job_id=' + this.props.job.id + '&job_number=' + this.props.job.job_number}' target='_blank'>click here</a>`)
            body = body.replace("{{pdf_link}}", `<a href='${window.location.origin + '/job_report_preview?job_number=' + this.props.job.job_number}' target='_blank'>click here</a>`)
        }
        const html = body
        /*         `<p>Hello ${this.props.job.quote && this.props.job.quote.client.name},<br><br>
            Please find attached the Job report of job #${this.props.job.job_number} aginst quote #${this.props.job.quote && this.props.job.quote.quote_number}.
        You can also <a href='${window.location.origin + '/job_report_preview?job_id=' + this.props.job.id + '&job_number=' + this.props.job.job_number}' target='_blank'>click here</a> to view the job report.
                    
        Thanks and Regards
        ${this.state.adminDetails.name}
        ${this.state.adminDetails.organisation.name}` */
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
        this.props.onCancel();
    }

    componentDidMount(props) {
        const slug = 'job_cleaning_report' // sending static value for slug
        this.props.emailAction.getEmailTemplate(slug)
            .then(flag => {
                // this.props.change('from_field', "prasad@tangible.tech");
                this.editorState();
                this.props.change('from_field', this.props.emailTemplateList && this.props.emailTemplateList.from_email === '{{from}}' ? this.state.adminDetails.email_address : this.props.emailTemplateList.from_email);
                this.props.change('from_profile', this.state.adminDetails.role.role_name);
                this.props.change('to_field', this.props.job && this.props.job.quote && this.props.job.quote.client && this.props.job.quote.client.contact_person_email);
            }).catch(message => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.success_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                })
            });
        this.printDocument();
    }

    printDocument() {
        var obj = pdf(<JobReportPdf job={this.props.job} jobReports={this.props.jobReports} filePath={this.props.filePath} />).toBlob();

        obj.then(function (blob) {

            // var url = URL.createObjectURL(blob);
            // window.open(url, '_blank');
            return Promise.resolve(blob)
        }).then((res) => {

            this.blobData = res
        })
    }

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSubmit = formData => {
        var value = this.state.editorState === '' ? '' : draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        formData.message = this.state.editorState === '' ? this.editorState() : value
        formData = ({ ...formData, 'job_id': this.props.job.id, 'job_number': this.props.job.job_number, email_type: 'JOB_REPORT' });

        var finalFormData = new FormData();
        Object.keys(formData).forEach(key => {
            finalFormData.append(key, JSON.stringify(formData[key]))
        });
        finalFormData.append('attachment', this.blobData);
        this.props.action.sendEmailJobReport(finalFormData)
            .then((res) => {
                notification.success({
                    message: Strings.success_title,
                    description: "Email Sent",
                    onClick: () => { },
                    className: 'ant-success'
                    // onOK: goBack(this.props)
                });
                this.props.history.push({
                    pathname: '/dashboard/job-details',
                    state: {
                        jobNo: this.props.job.job_number
                    }
                })
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
        const { handleSubmit } = this.props;
        return (
            <div className="sf-page-layout">
                <div className="dash-header">
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() =>
                            // goBack(this.props)
                            goBackBrowser(this.props)
                        } />
                        {Strings.send_job_report}
                    </h2>
                </div>
                <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <div className="sf-card-wrap">
                            <div className="sf-card mt-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">{Strings.send_job_report}</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body">
                                    <div className="user-p-notxt send-email d-flex justify-content-start">
                                        <img alt="" src="/images/owl-img.png" />
                                        <span>This job document will be sent to on email id. If you wish to speak to the client and give them a heads up call them on their number.</span>
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
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                            {/* <div className="btn-hs-icon">
                                <button type="button" className="bnt bnt-normal" onClick={this.cancel}>
                                    {Strings.cancel_btn}</button>
                            </div> */}
                            <div className="btn-hs-icon">
                                <button type="submit" className="bnt bnt-active">
                                    {Strings.send_btn}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    var subject = state.emailTemplate && state.emailTemplate.emailTemplateList && state.emailTemplate.emailTemplateList[0] &&
        state.emailTemplate.emailTemplateList[0].subject ? state.emailTemplate.emailTemplateList[0].subject : []
    if (subject.includes("{{job_number}}")) {
        subject = subject.replace("{{job_number}}", state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] && state.sAJobMgmt.jobDetails.job_details[0].job_number)
    }
    return {
        /**change the hard coded job */
        // initialValues: ({ subject: `Job report for job #${"JSK100190919000"}` }),
        initialValues: ({ subject: subject }),
        selectedScopeDoc: state.scopeDocs && state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails : {},
        job: state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] ?
            state.sAJobMgmt.jobDetails.job_details[0] : {},
        jobReports: state.sAJobMgmt.jobReports,
        filePath: state.sAJobMgmt.filePath,
        emailTemplateList: state.emailTemplate && state.emailTemplate.emailTemplateList &&
            state.emailTemplate.emailTemplateList[0] && state.emailTemplate.emailTemplateList[0] ? state.emailTemplate.emailTemplateList[0] : {}
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
        emailAction: bindActionCreators(actionEmail, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'EmailJobReport', validate: JobDocsEmailvalidate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(EmailJobReport)