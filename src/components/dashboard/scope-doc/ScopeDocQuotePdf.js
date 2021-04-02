import React from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Image, PDFViewer, Font } from '@react-pdf/renderer';
import { Strings } from '../../../dataProvider/localize';
import latoHairline from './lato/Lato-Hairline.ttf';
import latoThin from './lato/Lato-Thin.ttf';
import latoLight from './lato/Lato-Light.ttf';
import latoRegular from './lato/Lato-Regular.ttf';
import latoMedium from './lato/Lato-Medium.ttf';
import latoBold from './lato/Lato-Bold.ttf';
import { getStorage, currencyFormat } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import moment from 'moment';
import { abbrivationStr } from '../../../utils/common'

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
    comLogo: { width: 60, height: 60, borderRadius: 100 },
    quotePhotoSt: { width: 60, borderRadius: 2 },
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
    valueWrap: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', width: '100%' },
    valueCard: { backgroundColor: "#c8f7f0", padding: 5, textAlign: 'center', marginTop: 50, marginBottom: 10, borderWidth: 1, borderColor: "#03a791", borderStyle: "solid" },
    totalValue: { flexDirection: 'row', paddingVertical: 10 },
    tvbborder: { borderBottomWidth: 1, borderBottomColor: "#EFEFEF", borderBottomStyle: "solid" },
    valueTxt: { fontSize: 12, color: "#222222", textAlign: "center", fontWeight: 'semibold', fontFamily: 'Lato' },
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
        borderColor: '#222222',
    },
    th: {
        padding: 4, paddingLeft: 5, paddingRight: 5,
        borderLeft: 1,
        borderLeftColor: '#222222',
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
        borderLeftColor: '#222222',
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
    brBtton: { borderBottom: 1, borderBottomColor: '#222222' },

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
    colBrtop: { borderTop: 1, borderTopStyle: 'solid', borderTopColor: '#222222', paddingHorizontal: 4, paddingVertical: 4, paddingLeft: 15, },
    noPadding: { paddingHorizontal: 0, paddingVertical: 0, },
    addPadding: { paddingHorizontal: 4, paddingVertical: 4, paddingLeft: 15, },
    imgAbrSt: {
        backgroundColor: "#03a791",
        width: 50,
        height: 50,
        borderRadius: 50,
        paddingTop: 18,
        textAlign: 'center',
    },
    imgAbrTxt: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 'semibold',
    }
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


