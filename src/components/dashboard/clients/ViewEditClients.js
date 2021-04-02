import React from 'react';
import { reduxForm, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, Menu, Dropdown, Popconfirm, notification } from 'antd';
import { getStorage, handleFocus } from '../../../utils/common';
import * as actions from '../../../actions/clientManagementActions';
import * as rolePermissionAction from '../../../actions/permissionManagementAction';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { validate } from '../../../utils/Validations/scopeDocValidation';

import EditClient from './EditClient'
import * as swmsAction from '../../../actions/scopeDocActions'
import $ from 'jquery';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DeepTrim, abbrivationStr } from '../../../utils/common';
import EditClientPersonDetails from './EditClientPersonDetails';
import EditClientSite from './EditClientSite';
import AddClientNewPerson from './AddClientNewPerson';
import AddClientSite from './AddClientSite';
class ViewEditClient extends React.Component {
  addPerson = [];
  constructor(props) {
    super(props);
    this.state = {
      showClientDetailsEdit: 'none',
      showSiteEdit: 'none',
      cardExpnadBtn: true,
      editPrimaryPerson: 'none',
      addPrimaryPerson: 'none',
      disabledAddBtn: false,
      editClientSite: 'none',
      SiteDetails: {},
      addClientSite: 'none',
      disableAddSiteBtn: false
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.location.state && nextProps.location.state !== this.props.location.state) {
      this.setState({
        showClientDetailsEdit: 'none',
        showSiteEdit: 'none',
        editPrimaryPerson: 'none',
        addPrimaryPerson: 'none',
        disabledAddBtn: false,
        editClientSite: 'none',
        addClientSite: 'none',
        disableAddSiteBtn: false
      })
    }
  }

