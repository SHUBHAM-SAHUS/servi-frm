import React from 'react';
import { Icon, Modal, Upload, Dropdown, Menu, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';

import { validate } from '../../../utils/Validations/certificateValidations';
import { customInput } from '../../common/custom-input';
import * as actions from '../../../actions/scopeDocActions';
import { CustomSwitch } from '../../common/customSwitch'
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../utils/common';
import { customTextarea } from '../../common/customTextarea'
import { CustomDatepicker } from '../../common/customDatepicker';
import moment from 'moment'
import $ from 'jquery';
import { DeepTrim } from '../../../utils/common';

const { Dragger } = Upload;

/* function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
} */

class AddNewTaskTags extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'block',
      height: 0,
      cardExpnadBtn: true,
      logoImageURL: '', file: [],
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);

    formData.active = +formData.active;
  
    this.props.action.addTaskTags(formData, formData.organisation_id)
      .then((message) => {
        this.setState({ file: [] });
        this.props.reset();
        notification.success({
          message: Strings.success_title,
          description: message,
          onClick: () => { },
          className: 'ant-success'
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
    this.setState({ displayEdit: 'none' });
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  removeFile = () => this.setState({ file: [], logoImageURL: '' });

  disableDate = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  render() {

    const { handleSubmit } = this.props;
    return (
      <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <div className="row">
          <div className="col-md-12 col-lg-8">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <div className="sf-card-wrap">
                {/* zoom button  */}
                <div className="card-expands">
                  <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                    <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                </div>
                <div className="sf-card">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">Task Tags</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body mt-2">
                    <fieldset className="form-group sf-form">
                      <Field
                        label={"Task Tag name"}
                        name="tag_name"
                        placeholder={"Task Tag name"}
                        type="name"
                        component={customInput} />
                    </fieldset>
                    <fieldset className="form-group sf-form">
                      <Field
                        name="active"
                        id="active"
                        label={Strings.role_status}
                        component={CustomSwitch} />
                    </fieldset>
                  </div>
                </div>

                {/* zoom save button  */}
                <div className="row zoom-save-bnt">
                  <div className="col-md-12">
                    <div className="all-btn d-flex justify-content-end mt-4">
                      <div className="btn-hs-icon">
                        <button type="submit" className="bnt bnt-active">
                          <Icon type="save" theme="filled" /> {Strings.save_btn}</button>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              <div className="all-btn d-flex justify-content-end mt-4">
                <div className="btn-hs-icon">
                  <button type="submit" className="bnt bnt-active">
                    <Icon type="save" theme="filled" /> {Strings.save_btn}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    roles: state.roleManagement.roles,
    accessControlsByModule: state.accessControlManagement.accessControlsByModule,
    initialValues: { active: true, organisation_id: JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null }
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'addNewTaskTags', validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AddNewTaskTags)