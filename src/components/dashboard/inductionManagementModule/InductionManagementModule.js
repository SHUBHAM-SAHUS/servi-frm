import React from 'react';
import { Icon, Modal, Progress, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import { getFormMeta, getFormSyncErrors } from 'redux-form';
import * as actions from '../../../actions/inductionTrainingAction';
import InductionManagementSearch from './InductionManagementSearch';
import AddNewInductionManagement from './AddNewInductionManagement';
import EditInductionManagement from './EditInductionManagement';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { goBack } from '../../../utils/common';
import { getStorage, setStorage } from '../../../utils/common';
import { ERROR_NOTIFICATION_KEY } from '../../../config';

const mapRouteToTitle = {
  '/dashboard/inductionManagementModule/createInductionManagement': Strings.equipment
}

class InductionManagementModule extends React.Component {
  constructor(props) {
    super(props);
    this.state = { togleSearch: true }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  componentDidMount() {
    this.props.action.initCourses()
      .then(() => {
        if (this.props.location.state && this.props.location.state.fromLink)
          this.createRoleHandler()
      })
      .catch((message) => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  createRoleHandler = () => {
    this.props.history.push(this.props.match.path + '/createInductionManagement')
  }

  handleSearchToggle = () => {
    this.setState({ togleSearch: !this.state.togleSearch })
  }

  // componentWillReceiveProps(props) {
  //   this.state.equpDetailsSection = this.state.imgSection = this.state.tntSection = false;
  //   this.state.formCompletion = 0;
  //   if (this.props.location.pathname.includes("/createInductionManagement")) {
  //     if (props.formValues && props.formValues.values) {
  //       var values = props.formValues.values;
  //       if (values.name && values.equipment_id && values.type && values.equ_group && values.cost) {
  //         this.state.equpDetailsSection = true;
  //       }
  //       if (values.equipmentFiles) {
  //         this.state.imgSection = true;
  //       }
  //       if (values.test_date && values.test_type && values.tester && values.license_type &&
  //         values.license_expiry && values.result && values.next_test_date) {
  //         this.state.tntSection = true;
  //       }
  //       var error = props.formSyncErrors
  //       var percentageFields = Object.keys(values)
  //         .filter(key =>
  //           ((key === 'name' && !error.name) || (key === 'equipment_id' && !error.equipment_id) || (key === 'type' && !error.type) ||
  //             (key === 'equ_group' && !error.equ_group) || (key === 'cost' && !error.cost) || (key === 'equipmentFiles' && !error.equipmentFiles)
  //             || (key === 'test_date' && !error.test_type) || (key === 'tester' && !error.tester) ||
  //             (key === 'license_type' && !error.license_type) || (key === 'license_expiry' && !error.license_expiry) ||
  //             (key === 'result' && !error.result) || (key === 'next_test_date' && !error.next_test_date)
  //           )
  //         ).length

  //       this.state.formCompletion = percentageFields / 12 * 100;
  //     }
  //   } else if (this.props.location.pathname.includes("/showInductionManagement")) {
  //     var values = props.editFormValues;
  //     var selectedEquipment = props.equipmentDetails;
  //     var fileField = selectedEquipment.file_name && selectedEquipment.file_name.replace('["', '').replace('"]', '').replace(/\"/g, "").split(',')
  //     var percentageFields = 5;
  //     this.state.equpDetailsSection = true;
  //     if (fileField && fileField.length > 0) {
  //       this.state.imgSection = true;
  //       percentageFields++;
  //     } else if (values.eqp_file_name && values.eqp_file_name.length > 0) {
  //       this.state.imgSection = true;
  //       percentageFields++;
  //     }

  //     if (selectedEquipment && selectedEquipment.test_and_tags && selectedEquipment.test_and_tags.length > 0) {
  //       this.state.tntSection = true;
  //       percentageFields += 7;
  //     } else {
  //       percentageFields += Object.keys(values)
  //         .filter(key => (
  //           (key === 'test_date' /* && !error.test_type */) || (key === 'tester' /* && !error.tester */) ||
  //           (key === 'license_type' /* && !error.license_type */) || (key === 'license_expiry' /* && !error.license_expiry */) ||
  //           (key === 'result' /* && !error.result */) || (key === 'next_test_date' /* && !error.next_test_date */)
  //         )
  //         ).length
  //     }

  //     this.state.formCompletion = percentageFields / 12 * 100;

  //   }
  // }

  render() {
    return (
      <div className="sf-page-layout">
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : Strings.ind_create_course}
          </h2>
         {/*  <div className={"sf-steps-status"}>
            <div className="sf-steps-row">
              <div className={this.state.equpDetailsSection ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="material-icons">person</i></div>
                <span>Equpment Details</span>
              </div>
              <div className={this.state.imgSection ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="material-icons">format_paint</i></div>
                <span>Image</span>
              </div>
              <div className={this.state.tntSection ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="fa fa-server"></i></div>
                <span>Test and tag</span>
              </div>
            </div>
            <div className="sf-st-item sf-prog">
              <Progress
                type="circle"
                strokeColor={'#03a791'}
                width={40}
                strokeWidth={12}
                percent={Math.round(this.state.formCompletion)}
                format={
                  (percent) => percent + '%'} />
              <span>Progress</span>
            </div>
          </div> */}

          <div class="oh-cont">

            <button className="bnt bnt-active" onClick={this.createRoleHandler}>{Strings.ind_add_new_course}</button>

          </div>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            {/* Left section */}
            <InductionManagementSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} />
            {/* center section  */}
            <Route path={this.props.match.path + '/showInductionManagement'} render={(props) => <EditInductionManagement {...props} togleSearch={this.state.togleSearch} />} />
            <Route path={this.props.match.path + '/createInductionManagement'} render={(props) => <AddNewInductionManagement {...props} togleSearch={this.state.togleSearch} />} />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    coursesList: state.inductionTraining && state.inductionTraining.coursesList,
    formSyncErrors: getFormSyncErrors('AddNewInductionManagement')(state),
    editFormValues: state.form.EditEquipment && state.form.EditEquipment.values,
    equipmentDetails: state.equipmentManagement.equipmentDetails && state.equipmentManagement.equipmentDetails.equipmentList &&
      state.equipmentManagement.equipmentDetails.equipmentList.length > 0 ? state.equipmentManagement.equipmentDetails.equipmentList[0] : {}
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),

  }
}

export default connect(mapStateToProps, mapDispatchToprops)(InductionManagementModule)