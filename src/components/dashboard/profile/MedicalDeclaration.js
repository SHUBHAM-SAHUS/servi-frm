import React from 'react';
import { Icon, Dropdown, Menu, Upload, message, Radio, Modal, notification } from 'antd';
import { reduxForm, Field, isDirty } from 'redux-form';
import { validate } from '../../../utils/Validations/medicalDeclarationValidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import { customTextarea } from '../../common/customTextarea';
import * as actions from '../../../actions/profileManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { CustomCheckbox } from '../../../components/common/customCheckbox';
import { isRequired } from '../../../utils/Validations/scopeDocValidation';
import { SignCanvas } from '../../common/SignCanvas';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage, handleFocus, DeepTrim } from '../../../utils/common';
import moment from 'moment';

// file upload dragge and drops

const Dragger = Upload.Dragger;


class MedicalDeclaration extends React.Component {
    constructor(props) {
        super(props);

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    // Radio Button

    state = {
        affected_by_injury: 1,
        australian_citizen: 1,
        convicted_of_offence: 1,
        accept_job_requirement: 0,
    };

    onChangeInjury = e => {
        this.setState({
            affected_by_injury: e.target.value,
        });
        if (e.target.value === 0) {

        }
    };

    onChangeCitizen = e => {
        this.setState({
            australian_citizen: e.target.value,
        });
    };

    onChangeOffence = e => {
        this.setState({
            convicted_of_offence: e.target.value,
        });

    };

    onChangeAcceptJob = checked => {
        this.setState({
            accept_job_requirement: checked
        })

    }


    // more info
    // editMenu = (
    //     <Menu>
    //         <Menu.Item onClick={this.handleEditClick}>{Strings.menu_edit_org}</Menu.Item>
    //     </Menu>
    // )

    onSaveSignature = (signDetails, file) => {
        signDetails.file_index = 0;
        this.props.change('signature_file', file)
    }

    onSubmit = async(formData) => {
        formData = await DeepTrim(formData);

        formData.accept_job_requirement = this.state.accept_job_requirement ? 1 : 0
        formData.affected_by_injury = this.state.affected_by_injury
        formData.convicted_of_offence = this.state.convicted_of_offence
        formData.australian_citizen = this.state.australian_citizen
        formData = { ...formData, 'profile_progress': this.props.profileComplete }

        var finalFormData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'signature_file') {
                finalFormData.append(key, formData.signature_file)

            }
            else {
                finalFormData.append(key, JSON.stringify(formData[key]));
            }
        });

        var sign
        Object.keys(formData).forEach(key => {
            if (key === 'signature_file') {
                sign = key
            }
        })

        if (sign) {
            this.props.userActions.addMedicalDeclaration(finalFormData)
                .then(flag => {
                    notification.success({
                        message: Strings.success_title,
                        description: flag,
                        onClick: () => { },
          className: 'ant-success'
                    });
                    this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name);
                }).catch((error) => {
                    if (error.status === VALIDATE_STATUS) {
                        notification.warning({
                            message: Strings.validate_title,
                            description: error && error.data && typeof error.data.message == 'string'
                                ? error.data.message : Strings.generic_validate,onClick: () => { },
          className: 'ant-warning'
                        });
                    } else {
                        notification.error({
                            message: Strings.error_title,
                            description: error && error.data && error.data.message && typeof error.data.message == 'string'
                                ? error.data.message : Strings.generic_error,onClick: () => { },
          className: 'ant-error'
                        });
                    }
                });
        } else {
            notification.error({
                message: Strings.error_title,
                description: 'Signature must!',
                onClick: () => { },
          className: 'ant-error'
            });
        }
    }

    render() {
        const { handleSubmit, initialValues } = this.props;
        const editMenu = (
            <Menu>
                <Menu.Item></Menu.Item>
            </Menu>
        )

        const props = {
            name: 'file',
            action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            headers: {
                authorization: 'authorization-text',
            },
            onChange(info) {
                if (info.file.status !== 'uploading') {
                }
                if (info.file.status === 'done') {
                    message.success(`${info.file.name} file uploaded successfully`);
                } else if (info.file.status === 'error') {
                    message.error(`${info.file.name} file upload failed.`);
                }
            },
        };
        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>

                {/* Personal Details */}

                <div className="sf-card">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.tab_medical_dclr}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        <div className="medic-content">
                            <h3>The inherent requirements of the job include: </h3>
                            <p>Repetitive bending and stooping Repetitive kneeling. Reaching and stretching. Repetitive gripping and handling. Frequent twisting. Standing / walking for extended periods. Regular lifting of weights up to 10kgs. Work above shoulder height. Irregular lifting of weights 10–17kg. Assisted lifting of weights greater than 17kgs.</p>

                            <div className="sf-chkbx-group nrml-txt">
                                <Field
                                    name="accept_job_requirement"
                                    label="Yes I understand and accept"
                                    onChange={this.onChangeAcceptJob}
                                    disabled={initialValues}
                                    component={CustomCheckbox} />
                            </div>

                            <p className="mt-5">Are you currently affected by any injury or condition that may impact upon your ability to perform all the duties of the job? If so, please provide details and advise on what measures may be taken to accommodate your injury or condition so that you could perform the job satisfactorily.</p>

                            <div className="sf-chkbx-group mb-2">
                                <Radio.Group name="affected_by_injury" disabled={initialValues} onChange={this.onChangeInjury} value={this.state.affected_by_injury}>
                                    <Radio value={1}>Yes</Radio>
                                    <Radio value={0}>No</Radio>
                                </Radio.Group>
                            </div>
                            {initialValues ?
                                <div className="view-text-value">
                                    <span>{initialValues.injury_details}</span><br></br>
                                </div>
                                :
                                <fieldset className="form-group sf-form">
                                    <Field
                                        name="injury_details"
                                        type="text"
                                        validate={this.state.affected_by_injury ? isRequired : []}
                                        disabled={this.state.affected_by_injury == 0}
                                        component={customTextarea} />
                                </fieldset>
                            }

                            <i className="sf-note">Please note, if you fail to disclose an existing condition, then any future aggravation of your injury arising out of your employment may be disqualified for compensation under applicable Worker’s Compensation legislation.</i>

                            <p className="mt-5">Are you a citizen of Australia or otherwise authorized to work in Australia?</p>
                            <div className="sf-chkbx-group">
                                <Radio.Group name="australian_citizen" disabled={initialValues} onChange={this.onChangeCitizen} value={this.state.australian_citizen}>
                                    <Radio value={1}>Yes</Radio>
                                    <Radio value={0}>No</Radio>
                                </Radio.Group>
                            </div>

                            <p className="mt-5">Have you ever been convicted* of a criminal offence? To be convicted a court would have made a finding that you were either: convicted by a single judge or jury of the offence or found guilty of the offence(s) charged but dismissed without conviction.</p>
                            <div className="sf-chkbx-group mb-3">
                                <Radio.Group name="convicted_of_offence" disabled={initialValues} onChange={this.onChangeOffence} value={this.state.convicted_of_offence}>
                                    <Radio value={1}>Yes</Radio>
                                    <Radio value={0}>No</Radio>
                                </Radio.Group>
                            </div>
                            {initialValues ?
                                <div className="view-text-value">
                                    <span>{initialValues.offence}</span><br></br>
                                </div>
                                :
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label="Provide details about the offence"
                                        name="offence"
                                        type="text"
                                        validate={this.state.convicted_of_offence ? isRequired : []}
                                        disabled={this.state.convicted_of_offence == 0}
                                        component={customTextarea} />
                                </fieldset>
                            }
                        </div>
                    </div>
                </div>


                {/* Super Fund Provider */}

                <div className="sf-card mt-3">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.sf_declaration}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        <div className="medic-content">
                            <p>I understand that all offers of employment may be conditional upon satisfactory reference and background checks being obtained, (including National criminal record and pre-employment medical checks, as relevant and required for the position) and the production of all documents necessary for High Clean Pty Ltd to verify my identity, qualifications and ability to work in Australia. I consent to the authorised representatives of High Clean Pty Ltd contacting any person(s) or institutions relevant to this application to undertake these verifications and checks.</p>
                            <p className="mt-4">I certify that the information provided in this application is true and complete to the best of my knowledge, information and belief. I understand withholding relevant information or submitting false or misleading information on this application, my resume, during interviews or at any other time during the hiring process, may result in my disqualification from further consideration for employment or if I am employed, the termination of my employment.</p>
                            {initialValues ?
                                <p><strong>Date of Acceptance:</strong> {initialValues && initialValues.created_at && moment(initialValues && initialValues.created_at).format('Do MMM YYYY')} - {initialValues && initialValues.created_at && moment(initialValues && initialValues.created_at).format('hh:mm a')} AEDT</p>
                                :
                                <p><strong>Date of Acceptance:</strong> {moment().format("Do MMM YYYY")}  AEDT</p>
                            }

                        </div>
                    </div>
                </div>

                {/* Bank Account Details */}

                <div className="sf-card mt-3">
                    <div className="sf-card-head abb-1 d-flex justify-content-between">
                        <h2 className="sf-pg-heading">{Strings.sf_signature}</h2>
                        <div className="info-btn disable-dot-menu">
                            <Dropdown className="more-info" disabled overlay={editMenu}>
                                <i className="material-icons">more_vert</i>
                            </Dropdown>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        <div className="sf-sign-items">
                            <div className="logo-upload sf-signature">
                                {/* sign here */}
                                {initialValues && initialValues.sign ?
                                    <div className="signature-box">
                                        <div className="upload-ur-sign">
                                            <div className="sign-box">
                                                <img src={initialValues.sign} alt="SF logo" />
                                            </div>
                                        </div>
                                    </div>
                                    :
                                    <SignCanvas signDetail={{
                                        // user_name: JSON.parse(getStorage(ADMIN_DETAILS)).user_name
                                        // , user_first_name: JSON.parse(getStorage(ADMIN_DETAILS)).name,
                                        // user_role_name: JSON.parse(getStorage(ADMIN_DETAILS)).role.role_name
                                    }}
                                        onSave={this.onSaveSignature}></SignCanvas>
                                }
                            </div>
                            {/* <button className="clear-txt">{Strings.clear_txt}</button> */}
                        </div>

                    </div>
                </div>

                <div className="all-btn d-flex justify-content-end mt-4">
                    <div className="btn-hs-icon">
                        {initialValues ?
                            ''
                            : <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                <Icon type="save" theme="filled" /> Save</button>
                        }
                    </div>
                </div>
            </form>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        formValues: state.form && state.form.MedicalDeclaration &&
            state.form.MedicalDeclaration.values ? state.form.MedicalDeclaration.values : {},
        isDirty: isDirty('MedicalDeclaration')(state),
        profileComplete: state.profileManagement && state.profileManagement.profileComplete
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(actions, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({ form: 'MedicalDeclaration', validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(MedicalDeclaration)