import React from 'react';
import { Modal, Popover, Collapse, Button, Icon, Dropdown, Progress, notification } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FormSection, FieldArray, isDirty } from 'redux-form';
import { withRouter } from 'react-router-dom';
import *as actions from '../../../actions/scopeDocActions';
import * as jobDocAction from '../../../actions/jobDocAction';
import * as profileManagementActions from '../../../actions/profileManagementActions';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { CustomCheckbox } from '../../common/customCheckbox';
import { getStorage, handleFocus } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { customTextarea } from '../../common/customTextarea';
import { customInput } from '../../common/custom-input';
import { CustomDatepicker } from '../../common/customDatepicker';
import AddFilteredStaff from './addFilteredStaff';
import PreviewJobDoc from './PreviewJobDoc';
import HistoryJobDoc from './HistoryJobDoc';
import { CustomTimePicker } from '../../common/customTimePicker';
import { DeepTrim, abbrivationStr } from '../../../utils/common';

import * as organisationAction from '../../../actions/organizationAction';

import { ERROR_NOTIFICATION_KEY } from '../../../config';

const mapRouteToTitle = {
  '/dashboard': Strings.update_job_docs_txt
}
const { Panel } = Collapse;

class ViewJobDoc extends React.Component {
  constructor(props) {
    super(props);
    this.state = { visibleImage: false, imageUrl: null, serviceAgentArray: [], certificateList: [], allStaffList: [], licienceDetails: {}, visibleLicienceDetails: false, visible: false, filteredStaff: true, serviceDetails: false, staffLicenceDetails: false, certificateDetails: false, scheduleDetails: false, formCompletion: 0, updateCertificate: false, updateStaff: false, updateSchedule: false, previewCertificates: [], previewStaffList: [] }
    if (this.props.selectedScopeDoc && this.props.selectedScopeDoc.job_doc_number) {
      this.job_doc_number = this.props.selectedScopeDoc.job_doc_number;
    }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) && JSON.parse(getStorage(ADMIN_DETAILS)).organisation ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;

    this.currentOrganizationName = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
      (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : null;

    this.currentOrganizationLogo = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.logo : null;
    this.currentOrganizationDetails = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation : null;
  }

