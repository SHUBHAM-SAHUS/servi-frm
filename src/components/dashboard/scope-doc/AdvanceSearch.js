import React from "react";
import { notification, Popover, Button, Checkbox } from "antd";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import * as actions from "../../../actions/advanceSearchAction";
import { Strings } from "../../../dataProvider/localize";
import { ADMIN_DETAILS } from "../../../dataProvider/constant";
import { getStorage } from "../../../utils/common";
import { CustomSelect } from "../../common/customSelect";
import { popOverCheckBox } from "../../common/popOverCheckBox";
import { searchOptions } from "./AdvanceSearchOptions";
import * as acopeDocAction from "../../../actions/scopeDocActions";

class AdvanceSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardExpnadBtn: true,
      personData: {},
      additionalOptions: ["client_id", "job_name", "site_name"],
      searchKey: "",
      searchOptions: searchOptions(props)
    };
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS))
      ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
      : null;
  }

  componentDidMount() {
    /* Promise.all([
      this.props.action.getScopedocQuoteList,
      this.props.action.getClientABN
    ]).then(() => this.setState({ searchOptions: searchOptions(this.props) })); */
    /*  this.props.action.getScopedocQuoteList().then(() =>
       this.props.action.getClientABN().then(() =>
         this.props.action.getClientPrimaryContact().then(() =>
           this.props.action.getOrgSiteList().then(() =>
             this.props.action.getOrgTaskList().then(() =>
               this.props.action.getAccManager().then(() =>
                 this.setState({
                   searchOptions: searchOptions(this.props)
                 })
               )
             )
           )
         )
       )
     ); */
    // this.props.action.getScopedocQuoteList();

    /* New Filter Item API */
    this.props.action.getScopeDocFilters().then(() =>
      this.setState({
        searchOptions: searchOptions(this.props)
      })
    )
  }

  onSubmit = formData => {
    console.log("form Data", formData);
    this.props.acopeDocAction.initScopeDocs(formData);
    this.props.setViewButton(true)
  };

  handleClientSelection = clientId => {
    this.props.scopeDocActions
      .getPrimaryPersons(clientId)
      .then(() => {
        this.props.change("client.id", parseInt(clientId));
      })
      .catch(message => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: "ant-error"
        });
      });
  };

  handleFieldRemove = (option) => {
    let { additionalOptions } = this.state;
    if (additionalOptions.findIndex(val => val === option) >= 0)
      additionalOptions.splice(additionalOptions.findIndex(val => val === option), 1)
    this.setState({ additionalOptions })
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.formValues && this.props.formValues) {
      // var formChangeFlag = false
      for (var key in nextProps.formValues) {
        if (!this.props.formValues[key] || nextProps.formValues[key].length !== this.props.formValues[key].length) {
          console.log("Changes somthing)))))))))))))))))))))))))))", key, nextProps.formValues, nextProps.formValues);
          // formChangeFlag = true;
          this.filterChange(nextProps.formValues)
          break;
        }
      }
    }
    return true;
  }

  filterChange = (formValues) => {
    // console.log("Changes somthing)))))))))))))))))))))))))))", this.props.formValues, e);

    this.props.action.getScopeDocFilters(formValues).then(() =>
      this.setState({
        searchOptions: searchOptions(this.props)
      })
    )
  }

  render() {
    const { handleSubmit } = this.props;
    const { additionalOptions } = this.state;
    const moreContent = (
      <div className="advance-search-popup">
        <div className="ad-srch-box sf-form">
          <input
            type="text"
            className="form-container"
            placeholder="Advanced Search"
            onChange={evt => this.setState({ searchKey: evt.target.value })}
            value={this.state && this.state.searchKey}
          />
        </div>
        <Checkbox.Group
          defaultValue={["client_id", "job_name", "site_name"]}
          options={this.state.searchOptions.map(option => {
            if (
              option.label
                .toUpperCase()
                .indexOf(
                  this.state &&
                  this.state.searchKey &&
                  this.state.searchKey.toUpperCase()
                ) !== -1
            )
              return option;
            else return { ...option, disabled: true };
          })}
          onChange={checkedValues =>
            this.setState({ additionalOptions: checkedValues })
          }
          value={this.state && this.state.additionalOptions}
        />
      </div>
    );
    return (
      <div className="sf-card-wrap advance-search-wrap mb-4">
        <form onSubmit={handleSubmit(this.onSubmit)} >
          <div className="d-flex flex-nowrap align-items-start">
            <div className="d-flex lhs-ad-src">
              {additionalOptions.map(option => {
                const currentSearchOption = this.state.searchOptions.find(
                  opt => opt.value === option
                );
                return (
                  <fieldset
                    className={
                      "ad-srch-content " +
                      (currentSearchOption.fieldSetClass
                        ? currentSearchOption.fieldSetClass
                        : "")
                    }
                  >
                    <Field
                      name={option}
                      component={currentSearchOption.component}
                      placeholder={`Search ${currentSearchOption.label}`}
                      {...currentSearchOption.props}
                    // onChange={this.filterChange}
                    />
                    <i type="submit" class="material-icons src-cls-bnt" onClick={() => this.handleFieldRemove(option)}>close</i>
                  </fieldset>
                );
              })}
              {/* <Popover className="ad-srch-content" overlayClassName="ad-srh-popup" content={content} placement="bottomLeft" title={false}
              trigger="click">
              <Button className="normal-bnt ad-srch-btn">Client Name: All
              <i class="material-icons">arrow_drop_down</i></Button>
            </Popover>
            */}
            </div>

            <div className="d-flex rhs-ad-src" id="stickAddMore">
              <Popover
                className="ad-srch-content"
                overlayClassName="ad-srh-popup"
                content={moreContent}
                placement="bottomRight"
                title={false}
                trigger="click"
                getPopupContainer={() =>
                  document.getElementById("stickAddMore")
                }
              >
                <button type="submit" className="normal-bnt ad-srch-btn ad-sr-more-bnt">
                  <i class="material-icons">add</i> More
                </button>
              </Popover>
              <button className="bnt bnt-active" type="submit">
                Search
              </button>
              <button
                className="normal-bnt ml-3"
                type="submit"
                onClick={() => {
                  this.props.reset();
                  this.setState({ additionalOptions: ["client_id", "job_name", "site_name"] })
                  this.filterChange({})
                }}
              >
                Reset
              </button>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    quotes: state.advanceSeacrh.quotes,
    clients: state.advanceSeacrh.clients,
    scopedocNumbers: state.advanceSeacrh.scopedocNumbers,
    primaryPerson: state.advanceSeacrh.primaryPerson,
    jobNames: state.advanceSeacrh.jobNames,
    siteName: state.advanceSeacrh.siteName,
    siteAddress: state.advanceSeacrh.siteAddress,
    siteCities: state.advanceSeacrh.siteCities,
    siteState: state.advanceSeacrh.siteState,
    siteContries: state.advanceSeacrh.siteContries,
    taskNameList: state.advanceSeacrh.taskNameList,
    areasList: state.advanceSeacrh.areasList,
    accMngList: state.advanceSeacrh.accMngList,
    createdBy: state.advanceSeacrh.createdBy,
    modifiedBy: state.advanceSeacrh.modifiedBy,
    initialValues: { note: [] },
    formValues: state.form.AdvanceSearch && state.form.AdvanceSearch.values
  };
};

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    acopeDocAction: bindActionCreators(acopeDocAction, dispatch)
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: "AdvanceSearch"
  })
)(AdvanceSearch);
