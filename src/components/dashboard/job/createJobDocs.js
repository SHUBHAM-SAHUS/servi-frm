import React from 'react';
import { Icon, Modal, Collapse, Popover, Button, Dropdown, Progress, notification } from 'antd';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FormSection, FieldArray } from 'redux-form';
import { Link } from 'react-router-dom';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import { CustomCheckbox } from '../../common/customCheckbox';
import { customInput } from '../../common/custom-input';
import { CustomDatepicker } from '../../common/customDatepicker';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { customTextarea } from '../../common/customTextarea';
import PreviewJobDoc from './PreviewJobDoc';

import * as actions from '../../../actions/roleManagementActions';
import * as accessControlAction from '../../../actions/accessControlManagementAction';
import * as jobDocAction from '../../../actions/jobDocAction';
import * as profileManagementActions from '../../../actions/profileManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { goBack, handleFocus, goBackBrowser } from '../../../utils/common';
import { getStorage } from '../../../utils/common';
import moment from 'moment';
import AddFilteredStaff from './addFilteredStaff';
import { CustomTimePicker } from '../../common/customTimePicker';
import { Certificate } from 'crypto';
import ScrollArea from 'react-scrollbar';
import * as organisationAction from '../../../actions/organizationAction';
import { DeepTrim } from '../../../utils/common';


import { ERROR_NOTIFICATION_KEY } from '../../../config';

const mapRouteToTitle = {
  '/dashboard': Strings.job_docs_txt
}

const { Panel } = Collapse;

