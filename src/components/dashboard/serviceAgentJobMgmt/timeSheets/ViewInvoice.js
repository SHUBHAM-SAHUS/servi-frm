import React, { Component } from 'react'
import { connect } from 'react-redux'
import { pdf } from '@react-pdf/renderer';
import { bindActionCreators, compose } from 'redux';
import { getStorage, currencyFormat } from '../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import { Strings } from '../../../../dataProvider/localize';
import { Modal } from 'antd';
import moment from 'moment'

export class ViewInvoice extends Component {
    constructor(props) {
        super(props);
        this.currentOrg = JSON.parse(getStorage(ADMIN_DETAILS)).organisation;
    }


    //   organisation = this.props.invoiceDetails.orgnisation_details;
    render() {
        const { invoiceDetails } = this.props;

        return (
            <div className="sf-jobdoc-preview" >
                <div className="sf-card-wrap">
                    {/* header */}
                    <div className="jdp-head inv-head">
                        <div class="jdp-c-exp-date co-details-prv">
                            <p>{this.currentOrg && this.currentOrg.name}</p>
                            <p>{this.currentOrg && this.currentOrg.abn_acn}</p>
                        </div>
                        {this.currentOrg && this.currentOrg.logo ?
                            <img alt="OrgLogo" src={this.currentOrg.logo} /> : null}
                        <h3>Invoice</h3>
                    </div>
                    {/* body */}
                    <div className="sf-card no-shadow">
                        <div className="sf-card-body p-0">
                            <div className="invoice-content">

                                {/* From details */}
                                <div className="row mt-5">
                                    <div className="col-md-8">
                                        <div class="jdp-c-exp-date co-details-prv">
                                            <p><strong>{this.currentOrg && this.currentOrg.name}</strong></p>
                                            <p>ABN: {this.currentOrg && this.currentOrg.abn_acn}</p>
                                            {/* <p>W:{this.currentOrg && this.currentOrg.name}</p> */}
                                            <p>A: {this.currentOrg && this.currentOrg.address}</p>
                                            <p>P: {this.currentOrg && this.currentOrg.phone_number}</p>
                                        </div>
                                    </div>
                                    <div className="col-md-4">
                                        <div className="inv-date-dtl">
                                            <span>Invoice No:</span>
                                            <strong>{invoiceDetails ? invoiceDetails.invoice_number : ''}</strong>
                                        </div>
                                        <div className="inv-date-dtl">
                                            <span>Date:</span>
                                            <strong>{moment(new Date()).format("DD-MMM-YYYY")}</strong>
                                        </div>
                                    </div>
                                </div>

                                {/* To details */}
                                <div className="inv-to-dtls my-5">
                                    <strong>To</strong>
                                    <div className="col-md-10">
                                        <div class="jdp-c-exp-date co-details-prv">
                                            <p>Attention:</p>
                                            <p>{invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.name ? invoiceDetails.client_details.name : ''}</p>
                                            <p>ABN: {invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.abn_acn ? invoiceDetails.client_details.abn_acn : ''}</p>
                                            <p>A:{invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.address ? invoiceDetails.client_details.address : ''}</p>
                                            <p>E: {invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.contact_person_email ? invoiceDetails.client_details.contact_person_email : ''}</p>
                                            <p>M: {invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.contact_person_phone ? invoiceDetails.client_details.contact_person_phone : ''}</p>

                                        </div>
                                    </div>
                                </div>


                                <div className="inv-table-details inv-price-dtl mt-5">
                                    <table>
                                        <tr>
                                            <th>Qty</th>
                                            <th>Description</th>
                                            <th>Job Location</th>
                                            <th>Image</th>
                                            <th>Unit Price / Amount</th>
                                        </tr>

                                        {/* loop will start from here */}


                                        {invoiceDetails && invoiceDetails.site_and_task_details && invoiceDetails.site_and_task_details.length > 0 ? invoiceDetails.site_and_task_details.map((siteAndTask) => (
                                            <>
                                                {siteAndTask.site && siteAndTask.site.tasks.length > 0 ? siteAndTask.site.tasks.map((task, index) => (

                                                    <tr>
                                                        <td><strong>{index + 1}</strong></td>
                                                        <td>
                                                            <strong>{task.task_name}</strong>
                                                            <span>{task.description}</span>
                                                        </td>
                                                        <td><strong>{siteAndTask.site.site_name}</strong></td>
                                                        <td className="inv-task-img"><img alt="" src={task && task.file && task.file.length > 0 && task.file[0].file_url ? task.file[0].file_url : ''} /></td>
                                                        <td><strong>{currencyFormat(task.outsourced_budget)}</strong></td>
                                                    </tr>
                                                )) : ''}
                                            </>
                                        )) : ''}

                                        {/* end here */}

                                        <tr className="no-border">
                                            <td colSpan="3"></td>
                                            <td className="text-right"><span>Subtotal</span></td>
                                            <td><strong>{invoiceDetails ? currencyFormat(invoiceDetails.sub_total) : ''}</strong></td>
                                        </tr>
                                        <tr className="no-border">
                                            <td colSpan="3"></td>
                                            <td className="text-right"><span>G.S.T</span></td>
                                            <td><strong>{invoiceDetails ? currencyFormat(invoiceDetails.gst) : ''}</strong></td>
                                        </tr>
                                        <tr className="no-border">
                                            <td colSpan="3" className="inv-wo-prerd">
                                                <span>Invoice Prepared By:</span>
                                                <strong>{JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
                                                    (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : ''}</strong>
                                            </td>
                                            <td className="text-right"><span>Total</span></td>
                                            <td><strong>{invoiceDetails ? currencyFormat(invoiceDetails.total) : ''}</strong></td>
                                        </tr>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* save and preview button */}
                {/*  <div className="jdp-footer">
                    <div className="all-btn d-flex justify-content-end mt-5 sc-doc-bnt">
                        <button type="button" className="bnt bnt-normal" onClick={this.invoicePrintPdf}>Invoice PDF View</button>
                    </div>
                </div> */}
            </div>
        )
    }
}

// export default ViewInvoice;

const mapStateToProps = (state, props) => {
    return {
        organisation: this.props.invoiceDetails.orgnisation_details,
    }
}

const mapDispatchToprops = dispatch => ({
    // action: bindActionCreators(actions, dispatch)
})

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
)(ViewInvoice)
