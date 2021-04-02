import React from 'react';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import { compose } from 'redux';
import { Strings } from '../../../dataProvider/localize';
import { withRouter } from 'react-router-dom';
import { Page, Text, View, Document, StyleSheet, pdf, Image, Font } from '@react-pdf/renderer';
import styled from '@react-pdf/styled-components';
import { getStorage, currencyFormat, handleFocus } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import moment from 'moment';
import { abbrivationStr } from '../../../utils/common'
import latoHairline from './lato/Lato-Hairline.ttf';
import latoThin from './lato/Lato-Thin.ttf';
import latoLight from './lato/Lato-Light.ttf';
import latoRegular from './lato/Lato-Regular.ttf';
import latoMedium from './lato/Lato-Medium.ttf';
import latoBold from './lato/Lato-Bold.ttf';
import ReactHtmlParser from 'react-html-parser';

Font.register({
  family: 'Lato',
  fonts: [
    { src: latoHairline, fontWeight: 'hairline' },
    { src: latoThin, fontWeight: 'thin' },
    { src: latoLight, fontWeight: 'light' },
    { src: latoRegular, fontWeight: 'normal' },
    { src: latoMedium, fontWeight: 'medium' },
    { src: latoBold, fontWeight: 'bold' }
  ]
})

const styles = StyleSheet.create({
  page: { backgroundColor: '#ffffff', padding: 0, fontSize: 10, fontFamily: 'Lato', fontWeight: "normal", color: "#4A4A4A" },
  body: { padding: 20 },
  image: { backgroundColor: 'grey', padding: 10, width: 30, height: 30 },
  header: { backgroundColor: '#F8F8F8', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  comtext: { color: '#4A4A4A', fontFamily: 'Lato', fontWeight: 'normal', fontSize: 8, fontWeight: 'normal', paddingBottom: 3, },
  comTitle: { color: '#4A4A4A', fontSize: 11, fontFamily: 'Lato', fontWeight: 'normal', paddingBottom: 2, },
  title: { color: '#4A4A4A', fontSize: 20, fontWeight: 'semibold', padding: 20, textAlign: 'center' },
  docHeading: { color: '#4A4A4A', fontSize: 14, fontFamily: 'Lato', fontWeight: 'medium', paddingHorizontal: 10, textAlign: 'center' },
  colMd: { width: "33.33%" },
  sfCard: {
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    borderBottomRightRadius: 4,
    borderBottomLeftRadius: 4,
    border: 1,
    borderTopStyle: "solid",
    borderBottomStyle: "solid",
    borderLeftStyle: "solid",
    borderRightStyle: "solid",
    borderLeftColor: "#EFEFEF",
    borderRightColor: "#EFEFEF",
    borderTopColor: "#EFEFEF",
    borderBottomColor: "#EFEFEF",
    marginBottom: 20,
  },
  cardTitle: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EFEFEF",
    borderBottomStyle: "solid",
    fontSize: 12,
    fontWeight: "normal",
    fontFamily: 'Lato'
  },
  cardRow: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  cardCol: {
    paddingHorizontal: 15,
    paddingVertical: 5,
    marginVertical: 10,
    flexDirection: "column",
  },
  colBorder: {
    borderRightWidth: 1,
    borderRightColor: "#EFEFEF",
    borderRightStyle: "solid",
  },
  cardTxtBold: {
    fontWeight: "normal",
    fontFamily: 'Lato',
    paddingBottom: 2,
  },
  cardTxtlight: {
    fontWeight: "light",
    fontFamily: 'Lato',
    color: "#8F8F8F"
  },
  sfScWork: {
    backgroundColor: '#F8F8F8',
    marginBottom: 15,
    marginHorizontal: 15,
  },
  borderWB2: { borderBottomWidth: 2, borderBottomColor: "#ffffff", borderBottomStyle: "solid" },
  colMd1: { width: "8.333333%" },
  colMd2: { width: "16.666667%" },
  colMd3: { width: "25%" },
  colMd4: { width: "33.33%" },
  colMd5: { width: "41.666667%%" },
  colMd6: { width: "50%" },
  colMd7: { width: "58.333333%" },
  colMd8: { width: "66.666666%" },
  colMd9: { width: "75%" },
  colMd10: { width: "83.333333%" },
  colMd11: { width: "91.666667%" },
  colMd12: { width: "100%" },
  valueWrap: { flexDirection: 'column', alignItems: 'flex-end' },
  valueCard: { backgroundColor: "#F5F7F9", padding: 15, marginTop: 50, marginBottom: 20 },
  totalValue: { flexDirection: 'row', paddingVertical: 10 },
  tvbborder: { borderBottomWidth: 1, borderBottomColor: "#EFEFEF", borderBottomStyle: "solid" },
  valueTxt: { fontSize: 10, color: "#4A4A4A", textAlign: "right", fontWeight: "normal", fontFamily: 'Lato', textTransform: 'uppercase' },
  valueBold: { color: "#222222", fontWeight: "bold" }
});

