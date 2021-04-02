import React from 'react';
import { Icon, Dropdown, Menu, Modal, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../../../utils/Validations/subscriptionValidate';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import * as industryActions from '../../../actions/industryManagementAction';
import * as actions from '../../../actions/profileManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../utils/common';
import moment from 'moment'
import { Link } from 'react-router-dom';
import { isRequired, isNumber } from '../../../utils/Validations/scopeDocValidation';

class ViewPesonalDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            phnOtpErr: false,
            emailOtpErr: false
        }

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    componentDidMount() {
        this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name);
    }

    // more info
    editMenu = (
        <Menu>
            <Menu.Item onClick={this.handleEditClick}>{Strings.menu_edit_org}</Menu.Item>
        </Menu>
    )

    handleEditClick = () => {
        this.props.onPersonEdit();
    }

    onSubmit = (formData) => {

    }

    handleVerifyPhn = () => {
        const phnCode = this.props.formValues.phone_code
        if (phnCode) {
            this.props.userActions.verifyAttr({ phone_code: phnCode })
                .then(message => {
                    this.setState({
                        phnVerify: 'none'
                    })
                    notification.success({
                        message: Strings.success_title,
                        description: message ? message : Strings.generic_error, onClick: () => { },
                        className: 'ant-success'
                    })
                    this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name);
                }).catch((error) => {
                    if (error.status === VALIDATE_STATUS) {
                        notification.warning({
                            message: Strings.validate_title,
                            description: error && error.data && typeof error.data.message == 'string'
                                ? error.data.message : Strings.generic_validate, onClick: () => { },
                            className: 'ant-warning'
                        });
                    } else {
                        notification.error({
                            message: Strings.error_title,
                            description: error && error.data && error.data.message && typeof error.data.message == 'string'
                                ? error.data.message : Strings.generic_error, onClick: () => { },
                            className: 'ant-error'
                        });
                    }
                });
        } else {
            this.setState({
                phnOtpErr: true
            })
        }
    }

    handleVerifyEmail = () => {
        const emailCode = this.props.formValues.email_code
        if (emailCode) {
            this.props.userActions.verifyAttr({ email_code: emailCode })
                .then(message => {
                    this.setState({
                        emailVerify: 'none'
                    })
                    notification.success({
                        message: Strings.success_title,
                        description: message ? message : Strings.generic_error, onClick: () => { },
                        className: 'ant-success'
                    })
                    this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name);
                }).catch((error) => {
                    if (error.status === VALIDATE_STATUS) {
                        notification.warning({
                            message: Strings.validate_title,
                            description: error && error.data && typeof error.data.message == 'string'
                                ? error.data.message : Strings.generic_validate, onClick: () => { },
                            className: 'ant-warning'
                        });
                    } else {
                        notification.error({
                            message: Strings.error_title,
                            description: error && error.data && error.data.message && typeof error.data.message == 'string'
                                ? error.data.message : Strings.generic_error, onClick: () => { },
                            className: 'ant-error'
                        });
                    }
                });
        } else {
            this.setState({
                emailOtpErr: true
            })
        }
    }

    resendOtpPhn = val => {
        this.props.userActions.resendVerifyAttr(val)
            .then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-success'
                })
            }).catch(message => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                })
            })
    }

    resendOtpEmail = val => {
        this.props.userActions.resendVerifyAttr(val)
            .then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-success'
                })
            }).catch(message => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                })
            })
    }

    render() {

        const { handleSubmit, profile } = this.props;
        var personDetail = profile[0]

        const editMenu = (
            <Menu>
                <Menu.Item onClick={this.handleEditClick}>{Strings.menu_edit_org}</Menu.Item>
            </Menu>
        )

        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>

                {/* Personal Details */}

                <div className="sf-card">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.tab_personal_dtl}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">

                        <div className="data-v-row">
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.name_txt}</label>
                                    <span>{personDetail ? personDetail.name + ' ' +
                                        (personDetail.last_name ? personDetail.last_name : "") : ''}</span>
                                </div>
                            </div>
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.dob_txt}</label>
                                    <span>{personDetail && personDetail.date_of_birth ? moment(personDetail.date_of_birth).format("D-MM-YYYY") : ''}</span>
                                </div>
                            </div>
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.gender_txt}</label>
                                    <span>{personDetail ? personDetail.gender : ''}</span>
                                </div>
                            </div>
                            {/* <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.username_txt}</label>
                                    <span>{personDetail ? personDetail.user_name : ''}</span>
                                </div>
                            </div> */}
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.mobile_no_txt}</label>
                                    <span>{personDetail && personDetail.phone_number && personDetail.country_code ? (personDetail.country_code + ' ' + personDetail.phone_number) : ''}</span>
                                    {personDetail && personDetail.phone_verified === 0 ?
                                        <div className="no-varify-form">
                                            <fieldset className="sf-form no-label">
                                                <Field
                                                    name="phone_code"
                                                    placeholder="Enter OTP here."
                                                    type="text"
                                                    validate={[isRequired, isNumber]}
                                                    id="phone_code"
                                                    component={customInput} />
                                            </fieldset>
                                            <button type="button" className="bnt bnt-active" onClick={this.handleVerifyPhn}>Verify</button>
                                            {this.state.phnOtpErr ?
                                                <span class="error-input">This is a required field</span>
                                                :
                                                ''
                                            }
                                            <Link className="re-send-bnt" onClick={(val) => this.resendOtpPhn(val = 'PHONE')}>Resend OTP</Link>
                                        </div>
                                        :
                                        ''
                                    }
                                </div>

                            </div>
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.phone_no_txt}</label>
                                    <span>{personDetail ? personDetail.contact_number : 'Not Provided.'}</span>
                                </div>
                            </div>
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.primary_email_txt}</label>
                                    <span>{personDetail ? personDetail.email_address : ''}</span>
                                    {personDetail && personDetail.email_verified === 0 ?
                                        <div className="no-varify-form">
                                            <fieldset className="sf-form no-label">
                                                <Field
                                                    name="email_code"
                                                    placeholder="Enter OTP here."
                                                    type="text"
                                                    id="email_code"
                                                    validate={[isRequired, isNumber]}
                                                    component={customInput} />
                                            </fieldset>
                                            <button type="button" className="bnt bnt-active" onClick={this.handleVerifyEmail}>Verify</button>
                                            {this.state.emailOtpErr ?
                                                <span class="error-input">This is a required field</span>
                                                :
                                                ''
                                            }
                                            <Link className="re-send-bnt" onClick={(val) => this.resendOtpEmail(val = 'EMAIL')}>Resend OTP</Link>
                                        </div>
                                        :
                                        ''
                                    }
                                </div>
                            </div>
                            {/* <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.role_txt}</label>
                                    <span>{personDetail ? personDetail.role : ''}</span>
                                </div>
                            </div> */}

                        </div>

                    </div>
                </div>


                {/* Residential Address */}

                <div className="sf-card mt-3">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.res_address_txt}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        <div className="data-v-col">
                            <div className="view-text-value">
                                <label>{Strings.address_txt}</label>
                                <span>
                                    {personDetail ? personDetail.street_address + ', ' + personDetail.city
                                        + ', ' + personDetail.state + ', ' + personDetail.country + ', ' + personDetail.zip_code : ''}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Experience */}

                <div className="sf-card mt-3">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.experience_txt}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        <table className="sf-table sf-t-br-strip">
                            <tr>
                                <th>{personDetail ? Strings.area_of_expertise : ''}</th>
                                <th>{personDetail ? Strings.hours_of_experinace : ''}</th>
                            </tr>
                            {personDetail && personDetail.user_experiences
                                && personDetail.user_experiences.map((exp) => {
                                    return (
                                        <tr>
                                            <td><span>{exp && exp.sub_category ? exp.sub_category.sub_category_name : ''}</span></td>
                                            <td><span>{exp ? exp.hours_of_experience : ''}</span></td>
                                        </tr>
                                    )
                                })

                            }


                            {/* <tr>
                                <td>Window Cleaning</td>
                                <td>100</td>
                            </tr>
                            <tr>
                                <td>Carpet Cleaning</td>
                                <td>230</td>
                            </tr> */}
                        </table>
                    </div>
                </div>



                {/* Emergency Contact Details */}

                <div className="sf-card mt-3">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.emergency_contact_dtl}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        <div className="data-v-row">

                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.full_name_txt}</label>
                                    <span>{personDetail ? personDetail.ec_full_name : ''}</span>
                                </div>
                            </div>
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.relationship_txt}</label>
                                    <span>{personDetail ? personDetail.relationship : ''}</span>
                                </div>
                            </div>
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.mobile_no_txt}</label>
                                    <span>{personDetail ? personDetail.ec_mobile_number : ''}</span>
                                </div>
                            </div>
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.email_txt}</label>
                                    <span>{personDetail ? personDetail.ec_email : ''}</span>
                                </div>
                            </div>
                            <div className="data-v-col">
                                <div className="view-text-value">
                                    <label>{Strings.res_address_txt}</label>
                                    <span>
                                        {personDetail ? personDetail.ec_street_address + ', ' + personDetail.ec_city
                                            + ', ' + personDetail.ec_state + ', ' + personDetail.ec_country + ', ' + personDetail.ec_zip_code : ''}
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </form>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profileManagement && state.profileManagement.profile,
        subCategories: state.industryManagement.subCategories,
        formValues: state.form && state.form.ViewPesonalDetails &&
            state.form.ViewPesonalDetails.values ? state.form.ViewPesonalDetails.values : {},
    }
}

const mapDispatchToprops = dispatch => {
    return {
        industryActions: bindActionCreators(industryActions, dispatch),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(actions, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({ form: 'ViewPesonalDetails', validate ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(ViewPesonalDetails)