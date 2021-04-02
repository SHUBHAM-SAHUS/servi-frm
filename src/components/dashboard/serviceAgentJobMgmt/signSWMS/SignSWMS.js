import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Strings } from '../../../../dataProvider/localize'
import { withRouter } from 'react-router-dom'
import { Upload, Icon, Modal, Dropdown, Calendar, Select, Carousel, Collapse, TimePicker, Radio, Popover, Button, Steps, Divider, notification } from 'antd';
import { bindActionCreators, compose } from 'redux';
import { Field, reduxForm, FieldArray } from 'redux-form';
import { goBack, getStorage, handleFocus, goBackBrowser } from '../../../../utils/common';
import PreviewSignSWMS from './PreviewSignSWMS';
import HistorySignSWMS from './HistorySignSWMS';
import { SignCanvas } from '../../../common/SignCanvas';
import * as actions from '../../../../actions/SAJobMgmtAction';
import { ADMIN_DETAILS, USER_NAME } from '../../../../dataProvider/constant';
import * as userAction from '../../../../actions/organizationUserAction';
import { ERROR_NOTIFICATION_KEY } from '../../../../config';
import { startSipnner } from '../../../../utils/spinner';

const Option = Select.Option;
const mapRouteToTitle = {
  '/dashboard/signSWMS': 'SignSWMS'
}

// Collapse

const { Panel } = Collapse;


