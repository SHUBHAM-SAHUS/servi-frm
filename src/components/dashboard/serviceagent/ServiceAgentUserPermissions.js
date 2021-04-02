import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../../../utils/Validations/roleValidation';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { CustomCheckbox } from '../../../components/common/customCheckbox';
import { Upload, Icon, Menu, Dropdown, Progress, Select, Radio } from 'antd';
import * as actions from '../../../actions/organizationUserAction';
import { Strings } from '../../../dataProvider/localize';

class ServiceAgentUserPermissions extends React.Component {
  render() {
    return (
      <div className="col-md-3">
        {(this.props.userId === undefined || this.props.userId === false) ?
          <div className="sf-card">

            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h4 className="sf-sm-hd sf-pg-heading">{Strings.perm_title}</h4>
            </div>

            <div className="sf-card-body">
              <div className="user-p-notxt d-flex justify-content-between">
                <img src="/images/owl-img.png" />
                <span>{Strings.perm_info_text}</span>
              </div>
            </div>

          </div> :

          <div className="sf-card mb-4">
            <form>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-xs-hd sf-pg-heading">{Strings.perm_card_title}
                  <span className="uhd-name">(Alex Smith)</span></h4>
              </div>

              <div className="sf-card-body">
                <div className="user-mng-chkbx">
                  <div className="sf-checkbox-b">
                    <div className="sf-roles-group">
                      <Radio.Group onChange={this.handleSizeChange}>
                        <Radio.Button value="bdm"><span className="rbp-btn">BDM</span></Radio.Button>
                        <Radio.Button value="accountManagert"><span className="rbp-btn">Account Manager</span></Radio.Button>
                        <Radio.Button value="administrator"><span className="rbp-btn">Administrator</span></Radio.Button>
                        <Radio.Button value="financeManager"><span className="rbp-btn">Finance Manager</span></Radio.Button>
                        <Radio.Button value="staff"><span className="rbp-btn">{Strings.role_staff}</span></Radio.Button>
                      </Radio.Group>
                    </div>
                  </div>

                  <div className="more-role-prmison">
                    <div className="sf-chkbx-group sf-updt-roles sf-scroll-bar h-400">
                      <Field name="read_only" label={Strings.perm_scope_doc} component={CustomCheckbox} />
                      <Field name="modify" label={Strings.perm_job_book} component={CustomCheckbox} />
                      <Field name="create" label={Strings.perm_generate_quote} component={CustomCheckbox} />
                      <Field name="delete" label={Strings.perm_send_quote} component={CustomCheckbox} />
                      <Field name="all" label={Strings.perm_generate_doc} component={CustomCheckbox} />
                    </div>
                  </div>

                </div>
                <div className="all-btn multibnt mt-3">
                  <div className="btn-hs-icon d-flex justify-content-between">
                    <button onClick={this.handleCancel} className="bnt bnt-normal">
                      {Strings.cancel_btn}</button>
                    <button type="submit" className="bnt bnt-active">
                      {Strings.update_btn}</button>
                  </div>
                </div>

              </div>
            </form>
          </div>}

      </div>
    );
  }
}

export default ServiceAgentUserPermissions;