  componentDidMount() {
    this.props.organisationAction.getCurrentOrgDetails();
    let job_doc_number_new;
    if (this.props.location && this.props.location.state && this.props.location.state.job_doc_number) {
      job_doc_number_new = this.props.location.state.job_doc_number;
      this.setState({ job_doc_number: job_doc_number_new })
    } else if (this.props.selectedScopeDoc && this.props.selectedScopeDoc.job_doc_number) {
      job_doc_number_new = this.props.selectedScopeDoc.job_doc_number;
      this.setState({ job_doc_number: job_doc_number_new })
    }
    if (job_doc_number_new) {
      this.props.action.getJobDocsDetails(job_doc_number_new)  // JQSK1001909100001189 //this.props.selectedScopeDoc.job_doc_number
        .then(data => {
          if (this.props.jobDocsDetails && this.props.jobDocsDetails.quote && this.props.jobDocsDetails.quote && this.props.jobDocsDetails.quote.scope_doc && this.props.jobDocsDetails.quote.scope_doc.scope_docs_sites && this.props.jobDocsDetails.quote.scope_doc.scope_docs_sites.length > 0) {
            this.props.jobDocsDetails.quote.scope_doc.scope_docs_sites.map(site => {
              if (site && site.site && site.site.tasks && site.site.tasks.length > 0) {
                site.site.tasks.map(task => {
                  if (task && task.parent_id === null && task.service_agent && task.service_agent.id) {
                    var serviceAgentObject = {
                      service_agent_id: task.service_agent.id,
                      task_id: task.id
                    }
                    if (task && task.service_agent && task.service_agent.name) {
                      serviceAgentObject.name = task.service_agent.name
                    }
                    this.props.jobDocAction.getDefaultAllocatedUsers(task.service_agent.id)
                      .then(org_users => {
                        if (org_users) {
                          let serviceAgents = { service_agent: serviceAgentObject, staff_users: org_users }
                          this.setState({ serviceAgentArray: [...this.state.serviceAgentArray, serviceAgents] }, () => {

                          });
                        }
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
                    this.props.jobDocAction.getServiceAgentAllStaff(task.service_agent.id)
                      .then(org_users => {
                        if (org_users) {
                          let existServiceAgent = this.state.allStaffList.find(item => item.service_agent.service_agent_id == task.service_agent.id);
                          if (existServiceAgent === null || existServiceAgent === undefined) {
                            let serviceAgents = { service_agent: serviceAgentObject, staff_users: org_users }
                            this.setState({ allStaffList: [...this.state.allStaffList, serviceAgents] }, () => {
                            });
                          }
                        }
                      }).catch((message) => {
                        notification.error({
                          key: ERROR_NOTIFICATION_KEY,
                          message: Strings.error_title,
                          description: message ? message : Strings.generic_error,
                          onClick: () => { },
                          className: 'ant-error'
                        });
                      });
                  }
                  return null;
                })
              }
              return null;
            })
            if (this.props.jobDocsDetails && this.props.jobDocsDetails.job_allocated_users && this.props.jobDocsDetails.job_allocated_users.length > 0) {
              this.setState({ staffLicenceDetails: true, formCompletion: this.state.formCompletion + 25 }, () => {
                this.setState({ updateStaff: true });
              })
            } else {
              this.setState({ updateStaff: true });
            }
            if (this.props.jobDocsDetails && this.props.jobDocsDetails.job_doc_orgs_certificates && this.props.jobDocsDetails.job_doc_orgs_certificates.length > 0) {
              this.setState({ certificateDetails: true, formCompletion: this.state.formCompletion + 25 }, () => {
                this.setState({ updateCertificate: true });
              })
            } else {
              this.setState({ updateCertificate: true });
            }
            if (this.props.jobDocsDetails && this.props.jobDocsDetails.job_doc_schedules && this.props.jobDocsDetails.job_doc_schedules.length > 0) {
              this.setState({ scheduleDetails: true, formCompletion: this.state.formCompletion + 25 }, () => {
                this.setState({ updateSchedule: true });
              })
            } else {
              this.setState({ updateSchedule: true });
            }
          }
        }).catch(error => {
          notification.error({
            key: ERROR_NOTIFICATION_KEY,
            message: Strings.error_title,
            description: error ? error : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          })
        });
    }
    if (this.currentOrganization) {
      this.props.jobDocAction.getOrganisationCertificates(this.currentOrganization)
        .then(certificateList => {
          if (certificateList) {
            this.setState({ certificateList: certificateList })
          }
        })
        .catch((message) => {
          notification.error({
            key: ERROR_NOTIFICATION_KEY,
            message: Strings.error_title,
            description: message ? message : Strings.generic_error, onClick: () => { },
            className: 'ant-error'
          });
        });
    }
    this.props.profileManagementActions.getLicencesType(); //get list of licenceType
    this.setState({ serviceDetails: true, formCompletion: this.state.formCompletion + 25 })
  }

  componentWillReceiveProps(props) {
    if (this.state.updateStaff && props.formValues.jobAllocatedUsers) {
      let jobAllocatedUsersFlag = false;
      Object.keys(props.formValues.jobAllocatedUsers).map(staff => {
        if (staff && staff !== "undefined" && props.formValues.jobAllocatedUsers[staff] && props.formValues.jobAllocatedUsers[staff].toString() != "type") {
          let allIds = staff.split("_");
          if (allIds[1]) {
            jobAllocatedUsersFlag = true;
          }
        }
      })
      if (jobAllocatedUsersFlag && this.state.staffLicenceDetails === false) {
        this.state.staffLicenceDetails = true;
        this.state.formCompletion = this.state.formCompletion + 25;
      } else if (this.state.staffLicenceDetails && jobAllocatedUsersFlag === false) {
        this.state.staffLicenceDetails = false;
        this.state.formCompletion = this.state.formCompletion - 25;
      }
    }

    if (this.state.updateCertificate && props.formValues && props.formValues.certificates && props.formValues.certificates.length > 0) {
      let certificateFlag = false;
      props.formValues.certificates.map(certificate => {
        if (certificate) {
          certificateFlag = true;
        }
      })
      if (certificateFlag && this.state.certificateDetails === false) {
        this.state.certificateDetails = true;
        this.state.formCompletion = this.state.formCompletion + 25;
      } else if (this.state.certificateDetails && certificateFlag === false) {
        this.state.certificateDetails = false;
        this.state.formCompletion = this.state.formCompletion - 25;
      }
    }

    if (this.state.updateSchedule && props.formValues.schedule && props.formValues.schedule.length > 0 && this.state.scheduleDetails === false) {
      this.state.scheduleDetails = true;
      this.state.formCompletion = this.state.formCompletion + 25;
    } else if (props.jobDocsDetails && this.state.scheduleDetails && _.isEmpty(props.formValues.schedule)) {
      this.state.scheduleDetails = false;
      this.state.formCompletion = this.state.formCompletion - 25;
    }
  }

  showImage = (image) => {
    this.setState({
      imageUrl: image,
      visibleImage: true,
    });
  };

  handleImageOk = e => {

    this.setState({
      imageUrl: null,
      visibleImage: false,
    });
  };

  handleImageCancel = e => {
    this.setState({
      imageUrl: null,
      visibleImage: false,
    });
  };

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);

    var finalFormData = {};
    var certificates = [];
    var job_allocated_users = [];
    var job_doc_tasks = [];
    var schedules = [];
    if (this.props.jobDocsDetails &&
      this.props.jobDocsDetails.quote &&
      this.props.jobDocsDetails.quote &&
      this.props.jobDocsDetails.quote.scope_doc &&
      this.props.jobDocsDetails.quote.scope_doc.scope_docs_sites &&
      this.props.jobDocsDetails.quote.scope_doc.scope_docs_sites.length > 0) {
      this.props.jobDocsDetails.quote.scope_doc.scope_docs_sites.map(site => {
        if (site && site.site && site.site.tasks && site.site.tasks.length > 0) {
          site.site.tasks.map(task => {
            job_doc_tasks.push(task.id)
          })
        }
      })
    }
    finalFormData.job_doc_number = this.state.job_doc_number;
    if (formData.jobAllocatedUsers) {
      Object.keys(formData.jobAllocatedUsers).map(staff => {
        if (staff && staff !== "undefined" && formData.jobAllocatedUsers[staff] && formData.jobAllocatedUsers[staff].toString() != "type") {
          let allIds = staff.split("_");
          var user_license = [];
          if (formData.jobAllocatedUsers.type) {
            Object.keys(formData.jobAllocatedUsers.type).map(licence => {
              let licenceIds = licence.split("_");
              if (allIds && allIds[0] && licenceIds[0] && formData.jobAllocatedUsers.type[licence] && allIds[1] && licenceIds && licenceIds[1] && licenceIds[1].toString() === allIds[1].toString() && allIds[0].toString() === licenceIds[0].toString()) {
                if (licenceIds[2]) {
                  user_license.push(licenceIds[2]);
                }
              }
            })
          }
          if (allIds[1]) {
            job_allocated_users.push({
              user_name: allIds[1],
              task_id: parseInt(allIds[0]),
              user_license: _.uniq(user_license)
            })
          }
        }
      })
    }
    if (formData.certificates && formData.certificates.length > 0) {
      formData.certificates.map((certificate, index) => {
        if (certificate) {
          certificates.push({
            orgs_certificate_id: index,
          });
        }
      })
    }

    if (formData.schedule && formData.schedule.length > 0) {
      formData.schedule.map(item => {
        if (item && item.date) {
          item.date = moment(item.date).format();
        }
        if (item.start) {
          item.start = moment(item.start, "HH:mm:ss").format('HH:mm:ss');
        }
        if (item.finish) {
          item.finish = moment(item.finish, "HH:mm:ss").format('HH:mm:ss');
        }
        if (item) {
          schedules.push(item);
        }
      })
    }
    finalFormData.certificates = certificates;
    finalFormData.job_allocated_users = job_allocated_users;
    finalFormData.schedules = schedules;
    finalFormData.note = formData.note;
    finalFormData.job_doc_tasks = job_doc_tasks;
    this.props.jobDocAction.updateJobDoc(finalFormData).then(message => {
      this.props.action.getJobDocsDetails(this.state.job_doc_number);
      notification.success({
        message: Strings.success_title,
        description: message ? message : Strings.job_doc_update_success,
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

  addServiceAgent = (task, serviceAgents) => (
    <fieldset className="add-sa-search no-label form-group sf-form select-wibg">
      <Field
        name={task.id}
        placeholder="Select Service Agent"
        dataSource={serviceAgents.map(agent => ({ text: agent.name, value: agent.id }))}
        component={CustomAutoCompleteSearch}
        onSelect={(service_agent_id) => this.addNewServiceAgent(service_agent_id, task.id)} />
    </fieldset>
  );

  addNewServiceAgent = (service_agent_id, task_id) => {
    if (service_agent_id) {
      let saData = this.props.serviceAgents.find(data => data.id == service_agent_id);
      if (saData) {
        let serviceAgentObject = {
          service_agent_id: service_agent_id,
          name: saData.name,
          task_id: task_id
        }
        this.props.jobDocAction.getDefaultAllocatedUsers(service_agent_id)
          .then(org_users => {
            if (org_users) {
              let serviceAgents = { service_agent: serviceAgentObject, staff_users: org_users }
              this.setState({ serviceAgentArray: [...this.state.serviceAgentArray, serviceAgents] });
            }
          })
          .catch((message) => {
            notification.error({
              key: ERROR_NOTIFICATION_KEY,
              message: Strings.error_title,
              description: message ? message : Strings.generic_error, onClick: () => { },
              className: 'ant-error'
            });
          });
        this.props.jobDocAction.getServiceAgentAllStaff(service_agent_id)
          .then(org_users => {
            if (org_users) {
              let existServiceAgent = this.state.allStaffList.find(item => item.service_agent.service_agent_id == service_agent_id);
              if (existServiceAgent === null || existServiceAgent === undefined) {
                let serviceAgents = { service_agent: serviceAgentObject, staff_users: org_users }
                this.setState({ allStaffList: [...this.state.allStaffList, serviceAgents] });
              }
            }
          }).catch((message) => {
            notification.error({
              key: ERROR_NOTIFICATION_KEY,
              message: Strings.error_title,
              description: message ? message : Strings.generic_error, onClick: () => { },
              className: 'ant-error'
            });
          });
      }
    }
  }

  handleAddNewStaff = (staffList, serviceAgent) => {
    if (staffList && staffList.length > 0) {
      staffList.forEach(staff_id => {
        this.addNewStaff(staff_id, serviceAgent);
      })
    }
    this.setState({ filteredStaff: false });
  }

  handleAddStaffCancelled = () => {
    this.setState({ filteredStaff: false });
  }

  handleAddFilterState = () => {
    this.setState({ filteredStaff: true });
  }

  addStaff = (serviceAgent) => {
    var serviceAgentObject = this.state.allStaffList.find(item => item.service_agent.service_agent_id == serviceAgent.service_agent.service_agent_id);
    if (serviceAgentObject && this.state.filteredStaff) {
      return (
        <AddFilteredStaff allStaffList={this.state.allStaffList} serviceAgent={serviceAgent} handleAddNewStaff={this.handleAddNewStaff} handleAddStaffCancelled={this.handleAddStaffCancelled} />
      )
    }
  }

  addNewStaff = (staff_id, serviceAgentObj) => {
    let service_agent_id = serviceAgentObj.service_agent_id
    let serviceAgent = this.state.serviceAgentArray.findIndex(item => item.service_agent.task_id == serviceAgentObj.task_id);
    if (serviceAgent >= 0) {
      let existStaff = this.state.serviceAgentArray[serviceAgent].staff_users.find(item => item.user_name == staff_id);
      if (existStaff === null || existStaff === undefined) {
        this.state.allStaffList.map(service_agent => {
          if (service_agent.service_agent.service_agent_id == service_agent_id) {
            service_agent.staff_users.map(user => {
              if (user.user_name == staff_id) {
                let filteredServiceAgent = this.state.serviceAgentArray[serviceAgent];
                // user.first_name = user.name;
                // user.role_name = user && user.role && user.role.name ? user.role.name : '';
                filteredServiceAgent.staff_users.push(user);
                var serviceAgentArray = this.state.serviceAgentArray;
                serviceAgentArray[serviceAgent] = filteredServiceAgent;
                this.setState({
                  serviceAgentArray
                });
              }
            })
          }
        })
      }
    }
  }

  renderStaffMembers = ({ fields, index, meta: { error, submitFailed } }) => {
    return (<Collapse className="sl-inductions" defaultActiveKey={['0']}>
      {this.state.serviceAgentArray[index] && this.state.serviceAgentArray[index].service_agent && this.state.serviceAgentArray[index].service_agent.name ? <Panel className="sli-table-items" header={this.state.serviceAgentArray[index].service_agent.name + " (SA)"} key={index}>
        <table className="table">
          <tr>
            <th>{Strings.job_staff_name_position}</th>
          </tr>
          {this.state.serviceAgentArray[index] && this.state.serviceAgentArray[index].staff_users ? this.state.serviceAgentArray[index].staff_users.map(user => {
            return <tr>
              <td className="sli-name-chk">
                <Field name={`${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}`} label={user && user.first_name ? user.first_name + " (" + user.role_name + ")" : ''} component={CustomCheckbox} />
              </td>
            </tr>
          }) : ''}
        </table>
        <div id="sfPopOver" className="add-staff-f-lice">
          <Popover className="normal-bnt add-line-bnt add-jd-staff-bnt"
            placement="bottomLeft"
            content={this.addStaff(this.state.serviceAgentArray[index])}
            trigger="click"
            getPopupContainer={() => document.getElementById('sfPopOver')}
          >
            <Button onClick={this.handleAddFilterState}><i className="material-icons">add</i> Add Staff</Button>
          </Popover>
        </div>
      </Panel> : ''}
    </Collapse>
    )
  }

  downloadImage = (name, url) => {
    let imageUrl = `${url}? t = ${new Date().getTime()}`;
    fetch(imageUrl)
      .then(response => {
        response.blob().then(blob => {
          let url = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = url;
          a.download = name;
          a.click();
        });
      });
  }

  onChangeLicenceType = (event, task_id, licence_type, index) => {
    if (task_id && licence_type && this.state.serviceAgentArray && this.state.serviceAgentArray.length > 0 && this.state.serviceAgentArray[index] && this.state.serviceAgentArray[index].staff_users) {
      this.state.serviceAgentArray[index].staff_users.map(user => {
        if (this.props.licenceType && this.props.licenceType.length > 0) {
          this.props.licenceType.map(licence => {
            if (user && user.organisation_user && user.organisation_user.user_licences.length > 0) {
              let licienceObj = user.organisation_user.user_licences.filter(item => licence.id == item.type);
              if (licienceObj && licienceObj.length > 0 && licence_type == licence.id) {
                if (event.target.checked) {
                  this.props.change(`jobAllocatedUsers.type.${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}_${licienceObj[0].id}`, true);
                  this.props.change(`jobAllocatedUsers.${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}`, true)
                } else {
                  this.props.change(`jobAllocatedUsers.type.${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}_${licienceObj[0].id}`, false);
                }
              }
            }
          })
        }
      })
    }
  }

  handlesingleLicenceCheck = (event, name) => {
    if (event.target.checked && name) {
      this.props.change(`jobAllocatedUsers.${name}`, true);
    }
  }

  viewLicienceDetails = (licienceObj) => {
    if (licienceObj) {
      this.setState({
        licienceDetails: licienceObj,
        visibleLicienceDetails: true,
      });
    }
  }
  handleLicienceDetailsOk = e => {
    this.setState({
      licienceDetails: null,
      visibleLicienceDetails: false,
    });
  };

  handleLicienceDetailsCancel = e => {
    this.setState({
      licienceDetails: null,
      visibleLicienceDetails: false,
    });
  };

  handleRemoveUser = (event, task_id, user_name) => {
    if (task_id && user_name) {
      if (event.target.checked) {
      } else {
        if (this.props.formValues && this.props.formValues.jobAllocatedUsers && this.props.formValues.jobAllocatedUsers.type) {
          Object.keys(this.props.formValues.jobAllocatedUsers.type).forEach((item) => {
            let splitIds = item.split('_');
            if (splitIds[0].toString() === task_id.toString() && user_name.toString() === splitIds[1].toString()) {
              this.props.change(`jobAllocatedUsers.type.${item}`, false);
            }
          })
        }
      }
    }
  }

  handlePreviewClick = () => {
    let certificates = []
    if (this.props.formValues.certificates && this.props.formValues.certificates.length > 0) {
      this.props.formValues.certificates.map((certificate, index) => {
        if (certificate) {
          if (this.state.certificateList && this.state.certificateList.length > 0) {
            for (let cert of this.state.certificateList) {
              if (cert.id == index) {
                certificates.push(cert);
              }
            }
            this.setState({ previewCertificates: certificates });
          }
        }
      })
    }

    var previewServiceAgentArray = [];
    for (let staffList of this.state.serviceAgentArray) {
      if (staffList && staffList.service_agent && staffList.service_agent.task_id) {
        var userList = [];
        if (staffList.staff_users && staffList.staff_users.length > 0) {
          // eslint-disable-next-line no-loop-func
          staffList.staff_users.forEach(element => {
            if (element && element.user_name && element.role_name && element.first_name) {
              Object.keys(this.props.formValues.jobAllocatedUsers).map(staff => {
                if (staff && staff !== "undefined" && this.props.formValues.jobAllocatedUsers[staff]) {
                  let allIds = staff.split("_");
                  if (allIds[0] && allIds[1]);
                  if (allIds[0] == staffList.service_agent.task_id && allIds[1] == element.user_name) {
                    var liciencList = [];
                    if (this.props.formValues.jobAllocatedUsers.type) {
                      Object.keys(this.props.formValues.jobAllocatedUsers.type).map(type => {
                        if (type && this.props.formValues.jobAllocatedUsers.type[type]) {
                          let typeIds = type.split('_');
                          if (typeIds[0] && typeIds[1] && typeIds[2]);
                          if (typeIds[0] == staffList.service_agent.task_id && typeIds[1] == element.user_name) {
                            if (element.organisation_user && element.organisation_user.user_licences && element.organisation_user.user_licences.length > 0) {
                              let licienceObj = element.organisation_user.user_licences.find(k => k.id == typeIds[2]);
                              if (licienceObj) {
                                liciencList.push(licienceObj);
                              }
                            }
                          }
                        }
                      })
                    }
                    userList.push({
                      first_name: element.first_name,
                      role_name: element.role_name,
                      user_licences: liciencList
                    });
                  }
                }
              })
            }
          });
        }
        previewServiceAgentArray.push({
          service_agent: staffList.service_agent,
          staff_users: userList
        })
      }
    }
    this.setState({ previewStaffList: previewServiceAgentArray });

    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };

  disableScheduleDate = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  renderScheduleMembers = ({ fields, meta: { error, submitFailed }, schedules }) => {
    return (<>
      {fields.map((member, index) => (
        <tr key={index}>
          <td>
            <fieldset className="jc-calndr sf-form no-label">
              <Field name={`${member}.date`} type="date" id="date"
                disabledDate={this.disableScheduleDate}
                component={CustomDatepicker} />
            </fieldset>
          </td>
          <td>
            <fieldset className="sf-form">
              <Field name={`${member}.start`} component={CustomTimePicker} />
            </fieldset>
          </td>
          <td>
            <fieldset className="sf-form">
              <Field name={`${member}.finish`} component={CustomTimePicker} />
            </fieldset>
          </td>
          <td>
            <fieldset className="sf-form">
              <Field name={`${member}.scope`} placeholder="scope" type="text" component={customInput} />
            </fieldset>
          </td>
          <td>
            <fieldset className="sf-form">
              <Field name={`${member}.area`} placeholder="areas" type="text" component={customInput} />
            </fieldset>
          </td>
          <td>
            <fieldset className="sf-form">
              <Field name={`${member}.site_requirements`} placeholder="site requirements" type="text" component={customInput} />
            </fieldset>
          </td>
          <td><button className='delete-bnt' type='button' onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></td>
        </tr>
      ))}
      <div className="btn-hs-icon sm-bnt bnt-error mt-4">
        <button className="bnt bnt-normal" type="button" onClick={() => fields.push({})}>Add Schedule</button>
        {submitFailed && error && <span className="error-input">{error}</span>}
      </div>
    </>)
  }

  // History modal function	
  showHistoryModal = (versionNumber) => {
    // this.handlePreviewClick()	
    // this.props.jobDocAction.getScopeDocVersionHistory(this.props.jobDocsDetails.job_doc_number, versionNumber)	
    this.props.jobDocAction.getJobDocVersionHistory(this.props.jobDocsDetails.job_doc_number, versionNumber)
      .then(() => {
        let certificates = []
        if (this.props.formValues.certificates && this.props.formValues.certificates.length > 0) {
          this.props.formValues.certificates.map((certificate, index) => {
            if (certificate) {
              if (this.state.certificateList && this.state.certificateList.length > 0) {
                for (let cert of this.state.certificateList) {
                  if (cert.id == index) {
                    certificates.push(cert);
                  }
                }
                this.setState({ previewCertificates: certificates });
              }
            }
          })
        }
        var previewServiceAgentArray = [];
        for (let staffList of this.state.serviceAgentArray) {
          if (staffList && staffList.service_agent && staffList.service_agent.task_id) {
            var userList = [];
            if (staffList.staff_users && staffList.staff_users.length > 0) {
              // eslint-disable-next-line no-loop-func	
              staffList.staff_users.forEach(element => {
                if (element && element.user_name && element.role_name && element.first_name) {
                  Object.keys(this.props.formValues.jobAllocatedUsers).map(staff => {
                    if (staff && staff !== "undefined" && this.props.formValues.jobAllocatedUsers[staff]) {
                      let allIds = staff.split("_");
                      if (allIds[0] && allIds[1]);
                      if (allIds[0] == staffList.service_agent.task_id && allIds[1] == element.user_name) {
                        var liciencList = [];
                        if (this.props.formValues.jobAllocatedUsers.type) {
                          Object.keys(this.props.formValues.jobAllocatedUsers.type).map(type => {
                            if (type && this.props.formValues.jobAllocatedUsers.type[type]) {
                              let typeIds = type.split('_');
                              if (typeIds[0] && typeIds[1] && typeIds[2]);
                              if (typeIds[0] == staffList.service_agent.task_id && typeIds[1] == element.user_name) {
                                if (element.organisation_user && element.organisation_user.user_licences && element.organisation_user.user_licences.length > 0) {
                                  let licienceObj = element.organisation_user.user_licences.find(k => k.id == typeIds[2]);
                                  if (licienceObj) {
                                    liciencList.push(licienceObj);
                                  }
                                }
                              }
                            }
                          })
                        }
                        userList.push({
                          first_name: element.first_name,
                          role_name: element.role_name,
                          user_licences: liciencList
                        });
                      }
                    }
                  })
                }
              });
            }
            previewServiceAgentArray.push({
              service_agent: staffList.service_agent,
              staff_users: userList
            })
          }
        }
        this.setState({ previewStaffList: previewServiceAgentArray });
        this.setState({
          hisVisible: true,
        });
      })
      .catch(err => {
      })
  };
  hisHandleCancel = e => {
    this.setState({
      hisVisible: false,
    });
  };


  render() {
    const { jobDocsDetails, handleSubmit, licenceType, organization } = this.props;
    return (
      <div className="sf-page-layout">
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => this.props.history.push('./jobCalendar')} />
            {
              mapRouteToTitle[this.props.location.pathname]
                ? mapRouteToTitle[this.props.location.pathname]
                : Strings.update_job_docs_txt
            }
          </h2>
          <div className="sf-steps-status sf-step-4">
            <div className="sf-steps-row">
              <div className={this.state.serviceDetails ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="material-icons">build</i></div>
                <span>{Strings.job_service_details}</span>
              </div>
              <div className={this.state.staffLicenceDetails ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="material-icons">people</i></div>
                <span>{Strings.job_staff_licenses_inductions}</span>
              </div>
              <div className={this.state.certificateDetails ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="fa fa-briefcase"></i></div>
                <span>{Strings.job_doc_insurance_certificate}</span>
              </div>
              <div className={this.state.scheduleDetails ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="material-icons">timer</i></div>
                <span>Schedule</span>
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
          </div>
        </div>
        <div className="main-container">
          <div className="sf-card-wrap">
            <div className="sf-jobdoc-preview job-doc-prev">
              <div className="jdp-head">
                {organization && organization.logo ? <img src={`${organization.logo}`} alt="img" /> : organization && organization.name ? <strong className="img-abbri-str">{abbrivationStr(organization.name)}</strong> : ''}
                <h2 className="page-mn-hd">{Strings.job_document_title}</h2>
                <div class="jdp-c-exp-date">
                  <h3>{organization && organization.name ? organization.name : ''}</h3>
                  {/* <h5>{Strings.link_expire_day}</h5> */}
                </div>
              </div>
              <div className="jdp-body">
                <div className="sf-card scope-v-value mb-4">
                  <div className="sf-card-head">
                    <div className="quote view-jd-history sf-page-history mt-0">
                      <Collapse className="show-frquency-box" bordered={false} accordion
                        expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                        <Panel header="View History" key="1">
                          <div className="history-lists">
                            {
                              this.props.versions.map(versionNumber => (
                                <button type="button" class="normal-bnt" onClick={() => this.showHistoryModal(versionNumber)}>{jobDocsDetails.job_doc_number} - {versionNumber}</button>
                              ))
                            }
                          </div>
                        </Panel>
                      </Collapse>
                    </div>
                  </div>
                </div>
                <form onSubmit={handleSubmit(this.onSubmit)}>
                  {/* Contractor Details */}
                  <div className="sf-card">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                      <h2 className="sf-pg-heading">{Strings.contractor_details}</h2>
                      <div className="info-btn disable-dot-menu">
                        <Dropdown className="more-info" disabled>
                          <i className="material-icons">more_vert</i>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="sf-card-body">
                      <div className="data-v-row">
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.client_company}</label>
                            <span>{organization && organization.name ? organization.name : ''}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.client_abn}</label>
                            <span>{organization && organization.abn_acn ? organization.abn_acn : ''}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.address_txt}</label>
                            <span>{organization && organization.address ? organization.address : ''}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.client_contact}</label>
                            <span>{organization && organization.primary_person ? organization.primary_person : ''}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.client_phone}</label>
                            <span>{organization && organization.phone_number ? organization.phone_number : ''}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Service Details */}
                  <div className="sf-card mt-4">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                      <h2 className="sf-pg-heading">{Strings.job_service_details}</h2>
                      <div className="info-btn disable-dot-menu">
                        <Dropdown className="more-info" disabled>
                          <i className="material-icons">more_vert</i>
                        </Dropdown>
                      </div>
                    </div>

                    {jobDocsDetails && jobDocsDetails.quote && jobDocsDetails.quote.scope_doc && jobDocsDetails.quote.scope_doc.scope_docs_sites && jobDocsDetails.quote.scope_doc.scope_docs_sites.length > 0 ? jobDocsDetails.quote.scope_doc.scope_docs_sites.map(site => {
                      return <div className="sf-card-body">
                        <div className="data-v-row">
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.site_name}</label>
                              <span>{site && site.site && site.site.site_name ? site.site.site_name : ''}</span>
                            </div>
                          </div>
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.address_txt}</label>
                              <span>{site && site.site && site.site.street_address ? site.site.street_address : ''} {site.site.city ? site.site.city : ''} {site.site.state ? site.site.state : ''} {site.site.zip_code ? site.site.zip_code : ''}</span>
                            </div>
                          </div>
                        </div>

                        <div className="service-table">
                          <table className="table">
                            {site.site && site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map(task => {
                              return task && task.parent_id !== null && task.split_status !== "O" ? null : <tr>
                                <td>
                                  <div className="view-text-value">
                                    <label>{task && task.task_name ? task.task_name : ''}</label>
                                    <span>{task && task.description ? task.description : ''}</span>
                                  </div>
                                </td>
                                <td>
                                  <div className="view-text-value" id="sfPopOver">
                                    <label>{Strings.job_service_agent}</label>
                                    <span>{task && task.service_agent && task.service_agent.name ? task.service_agent.name : ''}</span>
                                  </div>
                                </td>
                              </tr>
                            }) : ''}
                          </table>
                        </div>
                      </div>

                    }) : ''}
                  </div>

                  {/* Staff Licenses/Inductions */}

                  <FormSection name="jobAllocatedUsers">
                    <div className="sf-card mt-4">
                      <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.job_staff_licenses_inductions}</h2>
                        <div className="info-btn disable-dot-menu">
                          <Dropdown className="more-info" disabled>
                            <i className="material-icons">more_vert</i>
                          </Dropdown>
                        </div>
                      </div>
                      <div className="sf-card-body">
                        {this.state.serviceAgentArray && this.state.serviceAgentArray.length > 0 ? this.state.serviceAgentArray.map((serviceAgent, index) => {
                          return <Collapse className="sl-inductions staff-li-table" defaultActiveKey={[index]}>
                            {this.state.serviceAgentArray[index] && this.state.serviceAgentArray[index].service_agent && this.state.serviceAgentArray[index].service_agent.name ? <Panel className="sli-table-items" header={this.state.serviceAgentArray[index].service_agent.name + " (SA)"} key={index}>
                              <table className="table">
                                <tr className="up-jd-scop">
                                  <th>{Strings.job_staff_name_position}</th>
                                  {licenceType && licenceType.length > 0 ? licenceType.map(licence => {
                                    if (licence && licence.name && licence.id);
                                    return <th>
                                      <Field name={`${this.state.serviceAgentArray[index].service_agent.task_id}-${licence.id}`} label={licence && licence.name ? licence.name : ''}
                                        component={CustomCheckbox}
                                        onChange={(value) => this.onChangeLicenceType(value, this.state.serviceAgentArray[index].service_agent.task_id, licence.id, index)}
                                      /></th>
                                  }) : ''}
                                </tr>
                                {this.state.serviceAgentArray[index] && this.state.serviceAgentArray[index].staff_users ? this.state.serviceAgentArray[index].staff_users.map(user => {
                                  return <tr>
                                    <td className="sli-name-chk">
                                      <Field name={`${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}`} label={user && user.first_name ? user.first_name + " (" + user.role_name + ")" : ''} component={CustomCheckbox}
                                        onChange={(value) => { this.handleRemoveUser(value, this.state.serviceAgentArray[index].service_agent.task_id, user.user_name) }} />
                                    </td>
                                    {licenceType && licenceType.length > 0 ? licenceType.map(licence => {
                                      if (user && user.organisation_user && user.organisation_user.user_licences && user.organisation_user.user_licences.length > 0) {
                                        let licienceObj = user.organisation_user.user_licences.filter(item => licence.id == item.type);
                                        if (licienceObj && licienceObj.length > 0) {
                                          return <td className="sli-name-chk">
                                            <FormSection name="type"><Field name={`${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}_${licienceObj[0].id}`} label={licienceObj && licienceObj[0].license_type_name ? licienceObj[0].license_type_name : ''} component={CustomCheckbox}
                                              onChange={(value) => { this.handlesingleLicenceCheck(value, `${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}`) }} />
                                            </FormSection>
                                            <div className="stff-action-bnt">
                                              {licienceObj[0] && licienceObj[0].image ? <> <a onClick={() => this.downloadImage(licienceObj[0].license_type_name, licienceObj[0].image)}><i className="material-icons">get_app</i></a>
                                                <button type="button" className="normal-bnt" onClick={() => this.viewLicienceDetails(licienceObj[0])}><i className="material-icons">remove_red_eye</i></button> </> : ''}</div>
                                          </td>
                                        } else {
                                          return <td></td>
                                        }
                                      } else {
                                        return <td></td>
                                      }
                                    }) : ''}
                                  </tr>
                                }) : ''}
                              </table>
                              <div id="sfPopOver" className="add-staff-f-lice">
                                <Popover className="normal-bnt add-line-bnt add-jd-staff-bnt"
                                  placement="bottomLeft"
                                  content={this.addStaff(this.state.serviceAgentArray[index])}
                                  trigger="click"
                                  getPopupContainer={() => document.getElementById('sfPopOver')}
                                >
                                  <Button onClick={this.handleAddFilterState}><i className="material-icons" >add</i> Add Staff</Button>
                                </Popover>
                              </div>
                            </Panel> : ''}
                          </Collapse>
                        }) : ''}
                      </div>
                    </div>
                  </FormSection>

                  <FormSection name="certificates">
                    <div className="sf-card mt-4">
                      <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.job_doc_insurance_certificate}</h2>
                        <div className="info-btn disable-dot-menu">
                          <Dropdown className="more-info" disabled>
                            <i className="material-icons">more_vert</i>
                          </Dropdown>
                        </div>
                      </div>
                      <div className="sf-card-body">

