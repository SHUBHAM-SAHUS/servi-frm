import React from 'react';
import { Icon, Upload, Dropdown, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import {
  isRequired,
  isValidABN,
  abnRequired,
  clientNameRequired,
  clientAddressRequired,
  isEmail,
  primaryPersonContactNumberIsPhoneNumber,
  businessPhoneNoRequired,
  invoicingEmailAddressRequired
} from '../../../utils/Validations/scopeDocValidation';
import { customInput } from '../../common/custom-input';
import * as actions from '../../../actions/clientManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { customTextarea } from '../../common/customTextarea';
import { getStorage, handleFocus } from '../../../utils/common';
import EditPrimaryPerson from './EditPrimaryPerson'
import AddPrimaryPerson from './AddPrimaryPerson';
import $ from 'jquery';
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DeepTrim } from '../../../utils/common';

const Dragger = Upload.Dragger;

export class AddNewClient extends React.Component {

  persons = [];

  constructor(props) {
    super(props);
    this.state = {
      displayEdit: 'block',
      selectedClient: null,
      editing: true,
      canEdit: true,
      canReset: true,
      cardExpnadBtn: true,
      showAddPrimaryPerson: 'none',
      editingPerson: false,
      editPrimaryPerson: 'none',
      fileList: [],
      imageArray: []
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);
    formData['client_person'] = this.persons;
    formData['org_id'] = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;

    var finalFormData = new FormData();
    Object.keys(formData).forEach(key => {
      if (key === 'client_person' && key !== 'wizPerson') {
        finalFormData.append(key, JSON.stringify(formData[key]));
      } else {
        finalFormData.append(key, formData[key]);
      }
    })

    if (this.state.fileList.length > 0) {
      finalFormData.append('logo', this.state.imageArray[0]);
    }

    this.props.clientActions.addClient(finalFormData)
      .then(async (message) => {
        var currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        await this.props.clientActions.getClientPersonRoles();
        this.props.clientActions.getClientsList(currentOrganization);
        this.persons = [];

        this.props.change('wizPerson', this.persons)
        this.props.reset();
        this.removeFile();
        this.handleCancel();
        if (message) {
          notification.success({
            message: Strings.success_title,
            description: message ? message : Strings.client_create_success,
            onClick: () => { },
            className: 'ant-success'
          });
        }
      })
      .catch(error => {
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
      })
  }

  // expand center card----------
  handleExpand = () => {
    this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
    $(".main-container").toggleClass("po-relative");
    $(".sf-card-wrap").toggleClass("fullscreen");
    $(".zoom-save-bnt").toggleClass("show-bnt");
  }

  handleCancel = () => {
    this.setState({
      showAddPrimaryPerson: 'none',
      editPrimaryPerson: 'none',
      editingPerson: false
    })
  }

  handleAddPersonClick = () => {
    this.setState({
      showAddPrimaryPerson: 'block',
      editPrimaryPerson: 'none',
      editingPerson: true
    })
  }

  handlePersonSubmit = (data) => {
    this.setState({
      showAddPrimaryPerson: 'none',
      editingPerson: false
    })
    this.persons.push(data)
    this.props.change('wizPerson', this.persons)
  }

  handlePersonEditClick = (person, id) => {
    person = { ...person, 'id': id }
    this.setState({
      editPrimaryPerson: 'block',
      editingPerson: true,
      Person: person,
    })
  }

  handleContactPersonEdit = formData => {

    this.setState({
      editPrimaryPerson: 'none',
      editingPerson: false
    })
    this.persons.map((person, index) => {
      if (index == formData.id) {
        this.persons[index] = formData
      }
      delete this.persons[index].id
    })

    this.props.change('wizPerson', this.persons)
  }

  deleteContactPerson = (id) => {
    this.setState({
      editingPerson: false
    })
    this.persons.splice(id, 1)

    this.props.change('wizPerson', this.persons)
  }

