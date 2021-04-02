import React from 'react';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, Modal, notification } from 'antd';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch'
import { customCountrySelect } from '../../common/customCountrySelect';
import { CustomSelect } from '../../common/customSelect';
import { clientDetailsValidate, isRequired } from '../../../utils/Validations/scopeDocValidation';
import * as actions from '../../../actions/clientManagementActions';
import * as rolesActions from '../../../actions/roleManagementActions';
import { CustomSwitch } from '../../common/customSwitch';
import {
  siteZipRequired,
  siteNameRequired,
  siteCityRequired,
  siteStateRequired,
  siteAddressRequired,
  siteCountryRequired,
} from '../../../utils/Validations/scopeDocValidation'
import $ from 'jquery';
import { countries, handleFocus } from '../../../utils/common';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage } from '../../../utils/common';
import { DeepTrim } from '../../../utils/common';


class AddPrimaryPerson extends React.Component {

  state = {

  }

  componentDidMount() {
    this.props.action.getClientPersonRoles();

  }


  onSubmit = async formData => {
    formData = await DeepTrim(formData);
    let selectedRole = null;
    try {
      selectedRole = this.props.roles.find(item => item.name.toLowerCase()
        === formData.role_name.toLowerCase());
    } catch (err) {
      selectedRole = this.props.roles.find(item =>
        item.id == formData.role_name)
    }
    let role_id = selectedRole && selectedRole.id ? selectedRole.id : null;
    let role_name = selectedRole && selectedRole.role_name ? selectedRole.role_name : formData.role_name;

    formData = { ...formData, 'quote_requested_by"': null, role_id: role_id, role_name: role_name }

    this.props.onPersonSubmit(formData);
    this.props.reset();
  }

  handleSiteSelection = (value) => {

  }

  handlePersonSubmit = (fData) => {
    if (this.props.isFromEdit) {
      const selectedSite = this.props.sites.find(site1 =>
        site1.id == fData.site_name
      )
      if (selectedSite) {
        const refinedSite = (({ id, job_name, site_name, street_address, city, state, zip_code, country }) => ({
          'site_id': id, job_name, site_name, street_address, city, state, zip_code, country
        }))(selectedSite)
        fData = { ...fData, ...refinedSite, site_id: parseInt(refinedSite.site_id), 'quote_requested_by': null };
      }
    }

    let formData = {};
    let client_id = this.props.selectedClient.id
    $.extend(formData, { 'client_id': client_id }, { 'client_person': [fData] })
    this.props.action.addContactPerson(formData)
      .then((message) => {
        this.addPerson = [];
        this.props.reset();
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: Strings.client_create_success,
            onClick: () => { },
            className: 'ant-success'
          });
        }
        this.props.action.getClientDetails(formData.client_id)
          .then((flag) => {
            this.props.handleCancel();
          });
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

  handleCancel = () => {
    this.props.reset();
    this.props.handleCancel()
  }

