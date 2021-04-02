// ViewEditOrganization
import React from 'react';
import { Icon, Menu, Dropdown, Modal, Upload, Popconfirm, Collapse, notification } from 'antd';
import { reduxForm, Field, FieldArray, FormSection } from 'redux-form';
import { validate } from '../../../utils/Validations/serviceAgentValidation';
import { connect } from 'react-redux';
import moment from 'moment';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import * as actions from '../../../actions/organizationAction';
import * as industryManagementAction from '../../../actions/industryManagementAction';
import * as subscriptionAction from '../../../actions/subscriptionAction';
import * as rolesActions from '../../../actions/roleManagementActions';
import * as orgUserActions from '../../../actions/organizationUserAction';
import { Strings } from '../../../dataProvider/localize';
import { CustomSelect } from '../../common/customSelect';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { getStorage, abbrivationStr, currencyFormat, handleFocus } from '../../../utils/common';
import { customTextarea } from '../../common/customTextarea';

import ServiceAgentSubscriptionPayment from '../serviceagent/ServiceAgentSubscriptionPayment'
import EditSingleService from './EditSingleService';
import AddServiceAgentIndustry from './AddServiceAgentIndustry';
import RenderServicesArrayView from './RenderServicesArrayView';
import UpdateSingleUser from '../organization/UpdateSingleUser';
import { countryCodes } from '../../../dataProvider/countryCodes'
import $ from 'jquery';
import { VALIDATE_STATUS } from '../../../dataProvider/constant'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DeepTrim } from '../../../utils/common';
import EditBillingAddress from '../organization/EditBillingAddress';
const Panel = Collapse.Panel;



