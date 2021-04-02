import React from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Image, PDFViewer, Font } from '@react-pdf/renderer';
import { Strings } from '../../../../dataProvider/localize';
import latoHairline from '../../scope-doc/lato/Lato-Hairline.ttf';
import latoThin from '../../scope-doc/lato/Lato-Thin.ttf';
import latoLight from '../../scope-doc/lato/Lato-Light.ttf';
import latoRegular from '../../scope-doc/lato/Lato-Regular.ttf';
import latoMedium from '../../scope-doc/lato/Lato-Medium.ttf';
import latoBold from '../../scope-doc/lato/Lato-Bold.ttf';
import { Row } from 'antd';
import moment from 'moment';
import { getStorage, currencyFormat } from '../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';

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
    page: { backgroundColor: '#ffffff', padding: 20, fontSize: 10, fontFamily: 'Lato', fontWeight: "normal", color: "#4A4A4A" },
    body: {},
    image: { backgroundColor: 'grey', padding: 10, width: 30, height: 30 },
    header: { backgroundColor: '#F8F8F8', paddingHorizontal: 20, paddingVertical: 10, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    comtext: { color: '#4A4A4A', fontFamily: 'Lato', fontSize: 8.5, fontWeight: 'normal', paddingBottom: 3, },
    comTitle: { color: '#4A4A4A', fontSize: 11, fontFamily: 'Lato', fontWeight: 'normal', paddingBottom: 2, },
    title: { color: '#4A4A4A', fontSize: 20, fontWeight: 'semibold', padding: 20, textAlign: 'center' },
    docHeading: { color: '#4A4A4A', fontSize: 14, fontFamily: 'Lato', fontWeight: 'medium', paddingHorizontal: 10, textAlign: 'center' },
    colMd: { width: "33.33%" },
    comLogo: { width: 60 },
    userSign: { width: 140, height: 'auto', paddingTop: 2 },
    textRight: { textAlign: "right" },
    sfCardBody: { padding: 10 },
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
        marginVertical: 5,
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
        margin: 10,
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
    colMd100: { width: 100 },
    valueWrap: { flexDirection: 'column', alignItems: 'flex-end' },
    valueCard: { backgroundColor: "#F5F7F9", padding: 15, marginTop: 50, marginBottom: 20 },
    totalValue: { flexDirection: 'row', paddingVertical: 10 },
    tvbborder: { borderBottomWidth: 1, borderBottomColor: "#EFEFEF", borderBottomStyle: "solid" },
    valueTxt: { fontSize: 10, color: "#4A4A4A", textAlign: "right", fontWeight: "normal", fontFamily: 'Lato', textTransform: 'uppercase' },
    valueBold: { color: "#222222", fontWeight: "bold" },

    // table
    tableWrpa: { padding: 10 },
    table: {
        display: "table",
        width: "auto",
        fontFamily: 'Lato',
        borderCollapse: 'collapse',
        borderSpacing: 0,
    },
    tr: {
        margin: "auto",
        flexDirection: "row",
        border: 1,
        borderBottom: 0,
        borderLeft: 0,
        borderColor: '#A0A6AB',
    },
    th: {
        padding: 4, paddingLeft: 5, paddingRight: 5,
        borderLeft: 1,
        borderLeftColor: '#A0A6AB',
        borderLeftStyle: 'solid',
        backgroundColor: '#f1f1f1',
    },
    cellHdText: {
        fontSize: 9,
        fontWeight: 'semibold',
        color: "#222",
        fontFamily: 'Lato'
    },

    td: {
        padding: 5, paddingLeft: 5, paddingRight: 5,
        borderLeft: 1,
        borderLeftColor: '#A0A6AB',
        borderLeftStyle: 'solid',
    },
    cellText: {
        fontSize: 9,
        fontWeight: 'normal',
        color: "#222",
        fontFamily: 'Lato'
    },
    brTn: { borderTop: 0 },
    brLtn: { borderLeft: 0 },
    brBtton: { borderBottom: 1, borderBottomColor: '#A0A6AB' },

    tCol1: { width: "8.333333%" },
    tCol2: { width: "16.666667%" },
    tCol3: { width: "25%" },
    tCol4: { width: "33.33%" },
    tCol5: { width: "41.666667%%" },
    tCol6: { width: "50%" },
    tCol7: { width: "58.333333%" },
    tCol8: { width: "66.666666%" },
    tCol9: { width: "75%" },
    tCol10: { width: "83.333333%" },
    tCol11: { width: "91.666667%" },
    tCol12: { width: "100%" },

    // note
    noteText: { fontSize: 10, fontWeight: "light", fontFamily: "Lato", color: "#4a4a4a" },
    noteCard: { marginTop: 8 },
    noteTitle: {
        paddingLeft: 10,
        paddingRight: 10,
        fontSize: 10,
        fontWeight: "normal",
        fontFamily: 'Lato'
    },

    // big center heading
    bigHeading: { padding: 20 },
    h1Heding: { fontSize: 18, fontFamily: "Lato", marginBottom: 5, fontWeight: "medium", textAlign: "center", color: "#485C6E" },
    h3Heading: { fontSize: 14, fontFamily: "Lato", fontWeight: "medium", textAlign: "center", color: "#485C6E" },

    // site details
    siteDetailsWrap: { border: 1, borderStyle: "solid", borderColor: "#EFEFEF", borderRadius: 4 },
    siteName: { fontWeight: "medium", fontSize: 10, color: "#4a4a4a", borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#EFEFEF", padding: 10 },
    pl0: { paddingLeft: 0 },
    pl1: { paddingLeft: 10 },
    pV1: { paddingVertical: 10 },
    pH1: { paddingHorizontal: 10 },
    mt1: { marginTop: 10 },
    brB: { borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#EFEFEF" },
    siteNoteCard: { padding: 10, borderBottomWidth: 1, borderBottomStyle: "solid", borderBottomColor: "#EFEFEF" },
    sSiteTitle: { fontWeight: "normal", fontSize: 10, color: "#4a4a4a", paddingBottom: 10 },
    sTaskTitle: { fontWeight: "medium", fontSize: 11, color: "#4a4a4a", paddingBottom: 10, },
    staffTaskList: { backgroundColor: "#f9f9f9", padding: 10, marginBottom: 10 },
    txtBullet: { width: 3, height: 3, backgroundColor: "#03A791", borderRadius: 100, marginRight: 3 },
    dFlex: { flexDirection: "row", alignItems: "center" },
    incCategoryList: { flexDirection: "row", flexWrap: "wrap" },
    inccItems: { flexDirection: 'row', alignItems: 'center', padding: 10 },
    inccText: { fontSize: 11, fontWeight: 'light' },
    inccBullet: { width: 3, height: 3, backgroundColor: "#4a4a4a", borderRadius: 100, marginRight: 5 },
    inccViewImg: { width: 70, height: 55, marginLeft: 10, marginBottom: 10, border: 1, borderStyle: 'solid', borderRadius: 4, borderColor: '#EFEFEF' },
    imgRowSpace: { paddingLeft: 0, paddingRight: 10, paddingTop: 10, paddingBottom: 0 },
    borderBtm: {
        borderBottom: 1, borderBottomStyle: 'solid', borderBottomColor: '#EFEFEF', marginBottom: 10,
    },
    wmText: { fontWeight: 'semibold', fontSize: 12 },
    invoiceAddressName: { padding: 20, flexDirection: 'row', justifyContent: 'space-between' },
    invDateTime: { flexDirection: 'row' },
    invSenderDetails: { flexDirection: 'row', paddingHorizontal: 20, paddingTop: 5, paddingBottom: 20, width: '100vw' },
    colFixw: { width: 30, },
    colTxt6: { width: '50%', paddingHorizontal: 4, paddingVertical: 2, },
    textCenter: { textAlign: 'center' },
    nonBgColor: { backgroundColor: '#ffffff' },
    invPrePBy: { fontWeight: 'semibold', fontSize: 11, marginLeft: 4, },
    upperCase: { textTransform: 'uppercase' },
    flxDirRow: { flexDirection: "row", },
    bigText: { fontSize: 12, fontWeight: 'bold', textTransform: 'uppercase', textAlign: 'center' },
    smBold: { fontWeight: 'medium', color: '#222222' },
});

const getSSDAreas = (areas) => {
    if (areas.length > 0) {
        const str = areas.map(area => {
            return area.area_name
        })
        const jointString = str.join(', ');
        return jointString;
    }
    return ''
}

const InvoicePrintPdf = ({ invoiceDetails }) => {
    const currentOrg = JSON.parse(getStorage(ADMIN_DETAILS)).organisation;
    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.body}>
                    <View style={styles.header}>
                        <View style={[styles.colMd4]}>
                            <Text style={[styles.comtext, styles.wmText]}>{currentOrg && currentOrg.name}</Text>
                            <Text style={[styles.comtext, styles.wmText]}>{currentOrg && currentOrg.abn_acn}</Text>
                        </View>
                        <View style={styles.colMd4}>
                            {currentOrg && currentOrg.logo ?
                                <Image style={styles.comLogo} src={currentOrg.logo} /> : null}
                        </View>
                        <View style={[styles.colMd4, styles.textRight]}>
                            <Text style={[styles.comtext, styles.wmText, styles.upperCase]}>Invoice</Text>
                        </View>
                    </View>

                    {/* invoice details */}
                    <View style={styles.invoiceAddressName}>
                        <View style={[styles.colMd4]}>
                            <Text style={[styles.comtext, styles.smBold]}>{currentOrg && currentOrg.name}</Text>
                            <Text style={styles.comtext}>ABN: {currentOrg && currentOrg.abn_acn}</Text>
                            <Text style={styles.comtext}>A: {currentOrg && currentOrg.address} </Text>
                            <Text style={styles.comtext}>P: {currentOrg && currentOrg.phone_number}</Text>
                        </View>

                        {/* date time and more details */}
                        <View style={[styles.colMd6]}>
                            <View style={styles.invDateTime}>
                                <Text style={[styles.comtext, styles.textRight, styles.colTxt6]}>Invoice No:</Text>
                                <Text style={[styles.comtext, styles.colTxt6, styles.smBold]}>{invoiceDetails ? invoiceDetails.invoice_number : null}</Text>
                            </View>
                            <View style={styles.invDateTime}>
                                <Text style={[styles.comtext, styles.textRight, styles.colTxt6]}>Date:</Text>
                                <Text style={[styles.comtext, styles.colTxt6, styles.smBold]}>{moment(new Date()).format("DD-MMM-YYYY")}</Text>
                            </View>
                        </View>
                    </View>

                    {/* To : Sender details */}
                    <View style={styles.invSenderDetails}>
                        <View style={[styles.colFixw]}>
                            <Text style={[styles.comtext, styles.smBold]}>To:</Text>
                        </View>
                        <View style={[styles.colMd8]}>
                            <Text style={styles.comtext}>Attention:</Text>
                            <Text style={styles.comtext}>{invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.name ? invoiceDetails.client_details.name : null}</Text>
                            <Text style={styles.comtext}>ABN: {invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.abn_acn ? invoiceDetails.client_details.abn_acn : null}</Text>
                            <Text style={styles.comtext}>A:{invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.address ? invoiceDetails.client_details.address : null} </Text>
                            <Text style={styles.comtext}>E: {invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.contact_person_email ? invoiceDetails.client_details.contact_person_email : null}</Text>
                            <Text style={styles.comtext}>M: {invoiceDetails && invoiceDetails.client_details && invoiceDetails.client_details.contact_person_phone ? invoiceDetails.client_details.contact_person_phone : null}</Text>
                        </View>
                    </View>

                    {/* Job Location */}
                    {/* <View style={styles.tableWrpa}>
                        <View style={styles.table}>
                            <View style={styles.tr}>
                                <View style={[styles.th, styles.tCol12]}>
                                    <Text style={[styles.cellHdText, styles.textCenter]}>JOB LOCATION</Text>
                                </View>
                            </View>
                            <View style={[styles.tr, styles.brBtton]}>
                                <View style={[styles.td, styles.tCol12]}>
                                    <Text style={[styles.cellText, styles.textCenter]}>{'{location}'}</Text>
                                </View>
                            </View>
                        </View>
                    </View> */}

                    {/* Job Location */}
                    <View style={styles.tableWrpa}>
                        <View style={styles.table}>
                            <View style={styles.tr} fixed>
                                <View style={[styles.th, styles.tCol1]}>
                                    <Text style={[styles.cellHdText, styles.textCenter]}>QTY</Text></View>
                                <View style={[styles.th, styles.tCol4]}>
                                    <Text style={[styles.cellHdText, styles.textCenter]}>DESCRIPTION</Text></View>
                                <View style={[styles.th, styles.tCol3]}>
                                    <Text style={[styles.cellHdText, styles.textCenter]}>LOCATION</Text></View>
                                <View style={[styles.th, styles.tCol2]}>
                                    <Text style={[styles.cellHdText, styles.textCenter]}>IMAGE</Text></View>
                                <View style={[styles.th, styles.tCol2]}>
                                    <Text style={[styles.cellHdText, styles.textCenter]}>AMOUNT</Text></View>
                            </View>

                            {/* loop will Start from here */}
                            {invoiceDetails && invoiceDetails.site_and_task_details && invoiceDetails.site_and_task_details.length > 0 ? invoiceDetails.site_and_task_details.map((siteAndTask) =>
                                siteAndTask.site && siteAndTask.site.tasks.length > 0 ? siteAndTask.site.tasks.map((task, index) =>
                                    <View style={styles.tr}>
                                        <View style={[styles.th, styles.tCol1, styles.nonBgColor]}>
                                            <Text style={styles.cellHdText}>{index + 1}</Text></View>
                                        <View style={[styles.th, styles.tCol4, styles.nonBgColor]}>
                                            <Text style={styles.cellHdText}>{task.task_name} </Text>
                                            <View style={{ marginTop: 5 }}>
                                                <Text style={styles.cellText}>{task.description}</Text>
                                            </View>
                                        </View>
                                        <View style={[styles.th, styles.tCol3, styles.nonBgColor]}>
                                            <Text style={styles.cellText}>{siteAndTask.site.site_name} </Text></View>
                                        <View style={[styles.th, styles.tCol2, styles.nonBgColor]}>
                                            {task && task.file && task.file.length > 0 && task.file[0].file_url ?
                                                <Image style={styles.comLogo} src={task.file[0].file_url} /> : null}
                                        </View>

                                        <View style={[styles.th, styles.tCol2, styles.nonBgColor]}>
                                            <Text style={styles.cellHdText}>${task.outsourced_budget} </Text></View>
                                    </View>
                                ) : null
                            ) : null}
                            {/* loop will End from here */}

                            {/* removel items */}
                            {/* <View style={styles.tr}>
                                <View style={[styles.th, styles.tCol1, styles.nonBgColor]}>
                                    <Text style={styles.cellHdText}>2</Text></View>
                                <View style={[styles.th, styles.tCol5, styles.nonBgColor]}>
                                    <Text style={styles.cellHdText}>{'{task_name_2}'}</Text>
                                    <View style={{ marginTop: 5 }}>
                                        <Text style={styles.cellText}>{'{task_description}'}</Text>
                                    </View>
                                </View>
                                <View style={[styles.th, styles.tCol2, styles.nonBgColor]}>
                                    <Text style={styles.cellText}>{'{task_image}'} </Text></View>
                                <View style={[styles.th, styles.tCol2, styles.nonBgColor]}>
                                    <Text style={styles.cellHdText}></Text></View>
                                <View style={[styles.th, styles.tCol2, styles.nonBgColor]}>
                                    <Text style={styles.cellHdText}></Text></View>
                            </View> */}
                            {/* End */}

                            <View style={styles.tr}>
                                <View style={[styles.td, styles.tCol8, styles.brLtn]}></View>
                                <View style={[styles.td, styles.tCol2, styles.brLtn]}>
                                    <Text style={[styles.cellText, styles.textRight]}>Subtotal</Text></View>
                                <View style={[styles.td, styles.tCol2, styles.brBtton]}>
                                    <Text style={styles.cellHdText}>{invoiceDetails ? currencyFormat(invoiceDetails.sub_total) : null}</Text></View>
                            </View>
                            <View style={[styles.tr, styles.brTn]}>
                                <View style={[styles.td, styles.tCol8, styles.brLtn]}></View>
                                <View style={[styles.td, styles.tCol2, styles.brLtn]}>
                                    <Text style={[styles.cellText, styles.textRight]}>G.S.T</Text></View>
                                <View style={[styles.td, styles.tCol2, styles.brBtton]}>
                                    <Text style={styles.cellHdText}>{invoiceDetails ? currencyFormat((invoiceDetails.total - invoiceDetails.sub_total)) : null}</Text></View>
                            </View>
                            <View style={[styles.tr, styles.brTn]}>
                                <View style={[styles.td, styles.tCol8, styles.brLtn, styles.flxDirRow]}>
                                    <Text style={styles.cellText}>Invoice Prepared By:</Text>
                                    <Text style={styles.invPrePBy}>{JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
                                        (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : null}</Text></View>
                                <View style={[styles.td, styles.tCol2, styles.brLtn]}>
                                    <Text style={[styles.cellText, styles.textRight]}>Total</Text></View>
                                <View style={[styles.td, styles.tCol2, styles.brBtton]}>
                                    <Text style={styles.cellHdText}>{invoiceDetails ? currencyFormat(invoiceDetails.total) : null}</Text></View>
                            </View>

                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
};

export default InvoicePrintPdf;