  render() {
    const { handleSubmit, sites, isFromAddClient } = this.props;
    const activeSites = sites.filter(item => item.active === 1);
    var selectedSite = false;
    selectedSite = this.props.sites.find(site =>
      this.props.formValues && this.props.formValues.site_name ? site.id == this.props.formValues.site_name : false
    )

    const primaryPersonSection = (
      <div>
        <fieldset className="sf-form form-group">
          <Field
            label={0 ? Strings.client_name : 'Primary Contact Name'}
            name="name"
            placeholder={Strings.contact_name_clnt}
            type="text"
            component={customInput}
          />
        </fieldset>
        <fieldset className="form-group sf-form">
          <Field
            label={0 ? Strings.client_name : 'Email'}
            name="email"
            placeholder={Strings.email_clnt}
            type="text"
            component={customInput}
          />
        </fieldset>
        <fieldset className="form-group sf-form">
          <Field
            label={0 ? Strings.client_name : 'Phone'}
            name="phone"
            type="text"
            component={customInput}
          />
        </fieldset>
        <fieldset className="form-group sf-form">
          {/* <Field
            label="Role"
            name="role_id"
            placeholder={Strings.role_id_sau}
            type="text"
            options={this.props.roles ? this.props.roles.map(role => ({ title: role.name, value: role.id })) : []}
            component={CustomSelect}
          /> */}

          <Field
            label="Role Name"
            name="role_name"
            placeholder={Strings.role_name}
            type="text"
            dataSource={this.props.roles ? this.props.roles.map(role => ({
              text: role.role_name,
              value: role.id
            })) : ""}
            component={CustomAutoCompleteSearch}

          />

        </fieldset>
        <fieldset className="form-group sf-form">
          <Field
            label={0 ? Strings.client_name : 'Active'}
            name="active"
            id="active"
            component={CustomSwitch}
          />
        </fieldset>
      </div>
    )

    const sitesSection = (
      <div className="client-add-site-dtl">
        <div className="sf-card-head">
          <h4 className="sf-sm-hd sf-pg-heading">{0 ? Strings.scope_doc_edit_client_title : 'Add Site Details'}</h4>
        </div>
        {this.props.isFromEdit ?
          <fieldset className="form-group sf-form">
            <Field
              label={Strings.site_name}
              name="site_name"
              placeholder={Strings.site_name_clnt}
              type="text"
              dataSource={activeSites.map(site => ({
                text: site.site_name,
                value: site.id
              }))}
              validate={selectedSite ? [] : siteNameRequired}
              component={CustomAutoCompleteSearch}
              onSelect={(value) => this.handleSiteSelection(value)}
            />
          </fieldset>
          :
          <fieldset className="form-group sf-form">
            <Field
              label={Strings.site_name}
              name="site_name"
              placeholder={Strings.site_name_clnt}
              type="text"
              validate={selectedSite ? [] : siteNameRequired}
              component={customInput}
            />
          </fieldset>
        }
        <fieldset className="form-group sf-form">
          <Field
            label={Strings.street_add_txt}
            name="street_address"
            placeholder={Strings.street_address_clnt}
            type="text"
            validate={selectedSite ? [] : siteAddressRequired}
            component={selectedSite
              ? () =>
                <div className="view-text-value lbl-b">
                  <label>{Strings.street_add_txt}</label>
                  <span>{
                    selectedSite
                      ? selectedSite.street_address
                      : ''
                  }</span>
                </div>
              : customInput} />
        </fieldset>
        <fieldset className="form-group sf-form">
          <Field
            label={Strings.city_txt}
            name="city"
            placeholder={Strings.city_clnt}
            type="text"
            validate={selectedSite ? [] : siteCityRequired}
            component={selectedSite
              ? () =>
                <div className="view-text-value lbl-b">
                  <label>{Strings.city_txt}</label>
                  <span>{
                    selectedSite
                      ? selectedSite.city
                      : ''
                  }</span>
                </div>
              : customInput} />
        </fieldset>
        <fieldset className="form-group sf-form">
          <Field
            label={Strings.state_txt}
            name="state"
            placeholder={Strings.state_clnt}
            type="text"
            validate={selectedSite ? [] : siteStateRequired}
            component={selectedSite
              ? () =>
                <div className="view-text-value lbl-b">
                  <label>{Strings.state_txt}</label>
                  <span>{
                    selectedSite
                      ? selectedSite.state
                      : ''
                  }</span>
                </div>
              : customInput} />
        </fieldset>
        <fieldset className="form-group sf-form">
          <Field
            label={Strings.zip_code_no}
            name="zip_code"
            type="text"
            validate={selectedSite ? [] : siteZipRequired}
            component={selectedSite
              ? () =>
                <div className="view-text-value lbl-b">
                  <label>{Strings.zip_code_no}</label>
                  <span>{
                    selectedSite
                      ? selectedSite.zip_code
                      : ''
                  }</span>
                </div>
              : customInput} />
        </fieldset>
        <fieldset className="form-group sf-form lsico">
          <Field
            label={Strings.country_txt}
            name="country"
            placeholder="Country"
            type="text"
            options={countries.map(country => ({ title: country, value: country.toString() }))}
            validate={selectedSite ? [] : isRequired}
            component={selectedSite
              ? () =>
                <div className="view-text-value lbl-b">
                  <label>{Strings.country_txt}</label>
                  <span>{
                    selectedSite
                      ? selectedSite.country
                      : ''
                  }</span>
                </div>
              : customCountrySelect} />
        </fieldset>
      </div>
    )

    return (
      <div className="sf-card">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h4 className="sf-sm-hd sf-pg-heading">{0 ? Strings.scope_doc_edit_client_title : 'Add Primary Contact Person'}</h4>
          <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
        </div>
        <div className="sf-card-body doc-update-task mt-2">
          <form onSubmit={handleSubmit(this.onSubmit)} >
            {primaryPersonSection}
            {sitesSection}
            <div className="all-btn multibnt">
              <div className="btn-hs-icon d-flex justify-content-between">
                <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                  {Strings.cancel_btn}</button>
                {this.props.isFromEdit ?
                  <button type="button" className="bnt bnt-active" onClick={() => this.handlePersonSubmit(this.props.formValues)} disabled={!this.props.isDirty}>
                    {Strings.update_btn}</button>
                  :
                  <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                    {Strings.add_txt}</button>
                }
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var value = state.clientManagement && state.clientManagement.clientDetails ? state.clientManagement.clientDetails[0] : null;
  var OrgSACountry = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).country : null;
  return {
    sites: state.clientManagement && state.clientManagement.sitesList,
    initialValues: { country: OrgSACountry, active: true },
    formValues: state.form && state.form.AddPrimaryPerson &&
      state.form.AddPrimaryPerson.values ? state.form.AddPrimaryPerson.values : {},
    isDirty: isDirty('AddPrimaryPerson')(state),
    selectedClient: value ? value : {},
    roles: state.clientManagement.roles,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    rolesActions: bindActionCreators(rolesActions, dispatch),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'AddPrimaryPerson', validate: clientDetailsValidate, enableReinitialize: true, destroyOnUnmount: false,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AddPrimaryPerson)