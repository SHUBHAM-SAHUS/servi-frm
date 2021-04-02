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
    logoWRedis: { borderRadius: 50, width: 60, height: 60 },
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
    txtBulletB: { width: 3, height: 3, backgroundColor: "#4a4a4a", borderRadius: 100, marginRight: 3 },
    dFlex: { flexDirection: "row", alignItems: "center" },
    bigSwmsBnt: { fontSize: 12, color: '#222', paddingHorizontal: 5, paddingVertical: 8, borderBottomStyle: 'solid', borderColor: '#fafafa', borderBottomWidth: 1 },
    smSwmsBnt: { fontSize: 11, color: '#222', paddingHorizontal: 5, paddingVertical: 8, borderBottomStyle: 'solid', borderColor: '#fafafa', borderBottomWidth: 1 },
    swmsPdfItems: { paddingHorizontal: 5, marginBottom: 10, },
    swmsTaskPdfItems: { paddingHorizontal: 5, marginBottom: 10, },
    swmsTaskPdfTable: { paddingHorizontal: 5, },
    smSMallText: { fontSize: 8, color: '#C8C8C8' },
    smDocThBg: { backgroundColor: '#4A4A4A', color: '#ffffff' },
    brLft: { borderLeftStyle: 'solid', borderLeftColor: '#dddddd', borderLeftWidth: 0.5, borderBottomWidth: 0 },
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
    return null
}


