import React from 'react';
import moment from 'moment';
import { Page, Text, View, Document, StyleSheet, Image, Font } from '@react-pdf/renderer';

import { Strings } from '../../../dataProvider/localize';
import latoHairline from '../scope-doc/lato/Lato-Hairline.ttf';
import latoThin from '../scope-doc/lato/Lato-Thin.ttf';
import latoLight from '../scope-doc/lato/Lato-Light.ttf';
import latoRegular from '../scope-doc/lato/Lato-Regular.ttf';
import latoMedium from '../scope-doc/lato/Lato-Medium.ttf';
import latoBold from '../scope-doc/lato/Lato-Bold.ttf';
import { getStorage, abbrivationStr } from '../../../utils/common';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';

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
    header: { backgroundColor: '#F8F8F8', padding: 20, marginBottom: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
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
    staffNameHd: {
        paddingTop: 10,
        paddingBottom: 1,
        paddingLeft: 10,
        paddingRight: 10,
        color: '#222222',
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
    tableWrpa: { padding: 10, margin: 0, width: "100%" },
    table: {
        display: "table",
        width: "100%",
        fontFamily: 'Lato',
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
        paddingTop: 10,
        fontWeight: "normal",
        fontFamily: 'Lato'
    },
    imgAbrTxt: {
        fontSize: 14,
        color: '#ffffff',
        fontWeight: 'semibold',
    },
    imgAbrSt: {
        backgroundColor: "#03a791",
        width: 50,
        height: 50,
        borderRadius: 50,
        paddingTop: 18,
        textAlign: 'center',
    },
    trBg: { backgroundColor: '#fafafa' }
});