class CreateJobDocs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { togleSearch: true, quote_id: '', job_doc_number: '', serviceAgentArray: [], certificateList: [], visible: false, allStaffList: [], saved: true, visibleImage: false, imageUrl: null, licienceDetails: {}, visibleLicienceDetails: false, filteredStaff: true, associated_job_doc_num: [], contactorDetails: false, serviceDetails: false, staffLicenceDetails: false, certificateDetails: false, scheduleDetails: false, formCompletion: 0, previewCertificates: [], previewStaffList: [] }
    this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    this.loginUserName = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
      (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : null;
    this.loginUserRoleName = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).role.role_name : null;
    this.props.accessControlAction.getAccessControlsByModule();
    this.props.action.getRoles(this.currentOrganization).then((flag) => {
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

  componentDidMount() {
    console.log(this.props.scopeDocsDetails)
    let quote_id;
    this.props.organisationAction.getCurrentOrgDetails();
    if (this.props.scopeDocsDetails && this.props.scopeDocsDetails[0] && this.props.scopeDocsDetails[0].quotes && this.props.scopeDocsDetails[0].quotes.length > 0) {
      this.props.scopeDocsDetails[0].quotes.map(quote => {
        if (quote.quote_number === this.props.scopeDocsDetails[0].quote_number) {
          quote_id = quote.id
          this.setState({ quote_id: quote_id })
          this.props.jobDocAction.generateJobDocNumber({ quote_id: quote_id, quote_number: this.props.scopeDocsDetails[0].quote_number })
            .then(res => {
              if (res.job_doc_number) {
                this.setState({ job_doc_number: res.job_doc_number })
              }
              if (res.associated_job_doc_num && res.associated_job_doc_num.length > 0) {
                this.setState({ associated_job_doc_num: res.associated_job_doc_num });
              }
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
        return quote_id;
      })
    }
    if (this.props.scopeDocsDetails && this.props.scopeDocsDetails[0] && this.props.scopeDocsDetails[0].sites && this.props.scopeDocsDetails[0].sites.length > 0) {
      this.props.scopeDocsDetails[0].sites.map(site => {
        if (site && site.tasks && site.tasks.length > 0) {
          site.tasks.map(task => {
            if (task && task.service_agent_id) {
              var serviceAgentObject = {
                service_agent_id: task.service_agent_id,
                task_id: task.id
              }
              if (task && task.organisation && task.organisation.name) {
                serviceAgentObject.name = task.organisation.name
              }
              this.props.jobDocAction.getDefaultAllocatedUsers(task.service_agent_id)
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
              this.props.jobDocAction.getServiceAgentAllStaff(task.service_agent_id)
                .then(org_users => {
                  if (org_users) {
                    let existServiceAgent = this.state.allStaffList.find(item => item.service_agent.service_agent_id == task.service_agent_id);
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
            description: message ? message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        });
    }
    this.props.profileManagementActions.getLicencesType(); //get list of licenceType
  }

  componentWillReceiveProps(props) {
    let service_agents = [];
    let serviceAgentList = [];
    let service_agent_flag = true;
    if (props.formValues && props.formValues.serviceAgents && props.formValues.serviceAgents.length > 0) {
      props.formValues.serviceAgents.forEach((service_agent, index) => {
        if (parseInt(service_agent)) {
          return service_agents.push({
            service_agent_id: parseInt(service_agent),
            task_id: index
          })
        }
      })
    }

    if (this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 && this.props.scopeDocsDetails[0].sites) {
      this.props.scopeDocsDetails[0].sites.forEach(site => {
        if (site && site.tasks && site.tasks.length > 0) {
          site.tasks.forEach(task => {
            if (task) {
              if (task.service_agent_id === null || task.service_agent_id === undefined) {
                if (props.formValues.serviceAgents && props.formValues.serviceAgents.length > 0) {
                  var taskServiceAgent = service_agents.find(item => item.task_id == task.id);
                  if (!taskServiceAgent) {
                    service_agent_flag = false;
                  }
                } else {
                  service_agent_flag = false;
                }
                serviceAgentList.push(task.id);
              }
            }
          })
        }
      })
    }

    if (serviceAgentList && serviceAgentList.length > 0) {
      let SALength = serviceAgentList.length;
      let serviceDetailsPercentage = 25 / SALength;
      if (service_agents && service_agents.length > 0) {
        let finalSAPercentage = serviceDetailsPercentage * service_agents.length;
        let totalPercentage = 0;
        if (this.state.staffLicenceDetails === true) {
          totalPercentage = parseInt(totalPercentage) + 25;
        }
        if (this.state.certificateDetails === true) {
          totalPercentage = parseInt(totalPercentage) + 25;
        }
        if (this.state.scheduleDetails === true) {
          totalPercentage = parseInt(totalPercentage) + 25;
        }
        let result = parseInt(totalPercentage) + parseInt(finalSAPercentage);
        this.state.formCompletion = result;
        if (service_agent_flag) {
          this.state.serviceDetails = true;
        }
      }
    }
    if (service_agent_flag && this.state.serviceDetails === false) {
      this.state.serviceDetails = true;
      this.state.formCompletion = this.state.formCompletion + 25;
    }

    if (props.formValues.jobAllocatedUsers) {
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

    if (props.formValues && props.formValues.certificates && props.formValues.certificates.length > 0) {
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

    if (props.formValues.schedule && props.formValues.schedule.length > 0 && this.state.scheduleDetails === false) {
      this.state.scheduleDetails = true;
      this.state.formCompletion = this.state.formCompletion + 25;
    } else if (this.state.scheduleDetails && _.isEmpty(props.formValues.schedule)) {
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
                              liciencList.push(licienceObj);
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

  handleSearchToggle = () => {
    this.setState({ togleSearch: !this.state.togleSearch })
  }
  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);

    var service_agents = [];
    var job_allocated_users = [];
    var certificates = [];
    var schedules = [];
    var finalFormData = {};
    var service_agent_flag = true;
    if (this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 && this.props.scopeDocsDetails[0].client_id) {
      finalFormData.client_id = this.props.scopeDocsDetails[0].client_id;
    }
    if (formData.serviceAgents && formData.serviceAgents.length > 0) {
      formData.serviceAgents.forEach((service_agent, index) => {
        if (parseInt(service_agent)) {
          return service_agents.push({
            service_agent_id: parseInt(service_agent),
            task_id: index
          })
        }
      })
    }

    if (formData.jobAllocatedUsers) {
      Object.keys(formData.jobAllocatedUsers).map(staff => {
        if (staff && staff !== "undefined" && formData.jobAllocatedUsers[staff] && formData.jobAllocatedUsers[staff].toString() != "type") {
          let allIds = staff.split("_");
          var user_license = [];
          if (formData.jobAllocatedUsers.type) {
            Object.keys(formData.jobAllocatedUsers.type).map(licence => {
              let licenceIds = licence.split("_");
              if (allIds && allIds[0] && licenceIds[0] && allIds[1] && formData.jobAllocatedUsers.type[licence] && licenceIds && licenceIds[1] && licenceIds[1].toString() === allIds[1].toString() && allIds[0].toString() === licenceIds[0].toString()) {
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
          certificates.push(index);
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
    if (formData.note) {
      finalFormData.note = formData.note;
    }
    finalFormData.job_doc_number = this.state.job_doc_number;
    finalFormData.quote_id = this.state.quote_id;
    finalFormData.service_agents = service_agents;
    finalFormData.job_allocated_users = job_allocated_users;
    finalFormData.certificates = certificates;
    finalFormData.schedules = schedules;

    let job_doc_tasks = [];
    if (this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 && this.props.scopeDocsDetails[0].sites) {
      this.props.scopeDocsDetails[0].sites.forEach(site => {
        if (site && site.tasks && site.tasks.length > 0) {
          site.tasks.forEach(task => {
            if (task) {
              if (task.service_agent_id === null || task.service_agent_id === undefined) {
                if (formData.serviceAgents && formData.serviceAgents.length > 0) {
                  var taskServiceAgent = service_agents.find(item => item.task_id == task.id);
                  if (!taskServiceAgent) {
                    service_agent_flag = false;
                  }
                } else {
                  service_agent_flag = false;
                }
              }
              if (task.id) {
                job_doc_tasks.push(task.id);
              }
            }
          })
        }
      })
    }

    finalFormData.job_doc_tasks = job_doc_tasks;
    if (service_agent_flag) {
      this.props.jobDocAction.createJobDoc(finalFormData, this.props.scopeDocsDetails[0].id).then(res => {
        this.setState({ saved: false })
        if (res.job_doc_number) {
          this.setState({ job_doc_number: res.job_doc_number })
        }
        notification.success({
          message: Strings.success_title,
          description: res && res.message ? res.message : "Job doc created successfully",
          onClick: () => { },
          className: 'ant-success'
        });

        if (res.job_doc_number) {
          this.props.history.push({ pathname: './showJobDoc', state: { job_doc_number: res.job_doc_number } });
        }
      }).catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
    } else {
      notification.error({
        message: Strings.error_title,
        description: Strings.service_agent_not_assign,
        onClick: () => { },
        className: 'ant-error'
      });
    }
  }

  // popover add SA
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
              description: message ? message : Strings.generic_error,
              onClick: () => { },
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
              description: message ? message : Strings.generic_error,
              onClick: () => { },
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
          <tr className="up-jd-scop">
            <th>{Strings.job_staff_name_position}</th>
            {this.props.licenceType && this.props.licenceType.length > 0 ? this.props.licenceType.map(licence => {
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
              {this.props.licenceType && this.props.licenceType.length > 0 ? this.props.licenceType.map(licence => {
                if (user && user.organisation_user && user.organisation_user.user_licences && user.organisation_user.user_licences.length > 0) {
                  let licienceObj = user.organisation_user.user_licences.filter(item => licence.id == item.type);
                  if (licienceObj && licienceObj.length > 0) {
                    return <td className="sli-name-chk">
                      <FormSection name="type"><Field name={`${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}_${licienceObj[0].id}`} label={licienceObj && licienceObj[0].license_type_name ? licienceObj[0].license_type_name : ''} component={CustomCheckbox}
                        onChange={(value) => { this.handlesingleLicenceCheck(value, `${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}`) }} />
                      </FormSection>
                      <div className="stff-action-bnt">
                        <a href="#" onClick={() => this.downloadImage(licienceObj[0].license_type_name, licienceObj[0].image)}><i className="material-icons">get_app</i></a>
                        <button type="button" className="normal-bnt" onClick={() => this.viewLicienceDetails(licienceObj[0])}><i className="material-icons">remove_red_eye</i></button></div>
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
            <Button onClick={this.handleAddFilterState} ><i className="material-icons">add</i> Add Staff</Button>
          </Popover>
        </div>
      </Panel> : ''
      }
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

  disableScheduleDate = (current) => {
    var startDate = moment(new Date());
    startDate = startDate.subtract(1, "days");
    return current && current.valueOf() < startDate;
  }

  renderScheduleMembers = ({ fields, meta: { error, submitFailed } }) => {

    var startDate = this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 && this.props.scopeDocsDetails[0] && this.props.scopeDocsDetails[0].sites && this.props.scopeDocsDetails[0].sites[0] && this.props.scopeDocsDetails[0].sites[0].tasks && this.props.scopeDocsDetails[0].sites[0].tasks[0] && this.props.scopeDocsDetails[0].sites[0].tasks[0].start_date; //getting first start_date of first site's first task

    startDate = moment(startDate)._d;

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
              <Field name={`${member}.start`} placeholder="" component={CustomTimePicker} />
            </fieldset>
          </td>
          <td>
            <fieldset className="sf-form">
              <Field name={`${member}.finish`} component={CustomTimePicker} />
            </fieldset>
          </td>
          <td>
            <fieldset className="sf-form">
              <Field name={`${member}.scope`} placeholder={Strings.scope_jobd} type="text" component={customInput} />
            </fieldset>
          </td>
          <td>
            <fieldset className="sf-form">
              <Field name={`${member}.area`} placeholder={Strings.area_jobd} type="text" component={customInput} />
            </fieldset>
          </td>
          <td>
            <fieldset className="sf-form">
              <Field name={`${member}.site_requirements`} placeholder={Strings.site_requirements_jobd} type="text" component={customInput} />
            </fieldset>
          </td>
          <td><button className='delete-bnt' type='button' onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></td>
        </tr>
      ))}
      <div className="btn-hs-icon sm-bnt bnt-error mt-4">
        <button className="bnt bnt-normal" type="button" onClick={() => fields.push({ date: startDate })}>Add Schedule</button>
        {submitFailed && error && <span className="error-input">{error}</span>}
      </div>
    </>)
  }

  render() {
    var scopeDoc = this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 ? this.props.scopeDocsDetails[0] : {};
    const { handleSubmit, serviceAgents, formValues, organization } = this.props;
    return (
      <div className="sf-page-layout">
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() =>
              // goBack(this.props)
              goBackBrowser(this.props)
            } />
            {
              mapRouteToTitle[this.props.location.pathname]
                ? mapRouteToTitle[this.props.location.pathname]
                : Strings.job_docs_txt
            }
          </h2>
          <div className="sf-steps-status sf-step-4">
            <div className="sf-steps-row">
              <div className={this.state.serviceDetails ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="material-icons">build</i></div>
                <span>Service Details</span>
              </div>
              <div className={this.state.staffLicenceDetails ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="material-icons">people</i></div>
                <span>Staff Licences/Inductions</span>
              </div>
              <div className={this.state.certificateDetails ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="fa fa-briefcase"></i></div>
                <span>Insurance Certificates & SWMS</span>
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
        {/* inner header  */}

        <div className="main-container">
          <div className="row">
            <div className="col-lg-12">
              <form onSubmit={handleSubmit(this.onSubmit)}>
                <div className="sf-card-wrap">

                  <div className="sf-card scope-v-value">
                    <div className="sf-card-head d-flex justify-content-between align-items-start">
                      <div className="doc-vlue">{Strings.quote_txt}
                        <span>{scopeDoc && scopeDoc.quote_number ? scopeDoc.quote_number : ''} <i class="material-icons">lock</i></span>
                        <div className="quote doc-vlue">{Strings.job_document_txt} <span>{this.state.job_doc_number}</span></div>
                        <div className="quote view-jd-history vjh-items-box">
                          <Collapse className="show-frquency-box" bordered={false} accordion
                            expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                            <Panel header="View Job Doc History" key="1">
                              {this.state.associated_job_doc_num && this.state.associated_job_doc_num.length > 0 ? this.state.associated_job_doc_num.map(item => {
                                return <div className="vjh-items"><button className="normal-bnt" type="button" onClick={() => this.props.history.push({ pathname: '/dashboard/showJobDoc', state: { job_doc_number: item } })}>{item ? item : ''}</button></div>
                              }) : "No Data Found"}
                            </Panel>
                          </Collapse>
                        </div>
                      </div>
                      <strong className="doc-v-usr"><span>{this.loginUserRoleName} : </span>{this.loginUserName}</strong>
                    </div>
                  </div>

                  {/* Contractor Details */}
                  <div className="sf-card mt-4">
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
                  <FormSection name="serviceAgents">
                    <div className="sf-card mt-4">
                      <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.job_service_details}</h2>
                        <div className="info-btn disable-dot-menu">
                          <Dropdown className="more-info" disabled>
                            <i className="material-icons">more_vert</i>
                          </Dropdown>
                        </div>
                      </div>

                      {scopeDoc && scopeDoc.sites && scopeDoc.sites.length > 0 ? scopeDoc.sites.map(site => {
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
                              {site.tasks && site.tasks.length > 0 ? site.tasks.map(task => {
                                return <tr>
                                  <td>
                                    <div className="view-text-value">
                                      <label>{task && task.task_name ? task.task_name : ''}</label>
                                      <span>{task && task.description ? task.description : ''}</span>
                                    </div>
                                  </td>
                                  <td>
                                    <div className="view-text-value" id="sfPopOver">
                                      <label>{Strings.job_service_agent}</label>
                                      <span>{task && task.organisation && task.organisation.name ? task.organisation.name :
                                        formValues.serviceAgents &&
                                          serviceAgents.find(agent => agent.id == formValues.serviceAgents[task.id]) ?
                                          <>{serviceAgents.find(agent => agent.id == formValues.serviceAgents[task.id]).name}</> :
                                          task.service_agent_id && serviceAgents.find(agent => agent.id == task.service_agent_id)
                                            ? <>{serviceAgents.find(agent => agent.id == task.service_agent_id).name}</> :
                                            <Popover className="bnt-simple add-sa-bnt"
                                              placement="bottomRight"
                                              content={this.addServiceAgent(task, this.props.serviceAgents)}
                                              trigger="click"
                                              getPopupContainer={() => document.getElementById('sfPopOver')}
                                            >
                                              <Button className="normal-bnt">Add SA</Button>
                                            </Popover>}</span>
                                    </div>
                                  </td>
                                </tr>
                              }) : ''}
                            </table>
                          </div>
                        </div>

                      }) : ''}
                    </div>
                  </FormSection>
                  
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
                        <ScrollArea className="sf-scroll-width" speed={1} smoothScrolling={true} vertical={false}>
                          {this.state.serviceAgentArray && this.state.serviceAgentArray.length > 0 ? this.state.serviceAgentArray.map((serviceAgent, index) => {
                            return <FieldArray name="users" component={this.renderStaffMembers} index={index} />
                          }) : ''}
                        </ScrollArea>
                      </div>
                    </div>
                  </FormSection>
                  {/* Insurance Certificates & SWMS */}
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
                            if (certificate && certificate.name && certificate.s3FileUrl);
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
                                    <a className="sli-download" href="#" onClick={() => this.downloadImage(certificate.name, certificate.s3FileUrl)}><i className="material-icons">publish</i></a>
                                  </div>
                                </div>
                              </div>
                            </div>
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
                      {/* <FormSection name="schedule"> */}
                      <div className="jd-staff-table">
                        <table className="add-user-table table">
                          <tr>
                            <th>{Strings.job_date}</th>
                            <th>{Strings.job_start} </th>
                            <th>{Strings.job_finish}</th>
                            <th>{Strings.job_scope}</th>
                            <th>{Strings.job_area}</th>
                            <th>{Strings.job_site_requirements}</th>
                            <th></th>
                          </tr>
                          <FieldArray name="schedule" component={this.renderScheduleMembers} />
                        </table>
                      </div>
                      {/* </FormSection> */}
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
                </div>
                {/* save and preview button */}
                <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                  <div className="btn-hs-icon">
                    <button type="button" className="bnt bnt-normal" onClick={this.handlePreviewClick} disabled={this.state.saved}>
                      <i class="material-icons">remove_red_eye</i> {Strings.preview_and_email_btn}</button>
                  </div>
                  <div className="btn-hs-icon">
                    <button type="submit" className="bnt bnt-active" disabled={!this.state.saved}>
                      <i class="material-icons">save</i> {Strings.save_btn}</button>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>

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
            job_doc_number={this.state.job_doc_number}
            formValues={this.props.formValues}
            history={this.props.history}
            handleCancel={this.handleCancel}
            previewCertificates={this.state.previewCertificates}
            previewStaffList={this.state.previewStaffList}
          />
        </Modal>

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

      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    scopeDocsDetails: state.scopeDocs.scopeDocsDetails,
    serviceAgents: state.organization.serviceAgents,
    formValues: state.form.createJobDocs && state.form.createJobDocs.values ? state.form.createJobDocs.values : {},
    organization: state.organization.organizationDetails,
    licenceType: state.profileManagement.licenceType
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    accessControlAction: bindActionCreators(accessControlAction, dispatch),
    jobDocAction: bindActionCreators(jobDocAction, dispatch),
    profileManagementActions: bindActionCreators(profileManagementActions, dispatch),
    organisationAction: bindActionCreators(organisationAction, dispatch)
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'createJobDocs', enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(CreateJobDocs)