                        <div className="row">
                          {this.state.certificateList ? this.state.certificateList.map(certificate => {
                            if (certificate && certificate.name && certificate.s3FileUrl) {
                              return <div className="col-md-3 col-sm-4 col-xs-6">
                                <div className="sf-roles-group ics-chkbox add-sub-mod">
                                  <Field name={certificate.id}
                                    label={
                                      <div className="inc-details">
                                        <h4>{certificate && certificate.name ? certificate.name : ''}</h4>
                                        <div className="inc-info">
                                          <span>Number: {certificate && certificate.certificate_number ? certificate.certificate_number : ''}</span>
                                          <span>Expiry Date: {certificate && certificate.expiry_date ? moment(certificate.expiry_date).format('DD/MM/YYYY') : ''}</span>
                                        </div>
                                      </div>
                                    }
                                    component={CustomCheckbox} />
                                  <div className="inc-actions">
                                    <div className="sli-action">
                                      <a className="sli-download" onClick={() => this.downloadImage(certificate.name, certificate.s3FileUrl)}><i className="material-icons">publish</i></a>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            }
                          }) : ''}
                        </div>
                      </div>
                    </div>
                  </FormSection>

                  {/* Schedule */}
                  <div className="sf-card mt-4">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                      <h2 className="sf-pg-heading">Schedule</h2>
                      <div className="info-btn disable-dot-menu">
                        <Dropdown className="more-info" disabled>
                          <i className="material-icons">more_vert</i>
                        </Dropdown>
                      </div>
                    </div>
                    <div className="sf-card-body">
                      <div className="jd-staff-table">
                        <table className="add-user-table table">
                          <tr>
                            <th>{Strings.job_date}</th>
                            <th>{Strings.job_start} </th>
                            <th>{Strings.job_finish}</th>
                            <th>{Strings.job_scope}</th>
                            <th>{Strings.job_area}</th>
                            <th>{Strings.job_site_requirements}</th>
                          </tr>
                          <FieldArray
                            name="schedule"
                            schedules={this.props.initialValues && this.props.initialValues.schedules ? this.props.initialValues.schedules : []}
                            component={this.renderScheduleMembers} />
                        </table>
                      </div>
                      {/* Add notes here */}
                      <div className="row">
                        <div className="col-md-8 col-sm-8 col-xs-12">
                          <fieldset className="sf-form">
                            <Field
                              name="note"
                              type="text"
                              label="Add Notes"
                              component={customTextarea} />
                          </fieldset>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                    <div className="btn-hs-icon">
                      {
                        jobDocsDetails && jobDocsDetails.any_job_accepted
                          ? <button type="submit" className="bnt bnt-active" disabled={jobDocsDetails && jobDocsDetails.any_job_accepted}>
                            <i class="material-icons">save</i> {Strings.update_btn}</button>
                          : <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                            <i class="material-icons">save</i> {Strings.update_btn}
                          </button>}
                      {/* <button type="submit" className="bnt bnt-active" disabled={(jobDocsDetails && jobDocsDetails.any_job_accepted && this.props.isDirty) }>	
                        <i class="material-icons">save</i> {Strings.update_btn}</button> */}
                    </div>
                    <div className="btn-hs-icon">
                      <button type="button" className="bnt bnt-normal" onClick={this.handlePreviewClick} >
                        <i class="material-icons">remove_red_eye</i> {Strings.preview_and_email_btn}</button>
                    </div>
                  </div>
                </form>
              </div>

