import React from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Image, PDFViewer, Font } from '@react-pdf/renderer';
// import { Strings } from '../../../dataProvider/localize';
import latoHairline from '../../scope-doc/lato/Lato-Hairline.ttf';
import latoThin from '../../scope-doc/lato/Lato-Thin.ttf';
import latoLight from '../../scope-doc/lato/Lato-Light.ttf';
import latoRegular from '../../scope-doc/lato/Lato-Regular.ttf';
import latoMedium from '../../scope-doc/lato/Lato-Medium.ttf';
import latoBold from '../../scope-doc/lato/Lato-Bold.ttf';
import { abbrivationStr } from '../../../../utils/common'
import moment from 'moment'

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
    page: { backgroundColor: '#ffffff', paddingBottom: 20, fontSize: 10, fontFamily: 'Lato', fontWeight: "normal", color: "#4A4A4A" },
    body: { padding: 20 },
    image: { backgroundColor: 'grey', padding: 10, width: 30, height: 30 },
    header: { backgroundColor: '#F8F8F8', padding: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    comtext: { color: '#4A4A4A', fontFamily: 'Lato', fontWeight: 'normal', fontSize: 8, fontWeight: 'normal', paddingBottom: 3, },
    comTitle: { color: '#4A4A4A', fontSize: 11, fontFamily: 'Lato', fontWeight: 'normal', paddingBottom: 2, },
    title: { color: '#4A4A4A', fontSize: 20, fontWeight: 'semibold', padding: 20, textAlign: 'center' },
    docHeading: { color: '#4A4A4A', fontSize: 14, fontFamily: 'Lato', fontWeight: 'medium', paddingHorizontal: 10, textAlign: 'center' },
    colMd: { width: "33.33%" },
    comLogo: { width: 60 },
    logoWRedis: { borderRadius:50, width: 60, height:60 },
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
        borderBottomWidth: 0,
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
    brTopNon: { borderTopWidth: 0 },
    imgAbrSt: {
        backgroundColor: "#03a791",
        width: 50,
        height: 50,
        borderRadius: 50,
        paddingTop: 18,
        textAlign: 'center',
    },
    imgAbrTxt:{
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 'semibold',
    }
});

const JobReportPdf = ({ job, jobReports, filePath }) => {
    return (
        <Document>
            <Page style={styles.page}>
                <View style={styles.body}>
                    <View style={styles.header}>
                        <View style={[styles.colMd10]}>
                            <Text style={styles.comtext}>{job.org_details && job.org_details.name}</Text>
                            <Text style={styles.comtext}>ABN: {job.org_details && job.org_details.abn_acn ? job.org_details.abn_acn : null}</Text>
                            {/* <Text style={styles.comtext}>W: {job.org_details && job.org_details.website && job.org_details.website ? job.org_details.website : null}</Text> */}
                            <Text style={styles.comtext}>A: {job.org_details && job.org_details.address ? job.org_details.address : null}</Text>
                            <Text style={styles.comtext}>E: {job.org_details && job.org_details.contact_person_email ? job.org_details.contact_person_email : null}</Text>
                            {/* <Text style={styles.comtext}>F: 0383980899</Text> */}
                        </View>
                        <View style={[styles.colMd2, styles.textRight]}>
                            {job.quote && job.org_details.client_logo ?
                                <Image style={[styles.comLogo,styles.logoWRedis]} src={job.org_details.client_logo +"?t="+ moment(new Date())} /> : <View style={styles.imgAbrSt}>
                                <Text style={styles.imgAbrTxt}>
                                {job.org_details && job.org_details.name&& abbrivationStr(job.org_details.name)}
                                </Text></View>}
                        </View>
                    </View>

                    <View style={styles.bigHeading}>
                        <Text style={styles.h1Heding}>Job Report</Text>
                        <Text style={styles.h3Heading}>{job.job_name}</Text>
                    </View>

                    <View style={styles.sfCard}>
                        <View style={styles.tableWrpa}>
                            <View style={styles.table}>
                                <View style={[styles.tr, styles.brTopNon]} fixed>
                                    <View style={[styles.th, styles.tCol2]}><Text style={styles.cellHdText}>Area</Text></View>
                                    <View style={[styles.th, styles.tCol2]}><Text style={styles.cellHdText}>Area Photos</Text></View>
                                    <View style={[styles.th, styles.tCol2]}><Text style={styles.cellHdText}>Before Photos</Text></View>
                                    <View style={[styles.th, styles.tCol2]}><Text style={styles.cellHdText}>After Photos</Text></View>
                                    <View style={[styles.th, styles.tCol2]}><Text style={styles.cellHdText}>Note</Text></View>
                                    <View style={[styles.th, styles.tCol2]}><Text style={styles.cellHdText}>Record by</Text></View>
                                </View>
                                {jobReports.map((report, index) =>
                                    <View style={styles.tr}>
                                        <View style={[styles.td, styles.tCol2]}>
                                            <Text style={styles.cellText}>{report.area}</Text></View>
                                        <View style={[styles.td, styles.tCol2]}>
                                            {report.location_photo && JSON.parse(report.location_photo).length > 0 ?
                                                JSON.parse(report.location_photo).map(link =>
                                                    <Image style={styles.comLogo} src={filePath + link +"?t="+ moment(new Date())} />) : null}
                                        </View>
                                        <View style={[styles.td, styles.tCol2]}>
                                            {report.before_photo && JSON.parse(report.before_photo).length > 0 ?
                                                JSON.parse(report.before_photo).map(link =>
                                                    <Image style={styles.comLogo} src={filePath + link +"?t="+ moment(new Date())} />) : null}
                                        </View>
                                        <View style={[styles.td, styles.tCol2]}>
                                            {report.after_photo && JSON.parse(report.after_photo).length > 0 ?
                                                JSON.parse(report.after_photo).map(link =>
                                                    <Image style={styles.comLogo} src={filePath + link +"?t="+ moment(new Date())} />) : null}
                                        </View>
                                        <View style={[styles.td, styles.tCol2]}>
                                            <Text style={styles.cellText}>{report.note ? report.note : null}</Text></View>
                                        <View style={[styles.td, styles.tCol2]}>
                                            <Text style={styles.cellText}>{report.photo_taken_by ? report.photo_taken_by : null}</Text></View>
                                    </View>

                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    )
};

export default JobReportPdf;