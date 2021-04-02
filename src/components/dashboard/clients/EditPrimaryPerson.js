import React from "react";
import { reduxForm, Field, isDirty } from "redux-form";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import { Icon, Modal } from "antd";
import { customInput } from "../../common/custom-input";
import { Strings } from "../../../dataProvider/localize";
import { CustomAutoCompleteSearch } from "../../common/customAutoCompleteSearch";
import { customCountrySelect } from "../../common/customCountrySelect";
import { clientDetailsValidate } from "../../../utils/Validations/scopeDocValidation";
import * as swmsAction from "../../../actions/scopeDocActions";
import { CustomSwitch } from "../../common/customSwitch";
import {
  isRequired,
  siteNameRequired,
  siteCityRequired,
  siteAddressRequired,
  siteStateRequired,
  siteZipRequired,
  siteCountryRequired,
} from "../../../utils/Validations/scopeDocValidation";
import { countries, handleFocus, DeepTrim } from "../../../utils/common";

class EditPrimaryPerson extends React.Component {
  state = {};

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);

    const selectedSite = this.props.sites.find(
      (site1) => site1.id == formData.site_name
    );
    if (selectedSite) {
      const refinedSite = (({
        id,
        job_name,
        site_name,
        street_address,
        city,
        state,
        zip_code,
        country,
      }) => ({
        site_id: id,
        job_name,
        site_name,
        street_address,
        city,
        state,
        zip_code,
        country,
      }))(selectedSite);
      formData = {
        ...formData,
        ...refinedSite,
        site_id: parseInt(refinedSite.site_id),
      };
    }

    delete formData.sites;
    delete formData.quote_requested_by;

    this.props.onPersonSubmit(formData);
    this.props.reset();
  };

  handleEditPerson = (data) => {
    this.props.onPersonUpdate(data);
    this.props.reset();
  };

  handleCancel = () => {
    this.props.reset();
    this.props.handleCancel();
  };

  render() {
    const { handleSubmit, sites } = this.props;
    const activeSites = sites.filter((item) => item.active === 1);
    var selectedSite = false;

    selectedSite = this.props.sites.find((site) =>
      this.props.formValues && this.props.formValues.site_name
        ? site.id == this.props.formValues.site_name
        : false
    );

    const primaryPersonSection = (
      <div>
        <fieldset className="sf-form form-group">
          <Field
            label={0 ? Strings.client_name : "Primary Contact Name"}
            name="name"
            type="text"
            component={customInput}
          />
        </fieldset>
        <fieldset className="sf-form form-group">
          <Field
            label={0 ? Strings.client_name : "Email"}
            name="email"
            type="text"
            component={customInput}
          />
        </fieldset>
        <fieldset className="sf-form form-group">
          <Field
            label={0 ? Strings.client_name : "Phone"}
            name="phone"
            type="text"
            component={customInput}
          />
        </fieldset>
        <fieldset className="sf-form form-group">
          <Field
            label={0 ? Strings.client_name : "Active"}
            name="active"
            id="active"
            component={CustomSwitch}
          />
        </fieldset>
      </div>
    );

    const sitesSection = (
      <div className="client-add-site-dtl">
        <div className="sf-card-head">
          <h4 className="sf-sm-hd sf-pg-heading">
            {0 ? Strings.scope_doc_edit_client_title : "Add Site Details"}
          </h4>
        </div>
        <fieldset className="form-group sf-form">
          <Field
            label={Strings.site_name}
            name="site_name"
            type="text"
            dataSource={activeSites.map((site) => ({
              text: site.site_name,
              value: site.id,
            }))}
            validate={siteNameRequired}
            component={CustomAutoCompleteSearch}
            // onChange={}
            onSelect={(value) => this.handleSiteSelection(value)}
          />
        </fieldset>

        <fieldset className="form-group sf-form">
          <Field
            label={Strings.street_add_txt}
            name="street_address"
            type="text"
            validate={siteAddressRequired}
            component={
              selectedSite
                ? () => (
                    <div className="view-text-value lbl-b">
                      <label>{Strings.street_add_txt}</label>
                      <span>
                        {selectedSite ? selectedSite.street_address : ""}
                      </span>
                    </div>
                  )
                : customInput
            }
          />
        </fieldset>
        <fieldset className="form-group sf-form">
          <Field
            label={Strings.city_txt}
            name="city"
            type="text"
            validate={siteCityRequired}
            component={
              selectedSite
                ? () => (
                    <div className="view-text-value lbl-b">
                      <label>{Strings.city_txt}</label>
                      <span>{selectedSite ? selectedSite.city : ""}</span>
                    </div>
                  )
                : customInput
            }
          />
        </fieldset>
        <fieldset className="form-group sf-form">
          <Field
            label={Strings.state_txt}
            name="state"
            type="text"
            validate={siteStateRequired}
            component={
              selectedSite
                ? () => (
                    <div className="view-text-value lbl-b">
                      <label>{Strings.state_txt}</label>
                      <span>{selectedSite ? selectedSite.state : ""}</span>
                    </div>
                  )
                : customInput
            }
          />
        </fieldset>
        <fieldset className="form-group sf-form">
          <Field
            label={Strings.zip_code_no}
            name="zip_code"
            type="text"
            validate={siteZipRequired}
            component={
              selectedSite
                ? () => (
                    <div className="view-text-value lbl-b">
                      <label>{Strings.zip_code_no}</label>
                      <span>{selectedSite ? selectedSite.zip_code : ""}</span>
                    </div>
                  )
                : customInput
            }
          />
        </fieldset>
        <fieldset className="form-group sf-form lsico">
          <Field
            label={Strings.country_txt}
            name="country"
            type="text"
            options={countries.map((country) => ({
              title: country,
              value: country.toString(),
            }))}
            validate={selectedSite ? [] : isRequired}
            component={
              selectedSite
                ? () => (
                    <div className="view-text-value lbl-b">
                      <label>{Strings.country_txt}</label>
                      <span>{selectedSite ? selectedSite.country : ""}</span>
                    </div>
                  )
                : customCountrySelect
            }
          />
        </fieldset>
      </div>
    );

    return (
      <div className="sf-card">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h4 className="sf-sm-hd sf-pg-heading">
            {0
              ? Strings.scope_doc_edit_client_title
              : "Edit Primary Contact Person"}
          </h4>
          <button class="closed-btn" onClick={this.handleCancel}>
            <Icon type="close" />
          </button>
        </div>
        <div className="sf-card-body doc-update-task mt-2">
          <form onSubmit={handleSubmit(this.onSubmit)}>
            {primaryPersonSection}
            {sitesSection}
            <div className="all-btn multibnt">
              <div className="btn-hs-icon d-flex justify-content-between">
                <button
                  onClick={this.handleCancel}
                  className="bnt bnt-normal"
                  type="button"
                  disabled={!this.props.isDirty}
                >
                  {Strings.cancel_btn}
                </button>
                {this.props.isFromClient ? (
                  <button
                    type="button"
                    className="bnt bnt-active"
                    onClick={() => this.handleEditPerson(this.props.formValues)}
                    disabled={!this.props.isDirty}
                  >
                    {Strings.update_btn}
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bnt bnt-active"
                    disabled={!this.props.isDirty}
                  >
                    {Strings.update_btn}
                  </button>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var value =
    state.clientManagement && state.clientManagement.clientDetails
      ? state.clientManagement.clientDetails[0]
      : null;
  return {
    sites: state.clientManagement && state.clientManagement.sitesList,
    formValues:
      state.form &&
      state.form.EditPrimaryPerson &&
      state.form.EditPrimaryPerson.values
        ? state.form.EditPrimaryPerson.values
        : {},
    isDirty: isDirty("EditPrimaryPerson")(state),
  };
};

const mapDispatchToprops = (dispatch) => {
  return {
    swmsAction: bindActionCreators(swmsAction, dispatch),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: "EditPrimaryPerson",
    validate: clientDetailsValidate,
    enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    },
  })
)(EditPrimaryPerson);