  currentSitesList = []
  handleEditClientDetailsClick = () => {
    this.setState({
      showClientDetailsEdit: 'block',
      showSiteEdit: 'none',
      editPrimaryPerson: 'none',
      addPrimaryPerson: 'none',
      editClientSite: 'none',
      addClientSite: 'none'
    })
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleClientubmit = (formData) => {
    var finalFormData = [];
    this.props.selectedClient && this.props.selectedClient.client_person.forEach(person => {
      person.sites.forEach(site => {
        this.currentSitesList.push(site.site)
      })
    })
    formData.client_.forEach((person, index) => {
      var appendedSiteData = this.currentSitesList.find(site => {
        return site.id == person.site
      })
      person = { ...person, ...appendedSiteData }
      person.active = person.active || false;
      person.site_id = person.id
      delete person.id;
      finalFormData.push(person)
    })
    this.currentSitesList = []
    var fData = {};
    fData.client_person = [...finalFormData]
    fData.client_id = this.props.selectedClient.id
    this.props.clientActions.editClientPerson(fData)
      .then(async () => {
        this.props.reset();
        await this.props.clientActions.getClientPersonRoles()
        this.props.clientActions.getClientDetails(fData.client_id)
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
    this.setState({
      showClientDetailsEdit: 'none',
      showSiteEdit: 'none',
      editPrimaryPerson: 'none',
      addPrimaryPerson: 'none',
      disabledAddBtn: false,
      editClientSite: 'none',
      addClientSite: 'none',
      disableAddSiteBtn: false
    })
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  handlePersonEditClick = (person) => {
    let sitesIdArray = [];
    if (person && person.sites && person.sites.length > 0) {
      person.sites.map(site => {
        if (site && site.site && site.site.id) {
          sitesIdArray.push(site.site.id);
        }
        return site;
      })
    }
    let personObj = {
      id: person.id,
      name: person.name,
      client_id: person.client_id,
      phone: person.phone,
      email: person.email,
      active: person.active,
      sites: sitesIdArray,
      role_id: person.role_id,
      role_name: person.role_id ? this.props.roles.find(role => role.id === person.role_id).role_name : '',
    }


    this.setState({
      editPrimaryPerson: 'block',
      showClientDetailsEdit: 'none',
      showSiteEdit: 'none',
      addPrimaryPerson: 'none',
      Person: personObj,
      editClientSite: 'none',
      addClientSite: 'none'
    })
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleAddPersonDetailsClick = () => {
    this.setState({
      addPrimaryPerson: 'block',
      showClientDetailsEdit: 'none',
      showSiteEdit: 'none',
      editPrimaryPerson: 'none',
      disabledAddBtn: true,
      editClientSite: 'none',
      addClientSite: 'none'
    })
    if (!this.state.cardExpnadBtn) {
      this.handleExpand()
    }
  }

  handleAddPesonSubmit = async (formData) => {
    formData = await DeepTrim(formData);

    this.setState({
      addPrimaryPerson: 'none',
      showClientDetailsEdit: 'none',
      showSiteEdit: 'none',
      editPrimaryPerson: 'none',
      editClientSite: 'none',
      addClientSite: 'none'
    })
  }

  deletePersonClick = (id, person) => {
    this.props.clientActions.deleteContactPerson({
      id: id,
      active: 0
    })
      .then((message) => {
        this.props.reset();
        this.props.clientActions.getClientDetails(person.client_id);
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: message ? message : Strings.person_delete_success,
            onClick: () => { },
            className: 'ant-success'
          });
        }
      })
      .catch((message) => {
        notification.error({
          message: "Error!",
          description: message ? message : "Could not fetch jobs.",
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  deleteClientSiteClick = (id, site) => {
    this.props.clientActions.deleteClientSite({
      id: id
    })
      .then((message) => {
        this.props.reset();
        this.props.clientActions.getClientDetails(site.client_id);
        this.props.clientActions.getSitesList(site.client_id);
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: Strings.client_site_delete_success,
            onClick: () => { },
            className: 'ant-success'
          });
        }
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

  handleSiteEditClick = (site) => {
    this.setState({
      addPrimaryPerson: 'none',
      showClientDetailsEdit: 'none',
      showSiteEdit: 'none',
      editPrimaryPerson: 'none',
      // disableAddSiteBtn: true,
      editClientSite: 'block',
      SiteDetails: site,
      addClientSite: 'none'
    })
  }
  handleAddSiteDetailsClick = () => {
    this.setState({
      addClientSite: 'block',
      addPrimaryPerson: 'none',
      showClientDetailsEdit: 'none',
      showSiteEdit: 'none',
      editPrimaryPerson: 'none',
      editClientSite: 'none',
      disableAddSiteBtn: true
    })
  }
  render() {
    if (this.currentSitesList === 0) {
      this.props.reset()
    }
    const { selectedClient, sites } = this.props;
    var menu = (<Menu>
      <Menu.Item onClick={this.handleEditClientDetailsClick}>
        {'Update Details'}
      </Menu.Item>
    </Menu>);

    //edit primary contact person panel   EditClientSite
    const rightPanel = (
      <>
        <div className="col-lg-4 col-md-12" style={{ display: this.state.editPrimaryPerson }}>
          {console.log("PERSON>>>>> ", this.state.Person)
          }
          <EditClientPersonDetails
            initialValues={this.state.Person}
            handleCancel={this.handleCancel}
          />
        </div>
        <div className="col-lg-4 col-md-12" style={{ display: this.state.editClientSite }}>
          <EditClientSite
            initialValues={this.state.SiteDetails}
            siteName={this.state.SiteDetails && this.state.SiteDetails.site_name ? this.state.SiteDetails.site_name : null}
            handleCancel={this.handleCancel}
          />
        </div>
      </>
    )

    return (
      <div className={this.props.toggleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <div className="row">
          <div className="col-lg-8 col-md-12 mb-4">
            {/* <form onSubmit={handleSubmit(this.onSubmit)} > */}
            <div className="sf-card-wrap">
              {/* zoom button  */}
              <div className="card-expands">
                <button onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                  <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
              </div>
              <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.client_details}</h2>
                  <div className="info-btn">
                    {/* Drop down for card */}
                    <Dropdown className="more-info" overlay={menu}>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                    {/*Drop down*/}
                  </div>
                </div>

                <div className="sf-card-body">
                  <div className="row">
                    <div className="col-md-2">
                      <div className="view-logo">
                        {
                          selectedClient.client_logo
                            ? <img src={selectedClient.client_logo} />
                            : selectedClient.name && <b>{abbrivationStr(selectedClient.name)}</b>
                        }
                      </div>
                    </div>
                    <div className="col-md-9 col-sm-9">
                      <div className="data-v-row">
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.name_txt}</label>
                            <span>{selectedClient.name}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.address_txt}</label>
                            <span>{selectedClient.address}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.abn_txt.split(' ')[0]}</label>
                            <span>{selectedClient.abn_acn}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.business_telephone}</label>
                            <span>{selectedClient.business_number}</span>
                          </div>
                        </div>
                      </div>
                      <div className="data-v-row">
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.website_client}</label>
                            <span>{selectedClient.website}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.invoicing_email_client}</label>
                            <span>{selectedClient.email_address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="sf-card sf-mcard my-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.org_pri_person}s</h2>
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled overlay={''}>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>
                <div className="sf-card-body">
                  <PerfectScrollbar className="sf-ps-scroll">
                    <div className="sf-ps-scroll-content">
                      <div className="sf-c-table org-user-table">
                        <div className="tr">
                          <span className="th">{Strings.user_table_name}</span>
                          <span className="th">{Strings.user_table_email}</span>
                          <span className="th">{Strings.client_contact_phone_number}</span>
                          <span className="th">Role</span>
                          <span className="th">{Strings.user_table_sites}</span>
                          <span className="th">{Strings.user_table_active}</span>
                          <span className="th"></span>
                        </div>
                        {
                          selectedClient && selectedClient.client_person && selectedClient.client_person.length && selectedClient.client_person.length > 0
                            ? selectedClient.client_person.map((person) => {
                              return (
                                <div className="tr" >
                                  <span className="td">{person.name}</span>
                                  <span className="td">{person.email}</span>
                                  <span className="td">{person.phone}</span>
                                  <span className="td">{person.role_id && this.props.roles.find(role => role.id === person.role_id).role_name}</span>
                                  {person && person.sites && person.sites.length > 0 ? <span className="td">{person.sites.map((site, i) => <p key={i}>{site && site.site && site.site.site_name}</p>)}</span> : <span className="td"></span>}
                                  <span className="td text-center">
                                    <span className="single-icon">{person.active === 1 ? <i class="material-icons">check</i> : <i class="material-icons">close</i>}</span>
                                  </span>
                                  <span className="td">
                                    <div className="d-flex">
                                      <button className='delete-bnt' type='button' onClick={() => this.handlePersonEditClick(person)}>
                                        <i class="material-icons">create</i>
                                      </button>

                                      <Popconfirm
                                        title={Strings.user_list_confirm_delete_alert}
                                        // icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                        onConfirm={() => this.deletePersonClick(person.id, person)}
                                        placement="topRight"
                                        okText="Yes"
                                        cancelText="No"
                                        className="delete-bnt"
                                      >
                                        <button className='delete-bnt' userId={person.id}>
                                          <i class="fa fa-trash-o"></i>
                                        </button>
                                      </Popconfirm>
                                    </div>
                                  </span>
                                </div>
                              )
                            })
                            : null
                        }
                      </div>
                      <div className="btn-hs-icon sm-bnt">
                        <button className="bnt bnt-normal" disabled={this.state.disabledAddBtn} type="button" onClick={this.handleAddPersonDetailsClick}>{Strings.add_contact_btn}</button>
                      </div>
                    </div>
                  </PerfectScrollbar>
                </div>
              </div>

              <div className="sf-card sf-mcard my-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">Sites</h2>
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled overlay={''}>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>
                <div className="sf-card-body">
                  <PerfectScrollbar className="sf-ps-scroll">
                    <div className="sf-ps-scroll-content">
                      <div className="sf-c-table org-user-table">
                        <div className="tr">
                          <span className="th">Site Name</span>
                          <span className="th">Street Address</span>
                          <span className="th">City</span>
                          <span className="th">State</span>
                          <span className="th">Active</span>
                          <span className="th"></span>
                        </div>
                        {
                          sites && sites.length > 0
                            ? sites.map((site) => {
                              return (
                                <div className="tr" >
                                  <span className="td">{site.site_name}</span>
                                  <span className="td">{site.street_address}</span>
                                  <span className="td">{site.city}</span>
                                  <span className="td">{site.state}</span>
                                  <span className="td text-center">
                                    <span className="single-icon">{site.active === 1 ? <i class="material-icons">check</i> : <i class="material-icons">close</i>}</span>
                                  </span>
                                  <span className="td">
                                    <div className="d-flex">
                                      <button className='delete-bnt' type='button' onClick={() => this.handleSiteEditClick(site)}>
                                        <i class="material-icons">create</i>
                                      </button>

                                      <Popconfirm
                                        title={Strings.confirm_site_delete_alert}
                                        onConfirm={() => this.deleteClientSiteClick(site.id, site)}
                                        placement="topRight"
                                        okText="Yes"
                                        cancelText="No"
                                        className="delete-bnt"
                                      >
                                        <button className='delete-bnt'>
                                          <i class="fa fa-trash-o"></i>
                                        </button>
                                      </Popconfirm>
                                    </div>
                                  </span>
                                </div>
                              )
                            })
                            : null
                        }
                      </div>
                      <div className="btn-hs-icon sm-bnt">
                        <button className="bnt bnt-normal" disabled={this.state.disableAddSiteBtn} type="button" onClick={this.handleAddSiteDetailsClick}>Add Site</button>
                      </div>
                    </div>
                  </PerfectScrollbar>
                </div>
              </div>

            </div>
          </div>

          <div className="col-lg-4 col-md-12" style={{ display: this.state.showClientDetailsEdit }}>
            <EditClient
              initialValues={selectedClient}
              handleCancel={this.handleCancel}
              showClientDetailsEdit={this.state.showClientDetailsEdit}
              isFromClientView={true}
            />
          </div>

          <div className="col-lg-4 col-md-12" style={{ display: this.state.addPrimaryPerson }}>
            <AddClientNewPerson
              handleCancel={this.handleCancel}
            />
          </div>

          <div className="col-lg-4 col-md-12" style={{ display: this.state.addClientSite }}>
            <AddClientSite
              selectedClient={selectedClient}
              handleCancel={this.handleCancel}
            />
          </div>

          {rightPanel}
        </div>
      </div>

    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var value = state.clientManagement && state.clientManagement.clientDetails ? state.clientManagement.clientDetails[0] : null;

  return {
    selectedClient: (value ? value : {}),
    clients: state.clientManagement && state.clientManagement.clients,
    sites: state.clientManagement && state.clientManagement.sitesList,
    isDirty: isDirty('ViewEditClient')(state),
    roles: state.clientManagement.roles,
  }

}
const mapDispatchToprops = dispatch => {
  return {
    clientActions: bindActionCreators(actions, dispatch),
    rolePermissionAction: bindActionCreators(rolePermissionAction, dispatch),
    swmsAction: bindActionCreators(swmsAction, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'ViewEditClient', validate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ViewEditClient)