              {/* certificate image Modal */}
              <Modal
                title="Insurance Certificates and SWMS"
                visible={this.state.visibleImage}
                onOk={this.handleImageOk}
                onCancel={this.handleImageCancel}
              >
                {this.state.imageUrl && (this.state.imageUrl.includes(".pdf") || this.state.imageUrl.includes(".PDF")) ? <embed src={this.state.imageUrl} frameborder="0" width="100%" height="400px" /> : <img src={this.state.imageUrl ? this.state.imageUrl : ''} alt="img" />}
              </Modal>

              {/* View licience Details Modal */}
              <Modal
                title="Licence Details"
                visible={this.state.visibleLicienceDetails}
                onOk={this.handleLicienceDetailsOk}
                onCancel={this.handleLicienceDetailsCancel}
                cancelButtonProps={{ style: { display: 'none' } }}
              >
                {this.state.licienceDetails && this.state.licienceDetails.license_type_name ? <p>Licence Name : {this.state.licienceDetails.license_type_name}</p> : ''}
                {this.state.licienceDetails && this.state.licienceDetails.number ? <p> Licence Number : {this.state.licienceDetails.number}</p> : ''}
                {this.state.licienceDetails && this.state.licienceDetails.issued_by ? <p>
                  Licence Issued By : {this.state.licienceDetails.issued_by}</p> : ''}
                {this.state.licienceDetails && this.state.licienceDetails.expiry_date ? <p>
                  Licence Expiry Date : {moment(this.state.licienceDetails.expiry_date).format('DD/MM/YYYY')}</p> : ''}
              </Modal>