const MyDocument = (selectedScopeDoc) => (

  <Document>
    <Page style={styles.page}>
      <View style={styles.header}>
        <View style={styles.colMd}>
          {/* <Text style={styles.comTitle}>High Clean Pty Ltd</Text>
          <Text style={styles.comtext}>Link expires in 81 days</Text> */}
        </View>
        <View style={styles.colMd}>
          <Text style={styles.docHeading}>Quote Document</Text>
        </View>
        <View style={styles.colMd}><Text></Text></View>
      </View>

      <View style={styles.body}>

        <View style={styles.sfCard}>
          <Text style={styles.cardTitle}>Job Details</Text>
          <View style={styles.cardRow}>
            <View style={[styles.cardCol, styles.colBorder]}>
              <Text style={styles.cardTxtBold}>Site Name</Text>
              <Text style={styles.cardTxtlight}>Smith Co.</Text>
            </View>
            <View style={[styles.cardCol, styles.colBorder]}>
              <Text style={styles.cardTxtBold}>Site Address</Text>
              <Text style={styles.cardTxtlight}>200 Sydney Road, Victoria 3022</Text>
            </View>
            <View style={[styles.cardCol, styles.colBorder]}>
              <Text style={styles.cardTxtBold}>Site Contact Name</Text>
              <Text style={styles.cardTxtlight}>Brendan Wright</Text>
            </View>
            <View style={[styles.cardCol, styles.colBorder]}>
              <Text style={styles.cardTxtBold}>Site Contact Number</Text>
              <Text style={styles.cardTxtlight}>0432874123</Text>
            </View>
            <View style={[styles.cardCol, styles.colBorder]}>
              <Text style={styles.cardTxtBold}>Client Name</Text>
              <Text style={styles.cardTxtlight}>Brendan Wright</Text>
            </View>
            <View style={[styles.cardCol, styles.colBorder]}>
              <Text style={styles.cardTxtBold}>Client Number</Text>
              <Text style={styles.cardTxtlight}>0432874123</Text>
            </View>
            <View style={[styles.cardCol, styles.colBorder]}>
              <Text style={styles.cardTxtBold}>Purchase Order Number</Text>
              <Text style={styles.cardTxtlight}>SSFM39</Text>
            </View>
          </View>
        </View>

        <View style={styles.sfCard}>
          <Text style={styles.cardTitle}>Job Details</Text>
          <View style={styles.cardRow}>
            <View style={[styles.cardCol, styles.colBorder]}>
              <Text style={styles.cardTxtBold}>Quote Name</Text>
              <Text style={styles.cardTxtlight}>RMIT Tender</Text>
            </View>
            <View style={[styles.cardCol, styles.colBorder]}>
              <Text style={styles.cardTxtBold}>Site Name</Text>
              <Text style={styles.cardTxtlight}>Smith Co.</Text>
            </View>
            <View style={[styles.cardCol]}>
              <Text style={styles.cardTxtBold}>Address</Text>
              <Text style={styles.cardTxtlight}>200 Sydney Road, Victoria 3022</Text>
            </View>
          </View>
          <View style={styles.sfScWork}>
            <View style={[styles.cardRow, styles.borderWB2]}>
              <View style={[styles.cardCol, styles.colBorder, styles.colMd6]}>
                <Text style={styles.cardTxtBold}>Roof Cleaning</Text>
                <Text style={styles.cardTxtlight}>Lorem ipsum dolor</Text>
              </View>
              <View style={[styles.cardCol, styles.colBorder, styles.colMd3]}>
                <Text style={styles.cardTxtBold}>Area</Text>
                <Text style={styles.cardTxtlight}>Gymnasium, Kitchen</Text>
              </View>
              <View style={[styles.cardCol, styles.colMd3]}>
                <Text style={styles.cardTxtBold}>Value</Text>
                <Text style={styles.cardTxtlight}>$123</Text>
              </View>
            </View>
            <View style={[styles.cardRow, styles.borderWB2]}>
              <View style={[styles.cardCol, styles.colBorder, styles.colMd6]}>
                <Text style={styles.cardTxtBold}>Roof Cleaning</Text>
                <Text style={styles.cardTxtlight}>Lorem ipsum dolor</Text>
              </View>
              <View style={[styles.cardCol, styles.colBorder, styles.colMd3]}>
                <Text style={styles.cardTxtBold}>Area</Text>
                <Text style={styles.cardTxtlight}>Gymnasium, Kitchen</Text>
              </View>
              <View style={[styles.cardCol, styles.colMd3]}>
                <Text style={styles.cardTxtBold}>Value</Text>
                <Text style={styles.cardTxtlight}>$123</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.valueWrap}>
          <View style={[styles.valueCard, styles.colMd5]}>
            <View style={[styles.totalValue, styles.tvbborder]}>
              <Text style={[styles.valueTxt, styles.colMd6]}>Subtotal (Exc GST)</Text>
              <Text style={[styles.valueTxt, styles.colMd6]}>$660.60</Text>
            </View>
            <View style={styles.totalValue}>
              <Text style={[styles.valueTxt, styles.colMd6, styles.valueBold]}>Total (Inc GST)</Text>
              <Text style={[styles.valueTxt, styles.colMd6, styles.valueBold]}>$666.66</Text>
            </View>
          </View>
        </View>

      </View>
    </Page>
  </Document>
);

