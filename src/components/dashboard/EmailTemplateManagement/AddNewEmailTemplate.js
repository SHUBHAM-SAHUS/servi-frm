import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Modal, Dropdown, Icon, notification } from 'antd';
import {
  reduxForm,
  Field
} from 'redux-form';
import $ from 'jquery';

import { customInput } from '../../common/custom-input';
import { CustomSwitch } from '../../common/customSwitch'
import { Strings } from '../../../dataProvider/localize';
import emailEditor from '../../common/EmailEditor';
import { getStorage, goBack, handleFocus } from '../../../utils/common';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, convertToRaw, ContentState } from 'draft-js';
import * as emailTemplateActions from '../../../actions/emailTemplateAction'
import { CustomSelect } from '../../common/customSelect';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
export class AddNewEmailTemplate extends Component {
  blobData = ''
  constructor(props) {
    super(props);
    this.state = {
      editorState: '',
      togleSearch: true,
      cardExpnadBtn: true,
      adminDetails: JSON.parse(getStorage('ADMIN_DETAILS'))
    }
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
    formData.temp_name = formData.name.split('---')[0].trim();
    formData.slug = formData.name.split('---')[1].trim();
    formData.body = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    formData.active = formData.active ? 1 : 0
    formData.from_email = formData.from_email.trim();
    formData.subject = formData.subject.trim();

    this.props.emailActions.saveEmailTemplate(formData)
      .then(() => {
        this.setState({ editorState: '' })
        this.props.reset()
        notification.success({
          message: Strings.success_title,
          description: "Template Saved",
          onClick: () => { },
          className: 'ant-success'
          // onOK: goBack(this.props)
        });
        goBack(this.props)
        this.props.emailActions.getAllEmailTemplates()
      })
      .then(() => {

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

  render() {
    const { handleSubmit, emailTemplateDropdownsList } = this.props;
    return (
      // <div className="sf-page-layout">
      <div className={this.props.toggleSearch ? "col-md-9 sf-page-layout" : "col-md-9 col-md-srch"}>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="sf-card-wrap">
            <div className="card-expands">
              <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
            </div>
            <div className="sf-card">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">Email Template Details</h2>
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
                      label={`Template ${Strings.user_table_name}`}
                      name="name"
                      id="name"
                      options={emailTemplateDropdownsList && emailTemplateDropdownsList.map(item => ({
                        title: item.template_name,
                        value: `${item.template_name}---${item.slug}`
                      }))}
                      component={CustomSelect} />
                  </fieldset>
                  <fieldset className="form-group sf-form bcc-userid">
                    <Field
                      label={Strings.from_txt}
                      name="from_email"
                      placeholder={Strings.from_email_temp}
                      type="text"
                      id="from_email"
                      component={customInput} />
                  </fieldset>
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.subject_txt}
                      name="subject"
                      placeholder={Strings.subject_email_temp}
                      type="text"
                      id="subject"
                      component={customInput} />
                  </fieldset>
                  <div className="form-group sf-form rich-textbox">
                    <label>{Strings.message_txt}</label>
                    <div className="sf-rich-txtbox">
                      <fieldset>
                        <Field
                          name="message"
                          type="text"
                          id="message"
                          editorState={this.state.editorState === '' ? this.editorState() : this.state.editorState}
                          onEditorStateChange={this.onEditorStateChange}
                          component={emailEditor} />
                      </fieldset>
                    </div>
                  </div>
                  <fieldset className="form-group sf-form">
                    <Field
                      name="active"
                      id="active"
                      label="Active"
                      component={CustomSwitch} />
                  </fieldset>
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
  templateList: state.emailTemplate.emailTemplateMastersList,
  emailTemplateDropdownsList: state.emailTemplate.emailTemplateDropdowns
})

const mapDispatchToProps = dispatch => {
  return {
    emailActions: bindActionCreators(emailTemplateActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addNewEmailTemplate',
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AddNewEmailTemplate)