              {/* preview job doc */}
              <Modal
                title="Job Doc Preview"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
                footer={null}
                width="100%"
                className="job-doc-preview"
              >

                <PreviewJobDoc
                  job_doc_number={this.state.job_doc_number ? this.state.job_doc_number : ''}
                  formValues={this.props.formValues}
                  history={this.props.history}
                  handleCancel={this.handleCancel}
                  previewCertificates={this.state.previewCertificates}
                  previewStaffList={this.state.previewStaffList}
                />
              </Modal>

              {/* history popup  */}
              <Modal
                title="Basic Modal"
                visible={this.state.hisVisible}
                okButtonProps={{ style: { display: 'none' } }}
                width="100%"
                className="job-doc-preview"
                onCancel={this.hisHandleCancel}>
                <HistoryJobDoc
                  job_doc_number={this.state.job_doc_number ? this.state.job_doc_number : ''}
                  formValues={this.props.formValues}
                  history={this.props.history}
                  handleCancel={this.handleCancel}
                  previewCertificates={this.state.previewCertificates}
                  previewStaffList={this.state.previewStaffList}
                // {...this.props}	
                />
              </Modal>

            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  var value = state.scopeDocs && state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : null;
  var scheduleInitialValue = [];
  var certificates = [];
  var jobAllocatedUsers = {};
  var note = '';
  if (state.scopeDocs && state.scopeDocs.jobDocsDetails && state.scopeDocs.jobDocsDetails.job_doc_schedules && state.scopeDocs.jobDocsDetails.job_doc_schedules.length > 0) {
    var job_doc_schedules = state.scopeDocs.jobDocsDetails.job_doc_schedules;
    job_doc_schedules.forEach((element, index) => {
      scheduleInitialValue.push(element)
    });
  }
  if (state.scopeDocs && state.scopeDocs.jobDocsDetails && state.scopeDocs.jobDocsDetails.job_doc_orgs_certificates && state.scopeDocs.jobDocsDetails.job_doc_orgs_certificates.length > 0) {
    var job_doc_orgs_certificates = state.scopeDocs.jobDocsDetails.job_doc_orgs_certificates;
    job_doc_orgs_certificates.forEach((element, index) => {
      if (element && element.orgs_certificate && element.orgs_certificate.id) {
        let key = element.orgs_certificate.id;
        certificates[key] = true;
      }
    });
  }

