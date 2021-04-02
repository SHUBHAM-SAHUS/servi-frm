import React from 'react';
import { Page, Text, View, Document, StyleSheet, pdf, Image, PDFViewer, Font } from '@react-pdf/renderer';
import { Strings } from '../../../../../dataProvider/localize';
import latoHairline from '../../../scope-doc/lato/Lato-Hairline.ttf';
import latoThin from '../../../scope-doc/lato/Lato-Thin.ttf';
import latoLight from '../../../scope-doc/lato/Lato-Light.ttf';
import latoRegular from '../../../scope-doc/lato/Lato-Regular.ttf';
import latoMedium from '../../../scope-doc/lato/Lato-Medium.ttf';
import latoBold from '../../../scope-doc/lato/Lato-Bold.ttf';
import { Row } from 'antd';
import moment from 'moment';

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
    incCategoryList: { flexDirection: "row", flexWrap: "wrap" },
    inccItems: { flexDirection: 'row', alignItems: 'center', padding: 10 },
    inccText: { fontSize: 11, fontWeight: 'light' },
    inccBullet: { width: 3, height: 3, backgroundColor: "#4a4a4a", borderRadius: 100, marginRight: 5 },
    inccViewImg: { width: 40, height: 35, marginLeft: 10, marginBottom: 10, border: 1, borderStyle: 'solid', borderRadius: 2, borderColor: '#EFEFEF' },
    imgRowSpace: { paddingLeft: 0, paddingRight: 10, paddingTop: 10, paddingBottom: 0 },
    borderBtm: {
        borderBottom: 1, borderBottomStyle: 'solid', borderBottomColor: '#EFEFEF', marginBottom: 10,
    }

});

const HazardReportPdf = (props) => {
    const { users, job } = props
    const basicHazardDetails = props.hazardDetails && props.hazardDetails.length > 0 ? props.hazardDetails[0] : undefined

    return (
        <Document>
            <Page wrap style={styles.page}>
                <View style={styles.body}>
                    <View style={styles.header}>
                        <View style={[styles.colMd10]}>
                            <Text style={styles.comtext}>{job.quote && job.quote.client.name}</Text>
                            <Text style={styles.comtext}>ABN: {job.quote && job.quote.client.abn_acn ? job.quote.client.abn_acn : null}</Text>
                            {/* <Text style={styles.comtext}>W: {job.quote && job.quote.client.website && job.quote.client.website ? job.quote.client.website : null}</Text> */}
                            <Text style={styles.comtext}>A: {job.quote && job.quote.client.address ? job.quote.client.address : null}</Text>
                            <Text style={styles.comtext}>F: {job.quote && job.quote.client.contact_person_phone ? job.quote.client.contact_person_phone : null}</Text>
                        </View>
                        <View style={[styles.colMd2, styles.textRight]}>
                            {job.quote && job.quote.client.client_logo ?
                                <Image style={styles.comLogo} src={job.quote.client.client_logo} /> : null}
                        </View>
                    </View>

                    <View style={styles.bigHeading}>
                        <Text style={styles.h1Heding}>Assign Hazard Report</Text>
                    </View>

                    {/* Personal Details */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Personal Details</Text>
                        <View style={styles.cardRow}>
                            <View style={[styles.cardCol, styles.colBorder, styles.pl1]}>
                                <Text style={styles.cardTxtBold}>Name</Text>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.reporter_details && basicHazardDetails.reporter_details.first_name}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder, styles.pl1]}>
                                <Text style={styles.cardTxtBold}>Position</Text>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.reporter_details && basicHazardDetails.reporter_details.role_name}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder, styles.pl1]}>
                                <Text style={styles.cardTxtBold}>Responsible Person</Text>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.responsible_person_details && basicHazardDetails.responsible_person_details.first_name}</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>Responsible Person Position</Text>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.responsible_person_details && basicHazardDetails.responsible_person_details.role_name}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Hazard Details */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Hazard Details</Text>
                        <View style={styles.cardRow}>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>Date & Time of Report</Text>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.hazard_date &&
                                    `${moment(basicHazardDetails.hazard_date).format("MM-DD-YYYY")}, ${moment(basicHazardDetails.hazard_time).format("HH:MM A")}`}</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>Location</Text>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.hazard_location}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colMd12]}>
                                <Text style={styles.cardTxtBold}>Description</Text>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.description}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>Consequences</Text>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.consequence_before_control.name}</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>Likelihood</Text>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.likelihood_before_control.name}</Text>
                            </View>
                        </View>

                    </View>

                    {/* Hazard Categories */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Hazard Categories</Text>
                        <View style={styles.incCategoryList}>
                            {basicHazardDetails && basicHazardDetails.hazard_categories &&
                                basicHazardDetails.hazard_categories.map(item =>
                                    <View style={[styles.inccItems]}>
                                        <Text style={styles.inccBullet}></Text>
                                        <Text style={[styles.inccText]}>{item.name}</Text>
                                    </View>)}
                        </View>
                    </View>

                    {/* Immediate Action Taken When Hazard Identified */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Immediate Action Taken When Hazard Identified</Text>
                        <View style={styles.cardRow}>
                            <View style={[styles.cardCol, styles.colMd12]}>
                                <Text style={styles.cardTxtlight}>{basicHazardDetails && basicHazardDetails.immediate_action_taken}</Text>
                            </View>
                        </View>
                    </View>

                </View>
            </Page>
        </Document>
    )
};

export default HazardReportPdf;