const MyDocument = (selectedScopeDocs) => {
    const currentOrg = JSON.parse(getStorage(ADMIN_DETAILS)).organisation;
    var selectedScopeDoc = selectedScopeDocs.selectedScopeDocs ? selectedScopeDocs.selectedScopeDocs : {}
    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.body}>
                    <View style={styles.header}>
                        <View style={[styles.colMd5]}>
                            <Text style={[styles.comtext, styles.wmText]}>{currentOrg && currentOrg.name}</Text>
                            <Text style={[styles.comtext, styles.wmText]}>ABN: {currentOrg && currentOrg.abn_acn}</Text>
                        </View>
                        <View style={styles.colMd2}>
                            {currentOrg && currentOrg.logo ?
                                <Image style={styles.comLogo} src={currentOrg.logo + "?t=" + moment(new Date())} />
                                : <View style={styles.imgAbrSt}>
                                    <Text style={styles.imgAbrTxt}>
                                        {currentOrg && currentOrg.name && abbrivationStr(currentOrg.name)}
                                    </Text></View>}
                        </View>
                        <View style={[styles.colMd5, styles.textRight]}>
                            <Text style={[styles.comtext, styles.wmText, styles.upperCase]}>Quotation</Text>
                        </View>
                    </View>

                    {/* invoice details */}
                    <View style={styles.invoiceAddressName}>
                        <View style={[styles.colMd4]}>
                            <Text style={[styles.comtext, styles.smBold]}>{currentOrg && currentOrg.name}</Text>
                            <Text style={styles.comtext}>A: {currentOrg && currentOrg.address} </Text>
                            <Text style={styles.comtext}>F: {currentOrg && currentOrg.phone_number}</Text>
                        </View>

                        {/* date time and more details */}
                        <View style={[styles.colMd6]}>
                            <View style={styles.invDateTime}>
                                <Text style={[styles.comtext, styles.textRight, styles.colTxt6]}>Quotes No:</Text>
                                <Text style={[styles.comtext, styles.colTxt6, styles.smBold]}>{selectedScopeDoc.quote_number}</Text>
                            </View>
                            <View style={styles.invDateTime}>
                                <Text style={[styles.comtext, styles.textRight, styles.colTxt6]}>Date:</Text>
                                <Text style={[styles.comtext, styles.colTxt6, styles.smBold]}>{moment().format("DD-MM-YYYY")}</Text>
                            </View>
                            {/* <View style={styles.invDateTime}>
                                <Text style={[styles.comtext, styles.textRight, styles.colTxt6]}>Quotation Valid For:</Text>
                                <Text style={[styles.comtext, styles.colTxt6, styles.smBold]}>{''}</Text>
                            </View> */}
                        </View>
                    </View>


                    {/* To : Sender details */}
                    <View style={styles.invSenderDetails}>
                        <View style={[styles.colFixw]}>
                            <Text style={[styles.comtext, styles.smBold]}>To:</Text>
                        </View>
                        <View style={[styles.colMd8]}>
                            <Text style={styles.comtext}>Attention:</Text>
                            <Text style={styles.comtext}>{selectedScopeDoc.client ? selectedScopeDoc.client.name : ''}</Text>
                            {/* <Text style={styles.comtext}>Millennium</Text> */}
                            <Text style={styles.comtext}>{selectedScopeDoc.client ? selectedScopeDoc.client.address : ''}</Text>
                            {/* <Text style={styles.comtext}>E: sash.atanasov@millenniumsg.com</Text> */}
                            <Text style={styles.comtext}>M: {selectedScopeDoc.client_person ? selectedScopeDoc.client_person.phone : ''}</Text>
                        </View>
                    </View>

                    {/* Job Discription */}
                    <View style={styles.tableWrpa}>
                        <View style={styles.table}>
                            <View style={styles.tr} fixed>
                                <View style={[styles.th, styles.tCol7]}>
                                    <Text style={[styles.cellHdText, styles.textCenter]}>DESCRIPTION</Text></View>
                                <View style={[styles.th, styles.tCol2]}>
                                    <Text style={[styles.cellHdText, styles.textCenter]}>PHOTO</Text></View>
                                <View style={[styles.th, styles.tCol3]}>
                                    <Text style={[styles.cellHdText, styles.textCenter]}>AMOUNT</Text></View>
                            </View>
                            {selectedScopeDoc.sites ? selectedScopeDoc.sites.map((site_item, index) => (
                                <>
                                    <View style={styles.tr}>
                                        <View style={[styles.th, styles.tCol12, styles.nonBgColor]}>
                                            <Text style={styles.cellHdText}>{site_item.site.site_name}</Text>
                                            <Text style={styles.cellHdText}>{site_item.site.street_address + ", " + site_item.site.city + ", " + site_item.site.state + ", " + site_item.site.zip_code}</Text>
                                        </View>
                                    </View>
                                    {site_item.tasks && site_item.tasks.map((task_item) => (
                                        <View wrap style={[styles.tr, styles.noPadding]}>
                                            <View style={[styles.th, styles.noPadding, styles.tCol7, styles.nonBgColor,]}>
                                                <View style={[styles.addPadding]}>
                                                    <Text style={styles.cellText}>{task_item.task_name}</Text>
                                                </View>
                                                <View style={[styles.colBrtop]}>
                                                    <Text style={styles.cellText}>{task_item.description}</Text>
                                                </View>
                                                <View style={[styles.colBrtop]}>
                                                    <Text style={styles.cellText}>{task_item.note}</Text>
                                                </View>
                                            </View>
                                            <View style={[styles.th, styles.tCol2, styles.nonBgColor]}>
                                                {task_item && task_item.file && task_item.file.length > 0 && task_item.file[0].file_url ?
                                                    <Image style={styles.quotePhotoSt} src={task_item.file[0].file_url + "?t=" + moment(new Date())} /> : null}</View>
                                            <View style={[styles.th, styles.tCol3, styles.nonBgColor]}>
                                                <Text style={styles.cellHdText}>{currencyFormat(task_item.amount && task_item.amount)}</Text></View>
                                        </View>
                                    ))}
                                </>
                            )) : null}
                            {selectedScopeDoc && selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].equipments
                                ? selectedScopeDoc.quotes[0].equipments.map(eqp => <View style={styles.tr}>
                                    <View style={[styles.td, styles.tCol9]}><Text>{eqp && eqp.equipment && eqp.equipment.name ? eqp.equipment.name : null}</Text></View>
                                    <View style={[styles.td, styles.tCol3]}>
                                        <Text style={styles.cellHdText}>{eqp && eqp.equipment_cost ? currencyFormat(eqp.equipment_cost) : null}</Text></View>
                                </View>) : null}

                            <View style={styles.tr}>
                                <View style={[styles.td, styles.tCol7, styles.brLtn]}></View>
                                <View style={[styles.td, styles.tCol2, styles.brLtn]}>
                                    <Text style={[styles.cellText, styles.textRight]}>Subtotal</Text></View>
                                <View style={[styles.td, styles.tCol3, styles.brBtton]}>
                                    <Text style={styles.cellHdText}>{selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] &&
                                        selectedScopeDoc.quotes[0].sub_total_amount ? currencyFormat(selectedScopeDoc.quotes[0].sub_total_amount) : null}</Text></View>
                            </View>
                            <View style={[styles.tr, styles.brTn]}>
                                <View style={[styles.td, styles.tCol7, styles.brLtn]}></View>
                                <View style={[styles.td, styles.tCol2, styles.brLtn]}>
                                    <Text style={[styles.cellText, styles.textRight]}>G.S.T</Text></View>
                                <View style={[styles.td, styles.tCol3, styles.brBtton]}>
                                    <Text style={styles.cellHdText}>{selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].total_amount
                                        && selectedScopeDoc.quotes[0].sub_total_amount
                                        ? currencyFormat((selectedScopeDoc.quotes[0].total_amount - selectedScopeDoc.quotes[0].sub_total_amount)) : ''}</Text></View>
                            </View>
                            <View style={[styles.tr, styles.brTn]}>
                                <View style={[styles.td, styles.tCol7, styles.brLtn, styles.flxDirRow]}>
                                    <Text style={styles.cellText}>Quote Prepared By:</Text>
                                    <Text style={styles.invPrePBy}>{JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
                                        (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ? JSON.parse(getStorage(ADMIN_DETAILS)).last_name : "") : null}</Text></View>
                                <View style={[styles.td, styles.tCol2, styles.brLtn]}>
                                    <Text style={[styles.cellText, styles.textRight]}>Total</Text></View>
                                <View style={[styles.td, styles.tCol3, styles.brBtton]}>
                                    <Text style={styles.cellHdText}>{selectedScopeDoc.quotes && selectedScopeDoc.quotes[0] && selectedScopeDoc.quotes[0].total_amount
                                        ? currencyFormat(selectedScopeDoc.quotes[0].total_amount) : null}</Text></View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.valueWrap}>
                        <View style={[styles.valueCard, styles.colMd10]}>
                            <Text style={[styles.valueTxt]}>Thank you for requesting a quote from {currentOrg && currentOrg.name}</Text>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
};

export default MyDocument;