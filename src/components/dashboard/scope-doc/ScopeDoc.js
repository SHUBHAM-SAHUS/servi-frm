import React from "react";
import { Icon, Modal, Progress, notification } from "antd";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Route } from "react-router-dom";
import { getStorage, setStorage } from "../../../utils/common";
import * as actions from "../../../actions/scopeDocActions";
import * as accessControlAction from "../../../actions/accessControlManagementAction";
import ScopeDocSearch from "./ScopeDocSearch";
import AddNewScopeDoc from "./AddNewScopeDoc/AddNewScopeDoc";
import ViewEditScopeDoc from "./ViewEditScopeDoc";
import QuoteEmail from "./Email";
import { Strings } from "../../../dataProvider/localize";
import { ADMIN_DETAILS } from "../../../dataProvider/constant";
import { goBack, goBackBrowser } from "../../../utils/common";
import * as scopeDocActions from "../../../actions/scopeDocActions";
import { getFormSyncErrors } from "redux-form";
import { ERROR_NOTIFICATION_KEY } from "../../../config";
import AdvanceSearch from "./AdvanceSearch";
const mapRouteToTitle = {
  "/dashboard/scopedoc/createScopeDoc": Strings.add_scope_doc_title,
  "/dashboard/scopedoc/sendQuoteMail": Strings.send_quote_mail
};

class ScopeDoc extends React.Component {
  state = {
    clientSection: false,
    sitesSection: false,
    swmsSection: false,
    formCompletion: 0,
    advanceSearch: false,
    viewButton: true,
    togleSearch: true
  };



