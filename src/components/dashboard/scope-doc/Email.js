import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../actions/scopeDocActions';
import * as actionEmail from '../../../actions/emailTemplateAction'
import { validate } from '../../../utils/Validations/emailQuoteValidation';
import * as accessControlAction from '../../../actions/accessControlManagementAction';
import { customInput } from '../../common/custom-input';
import { CustomCheckbox } from '../../common/customCheckbox';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import EmailEditor from '../../common/EmailEditor';
import { Modal, Dropdown, notification, Tag } from 'antd';
import { goBack, handleFocus, goBackBrowser } from '../../../utils/common';
import { getStorage } from '../../../utils/common';
import draftToHtml from 'draftjs-to-html';
import MyDocument from './ScopeDocQuotePdf';
import { pdf } from '@react-pdf/renderer';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { DeepTrim } from '../../../utils/common';

class QuoteEmail extends React.Component {

  blobData = ''

  constructor(props) {
    super(props);
    this.state = {
      togleSearch: true,
      toggleCc: false,
      toggleBcc: false,
      editorState: '',
      attachment: [],
    }
  }

  componentDidMount(props) {
    const slug = 'quote_to_client' // sending static value for slug
    this.props.emailAction.getEmailTemplateContent(slug)
      .then(flag => {
        this.editorState();
      }).catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.success_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        })
      });
    this.printDocument()
  }

  static getDerivedStateFromProps(props, state) {
    console.log(props.selectedScopeDoc)
  }

  createScopeDocHandler = () => {
    this.props.history.push(this.props.match.path + '/createScopeDoc')
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

  goToBack = () => {
    // goBack(this.props)
    goBackBrowser(this.props);
  }

  printDocument() {
    var obj = pdf(<MyDocument selectedScopeDocs={this.props.selectedScopeDoc} />).toBlob();

    obj.then(function (blob) {
      // var url = URL.createObjectURL(blob);
      // window.open(url, '_blank');
      return Promise.resolve(blob)
    }).then((res) => {

      this.blobData = res
    })
  }

  onSubmit = async formData => {
    formData = await DeepTrim(formData);

    var formValues = { ...formData }
    var content = ''
    var quote_id = ''
    formValues.scope_doc_id = this.props.selectedScopeDoc.id

    if (!formValues.send_me_copy) {
      formValues.send_me_copy = "0"
    } else {
      formValues.send_me_copy = "1"
    }


    content = this.state.editorState === '' ? '' : draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))

    formValues.body = content;

    let quote = this.props.selectedScopeDoc.quotes.map(quote => {
      if (quote.quote_number === this.props.selectedScopeDoc.quote_number) {
        quote_id = quote.id
      }
    })
    formValues.quote_id = quote_id
    formValues.quote_number = this.props.selectedScopeDoc.quote_number

    var finalFormData = new FormData();
    Object.keys(formValues).forEach(key => {
      finalFormData.append(key, JSON.stringify(formValues[key]))
    });

    this.state.attachment.forEach(attach => {
      finalFormData.append('attachment', attach);
    })


    this.props.action.sendQuoteEmail(this.props.selectedScopeDoc.id, finalFormData)
      .then((res) => {
        notification.success({
          message: Strings.success_title,
          description: "Email Sent",
          onClick: () => { },
          className: 'ant-success'
          // onOK: goBack(this.props)
        });
        // goBack(this.props)
        goBackBrowser(this.props)
      }).catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  editorState = () => {
    var body = this.props.selectedMailContent && this.props.selectedMailContent.body ? this.props.selectedMailContent.body : '';

    if (body.includes("{{quote_number}}")) {
      body = body.replace("{{quote_number}}", this.props.selectedScopeDoc && this.props.selectedScopeDoc.quote_number)
    }
    if (body.includes("{{user_name}}")) {
      body = body.replace("{{user_name}}", JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
        (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : "") : "")
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

  onEditorStateChange = (editorState) => {
    this.setState({
      editorState,
    });
  };

  handleFileUpload = (file) => {
    var arrayFile = this.state.attachment
    arrayFile.push(file)
    this.setState({ attachment: arrayFile });
  }

  removeAttachment = (index, evt) => {
    var arrayFile = this.state.attachment;
    evt.preventDefault();
    arrayFile.splice(index, 1);
    this.setState({ attachment: arrayFile });
  }

  render() {
    const { handleSubmit, selectedScopeDoc, formValues } = this.props;
    return (
      <div id="pdfprint" className={this.state.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <form onSubmit={handleSubmit(this.onSubmit)} >
          <div className="sf-card-wrap">
            <div className="sf-card scope-v-value">
              <div className="sf-card-head d-flex justify-content-between align-items-start">
                <div className="doc-vlue">Scope Document #:
                  <span>{selectedScopeDoc.scope_doc_code}<i class="material-icons">lock</i></span>
                  <div className="quote doc-vlue">Quote #: <span>{this.props.selectedScopeDoc && this.props.selectedScopeDoc.quote_number}</span></div>
                </div>
                <strong className="doc-v-usr"><span>{selectedScopeDoc.role_name}:</span>{selectedScopeDoc.organisation_name}</strong>
              </div>
            </div>

            <div className="sf-card mt-4">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">{Strings.send_quote}</h2>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body">
                <div className="user-p-notxt send-email d-flex justify-content-start">
                  <img alt="" src="/images/owl-img.png" />
                  <span>This quote will be sent to {selectedScopeDoc ? selectedScopeDoc.client.name : ''} on email id {selectedScopeDoc ? selectedScopeDoc.client_person.email : ''}. If you wish to speak to the client and give them a heads up call them on their number {selectedScopeDoc ? selectedScopeDoc.client_person.phone : ''}.</span>
                </div>

                <div className="email-form">
                  <fieldset className="form-group sf-form bcc-userid">
                    <div className="cc-bcc-email">
                      <button onClick={(event) => this.handleCcToggle(event)} className="normal-bnt">Cc</button>
                      <button onClick={(event) => this.handleBccToggle(event)} className="normal-bnt">Bcc</button>
                    </div>
                    <Field
                      label={Strings.from_txt}
                      name="from"
                      type="text"
                      id="name"
                      component={customInput} />
                  </fieldset>
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.to_txt}
                      name="to"
                      type="text"
                      id="name"
                      component={customInput} />
                  </fieldset>
                  {/* cc and bcc fields here */}
                  <div className="bcc-fields">
                    <fieldset className={this.state.toggleCc ? 'form-group sf-form' : 'form-group sf-form d-none'}>
                      <Field
                        label="CC"
                        name="cc"
                        type="text"
                        id="name"
                        component={customInput} />
                    </fieldset>
                    <fieldset className={this.state.toggleBcc ? 'form-group sf-form' : 'form-group sf-form d-none'}>
                      <Field
                        label="Bcc"
                        name="bcc"
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
                  <div className="form-group sf-form">
                    <label>{"Attachments"}</label>
                    <div>
                      {this.state && this.state.attachment
                        && this.state.attachment.map((att, index) => <Tag closable onClose={(evt) => this.removeAttachment(index, evt)}>
                          {att.name}
                        </Tag>)}
                    </div>
                  </div>
                  <div className="form-group sf-form rich-textbox">
                    <label>{Strings.message_txt}</label>
                    <div className="sf-rich-txtbox">
                      <fieldset>
                        <Field
                          name="body"
                          type="text"
                          id="name"
                          editorState={this.state.editorState === '' ? this.editorState() : this.state.editorState}
                          onEditorStateChange={this.onEditorStateChange}
                          callBackUpload={this.handleFileUpload}
                          component={EmailEditor} />

                      </fieldset>
                    </div>
                  </div>

                  <fieldset className="form-group sf-form email-checkbx">
                    <Field
                      label={Strings.send_me_copy_txt}
                      name="send_me_copy"
                      type="text"
                      id="name"
                      component={CustomCheckbox} />
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
          <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
            <div className="btn-hs-icon">
              <button type="button" className="bnt bnt-normal" onClick={this.goToBack}>
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
  var value = state.scopeDocs && state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : null;

  // var subject =
  //   state.emailTemplate
  //     && state.emailTemplate.emailTemplateList
  //     && state.emailTemplate.emailTemplateList[0]
  //     && state.emailTemplate.emailTemplateList[0].subject
  //     ? state.emailTemplate.emailTemplateList[0].subject
  //     : []

  // if (subject.includes("{{quote_number}}")) {
  //   subject = subject.replace("{{quote_number}}", state.scopeDocs && state.scopeDocs.scopeDocsDetails &&
  //     state.scopeDocs.scopeDocsDetails[0] && state.scopeDocs.scopeDocsDetails[0].quote_number)
  // }

  // if (subject.includes("{{user_name}}")) {
  //   subject = subject.replace("{{user_name}}", JSON.parse(getStorage(ADMIN_DETAILS)) && JSON.parse(getStorage(ADMIN_DETAILS)).name)
  // }

  var initialOrgData = {}
  // if (value) {
  //   initialOrgData = {
  //     from: JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).email_address : this.props.emailTemplateList.from_email,
  //     subject: subject,
  //     to: "rupesh@tangible.tech",
  //   }
  // }

  var subject =
    state.emailTemplate
      && state.emailTemplate.emailTemplateContent
      && state.emailTemplate.emailTemplateContent[0]
      && state.emailTemplate.emailTemplateContent[0].subject
      ? state.emailTemplate.emailTemplateContent[0].subject
      : ''

  var to = value
    && value.client_person
    && value.client_person.email
    ? value.client_person.email
    : ''

  if (subject.includes("{{quote_number}}")) {
    subject = subject.replace("{{quote_number}}", state.scopeDocs && state.scopeDocs.scopeDocsDetails &&
      state.scopeDocs.scopeDocsDetails[0] && state.scopeDocs.scopeDocsDetails[0].quote_label)
  }

  if (subject.includes("{{job_name}}")) {
    subject = subject.replace("{{job_name}}", state.scopeDocs && state.scopeDocs.scopeDocsDetails &&
      state.scopeDocs.scopeDocsDetails[0] && state.scopeDocs.scopeDocsDetails[0].job_name)
  }

  if (subject.includes("{{user_name}}")) {
    subject = subject.replace("{{user_name}}", JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
      (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : "") : "")
  }

  if (value && state.emailTemplate && state.emailTemplate.emailTemplateContent && state.emailTemplate.emailTemplateContent[0]) {
    initialOrgData = {
      from: state.emailTemplate.emailTemplateContent[0].from_email,
      to: to,
      subject: subject,
    }
  }
  // initialOrgData.attachment = []

  return {
    selectedMailContent: state.emailTemplate && state.emailTemplate.emailTemplateContent && state.emailTemplate.emailTemplateContent[0],
    selectedScopeDoc: (value ? value : {}),
    initialValues: initialOrgData,
    emailTemplateList: state.emailTemplate && state.emailTemplate.emailTemplateList &&
      state.emailTemplate.emailTemplateList[0] && state.emailTemplate.emailTemplateList[0] ? state.emailTemplate.emailTemplateList[0] : {}
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    accessControlAction: bindActionCreators(accessControlAction, dispatch),
    emailAction: bindActionCreators(actionEmail, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'QuoteEmail', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(QuoteEmail)