  if (state.scopeDocs && state.scopeDocs.jobDocsDetails && state.scopeDocs.jobDocsDetails.job_allocated_users && state.scopeDocs.jobDocsDetails.job_allocated_users.length > 0) {
    var job_allocated_users = state.scopeDocs.jobDocsDetails.job_allocated_users;
    let typeObj = {};
    job_allocated_users.forEach((element, index) => {
      if (element && element.user_name && element.task_id) {
        let user = `${element.task_id}_${element.user_name}`;
        jobAllocatedUsers[user] = true;
        if (element.user_license && element.user_license) {
          var licienceIds = element.user_license.split(',');
          for (let item of licienceIds) {
            if (item) {
              let licience = `${element.task_id}_${element.user_name}_${item}`
              typeObj[licience] = true;
            }
          }
          jobAllocatedUsers['type'] = typeObj;
        }
      }
    });
  }

  if (state.scopeDocs && state.scopeDocs.jobDocsDetails && state.scopeDocs.jobDocsDetails.note) {
    note = state.scopeDocs.jobDocsDetails.note;
  }

  return {
    selectedScopeDoc: (value ? value : {}),
    scopeDocsDetails: state.scopeDocs.scopeDocsDetails,
    jobDocsDetails: state.scopeDocs.jobDocsDetails,
    serviceAgents: state.organization.serviceAgents,
    initialValues: {
      schedule: scheduleInitialValue,
      certificates: certificates,
      jobAllocatedUsers: jobAllocatedUsers,
      note: note
    },
    organization: state.organization.organizationDetails,
    licenceType: state.profileManagement.licenceType,
    formValues: state.form && state.form.viewJobDoc &&
      state.form.viewJobDoc.values ? state.form.viewJobDoc.values : {},
    versionCount: (!state.scopeDocs.versionCount || isNaN(state.scopeDocs.versionCount) || state.scopeDocs.versionCount === '') ? 0 : state.scopeDocs.versionCount,
    versions: state.scopeDocs.versions,
    isDirty: isDirty('viewJobDoc')(state),
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    jobDocAction: bindActionCreators(jobDocAction, dispatch),
    profileManagementActions: bindActionCreators(profileManagementActions, dispatch),
    organisationAction: bindActionCreators(organisationAction, dispatch)
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'viewJobDoc', enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(ViewJobDoc)