class JobDocPdf extends React.Component {
    constructor(props) {
        super(props);
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.currentOrganizationName = this.props.organization ? this.props.organization.name : null;
        this.currentOrganizationLogo = this.props.organization ? this.props.organization.logo : null;
        this.currentOrganizationDetails = this.props.organization ? this.props.organization : null;
    }
    render() {
        var staffList = this.props.staffList ? this.props.staffList : [];
        const { jobDocsDetails, licenceType } = this.props;
        var jobScopeDoc = jobDocsDetails && jobDocsDetails.quote && jobDocsDetails.quote.scope_doc ? jobDocsDetails.quote.scope_doc : {};
        var schedule = jobDocsDetails && jobDocsDetails.job_doc_schedules && jobDocsDetails.job_doc_schedules.length > 0 ? jobDocsDetails.job_doc_schedules : [];
        var notes = jobDocsDetails && jobDocsDetails.note ? jobDocsDetails.note : '';

        return (
            <Document>
                <Page wrap size="A3" style={styles.page}>
                    <View style={styles.body}>
                        <View style={styles.header}>
                            <View style={styles.colMd}>
                                {this.currentOrganizationLogo ?
                                    <Image style={[styles.comLogo, styles.logoWRedis]} src={this.currentOrganizationLogo + "?t=" + moment(new Date())} /> : <View style={styles.imgAbrSt}>
                                        <Text style={styles.imgAbrTxt}>
                                            {this.currentOrganizationName && abbrivationStr(this.currentOrganizationName)}
                                        </Text></View>}
                            </View>
                            <View style={styles.colMd}>
                                <Text style={styles.docHeading}>{Strings.job_document_title}</Text>
                            </View>
                            <View style={[styles.colMd, styles.textRight]}>
                                <Text style={styles.comTitle}>{this.currentOrganizationName ? this.currentOrganizationName : ''}</Text>
                            </View>
                        </View>

                        {/* Contractor Details */}
                        <View style={styles.sfCard}>
                            <Text style={styles.cardTitle}>{Strings.contractor_details}</Text>
                            <View style={styles.cardRow}>
                                <View style={[styles.cardCol, styles.colBorder]}>
                                    <Text style={styles.cardTxtBold}>{Strings.client_company}</Text>
                                    <Text style={styles.cardTxtlight}>{this.currentOrganizationDetails && this.currentOrganizationDetails.name ? this.currentOrganizationDetails.name : ''}</Text>
                                </View>
                                <View style={[styles.cardCol, styles.colBorder]}>
                                    <Text style={styles.cardTxtBold}>{Strings.client_abn}</Text>
                                    <Text style={styles.cardTxtlight}>{this.currentOrganizationDetails && this.currentOrganizationDetails.abn_acn ? this.currentOrganizationDetails.abn_acn : ''}</Text>
                                </View>
                                <View style={[styles.cardCol, styles.colBorder]}>
                                    <Text style={styles.cardTxtBold}>{Strings.address_txt}</Text>
                                    <Text style={styles.cardTxtlight}>{this.currentOrganizationDetails && this.currentOrganizationDetails.address ? this.currentOrganizationDetails.address : ''}</Text>
                                </View>
                                <View style={[styles.cardCol, styles.colBorder]}>
                                    <Text style={styles.cardTxtBold}>{Strings.client_contact}</Text>
                                    <Text style={styles.cardTxtlight}>{this.currentOrganizationDetails && this.currentOrganizationDetails.primary_person ? this.currentOrganizationDetails.primary_person : ''}</Text>
                                </View>
                                <View style={styles.cardCol}>
                                    <Text style={styles.cardTxtBold}>{Strings.client_phone}</Text>
                                    <Text style={styles.cardTxtlight}>{this.currentOrganizationDetails && this.currentOrganizationDetails.phone_number ? this.currentOrganizationDetails.phone_number : ''}</Text>
                                </View>
                            </View>
                        </View>


                        {/* Service Details */}
                        <View style={styles.sfCard}>
                            <Text style={styles.cardTitle}>{Strings.job_service_details}</Text>
                            {jobScopeDoc && jobScopeDoc.scope_docs_sites && jobScopeDoc.scope_docs_sites.length > 0 ? jobScopeDoc.scope_docs_sites.map(site => {
                                return <View>
                                    <View style={styles.cardRow}>
                                        <View style={[styles.cardCol, styles.colBorder]}>
                                            <Text style={styles.cardTxtBold}>{Strings.site_name}</Text>
                                            <Text style={styles.cardTxtlight}>{site && site.site && site.site.site_name ? site.site.site_name : ''}</Text>
                                        </View>
                                        <View style={[styles.cardCol]}>
                                            <Text style={styles.cardTxtBold}>{Strings.address_txt}</Text>
                                            <Text style={styles.cardTxtlight}>{site && site.site && site.site.street_address ? site.site.street_address : ''}{site && site.site && site.site.city}{site && site.site && site.site.state ? site.site.state : ''}{site && site.site && site.site.zip_code ? site.site.zip_code : ''}</Text>
                                        </View>
                                    </View>
                                    <View style={styles.sfScWork}>
                                        {site.site && site.site.tasks && site.site.tasks.length > 0 ? site.site.tasks.map(task => {
                                            if (task && task.split_status && task.split_status === "O") {
                                                return <View wrap={false} style={[styles.cardRow, styles.borderWB2]}>
                                                    <View style={[styles.cardCol, styles.colBorder, styles.colMd5]}>
                                                        <Text style={styles.cardTxtBold}>{task && task.task_name ? task.task_name : ''}</Text>
                                                        <Text style={styles.cardTxtlight}>{task && task.description ? task.description : ''}</Text>
                                                    </View>
                                                </View>
                                            } else {
                                                return null;
                                            }
                                        }) : null}
                                    </View>
                                </View>
                            }) : ''}
                        </View>

                        {/* Staff Licenses/Inductions */}
                        <View style={styles.sfCard}>
                            <Text style={styles.cardTitle}>{Strings.job_staff_licenses_inductions}</Text>
                            <View style={styles.tableWrpa}>
                                <View style={styles.table}>
                                    <View wrap={false} style={[styles.tr, styles.trBg]} fixed>
                                        <View style={[styles.th, styles.tCol2]}><Text style={styles.cellHdText}>{Strings.job_staff_name_position}</Text></View>
                                        {licenceType && licenceType.length > 0 ? licenceType.map(licience => (
                                            <View style={[styles.th, styles.tCol1]}><Text style={styles.cellHdText}>{licience && licience.name ? licience.name : ''}</Text></View>
                                        )) : null}
                                    </View>
                                    {staffList && staffList.length > 0 ? staffList.map(userObj => {
                                        return userObj && userObj.staff_users && userObj.staff_users.length > 0 ? userObj.staff_users.map(user => {
                                            return <View wrap={false} style={styles.tr}>
                                                {user && user.first_name && user.role_name ? <View style={[styles.td, styles.tCol2]}><Text style={styles.cellText}>{`${user.first_name} (${user.role_name})`}</Text></View> : <View style={[styles.td, styles.tCol2]}> </View>}

                                                {licenceType && licenceType.length > 0 ? licenceType.map(licence => {
                                                    if (user && user.user_licences && user.user_licences.length > 0) {
                                                        let licienceObj = user.user_licences.filter(item => licence.id == item.type);
                                                        if (licienceObj && licienceObj.length > 0) {
                                                            return <View style={[styles.td, styles.tCol1]}><Text style={styles.cellText}>{licienceObj && licienceObj[0].expiry_date ? moment(licienceObj[0].expiry_date).format('MMM YYYY') : ''}</Text></View>
                                                        } else {
                                                            return <View style={[styles.td, styles.tCol1]}></View>
                                                        }
                                                    } else {
                                                        return <View style={[styles.td, styles.tCol1]}></View>
                                                    }
                                                }) : null}
                                            </View>
                                        }) : null
                                    }) : null}
                                </View>
                            </View>
                        </View>

                        {/* Insurance Certificates & SWMS */}
                        <View style={styles.sfCard}>
                            <Text style={styles.cardTitle}>{Strings.job_doc_insurance_certificate}</Text>
                            <View style={styles.tableWrpa}>
                                <View style={styles.table}>
                                    <View style={styles.tr} fixed>
                                        <View style={[styles.th, styles.tCol4]}><Text style={styles.cellHdText}>Type</Text></View>
                                        <View style={[styles.th, styles.tCol4]}><Text style={styles.cellHdText}>Number</Text></View>
                                        <View style={[styles.th, styles.tCol4]}><Text style={styles.cellHdText}>Expiry Date</Text></View>
                                    </View>
                                    {jobDocsDetails && jobDocsDetails.job_doc_orgs_certificates && jobDocsDetails.job_doc_orgs_certificates.length > 0 ? jobDocsDetails.job_doc_orgs_certificates.map(certificate => {
                                        return <View wrap={false} style={styles.tr}>
                                            <View style={[styles.td, styles.tCol4]}><Text style={styles.cellText}>{certificate && certificate.orgs_certificate && certificate.orgs_certificate.name ? certificate.orgs_certificate.name : ''}</Text></View>
                                            <View style={[styles.td, styles.tCol4]}><Text style={styles.cellText}>{certificate && certificate.orgs_certificate && certificate.orgs_certificate.certificate_number ? certificate.orgs_certificate.certificate_number : ''}</Text></View>
                                            <View style={[styles.td, styles.tCol4]}><Text style={styles.cellText}>{certificate && certificate.orgs_certificate && certificate.orgs_certificate.expiry_date ? moment(certificate.orgs_certificate.expiry_date).format('DD/MM/YYYY') : ''}</Text></View>
                                        </View>
                                    }) : null}
                                </View>
                            </View>
                        </View>


                        {/* Schedule */}
                        <View style={styles.sfCard}>
                            <Text style={styles.cardTitle}>Schedule</Text>
                            <View style={styles.tableWrpa}>
                                <View style={styles.table}>
                                    <View style={styles.tr} fixed>
                                        <View style={[styles.th, styles.tCol2]}><Text style={styles.cellHdText}>{Strings.job_date}</Text></View>
                                        <View style={[styles.th, styles.tCol1]}><Text style={styles.cellHdText}>{Strings.job_start}</Text></View>
                                        <View style={[styles.th, styles.tCol1]}><Text style={styles.cellHdText}>{Strings.job_finish}</Text></View>
                                        <View style={[styles.th, styles.tCol2]}><Text style={styles.cellHdText}>{Strings.job_scope}</Text></View>
                                        <View style={[styles.th, styles.tCol3]}><Text style={styles.cellHdText}>{Strings.job_area}</Text></View>
                                        <View style={[styles.th, styles.tCol3]}><Text style={styles.cellHdText}>{Strings.job_site_requirements}</Text></View>
                                    </View>
                                    {schedule && schedule.length > 0 ? schedule.map(schedule => {
                                        return <View wrap={false} style={styles.tr}>
                                            <View style={[styles.td, styles.tCol2]}><Text style={styles.cellText}>{schedule && schedule.date && schedule.date ? moment(schedule.date).format('DD/MM/YYYY') : ''}</Text></View>
                                            <View style={[styles.td, styles.tCol1]}><Text style={styles.cellText}>{schedule && schedule.start && schedule.start ? schedule.start : ''}</Text></View>
                                            <View style={[styles.td, styles.tCol1]}><Text style={styles.cellText}>{schedule && schedule.finish && schedule.finish ? schedule.finish : ''}</Text></View>
                                            <View style={[styles.td, styles.tCol2]}><Text style={styles.cellText}>{schedule && schedule.scope && schedule.scope ? schedule.scope : ''}</Text></View>
                                            <View style={[styles.td, styles.tCol3]}><Text style={styles.cellText}>{schedule && schedule.area && schedule.area ? schedule.area : ''}</Text></View>
                                            <View style={[styles.td, styles.tCol3]}><Text style={styles.cellText}>{schedule && schedule.site_requirements ? schedule.site_requirements : ''}</Text></View>
                                        </View>
                                    }) : null}
                                </View>
                            </View>

                            {/* Notes */}
                            <View style={styles.noteCard}>
                                <Text style={styles.noteTitle}>Notes</Text>
                                <View style={styles.sfCardBody}>
                                    <Text style={styles.noteText}>
                                        {notes ? notes : null}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>
                </Page>
            </Document>
        )
    }
};

export default JobDocPdf;