const SignSWMSPdf = ({ jobDetails, swmsSignDetails, taskSWMS, swmsDoc, allStaffList }) => {
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
    return (
        <Document>
            <Page wrap size="A2" style={styles.page}>
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
                                <Image style={[styles.comLogo, styles.logoWRedis]} src={jobDetails.org_details.client_logo + "?t=" + moment(new Date())} /> : <View style={styles.imgAbrSt}>
                                    <Text style={styles.imgAbrTxt}>
                                        {jobDetails.org_details && jobDetails.org_details.name && abbrivationStr(jobDetails.org_details.name)}
                                    </Text></View>}
                        </View>
                    </View>

                    <View style={styles.bigHeading}>
                        <Text style={styles.h1Heding}>Safe Work Method Statement (SWMS)</Text>
                    </View>

                    {/* Safe Work Method Statement (SWMS) */}
                    {/* <View style={styles.sfCard}>
                        <Text style={styles.cardTitle}>{Strings.safe_work_method_statement_swms}</Text>
                        <View style={styles.cardRow}>
                            <View style={[styles.cardCol, styles.colBorder, styles.pl1]}>
                                <Text style={styles.cardTxtBold}>{Strings.abn}</Text>
                                <Text style={styles.cardTxtlight}>{jobDetails.quote && jobDetails.quote.client.abn_acn}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>{Strings.phone}</Text>
                                <Text style={styles.cardTxtlight}>{jobDetails.quote && jobDetails.quote.client.contact_person_phone}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>{Strings.email_txt}</Text>
                                <Text style={styles.cardTxtlight}>{jobDetails.quote && jobDetails.quote.client.contact_person_email}</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>{Strings.address_txt}</Text>
                                <Text style={styles.cardTxtlight}>{jobDetails.quote && jobDetails.quote.client.address}</Text>
                            </View>
                        </View>
                    </View> */}

                    {/* Site Details */}
                    <View style={styles.sfCard}>
                        <Text style={styles.cardTitle}>{Strings.site_details}</Text>
                        <View style={styles.sfCardBody}>
                            <View style={styles.siteDetailsWrap}>
                                {sites && sites.map((site, index) =>
                                    <View style={styles.siteDetailsItems}>
                                        <Text style={styles.siteName}>{site.site.site_name}</Text>
                                        <View style={styles.siteDetailsContent}>
                                            <View style={styles.cardRow}>
                                                <View style={[styles.cardCol, styles.colBorder, styles.pl1]}>
                                                    <Text style={styles.cardTxtBold}>{Strings.site_name}</Text>
                                                    <Text style={styles.cardTxtlight}>{site.site.site_name}</Text>
                                                </View>
                                                <View style={[styles.cardCol, styles.colBorder]}>
                                                    <Text style={styles.cardTxtBold}>{Strings.address_txt}</Text>
                                                    <Text style={styles.cardTxtlight}>{site.site.street_address}</Text>
                                                </View>
                                                <View style={[styles.cardCol]}>
                                                    <Text style={styles.cardTxtBold}>{Strings.swms_no}</Text>
                                                    <Text style={styles.cardTxtlight}>{Strings.swms_no}</Text>
                                                </View>
                                            </View>
                                            <View style={styles.siteNoteCard}>
                                                <Text style={styles.noteText}>All person involved in the works must have the SWMS explained and communicated to them prior to start of works.</Text>
                                            </View>
                                        </View>
                                    </View>)}

                            </View>
                        </View>
                    </View>

                    {/* Staff Details */}
                    <View style={styles.sfCard}>
                        <Text style={styles.cardTitle}>{Strings.staff_details}</Text>
                        <View style={styles.sfCardBody}>
                            <View style={styles.staffSiteList}>
                                <View style={styles.table}>
                                    <View style={styles.tr} fixed>
                                        <View style={[styles.th, styles.tCol3]}>
                                            <Text style={styles.cellHdText}>Name</Text>
                                        </View>
                                        <View style={[styles.th, styles.tCol3]}>
                                            <Text style={styles.cellHdText}>Position</Text>
                                        </View>
                                        <View style={[styles.th, styles.tCol6]}>
                                            <Text style={styles.cellHdText}>Note</Text>
                                        </View>
                                    </View>
                                    <View>
                                        <View>
                                            {allStaffList && allStaffList.length > 0 ?
                                                allStaffList.map(staff => {
                                                    return <View style={styles.tr}>
                                                        <View style={[styles.td, styles.tCol3]}>
                                                            <Text style={styles.cellText}>{staff && staff.first_name ? staff.first_name : null}</Text>
                                                        </View>
                                                        <View style={[styles.td, styles.tCol3]}>
                                                            <Text style={styles.cellText}>{staff && staff.role_name ? staff.role_name : null}</Text>
                                                        </View>
                                                        <View style={[styles.td, styles.tCol6]}>
                                                            <Text style={styles.cellText}>All person involved in the works must have the SWMS explained and communicated to them.</Text>
                                                        </View>
                                                    </View>
                                                })
                                                : null}
                                        </View>
                                    </View>
                                </View>
                            </View>


                            {/* {jobDetails.quote
                                && jobDetails.quote.scope_doc
                                && jobDetails.quote.scope_doc.scope_docs_sites
                                && jobDetails.quote.scope_doc.scope_docs_sites.length > 0 ? jobDetails.quote.scope_doc.scope_docs_sites.map(site =>
                                    <View style={styles.staffSiteList}>
                                        <Text style={styles.sSiteTitle}>{site.site && site.site.site_name}</Text>

                                        {site && site.site && site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map((task, taskIndex) => <View style={styles.staffTaskList}>
                                            <Text style={styles.sTaskTitle}>{task && task.task_name}</Text>
                                            <View style={styles.table}>
                                                <View style={styles.tr} fixed>
                                                    <View style={[styles.th, styles.tCol3]}>
                                                        <Text style={styles.cellHdText}>Name</Text>
                                                    </View>
                                                    <View style={[styles.th, styles.tCol3]}>
                                                        <Text style={styles.cellHdText}>Position</Text>
                                                    </View>
                                                    <View style={[styles.th, styles.tCol6]}>
                                                        <Text style={styles.cellHdText}>Note</Text>
                                                    </View>
                                                </View>
                                                {task && task.job_schedules && task.job_schedules.length > 0 ? task.job_schedules.map((job_schedule, job_schedule_index) => <View>
                                                    {job_schedule && job_schedule.job_schedule_shifts && job_schedule.job_schedule_shifts.length > 0 ? job_schedule.job_schedule_shifts.map((shift, index) =>
                                                        <View>
                                                            {shift && shift.job_allocated_users && shift.job_allocated_users.length > 0 ? shift.job_allocated_users.map(user => {
                                                                return <View>
                                                                    <View style={styles.tr}>
                                                                        <View style={[styles.td, styles.tCol3]}>
                                                                            <Text style={styles.cellText}>{user && user.first_name ? user.first_name : null}</Text>
                                                                        </View>
                                                                        <View style={[styles.td, styles.tCol3]}>
                                                                            <Text style={styles.cellText}>{user && user.role_name ? user.role_name : null}</Text>
                                                                        </View>
                                                                        <View style={[styles.td, styles.tCol6]}>
                                                                            <Text style={styles.cellText}>All person involved in the works must have the SWMS explained and communicated to them.</Text>
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            }
                                                            ) : <View />}
                                                        </View>
                                                    ) : <View />}
                                                </View>
                                                ) : <View />}
                                            </View>
                                        </View>
                                        ) : <View />}
                                    </View>
                                ) : <View />} */}
                        </View>
                    </View>

                    {/* SWMS Details */}
                    <View style={styles.sfCard}>
                        <Text style={styles.cardTitle}>{Strings.swms_txt}</Text>
                        <View style={styles.swmsPdfWrap}>

                            {/* add mapping from here */}
                            {taskSWMS && taskSWMS.length > 0 ? taskSWMS.map((task_swms, index) =>
                                <View style={styles.swmsPdfItems}>
                                    <Text style={styles.bigSwmsBnt}>{task_swms && task_swms.name ? task_swms.name : null}</Text>
                                    {task_swms && task_swms.areas && task_swms.areas.length > 0 ? task_swms.areas.map((area, index) => <View style={styles.swmsTaskPdfItems}>
                                        <Text style={styles.smSwmsBnt}>{area && area.area_name ? area.area_name : null}</Text>
                                        <View style={styles.swmsTaskPdfTable}>
                                            <View style={styles.table}>
                                                <View wrap={true} style={styles.tr} fixed>
                                                    <View style={[styles.th, styles.tCol3]}>
                                                        <Text>SWMS Activity</Text>
                                                    </View>
                                                    <View style={[styles.th, styles.tCol2]}>
                                                        <Text>PPE</Text>
                                                    </View>
                                                    <View style={[styles.th, styles.tCol2]}>
                                                        <Text>Tool Type</Text>
                                                    </View>
                                                    <View style={[styles.th, styles.tCol3]}>
                                                        <Text>High Risk Work</Text>
                                                    </View>
                                                    <View style={[styles.th, styles.tCol2]}>
                                                        <Text>Chemicals</Text>
                                                    </View>
                                                </View>
                                                <View wrap={true} style={styles.tr}>
                                                    <View style={[styles.td, styles.tCol3]}>
                                                        {/* map will use here         */}
                                                        {area && area.swms_doc && area.swms_doc.length > 0 ? area.swms_doc.map(swms_doc => <View style={styles.dFlex}>
                                                            <Text style={styles.txtBulletB}>.</Text>
                                                            <Text style={styles.cardTxtlight}>{swms_doc && swms_doc.activity ? swms_doc.activity : null}</Text>
                                                        </View>) : null}
                                                        {/* end */}
                                                    </View>
                                                    <View style={[styles.td, styles.tCol2]}>
                                                        {area && area.ppe && area.ppe.length > 0 ? area.ppe.map(ppe =>
                                                            <View style={styles.dFlex}>
                                                                <Text style={styles.txtBulletB}>.</Text>
                                                                <Text style={styles.cardTxtlight}>{ppe && ppe.name ? ppe.name : null}</Text>
                                                            </View>) : null}
                                                    </View>
                                                    <View style={[styles.td, styles.tCol2]}>
                                                        {area && area.tool_type && area.tool_type.length > 0 ? area.tool_type.map(tool_type =>
                                                            <View style={styles.dFlex}>
                                                                <Text style={styles.txtBulletB}>.</Text>
                                                                <Text style={styles.cardTxtlight}>{tool_type && tool_type.name ? tool_type.name : null}</Text>
                                                            </View>) : null}
                                                    </View>
                                                    <View style={[styles.td, styles.tCol3]}>
                                                        {area && area.hig_risk_work && area.hig_risk_work.length > 0 ? area.hig_risk_work.map(hig_risk_work =>
                                                            <View style={styles.dFlex}>
                                                                <Text style={styles.txtBulletB}>.</Text>
                                                                <Text style={styles.cardTxtlight}>{hig_risk_work && hig_risk_work.name ? hig_risk_work.name : null}</Text>
                                                            </View>) : null}
                                                    </View>
                                                    <View style={[styles.td, styles.tCol2]}>
                                                        {area && area.chemical && area.chemical.length > 0 ? area.chemical.map(chemical =>
                                                            <View style={styles.dFlex}>
                                                                <Text style={styles.txtBulletB}>.</Text>
                                                                <Text style={styles.cardTxtlight}>{chemical && chemical.name ? chemical.name : null}</Text>
                                                            </View>) : null}
                                                    </View>
                                                </View>

                                            </View>
                                        </View>
                                    </View>) : null}
                                </View>) : null}
                            {/* end here */}
                        </View>
                    </View>

                    {/* SWMS Document */}
                    <View wrap={true} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>{Strings.swms_document}</Text>
                        <View style={styles.swmsTaskPdfTable}>
                            <View style={styles.table}>
                                <View style={[styles.tr, styles.smDocThBg]} fixed>
                                    <View style={[styles.th, styles.tCol1]}>
                                        <Text>Activity</Text>
                                        <Text style={styles.smSMallText}>Break the job down into steps</Text>
                                    </View>
                                    <View style={[styles.th, styles.tCol2, styles.brLft]}>
                                        <Text>Potential Safety and Environmental Hazards</Text>
                                        <Text style={styles.smSMallText}>Break the job down into steps</Text>
                                    </View>
                                    <View style={[styles.th, styles.tCol3, styles.brLft]}>
                                        <Text>Risk Rating</Text>
                                    </View>
                                    <View style={[styles.th, styles.tCol1, styles.brLft]}>
                                        <Text>Control Measures</Text>
                                    </View>
                                    <View style={[styles.th, styles.tCol3, styles.brLft]}>
                                        <Text>Risk Rating After Controls</Text>
                                    </View>
                                    <View style={[styles.th, styles.tCol2, styles.brLft]}>
                                        <Text>Person Responsible</Text>
                                        <Text style={styles.smSMallText}>Break the job down into steps</Text>
                                    </View>
                                </View>
                                <View style={[styles.tr, styles.smDocThBg]}>
                                    <View style={[styles.th, styles.tCol1]}></View>
                                    <View style={[styles.th, styles.tCol2, styles.brLft]}></View>
                                    <View style={[styles.th, styles.tCol1, styles.brLft]}><Text>C</Text></View>
                                    <View style={[styles.th, styles.tCol1, styles.brLft]}><Text>P</Text></View>
                                    <View style={[styles.th, styles.tCol1, styles.brLft]}><Text>R</Text></View>
                                    <View style={[styles.th, styles.tCol1, styles.brLft]}></View>
                                    <View style={[styles.th, styles.tCol1, styles.brLft]}><Text>C</Text></View>
                                    <View style={[styles.th, styles.tCol1, styles.brLft]}><Text>P</Text></View>
                                    <View style={[styles.th, styles.tCol1, styles.brLft]}><Text>R</Text></View>
                                    <View style={[styles.th, styles.tCol2, styles.brLft]}></View>
                                </View>
                                {swmsDoc && swmsDoc.map(doc =>

                                    <View wrap={true} style={styles.tr}>
                                        <View style={[styles.td, styles.tCol1]}>

                                            <Text style={styles.cardTxtlight}> {doc.activity}</Text>

                                        </View>
                                        <View style={[styles.td, styles.tCol2, styles.brLft]}>
                                            <Text style={styles.cardTxtlight}>{doc.hazard}</Text>
                                        </View>
                                        <View style={[styles.td, styles.tCol1, styles.brLft]}>
                                            <Text style={styles.cardTxtlight}>{doc.consequence_before_control_name}</Text>
                                        </View>
                                        <View style={[styles.td, styles.tCol1, styles.brLft]}>
                                            <Text style={styles.cardTxtlight}>{doc.likelihood_before_control_name}</Text>
                                        </View>
                                        <View style={[styles.td, styles.tCol1, styles.brLft]}>
                                            <Text style={styles.cardTxtlight}>{doc.risk_before_control}</Text>
                                        </View>
                                        <View style={[styles.td, styles.tCol1, styles.brLft]}>
                                            <Text style={styles.cardTxtlight}>{doc.control_measures}</Text>
                                        </View>
                                        <View style={[styles.td, styles.tCol1, styles.brLft]}>
                                            <Text style={styles.cardTxtlight}>{doc.consequence_after_control_name}</Text>
                                        </View>
                                        <View style={[styles.td, styles.tCol1, styles.brLft]}>
                                            <Text style={styles.cardTxtlight}>{doc.likelihood_after_control_name}</Text>
                                        </View>
                                        <View style={[styles.td, styles.tCol1, styles.brLft]}>
                                            <Text style={styles.cardTxtlight}>{doc.risk_after_control}</Text>
                                        </View>
                                        <View style={[styles.td, styles.tCol2, styles.brLft]}>
                                            <Text style={styles.cardTxtlight}>{doc.person_responsible}</Text>
                                        </View>
                                    </View>)}
                            </View>
                        </View>
                    </View>


                    {/* Signoff */}
                    <View wrap={true} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>{Strings.Signoff}</Text>
                        <View style={styles.sfCardBody}>
                            <Text style={styles.noteText}>We the undersigned, confirm that the SWMS nominated above has been explained and its contents are clearly understood and accepted. We also confirm that our required qualifications to undertake this activity are current.</Text>
                            <View style={[styles.table, styles.mt1]}>
                                <View style={styles.tr} fixed>
                                    <View style={[styles.th, styles.tCol4]}>
                                        <Text style={styles.cellHdText}>Name</Text>
                                    </View>

                                    <View style={[styles.th, styles.tCol4]}>
                                        <Text style={styles.cellHdText}>Signature</Text>
                                    </View>
                                    <View style={[styles.th, styles.tCol4]}>
                                        <Text style={styles.cellHdText}>Date</Text>
                                    </View>

                                </View>

                                {swmsSignDetails[0] && swmsSignDetails[0].job_swms_sign_offs ?
                                    swmsSignDetails[0].job_swms_sign_offs.map(sign =>
                                        <View style={styles.tr}>
                                            <View style={[styles.td, styles.tCol4]}>
                                                <Text style={styles.cellText}>{sign.user_first_name + ' (' + sign.user_role_name + ')'}</Text>
                                            </View>
                                            <View style={[styles.td, styles.tCol4, styles.textRight]}>
                                                {sign.sign ?
                                                    <Image style={styles.comLogo} src={sign.sign} /> : null}
                                            </View>
                                            <View style={[styles.td, styles.tCol4]}>
                                                <Text style={styles.cellText}>{sign.sign_date && moment(sign.sign_date).format('DD/MM/YY')}</Text>
                                            </View>
                                        </View>) : null}
                            </View>
                        </View>
                    </View>

                </View>
            </Page>
        </Document>
    )
};

export default SignSWMSPdf;