import React from 'react';
import { Icon, Collapse, Upload, Modal, Dropdown, Menu, Select, notification } from 'antd';
import { reduxForm, Field, FieldArray } from 'redux-form';
import { validate } from '../../../utils/Validations/serviceAgentValidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import { customTextarea } from '../../common/customTextarea';
import { CustomSelect } from '../../common/customSelect';
import * as industryActions from '../../../actions/industryManagementAction';
import FormData from 'form-data'
import { Strings } from '../../../dataProvider/localize';
import AddServiceAgentIndustry from './AddServiceAgentIndustry';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import * as action from '../../../actions/organizationAction';
import * as subscriptionAction from '../../../actions/subscriptionAction';
import * as rolesActions from '../../../actions/roleManagementActions';
import { CustomAutoComplete } from '../../common/customAutoComplete';
import { industryCard, connectedOrgCard, subscriptCard, iconView } from './viewOtherServiceAgent'
import { getStorage, setStorage, currencyFormat, handleFocus } from '../../../utils/common';
import moment from 'moment';
import $ from 'jquery';
import { countryCodes } from '../../../dataProvider/countryCodes';
import * as orgUseraActions from "../../../actions/organizationUserAction";
import { VALIDATE_STATUS } from '../../../dataProvider/constant';
import { CustomDatepicker } from '../../common/customDatepicker';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DeepTrim } from '../../../utils/common';
import * as orgBillingActions from '../../../actions/organizationBillingAction'

const Panel = Collapse.Panel;

const Dragger = Upload.Dragger;

class AddServiceAgent extends React.Component {
  constructor(props) {
    super(props);
    this.state = { fileList: [], imageArray: [], cardExpnadBtn: true }
    this.sub_amount = 0;

  }

