import React from "react";
import { Field, reduxForm, FormSection, FieldArray } from "redux-form";

import { Strings } from '../../../dataProvider/localize';
import { Dropdown } from 'antd';
import { connect } from "react-redux";
import * as actions from '../../../actions/profileManagementActions';
import { bindActionCreators } from "redux";
import moment from "moment";

class ViewUserProfile extends React.Component {

    componentDidMount() {
        this.props.userActions.getLicencesType();
    }

    handleHourMinut = (data) => {
        var hour = Math.floor(data / 4).toString().length === 1 ? `0${Math.floor(data / 4)}` : Math.floor(data / 4).toString()
        var minute = 15 * (data % 4) === 0 ? '00' : 15 * (data % 4)
        return `${hour}:${minute}`
    }

    render() {
        const { taskFiles, userProfile, licenceType } = this.props;
        var formTo = []
        return (
            <div className="p-v-container">
                <div className="sf-card-wrap">

                    {/* Personal Details */}
                    {userProfile && userProfile.name && userProfile.phone_number && userProfile.email_address
                        ?
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.tab_personal_dtl}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="d-flex p-v-pic-dtl">
                                    {userProfile && userProfile.profile_pic
                                        ?
                                        <div className="profile-pic">
                                            <img src={userProfile && userProfile.profile_pic} />
                                        </div>
                                        :
                                        null
                                    }
                                    <div className="data-v-row">
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.first_name}</label>
                                                <span>{userProfile && userProfile.name}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.last_name}</label>
                                                <span>{userProfile && userProfile.last_name}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.dob_txt}</label>
                                                <span>{userProfile && moment(userProfile.date_of_birth).format('DD-MM-YYYY')}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.gender_txt}</label>
                                                <span>{userProfile && userProfile && userProfile.gender}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.mobile_no_txt}</label>
                                                <span>{userProfile && userProfile.country_code + " " + userProfile.phone_number}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.phone_no_txt}</label>
                                                <span>{userProfile && userProfile && userProfile.contact_number}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.primary_email_txt}</label>
                                                <span>{userProfile && userProfile.email_address}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.student_usi}</label>
                                                <span>{userProfile && userProfile.student_usi}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.zone_txt}</label>
                                                <span>{userProfile && userProfile.zone}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }

                    {/* Residential Address */}
                    {userProfile && userProfile.street_address && userProfile.city
                        && userProfile.state && userProfile.state && userProfile.zip_code && userProfile.country
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.res_address_txt}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="data-v-row">

                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.street_add_txt}</label>
                                            <span>{userProfile && userProfile.street_address}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.city_txt}</label>
                                            <span>{userProfile && userProfile.city}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.state_txt}</label>
                                            <span>{userProfile && userProfile.state}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.zip_code_no}</label>
                                            <span>{userProfile && userProfile.zip_code}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.country_txt}</label>
                                            <span>{userProfile && userProfile.country}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        :
                        null
                    }

                    {/* Experience */}
                    {userProfile && userProfile.user_experiences
                        && userProfile.user_experiences.length > 0
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.experience_txt}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <table className="sf-table p-exp-table">
                                    <tr>
                                        <th>{Strings.area_of_expertise}</th>
                                        <th>{Strings.hours_of_experinace}</th>
                                    </tr>
                                    {userProfile && userProfile.user_experiences
                                        && userProfile.user_experiences.map((exp) => {
                                            return (
                                                <tr>
                                                    <td><span>{exp && exp.sub_category ? exp.sub_category.sub_category_name : ''}</span></td>
                                                    <td><span>{exp ? exp.hours_of_experience : ''}</span></td>
                                                </tr>
                                            )
                                        })

                                    }
                                </table>
                            </div>
                        </div>
                        :
                        null
                    }

                    {/* Emergency Contact Details */}
                    {userProfile && userProfile.ec_full_name && userProfile.relationship
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.emergency_contact_dtl}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="data-v-row">

                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.full_name_txt}</label>
                                            <span>{userProfile && userProfile.ec_full_name}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.relationship_txt}</label>
                                            <span>{userProfile && userProfile.relationship}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.mobile_no_txt}</label>
                                            <span>{userProfile && userProfile.ec_mobile_number}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.email_txt}</label>
                                            <span>{userProfile && userProfile.ec_email}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.street_add_txt}</label>
                                            <span>{userProfile && userProfile.ec_street_address}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.city_txt}</label>
                                            <span>{userProfile && userProfile.ec_city}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.state_txt}</label>
                                            <span>{userProfile && userProfile.ec_state}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.zip_code_no}</label>
                                            <span>{userProfile && userProfile.ec_zip_code}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.country_txt}</label>
                                            <span>{userProfile && userProfile.ec_country}</span>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                        :
                        null
                    }

                    {/*
                    ================ Payroll Details ===============
                    */}

                    {/* Payroll Details  */}
                    {userProfile && userProfile.payroll_details && userProfile.payroll_details.abn
                        && userProfile.payroll_details.tfn
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.tab_payroll_dtl}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="data-v-row">
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.abn_txt}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.abn}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.tfn_txt}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.tfn}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }

                    {/* Super Fund Provider  */}
                    {userProfile.payroll_details && userProfile.payroll_details.is_super_ac === 0
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.super_fund_provider}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="data-v-row">
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.fund_name}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.fund_name}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.fund_abn}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.fund_abn}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.usi_txt}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.usi}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.phone_no_txt}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.phone_no}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.bsb_txt}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.bsb}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.account_no_txt}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.ac_no}</span>
                                        </div>
                                    </div>

                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.account_name_txt}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.ac_name}</span>
                                        </div>
                                    </div>
                                </div>

                            </div>
                        </div>
                        :
                        ""
                    }
                    {/* Bank Account Details  */}
                    {userProfile && userProfile.payroll_details
                        ?
                        < div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.bank_account_details}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="data-v-row">
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.bank_account_name}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.bank_ac_name}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.bank_name}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.bank_name}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.bank_bsb}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.bank_bsb}</span>
                                        </div>
                                    </div>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.bank_account_no}</label>
                                            <span>{userProfile && userProfile.payroll_details && userProfile.payroll_details.bank_ac_number}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }


                    {/*
                    ================ Licences ===============
                    */}

                    {/* Licences */}
                    {userProfile && userProfile.licences && userProfile.licences.length > 0
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.tab_licences}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <table className="sf-table p-exp-table">
                                    <tr>
                                        <th>Card Photo</th>
                                        <th>Card Type</th>
                                        <th>Number</th>
                                        <th>Issued By</th>
                                        <th>Issue Date</th>
                                        <th>Expiry Date</th>
                                    </tr>
                                    {userProfile && userProfile.licences && userProfile.licences.map(licence => {
                                        return (
                                            <tr>
                                                <td>
                                                    {licence.image && (licence.image.includes('.PDF') || licence.image.includes('.pdf'))
                                                        ?
                                                        <div><i class="fa fa-file-pdf-o"></i></div>
                                                        :
                                                        <img className="lic-card-pic" src={userProfile.licences_file_path + licence.image} />
                                                    }
                                                </td>
                                                <td>{licenceType.find(type => type.id === licence.type) ? licenceType.find(type => type.id === licence.type).name : ''}</td>
                                                <td>{licence && licence.number}</td>
                                                <td>{licence && licence.issued_by}</td>
                                                <td>{licence && licence.issued_date && moment(licence && licence.issued_date).format('DD/MM/YYYY')}</td>
                                                <td>{licence && licence.expiry_date && moment(licence && licence.expiry_date).format('DD/MM/YYYY')}</td>
                                            </tr>
                                        )
                                    }
                                    )}
                                </table>
                            </div>
                        </div>
                        :
                        null
                    }

                    {/*
                    ================ Medical Declaration ===============
                    */}

                    {/* Medical Declaration */}
                    {userProfile && userProfile.medical_declarations
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.tab_medical_dclr}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="medic-content">
                                    <h3>The inherent requirements of the job include: </h3>
                                    <p>Repetitive bending and stooping Repetitive kneeling. Reaching and stretching. Repetitive gripping and handling. Frequent twisting. Standing / walking for extended periods. Regular lifting of weights up to 10kgs. Work above shoulder height. Irregular lifting of weights 10–17kg. Assisted lifting of weights greater than 17kgs.</p>
                                    <h5 className="yes-no-vlue">
                                        {userProfile && userProfile.medical_declarations &&
                                            userProfile.medical_declarations.accept_job_requirement === 1 ? "Yes" : "No"} I understand and accept
                                    </h5>

                                    <p className="mt-3">Are you currently affected by any injury or condition that may impact upon your ability to perform all the duties of the job? If so, please provide details and advise on what measures may be taken to accommodate your injury or condition so that you could perform the job satisfactorily.</p>
                                    <h5 className="yes-no-vlue">{userProfile.medical_declarations && userProfile.medical_declarations.affected_by_injury === 1 ? "Yes" : "No"}</h5>
                                    <div className="view-text-value">
                                        <span>{userProfile && userProfile.medical_declarations && userProfile.medical_declarations.injury_details}</span><br></br>
                                    </div>
                                    <i className="sf-note">Please note, if you fail to disclose an existing condition, then any future aggravation of your injury arising out of your employment may be disqualified for compensation under applicable Worker’s Compensation legislation.</i>

                                    <p className="mt-3">Are you a citizen of Australia or otherwise authorized to work in Australia?</p>
                                    <h5 className="yes-no-vlue">{userProfile.medical_declarations && userProfile.medical_declarations.australian_citizen === 1 ? "Yes" : "No"}</h5>
                                    <p className="mt-3">Have you ever been convicted* of a criminal offence? To be convicted a court would have made a finding that you were either: convicted by a single judge or jury of the offence or found guilty of the offence(s) charged but dismissed without conviction.</p>
                                    <h5 className="yes-no-vlue">{userProfile.medical_declarations && userProfile.medical_declarations.convicted_of_offence === 1 ? "Yes" : "No"}</h5>
                                    <div className="view-text-value">
                                        <span>{userProfile && userProfile.medical_declarations && userProfile.medical_declarations.offence}</span><br></br>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }

                    {/* Declaration */}
                    {userProfile && userProfile.medical_declarations
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.sf_declaration}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="medic-content">
                                    <p>I understand that all offers of employment may be conditional upon satisfactory reference and background checks being obtained, (including National criminal record and pre-employment medical checks, as relevant and required for the position) and the production of all documents necessary for High Clean Pty Ltd to verify my identity, qualifications and ability to work in Australia. I consent to the authorised representatives of High Clean Pty Ltd contacting any person(s) or institutions relevant to this application to undertake these verifications and checks.</p>
                                    <p className="mt-3">I certify that the information provided in this application is true and complete to the best of my knowledge, information and belief. I understand withholding relevant information or submitting false or misleading information on this application, my resume, during interviews or at any other time during the hiring process, may result in my disqualification from further consideration for employment or if I am employed, the termination of my employment.</p>
                                    <p><strong>Date of Acceptance:</strong> {userProfile && userProfile.medical_declarations && moment(userProfile.medical_declarations.created_at).format('DD-MM-YYYY')} AEDT</p>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }

                    {/* Signature */}
                    {userProfile && userProfile.medical_declarations
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.sf_signature}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="p-v-signature">
                                    <img src={userProfile && userProfile.medical_declarations && userProfile.medical_declarations.sign} />
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }

                    {/*
                    ================ Rostering ===============
                    */}

                    {/* Rostering */}
                    {userProfile && userProfile.rostering
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.tab_rostering}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="medic-content">
                                    <h3>Nulla vel mollis enim, vel malesuada odio</h3>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed sit amet libero ut nisi hendrerit aliquam. Aliquam erat volutpat. Sed semper diam ut magna fringilla posuere. Morbi sagittis, felis nec ultrices bibendum, diam tellus egestas felis, et mattis lectus ipsum sit amet libero. Ut rutrum consequat maximus. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nam vel suscipit purus. Quisque in iaculis eros.</p>
                                    <table className="sf-table sf-t-br-strip rostr-table mb-3">
                                        <tr>
                                            <th></th>
                                            <th>Full Time Availability</th>
                                            <th>Availability</th>
                                        </tr>
                                        {userProfile && userProfile.rostering && userProfile.rostering.map((roster, index) => {
                                            roster && roster.not_available_from_to
                                                && Object.keys(roster.not_available_from_to).forEach(form => {
                                                    Object.values(roster.not_available_from_to[form]).forEach(fr => {
                                                        if (fr.length > 0) {
                                                            let t1 = this.handleHourMinut(fr[0])
                                                            let t2 = this.handleHourMinut(fr[1])
                                                                ;
                                                            formTo.push({ day: roster.day, time: t1 + ' - ' + t2 })
                                                        }
                                                    })
                                                })
                                            return (
                                                <tr>
                                                    <td>{roster.day}</td>
                                                    <td>{roster.full_time_availability === 1 ? 'Yes' : 'No'}</td>
                                                    <td className="avl-label-rost">{formTo.map(time => {
                                                        if (time.day === roster.day)
                                                            return (<label>{time.time}</label>)
                                                    })}</td>
                                                </tr>
                                            )
                                        }
                                        )}
                                    </table>
                                    <h3>Applicable to Students Only:</h3>
                                    <p>If you are a student or limitation of allowed work hours apply to you, then fill in the number of hours below.</p>
                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>No of Hours Allowed / Week?</label>
                                            <span>{userProfile && userProfile.rostering && userProfile.rostering[0] && userProfile.rostering[0].total_hours}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }


                    {/*
                    ================ Induction & Training ===============
                    */}

                    {/* Induction & Training */}
                    {userProfile && userProfile.course_details && userProfile.course_details.length > 0
                        ?
                        <div className="sf-card mt-4">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h2 className="sf-pg-heading">{Strings.tab_induction_training}</h2>
                                <div className="info-btn">
                                    <Dropdown className="more-info disable-drop-menu" disabled>
                                        <i className="material-icons">more_vert</i>
                                    </Dropdown>
                                </div>
                            </div>
                            <div className="sf-card-body mt-2">
                                <div className="medic-content">
                                    <table className="sf-table p-exp-table">
                                        <tr>
                                            <th>Course Name</th>
                                            <th>Status</th>
                                        </tr>
                                        {userProfile && userProfile.course_details &&
                                            userProfile.course_details.map(course => {
                                                return (<tr>
                                                    <td>{course.name}</td>
                                                    <td>{course && course.status === 1 ? "To do"
                                                        : course && course.status === 2 ? "In Progress"
                                                            : course && course.status === 3 ? "Completed"
                                                                : course && course.status === 4 ? "Expired"
                                                                    : ''}
                                                    </td>
                                                </tr>)
                                            })}
                                    </table>
                                </div>
                            </div>
                        </div>
                        :
                        null
                    }
                </div>
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        licenceType: state.profileManagement && state.profileManagement.licenceType,
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(actions, dispatch)
    }
}
export default connect(mapStateToProps, mapDispatchToProps)(ViewUserProfile);