  componentDidMount() {
    var currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS))
      ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
      : null;

    this.props.action
      .initScopeDocs()
      .then(flag => {
        if (this.props.location.state && this.props.location.state.fromLink)
          this.props.history.push(this.props.match.path + "/createScopeDoc");
      })
      .catch(message => {
        if (this.props.location.state && this.props.location.state.fromLink)
          this.props.history.push(this.props.match.path + "/createScopeDoc");
        // this.createRoleHandler()
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => {},
          className: "ant-error"
        });
      });

    this.props.scopeDocActions
      .getClients(currentOrganization)
      .then(message => {})
      .catch(message => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => {},
          className: "ant-error"
        });
      });
  }

  componentWillReceiveProps(props) {
    this.state.clientSection = this.state.sitesSection = this.state.swmsSection = false;
    this.state.formCompletion = 0;
    var values = {};
    if (props.location.pathname.includes("/createScopeDoc")) {
      if (props.formValues && props.formValues.values) {
        values = props.formValues.values;
        if (
          values.client &&
          values.client.name &&
          values.client.primary_contact_person &&
          values.client.phone &&
          values.client.email &&
          values.client.address &&
          values.client.abn_acn &&
          values.job_name
        ) {
          this.state.clientSection = true;
        }
        /* For site caluclation typeahead */
        const personData =
          values.client &&
          values.client.primary_contact_person &&
          props.primaryPersonsList.find(
            person =>
              person.name.toString() ===
              values.client.primary_contact_person.toString()
          );
        var selectedSite;
        if (personData && personData.sites) {
          selectedSite =
            values.sites &&
            values.sites[0] &&
            values.sites[0].site_name &&
            personData.sites.find(
              site => site.id.toString() == values.sites[0].site_name.toString()
            );
        }
        if (
          values.sites &&
          values.sites[0] &&
          values.sites[0].site_name &&
          values.sites[0].street_address &&
          values.sites[0].city &&
          values.sites[0].state &&
          values.sites[0].country &&
          values.sites[0].zip_code &&
          values.sites[0].tasks &&
          values.sites[0].tasks[0] &&
          values.sites[0].tasks[0].task_name &&
          values.sites[0].tasks[0].areas &&
          values.sites[0].tasks[0].areas &&
          values.sites[0].tasks[0].areas[0] &&
          values.sites[0].tasks[0].areas &&
          values.sites[0].tasks[0].areas[0].area_name
        ) {
          this.state.sitesSection = true;
        } else if (
          values.sites &&
          values.sites[0] &&
          values.sites[0] &&
          selectedSite &&
          values.sites[0].tasks &&
          values.sites[0].tasks[0] &&
          values.sites[0].tasks[0].task_name &&
          values.sites[0].tasks[0].areas &&
          values.sites[0].tasks[0].areas &&
          values.sites[0].tasks[0].areas[0] &&
          values.sites[0].tasks[0].areas &&
          values.sites[0].tasks[0].areas[0].area_name
        ) {
          this.state.sitesSection = true;
        }
        var clientError = props.formSyncErrors.client
          ? props.formSyncErrors.client
          : {};
        var clientPercent =
          values.client && Object.keys(values.client).length > 0
            ? Object.keys(values.client).filter(
                key =>
                  (key === "name" && !clientError.name) ||
                  (key === "primary_contact_person" &&
                    !clientError.primary_contact_person) ||
                  (key === "phone" && !clientError.phone) ||
                  (key === "email" && !clientError.email) ||
                  (key === "address" && !clientError.address) ||
                  (key === "abn_acn" && !clientError.abn_acn) ||
                  (key === "job_name" && !clientError.job_name)
              ).length
            : 0;
        if (values.job_name && !props.formSyncErrors.job_name) {
          clientPercent++;
        }
        var sitePrecentage =
          values.sites && values.sites[0] && Object.keys(values.sites[0])
            ? Object.keys(values.sites[0]).filter(
                key =>
                  key === "site_name" /* && !clientError.name */ ||
                  key ===
                    "city" /*  && !clientError.primary_contact_person */ ||
                  key === "country" /* && !clientError.phone */ ||
                  key === "state" /*  && !clientError.email */ ||
                  key === "street_address" /* && !clientError.address */ ||
                  key === "zip_code" /*  && !clientError.abn_acn */
              ).length
            : 0;

        if (selectedSite) {
          sitePrecentage = 6;
        }

        var taskPercentage =
          values.sites &&
          values.sites[0] &&
          values.sites[0].tasks &&
          values.sites[0].tasks[0] &&
          Object.keys(values.sites[0].tasks[0])
            ? Object.keys(values.sites[0].tasks[0]).filter(
                key =>
                  key === "task_name" /* && !clientError.name */ ||
                  (key === "areas" &&
                    values.sites[0].tasks[0][key][0] &&
                    values.sites[0].tasks[0][key][0]
                      .area_name) /*  && !clientError.primary_contact_person */
              ).length
            : 0;

        this.state.formCompletion =
          ((clientPercent + sitePrecentage + taskPercentage) / 15) * 90;
      }
    } else if (
      props.location.pathname.includes("/showScopeDoc") ||
      props.location.pathname.includes("/sendQuoteMail")
    ) {
      this.state.clientSection = this.state.sitesSection = true;
      this.state.formCompletion = 90;
      if (props.selectedScopeDoc.swms_added) {
        this.state.swmsSection = true;
        this.state.formCompletion = 100;
      }
    }
  }

  handleAfterSubmit = () => {
    this.setState({ togleSearch: true });
  };

  createRoleHandler = () => {
    this.props.history.push(this.props.match.path + "/createScopeDoc");
  };

  handleSearchToggle = () => {
    this.setState({ togleSearch: !this.state.togleSearch });
  };

  toggleAdvanceSeacrh = () => {
    if(this.state.advanceSearch){
      this.props.action.initScopeDocs()
      this.setViewButton(true)
    }
    this.setState({ advanceSearch: !this.state.advanceSearch });
  };

  setViewButton=(value)=>{
    this.setState({ viewButton: value});
  }

  render() {
    return (
      <div className="sf-page-layout">
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon
              type="arrow-left"
              onClick={() =>
                this.props.location.pathname ==
                "/dashboard/scopedoc/sendQuoteMail"
                  ? goBackBrowser(this.props)
                  : goBack(this.props)
              }
            />
            {mapRouteToTitle[this.props.location.pathname]
              ? mapRouteToTitle[this.props.location.pathname]
              : Strings.scope_doc_title}
          </h2>
          <div className={"sf-steps-status"}>
            <div className="sf-steps-row">
              <div
                className={
                  this.state.clientSection ? "sf-st-item active" : "sf-st-item"
                }
              >
                <div className="iconbx">
                  <i class="material-icons">person</i>
                </div>
                <span>Client</span>
              </div>
              <div
                className={
                  this.state.sitesSection ? "sf-st-item active" : "sf-st-item"
                }
              >
                <div className="iconbx">
                  <i class="material-icons">format_paint</i>
                </div>
                <span>Sites</span>
              </div>
              <div
                className={
                  this.state.swmsSection ? "sf-st-item active" : "sf-st-item"
                }
              >
                <div className="iconbx">
                  <i class="fa fa-server"></i>
                </div>
                <span>SWMS</span>
              </div>
            </div>
            <div className="sf-st-item sf-prog">
              <Progress
                type="circle"
                strokeColor={"#03a791"}
                width={40}
                strokeWidth={12}
                percent={Math.round(this.state.formCompletion)}
                format={percent => percent + "%"}
              />
              <span>Progress</span>
            </div>
          </div>

          <div className="oh-cont">
            <button className="bnt bnt-active" onClick={this.createRoleHandler}>
              {Strings.create_new_scope_doc}
            </button>
          </div>
        </div>
        {/* inner header  */}
        <div className="main-container">
          {this.state.advanceSearch ? <AdvanceSearch setViewButton={this.setViewButton}
/> : null}

          <div className="row">
            {/* Left section */}
            <ScopeDocSearch
              handleSearchToggle={this.handleSearchToggle}
              togleSearch={this.state.togleSearch}
              advanceSearch={this.state.advanceSearch}
              toggleAdvanceSeacrh={this.toggleAdvanceSeacrh}
              setViewButton={this.setViewButton}
              viewButton={this.state.viewButton}
            />
            {/* center section  */}
            <Route
              path={this.props.match.path + "/showScopeDoc"}
              render={props => (
                <ViewEditScopeDoc
                  {...props}
                  togleSearch={this.state.togleSearch}
                />
              )}
            />
            <Route
              path={this.props.match.path + "/createScopeDoc"}
              render={props => (
                <AddNewScopeDoc
                  {...props}
                  togleSearch={this.state.togleSearch}
                  afterSubmit={() => this.handleAfterSubmit()}
                />
              )}
            />
            {/*  <Route
              path={this.props.match.path + '/advanceSearchScopeDoc'}
              render={(props) => <AdvanceSearch {...props} togleSearch={this.state.togleSearch} afterSubmit={() => this.handleAfterSubmit()} />}
            /> */}
            <Route
              path={this.props.match.path + "/sendQuoteMail"}
              render={props => (
                <QuoteEmail {...props} togleSearch={this.state.togleSearch} />
              )}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  var value = state.scopeDocs.scopeDocsDetails
    ? state.scopeDocs.scopeDocsDetails[0]
    : {};

  return {
    roles: state.roleManagement.roles,
    formValues: state.form.addNewScopeDoc,
    scopeDocs: state.scopeDocs.scopeDocs,
    formSyncErrors: getFormSyncErrors("addNewScopeDoc")(state),
    selectedScopeDoc: value ? value : {},
    primaryPersonsList: state.scopeDocs.primaryPersons
  };
};

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    accessControlAction: bindActionCreators(accessControlAction, dispatch),
    scopeDocActions: bindActionCreators(scopeDocActions, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToprops)(ScopeDoc);
