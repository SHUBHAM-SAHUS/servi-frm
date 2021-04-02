import React, { Component } from 'react';
import {
  Icon,
  Menu,
  Modal,
  Dropdown,
  notification
} from 'antd';
import $ from 'jquery';
import { compose, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { goBack, handleFocus } from '../../../utils/common';
import { reduxForm, Field } from 'redux-form';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect'
import { CustomSwitch } from '../../common/customSwitch'
import emailEditor from '../../common/EmailEditor';
import { Strings } from '../../../dataProvider/localize';
import htmlToDraft from 'html-to-draftjs';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import ReactHtmlParser from 'react-html-parser';
import draftToHtml from 'draftjs-to-html';
import * as emailTemplateActions from '../../../actions/emailTemplateAction'

export class ViewEditEmailTemplate extends Component {

  state = {
    displayEdit: false,
    cardExpnadBtn: true,
    editorState: '',
  }

  onSubmit = (formData) => {
    formData.temp_name = formData.name.trim()
    formData.active = formData.active ? 1 : 0
    formData.slug = this.props.emailTemplateDetails[0].slug
    formData.body = draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    formData.from_email = formData.from_email.trim();
    formData.subject = formData.subject.trim();

    this.props.emailActions.editEmailTemplate(formData)
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
        this.props.emailActions.getEmailTemplateDetails(formData.slug)
      })
      .then(() => {
        this.setState({ displayEdit: false })
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  }

  handleEditClick = () => {
    this.setState({ displayEdit: true });
  }

  handleCancel = () => {
    this.setState({ displayEdit: false });
  }

  static getDerivedStateFromProps(props, state) {
    if (state && props.emailTemplateDetails && props.emailTemplateDetails[0] && props.emailTemplateDetails[0].slug.toString() !== props.location.state.toString()) {
      state.displayEdit = false
      state.editorState = ''
    }
  }

  editorState = () => {
    var body = this.props.emailTemplateDetails ? this.props.emailTemplateDetails[0].body : '';

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

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  render() {
    const { handleSubmit, emailTemplateDetails, emailTemplateDropdownsList } = this.props;
    var selectedTemplate = emailTemplateDetails && emailTemplateDetails[0]

    var menu = !this.state.displayEdit
      ? <Menu>
        <Menu.Item onClick={this.handleEditClick}>
          Edit
          </Menu.Item>
      </Menu>
      : <></>

    return (
      <div className={this.props.toggleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <div className="sf-card-wrap">
          {/* zoom button  */}
          <div className="card-expands">
            <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
              <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
          </div>
          <form onSubmit={handleSubmit(this.onSubmit)} >
            <div className="sf-card">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h2 className="sf-pg-heading">Email Template Details</h2>
                <div className="info-btn">
                  {/* Drop down for card */}
                  <Dropdown className="more-info" overlay={menu}>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                  {/*Drop down*/}
                </div>
              </div>

              {!this.state.displayEdit ?
                <div className="sf-card-body mt-2">
                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Name</label>
                        <span>{selectedTemplate ? selectedTemplate.temp_name : ''}</span>
                      </div>
                    </div>
                  </div>

                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>From</label>
                      <span>{selectedTemplate ? selectedTemplate.from_email : ''}</span>
                    </div>
                  </div>

                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>Subject</label>
                      <span>{selectedTemplate ? selectedTemplate.subject : ''}</span>
                    </div>
                  </div>

                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>Message</label>
                      <span>{selectedTemplate ? <div>{ReactHtmlParser(selectedTemplate.body)}</div> : ''}</span>
                    </div>
                  </div>

                  <div className="data-v-col">
                    <div className="view-text-value">
                      <label>Active</label>
                      <span>{selectedTemplate ? selectedTemplate.active ? 'true' : 'false' : null}</span>
                    </div>
                  </div>
                </div>
                :
                <div className="sf-card-body mt-2">
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.user_table_name}
                      name="name"
                      id="name"
                      options={emailTemplateDropdownsList && emailTemplateDropdownsList.map(item => ({
                        title: item.template_name,
                        value: item.template_name
                      }))}
                      component={CustomSelect} />
                  </fieldset>

                  <fieldset className="form-group sf-form">
                    <Field
                      label="From"
                      name="from_email"
                      placeholder={Strings.from_email_temp}
                      type="text"
                      id="from_email"
                      component={customInput} />
                  </fieldset>

                  <fieldset className="form-group sf-form">
                    <Field
                      label="Subject"
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
              }
            </div>
            {this.state.displayEdit ? <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt ">
              <div className="btn-hs-icon">
                <button onClick={this.handleCancel} className="bnt bnt-normal" type="button">
                  {Strings.cancel_btn}</button>
              </div>
              <div className="btn-hs-icon">
                <button type="submit" className="bnt bnt-active">
                  {Strings.update_btn}</button>
              </div>
            </div> : null}
          </form>
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    emailTemplateDetails: state.emailTemplate.emailTemplateDetails,
    emailTemplateDropdownsList: state.emailTemplate.emailTemplateDropdowns,
    initialValues: state.emailTemplate.emailTemplateDetails && state.emailTemplate.emailTemplateDetails[0]
      ? {
        ...state.emailTemplate.emailTemplateDetails[0],
        name: state.emailTemplate.emailTemplateDetails[0].temp_name
      }
      : {}
  }
}

const mapDispatchToProps = dispatch => {
  return {
    emailActions: bindActionCreators(emailTemplateActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: "viewEditEmailTemplate", enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ViewEditEmailTemplate)