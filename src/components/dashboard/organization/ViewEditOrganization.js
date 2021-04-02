// ViewEditOrganization
import React from 'react';
import { Icon, Menu, Dropdown, Modal, Upload, Popconfirm, notification } from 'antd';
import { reduxForm, Field, isDirty, FieldArray, FormSection } from 'redux-form';
import { validate } from '../../../utils/Validations/organizationValidaton';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import * as actions from '../../../actions/organizationAction';
import * as subscriptionAction from '../../../actions/subscriptionAction';
import * as rolesActions from '../../../actions/roleManagementActions';
import * as orgUserActions from '../../../actions/organizationUserAction';
import { Strings } from '../../../dataProvider/localize';
import AddEditBillingDetails from './AddEditBillingDetails';
import EditBillingAddress from './EditBillingAddress';
import { ADMIN_DETAILS, ACCESS_CONTROL, VALIDATE_STATUS } from '../../../dataProvider/constant'
import { getStorage, currencyFormat, handleFocus } from '../../../utils/common';
import { customTextarea } from '../../common/customTextarea';
import UpdateSingleUser from './UpdateSingleUser';
import { CustomSelect } from '../../common/customSelect';
import moment from 'moment'
import { abbrivationStr } from '../../../utils/common'
import $ from 'jquery';
import { countryCodes } from '../../../dataProvider/countryCodes'
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DeepTrim } from '../../../utils/common';
import AddServiceAgentIndustry from './AddServiceAgentIndustry';
import ViewUserProfile from './viewUserProfile';
import RenderServicesArrayView from './RenderServicesArrayView';
import * as industryManagementAction from '../../../actions/industryManagementAction';
import EditSingleService from './EditSingleService';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

var fileObj = null
//var imageURL = null

