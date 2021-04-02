import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';
import { Strings } from '../../../dataProvider/localize';
import { getStorage } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import TaskFileViews from '../job/taskFilesView';
import { Modal } from 'antd';
import moment from 'moment';
import ReactHtmlParser from 'react-html-parser';

class HistoryScopeDoc extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      sites: []
    }
    this.quoteAmt = this.props.quoteAmt
    this.currentOrg = JSON.parse(getStorage(ADMIN_DETAILS)).organisation;
  }

  getSSDAreas = (areas) => {
    if (areas.length > 0) {
      const str = areas.map(area => {
        return area.area_name
      })
      const jointString = str.join(', ');
      return jointString;
    }
    return ''
  }

  cancelQuotePreview = () => {
    this.props.cancelQuotePreview()
  }

  static getDerivedStateFromProps(props, state) {
    state.sites = props.sites
  }

  calculateEquipmentAmount = () => {
    if (this.props.versionHistory.scope_doc_data.scope_docs[0].quotes[0].equipments.length > 0) {
      var amount = 0;
      for (let i = 0; i < this.props.versionHistory.scope_doc_data.scope_docs[0].quotes[0].equipments.length; i++) {
        amount = amount + this.props.versionHistory.scope_doc_data.scope_docs[0].quotes[0].equipments[i].equipment_cost
      }
      return amount
    }
  }

  handleTaskFileView = (files, e) => {
    e.stopPropagation();
    if (files && files.length > 0) {
      this.setState({
        viewTaskFiles: true, taskFiles: files
      });
    }
  }

  handleCancel = () => {
    this.setState({
      viewTaskFiles: false,
      taskFiles: [],
    });
  }

  render() {
    const { versionHistory } = this.props;
    const currentVersionDetails = versionHistory && versionHistory.scope_doc_data && versionHistory.scope_doc_data.scope_docs && versionHistory.scope_doc_data.scope_docs[0]
    const sitesList = (currentVersionDetails && currentVersionDetails.sites) ? currentVersionDetails.sites : [];
    const equipmentsList = currentVersionDetails.quotes && currentVersionDetails.quotes[0] && currentVersionDetails.quotes[0].equipments && currentVersionDetails.quotes[0].equipments.length > 0 ? currentVersionDetails.quotes[0].equipments : []
    const quoteDetails = currentVersionDetails && Array.isArray(currentVersionDetails.quotes) && currentVersionDetails.quotes[0]

    return (
      <div className="sf-jobdoc-preview sf-history-preview">
        <div className="sf-card-wrap">
          <div className="jdp-big-cntr-head">
            <h1>{`${currentVersionDetails.scope_doc_code} - ${versionHistory.version}`}</h1>
          </div>

          <div className="sf-card mt-4">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.client_details}</h2>
            </div>

            <div className="sf-card-body">
              <div className="row">
                <div className={currentVersionDetails.quotes
                  && currentVersionDetails.quotes[0].admin_approve_status === 0 ?
                  "col-md-9 col-sm-9 col-lg-12" : "col-md-9 col-sm-9"}>
                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.name_txt}</label>
                        <span>{currentVersionDetails.client ? currentVersionDetails.client.name : ''}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.org_pri_person}</label>
                        <span>{currentVersionDetails.client_person ? currentVersionDetails.client_person.name : ''}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.phone_no_txt}</label>
                        <span>{currentVersionDetails.client_person ? currentVersionDetails.client_person.phone : ''}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.email_txt}</label>
                        <span>{currentVersionDetails.client_person ? currentVersionDetails.client_person.email : ''}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.address_txt}</label>
                        <span>{currentVersionDetails.client ? currentVersionDetails.client.address : ''}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.abn_txt}</label>
                        <span>{currentVersionDetails.client ? currentVersionDetails.client.abn_acn : ''}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.quote_request_by}</label>
                        <span>{currentVersionDetails.client_person ? moment(currentVersionDetails.client_person.quote_requested_by).format('DD-MM-YYYY') : ''}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.job_name}</label>
                        <span>{currentVersionDetails.job_name ? currentVersionDetails.job_name : ''}</span>
                      </div>
                    </div>

                    {
                      currentVersionDetails.quotes && currentVersionDetails.quotes[0] && currentVersionDetails.quotes[0].quote_po_no
                        ? <>
                          <div className="data-v-col">
                            <div className="view-text-value">
                              <label>PO Number</label>
                              <span>{currentVersionDetails.quotes[0].quote_po_no}</span>
                            </div>
                          </div>
                        </>
                        //                        : currentVersionDetails.quotes &&
                        //                          currentVersionDetails.quotes[0].admin_approve_status === 3
                        //                         && currentVersionDetails.quotes[0].client_approve_status === 3
                        //                          ? <div className="data-v-col po-num-txt d-flex">
                        //                            <div className="view-text-value">
                        //                              <div class="sf-form form-group">
                        //                                <label>PO Number</label>
                        //                                <input type="text" onChange={(event) => this.setState({ poNumber: event.target.value })} />
                        //                             </div>
                        //                            </div>
                        //                          </div>
                        : null
                    }
                    {
                      currentVersionDetails.quotes && currentVersionDetails.quotes[0] && currentVersionDetails.quotes[0].po_file
                        ? <div className="data-v-col">
                          <div className="view-text-value">
                            <label>PO Document</label>
                            <a href={currentVersionDetails.quotes && currentVersionDetails.quotes[0] &&
                              currentVersionDetails.quotes[0].po_file} download
                              className="normal-bnt" target='_blank'>
                              <i class="material-icons">get_app</i>
                              <span className="edit-image-logo">{"Open document"}</span></a>
                          </div></div> :
                        currentVersionDetails.quotes &&
                          currentVersionDetails.quotes[0].admin_approve_status === 3
                          && currentVersionDetails.quotes[0].client_approve_status === 3
                          ? <div className="data-v-col no-border">
                            <div className="view-text-value">
                              <div class="sf-form form-group">
                                <label>PO Document</label>
                              </div>
                            </div>
                          </div>
                          : null
                    }
                    {/*
                      currentVersionDetails.quote_number ?
                    currentVersionDetails.quotes && currentVersionDetails.quotes[0].admin_approve_status === 1 ?
                      <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                        <div className="client-fdbk">Pending Admin Approval</div>
                      </div> :
                      currentVersionDetails.quotes && currentVersionDetails.quotes[0].admin_approve_status === 2 ?
                        <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                          <div className="client-fdbk">Rejected</div>
                        </div> :
                        currentVersionDetails.quotes &&
                          currentVersionDetails.quotes[0].admin_approve_status === 3
                          && currentVersionDetails.quotes[0].client_approve_status === 0 ?
                          <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                            <div className="client-fdbk approved">Admin Approved</div>
                          </div> :
                          currentVersionDetails.quotes &&
                            currentVersionDetails.quotes[0].admin_approve_status === 3
                            && currentVersionDetails.quotes[0].client_approve_status === 1 ?
                            <>
                              <div class="col-md-3 col-sm-3 text-center">
                                <div className="client-fdbk ">Pending Client Approval</div>
                              </div>
                            </> :
                            currentVersionDetails.quotes &&
                              currentVersionDetails.quotes[0].admin_approve_status === 3
                              && currentVersionDetails.quotes[0].client_approve_status === 3 ?
                              <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                                <div className="client-fdbk approved">Client Approved</div>
                              </div> :
                              null :
                    <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                      <div className="client-fdbk">Not Approved</div>
                    </div>
                    */
                    }
                  </div>

                </div>
                {currentVersionDetails.quote_number ?
                  currentVersionDetails.quotes && currentVersionDetails.quotes[0].admin_approve_status === 1 ?
                    <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                      <div className="client-fdbk">Pending Admin Approval</div>
                    </div> :

                    currentVersionDetails.quotes &&
                      currentVersionDetails.quotes[0].admin_approve_status === 3
                      && currentVersionDetails.quotes[0].client_approve_status === 0 ?
                      <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                        <div className="client-fdbk approved">Admin Approved</div>
                      </div> :

                      currentVersionDetails.quotes &&
                        currentVersionDetails.quotes[0].admin_approve_status === 3
                        && currentVersionDetails.quotes[0].client_approve_status === 1 ?
                        <>
                          <div class="col-md-3 col-sm-3 text-center">
                            <div className="client-fdbk ">Pending Client Approval</div>
                          </div>
                        </> :

                        currentVersionDetails.quotes &&
                          currentVersionDetails.quotes[0].admin_approve_status === 3
                          && currentVersionDetails.quotes[0].client_approve_status === 3 ?
                          <div className="col-md-3 col-sm-3 d-flex justify-content-end">
                            <div className="client-fdbk approved">Client Approved</div>
                          </div> : null
                  : null}

              </div>
            </div>
          </div>

          <div className="sf-card mt-4 view-a-n-task">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.site_service_details}</h2>
            </div>

            <div className="sf-card-body">
              {/* <FormSection name="valuesOfTask"> */}

              {/* {this.state.sites ? this.state.sites.map((site_item, index) => ( */}
              {(sitesList && Array.isArray(sitesList) && sitesList.length > 0) ? sitesList.map((site_item, index) => (
                <div className="add-n-site">
                  <div className="data-v-row">
                    <div className="data-v-col">
                      <div className="info-btn">
                      </div>

                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.site_name}</label>
                        <span>{site_item.site.site_name}</span>
                      </div>
                    </div>
                    <div className="data-v-col">
                      <div className="view-text-value">
                        <label>{Strings.address_txt}</label>
                        <span>{site_item.site.street_address + ", " + site_item.site.city + ", " + site_item.site.state + ", " + site_item.site.zip_code}</span>
                      </div>
                    </div>
                  </div>

                  {/* ----------------------------
                                                site service details
                                        ---------------------------- */}
                  <div className="site-ser-table">
                    {site_item.tasks.map((task_item, index) => (

                      <div className="task-wrapper">
                        <div>
                          <div className="site-s-head" >
                            <div className="site-s-footer d-flex pt-0">
                              <div className="view-text-value scodc-site-title">
                                <label >{task_item.task_name}</label>
                                <span>{task_item.description}</span>
                              </div>
                            </div>

                          </div>

                          <div className="site-s-body view-esti-sec">
                            <div className="d-flex flex-wrap justify-content-between">
                              <div className="data-v-row">
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{Strings.area_txt}</label>
                                    <span>{
                                      this.getSSDAreas(task_item.areas ? task_item.areas : [])
                                    }</span>
                                  </div>
                                </div>
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{Strings.frequency_txt}</label>
                                    <span>{task_item.frequency}</span>
                                  </div>
                                </div>
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{Strings.duration_txt}</label>
                                    <span>{task_item.duration}</span>
                                  </div>
                                </div>
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{`Frequency End Date`}</label>
                                    <span>{task_item.frequency_end_date ? moment(task_item.frequency_end_date).format("DD-MM-YYYY") : null}</span>
                                  </div>
                                </div>
                                {/* {
                                  task_item.file && task_item.file.length > 0 ? <div className="doc-sr-img" onClick={(evt) => this.handleTaskFileView(task_item.file, evt)} >
                                    {
                                      task_item.file.length > 1
                                        ? task_item.file.length > 9
                                          ? <i class="material-icons">filter_9_plus</i>
                                          : <i class="material-icons">{`filter_${task_item.file.length}`}</i>
                                        : null
                                    }
                                    <img alt="taskImage" src={task_item.file.length > 0 ? task_item.file[0].file_url : ''} />

                                  </div> : null
                                } */}
                                {
                                  task_item.file && task_item.file.length > 0 ? <div className="doc-sr-img" onClick={(evt) => this.handleTaskFileView(task_item.file, evt)} >
                                    {
                                      task_item.file.length > 1
                                        ? task_item.file.length > 9
                                          ? <i class="material-icons">filter_9_plus</i>
                                          : <i class="material-icons">{`filter_${task_item.file.length}`}</i>
                                        : null
                                    }
                                    <img alt="taskImage" src={task_item.file.length > 0 ? task_item.file[0].file_url : ''} />

                                  </div> : null
                                }
                              </div>
                              {/* estimate details tables */}


                              {task_item.estimate ? <div className="esti-data-view">
                                {typeof task_item.estimate === 'string' ?
                                  <div className="data-v-col">
                                    <div className="view-text-value">
                                      <label>{Strings.estimate_txt}</label>
                                      <span>{task_item.estimate}</span>
                                    </div>
                                  </div>
                                  :
                                  <>
                                    <label className="esti-hrs-hd">{Strings.estimate_txt}
                                      <span className="qunty-rate">${calculateEstimate(task_item.estimate)}</span> <b>{task_item.estimate && task_item.estimate.estimate_type
                                        && task_item.estimate.estimate_type.toUpperCase()}</b></label>
                                    <div className="esti-table">
                                      {task_item.estimate && task_item.estimate.estimate_type === "hours" ? <table className="table">
                                        <tr className="est-sc-thd">
                                          <th>Staff</th>
                                          <th>Hours</th>
                                          <th>Days</th>
                                          <th>Rate</th>
                                        </tr>
                                        <tr>
                                          <td>{task_item.estimate.staff}</td>
                                          <td>{task_item.estimate.hours}</td>
                                          <td>{task_item.estimate.days}</td>
                                          <td>${task_item.estimate.rate}</td>
                                        </tr>
                                      </table> :
                                        task_item.estimate && task_item.estimate.estimate_type === "area" ?

                                          <table className="table ">
                                            <tr className="est-sc-thd">
                                              <th>SQM</th>
                                              <th>Rate</th>
                                            </tr>
                                            <tr>
                                              <td>{task_item.estimate.sqm}</td>
                                              <td>${task_item.estimate.rate}</td>
                                            </tr>
                                          </table> :
                                          task_item.estimate && task_item.estimate.estimate_type === "quant" ?
                                            <table className="table">
                                              <tr className="est-sc-thd">
                                                <th>Quantity</th>
                                                <th>Rate</th>
                                              </tr>
                                              <tr>
                                                <td>{task_item.estimate.quant}</td>
                                                <td>${task_item.estimate.rate}</td>
                                              </tr>
                                            </table> : null}
                                    </div>
                                  </>}
                              </div> : null}
                            </div>
                            <div className="site-s-footer d-flex justify-content-between sco-note-vlue">
                              <div className="data-v-row no-note-brder">
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>Notes</label>
                                    <span>{task_item.note}</span>
                                  </div>
                                </div>
                                <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{Strings.start_date_txt}</label>
                                    <span>{moment(task_item.start_date).format("DD-MM-YYYY")}</span>
                                  </div>
                                </div>
                              </div>

                              {
                                currentVersionDetails.quote_number ? <div className="data-v-col">
                                  <div className="view-text-value">
                                    <label>{"Value"}</label>
                                    <span>${task_item.amount}</span>
                                  </div>
                                </div> : null
                              }
                            </div>
                          </div>

                          {/* for sub tasks */}

                          {
                            task_item.sub_tasks && task_item.sub_tasks.length > 0 ?
                              task_item.sub_tasks.map(subtask =>
                                <div className="site-s-body view-sub-task">
                                  <div className="d-flex flex-wrap justify-content-between">
                                    <div className="data-v-row">
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.area_txt}</label>
                                          <span>{
                                            this.getSSDAreas(subtask.areas ? subtask.areas : [])
                                          }</span>
                                        </div>
                                      </div>
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.frequency_txt}</label>
                                          <span>{subtask.frequency}</span>
                                        </div>
                                      </div>
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.duration_txt}</label>
                                          <span>{subtask.duration}</span>
                                        </div>
                                      </div>
                                      <div className="data-v-col">
                                        <div className="view-text-value">
                                          <label>{Strings.start_date_txt}</label>
                                          <span>{moment(subtask.start_date).format("DD-MM-YYYY")}</span>
                                        </div>
                                      </div>
                                    </div>

                                    {/* estimate details tables */}


                                    {subtask.estimate ? <div className="esti-data-view">
                                      {this.checkParsed(subtask.estimate) ?
                                        <>
                                          <label className="esti-hrs-hd">{Strings.estimate_txt}
                                            <span className="qunty-rate">${calculateEstimate(JSON.parse(subtask.estimate))}</span> <b>{subtask.estimate && JSON.parse(subtask.estimate).estimate_type
                                              && JSON.parse(subtask.estimate).estimate_type.toUpperCase()}</b></label>
                                          <div className="esti-table">
                                            {subtask.estimate && JSON.parse(subtask.estimate).estimate_type === "hours" ? <table className="table">
                                              <tr className="est-sc-thd">
                                                <th>Staff</th>
                                                <th>Hours</th>
                                                <th>Days</th>
                                                <th>Rate</th>
                                              </tr>
                                              <tr>
                                                <td>{JSON.parse(subtask.estimate).staff}</td>
                                                <td>{JSON.parse(subtask.estimate).hours}</td>
                                                <td>{JSON.parse(subtask.estimate).days}</td>
                                                <td>${JSON.parse(subtask.estimate).rate}</td>
                                              </tr>
                                            </table> :
                                              subtask.estimate && JSON.parse(subtask.estimate).estimate_type === "area" ?

                                                <table className="table ">
                                                  <tr className="est-sc-thd">
                                                    <th>SQM</th>
                                                    <th>Rate</th>
                                                  </tr>
                                                  <tr>
                                                    <td>{JSON.parse(subtask.estimate).sqm}</td>
                                                    <td>${JSON.parse(subtask.estimate).rate}</td>
                                                  </tr>
                                                </table> :
                                                subtask.estimate && JSON.parse(subtask.estimate).estimate_type === "quant" ?
                                                  <table className="table">
                                                    <tr className="est-sc-thd">
                                                      <th>Quantity</th>
                                                      <th>Rate</th>
                                                    </tr>
                                                    <tr>
                                                      <td>{JSON.parse(subtask.estimate).quant}</td>
                                                      <td>${JSON.parse(subtask.estimate).rate}</td>
                                                    </tr>
                                                  </table> : null}
                                          </div>
                                        </> :
                                        <div className="data-v-col">
                                          <div className="view-text-value">
                                            <label>{Strings.estimate_txt}</label>
                                            <span>{subtask.estimate}</span>
                                          </div>
                                        </div>}
                                    </div> : null}
                                  </div>
                                </div>) : null
                          }
                        </div>
                        {/* </SortableItem> */}
                      </div>

                    ))}
                    {/* </SortableContainer> */}
                  </div>
                </div>
              )) : ''}

              {
                equipmentsList.length > 0 ?
                  <div className="sf-card no-shadow br-xy">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                      <h2 className="sf-pg-heading">Equipment Cost</h2>
                    </div>
                    <div className="sf-card-body">
                      <table className="equipmnt-table table equip-cast-tble no-label">
                        <tr>
                          <th>Type of Equipment</th>
                          <th>Cost ($)</th>
                          <th></th>
                        </tr>

                        {
                          equipmentsList.map((equipment, index) => (
                            <tr key={index}>
                              <td>
                                <fieldset className="form-group sf-form m-0">
                                  {equipment.equipment.name}
                                </fieldset></td>
                              <td>
                                <fieldset className="form-group sf-form m-0">
                                  {equipment.equipment_cost}
                                </fieldset>
                              </td>
                              <td>
                              </td>
                            </tr>
                          ))
                        }
                        <tr>
                          <td></td>
                          <td>
                            <div className="eqip-total-vlue">
                              <span>Total</span>
                              <b>${this.calculateEquipmentAmount()}</b>
                            </div>
                          </td>
                          <td></td>
                        </tr>
                      </table>
                    </div>
                  </div>
                  : null
              }

              {/* quote total value */}
              {this.state.generateQuote || currentVersionDetails.quote_number ?
                <div className="quote-total">
                  <div className="quote-table">
                    <table>
                      <tr>
                        <th>Subtotal (Exc GST)</th>
                        <th>${quoteDetails.sub_total_amount.toFixed(2)}</th>
                      </tr>
                      <tr>
                        <td>Total (Inc GST)</td>
                        <td><strong>${quoteDetails.total_amount.toFixed(2)}</strong></td>
                      </tr>
                    </table>
                  </div>
                </div> : null}
            </div>
          </div>
          <div className="sf-card mt-4">
            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
              <h2 className="sf-pg-heading">{Strings.internal_notes}</h2>
            </div>
            <div className="sf-card-body">
              {currentVersionDetails.internal_notes ? currentVersionDetails.internal_notes.map((note_item) => (
                <div className="view-internal-note">
                  <span>{ReactHtmlParser(note_item.note)}</span>
                  <span className="note-dtls">{`By ${note_item.organisation_user.first_name}, ${moment(note_item.created_at).format('DD MMM YYYY')}`}</span>
                </div>
              )) : ''}
            </div>
          </div>
          <Modal
            visible={this.state.viewTaskFiles}
            className="job-img-gallery"
            zIndex="99999"
            footer={null}
            onCancel={this.handleCancel}>
            <TaskFileViews taskFiles={this.state.taskFiles} />
          </Modal>
        </div>
      </div>
    );
  }
}

const calculateEstimate = (estimate) => {
  if (estimate) {
    if (estimate.estimate_type && estimate.estimate_type === 'hours' &&
      estimate.staff && estimate.hours && estimate.days && estimate.rate) {
      return estimate.staff * estimate.hours * estimate.days * estimate.rate;
    }
    if (estimate.estimate_type && estimate.estimate_type === 'area' && estimate.sqm && estimate.rate) {
      return estimate.sqm * estimate.rate;
    }
    if (estimate.estimate_type && estimate.estimate_type === 'quant' && estimate.quant && estimate.rate) {
      return estimate.quant * estimate.rate;
    }
  }
  return 0
}

const mapStateToProps = (state, ownProps) => {
  return {
    versionHistory: state.scopeDocs.scopeDocVersionHistory
  }
}

export default compose(
  connect(mapStateToProps),
  reduxForm({ form: 'HistoryScopeDoc' })
)(HistoryScopeDoc)