  componentDidMount() {
    this.props.rolesActions.getRoles(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id);
    this.props.subscriptionAction.getSubscription();
    this.props.industryActions.getIndustries();
    this.props.industryActions.getServices();
    this.props.industryActions.getCategories();
    this.props.industryActions.getSubCategories();
    this.props.action.getOtherServiceAgent();
  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);
    formData.organisation_type = 2; //need for backEnd
    formData.connected_org = JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id;
    var finalFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'org_users' || key === 'org_industries') {
        finalFormData.append(key, JSON.stringify(formData[key]));
      } else {
        finalFormData.append(key, formData[key]);
      }
    })

    if (this.state.fileList.length > 0) {
      finalFormData.append('logo', this.state.imageArray[0]);
    }
    finalFormData.append('sub_amount', this.sub_amount)
    this.props.action.addOrganization(finalFormData)
      .then((data) => {
        // this.props.reset();
        this.removeFile();
        this.props.orgBillingActions.getOrganizationBillingDetails(data.data.id);
        notification.success({
          message: Strings.success_title,
          description: data && data.message ? data.message : Strings.generic_error, onClick: () => { },
          className: 'ant-success'
        });
        this.props.action.getServiceAgent().then(() => {
          this.props.orgUseraActions.getOrganizationUsers(data.data.id);
          this.props.history.push({
            pathname: "./showServiceAgent",
            state: data.data.id
          })
        });
        this.props.industryActions.getSubCategories();
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

  userMenu = (
    <Menu>
      <Menu.Item onClick={this.handleUserManageClick} >Update industry detail</Menu.Item>
    </Menu>
  );

  renderMembers = ({ fields, meta: { error, submitFailed } }) => {
    if (fields.length === 0) {
      fields.push({ country_code: "+61", role_id: [] })
    }
    return (
      <div>
        <table className="add-user-table table">
          <tr>
            <th>{Strings.user_table_name}</th>
            <th>{Strings.user_table_email}</th>
            <th>{Strings.user_table_phone}</th>
            <th>{Strings.user_table_role}</th>
            <th></th>
          </tr>
          {fields.map((member, index) => {
            if (index === 0 && this.props.roles.find(role => role.is_admin === 1))
              this.props.change(`org_users[${index}].role_id`, this.props.roles.find(role => role.is_admin === 1) &&
                this.props.roles.find(role => role.is_admin === 1).id);
            return (
              <tr key={index}>
                <td>
                  <fieldset className="sf-form">
                    <Field
                      name={`${member}.name`}
                      placeholder={Strings.name_sau}
                      type="text"
                      component={customInput}
                    />
                  </fieldset>
                </td>
                <td>
                  <fieldset className="sf-form">
                    <Field
                      name={`${member}.email_address`}
                      placeholder={Strings.email_address_sau}
                      type="text"
                      component={customInput}
                    />
                  </fieldset>
                </td>
                <td>
                  <div className="co-code-mobile-no">
                    <fieldset className="sf-form co-code-txt">
                      <Field
                        name={`${member}.country_code`}
                        type="text"
                        showSearch={1}
                        options={countryCodes.map(country => ({
                          title: country.dial_code,
                          value: country.dial_code
                        }))}
                        component={CustomSelect}
                      />
                    </fieldset>
                    <fieldset className="sf-form mobile-ntxt">
                      <Field
                        name={`${member}.phone_number`}
                        placeholder={Strings.phone_number_sau}
                        type="text"
                        maxLength="10"
                        component={customInput}
                      />
                    </fieldset>
                  </div>
                </td>
                <td>
                  {index === 0 ?
                    this.props.roles && this.props.roles.find(role => role.is_admin === 1) ?
                      this.props.roles.find(role => role.is_admin === 1).name :
                      <fieldset className="sf-form">
                        <Field
                          name={`${member}.role_id`}
                          placeholder={Strings.role_id_sau}
                          type="text"
                          options={this.props.roles ? this.props.roles.map(role => ({ title: role.name, value: role.id })) : []}
                          component={CustomSelect}
                        />
                      </fieldset>
                    : <fieldset className="sf-form">
                      <Field
                        name={`${member}.role_id`}
                        placeholder={Strings.role_id_sau}
                        type="text"
                        options={this.props.roles ? this.props.roles.map(role => ({ title: role.name, value: role.id })) : []}
                        component={CustomSelect}
                      />
                    </fieldset>
                  }
                </td>
                <td>
                  {index === 0 ? null :
                    <button className='delete-bnt' type='button' onClick={() => fields.remove(index)}>
                      <i class="fa fa-trash-o"></i>
                    </button>}
                </td>
              </tr>
            )
          }
          )}
        </table>
        <div className="btn-hs-icon sm-bnt">
          <button className="bnt bnt-normal" type="button" onClick={() => fields.push({ country_code: "+61", role_id: [] })}>{Strings.add_user_btn}</button>
        </div><br />
        {submitFailed && error && <span class="error-input">{error}</span>}
      </div>
    )
  }

  removeFile = () => this.setState({ fileList: [], imageArray: [] });

  handleConnectButton = (service_agent_id) => {
    this.props.action.connectServiceAgent({
      service_agent_id: service_agent_id,
      org_id: JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id
    })
      .then(flag => {
        this.props.action.getOtherServiceAgent();
        this.props.action.getServiceAgent();
        this.props.reset();
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

  saAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["ServiceAgent"].permissions;
  permissions = {
    sf_service_agent_view_connected_orgs: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_service_agent_view_connected_orgs'),
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  calculateSubscriptionAmt = () => {
    if (this.props.formValues.subscription_id && this.props.formValues.sub_period && this.props.formValues.sub_period) {
      let subscription = this.props.subscriptions.find(
        subscript => subscript.subscription_id === this.props.formValues.subscription_id);
      if (subscription) {
        return subscription.amount - (((subscription.amount / subscription.period * this.props.formValues.sub_period)
          * this.props.formValues.sub_discount) / 100)
      }
    }
    if (this.props.formValues.subscription_id) {
      let subscription = this.props.subscriptions.find(
        subscript => subscript.subscription_id === this.props.formValues.subscription_id);
      if (subscription) {
        return subscription.amount
      }
    }
  }

  render() {
    const { handleSubmit } = this.props;
    const uploadPicProps = {
      listType: "picture",
      beforeUpload: file => {
        this.setState({
          fileList: [file],
        });
        return false;
      },
      multiple: false,
      onChange: (info) => {
        this.setState({ fileList: [info.fileList[info.fileList.length - 1]], imageArray: [info.file] })
      },
      accept: ".jpeg,.jpg,.png",
      fileList: this.state.fileList,
      onRemove: this.removeFile
    };
    var organization = this.props.otherServiceAgents.find(agent => agent.id == this.props.formValues.name)
    const selectedSubscription = organization ? this.props.subscriptions.find(subscript => subscript.subscription_id === organization.subscription_id) :
      {};
    this.sub_amount = this.calculateSubscriptionAmt()

    return (
      <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <form onSubmit={handleSubmit(this.onSubmit)}>
          <div className="row">
            <div className="col-md-12 col-lg-8 mb-4">
              <div className="sf-card-wrap">
                {/* zoom button  */}
                <div className="card-expands">
                  <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                    <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                </div>
                <div className="sf-card mb-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.service_agent_dtl}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>

                  <div className="sf-card-body mt-2">
                    <div className="row">
                      {organization ? iconView(organization) :
                        <div className="col-md-6 col-sm-6 col-lg-3 mb-3">
                          <div className="logo-upload">
                            <Dragger  {...uploadPicProps}>
                              <p className="ant-upload-drag-icon">
                                <i class="material-icons">cloud_upload</i>
                              </p>
                              <p className="ant-upload-text">{Strings.img_upload_text}</p>
                            </Dragger>
                          </div>
                        </div>}

                      <div className="col-md-12 col-lg-9">
                        <div className="row">
                          <div className="col-md-12 col-lg-6">
                            <fieldset className="form-group sf-form">
                              <Field
                                label={Strings.org_name}
                                name="name"
                                placeholder={Strings.name_sad}
                                type="text"
                                dataSource={this.props.otherServiceAgents.map(agent => ({ text: agent.name, value: agent.id }))}
                                component={CustomAutoComplete} />
                            </fieldset>
                          </div>
                          <div className="col-md-12 col-lg-6">
                            <fieldset className="form-group sf-form ">
                              <Field
                                label={Strings.org_pri_person}
                                name="primary_person"
                                placeholder={Strings.primary_person_sad}
                                type="text"
                                id="primary_person"
                                component={
                                  organization
                                    ? () =>
                                      <div>
                                        <label>{Strings.org_pri_person}</label>
                                        <span>{
                                          organization
                                            ? organization.primary_person
                                            : ''
                                        }</span>
                                      </div>
                                    : customInput
                                } />
                            </fieldset>
                          </div>
                          <div className="col-md-12 col-lg-6">
                            <fieldset className="form-group sf-form">
                              <Field
                                label={Strings.org_phone}
                                name="phone_number"
                                type="text"
                                id=""
                                component={
                                  organization
                                    ? () =>
                                      <div>
                                        <label>{Strings.org_phone}</label>
                                        <span>{
                                          organization
                                            ? organization.phone_number
                                            : ''
                                        }</span>
                                      </div>
                                    : customInput
                                } />
                            </fieldset>
                          </div>
                          <div className="col-md-12 col-lg-6">
                            <fieldset className="form-group sf-form">
                              <Field
                                label={Strings.org_email}
                                name="email_address"
                                placeholder={Strings.email_address_sad}
                                type="text"
                                id=""
                                component={
                                  organization
                                    ? () =>
                                      <div>
                                        <label>{Strings.org_email}</label>
                                        <span>{
                                          organization
                                            ? organization.email_address
                                            : ''
                                        }</span>
                                      </div>
                                    : customInput
                                } />
                            </fieldset>
                          </div>
                          <div className="col-md-12 col-lg-6">
                            <fieldset className="form-group sf-form">
                              <Field
                                label={Strings.website_txt}
                                name="website"
                                type="text"
                                id=""
                                component={organization ? () =>
                                  <div>
                                    <label>{Strings.website_txt}</label>
                                    <span>{
                                      organization
                                        ? organization.website
                                        : ''
                                    }</span>
                                  </div>
                                  : customInput} />
                            </fieldset>
                          </div>

                          <div className="col-md-12 col-lg-6">
                            <fieldset className="form-group sf-form">
                              <Field
                                label={Strings.org_abn}
                                name="abn_acn"
                                placeholder={Strings.abn_acn_sad}
                                type="text"
                                id=""
                                component={
                                  organization
                                    ? () =>
                                      <div>
                                        <label>{Strings.org_abn}</label>
                                        <span>{
                                          organization
                                            ? organization.abn_acn
                                            : ''
                                        }</span>
                                      </div>
                                    : customInput
                                } />
                            </fieldset>
                          </div>
                          <div className="col-md-12 col-lg-6">
                            <fieldset className="form-group sf-form">
                              <Field
                                label={Strings.notification_email_txt}
                                name="notification_email"
                                placeholder={Strings.notification_email_sad}
                                type="text"
                                id=""
                                component={
                                  organization
                                    ? () =>
                                      <div>
                                        <label>{Strings.notification_email_txt}</label>
                                        <span>{
                                          organization
                                            ? organization.notification_email
                                            : ''
                                        }</span>
                                      </div>
                                    : customInput
                                } />
                            </fieldset>
                          </div>
                          <div className="col-md-12 col-lg-6">
                            <fieldset className="form-group sf-form">
                              <Field
                                label={Strings.org_address}
                                name="address"
                                type="text"
                                id="address"
                                component={
                                  organization
                                    ? () =>
                                      <div>
                                        <label>{Strings.org_address}</label>
                                        <span>{
                                          organization
                                            ? organization.address
                                            : ''
                                        }</span>
                                      </div>
                                    : customTextarea
                                } />
                            </fieldset>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Service Industries */}
                {organization ? industryCard(organization, this.props.industries, this.props.services,
                  this.props.categories, this.props.subCategories)
                  :
                  <div className="sf-card sf-mcard a-sr-agent">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                      <h2 className="sf-pg-heading">{Strings.service_inductries_txt}</h2>
                      <div className="info-btn disable-dot-menu">
                        <Dropdown className="more-info" disabled overlay={''}>
                          <i className="material-icons">more_vert</i>
                        </Dropdown>
                      </div>
                    </div>

                    {/* INdustry */}
                    <FieldArray
                      name="org_industries" component={AddServiceAgentIndustry} change={this.props.change} />
                  </div>}
                {/* billing Details */}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.bill_card}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled overlay={''}>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>

                  <div className="sf-card-body mt-2">

                    <div className="data-v-row">
                      <div className="data-v-col">
                        <div className="view-text-value">
                          <fieldset className="form-group sf-form">
                            <Field
                              label="Address"
                              name="billing_address"
                              placeholder={Strings.billing_address_org}
                              type="text"
                              id=""
                              component={customTextarea} />
                          </fieldset>
                        </div>
                      </div>

                      <div className="data-v-col">
                        <div className="view-text-value">
                          <fieldset className="form-group sf-form">
                            <Field
                              label="Email"
                              name="billing_email_address"
                              placeholder={Strings.email_address_org}
                              type="text"
                              id=""
                              component={customInput} />
                          </fieldset>
                        </div>
                      </div>
                    </div>
                    {/*}: <button className="bnt bnt-active" onClick={this.addBillingDetailsHandler}><i class="material-icons">credit_card</i> {Strings.add_pay_meth_title}</button>*/}
                  </div>
                </div>

                {/* add users section */}

                <div className={organization ? "d-none" : "sf-card mt-4"}>
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.sa_user_card}</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>

                  <div className="sf-card-body">
                    <PerfectScrollbar className="sf-ps-scroll" onScrollX>
                      <div className="sf-ps-scroll-content">
                        <FieldArray
                          name="org_users" component={this.renderMembers} />
                      </div>
                    </PerfectScrollbar>
                  </div>
                </div>

                {/* zoom save button  */}
                <div className="row zoom-save-bnt">
                  <div className="col-lg-12">
                    <div className="all-btn d-flex justify-content-end">
                      <div className="btn-hs-icon">
                        {
                          organization
                            ? <button type="button" className="bnt bnt-active" onClick={() => this.handleConnectButton(organization.id)}>
                              <i class="fa fa-plug" aria-hidden="true"></i>
                              {Strings.connect_btn}
                            </button>
                            : <button type="submit" className="bnt bnt-active">
                              <i class="material-icons">save</i>{Strings.save_btn}
                            </button>
                        }
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* ------------------------
						Right panel all component
					------------------------------ */}

            <div className="col-md-12 col-lg-4 ">
              {/* {organization && this.permissions.sf_service_agent_view_connected_orgs !== -1 ? connectedOrgCard(organization) : null} */}

              {/* Subscrition  */}
              {organization ?
                subscriptCard(selectedSubscription)
                :
                <div className="sf-card">
                  <Collapse className="sf-collps-rt" defaultActiveKey={['1']} /* onChange={callback} */ expandIcon={({ isActive }) => <Icon type="caret-up" rotate={isActive ? 180 : 0} />}>
                    <Panel header={Strings.sub_card} key="1">
                      <div className="sf-card-body mt-2">

                        <fieldset className="sf-form form-group">
                          <Field name='subscription_id' label={Strings.sub_type} placeholder={Strings.subscription_id_sa} type="text"
                            options={
                              this.props.subscriptions
                                // .filter(subscript => subscript.active === 1)
                                .map(subscript => ({
                                  title: subscript.name, value: subscript.subscription_id,
                                  disabled: !subscript.active
                                }))} component={CustomSelect}
                            placeholder="Select user" />
                        </fieldset>

                        <fieldset className="form-group sf-form">
                          <Field
                            label={Strings.sub_invoice_date}
                            placeholder=""
                            name="invoice_start_date"
                            component={CustomDatepicker} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                          <Field
                            label={Strings.sub_percentage}
                            name="sub_discount"
                            placeholder={Strings.sub_discount_sa}
                            type="text"
                            id=""
                            component={customInput} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                          <Field
                            label={Strings.sub_discount_period}
                            name="sub_period"
                            placeholder={Strings.sub_period_sa}
                            type="text"
                            id=""
                            component={customInput} />
                        </fieldset>
                        <div className="view-text-value mb-3">
                          <label>{Strings.sub_discount_amt}</label>
                          <span>{this.sub_amount ? currencyFormat(this.sub_amount) : 0}</span>
                        </div>
                        <div className="view-text-value mb-2">
                          <label>{Strings.sub_date}</label>
                          <span>{moment().format('DD MMM YYYY')}</span>
                        </div>
                      </div>
                    </Panel>
                  </Collapse>
                </div>}
            </div>
          </div>

          <div className="row">
            <div className="col-lg-8 col-md-12">
              <div className="all-btn d-flex justify-content-end">
                <div className="btn-hs-icon">
                  {
                    organization
                      ? <button type="button" className="bnt bnt-active" onClick={() => this.handleConnectButton(organization.id)}>
                        <i class="fa fa-plug" aria-hidden="true"></i>
                        {Strings.connect_btn}
                      </button>
                      : <button type="submit" className="bnt bnt-active">
                        <i class="material-icons">save</i>{Strings.save_btn}
                      </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    subscriptions: state.subscription.subscriptions,
    roles: state.roleManagement.roles,
    otherServiceAgents: state.organization.otherServiceAgents,
    formValues: state.form.addServiceAgent && state.form.addServiceAgent.values
      ? state.form.addServiceAgent.values
      : {},
    industries: state.industryManagement.industries,
    services: state.industryManagement.services,
    categories: state.industryManagement.categories,
    subCategories: state.industryManagement.subCategories,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    industryActions: bindActionCreators(industryActions, dispatch),
    action: bindActionCreators(action, dispatch),
    subscriptionAction: bindActionCreators(subscriptionAction, dispatch),
    rolesActions: bindActionCreators(rolesActions, dispatch),
    orgUseraActions: bindActionCreators(orgUseraActions, dispatch),
    orgBillingActions: bindActionCreators(orgBillingActions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'addServiceAgent', validate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AddServiceAgent)