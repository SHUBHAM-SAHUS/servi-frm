import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, FieldArray, FormSection } from 'redux-form';

import { Strings } from '../../../../dataProvider/localize';
import { customInput } from '../../../common/custom-input';
import { Dropdown } from 'antd';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';
import { customCountrySelect } from '../../../common/customCountrySelect';
import AddTasks from './AddTasks'
import {
  siteZipRequired,
  jobNameRequired,
  siteNameRequired,
  siteCityRequired,
  siteStateRequired,
  siteCountryRequired,
  siteAddressRequired,
} from '../../../../utils/Validations/scopeDocValidation';
import { CustomDatepicker } from '../../../common/customDatepicker';
import moment from 'moment'
import { bindActionCreators } from 'redux';
import * as scopeDocActions from '../../../../actions/scopeDocActions';
import { countries } from '../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import { getStorage } from '../../../../utils/common';
export class AddSites extends Component {

  state = {
    activeClient: null,
  }

  menu = (
    <></>
  );
  disableDate = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  render() {
    var { fields, meta: { error, submitFailed }, sites, isFromEdit, sitesListByPersons, formValues, selectedClient,
      selectedPrimaryPerson } = this.props;
    // console.log("sites",sites);
    if (fields.length === 0 && !this.props.isFromEdit) {
      fields.push({ country: JSON.parse(getStorage(ADMIN_DETAILS)).country });
    }

    return (
      <>
        {!this.props.isFromEdit ? <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          {/* <h2 className="sf-pg-heading">{Strings.site_service_details}</h2> */}
          <h2 className="sf-pg-heading">Job Details</h2>
          <div className="info-btn disable-dot-menu">
            <Dropdown className="more-info" disabled overlay={this.menu}>
              <i className="material-icons">more_vert</i>
            </Dropdown>
          </div>
        </div> : null}
        <div className="sf-card-body">
          {
            !this.props.isFromEdit ?
              <div className="sf-card-inn-bg scop-inn-bg">
                <div className="row">
                  <div className="col-md-6 col-sm-12">
                    <fieldset className="form-group sf-form">
                      <Field
                        label={"Quote Name"}
                        name="job_name"
                        placeholder={Strings.job_name_sdcd}
                        type="text"
                        validate={jobNameRequired}
                        component={customInput}
                        onChange={() => { }}
                      />
                    </fieldset>
                  </div>
                  <FormSection className="row" name="client">
                    <div className="col-md-6 col-sm-12">
                      <fieldset className="form-group sf-form lsico">
                        <Field
                          label={Strings.quote_request_by}
                          name="quote_requested_by"
                          placeholder=""
                          type="date"
                          disabledDate={this.disableDate}
                          component={CustomDatepicker}
                        />
                      </fieldset>
                    </div>
                  </FormSection>
                </div></div> : null
          }
          {
            fields.map((site, index) => {
              // console.log("formValues",formValues);
              // console.log("sitesListByPersons",sitesListByPersons);
              // console.log("this.props.editFormValues",this.props.editFormValues);
              let selectedSite = undefined
              if (!isFromEdit) {
                selectedSite = selectedClient && selectedPrimaryPerson && sites && sites.find(site =>
                  formValues.sites
                    && formValues.sites[index].site_name
                    ? site.site.id.toString() === formValues.sites[index].site_name.toString()
                    : undefined
                )
              } else {
                selectedSite = undefined
                // selectedSite = sitesListByPersons && sitesListByPersons.find(site =>
                //   this.props.editFormValues
                //   && this.props.editFormValues.sites_quote
                //   && this.props.editFormValues.sites_quote[index]
                //     ? site.site.id.toString() === this.props.editFormValues.sites_quote[index].site_id.toString()
                //     : undefined
                // )
                selectedSite = sitesListByPersons && sitesListByPersons.find(site =>
                  this.props.editFormValues
                    && this.props.editFormValues.sites
                    && this.props.editFormValues.sites[index]
                    && this.props.editFormValues.sites[index].site_name
                    ? site.site.id.toString() === this.props.editFormValues.sites[index].site_name.toString()
                    : undefined
                )
              }
              return (
                <div className="add-n-site">
                  <button type="button" className="delete-task-btn normal-bnt" onClick={() => { fields.remove(index) }}>
                    <i class="fa fa-trash-o"></i>
                  </button>
                  <div className="row">
                    <div className="col-lg-4 col-sm-12">
                      <fieldset className="form-group sf-form select-wibg">
                        <Field
                          label={Strings.site_name}
                          name={`${site}.site_name`}
                          placeholder={Strings.site_name_sd_site}
                          type="text"
                          dataSource={
                            !isFromEdit
                              ? sites
                                ? sites.map(site => {
                                  return {
                                    text: site.site.site_name,
                                    value: site.site.id
                                  }
                                }) : []
                              : sitesListByPersons
                                ? sitesListByPersons.map(site => {
                                  return {
                                    text: site.site.site_name,
                                    value: site.site.id
                                  }
                                }) : []
                          }
                          validate={selectedSite ? [] : siteNameRequired}
                          component={CustomAutoCompleteSearch}
                        />
                      </fieldset>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      <fieldset className="form-group sf-form">
                        <Field
                          label={Strings.street_add_txt}
                          name={`${site}.street_address`}
                          placeholder={Strings.street_address_sd_site}
                          type="text"
                          validate={selectedSite ? [] : siteAddressRequired}
                          component={
                            selectedSite
                              ? () =>
                                <div className="view-text-value lbl-b">
                                  <label>{Strings.street_add_txt}</label>
                                  <span>{
                                    selectedSite
                                      ? selectedSite.site.street_address
                                      : ''
                                  }</span>
                                </div>
                              : customInput
                          } />
                      </fieldset>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      <fieldset className="form-group sf-form">
                        <Field
                          label={Strings.city_txt}
                          name={`${site}.city`}
                          placeholder={Strings.city_sd_site}
                          type="text"
                          validate={selectedSite ? [] : siteCityRequired}
                          component={
                            selectedSite
                              ? () =>
                                <div className="view-text-value lbl-b">
                                  <label>{Strings.city_txt}</label>
                                  <span>{
                                    selectedSite
                                      ? selectedSite.site.city
                                      : ''
                                  }</span>
                                </div>
                              : customInput
                          } />
                      </fieldset>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      <fieldset className="form-group sf-form">
                        <Field
                          label={Strings.state_txt}
                          name={`${site}.state`}
                          placeholder={Strings.state_sd_site}
                          type="text"
                          validate={selectedSite ? [] : siteStateRequired}
                          component={
                            selectedSite
                              ? () =>
                                <div className="view-text-value lbl-b">
                                  <label>{Strings.state_txt}</label>
                                  <span>{
                                    selectedSite
                                      ? selectedSite.site.state
                                      : ''
                                  }</span>
                                </div>
                              : customInput
                          } />
                      </fieldset>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      <fieldset className="form-group sf-form">
                        <Field
                          label={Strings.zip_code_no}
                          name={`${site}.zip_code`}
                          placeholder=""
                          type="text"
                          validate={selectedSite ? [] : siteZipRequired}
                          component={
                            selectedSite
                              ? () =>
                                <div className="view-text-value lbl-b">
                                  <label>{Strings.zip_code_no}</label>
                                  <span>{
                                    selectedSite
                                      ? selectedSite.site.zip_code
                                      : ''
                                  }</span>
                                </div>
                              : customInput
                          } />
                      </fieldset>
                    </div>
                    <div className="col-lg-4 col-sm-12">
                      <fieldset className="form-group sf-form lsico">
                        <Field
                          label={Strings.country_txt}
                          name={`${site}.country`}
                          // placeholder=""
                          type="text"
                          options={countries.map(country => ({ title: country, value: country.toString() }))}
                          validate={selectedSite ? [] : siteCountryRequired}
                          placeholder={Strings.country_txt}
                          component={
                            selectedSite
                              ? () =>
                                <div className="view-text-value lbl-b">
                                  <label>{Strings.country_txt}</label>
                                  <span>{
                                    selectedSite
                                      ? selectedSite.site.country
                                      : ''
                                  }</span>
                                </div>
                              : customCountrySelect
                          } />
                      </fieldset>
                    </div>
                    <FieldArray
                      siteIndex={index}
                      name={`${site}.tasks`}
                      component={AddTasks}
                      editChange={this.props.isFromEdit ? this.props.editChange : null}
                      addChange={this.props.change}
                      generateQuote={this.props.generateQuote ? this.props.generateQuote : null}
                      equipmentList={this.props.equipmentList}
                      isFromEdit={this.props.isFromEdit}
                      ViewEditScopeDoc={this.props.ViewEditScopeDoc}
                      taskTags={this.props.taskTags}
                    />
                  </div>
                </div>

              )
            })
          }
          <div className="btn-hs-icon sm-bnt">
            <button
              className="bnt bnt-normal"
              type="button"
              onClick={() => fields.push({ country: JSON.parse(getStorage(ADMIN_DETAILS)).country })}
            >
              {Strings.add_site_btn}
            </button>
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  roles: state.roleManagement.roles,
  formValues: state.form.addNewScopeDoc && state.form.addNewScopeDoc.values,
  editFormValues: state.form.ViewEditScopeDoc &&
    state.form.ViewEditScopeDoc.values ? state.form.ViewEditScopeDoc.values : {},
  scopeDocs: state.scopeDocs.scopeDocs,
  sitesList: state.scopeDocs.sitesList,
  sitesListByPersons: state.scopeDocs.sitesListByPersons
})

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(scopeDocActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(AddSites)
