import React from "react";
import { notification, Popover, Button, Checkbox } from "antd";
import { reduxForm, Field } from "redux-form";
import { connect } from "react-redux";
import { compose, bindActionCreators } from "redux";
import * as actions from "../../../actions/equipmentManagementActions";
import { Strings } from "../../../dataProvider/localize";
import { ADMIN_DETAILS } from "../../../dataProvider/constant";
import { getStorage } from "../../../utils/common";
import { popOverCheckBox } from "../../common/popOverCheckBox";
import { searchOptions } from "./AdvanceSearchOptionsEquipment";
import moment from "moment";

class AdvanceSearchEquipment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      cardExpnadBtn: true,
      personData: {},
      additionalOptions: ["name", "equipment_id", "type"],
      searchKey: "",
      searchOptions: searchOptions(props)
    };
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS))
      ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
      : null;
  }

  componentDidMount() {
    this.props.action.getEquipmentList().then(() =>
      this.setState({
        searchOptions: searchOptions(this.props)
      })
    );
  }

  shouldComponentUpdate(nextProps) {
    console.log('nextProps.formValues', nextProps.formValues)
    if (nextProps.formValues && this.props.formValues) {
      // var formChangeFlag = false
      for (var key in nextProps.formValues) {
        if (!this.props.formValues[key] || nextProps.formValues[key].length !== this.props.formValues[key].length) {
          // formChangeFlag = true;
          this.filterChange(nextProps.formValues)
          break;
        }
      }
    }
    return true;
  }

  filterChange = (formValues) => {
    console.log("Changes somthing)))))))))))))))))))))))))))", formValues.name.toString());

    this.props.action.getEquipmentList(formValues.name.toString()).then(() =>
      this.setState({
        searchOptions: searchOptions(this.props)
      })
    )
  }

  onSubmit = formData => {
    this.props.action.initEquipments(formData);
    this.props.setViewButton(true)
  };

  handleFieldRemove = (option) => {
    let { additionalOptions } = this.state;
    if (additionalOptions.findIndex(val => val === option) >= 0)
      additionalOptions.splice(additionalOptions.findIndex(val => val === option), 1)
    this.setState({ additionalOptions })
  }

  handelExportData = () => {
    let searchData = this.props.formValues ? this.props.formValues : []
    // let serachKey = this.state.searchValue

    this.props.action.equipmentExportData(searchData)
      .then((res) => {
        let url = res;
        let name = 'Equipments_' + moment(new Date()).format('DD-MM-YYYY') + '.csv';
        fetch(url)
          .then(response => {
            response.blob().then(blob => {
              let url = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = url;
              a.download = name;
              a.click();
            });
          });
      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
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
            placeholder="Advance Search"
            onChange={evt => this.setState({ searchKey: evt.target.value })}
            value={this.state && this.state.searchKey}
          />
        </div>
        <Checkbox.Group
          defaultValue={["name", "equipment_id", "type"]}
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
            else return { ...option, disabled: true }
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
        <form onSubmit={handleSubmit(this.onSubmit)}>
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
                      {...currentSearchOption.props}
                      placeholder={`Search ${currentSearchOption.label}`}
                    />
                    <i type="button" class="material-icons src-cls-bnt" onClick={() => this.handleFieldRemove(option)}>close</i>
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
                <Button className="normal-bnt ad-srch-btn ad-sr-more-bnt">
                  <i class="material-icons">add</i> More
                </Button>
              </Popover>
              <button className="bnt bnt-active" type="submit">
                Search
              </button>
              <button className="bnt bnt-active ml-2" type="button" onClick={this.handelExportData}>
                Export Data
              </button>
              <button
                className="normal-bnt ml-3"
                type="submit"
                onClick={() => {
                  this.props.reset();
                  this.setState({ additionalOptions: ["name", "equipment_id", "type"] })
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
    equipmentList: state.equipmentManagement.equipmentListAdvanceSearch,
    formValues: state.form && state.form.AdvanceSearchEquipment && state.form.AdvanceSearchEquipment.values ? state.form.AdvanceSearchEquipment.values : {},
  };
};

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  };
};

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: "AdvanceSearchEquipment"
  })
)(AdvanceSearchEquipment);