  removeFile = () => this.setState({ fileList: [], imageArray: [] });

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
      onRemove: this.removeFile,
      status: "done"
    };

    const clientSection = (
      <div className="sf-card mb-4">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h2 className="sf-pg-h minfo-disableeading">{Strings.client_details}</h2>
          <div className="info-btn disable-dot-menu">
            <Dropdown className="more-info" disabled>
              <i className="material-icons">more_vert</i>
            </Dropdown>
          </div>
        </div>
        <div className="sf-card-body mt-2">
          <div className="row">
            <div className="col-md-6 col-sm-6 col-lg-3 mb-3">
              <div className="logo-upload">
                <Dragger  {...uploadPicProps}>
                  <p className="ant-upload-drag-icon">
                    <i class="material-icons">cloud_upload</i>
                  </p>
                  <p className="ant-upload-text">{Strings.img_upload_text}</p>
                </Dragger>
              </div>
            </div>
            <div className="col-md-12 col-lg-9">
              <div className="row">
                <div className="col-md-12 col-lg-6">
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.client_name}
                      name="name"
                      placeholder={Strings.name_clnt}
                      type="text"
                      validate={clientNameRequired}
                      component={customInput} />
                  </fieldset>
                </div>
                <div className="col-md-12 col-lg-6">
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.abn_txt}
                      name="abn_acn"
                      placeholder={Strings.abn_acn_clnt}
                      type="text"
                      validate={[abnRequired, isValidABN]}
                      component={customInput} />
                  </fieldset>
                </div>
                <div className="col-md-12 col-lg-6">
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.address_txt}
                      name="address"
                      placeholder={Strings.address_clnt}
                      type="text"
                      validate={clientAddressRequired}
                      component={customTextarea} />
                  </fieldset>
                </div>
                <div className="col-md-12 col-lg-6">
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.business_telephone}
                      name="business_number"
                      placeholder={Strings.business_telephone}
                      type="text"
                      validate={[businessPhoneNoRequired, primaryPersonContactNumberIsPhoneNumber]}
                      component={customInput} />
                  </fieldset>
                </div>
                <div className="col-md-12 col-lg-6">
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.website_client}
                      name="website"
                      placeholder={Strings.website_client}
                      type="text"
                      component={customInput} />
                  </fieldset>
                </div>
                <div className="col-md-12 col-lg-6">
                  <fieldset className="form-group sf-form">
                    <Field
                      label={Strings.invoicing_email_client}
                      name="email_address"
                      placeholder={Strings.email_clnt}
                      type="text"
                      validate={[invoicingEmailAddressRequired, isEmail]}
                      component={customInput} />
                  </fieldset>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )

    const rightPanel = (
      <div className="col-lg-4 col-md-12" style={{ display: this.state.showAddPrimaryPerson }}>
        <AddPrimaryPerson
          isFromAddClient={true}
          onPersonSubmit={(formValues) => this.handlePersonSubmit(formValues)}
          handleCancel={this.handleCancel}
          showAddPrimaryPerson={this.state.showAddPrimaryPerson}
        />
      </div>
    )

    return (
      <div className={this.props.toggleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
        <div className="row">
          <div className="col-md-12 col-lg-8 mb-4">
            <form onSubmit={handleSubmit(this.onSubmit)}>
              <div className="sf-card-wrap">
                {/* zoom button  */}
                <div className="card-expands">
                  <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                    <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                </div>
                {clientSection}
                <div className="sf-card mt-4">
                  <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h2 className="sf-pg-heading">{Strings.org_pri_person}s</h2>
                    <div className="info-btn disable-dot-menu">
                      <Dropdown className="more-info" disabled>
                        <i className="material-icons">more_vert</i>
                      </Dropdown>
                    </div>
                  </div>
                  <div className="sf-card-body">
                    <PerfectScrollbar className="sf-ps-scroll" onScrollX>
                      <div className={this.persons.length > 0 ? "sf-ps-scroll-content" : "sf-ps-scroll-content non-scroll"}>
                        {
                          this.persons.length > 0
                            ? <table className={"add-user-table table"}>
                              <tr>
                                <th>{Strings.user_table_name}</th>
                                <th>{Strings.user_table_email}</th>
                                <th>{Strings.user_table_phone.split(' ')[0]}</th>
                                <th>Role</th>
                                <th>{Strings.user_table_sites}</th>
                                <th>{Strings.user_table_active}</th>
                                <th></th>
                              </tr>
                              {this.persons.map((person, index) =>
                                <tr>
                                  <td>{person && person.name && person.name}</td>
                                  <td>{person && person.email && person.email}</td>
                                  <td>{person && person.phone && person.phone}</td>
                                  <td>{person && person.role_name && person.role_name} </td>
                                  <td>{person.site_name}</td>
                                  <td>{person.active ? 'Active' : 'Inactive'}</td>
                                  <td>
                                    <div className="d-flex">
                                      <button type="button" className='delete-bnt' onClick={() => this.handlePersonEditClick(person, index)}><i class="material-icons">create</i></button>
                                      <button type="button" className='delete-bnt' onClick={() => this.deleteContactPerson(index)}><i class="fa fa-trash-o"></i></button>
                                    </div>
                                  </td>
                                </tr>
                              )}
                            </table>
                            : null
                        }
                        <div className="btn-hs-icon sm-bnt">
                          <button className="bnt bnt-normal" type="button" disabled={this.state.editingPerson} onClick={this.handleAddPersonClick}>{Strings.add_contact_btn}</button>
                        </div>
                      </div>
                    </PerfectScrollbar>
                  </div>
                  {/* zoom save button  */}
                  <div className="row zoom-save-bnt">
                    <div className="col-md-12">
                      <div className="all-btn d-flex justify-content-end mt-4">
                        <div className="btn-hs-icon">
                          <button type="submit" className="bnt bnt-active">
                            <i class="material-icons">save</i> {Strings.save_btn}</button>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              <div className="all-btn d-flex justify-content-end mt-4">
                <div className="btn-hs-icon">
                  <button type="submit" className="bnt bnt-active">
                    <i class="material-icons">save</i> {Strings.save_btn}</button>
                </div>
              </div>

            </form>
          </div>
          {rightPanel}
          <div className="col-lg-4 col-md-12" style={{ display: this.state.editPrimaryPerson }}>
            <EditPrimaryPerson
              initialValues={this.state.Person}
              onPersonUpdate={(values) => this.handleContactPersonEdit(values)}
              handleCancel={this.handleCancel}
              isFromClient={true}
              editPrimaryPerson={this.state.editPrimaryPerson}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    primaryPersonForm: state.form && state.form.addNewClient && state.form.addNewClient.values,
    roles: state.clientManagement.roles,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clientActions: bindActionCreators(actions, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
  reduxForm({
    form: 'addNewClient',
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(AddNewClient)