class PreviewScopeDocQuote extends React.Component {

  constructor(props) {
    super(props);
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

  showDoc = () => {
    var obj = pdf(<MyDocument selectedScopeDoc={this.props.selectedScopeDoc} />).toBlob();
    obj.then(function (blob) {
      var url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    });
  }

  cancelQuotePreview = () => {
    this.props.cancelQuotePreview()
  }
  generateImgUrl = (files, task) => {
    return `?imgs=${JSON.stringify(files.map(file => file.file_url))}&job=${this.props.selectedScopeDoc.job_name}&num=${this.props.selectedScopeDoc.quote_number}&task=${task.task_name}`;
  }
  render() {
    const { selectedScopeDoc, showPhotos } = this.props;
    const { invoiceDetails } = this.props;
    console.log('Photos:', showPhotos)
    return (
      <div className="sf-jobdoc-preview">
        <div style={{ border: "1px solid #dddddd", fontFamily: "lato", color: "#4a4a4a", fontWeight: "normal", fontSize: "13px", padding: "10px", borderRadius: "4px", width: "100%" }}>
          <div style={{ padding: '10px 15px', background: '#ffffff', border: '1px solid #ddd', borderRadius: '4px' }}>
            <table cellpadding="0" cellspacing="0" style={{ width: '100%' }}>
              <tr>
                <td style={{ textAlign: 'left' }}>
                  {this.currentOrg && this.currentOrg.logo ?
                    <img width="auto" height="50px" src={this.currentOrg.logo} /> : null}
                  {/* <!-- <label style="background:#03a791; display: inline-block; width:50px; height:50px; font-size:18px; color:#fff; font-weight:600;border-radius:50px; letter-spacing:1px; line-height:50px; text-align:center">{{ organisation.abbrString }}</label> -->
                        <!--image view hide --> */}
                </td>
                <td style={{ textAlign: 'right' }}>
                  <h3 style={{ color: '#4a4a4a', fontSize: '20px', fontWeight: 'bold', margin: 0, padding: 0 }}>Quotation
                        </h3>
                </td>
              </tr>
            </table>
          </div>
          <div style={{ marginTop: '10px', marginBottom: '10px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <table cellpadding="0" cellspacing="0" style={{ width: '100%', fontSize: '13px' }}>
              <tr>
                <td style={{ fontWeight: 'bold' }}>
                  <p style={{ margin: 0, padding: '0 0 15px 0' }}><strong>{this.currentOrg && this.currentOrg.name}</strong></p>
                  <p style={{ margin: '0 0 5px 0', padding: 0 }}>ABN: {this.currentOrg && this.currentOrg.abn_acn}</p>
                  <p style={{ margin: 0, padding: '0 0 6px 0' }}>A: {this.currentOrg && this.currentOrg.address}</p>
                  <p style={{ margin: 0, padding: '0 0 6px 0' }}>P: {this.currentOrg && this.currentOrg.phone_number}</p>
                  {/* <p style="margin:0; padding: 0 0 6px 0;">E: {this.currentOrg && this.currentOrg.name}</p> */}
                </td>
                <td style={{ width: '30%', textAlign: 'left' }}>
                  <div style={{ margin: 0, padding: 0, fontWeight: 'bold' }}>
                    <p style={{ margin: 0, paddingBottom: '3px' }}>QuotesNo:</p>
                    <strong>{selectedScopeDoc && selectedScopeDoc.quote_number ? selectedScopeDoc.quote_number : ''}</strong>
                  </div>
                  <div style={{ margin: 0, padding: '15px 0', fontWeight: 'bold' }}>
                    <span style={{ margin: 0, padding: '0 5px 0 0' }}>Date:</span>
                    {/* {{ client_email_sent_at }} */
                      selectedScopeDoc && selectedScopeDoc.quotes && selectedScopeDoc.quotes[0]
                      && selectedScopeDoc.quotes[0].client_email_sent_at}
                  </div>
                  <div style={{ margin: 0, padding: 0, fontWeight: 'bold' }}>
                    <span style={{ margin: 0, padding: '0 5px 0 0' }}>QUOTATION VALID FOR:</span>
                    30 Days from Above Date
                    </div>
                </td>
              </tr>
            </table>
          </div>
          <div style={{ marginBottom: '10px', padding: '10px 15px', border: '1px solid #ddd', borderRadius: '4px' }}>
            <table cellpadding="0" cellspacing="0" style={{ width: '100%', fontSize: '13px' }}>
              <tr>
                <td style={{ width: '80px', verticalAlign: 'top', fontWeight: 'bold' }}>
                  <p style={{ margin: 0, padding: 0 }}><strong>To:</strong></p>
                </td>
                <td style={{ fontWeight: 'bold' }}>
                  <p style={{ margin: 0, paddingBottom: '5px' }}>Attention:{selectedScopeDoc && selectedScopeDoc.client
                    && selectedScopeDoc.client.name ? selectedScopeDoc.client.name : ''}</p>
                  <p style={{ margin: 0, paddingBottom: '5px' }}>C: {selectedScopeDoc && selectedScopeDoc.client
                    && selectedScopeDoc.client.name ? selectedScopeDoc.client.name : ''}</p>
                  {/* <!--<p style={{margin: 0, paddingBottom: '5px'}}>ABN: {{ client.abn_acn }}</p>--> */}
                  <p style={{ margin: 0, paddingBottom: '5px' }}>A: {selectedScopeDoc && selectedScopeDoc.client
                    && selectedScopeDoc.client.address ? selectedScopeDoc.client.address : ''}</p>
                  <p style={{ margin: 0, padding: 0 }}>M: {selectedScopeDoc && selectedScopeDoc.client
                    && selectedScopeDoc.client_person.phone ? selectedScopeDoc.client_person.phone : ''}</p>
                  {/* <p style="margin: 0; padding:0;">E: {selectedScopeDoc && selectedScopeDoc.client 
                  && selectedScopeDoc.client.name ? selectedScopeDoc.client.name : ''}</p> */}
                </td>
              </tr>
            </table>
          </div>

          <div style={{ background: '#f1f1f1', marginBottom: 0, padding: '5px 0px', border: '1px solid #ddd', borderRadius: '1px' }}>
            <strong style={{ paddingRight: '5px' }}>Quote Name:</strong>
            <span> {selectedScopeDoc && selectedScopeDoc.job_name}</span>
          </div>
          <div style={{ marginBottom: '10px', padding: '10px 0' }}>
            <table cellpadding="0" cellspacing="0" style={{ width: '100%', fontSize: '13px' }}>

              {selectedScopeDoc.sites && selectedScopeDoc.sites.map((site_item, index) => (
                <>
                  <tr style={{ background: 'rgba(9, 9, 9, 0.5)' }}>
                    <th colspan="3" style={{ border: '1px solid #c1c1c1', borderBottom: 0, borderRightWidth: 0, padding: '5px 10px', textAlign: 'left' }}>
                      <strong style={{ color: '#ffffff' }}>Job Location:</strong>
                      <span style={{ color: '#ffffff', fontWeight: 'normal' }}>
                        {site_item.site.site_name}, {site_item.site.street_address},{site_item.site.city},{site_item.site.state},{site_item.site.country},{site_item.site.zip_code}
                      </span>
                    </th>
                  </tr>
                  <tr style={{ background: 'rgba(9, 9, 9, 0.4)', color: '#ffffff' }}>
                    <th colspan="2" style={{ border: '1px solid #c1c1c1', borderBottom: 0, borderRightWidth: 0, padding: '5px 10px', textAlign: 'left' }}>
                      Description
                    </th>
                    <th style={{ textAlign: 'left', border: '1px solid #c1c1c1', borderBottom: 0, padding: '5px 10px', width: '30%' }}>
                      Amount
                    </th>
                  </tr>
                  {site_item.tasks && site_item.tasks.map((task_item) => task_item.task_selected_for_quote ? (
                    <> <tr style={{ background: '#f1f1f1f1' }}>
                      <td style={{ border: '1px solid #c1c1c1', padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a', borderRight: 0 }}>
                        <strong style={{ color: '#222', fontSize: '15px', fontWeight: 600, display: 'inline-block', width: '100%', marginBottom: '2px' }}>{task_item.task_name} - {task_item && task_item.areas
                          && task_item.areas.map(are => are.area_name + ", ")}</strong>
                      </td>
                      {/* {{ #has_photos}} */}
                      <td style={{ border: '1px solid #c1c1c1', borderRight: 0, padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a', width: '25%' }}>
                        {task_item.file && task_item.file.length > 0 ?
                          <>Photo link: <a href={"/task_image_preview"
                            + this.generateImgUrl(task_item.file, task_item)
                          } style={{ paddingLeft: '5px', color: '#666', fontWeight: 'bold', fontSize: '12px' }} target="_blank">Please click here</a></> : null}
                      </td>

                      <td style={{ border: '1px solid #c1c1c1', padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a' }}>
                        <strong>{currencyFormat(task_item.amount && task_item.amount)}</strong></td>
                    </tr>
                      <tr>
                        <td colSpan="2" style={{ border: '1px solid #c1c1c1', padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a', borderRight: 0, borderTop: 0 }}>
                          <span>Notes: {task_item.note}</span>
                        </td>
                      </tr>

                    </>) : null)}
                </>))}
              <tr>
                <td></td>
                <td style={{ border: 0, textAlign: 'right', padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a', borderLeft: '1px solid #c1c1c1', borderBottom: '1px solid #c1c1c1', background: '#f1f1f1' }}>
                  <strong>Subtotal</strong></td>
                <td style={{ border: '1px solid #c1c1c1', borderTop: 0, padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a', background: '#f1f1f1' }}>
                  <strong>{selectedScopeDoc && selectedScopeDoc.quote_sub_total
                    ? currencyFormat(selectedScopeDoc.quote_sub_total) : ''}</strong></td>
              </tr>
              <tr>
                <td></td>
                <td style={{ border: 0, textAlign: 'right', padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a', borderLeft: '1px solid #c1c1c1', borderBottom: '1px solid #c1c1c1', background: '#f1f1f1' }}>
                  <strong>G.S.T</strong></td>
                <td style={{ border: '1px solid #c1c1c1', borderTop: 0, padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a', background: '#f1f1f1' }}>
                  <strong>{selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] &&
                    selectedScopeDoc.quotes[0].total_amount &&
                    selectedScopeDoc.quotes[0].sub_total_amount ?
                    currencyFormat((selectedScopeDoc.quotes[0].total_amount - selectedScopeDoc.quotes[0].sub_total_amount))
                    : ''}</strong>
                </td>
              </tr>
              <tr>
                <td></td>
                <td style={{ border: 0, textAlign: 'right', padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a', borderLeft: '1px solid #c1c1c1', borderBottom: '1px solid #c1c1c1' }}>
                  <strong>Total</strong></td>
                <td style={{ border: '1px solid #c1c1c1', borderTop: 0, padding: '5px 10px', fontSize: '13px', verticalAlign: 'top', color: '#4a4a4a' }}>
                  <strong>{selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].total_amount ?
                    currencyFormat(selectedScopeDoc.quotes[0].total_amount) : ''}</strong></td>
              </tr>
            </table>
          </div>



          <div style={{ marginTop: '10px' }}>
            <table cellpadding="0" cellspacing="0" style={{ width: '100%', fontSize: '13px' }}>
              <tr>
                <td style={{ borderRadius: '4px 4px 0 0', border: '1px solid #ddd', background: '#f1f1f1', padding: '6px 15px' }}>
                  <strong>Special Notes-Conditions</strong>
                </td>
              </tr>
              <tr>
                <td style={{ border: '1px solid #ddd', borderTop: 0, background: '#ffffff', padding: '6px 15px' }}>
                  <span className="dynamic-html-cnt">{selectedScopeDoc && ReactHtmlParser(selectedScopeDoc.conditions)}</span>
                </td>
              </tr>
            </table>
          </div>

          <div style={{ marginTop: '10px' }}>
            <table cellpadding="0" cellspacing="0" style={{ width: '100%', fontSize: '13px' }}>
              <tr>
                <td style={{ padding: '3px 0' }}>
                  <span>Click here to view T&C link:</span>
                  <a href="`#" style={{ color: '#4a4a4a', fontWeight: 'bold' }}>link will be show here</a>
                </td>
              </tr>
              <tr>
                <td style={{ padding: '10px 0 3px 0' }}>
                  <strong style={{ fontSize: '16px' }}>Quote Prepared by:</strong>
                  <strong style={{ fontSize: '16px' }}>{JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
                    (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : "") : ''}</strong>
                </td>
              </tr>
            </table>
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'center', margin: '30px 0 20px' }}>
            <span style={{ background: '#c8f7f0', border: '1px solid #03a791', fontWeight: 700, padding: '5px 60px', fontSize: '16px', color: '#222' }}>Thank
                    you for requesting a quote from {this.currentOrg && this.currentOrg.name}</span></div>
        </div>
        {/* save and preview button */}
        <div className="jdp-footer">
          <div className="all-btn d-flex justify-content-end mt-5 sc-doc-bnt">
            <div className="btn-hs-icon">
              {/* <button type="button" className="bnt bnt-active" onClick={() => {
                this.handleQuoteClick()
              }
              }>
                {Strings.email_job_docs_bnt}</button> */}
              <button type="button" className="bnt bnt-active" onClick={() => {
                this.cancelQuotePreview()
              }
              }>
                {Strings.cancel_btn}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state, ownProps) => {
  var value = state.scopeDocs && state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : {};
  var filePresent = false;
  if (value.hasOwnProperty("sites")) {
    for (const site of value.sites) {
      if (site.tasks) {
        for (const task of site.tasks) {
          if (task.file && task.file.length > 0) {
            filePresent = true
          }
        }
      }
    }
  }
  return {
    selectedScopeDoc: (value ? value : {}),
    showPhotos: filePresent
  }
}

export default compose(
  connect(mapStateToProps),
  reduxForm({
    form: 'PreviewScopeDocQuote',
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(PreviewScopeDocQuote)