export class SignSWMS extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      hisVisible: false,
      selectedMember: false,
      allStaffList: [],
      versionNo: 0,
    };
  }

  // Job Report Preview 
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = e => {
    this.setState({
      visible: false,
    });
    this.emailToClient();
  };

  handleCancel = e => {
    this.setState({
      visible: false,
    });
  };
  // History modal function
  showHistoryModal = (version) => {
    this.props.action.getSWMSHistory(this.props.jobDetails.job_number, version).then(() => this.setState({
      hisVisible: true, versionNo: version
    }))
  };

  hisHandleCancel = e => {
    this.setState({
      hisVisible: false, versionNo: 0
    });
  };

  onSaveSignature = (signDetails, file) => {

    signDetails.file_index = 0;
    var finalFormData = new FormData();
    finalFormData.append("signed_users", JSON.stringify([signDetails]))
    finalFormData.append("job_id", this.props.jobDetails.id);
    finalFormData.append("sign_files", file);
    this.postSignature(finalFormData);

  }
  emailToClient = () => {
    startSipnner(this.props.dispatch);
    this.props.history.push({ pathname: './emailSWMSSign', state: this.state.allStaffList })
  }


  postSignature = (formData) => {
    this.props.action.addJobSWMSSign(formData, this.props.jobDetails.job_number)
      .then((flag) => {
        this.props.reset();
        notification.success({
          message: Strings.success_title,
          description: flag,
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

  lockSignature = () => {
    this.props.action.lockSignatureProcess({ job_number: this.props.jobDetails.job_number })
      .then((flag) => {
        this.props.reset();
        notification.success({
          message: Strings.success_title,
          description: flag,
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

  addSignMember = () => {
    Modal.confirm({
      content:
        <div id="stickDrop" className="sf-form select-wibg">
          <label>Select Member</label>
          <Select
            placeholder={"Select member to add"}
            suffixIcon={(<Icon type="caret-down" />)}
            onChange={(value) => { this.setState({ selectedMember: value }) }}
            getPopupContainer={() => document.getElementById('stickDrop')}>
            {this.props.jobMembers ? this.props.jobMembers.map((item) => (<Option value={item.user_name}>
              {"N: " + item.first_name + " P: " + item.role_name}</Option>)) : null}
          </Select>
        </div>,
      onOk: () => {

        if (this.props.swmsSignDetails[0] && this.props.swmsSignDetails[0].job_swms_sign_offs &&
          this.props.swmsSignDetails[0].job_swms_sign_offs.length > 0) {

        } else {
          this.postSignature({
            job_id: this.props.jobDetails.id, job_number: this.props.jobDetails.job_number,
            signed_users: [{ user_name: JSON.parse(getStorage(USER_NAME)), file_index: "" }]
          })
        }
        this.postSignature({
          job_id: this.props.jobDetails.id, job_number: this.props.jobDetails.job_number,
          signed_users: [{ user_name: this.state.selectedMember, file_index: "" }]
        })
      },
      onCance: () => {

      },
    });
  }

  uniqueBy(arr, key) {
    const arrayUniqueByKey = [...new Map(arr.map(item =>
      [item[key], item])).values()];
    return arrayUniqueByKey.length > 0 ? arrayUniqueByKey : []
  }

  componentDidMount() {
    this.props.action.getSWMSSignDetails(this.props.jobDetails.job_number);
    this.props.action.getJobMembers(this.props.jobDetails.id).then((flag) => {
      if (this.props.jobMembers.length > 0) {
        var distinctStaffList = this.uniqueBy(this.props.jobMembers, 'user_name')
        console.log(distinctStaffList)
        this.setState({
          allStaffList: distinctStaffList
        })
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

    // this.props.userAction.getOrganizationUsers(JSON.parse(getStorage(ADMIN_DETAILS)) ?
    //   JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null);

  }

  render() {
    const { jobDetails, swmsSignDetails, taskSWMS, swmsDoc, jobMembers, versionCount } = this.props;
    console.log("swmsSignDetails>>>>>> ", swmsSignDetails)
    const sites = jobDetails.quote && jobDetails.quote.scope_doc && jobDetails.quote.scope_doc.scope_docs_sites;
    var activityArray = [];
    taskSWMS.forEach(swms => {
      if (swms.areas) {
        swms.areas.forEach(area => {
          if (area.swms_doc)
            activityArray = [...activityArray, ...area.swms_doc];
        })
      }
    });
    const versionArray = []
    for (let i = 1; i <= versionCount; i++) {
      versionArray.push(i);
    }

    let disableLockSignButton = false;
    try {
      if (swmsSignDetails && swmsSignDetails.length && swmsSignDetails[0].job_swms_sign_offs &&
        swmsSignDetails[0].job_swms_sign_offs.length > 0) {
        for (let jobSwms of swmsSignDetails[0].job_swms_sign_offs) {
          if (!jobSwms.sign) {
            disableLockSignButton = true;
            break;
          }
        }
      }
    } catch (err) {

    }



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
                : Strings.sign_swms
            }
          </h2>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <form>
            <div className="sf-card-wrap">
              <div className="sf-card scope-v-value mb-4">
                <div className="sf-card-head">
                  <div className="quote view-jd-history sf-page-history mt-0">
                    <Collapse className="show-frquency-box" bordered={false} accordion
                      expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                      <Panel header="View History" key="1">
                        {
                          versionArray.map(i => <div className="history-lists">
                            <button type="button" class="normal-bnt" onClick={() => this.showHistoryModal(i)}>Sign SWMS Version {i}</button>
                          </div>)
                        }
                      </Panel>
                    </Collapse>
                  </div>
                </div>
              </div>
              {/* Safe Work Method Statement (SWMS) */}
              <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.safe_work_method_statement_swms}</h2>
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>
                <div className="sf-card-body">
                  <div className="row">
                    <div className="col-md-10">
                      <h3 className="sf-big-hd">{jobDetails.org_details && jobDetails.org_details.name}</h3>
                      <div className="data-v-row">
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.abn}</label>
                            <span>{jobDetails.org_details && jobDetails.org_details.abn_acn}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.phone}</label>
                            <span>{jobDetails.org_details && jobDetails.org_details.contact_person_phone}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.email_txt}</label>
                            <span>{jobDetails.org_details && jobDetails.org_details.contact_person_email}</span>
                          </div>
                        </div>
                        <div className="data-v-col">
                          <div className="view-text-value">
                            <label>{Strings.address_txt}</label>
                            <span>{jobDetails.org_details && jobDetails.org_details.address}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-2">
                      <div className="co-logo">
                        {jobDetails.org_details && jobDetails.org_details.client_logo ? <img src={jobDetails.org_details.client_logo} /> : null}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Site Details */}
              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.site_details}</h2>
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>
                <div className="sf-card-body sign-swms-wrap">

                  <Collapse className="sign-swms-col" defaultActiveKey={['0']}>
                    {sites && sites.map((site, index) =>
                      <Panel className="sign-swms-items" header={site.site.site_name} key={index}>
                        <div className="data-v-row">
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.site_name}</label>
                              <span>{site.site.site_name}</span>
                            </div>
                          </div>
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.address_txt}</label>
                              <span>{site.site.street_address}</span>
                            </div>
                          </div>
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>{Strings.swms_no}</label>
                              <span>{}</span>
                            </div>
                          </div>
                        </div>
                        <div className="normal-txt brt">
                          <span>All person involved in the works must have the SWMS explained and communicated to them prior to start of works.</span>
                        </div>
                      </Panel>
                    )}

                  </Collapse>
                </div>
              </div>

              {/* Staff Details */}
              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.staff_details}</h2>
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>
                <div className="sf-card-body">
                  <div className="staff-list-details">

                    <div className="site-name-list">
                      <div className="task-name-list">
                        <div className="task-table">
                          <div className="sf-c-table">
                            <div className="tr">
                              <span className="th">Name</span>
                              <span className="th">Position </span>
                              <span className="th">Note</span>
                            </div>
                            {this.state.allStaffList.length > 0 ?
                              this.state.allStaffList.map(staff => {
                                return <div className="tr">
                                  <span className="td">{staff && staff.first_name ? staff.first_name : ''}</span>
                                  <span className="td">{staff && staff.role_name ? staff.role_name : ''}</span>
                                  <span className="td">All person involved in the works must have the SWMS explained and communicated to them.</span>
                                </div>
                              }) : null}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* {jobDetails.quote
                      && jobDetails.quote.scope_doc
                      && jobDetails.quote.scope_doc.scope_docs_sites
                      && jobDetails.quote.scope_doc.scope_docs_sites.length > 0 ? jobDetails.quote.scope_doc.scope_docs_sites.map(site => {
                        return <div className="site-name-list">
                          <h3 className="site-title">{site.site && site.site.site_name}</h3>
                          {site && site.site && site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map((task, taskIndex) => {
                            return <div className="task-name-list">
                              <h3 className="task-title">{task && task.task_name}</h3>
                              <div className="task-table">
                                <div className="sf-c-table">
                                  <div className="tr">
                                    <span className="th">Name</span>
                                    <span className="th">Position </span>
                                    <span className="th">Note</span>
                                  </div>
                                  {task && task.job_schedules && task.job_schedules.length > 0 ? task.job_schedules.map((job_schedule, job_schedule_index) => {
                                    return <>
                                      {job_schedule && job_schedule.job_schedule_shifts && job_schedule.job_schedule_shifts.length > 0 ? job_schedule.job_schedule_shifts.map((shift, index) => {
                                        return <>
                                          {shift && shift.job_allocated_users && shift.job_allocated_users.length > 0 ? shift.job_allocated_users.map(user => {
                                            return <>{user ?

                                              <div className="tr">
                                                <span className="td">{user && user.first_name ? user.first_name : ''}</span>
                                                <span className="td">{user && user.role_name ? user.role_name : ''}</span>
                                                <span className="td">All person involved in the works must have the SWMS explained and communicated to them.</span>
                                              </div> : null} </>
                                          }) : null}
                                        </>
                                      }) : null}
                                    </>
                                  }) : null}
                                </div>
                              </div>
                            </div>
                          }) : null}
                        </div>
                      }) : null} */}
                  </div>
                </div>
              </div>

              {/* SWMS details */}
              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.swms_txt}</h2>
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>
                <div className="sf-card-body">
                  <Collapse className="swms-content-list" defaultActiveKey={[0]}>
                    {taskSWMS && taskSWMS.length > 0 ? taskSWMS.map((task_swms, index) => {
                      return <Panel className="swms-co-items" header={task_swms && task_swms.name ? task_swms.name : ''} key={index}>
                        <Collapse className="swms-content-list" defaultActiveKey={[0]}>
                          {task_swms && task_swms.areas && task_swms.areas.length > 0 ? task_swms.areas.map((area, index) => {
                            return <Panel className="swms-co-items" header={area && area.area_name ? area.area_name : ''} key={index}>
                              <table className="table swms-table">
                                <tr>
                                  <th>SWMS Activity</th>
                                  <th>PPE</th>
                                  <th>Tool Type</th>
                                  <th>High Risk Work</th>
                                  <th>Chemicals</th>
                                </tr>
                                {/* {area} */}
                                <tr className="swms-sr-dtl swms-doc-lists">
                                  <td>
                                    {area && area.swms_doc && area.swms_doc.length > 0 ? area.swms_doc.map(swms_doc => {
                                      return <span>{swms_doc && swms_doc.activity ? swms_doc.activity : ''}</span>
                                    }) : ''}

                                  </td>
                                  <td>
                                    {area && area.ppe && area.ppe.length > 0 ? area.ppe.map(ppe => {
                                      return <span>{ppe && ppe.name ? ppe.name : ''}</span>
                                    }) : ''}
                                  </td>
                                  <td>
                                    {area && area.tool_type && area.tool_type.length > 0 ? area.tool_type.map(tool_type => {
                                      return <span>{tool_type && tool_type.name ? tool_type.name : ''}</span>
                                    }) : ''}
                                  </td>
                                  <td>
                                    {area && area.hig_risk_work && area.hig_risk_work.length > 0 ? area.hig_risk_work.map(hig_risk_work => {
                                      return <span>{hig_risk_work && hig_risk_work.name ? hig_risk_work.name : ''}</span>
                                    }) : ''}
                                  </td>
                                  <td>
                                    {area && area.chemical && area.chemical.length > 0 ? area.chemical.map(chemical => {
                                      return <span>{chemical && chemical.name ? chemical.name : ''}</span>
                                    }) : ''}
                                  </td>
                                </tr>
                              </table>
                            </Panel>
                          }) : ''}
                        </Collapse>
                      </Panel>
                    }) : ''}
                  </Collapse>
                </div>
              </div>

              {/* SWMS Document */}
              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.swms_document}</h2>
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>
                <div className="sf-card-body">
                  {/* without table view date */}
                  {/* <div className="swms-document">
                    <h3 className="swms-doc-title">
                      Activity
                      <span>Break the job down into steps</span>
                    </h3>
                    <div className="swms-act-list">
                      {activityArray.map(activity => <span>{activity.activity}</span>)}
                    </div>
                  </div> */}

                  {/* With table view data */}
                  <div className="swms-document swms-doc-new-tbl">
                    <table className="swms-doc-table">
                      <tr>
                        <th rowSpan="2">Activity
                          <span>Break the job down into steps</span>
                        </th>
                        <th rowSpan="2">Potential Safety and<br /> Environmental Hazards
                          <span>What can go wrong</span>
                        </th>
                        <th colSpan="3">Risk Rating</th>
                        <th rowSpan="2">Control Measures</th>
                        <th colSpan="3">Risk Rating After Controls</th>
                        <th rowSpan="2">Person Responsible
                          <span>To ensure management method applied</span>
                        </th>
                      </tr>
                      <tr className="sub-th-vlue">
                        <th>C</th>
                        <th>P</th>
                        <th>R</th>
                        <th>C</th>
                        <th>P</th>
                        <th>R</th>
                      </tr>
                      {/* looping area */}
                      {swmsDoc && swmsDoc.map(doc =>
                        <tr>
                          <td>
                            {/* <div className="swms-act-list">
                              {activityArray.map(activity => <span>{activity.activity}</span>)}
                            </div> */}
                            {doc.activity}
                          </td>
                          <td>{doc.hazard}</td>
                          <td>{doc.consequence_before_control_name}</td>
                          <td className="std-sty">{doc.likelihood_before_control_name}</td>
                          <td className="std-sty">{doc.risk_before_control}</td>
                          <td>{doc.control_measures}</td>
                          <td>{doc.consequence_after_control_name}</td>
                          <td className="std-sty">{doc.likelihood_after_control_name}</td>
                          <td className="std-sty">{doc.risk_after_control}</td>
                          <td>{doc.person_responsible}</td>
                        </tr>
                      )}
                      {/* loop end area */}
                    </table>
                  </div>
                </div>
              </div>

              {/* Signatures */}
              <div className="sf-card mt-4">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                  <h2 className="sf-pg-heading">{Strings.signatures}</h2>
                  <div className="info-btn disable-dot-menu">
                    <Dropdown className="more-info" disabled>
                      <i className="material-icons">more_vert</i>
                    </Dropdown>
                  </div>
                </div>
                <div className="sf-card-body">
                  <div className="normal-txt mt-2">
                    <span>This SWMS has been developed through consultation with our agentmembers and has been read & signed by all agentmembers involved with this activity. </span>
                  </div>
                  {/* sign here */}
                  {this.props.swmsSignDetails[0] && this.props.swmsSignDetails[0].job_swms_sign_offs &&
                    swmsSignDetails[0].job_swms_sign_offs.length > 0 ?
                    this.props.swmsSignDetails[0].job_swms_sign_offs.map(sign => {
                      if (sign.sign)
                        return <div className="signature-box">
                          <span className="sig-title">{sign.user_first_name + " " + (sign.user_last_name ? sign.user_last_name : "") + ' (' + sign.user_role_name + ')'}</span>
                          <div className="upload-ur-sign">
                            <div className="sign-box">
                              <img src={sign.sign} alt="SF logo" />
                            </div>
                          </div>
                        </div>
                      else if (sign.user_name == JSON.parse(getStorage(ADMIN_DETAILS)).user_name)
                        return <SignCanvas signDetail={sign} onSave={this.onSaveSignature}></SignCanvas>
                      else
                        return <div className="signature-box">
                          <span className="sig-title">{sign.user_first_name + " " + (sign.user_last_name ? sign.user_last_name : "") + ' (' + sign.user_role_name + ')'}</span>
                          <div className="upload-ur-sign">
                            <div className="sign-box">

                            </div>
                          </div>
                        </div>
                    }) :
                    <SignCanvas signDetail={{
                      user_name: JSON.parse(getStorage(ADMIN_DETAILS)).user_name
                      , user_first_name: JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
                        (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : "",
                      user_role_name: JSON.parse(getStorage(ADMIN_DETAILS)).role.role_name
                    }}
                      onSave={this.onSaveSignature}></SignCanvas>
                  }



                  {swmsSignDetails[0] && swmsSignDetails[0].lock_swms_sign_off === 0 && this.props.location.state ? <div className="add-more-memer">
                    <div className="all-btn d-flex justify-content-center mt-4 sc-doc-bnt">
                      <div className="btn-hs-icon sm-bnt">
                        <button type="button" className="bnt bnt-active" onClick={this.addSignMember}>{Strings.add_member}</button>
                      </div>
                      <div className="btn-hs-icon sm-bnt">
                        <button type="button" className="bnt bnt-active" onClick={this.lockSignature} disabled={disableLockSignButton}>{Strings.lock_signature_process}</button>
                      </div>
                    </div>
                  </div> : null}
                </div>
              </div>
            </div>
            {this.props.location.state ?
              <div className="all-btn d-flex justify-content-end mt-4 sc-doc-bnt">
                <div className="btn-hs-icon">
                  <button type="button" class="bnt bnt-normal" onClick={this.emailToClient}>
                    <i class="material-icons">mail_outline</i> {Strings.email_to_client}</button>
                </div>
                <div className="btn-hs-icon">
                  <button type="button" class="bnt bnt-normal" onClick={this.showModal}>
                    <i class="material-icons">remove_red_eye</i> {Strings.preview_btn}</button>
                </div>
              </div> : null}
          </form>
        </div>

        {/* Job Report Modal  */}
        <Modal
          title="Basic Modal"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          // footer={null}
          okText={Strings.email_job_docs_bnt}
          width="100%"
          className="job-doc-preview"
        >
          <PreviewSignSWMS allStaffList={this.state.allStaffList} />

        </Modal>

        {/* history popup  */}
        <Modal
          title="Basic Modal"
          visible={this.state.hisVisible}
          okButtonProps={{ style: { display: 'none' } }}
          width="100%"
          className="job-doc-preview"
          onCancel={this.hisHandleCancel}>
          <HistorySignSWMS versionNo={this.state.versionNo} />
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    jobDetails: state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] ?
      state.sAJobMgmt.jobDetails.job_details[0] : {},
    swmsSignDetails: state.sAJobMgmt.swmsSignDetails,
    users: state.organizationUsers.users,
    taskSWMS: state.sAJobMgmt.jobDetails.task_swms ?
      state.sAJobMgmt.jobDetails.task_swms : [],
    jobMembers: state.sAJobMgmt.jobMembers,
    swmsDoc: state.sAJobMgmt.jobDetails.swms_document ? state.sAJobMgmt.jobDetails.swms_document : [],
    versionCount: state.sAJobMgmt.swmsVersion
  }
}
const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    userAction: bindActionCreators(userAction, dispatch)
  }
}

export default compose(
  withRouter,
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'signSWMS',
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(SignSWMS)
