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

const IncidentReportPdf = (props) => {
    const { incidentReportDetails, usersList, riskControls, job } = props;
    const { consultations, authorizations, corrective_actions, incident_report_detail, persons, witnesses } = incidentReportDetails;
    const authorization = authorizations; const corrective = corrective_actions; const incidentReportDetail = incident_report_detail;
    const person = persons; const witness = witnesses;
    const basicReportDetails = incidentReportDetail && incidentReportDetail.length > 0 && incidentReportDetail[0];

    const reportingUser = incidentReportDetail && incidentReportDetail.length > 0
        ? usersList.find(employee => employee.user_name.toString() === incidentReportDetail[0].reporting_employee.toString())
        : null

    const reportCategories = basicReportDetails
        && basicReportDetails.actual_incident_category
        && basicReportDetails.actual_incident_category.length > 0
        && basicReportDetails.actual_incident_category.split(",").map(ele => parseInt(ele));

    const categoryData = reportCategories && reportCategories.length > 0 && props.incidentCategories ? props.incidentCategories.filter(category => reportCategories.includes(category.id)) : null
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
                        <Text style={styles.h1Heding}>Assign Incident Report</Text>
                    </View>

                    {/* Admin Details */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Admin Details</Text>
                        <View style={styles.cardRow}>
                            <View style={[styles.cardCol, styles.colBorder, styles.pl1]}>
                                <Text style={styles.cardTxtBold}>Employee Reporting</Text>
                                <Text style={styles.cardTxtlight}>{reportingUser ? reportingUser.name + " " + (reportingUser.last_name ? reportingUser.last_name : "") : " "}</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>Date & Time of Report</Text>
                                <Text style={styles.cardTxtlight}>{incidentReportDetail && incidentReportDetail.report_time
                                    && incidentReportDetail.report_date &&
                                    `${moment(incidentReportDetail.report_date).format("MM-DD-YYYY")}, ${moment(incidentReportDetail.report_time).format("HH:MM A")}`}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Incident Details */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Incident Details</Text>
                        <View style={styles.cardRow}>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>Date & Time of Report</Text>
                                <Text style={styles.cardTxtlight}>{incidentReportDetail && incidentReportDetail.report_date &&
                                    incidentReportDetail.report_time && `${moment(incidentReportDetail.report_date).format("MM-DD-YYYY")}, ${moment(incidentReportDetail.report_time).format("HH:MM A")}`}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>Location</Text>
                                <Text style={styles.cardTxtlight}>{basicReportDetails && basicReportDetails.location}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colMd12]}>
                                <Text style={styles.cardTxtBold}>Description</Text>
                                <Text style={styles.cardTxtlight}>{basicReportDetails && basicReportDetails.description}</Text>
                            </View>
                        </View>

                    </View>

                    {/* Incident Categories */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Incident Categories</Text>
                        <View style={styles.incCategoryList}>
                            {categoryData && Object.values(categoryData).map(category =>
                                <View style={[styles.inccItems]}>
                                    <Text style={styles.inccBullet}></Text>
                                    <Text style={[styles.inccText]}> {category.name}</Text>
                                </View>
                            )}
                            {/*  <View style={[styles.inccItems]}>
                                <Text style={styles.inccBullet}></Text>
                                <Text style={[styles.inccText]}>Injury</Text>
                            </View>
                            <View style={[styles.inccItems]}>
                                <Text style={styles.inccBullet}></Text>
                                <Text style={[styles.inccText]}>Theft</Text>
                            </View> */}
                        </View>
                    </View>

                    {/* Other Information */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Other Information</Text>
                        <View style={styles.cardRow}>
                            <View style={[styles.cardCol, styles.colBorder, styles.pl1]}>
                                <Text style={styles.cardTxtBold}>Is this a Contractor Incident</Text>
                                <Text style={styles.cardTxtlight}>{basicReportDetails && basicReportDetails.is_contractor_incident ? 'Yes' : 'No'}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>Is this a Regulatory Notifiable Incident</Text>
                                <Text style={styles.cardTxtlight}>{basicReportDetails && basicReportDetails.regulatory_notifiable_incident ? 'Yes' : 'No'}</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>Have any Notices Been Issued?</Text>
                                <Text style={styles.cardTxtlight}>{basicReportDetails && basicReportDetails.any_issued ? 'Yes' : 'No'}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder, styles.pl1]}>
                                <Text style={styles.cardTxtBold}>Was the State Safety Regulator notified</Text>
                                <Text style={styles.cardTxtlight}>{basicReportDetails && basicReportDetails.state_safely_regulator ? 'Yes' : 'No'}</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>Were police involved</Text>
                                <Text style={styles.cardTxtlight}>{basicReportDetails && basicReportDetails.police_involved ? 'Yes' : 'No'}</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>Is this a workers compensation related incident</Text>
                                <Text style={styles.cardTxtlight}>{basicReportDetails && basicReportDetails.worker_compensation_related ? 'Yes' : 'No'}</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>What was done following the incident</Text>
                                <Text style={styles.cardTxtlight}>{basicReportDetails && basicReportDetails.what_was_done}</Text>
                            </View>
                        </View>
                    </View>

                    {/* Images */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Images</Text>
                        <View style={[styles.cardRow, styles.imgRowSpace]}>
                            {basicReportDetails && basicReportDetails.incident_files ?
                                <Image style={styles.inccViewImg} src={basicReportDetails.incident_files} /> : null}
                            {/* <Image style={styles.inccViewImg} src="/images/doc-se-pic.png" />
                            <Image style={styles.inccViewImg} src="/images/doc-se-pic.png" /> */}
                        </View>
                    </View>

                    {/* Persons Involved */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Persons Involved</Text>
                        <View style={styles.tableWrpa}>
                            <View style={styles.table}>
                                <View style={styles.tr} fixed>
                                    <View style={[styles.th, styles.tCol3]}>
                                        <Text style={styles.cellHdText}>Name</Text></View>
                                    <View style={[styles.th, styles.tCol3]}>
                                        <Text style={styles.cellHdText}>Type of Person</Text></View>
                                    <View style={[styles.th, styles.tCol6]}>
                                        <Text style={styles.cellHdText}>Other Details</Text></View>
                                </View>
                                {
                                    person && person.map(item => <View style={styles.tr}>
                                        <View style={[styles.td, styles.tCol3]}>
                                            <Text style={styles.cellText}>{item.name}</Text></View>
                                        <View style={[styles.td, styles.tCol3]}>
                                            <Text style={styles.cellText}>{item.type_of_person}</Text></View>
                                        <View style={[styles.td, styles.tCol6]}>
                                            <Text style={styles.cellText}>{item.other_detail}</Text></View>
                                    </View>)}

                            </View>
                        </View>
                    </View>

                    {/* Witnesses */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Witnesses</Text>
                        <View style={styles.tableWrpa}>
                            <View style={styles.table}>
                                <View style={styles.tr} fixed>
                                    <View style={[styles.th, styles.tCol3]}>
                                        <Text style={styles.cellHdText}>Name</Text></View>
                                    <View style={[styles.th, styles.tCol3]}>
                                        <Text style={styles.cellHdText}>Type of Person</Text></View>
                                    <View style={[styles.th, styles.tCol6]}>
                                        <Text style={styles.cellHdText}>Other Details</Text></View>
                                </View>
                                {
                                    witness && witness.map(item =>
                                        <View style={styles.tr}>
                                            <View style={[styles.td, styles.tCol3]}>
                                                <Text style={styles.cellText}>{item.name}</Text></View>
                                            <View style={[styles.td, styles.tCol3]}>
                                                <Text style={styles.cellText}>{item.type_of_person}</Text></View>
                                            <View style={[styles.td, styles.tCol6]}>
                                                <Text style={styles.cellText}>{item.other_detail}</Text></View>
                                        </View>
                                    )}

                            </View>
                        </View>
                    </View>

                    {/* Consultations */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Consultations</Text>
                        <View style={styles.tableWrpa}>
                            <View style={styles.table}>
                                <View style={styles.tr} fixed>
                                    <View style={[styles.th, styles.tCol3]}>
                                        <Text style={styles.cellHdText}>Name</Text></View>
                                    <View style={[styles.th, styles.tCol3]}>
                                        <Text style={styles.cellHdText}>Position</Text></View>
                                    <View style={[styles.th, styles.tCol6]}>
                                        <Text style={styles.cellHdText}>Contact details</Text></View>
                                </View>
                                {
                                    consultations && consultations.map(item => <View style={styles.tr}>
                                        <View style={[styles.td, styles.tCol3]}>
                                            <Text style={styles.cellText}>{item.name}</Text></View>
                                        <View style={[styles.td, styles.tCol3]}>
                                            <Text style={styles.cellText}>{item.position}</Text></View>
                                        <View style={[styles.td, styles.tCol6]}>
                                            <Text style={styles.cellText}>{item.contact_details}</Text></View>
                                    </View>)}

                            </View>
                        </View>
                    </View>

                    {/* Corrective Actions */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Corrective Actions</Text>
                        {
                            corrective && corrective.map((action, index) => <View style={[styles.cardRow, styles.borderBtm]}>
                                <View style={[styles.cardCol, styles.colMd12]}>
                                    <Text style={styles.cardTxtBold}>Describe what needs to be done</Text>
                                    <Text style={styles.cardTxtlight}>{action.required_action}</Text>
                                </View>
                                <View style={[styles.cardCol, styles.colBorder]}>
                                    <Text style={styles.cardTxtBold}>Risk Control</Text>
                                    <Text style={styles.cardTxtlight}>{riskControls.find(control => control.id === action.risk_control) &&
                                        riskControls.find(control => control.id === action.risk_control).name}</Text>
                                </View>
                                <View style={[styles.cardCol, styles.colBorder]}>
                                    <Text style={styles.cardTxtBold}>Who is Responsible?</Text>
                                    <Text style={styles.cardTxtlight}>{usersList.find(user => user.user_name.toString() === action.responsible_person.toString()) &&
                                        usersList.find(user => user.user_name.toString() === action.responsible_person.toString()).name}</Text>
                                </View>
                                <View style={[styles.cardCol]}>
                                    <Text style={styles.cardTxtBold}>Date for Completion</Text>
                                    <Text style={styles.cardTxtlight}>{moment(action.completion_date).format("MM-DD-YYYY")}</Text>
                                </View>
                            </View>)}

                        {/* <View style={[styles.cardRow, styles.borderBtm]}>
                            <View style={[styles.cardCol, styles.colMd12]}>
                                <Text style={styles.cardTxtBold}>Describe what needs to be done</Text>
                                <Text style={styles.cardTxtlight}>teacher</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>Risk Control</Text>
                                <Text style={styles.cardTxtlight}>Available</Text>
                            </View>
                            <View style={[styles.cardCol, styles.colBorder]}>
                                <Text style={styles.cardTxtBold}>Who is Responsible?</Text>
                                <Text style={styles.cardTxtlight}>Peter Sue</Text>
                            </View>
                            <View style={[styles.cardCol]}>
                                <Text style={styles.cardTxtBold}>Date for Completion</Text>
                                <Text style={styles.cardTxtlight}>10-03-2019</Text>
                            </View>
                        </View> */}
                    </View>

                    {/* Authorisation of Corrective Actions */}
                    <View wrap={false} style={styles.sfCard}>
                        <Text style={styles.cardTitle}>Authorisation of Corrective Actions</Text>
                        <View style={styles.cardRow}>
                            {
                                authorization && authorization.map(author => <View style={[styles.cardCol, styles.colMd12]}>

                                    <Text style={styles.cardTxtBold}>{Strings.sf_signature}</Text>
                                    {author.sign ?
                                        <Image style={styles.userSign} src={author.sign} /> : null}
                                    <View style={[styles.cardRow, styles.borderBtm]}>
                                        <View style={[styles.cardCol, styles.colBorder]}>
                                            <Text style={styles.cardTxtBold}>Who is Responsible?</Text>
                                            <Text style={styles.cardTxtlight}>{author.name}</Text>
                                        </View>
                                        <View style={[styles.cardCol]}>
                                            <Text style={styles.cardTxtBold}>Date for Completion</Text>
                                            <Text style={styles.cardTxtlight}>{moment(author.date).format("MM-DD-YYYY")}</Text>
                                        </View>
                                    </View>
                                </View>)}
                            {/* loop */}

                            {/* loop */}
                        </View>
                    </View>

                </View>
            </Page>
        </Document>
    )
};

export default IncidentReportPdf;