class ViewEditOrganization extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'none',
      billingFlag: 'none',
      addressInfoFlag: 'none',
      fileList: [],
      logoImageURL: '',
      inlineUsers: [],
      imageURL: null,
      cardExpnadBtn: true,
      industryFlag: 'none',
      profileViewVisible: false
    }
    this.currentOrgId = JSON.parse(getStorage(ADMIN_DETAILS)) ?
      JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id :
      null;
    this.props.subscriptionAction.getSubscription();
    this.props.rolesActions.getRoles(this.currentOrgId);
    this.currentOrg = JSON.parse(getStorage(ADMIN_DETAILS)) ?
      JSON.parse(getStorage(ADMIN_DETAILS)).organisation :
      null;
    //imageURL = null;
    fileObj = null;
    this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;

  }

  static getDerivedStateFromProps(props, state) {
    state.logoImageURL = ''
    state.fileList = []
  }

  componentDidMount() {
    this.props.action.getCurrentOrgDetails();
    this.props.industryManagementAction.getIndustries();
    this.props.industryManagementAction.getServices();
    this.props.industryManagementAction.getCategories();
    this.props.industryManagementAction.getSubCategories();
  }

  onSubmit = async formData => {
    formData = await DeepTrim(formData);

    delete formData.billing_email_address;
    delete formData.logo
    var finalFormData = new FormData();
    Object.keys(formData).forEach(key => {
      finalFormData.append(key, formData[key]);
    })
    // if (this.state.fileList.length > 0) {
    //   finalFormData.append('logo', this.state.fileList[0]);
    // }
    if (fileObj && fileObj.length > 0) {
      finalFormData.append('logo', fileObj[0]);
    } else {
      console.log("No Image added")
    }
    this.props.action.updateOrganization(finalFormData).then((message) => {
      this.handleCancel();
      notification.success({
        message: Strings.success_title,
        description: message,
        onClick: () => { },
        className: 'ant-success'
      });
      this.props.action.getCurrentOrgDetails();
    }).catch((message) => {
      notification.error({
        message: "Error!",
        description: message ? message : "Something went wrong please try again later",
        onClick: () => { },
        className: 'ant-error'
      });
    });

  }

  handleEditClick = () => {
    this.setState({
      displayEdit: 'block',
      billingFlag: 'none',
      addressInfoFlag: 'none',
      industryFlag: 'none'
    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  // profile Modal view
  showProfileModal = (user_name, role_id) => {
    this.props.action.getOrgUserDetails(this.org_user_id, user_name, role_id);
    this.setState({
      profileViewVisible: true,
    });
  };

  handleProfileOk = e => {
    console.log(e);
    this.setState({
      profileViewVisible: false,
    });
  };

  handleProfileCancel = e => {
    console.log(e);
    this.setState({
      profileViewVisible: false,
    });
  };

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  renderMembers = ({ fields, meta: { error, submitFailed } }) => (
    <>
      <div className="sf-c-table org-user-table ve-a-user-t detect">
        {fields.map((member, index) => (
          <div className="tr" key={index}>
            <span className="td">
              <fieldset className="sf-form">
                <Field
                  name={`${member}.name`}
                  placeholder={Strings.name_org}
                  type="text"
                  component={customInput}
                />
              </fieldset>
            </span>
            <span className="td">
              <fieldset className="sf-form">
                <Field
                  name={`${member}.email_address`}
                  placeholder={Strings.email_address_org}
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
                    defaultValue="+61"
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
                    placeholder={Strings.phone_number_org}
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
                  placeholder={Strings.user_role}
                  // type="text"
                  options={this.props.roles ? this.props.roles.map(role => ({
                    title: role.name, value: role.id
                  })) : []} component={CustomSelect} />
              </fieldset>
            </span>
            <span className="td"><button className='delete-bnt' type='button' onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></span>
          </div>
        ))}
      </div>
      <div className="btn-hs-icon sm-bnt bnt-error">
        <button className="bnt bnt-normal" type="button" onClick={() => fields.push({ country_code: "+61", role_id: [] })}>{Strings.add_user_btn}</button>
        {submitFailed && error && <span className="error-input">{error}</span>}
      </div>
    </>
  )

  handleCancel = () => {
    fileObj = null
    this.setState({
      displayEdit: 'none',
      billingFlag: 'none',
      addressInfoFlag: 'none',
      fileList: [],
      logoImageURL: '',
      imageURL: null,
      industryFlag: 'none'
    });
  }

  handleUserManageClick = () => {
    this.props.history.push({ pathname: '/dashboard/userManagement' })
  }

  addBillingDetailsHandler = () => {
    fileObj = null
    this.setState({
      billingFlag: 'showAdd',
      displayEdit: 'none',
      addressInfoFlag: 'none',
      imageURL: null,
      industryFlag: 'none'
    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  EditBillingDetailsHandler = () => {
    fileObj = null
    this.setState({
      billingFlag: 'showEdit',
      displayEdit: 'none',
      addressInfoFlag: 'none',
      imageURL: null,
      industryFlag: 'none'
    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  EditBillingAddressHandler = () => {
    fileObj = null
    this.setState({
      billingFlag: 'none',
      displayEdit: 'none',
      addressInfoFlag: 'block',
      imageURL: null,
      industryFlag: 'none'
    });
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  userMenu = (<Menu>
    <Menu.Item onClick={this.handleUserManageClick}>{Strings.menu_user_mgmt}</Menu.Item>
  </Menu>);

  editBillingMenu = (<Menu>
    <Menu.Item onClick={this.EditBillingAddressHandler}>{Strings.menu_edit_bill}</Menu.Item>
    <Menu.Item onClick={this.EditBillingDetailsHandler}>{Strings.menu_update_payment}</Menu.Item>
  </Menu>);

  addBillingMenu = (<Menu>
    <Menu.Item onClick={this.EditBillingAddressHandler}>{Strings.menu_update_payment}</Menu.Item>
  </Menu>);

  editMenu = (
    <Menu>
      <Menu.Item onClick={this.handleEditClick}>{Strings.menu_edit_org}</Menu.Item>
    </Menu>
  )

  removeFile = () => {
    //imageURL = null
    fileObj = []
    this.setState({ fileList: [], imageURL: null })
  };

  handleOrgUserSubmit = async (formData) => {
    formData = await DeepTrim(formData);
    if (formData.org_users) {
      var finalForm = { org_users: [] };
      formData.org_users.forEach(user => {
        user.phone_number = user.phone_number.replace(/\s/g, '')
        finalForm.org_users.push({ ...user, organisation_id: JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id })
      })

      this.props.orgUserActions.updateUsersFromView(finalForm, this.props.initialValues.id).then((message) => {
        this.props.change('org_users', []);
        notification.success({
          message: Strings.success_title,
          description: message,
          onClick: () => { },
          className: 'ant-success'
        });
      }).catch((message) => {
        notification.error({
          message: "Error!",
          description: message ? message : "Something went wrong please try again later",
          onClick: () => { },
          className: 'ant-error'
        });
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

  onIndustrySubmit = formData => {

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
  displayIndustries = (organization) => (
    <FormSection name="org_services">{
      organization.org_industries
        .map((industry) => <div className="sf-card-inner">
          <div className="view-text-value edit-si-box"><label>{Strings.service_inductry_txt}</label>
            <span>{this.props.industries && this.props.industries.find(ind => ind.id === industry.industry_id) ?
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
                    <label>{this.props.services && this.props.services.find(ser => ser.id === service.service_id) ?
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
                            <span>{this.props.categories && this.props.categories.find(cat => cat.id === category.category_id) ?
                              this.props.categories.find(cat => cat.id === category.category_id).category_name
                              : null}</span></div>
                          <div className="view-text-value">
                            <label>{Strings.sub_category_txt}</label>
                            <span className="sub-cat-value">
                              {category.subcategory && category.subcategory.map((subCategory, index) =>
                                <span>{index !== 0 ? <i>,</i> : null}
                                  {this.props.subCategories && this.props.subCategories.find((sub) => sub.id === subCategory.sub_category_id) ?
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
            <FieldArray name={`services`} formValues={this.props.formValues && this.props.formValues.org_services &&
              this.props.formValues.org_services[`$${industry.industry_id}`]}
              industry_id={industry.industry_id} component={RenderServicesArrayView} change={this.props.change} />
          </FormSection>
        </div>)}
    </FormSection>
  )


  render() {
    const { handleSubmit, users, billingDetails, organization, userProfile } = this.props;
    
    var organizationName = organization && organization.name;
    var orgAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["organization"].permissions;
    var userAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["userManagement"] ? JSON.parse(getStorage(ACCESS_CONTROL))["userManagement"].permissions : undefined;
    var profilePermission = JSON.parse(getStorage(ACCESS_CONTROL))["profile_permission"] ? JSON.parse(getStorage(ACCESS_CONTROL))["profile_permission"].permissions : undefined;

    /**Permissions for the module */
    var permissions = {
      org_update_org: orgAccessControl.findIndex(acess => acess.control_name === 'org_update_org'),
      org_read_billing: orgAccessControl.findIndex(acess => acess.control_name === 'org_read_billing'),
      org_update_billing_details: orgAccessControl.findIndex(acess => acess.control_name === 'org_update_billing_details'),
      org_read_org_details: orgAccessControl.findIndex(acess => acess.control_name === 'org_read_org_details'),
      sf_org_list_users: userAccessControl ? userAccessControl.findIndex(acess => acess.control_name === 'sf_org_list_users') : -1,
      sf_profile_permission: profilePermission ? profilePermission.findIndex(acess => acess.control_name === 'sf_profile_permission_controller_view_profile') : -1,
    }

    const uploadPicProps = {
      beforeUpload: file => {
        this.props.change(`isDirty`, false);
        this.setState({
          fileList: [file],
        });
        return false;
      },
      multiple: false,
      onChange: async (info) => {
        this.props.change(`isDirty`, false)
        fileObj = [info.file]
        await getBase64(info.file, imageUrl =>
          //imageURL = imageUrl,
          this.setState({
            imageURL: imageUrl,
            fileList: [info.file]
          }),
        );
      },
      accept: ".jpeg,.jpg,.png",
      fileList: fileObj,
      onRemove: this.removeFile
    };

    var userFlag = false;
    const deleteFunc = (user) => {
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

    return (
      <div className="col-sm-12">
        <div className="row">
          <div className="col-md-12 col-lg-9">
            <div className="sf-card-wrap">
              {/* zoom button  */}
              <div className="card-expands">
                <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                  <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
              </div>
              <div className={permissions.org_read_org_details !== -1 ? "sf-card sf-mcard" : "d-none"}>
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.org_detail_card}</h2>
                  <div className="info-btn">
                    {/* Drop down for card */}
                    {permissions.org_update_org !== -1 ?
                      <Dropdown className="more-info" overlay={this.editMenu}>
                        <i className="material-icons">more_vert</i>
                      </Dropdown> :
                      <Dropdown className="more-info disable-drop-menu" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>}
                    {/*Drop down*/}
                  </div>
                </div>
                {/**Organization Details */}
                <div className="sf-card-body mt-2">
                  <div className="row">

                    <div className="col org-logo-col">
                      <div className="view-logo">
                        {
                          organization
                            ? organization.logo
                              ? <img src={organization.logo} />
                              : organizationName && <b>{abbrivationStr(organizationName)}</b>
                            : null
                        }
                      </div>
                    </div>

                    <div className="col">
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

              <div className={"sf-card sf-mcard v-sr-agent mt-4"}>
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.service_inductries_txt}</h2>
                  {/* {this.permissions.sf_update_service_industry !== -1 ?
                    <div className="info-btn">
                    </div> : null} */}
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled>
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
              <div className={permissions.org_read_billing !== -1 ? "sf-card mt-4" : "sf-card mt-4 d-none"}>
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.bill_card}</h2>
                  <div className="info-btn">
                    {permissions.org_update_billing_details !== -1 ?
                      <Dropdown className="more-info"
                        overlay={billingDetails.card_details == null ? this.addBillingMenu : this.editBillingMenu}>
                        <i className="material-icons">more_vert</i>
                      </Dropdown> :
                      <Dropdown className="more-info disable-drop-menu" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    }
                  </div>
                </div>

                <div className="sf-card-body mt-2">
                  <div className="data-v-row">
                    <div class="data-v-col">
                      <div className="view-text-value">
                        <label>Address</label>
                        <span>{billingDetails.billing_address}</span>
                      </div>
                    </div>
                    <div class="data-v-col">
                      <div className="view-text-value">
                        <label>Email</label>
                        <span>{billingDetails.billing_email_address}</span>
                      </div>
                    </div>
                    <div class="data-v-col">
                      <div className="view-text-value">
                        <label>Next Payment Due</label>
                        <span>{moment(billingDetails.payment_due_date).format('DD MMM YYYY')}</span>
                      </div>
                    </div>
                  </div>
                  {billingDetails.card_details != null ?
                    <div className="data-v-row">
                      <div class="data-v-col">
                        <div className="view-text-value">
                          <label>Payment Method</label>
                          <span>{billingDetails.card_details.Number}</span>
                        </div>
                      </div>
                      <div class="data-v-col">
                        <div className="view-text-value">
                          <label>Card Expiry</label>
                          <span>{billingDetails.card_details.ExpiryMonth && billingDetails.card_details.ExpiryYear ? billingDetails.card_details.ExpiryMonth + "/" + billingDetails.card_details.ExpiryYear : null}</span>
                        </div>
                      </div>
                    </div> :
                    permissions.org_update_billing_details !== -1 ?
                      <div className="btn-hs-icon">
                        <button className="bnt bnt-active sf-big-bnt" onClick={this.addBillingDetailsHandler}>
                          <i class="material-icons">credit_card</i>{Strings.add_pay_meth_title}
                        </button>
                      </div> : null}
                </div>
              </div>

              {/**User List */}
              <div className={permissions.sf_org_list_users !== -1 ? "sf-card sf-mcard my-4" : "d-none"}>
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.org_user_card}</h2>
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
                              <span className="td">{user.name + " " + (user.last_name ? user.last_name : "")}</span>
                              <span className="td">{user.email_address}</span>
                              <span className="td">{`${user.country_code} ${user.phone_number}`}</span>
                              <span className="td">{user.role.name}</span>
                              <span className="td">
                                <div id="confirmPopPo">
                                  {permissions.sf_profile_permission !== -1
                                    ?
                                    <button className='delete-bnt profle-view-bnt' onClick={() => this.showProfileModal(user.user_name, user.role && user.role.id)} type='button'>
                                      <i class="material-icons">visibility</i>
                                    </button>
                                    :
                                    ''
                                  }
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

                      <form className="po-relative" onSubmit={handleSubmit(this.handleOrgUserSubmit)}>
                        <FieldArray name="org_users" component={this.renderMembers} />
                        {
                          this.props.formValues && this.props.formValues.org_users && this.props.formValues.org_users.length > 0
                            ? <div className="s-n-bnt btn-hs-icon sm-bnt ml-4">
                              <button type="submit" className="bnt bnt-active usr-sb-btn">
                                <i class="material-icons">save</i>{Strings.save_btn}</button>
                            </div>
                            : null
                        }
                      </form>
                    </div>
                  </PerfectScrollbar>
                </div>
              </div>
            </div>
          </div>

          {/* Edit */}
          <div className="col-md-12 col-lg-3">
            <div className="sf-card mb-4" style={{ display: this.state.displayEdit }}>
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">{Strings.edit_org_card}</h4>
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
                        {this.state.imageURL != null ? <img src={this.state.imageURL} /> : organization && organizationName ? organization.logo ? <img src={organization.logo} /> : <b>{abbrivationStr(organizationName)}</b> : null}
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
                      <button type="button" onClick={this.handleCancel} className="bnt bnt-normal" disabled={!this.props.isDirty}>
                        {Strings.cancel_btn}</button>
                      <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                        {Strings.update_btn}</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>

            {/* Edit industry */}

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

            {/* update payment option */}
            <AddEditBillingDetails
              billingFlag={this.state.billingFlag}
              handleCancel={this.handleCancel}
              organization={organization}
              card_details={billingDetails.card_details}
            />

            {/* Connected Organisations added */}

            {organization.organisation_type == 2 ? <div className="sf-card con-ord-mh mb-4" >
              <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                <h4 className="sf-sm-hd sf-pg-heading">{Strings.connected_org_txt}</h4>
              </div>
              <div className="sf-card-body">
                <div className="con-org-list">
                  {this.props.connectedOrg && this.props.connectedOrg.map(org => <div>
                    <span>{org.name}</span><br /></div>)}

                </div>
              </div>
            </div> : null}

            {/**Subscription Details */}
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
                  {organization && organization.subscription ? organization.subscription.active ? < span className="sub-pill active">Active</span> : <span className="sub-pill inactive">Inactive</span> : null}
                  <label>{Strings.sub_type}</label>
                  <span>{organization && organization.subscription && organization.subscription.name ? organization.subscription.name : ''}</span>

                  {organization && organization.subscription && organization.subscription.amount ? <div className="sub-amt-period">
                    <span>{organization && organization.subscription && currencyFormat(organization.subscription.amount)}</span>
                    <span>{organization && organization.subscription && organization.subscription.period ?
                      organization.subscription.period == 1 ? "Month" :
                        organization.subscription.period == 3 ? "Quarter" :
                          organization.subscription.period == 12 ? "Year" : null : null}</span>
                  </div> : null}
                </div>
                <div className="view-text-value mb-3">
                  <label>{Strings.sub_invoice_date}</label>
                  <span>{organization && organization.invoice_start_date
                    ? organization.invoice_start_date.split('T')[0] : ''}</span>
                </div>
                {organization && organization.sub_discount ? <div className="view-text-value mb-3">
                  <label>{Strings.sub_percentage}</label>
                  <span>{organization ? organization.sub_discount : ''}</span>
                </div> : null}
                {organization && organization.sub_period ? <div className="view-text-value mb-3">
                  <label>{Strings.sub_discount_period}</label>
                  <span>{organization && organization.subscription.period ? organization.subscription.perio : ''}</span>
                </div> : null}
                <div className="view-text-value mb-3">
                  <label>{Strings.sub_discount_amt}</label>
                  <span>{organization && organization.subscription && currencyFormat(organization.subscription.amount)}</span>
                </div>
                <div className="view-text-value mb-2">
                  <label>{Strings.sub_date}</label>
                  <span>{organization ? organization.subscription_start_date : ''}</span>
                </div>
              </div>
            </div>
          </div>

          {/* profile Modal content here */}
          <Modal
            title="Profile View"
            visible={this.state.profileViewVisible}
            okButtonProps={{ style: { display: 'none' } }}
            onCancel={this.handleProfileCancel}
            width="100%"
            className="profile-view-wrap"
          >
            <ViewUserProfile userProfile={userProfile} />
          </Modal>
        </div>
      </div>
    );
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    subscriptionAction: bindActionCreators(subscriptionAction, dispatch),
    rolesActions: bindActionCreators(rolesActions, dispatch),
    orgUserActions: bindActionCreators(orgUserActions, dispatch),
    industryManagementAction: bindActionCreators(industryManagementAction, dispatch),
  }
}

const mapStateToProps = (state) => {
  return {
    organization: state.organization.organizationDetails,
    initialValues: { ...state.organization.organizationDetails, org_industries: [] },
    users: state.organizationUsers ? state.organizationUsers.users : [],
    roles: state.roleManagement ? state.roleManagement.roles : [],
    billingDetails: state.organizationBilling ? state.organizationBilling.billingDetails : {},
    isDirty: isDirty('viewEditOrganization')(state),
    syncErrors: state.form && state.form.viewEditOrganization ? state.form.viewEditOrganization : {},
    formValues: state.form && state.form.viewEditOrganization && state.form.viewEditOrganization.values,
    subscriptions: state.subscription && state.subscription.subscriptions ? state.subscription.subscriptions : {},
    connectedOrg: state.organization.connectedOrg,
    industries: state.industryManagement.industries,
    services: state.industryManagement.services,
    categories: state.industryManagement.categories,
    subCategories: state.industryManagement.subCategories,
    userProfile: state.organization && state.organization.userProfile,
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'viewEditOrganization', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ViewEditOrganization)