function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class ViewEditServiceAgent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'none',
      industryFlag: 'none',
      addressInfoFlag: 'none',
      changeSubscriptionFlag: 'none',
      fileList: [],
      imageURL: null,
      showPaymentPage: false,
      inlineUsers: [],
      cardExpnadBtn: true
    }
    this.props.rolesActions.getRoles(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id);
    this.props.subscriptionAction.getSubscription();
  }

  componentDidMount() {
    this.props.rolesActions.getRoles(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id);
    this.props.subscriptionAction.getSubscription();
    this.props.industryManagementAction.getIndustries();
    this.props.industryManagementAction.getServices();
    this.props.industryManagementAction.getCategories();
    this.props.industryManagementAction.getSubCategories();
  }

  //showEdit // showAdd
  onSubmit = async formData => {
    formData = await DeepTrim(formData);
    formData.organisation_type = 2;
    var finalFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'org_industries' || key === 'conncted_orgs') {
        finalFormData.append(key, JSON.stringify(formData[key]));
      } else {
        finalFormData.append(key, formData[key]);
      }
    })
    if (this.state.fileList.length > 0) {
      finalFormData.append('logo', this.state.fileList[0]);
    }
    this.props.action.updateOrganization(finalFormData).then((flag) => {
      this.props.action.getServiceAgent();
      this.props.industryManagementAction.getSubCategories();
      this.handleCancel();
    }).catch((error) => {
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

  handleEditClick = () => {
    this.setState({
      displayEdit: 'block',
      industryFlag: 'none',
      addressInfoFlag: 'none',
      changeSubscriptionFlag: 'none',
    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleIndustryEditClick = (service, industry_id) => {
    this.setState({
      displayEdit: 'none',
      industryFlag: 'block',
      addressInfoFlag: 'none',
      changeSubscriptionFlag: 'none',
      selectedService: service,
      selectedIndustryId: industry_id
    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleCancel = () => {
    this.setState({
      displayEdit: 'none',
      industryFlag: 'none',
      addressInfoFlag: 'none',
      changeSubscriptionFlag: 'none',
    });
  }

  handleUserManageClick = () => {
    var organization = this.props.serviceAgents.find(organ => organ.id === this.props.location.state)
    this.props.history.push({ pathname: '/dashboard/userManagement', state: organization.id })
  }

  handleChangeSubscription = () => {
    this.setState({
      changeSubscriptionFlag: 'block',
    });
  }

  cancelChangeSubscription = () => {
    this.setState({
      changeSubscriptionFlag: 'none',
    });
  }

  userMenu = (<Menu>
    <Menu.Item onClick={this.handleUserManageClick}>{Strings.menu_user_mgmt}</Menu.Item>
  </Menu>);

  changeSubscription = (<Menu>
    <Menu.Item onClick={this.handleChangeSubscription}>Change Subscription</Menu.Item>
  </Menu>);

  editIndustryMenu = (<Menu>
    <Menu.Item onClick={this.handleIndustryEditClick}>{Strings.edit_industry_menu}</Menu.Item>
  </Menu>);

  editMenu = (
    <Menu>
      <Menu.Item onClick={this.handleEditClick}>{Strings.menu_edit_org}</Menu.Item>
    </Menu>
  )

  removeFile = () => this.setState({ fileList: [] });

  getAmountStr = () => {
    const newSubs = this.props.subscriptions.find(subs => subs.subscription_id === this.props.formValues.subscription_id)
    return "$" + newSubs.amount //+ "/Month"
  }

  handleIndustryDelete = industry_id => {
    this.props.action.deleteSAIndustry({
      service_agent_id: this.props.initialValues.id,
      industry_id: industry_id
    }).then((flag) => {
      this.props.reset();
    })
      .catch((message) => {
        notification.error({
          message: "Error!",
          description: message ? message : "Something went wrong please try again later",
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  handleServiceDelete = service_id => {
    this.props.action.deleteSAService({
      service_agent_id: this.props.initialValues.id,
      service_id: service_id
    })
      .then((flag) => {
        this.props.reset();
      })
      .catch((message) => {
        notification.error({
          message: "Error!",
          description: message ? message : "Something went wrong please try again later",
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  displayIndustries = (organization) => (
    <FormSection name="org_services">{
      organization.org_industries
        .map((industry) => <div className="sf-card-inner">
          <div className="view-text-value edit-si-box"><label>{Strings.service_inductry_txt}</label>
            <span>{this.props.industries.find(ind => ind.id === industry.industry_id) ?
              this.props.industries.find(ind => ind.id === industry.industry_id).industry_name : ""}</span>
            <div class="doc-action-bnt">
              <button class="normal-bnt"><i class="material-icons"
                onClick={() => this.handleIndustryEditClick(industry, industry.industry_id)}>edit</i></button>
              <button class="normal-bnt"><i class="fa fa-trash-o" onClick={() => this.handleIndustryDelete(industry.industry_id)}></i></button>
            </div>
          </div>
          {industry.services && industry.services.map(service => {
            if (service.service_id) {
              return <div className="add-sfs-agent">
                <div className="sf-card-inn-bg pl-0 pt-0">
                  <div className="view-text-value sa-cat-heading">
                    <button className="dragde-bnt normal-bnt">
                      <i class="material-icons">more_horiz</i>
                      <i class="material-icons">more_horiz</i>
                    </button>
                    <label>{this.props.services.find(ser => ser.id === service.service_id) ?
                      this.props.services.find(ser => ser.id === service.service_id).service_name :
                      null}</label>
                    <div class="doc-action-bnt">
                      <button class="normal-bnt" onClick={() => this.handleServiceDelete(service.service_id)}><i class="fa fa-trash-o"></i></button>
                    </div>
                  </div>
                  <div className="sa-cat-pleft">
                    {service.categories && service.categories.map(category => {
                      if (category.category_id) {
                        return <div className="sa-sub-cat">
                          <div className="view-text-value cat-view-value">
                            <label>{Strings.category_txt}</label>
                            <span>{this.props.categories.find(cat => cat.id === category.category_id) ?
                              this.props.categories.find(cat => cat.id === category.category_id).category_name
                              : null}</span></div>
                          <div className="view-text-value">
                            <label>{Strings.sub_category_txt}</label>
                            <span className="sub-cat-value">
                              {category.subcategory && category.subcategory.map((subCategory, index) =>
                                <span>{index !== 0 ? <i>,</i> : null}
                                  {this.props.subCategories.find((sub) => sub.id === subCategory.sub_category_id) ?
                                    this.props.subCategories.find(sub => sub.id === subCategory.sub_category_id).sub_category_name
                                    : null}</span>
                              )}</span></div>
                        </div>
                      }
                    })}</div>
                </div>
              </div>
            }
          })}
          <FormSection name={`$${industry.industry_id}`}>
            <FieldArray name={`services`} formValues={this.props.formValues.org_services && this.props.formValues.org_services[`$${industry.industry_id}`]} industry_id={industry.industry_id} component={RenderServicesArrayView} change={this.props.change} />
          </FormSection>
        </div>)}
    </FormSection>
  )

  showMakeSubscriptionPayment = (oldSubscription) => {
    const newSubs = this.props.subscriptions.find(subs => subs.subscription_id === this.props.formValues.subscription_id)
    if (newSubs.amount > 0 && newSubs.subscription_id !== oldSubscription.subscription_id) {
      this.setState({
        showPaymentPage: true,
      });
    } else {
      this.cancelChangeSubscription()
    }
  }

  dissmissSubscriptionPayment = () => {
    this.setState({
      changeSubscriptionFlag: 'none',
      showPaymentPage: false,
    });
  }

  saAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["ServiceAgent"].permissions;
  permissions = {
    sf_update_serviceAgent: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_update_serviceAgent'),
    sf_update_service_industry: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_update_service_industry'),
    sf_change_service_subscription: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_change_service_subscription'),
    sf_read_service_agent: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_read_service_agent'),
    sf_read_service_industry: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_read_service_industry'),
    sf_read_connected_org: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_read_connected_org'),
    sf_read_service_subscription: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_read_service_subscription'),
    sf_service_agent_view_connected_orgs: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_service_agent_view_connected_orgs'),
  }

  onIndustrySubmit = async formData => {
    formData = await DeepTrim(formData);

    var finalFormUpdate = {
      service_agent_id: formData.id,
      org_industries: [...formData.org_industries]
    }
    if (formData.org_services) {
      Object.keys(formData.org_services).forEach(key => {
        var industryObj = formData.org_services[key];
        industryObj.industry_id = parseInt(key.split('$')[1]);
        finalFormUpdate.org_industries.push(industryObj);
      })
    }

    if (finalFormUpdate.org_industries.length > 0 && Object.keys(finalFormUpdate.org_industries[finalFormUpdate.org_industries.length - 1]).length === 0) {
      finalFormUpdate.org_industries.pop()
    }
    if (finalFormUpdate.org_industries.length > 0) {
      this.props.action.updateServiceAgentService(finalFormUpdate)
        .then((flag) => {
          this.props.reset();
          this.props.industryManagementAction.getSubCategories();
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

  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location && this.props.location.state && nextProps.location && nextProps.location.state &&
      this.props.location.state != nextProps.location.state) {
      this.state.fileList = [];
      this.state.imageURL = null;
    }
  }

  renderMembers = ({ fields, meta: { error, submitFailed } }) => (
    <>
      <div className="sf-c-table org-user-table ve-a-user-t">
        {fields.map((member, index) => (
          <div className="tr" key={index}>
            <span className="td">
              <fieldset className="sf-form">
                <Field
                  name={`${member}.name`}
                  type="text"
                  component={customInput}
                />
              </fieldset>
            </span>
            <span className="td">
              <fieldset className="sf-form">
                <Field
                  name={`${member}.email_address`}
                  type="text"
                  component={customInput}
                />
              </fieldset>
            </span>
            <span className="td">
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
                    type="text"
                    maxLength="10"
                    component={customInput}
                  />
                </fieldset>
              </div>
            </span>
            <span className="td">
              <fieldset className="sf-form">
                <Field
                  name={`${member}.role_id`}
                  type="text"
                  options={this.props.roles ? this.props.roles.map(role => ({ title: role.name, value: role.id })) : []}
                  component={CustomSelect}
                  placeholder={Strings.user_role_placeholder}
                />
              </fieldset>
            </span>
            <span className="td"><button className='delete-bnt' type='button' onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></span>
          </div>

        ))}
      </div>
      <div className="btn-hs-icon sm-bnt bnt-error">
        <button className="bnt bnt-normal" type="button" onClick={() => fields.push({ country_code: "+61" })}>{Strings.add_user_btn}</button>
        {submitFailed && error && <span className="error-input">{error}</span>}
      </div>
    </>
  )

  handleOrgUserSubmit = async (formData) => {
    formData = await DeepTrim(formData);

    if (formData.org_users) {
      var finalForm = { org_users: [] };
      formData.org_users.forEach(user => {
        finalForm.org_users.push({ ...user, organisation_id: this.props.initialValues.id })
      })
      this.props.orgUserActions.updateUsersFromView(finalForm, this.props.initialValues.id).then((message) => {
        this.props.change('org_users', []);
        notification.success({
          message: Strings.success_title,
          description: message,
          onClick: () => { },
          className: 'ant-success'
        });
      }).catch((error) => {
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
  }

  handdleDeleteUserClick = (user) => {
    if (user.role.org_default_role == 1 && this.props.users && this.props.users.filter(
      user => user.role.org_default_role == 1
    ).length < 2) {
      notification.error({
        message: Strings.error_title,
        description: Strings.user_list_delete_alert,
        onClick: () => { },
        className: 'ant-error'
      });
      return
    }

    this.props.orgUserActions.deleteOrganizationUser({
      organisation_id: user.organisation_id,
      user_name: user.user_name
    }, this.props.initialValues.id).then(message => {
      notification.success({
        message: Strings.success_title,
        description: message,
        onClick: () => { },
        className: 'ant-success'
      });
    }).catch((message) => {
      notification.error({
        message: Strings.error_title,
        description: message ? message : Strings.generic_error,
        onClick: () => { },
        className: 'ant-error'
      });
    });
  }

  handleUserEditClick = (user) => {
    var { inlineUsers } = this.state
    inlineUsers.push(user.id);
    this.setState({ inlineUsers })
  }

  removeInlineUser = (user) => {
    var { inlineUsers } = this.state
    var index = inlineUsers.findIndex(id => id === user.id)
    if (index != -1) {
      inlineUsers.splice(index, 1);
    }
    this.setState({ inlineUsers })
  }

  EditBillingAddressHandler = () => {
    this.setState({
      billingFlag: 'none',
      displayEdit: 'none',
      addressInfoFlag: 'block',
      showSubscriptionLevel: 'none',
      industryFlag: 'none',
    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  editBillingMenu = (<Menu>
    <Menu.Item onClick={this.EditBillingAddressHandler}>{Strings.menu_edit_bill}</Menu.Item>
    {/* <Menu.Item onClick={this.EditBillingDetailsHandler}>{Strings.menu_update_payment}</Menu.Item> */}
  </Menu>);

  addBillingMenu = (<Menu>
    <Menu.Item onClick={this.EditBillingAddressHandler}>{Strings.menu_update_payment}</Menu.Item>
  </Menu>);

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  render() {
    const { handleSubmit, users, billingDetails } = this.props;
    var userFlag = false;
    const deleteFunc = (user) => {
      console.log("test")
      if (!userFlag) {
        userFlag = true; return null
      }
      return <Popconfirm
        title={Strings.user_list_confirm_delete_alert}
        // icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
        onConfirm={() => this.handdleDeleteUserClick(user)}
        placement="topRight"
        okText="Yes"
        cancelText="No"
        className="delete-bnt"
      >
        <button className='delete-bnt' userId={user.id}>
          <i class="fa fa-trash-o"></i>
        </button>
      </Popconfirm>
    }
    var organization = this.props.serviceAgents.find(organ => organ.id === this.props.location.state);
    const selectedSubscription = this.props.subscriptions.find(subscript => subscript.subscription_id === this.props.initialValues.subscription_id)
    const uploadPicProps = {
      beforeUpload: file => {
        this.setState({
          fileList: [file],
        });
        return false;
      },
      multiple: false,
      onChange: async (info) => {
        //this.setState({ fileList: [info.file] })
        await getBase64(info.file, imageUrl =>
          this.setState({
            imageURL: imageUrl,
            fileList: [info.file]
          }),
        );
      },
      accept: ".jpeg,.jpg,.png",
      fileList: this.state.fileList,
      onRemove: this.removeFile
    };
    return (
      <div className={this.props.togleSearch ? "col-sm-12 col-md-9 col-lg-9" : "col-sm-12 col-md-9 col-lg-9 col-md-srch"}>
        <div className="row">
          <div className="col-md-12 col-lg-8">
            <div className="sf-card-wrap">
              {/* zoom button  */}
              <div className="card-expands">
                <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                  <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
              </div>
              <div className={this.permissions.sf_read_service_agent !== -1 ? "sf-card mb-4 sf-mcard" : "d-none"}>
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.service_agent_dtl}</h2>
                  {this.permissions.sf_update_serviceAgent !== -1 ?
                    <div className="info-btn">
                      {/* Drop down for card */}
                      <Dropdown className="more-info" overlay={this.editMenu}>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                      {/*Drop down*/}
                    </div> : <Dropdown className="more-info disable-drop-menu" disabled>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>}
                </div>
                {/**Organization Details */}
                <div className="sf-card-body mt-2">
                  <div className="row">

                    <div className="col-md-2">
                      <div className="view-logo">
                        {organization ?
                          organization.logo ?
                            <img src={organization.logo} /> : <b>{abbrivationStr(organization.name)}</b>
                          : null/* <img src="/images/sf-list-img.png"/> */}
                      </div>
                    </div>

                    <div className="col-md-10">

                      <div className="data-v-row">
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.org_name}</label>
                            <span>{organization ? organization.name : ''}</span>
                          </div>
                        </div>

                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.org_pri_person}</label>
                            <span>{organization ? organization.primary_person : ''}</span>
                          </div>
                        </div>

                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.org_phone}</label>
                            <span>{organization ? `${organization.phone_number}` : ''}</span>
                          </div>
                        </div>

                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.org_email}</label>
                            <span>{organization ? organization.email_address : ''}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.website_txt}</label>
                            <span>{organization ? organization.website : ''}</span>
                          </div>
                        </div>

                        <div className="data-v-col">
                          <div className="view-text-value pr-3">
                            <label>{Strings.org_address}</label>
                            <span>{organization ? organization.address : ''}</span>
                          </div>
                        </div>

                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.org_abn}</label>
                            <span>{organization ? organization.abn_acn : ''}</span>
                          </div>
                        </div>

                        <div className="data-v-col">
                          <div className="view-text-value pr-3">
                            <label>{Strings.notification_email_txt}</label>
                            <span>{organization ? organization.notification_email : ''}</span>
                          </div>
                        </div>

                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.short_code_txt}</label>
                            <span>{organization ? organization.org_code : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>


              {/* Service Industries */}

              <div className={"sf-card sf-mcard v-sr-agent"}>
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.service_inductries_txt}</h2>
                  {/* {this.permissions.sf_update_service_industry !== -1 ?
                    <div className="info-btn">
                    </div> : null} */}
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info">
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>

                <div className="sf-card-body">
                  <form onSubmit={handleSubmit(this.onIndustrySubmit)}>
                    {organization && organization.org_industries ?

                      this.displayIndustries(organization)
                      : null}
                    {/* <div className="btn-hs-icon sm-bnt">
                                    <button className="bnt bnt-normal" type="button">{Strings.add_industry_btn}</button>
                                </div> */}
                    <FieldArray
                      name="org_industries" component={AddServiceAgentIndustry} change={this.props.change} initValueFromEdit={true} />
                    {/* <div className="s-n-bnt btn-hs-icon sm-bnt ml-4">
                      <button type="submit" className="bnt bnt-active">
                        {Strings.update_btn}</button>
                    </div> */}
                  </form>
                </div>
              </div>

              {/* Billing Details section */}
              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.bill_card}</h2>
                  <div className="info-btn">
                    <Dropdown className="more-info"
                      overlay={
                        // billingDetails.card_details === null ? 
                        // this.addBillingMenu : 
                        this.editBillingMenu}>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>

                <div className="sf-card-body mt-2">

                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Address</label>
                        <span>{billingDetails.billing_address}</span>
                      </div>
                    </div>

                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Email</label>
                        <span>{billingDetails.billing_email_address}</span>
                      </div>
                    </div>

                    {/* <div className="data-v-col">
                      <div className="view-text-value">
                        <label>Next Payment Due</label>
                        <span>{moment(billingDetails.payment_due_date).format('DD MMM YYYY')}</span>
                      </div>
                    </div>
                  </div> */}

                    {/* billingDetails.card_details != null ?
                    <div className="data-v-row">
                      <div className="data-v-col">
                        <div className="view-text-value">
                          <label>Payment Method</label>
                          <span>{billingDetails.card_details.Number}</span>
                        </div>
                      </div>
                      <div className="data-v-col">
                        <div className="view-text-value">
                          <label>Card Expiry</label>
                          <span>{
                            (billingDetails
                              && billingDetails.card_details
                              && billingDetails.card_details.ExpiryMonth
                              && billingDetails.card_details.ExpiryYear)
                              ? billingDetails.card_details.ExpiryMonth + '/' + billingDetails.card_details.ExpiryYear
                              : null
                          }</span>
                        </div>
                      </div>
                    </div> : <button className="bnt bnt-active" onClick={this.addBillingDetailsHandler}><i class="material-icons">credit_card</i> {Strings.add_pay_meth_title}</button> */}

                  </div>
                </div>
              </div>

              {/**User List */}

              <div className="sf-card sf-mcard my-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.sa_user_card}</h2>
                  <div className="info-btn">
                    <Dropdown className="more-info" overlay={this.userMenu}>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>

                <div className="sf-card-body">
                  <PerfectScrollbar className="sf-ps-scroll" onScrollX>
                    <div className="sf-ps-scroll-content">
                      <div className="sf-c-table org-user-table">
                        <div className="tr">
                          <span className="th">{Strings.user_table_name}</span>
                          <span className="th">{Strings.user_table_email}</span>
                          <span className="th">{Strings.user_table_phone}</span>
                          <span className="th">{Strings.user_table_role}</span>
                          <span className="th"></span>
                        </div>
                        {users.map(user => {
                          var inline = this.state.inlineUsers.findIndex(id => id === user.id);
                          if (inline !== -1) {
                            return <UpdateSingleUser
                              form={'UpdateSingleUser' + user.id} initialValues={user}
                              removeInlineUser={this.removeInlineUser} />
                          }
                          return (
                            <div className="tr">
                              <span className="td">{user.name + " " + (user.last_name ? user.last_name : " ")}</span>
                              <span className="td">{user.email_address}</span>
                              <span className="td">{`${user.country_code}${user.phone_number}`}</span>
                              <span className="td">{user.role.name}</span>
                              <span className="td">
                                <div className="d-flex">
                                  <button className='delete-bnt' type='button' onClick={() => this.handleUserEditClick(user)}>
                                    <i class="material-icons">create</i>
                                  </button>
                                  {/* {user.role.org_default_role == 0 ? */}

                                  <Popconfirm
                                    title={Strings.user_list_confirm_delete_alert}
                                    // icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                    onConfirm={() => this.handdleDeleteUserClick(user)}
                                    placement="topRight"
                                    okText="Yes"
                                    cancelText="No"
                                    className="delete-bnt"
                                  >
                                    <button className='delete-bnt' userId={user.id}>
                                      <i class="fa fa-trash-o"></i>
                                    </button>
                                  </Popconfirm>
                                  {/* deleteFunc(user)} */}
                                </div>
                              </span>
                            </div>
                          )
                        })}
                      </div>
                      <form onSubmit={handleSubmit(this.handleOrgUserSubmit)}>
                        <FieldArray name="org_users" component={this.renderMembers} />
                        {
                          this.props.formValues && this.props.formValues.org_users && this.props.formValues.org_users.length > 0
                            ? <div className="s-n-bnt btn-hs-icon sm-bnt ml-4 usr-sb-btn">
                              <button type="submit" className="bnt bnt-active">
                                <i class="material-icons">save</i>{Strings.save_btn}</button>
                            </div>
                            : null
                        }
                        {/* <div className="s-n-bnt btn-hs-icon sm-bnt ml-4">
                      <button type="submit" className="bnt bnt-active">
                        <i class="material-icons">save</i>{Strings.save_btn}</button>
                    </div> */}
                      </form>
                    </div>
                  </PerfectScrollbar>
                </div>
              </div>
            </div>
          </div>

          {/* ------------------------ 
          Right panel all component 
          ------------------------------ */}

          {/* Edit */}
          <div className="col-md-12 col-lg-4">
            <div className="sf-card mb-4" style={{ display: this.state.displayEdit }}>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">{Strings.edit_sa_card}</h4>
                <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
              </div>
              <div className="sf-card-body mt-2">
                <form onSubmit={handleSubmit(this.onSubmit)}>
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.org_name}
                      name="name"
                      type="text"
                      id=""
                      component={customInput} />
                  </fieldset>

                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.org_pri_person}
                      name="primary_person"
                      type="text"
                      id="primary_person"
                      component={customInput} />
                  </fieldset>

                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.org_phone}
                      name="phone_number"
                      type="text"
                      id=""
                      component={customInput} />
                  </fieldset>

                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.org_email}
                      name="email_address"
                      type="text"
                      id=""
                      component={customInput} />
                  </fieldset>

                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.website_txt}
                      name="website"
                      type="text"
                      id=""
                      component={customInput} />
                  </fieldset>

                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.notification_email_txt}
                      name="notification_email"
                      type="text"
                      id=""
                      component={customInput} />
                  </fieldset>

                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.org_address}
                      name="address"
                      type="text"
                      id="address"
                      component={customTextarea} />
                  </fieldset>

                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.org_abn}
                      name="abn_acn"
                      type="text"
                      id=""
                      component={customInput} />
                  </fieldset>

                  <div className="form-group">
                    <div className="add-new-file">
                      <div className="view-logo">
                        {this.state.imageURL !== null ? <img src={this.state.imageURL} /> : organization ? organization.logo ? <img src={organization.logo} /> : <b>{abbrivationStr(organization.name)}</b> : null}
                      </div>
                      <div className="edit-img-title">
                        <Upload {...uploadPicProps} >
                          <span className="edit-image-logo">{Strings.org_edit_img}</span>
                        </Upload>
                      </div>
                    </div>
                  </div>

                  <div className="all-btn multibnt">
                    <div className="btn-hs-icon d-flex justify-content-between">
                      <button onClick={this.handleCancel} className="bnt bnt-normal" type="button">
                        {Strings.cancel_btn}</button>
                      <button type="submit" className="bnt bnt-active">
                        {Strings.update_btn}</button>
                    </div>
                  </div>
                </form>
              </div>
              {/**Industry Details */}
            </div>
            <div className="sf-card mb-4" style={{ display: this.state.industryFlag }}>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">{Strings.edit_indstry_details}</h4>
                <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
              </div>
              <div className="sf-card-body mt-2 edit-updet-sai">
                <EditSingleService serviceObject={this.state.selectedService} initValueFromEdit={true}
                  industryId={this.state.selectedIndustryId} service_agent_id={organization ? organization.id : null}
                  handleCancel={this.handleCancel} getSubCategories={this.props.industryManagementAction.getSubCategories} />
              </div>
            </div>

           {/** Update Billing Address Info */}
           <EditBillingAddress
              handleCancel={this.handleCancel}
              addressInfoFlag={this.state.addressInfoFlag}
              organization={organization}
            />


            {/* Connected Organisations */}

            {/* <div className={this.permissions.sf_service_agent_view_connected_orgs !== -1 ? "sf-card con-ord-mh" : "d-none"}>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">{Strings.connected_org_txt}</h4>
              </div>
              <div className="sf-card-body">
                <div className="con-org-list">
                  {organization ? organization.conncted_orgs.map(org => <div>
                    <span>{org.name}</span><br /></div>) : null}

                </div>
              </div>
            </div> */}

            {/* Subscrition  */}
            <div className="sf-card">
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">{Strings.sub_card}</h4>
                <div className="info-btn disable-dot-menu">
                  <Dropdown className="more-info" disabled>
                    <i className="material-icons">more_vert</i>
                  </Dropdown>
                </div>
              </div>
              <div className="sf-card-body">
                <div className="view-text-value mb-3 sub-status-dtl">
                  {organization && organization.subscription_active ? < span className="sub-pill active">Active</span> : <span className="sub-pill inactive">Inactive</span>}
                  <label>{Strings.sub_type}</label>
                  <span>{organization && organization.subscription_type ? organization.subscription_type : ''}</span>

                  {organization && organization.amount ? <div className="sub-amt-period">
                    <span>{organization && organization.amount ? currencyFormat(organization.amount) : 0}</span>
                    <span>{organization && organization.period ?
                      organization.period == 1 ? "Month" :
                        organization.period == 3 ? "Quarter" :
                          organization.period == 12 ? "Year" : null : null}</span>
                  </div> : null}
                </div>

                <div className="view-text-value mb-3">
                  <label>{Strings.sub_invoice_date}</label>
                  <span>{organization && organization.invoice_start_date
                    ? organization.invoice_start_date.split('T')[0] : ''}</span>
                </div>
                {organization && organization.sub_period ? <div className="view-text-value mb-3">
                  <label>{Strings.sub_percentage}</label>
                  <span>{organization ? organization.sub_discount : ''}</span>
                </div> : null}
                {organization && organization.sub_period ? <div className="view-text-value mb-3">
                  <label>{Strings.sub_discount_period}</label>
                  <span>{organization ? organization.sub_period : ''}</span>
                </div> : null}
                <div className="view-text-value mb-3">
                  <label>{Strings.sub_discount_amt}</label>
                  <span>{organization ? currencyFormat(organization.sub_amount) : 0}</span>
                </div>
                <div className="view-text-value mb-2">
                  <label>{Strings.sub_date}</label>
                  <span>{organization ? organization.subscription_start_date : ''}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {
          this.state.showPaymentPage ? <Modal className="sr-agent-modal"
            visible={this.state.showPaymentPage}
            onOk={this.handleOk}
            width={800}
            footer={null}
          >
            <ServiceAgentSubscriptionPayment agentID={this.props.initialValues.id} dissmissSubscriptionPayment={this.dissmissSubscriptionPayment} subscriptionID={this.props.formValues.subscription_id} />
          </Modal> : ''
        }
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var value = state.organization.serviceAgents.find(organ => organ.id === ownProps.location.state);
  var testVal = { ...value, org_industries: [] };
  //${(this.props.subscriptions.find(subs => subs.subscription_id === this.state.form.viewEditServiceAgent.subscription_id).amount)}/Month</strong>
  return {
    serviceAgents: state.organization.serviceAgents,
    initialValues: testVal,
    users: state.organizationUsers.users,
    industries: state.industryManagement.industries,
    services: state.industryManagement.services,
    categories: state.industryManagement.categories,
    subCategories: state.industryManagement.subCategories,
    subscriptions: state.subscription.subscriptions,
    roles: state.roleManagement && state.roleManagement.roles ? state.roleManagement.roles : [],
    formValues: state.form.viewEditServiceAgent && state.form.viewEditServiceAgent.values
      ? state.form.viewEditServiceAgent.values : {},
    billingDetails: state.organizationBilling.billingDetails,

  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    industryManagementAction: bindActionCreators(industryManagementAction, dispatch),
    subscriptionAction: bindActionCreators(subscriptionAction, dispatch),
    rolesActions: bindActionCreators(rolesActions, dispatch),
    orgUserActions: bindActionCreators(orgUserActions, dispatch),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'viewEditServiceAgent', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ViewEditServiceAgent)