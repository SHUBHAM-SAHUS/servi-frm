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
import { abbrivationStr } from '../../../../utils/common'

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
    header: { backgroundColor: '#F8F8F8', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    comtext: { color: '#4A4A4A', fontFamily: 'Lato', fontWeight: 'normal', fontSize: 8, fontWeight: 'normal', paddingBottom: 3, },
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
        fontFamily: 'Lato'
    },
    tr: {
        margin: "auto",
        flexDirection: "row",
        borderStyle: "solid",
        borderWidth: 1,
        borderColor: "#EFEFEF",
        borderLeftWidth: 0,
        borderTopWidth: 0,
        borderRightWidth: 0,
    },
    th: { padding: 8, paddingLeft: 5, paddingRight: 5 },
    cellHdText: {
        fontSize: 10,
        fontWeight: "medium",
        color: "#4a4a4a",
        fontFamily: 'Lato'
    },

    td: { padding: 8, paddingLeft: 5, paddingRight: 5 },
    cellText: {
        fontSize: 10,
        fontWeight: "light",
        color: "#4a4a4a",
        fontFamily: 'Lato'
    },

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

const SignoffSheetPdf = ({ signOffDetails, jobDetails }) => {

    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.body}>
                    <View style={styles.header}>
                        <View style={[styles.colMd10]}>
                            <Text style={styles.comtext}>{jobDetails.org_details && jobDetails.org_details.name}</Text>
                            <Text style={styles.comtext}>ABN: {jobDetails.org_details && jobDetails.org_details.abn_acn ? jobDetails.org_details.abn_acn : null}</Text>
                            {/* <Text style={styles.comtext}>W: {jobDetails.org_details && jobDetails.org_details.website && jobDetails.org_details.website ? jobDetails.org_details.website : null}</Text> */}
                            <Text style={styles.comtext}>A: {jobDetails.org_details && jobDetails.org_details.address ? jobDetails.org_details.address : null}</Text>
                            <Text style={styles.comtext}>E: {jobDetails.org_details && jobDetails.org_details.contact_person_email ? jobDetails.org_details.contact_person_email : null}</Text>
                            {/* <Text style={styles.comtext}>F: 0383980899</Text> */}
                        </View>
                        <View style={[styles.colMd2, styles.textRight]}>
                            {jobDetails.quote && jobDetails.org_details.client_logo ?
                                <Image style={styles.comLogo} src={jobDetails.org_details.client_logo + "?t=" + moment(new Date())} /> : <View style={styles.imgAbrSt}>
                                    <Text style={styles.imgAbrTxt}>
                                        {jobDetails.org_details && jobDetails.org_details.name && abbrivationStr(jobDetails.org_details.name)}
                                    </Text></View>}
                        </View>
                    </View>

                    <View style={styles.bigHeading}>
                        <Text style={styles.h1Heding}>{Strings.sign_off_sheet}</Text>
                    </View>

                    {/* Job Details */}
                    {/* <View style={styles.sfCard}>
                        <Text style={styles.cardTitle}>{Strings.safe_work_method_statement_swms}</Text>
                        <View style={styles.cardRow}>
                            <View style={[styles.cardCol, styles.colBorder, styles.pl1]}>
                                <Text style={styles.cardTxtBold}>{Strings.abn}</Text>
                                <Text style={styles.cardTxtlight}>{signOffDetails.quote && signOffDetails.quote.client.abn_acn}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>{Strings.phone}</Text>
                                <Text style={styles.cardTxtlight}>{signOffDetails.quote && signOffDetails.quote.client.contact_person_phone}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>{Strings.email_txt}</Text>
                                <Text style={styles.cardTxtlight}>{signOffDetails.quote && signOffDetails.quote.client.contact_person_email}</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>{Strings.address_txt}</Text>
                                <Text style={styles.cardTxtlight}>{signOffDetails.quote && signOffDetails.quote.client.address}</Text>
                            </View>
                        </View>
                    </View> */}

                    {/* Scope of Work */}

                    <View style={styles.sfCard}>
                        <Text style={styles.cardTitle}>{Strings.job_service_details}</Text>
                        {signOffDetails.quote
                            && signOffDetails.quote.scope_doc
                            && signOffDetails.quote.scope_doc.scope_docs_sites
                            && signOffDetails.quote.scope_doc.scope_docs_sites.length > 0 ?
                            signOffDetails.quote.scope_doc.scope_docs_sites.map(site => <View>
                                <View style={styles.cardRow}>
                                    <View style={[styles.cardCol, styles.colBorder]}>
                                        <Text style={styles.cardTxtBold}>{Strings.job_name}</Text>
                                        <Text style={styles.cardTxtlight}>{site.site.job_name}</Text>
                                    </View>
                                    <View style={[styles.cardCol, styles.colBorder]}>
                                        <Text style={styles.cardTxtBold}>{Strings.site_name}</Text>
                                        <Text style={styles.cardTxtlight}>{site.site.site_name}</Text>
                                    </View>
                                    <View style={[styles.cardCol]}>
                                        <Text style={styles.cardTxtBold}>{Strings.address_txt}</Text>
                                        <Text style={styles.cardTxtlight}>{site.site.street_address}{site.site.city}{site.site.state}{site.site.zip_code}</Text>
                                    </View>
                                </View>
                                <View style={styles.sfScWork}>
                                    {site && site.site && site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map(task => <View style={[styles.cardRow, styles.borderWB2]}>
                                        <View style={[styles.cardCol, styles.colBorder, styles.colMd5]}>
                                            <Text style={styles.cardTxtBold}>{task.task_name}</Text>
                                            <Text style={styles.cardTxtlight}>{task && task.description ? task.description : ''}</Text>
                                        </View>
                                        <View style={[styles.cardCol, styles.colBorder, styles.colMd3]}>
                                            <Text style={styles.cardTxtBold}>{Strings.area_txt}</Text>
                                            <Text style={styles.cardTxtlight}>{task && task.areas && task.areas.length > 0 ? task.areas.map((area, index) => {
                                                return area && area.area_name ? task.areas.length - 1 === index ? area.area_name : area.area_name + ", " : ""
                                            }) : ''}</Text>
                                        </View>
                                        <View style={[styles.cardCol, styles.colBorder, styles.colMd5]}>
                                            <Text style={styles.cardTxtBold}>Notes</Text>
                                            <Text style={styles.cardTxtlight}>{task && task.note ? task.note : ''}</Text>
                                        </View>
                                    </View>
                                    ) : null}
                                </View>
                            </View>
                            ) : null}
                    </View>
                    {/* <View style={styles.sfCard}>
                        <Text style={styles.cardTitle}>{Strings.site_details}</Text>
                        <View>
                            <View style={styles.cardRow}>
                                <View style={[styles.cardCol, styles.colBorder]}>
                                    <Text style={styles.cardTxtBold}>{Strings.job_name}</Text>
                                    <Text style={styles.cardTxtlight}>{site.site.job_name}</Text>
                                </View>
                                <View style={[styles.cardCol, styles.colBorder]}>
                                    <Text style={styles.cardTxtBold}>{Strings.site_name}</Text>
                                    <Text style={styles.cardTxtlight}>{site.site.site_name}</Text>
                                </View>
                                <View style={[styles.cardCol]}>
                                    <Text style={styles.cardTxtBold}>{Strings.address_txt}</Text>
                                    <Text style={styles.cardTxtlight}>{site.site.street_address}{site.site.city}{site.site.state}{site.site.zip_code}</Text>
                                </View>
                            </View>
                            <View style={styles.sfScWork}>
                                <View style={[styles.cardRow, styles.borderWB2]}>
                                    <View style={[styles.cardCol, styles.colBorder, styles.cardCol]}>
                                        <Text style={styles.cardTxtBold}>Roof Cleaning</Text>
                                        <Text style={styles.cardTxtlight}>Lorem ipsum dolor sit amet, conse adipiscing elit, dolor sit amet, conse adipiscing elit</Text>
                                    </View>
                                    <View style={[styles.cardCol, styles.cardCol]}>
                                        <Text style={styles.cardTxtBold}>Area</Text>
                                        <Text style={styles.cardTxtlight}>Gymnasium, Kitchen</Text>
                                    </View>
                                </View>

                                <View style={[styles.cardRow, styles.borderWB2]}>
                                    <View style={[styles.cardCol, styles.colBorder, styles.cardCol]}>
                                        <Text style={styles.cardTxtBold}>Roof Cleaning</Text>
                                        <Text style={styles.cardTxtlight}>Lorem ipsum dolor sit amet, conse adipiscing elit, dolor sit amet, conse adipiscing elit</Text>
                                    </View>
                                    <View style={[styles.cardCol, styles.cardCol]}>
                                        <Text style={styles.cardTxtBold}>Area</Text>
                                        <Text style={styles.cardTxtlight}>Gymnasium, Kitchen</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View> */}


                    {/* Details to be filled by Client */}
                    {signOffDetails && signOffDetails.job_sheet_sign_off_status === 1 && signOffDetails.client_name === null && signOffDetails.signed_off_date === null ? null :
                        <View style={styles.sfCard}>
                            <Text style={styles.cardTitle}>{Strings.details_to_be_filled}</Text>
                            <View style={styles.cardRow}>
                                <View style={[styles.cardCol]}>
                                    <Text style={styles.cardTxtBold}>{Strings.client_name}</Text>
                                    <Text style={styles.cardTxtlight}>{signOffDetails.client_name}</Text>
                                </View>
                                <View style={[styles.cardCol]}>
                                    <Text style={styles.cardTxtBold}>{Strings.date_txt}</Text>
                                    <Text style={styles.cardTxtlight}>{moment(signOffDetails.signed_off_date).format("DD/MM/YYYY")}</Text>
                                </View>
                                <View style={[styles.cardCol, styles.colMd12]}>
                                    <Text style={styles.cardTxtBold}>{Strings.feegback_txt}</Text>
                                    <Text style={styles.cardTxtlight}>{signOffDetails.feedback}</Text>
                                </View>
                                <View style={[styles.cardCol, styles.colMd12]}>
                                    <Text style={styles.cardTxtBold}>{Strings.sf_signature}</Text>
                                    {signOffDetails.job_sheet_sign ? <Image style={styles.userSign} src={signOffDetails.job_sheet_sign} /> : null}
                                </View>
                            </View>
                        </View>
                    }
                </View>
            </Page>
        </Document>
    )
};

export default SignoffSheetPdf;