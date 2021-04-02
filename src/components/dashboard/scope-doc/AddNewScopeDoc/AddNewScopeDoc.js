import React from 'react';
import { Icon, Menu, Dropdown, notification } from 'antd';
import { reduxForm, Field, FieldArray, FormSection, getFormSyncErrors, focus } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import $ from 'jquery';
import { customInput } from '../../../common/custom-input';
import * as actions from '../../../../actions/roleManagementActions';
import * as rolePermissionAction from '../../../../actions/permissionManagementAction';
import * as scopeDocActions from '../../../../actions/scopeDocActions';
import { Strings } from '../../../../dataProvider/localize';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../../dataProvider/constant';
import { CustomDatepicker } from '../../../common/customDatepicker';
import { customTextarea } from '../../../common/customTextarea';
import { getStorage, } from '../../../../utils/common';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';
import { DeepTrim } from '../../../../utils/common';

import {
  isValidABN,
  abnRequired,
  jobNameRequired,
  clientNameRequired,
  primaryPersonRequired,
  clientAddressRequired,
  primaryPersonEmailIsEmail,
  primaryPersonEmailRequired,
  primaryPersonContactNumberRequired,
  primaryPersonContactNumberIsPhoneNumber
} from '../../../../utils/Validations/scopeDocValidation';
import AddSites from './AddSites'
import AddNotes from './AddNotes'
import moment from 'moment'
import { handleFocus } from '../../../../utils/common'
import emailEditor from '../../../common/EmailEditor';
import htmlToDraft from 'html-to-draftjs';
import { ContentState, EditorState, convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
class AddNewScopeDoc extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      cardExpnadBtn: true,
      personData: {},
      editAddress: false
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  componentDidMount() {
    this.props.scopeDocActions.getTaskTags()
  }

  componentWillReceiveProps(nextProps, state) {

  }

  menu = (
    <Menu>
      <Menu.Item onClick={() => this.handleEditClient()}>
        Edit Details
      </Menu.Item>
    </Menu>
  );

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);
    console.log("formData :::::: ", formData);

    formData.client = await DeepTrim(formData.client)
    const clientData = formData.client.id ? this.props.clientsList.find(client => client.id.toString() === formData.client.id.toString()) : undefined;
    console.log("clientData :::::: ", clientData);

    if (clientData) {
      formData.client.name = clientData.name;
      formData.client.address = clientData.address;
      formData.client.abn_acn = clientData.abn_acn;
    }

    const personData = formData.client.primary_contact_person_id ? this.props.primaryPersonsList.find(person => person.id.toString() === formData.client.primary_contact_person_id.toString()) : undefined;
    // console.log("personData",personData);
    if (personData) {
      formData.client.primary_contact_person = personData.name
      formData.client.phone = personData.phone
      formData.client.email = personData.email
      // formData.client.quote_requested_by = personData.quote_requested_by
    }

    formData.sites.forEach((site, index) => {
      // console.log("site before sub",site);
      // console.log("this.state",this.state);
      const selectedSite = this.state.personData && this.state.personData.sites && this.state.personData.sites.find(site1 =>
        site1.site.id.toString() === site.site_name.toString()
      )
      // console.log("selectedSite",selectedSite);
      if (selectedSite) {
        const refinedSite = (({ job_name, site_name, street_address, city, state, zip_code, country }) => ({
          job_name, site_name, street_address, city, state, zip_code, country
        }))(selectedSite.site)
        formData.sites[index] = { ...site, ...refinedSite, site_id: parseInt(site.site_name) };
      }
    })
    if (formData && formData.internal_notes && formData.internal_notes.length > 0) {
      let internal_notes = [];
      formData.internal_notes.forEach(note => {
        if (note.note) {
          internal_notes.push(note);
        }
      })
      formData.internal_notes = internal_notes;
    } else {
      formData.internal_notes = [];
    }

    this.props.scopeDocActions.addScopeDoc(formData)
      .then((data) => {
        this.props.afterSubmit();
        this.props.scopeDocActions.getScopeDocDetails(data.data.id).then((flag) => {
          this.props.history.push({ pathname: './showScopeDoc', state: data.data.id })
        })
        this.props.scopeDocActions.getClients(this.currentOrganization);
        notification.success({
          message: Strings.success_title,
          description: data && data.message ? data.message : Strings.generic_error, onClick: () => { },
          className: 'ant-success'
        });
      })
      .catch(error => {
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
      })
  }

  handleClientSelection = clientId => {
    this.setState({ hasEditedAddress: false, editAddress: false })
    this.props.scopeDocActions.getPrimaryPersons(clientId)
      .then(() => {
        this.props.change('client.id', parseInt(clientId))
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

  handlePersonSelection = personId => {
    this.props.scopeDocActions.getSitesListByClientPerson(this.props.formValues.client.name, personId)
      .then(() => {
        const personData = this.props.primaryPersonsList.find(person => person.id.toString() === personId.toString())
        this.setState(prevState => ({
          ...prevState,
          personData: personData
        }))

        this.props.change('client.primary_contact_person_id', parseInt(personId))
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

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  disableDate = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  handleEditAddress = () => {
    console.log(this.props.formValues.client.address)
    this.setState({ editAddress: true })
    if (!this.state.hasEditedAddress) {
      this.props.change('client.address', this.props.clientsList.find(client =>
        this.props.formValues.client && this.props.formValues.client.name && client.id == this.props.formValues.client.name
      ).address)
    } else {
      this.props.change('client.address', this.props.formValues.client.address)
    }
  }

  handleSaveAddress = () => {
    console.log(this.props.formValues.client.address);
    this.setState({ editAddress: false, hasEditedAddress: true })
  }

  onEditorStateChange = (editorState) => {
    this.props.change(`conditions_temp`, editorState)
    this.props.change(`conditions`, draftToHtml(convertToRaw(editorState.getCurrentContent())))
  };

  editorState = (value) => {
    var body = value ? value : '';

    const html = body
    const contentBlock = htmlToDraft(html);
    if (contentBlock) {
      const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
      const editorState = EditorState.createWithContent(contentState);
      return editorState
    }
  }

  render() {

    const { handleSubmit } = this.props;

    var selectedClient = false;
    var selectedPrimaryPerson = false;

    selectedClient = this.props.clientsList.find(client =>
      this.props.formValues.client && this.props.formValues.client.name ? client.id == this.props.formValues.client.name : false
    )

    if (selectedClient) {
      selectedPrimaryPerson = this.props.primaryPersonsList.find(person =>
        this.props.formValues.client && this.props.formValues.client.primary_contact_person ? person.id == this.props.formValues.client.primary_contact_person : false
      )
    }
    let activePrimaryPersonsList = [];
    if (this.props.primaryPersonsList) {
      activePrimaryPersonsList = this.props.primaryPersonsList.filter(item => item.active === 1);
    }
    // console.log("selectedClient",selectedClient);
    // console.log("selectedPrimaryPerson",selectedPrimaryPerson);
    const clientSection = (
      <div className="sf-card">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h2 className="sf-pg-heading">{Strings.client_details}</h2>
          <div className="info-btn disable-dot-menu">
            <Dropdown className="more-info" disabled overlay={this.menu}>
              <i className="material-icons">more_vert</i>
            </Dropdown>
          </div>
        </div>
        <div className="sf-card-body">
          <FormSection className="row" name="client">
            <div className="col-md-4 col-sm-12">
              <fieldset className="form-group sf-form select-wibg">
                <Field
                  label="Business/Client Name"
                  name="name"
                  placeholder={Strings.name_sdcd}
                  type="text"
                  dataSource={this.props.clientsList.map(client => ({
                    "text": client.name,
                    value: client.id
                  }))}
                  component={CustomAutoCompleteSearch}
                  validate={clientNameRequired}
                  onSelect={(value) => { this.handleClientSelection(value) }}
                />
              </fieldset>
            </div>
            <div className="col-md-4 col-sm-12">
              <fieldset className="form-group sf-form">
                <Field
                  label={Strings.org_pri_person}
                  id="primary_contact_person"
                  name="primary_contact_person"
                  placeholder={Strings.primary_contact_person_sdcd}
                  type="text"
                  validate={selectedPrimaryPerson ? [] : primaryPersonRequired}
                  dataSource={selectedClient ? activePrimaryPersonsList.map(person => ({
                    text: person.name,
                    value: person.id
                  })) : []}
                  component={CustomAutoCompleteSearch}
                  onSelect={(value) => { this.handlePersonSelection(value) }}
                />
              </fieldset>
            </div>
            <div className="col-md-4 col-sm-12">
              <fieldset className="form-group sf-form">
                <Field
                  label={Strings.phone_no_txt}
                  name="phone"
                  placeholder=""
                  type="text"
                  autoFocus={this.props.formSyncErrors && this.props.formSyncErrors.client && this.props.formSyncErrors.client.phone ? true : false}
                  validate={selectedPrimaryPerson ? [] : [primaryPersonContactNumberRequired, primaryPersonContactNumberIsPhoneNumber]}
                  component={
                    selectedPrimaryPerson
                      ? () =>
                        <div className="view-text-value lbl-b">
                          <label>{Strings.phone_no_txt}</label>
                          <span>{
                            selectedPrimaryPerson
                              ? selectedPrimaryPerson.phone
                              : ''
                          }</span>
                        </div>
                      : customInput
                  } />
              </fieldset>
            </div>
            <div className="col-md-4 col-sm-12">
              <fieldset className="form-group sf-form">
                <Field
                  label={Strings.email_txt}
                  name="email"
                  placeholder={Strings.email_sdcd}
                  type="text"
                  validate={selectedPrimaryPerson ? [] : [primaryPersonEmailRequired, primaryPersonEmailIsEmail]}
                  component={
                    selectedPrimaryPerson
                      ? () =>
                        <div className="view-text-value lbl-b">
                          <label>{Strings.email_txt}</label>
                          <span>{
                            selectedPrimaryPerson
                              ? selectedPrimaryPerson.email
                              : ''
                          }</span>
                        </div>
                      : customInput
                  } />
              </fieldset>
            </div>
            <div className="col-md-4 col-sm-12">
              <fieldset className="form-group sf-form">
                <Field
                  label={Strings.abn_txt}
                  name="abn_acn"
                  placeholder={Strings.abn_acn_sdcd}
                  type="text"
                  validate={selectedClient ? [] : [abnRequired, isValidABN]}
                  component={
                    selectedClient
                      ? () =>
                        <div className="view-text-value lbl-b">
                          <label>{Strings.abn_txt}</label>
                          <span>{
                            selectedClient
                              ? selectedClient.abn_acn
                              : ''
                          }</span>
                        </div>
                      : customInput
                  } />
              </fieldset>
            </div>
            <div className="col-md-4 col-sm-12">
              {selectedClient && !this.state.editAddress && <button type="button" className="normal-bnt tiny-icon" onClick={this.handleEditAddress}><i class="fa fa-pencil-square-o"></i></button>}
              {this.state.editAddress && <button type="button" className="normal-bnt tiny-icon" disabled={!this.props.formValues.client.address} onClick={this.handleSaveAddress}><i class="material-icons">save</i></button>}
              <fieldset className="form-group sf-form">
                <Field
                  label={Strings.address_txt}
                  name="address"
                  placeholder={Strings.address_sdcd}
                  type="text"
                  validate={selectedClient ? [] : [clientAddressRequired]}
                  component={
                    selectedClient && !this.state.editAddress
                      ? this.state.hasEditedAddress
                        ? () =>
                          <div className="view-text-value lbl-b">
                            <label>{Strings.address_txt}</label>
                            <span>{
                              this.props.formValues
                              && this.props.formValues.client
                              && this.props.formValues.client.address
                            }</span>
                          </div>
                        : () =>
                          <div className="view-text-value lbl-b">
                            <label>{Strings.address_txt}</label>
                            <span>{
                              selectedClient
                                ? selectedClient.address
                                : ''
                            }</span>
                          </div>
                      :
                      customTextarea
                  } />
              </fieldset>
            </div>
          </FormSection>
        </div>
      </div>
    )

    const sitesSection = (
      <div className="sf-card mt-4">
        <FieldArray
          name="sites"
          component={AddSites}
          onFileUpload={(fileInfo) => this.handleFileUpload(fileInfo)}
          onFileRemove={() => this.handleFileRemoval()}
          change={this.props.change}
          clientId={selectedClient && selectedClient.id}
          primaryPersonId={selectedPrimaryPerson && selectedPrimaryPerson.id}
          selectedClient={selectedClient}
          selectedPrimaryPerson={selectedPrimaryPerson}
          sites={selectedClient && selectedPrimaryPerson && this.state.personData.sites}
          reset={this.props.reset}
          taskTags={this.props.taskTags}

        />
      </div>
    )

    const notesSection = (
      <div className="sf-card mt-4">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h2 className="sf-pg-heading">{"Notes"}</h2>
          <div className="info-btn disable-dot-menu">
            <Dropdown className="more-info" disabled overlay={this.menu}>
              <i className="material-icons">more_vert</i>
            </Dropdown>
          </div>
        </div>
        <div className="sf-card-body int-notes">
          <div className="add-notes-row">

            <fieldset className="form-group sf-form">
              <FieldArray
                name="internal_notes"
                component={AddNotes} />
            </fieldset>
          </div>

        </div>
      </div>
    )

    const rightPanel = (
      <div className="col-md-4">
        <div className="sf-card">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h4 className="sf-sm-hd sf-pg-heading">{Strings.side_panel_title}</h4>
          </div>

          <div className="sf-card-body">
            <div className="user-p-notxt d-flex justify-content-start">
              <img alt="" src="/images/owl-img.png" />
              <span>{Strings.side_panel_info_txt}</span>
            </div>
          </div>
        </div>
      </div>
    )

    return (
      <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <div className="row">
          <div className="col-md-12 col-lg-8">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <div className="sf-card-wrap">
                {/* zoom button  */}
                <div className="card-expands">
                  <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                    <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} />
                  </button>
                </div>
                {clientSection}
                {sitesSection}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{"Condition"}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled overlay={this.menu}>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body int-notes">
                    <div className="add-notes-row">

                      <fieldset className="form-group sf-form">
                        <Field
                          name={`conditions`}
                          id="notesssssssss"
                          placeholder={"Conditions to be conveyed to client"}
                          type="text"
                          component={emailEditor}
                          editorState={this.props.formValues && this.props.formValues.conditions_temp ? this.props.formValues.conditions_temp : this.editorState()}
                          onEditorStateChange={(editorState) => this.onEditorStateChange(editorState)}
                        />
                      </fieldset>
                    </div>

                  </div>
                </div>                {notesSection}
                {/* zoom save button  */}
                <div className="row zoom-save-bnt">
                  <div className="col-md-12">
                    <div className="all-btn d-flex justify-content-end mt-4">
                      <div className="btn-hs-icon">
                        <button type="submit" className="bnt bnt-active">
                          <i class="material-icons">save</i> {Strings.save_btn}</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="all-btn d-flex justify-content-end mt-4">
                <div className="btn-hs-icon">
                  <button type="submit" className="bnt bnt-active">
                    <i class="material-icons">save</i> {Strings.save_btn}</button>
                </div>
              </div>
            </form>
          </div>
          {rightPanel}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    roles: state.roleManagement.roles,
    accessControlsByModule: state.accessControlManagement.accessControlsByModule,
    scopeDocs: state.scopeDocs.scopeDocs,
    sitesList: state.scopeDocs.sitesList,
    clientsList: state.scopeDocs.clientsList,
    sitesListByPersons: state.scopeDocs.sitesListByPersons,
    primaryPersonsList: state.scopeDocs.primaryPersons,
    formValues: state.form.addNewScopeDoc && state.form.addNewScopeDoc.values
      ? state.form.addNewScopeDoc.values
      : {},
    initialValues: {
      client: {
        organisation_id: JSON.parse(getStorage(ADMIN_DETAILS))
          ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
          : null,
      }
    },
    formTest: state.form.addNewScopeDoc,
    formSyncErrors: getFormSyncErrors('addNewScopeDoc')(state),
    taskTags: state.scopeDocs.taskTags ? state.scopeDocs.taskTags : [],
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    rolePermissionAction: bindActionCreators(rolePermissionAction, dispatch),
    scopeDocActions: bindActionCreators(scopeDocActions, dispatch),
  }
}



export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'addNewScopeDoc',
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AddNewScopeDoc)
