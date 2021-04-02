import React from 'react';
import { Modal, Dropdown, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../actions/scopeDocActions';
import { JobDocsEmailvalidate } from '../../../utils/Validations/emailQuoteValidation';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { goBack, handleFocus } from '../../../utils/common';
import EmailEditor from '../../common/EmailEditor';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import { DeepTrim } from '../../../utils/common';


class ServiceAgentJobEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            toggleCc: false,
            toggleBcc: false,
            editorState: '',
            togleSearch: true,
        }
        this.props.change('from_field', "prasad@tangible.tech");

    }

    componentWillReceiveProps(newProps) {
        // this.state = {
        //     editorState: '',
        //     togleSearch: true,
        //     toggleCc: this.props.initialValues && this.props.initialValues.cc_field && this.props.initialValues.cc_field !== '' ? true : false,
        //     toggleBcc: this.props.initialValues && this.props.initialValues.bcc_field && this.props.initialValues.bcc_field !== '' ? true : false,
        // }
        // this.editorState()
    }

    editorState = () => {
        const html = "<p>Please click on below link to view documents,<br><br><a href='clickMe' target='_self'>clickMe</a>"
        //this.props.initialValues && this.props.initialValues.message && this.props.initialValues.message === '' ? "<p>Please click on below link to view documents,<br><br><a href='" + this.props.initialValues.job_doc_link + "' target='_self'>" + this.props.initialValues.job_doc_link + "</a><br><br>Kind &amp; Regards,<br>" + this.props.initialValues.from_profile + "</p>" : this.props.initialValues.message;
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

    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        });
    };

    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        var value = this.state.editorState === '' ? '' : draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
        formData.message = this.state.editorState === '' ? this.editorState() : value

        this.props.action.sendSwmsSheetEmail(formData)
            .then((res) => {
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
        const { handleSubmit, jobDocEmailDetails, selectedScopeDoc } = this.props;
        return (
            <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <div className="sf-card-wrap">
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.send_swms_sheet}</h2>
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
    var value = state.scopeDocs && state.scopeDocs.jobDocEmailDetails ? state.scopeDocs.jobDocEmailDetails : null;
    // if (value) {
    //     value = { ...value, message: this.editorState() }
    // }
    return {
        jobDocEmailDetails: (value ? value : {}),
        initialValues: (value ? value : {}),
        selectedScopeDoc: state.scopeDocs && state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails : {},
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'ServiceAgentJobEmail', validate: JobDocsEmailvalidate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(ServiceAgentJobEmail)