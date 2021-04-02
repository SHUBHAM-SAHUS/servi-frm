
import React from 'react';
import { Upload, notification } from 'antd';
import { reduxForm, Field, isDirty } from 'redux-form';
import { addNewLicencesValidator } from '../../../utils/Validations/addNewLicencesValidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import * as actions from '../../../actions/profileManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { CustomDatepicker } from '../../common/customDatepicker';
import moment from 'moment';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage, handleFocus, DeepTrim } from '../../../utils/common';


const Dragger = Upload.Dragger;
class EditLicences extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            fileList: [],
            fileError: 'none'
        }

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    componentDidMount() {
        this.setState({
            fileList: [{
                uid: this.props.initialValues.image,
                name: this.props.initialValues.image,
                status: 'done',
                url: this.props.profile[0].licences_file_path + this.props.initialValues.image
            }]
        })
    }

    componentWillReceiveProps(props, state) {

    }


    componentDidUpdate(prevProps, prevState) {
        if (this.props.initialValues.id !== prevProps.initialValues.id) {
            this.setState({
                fileList: [{
                    uid: this.props.initialValues.image,
                    name: this.props.initialValues.image,
                    status: 'done',
                    url: this.props.profile[0].licences_file_path + this.props.initialValues.image
                }]
            })
        }
    }

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);

        formData.issued_date = moment(formData.issued_date).toString()
        formData.expiry_date = moment(formData.expiry_date).toString()
        let profileProgress = this.props.profile && this.props.profile[0] && !this.props.profile[0].licences ?
            this.props.profileComplete + 10 : this.props.profileComplete
        formData = { ...formData, 'profile_progress': profileProgress }
        var finalFormData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key === 'file') {
                finalFormData.append(key, formData.file)
            }
            else {
                finalFormData.append(key, JSON.stringify(formData[key]));
            }
        });

        this.props.userActions.adNewLicencesApi(finalFormData)
            .then(flag => {
                this.handleCancel();
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
                            ? error.data.message : Strings.generic_validate,
                        onClick: () => { },
                        className: 'ant-warning'
                    });
                } else {
                    notification.error({
                        message: Strings.error_title,
                        description: error && error.data && error.data.message && typeof error.data.message == 'string'
                            ? error.data.message : Strings.generic_error,
                        onClick: () => { },
                        className: 'ant-error'
                    });
                }
            });
    }

    handlePreUpload = (file, fileList) => {
        return false;
    }

    handleChange = info => {
        const isJpgOrPng = info.file.type === 'image/jpeg' || info.file.type === 'image/png' || info.file.type === 'application/pdf';
        const isLt2M = info.file.size / 1024 / 1024 < 2;

        if (!isJpgOrPng) {
            notification.error({
                message: Strings.error_title,
                description: 'You can only upload JPG/PNG file!',
                onClick: () => { },
                className: 'ant-error'
            });
        } else {
            if (!isLt2M) {
                notification.error({
                    message: Strings.error_title,
                    description: 'Image must smaller than 2MB!',
                    onClick: () => { },
                    className: 'ant-error'
                });
            } else {
                if (this.state.fileList.length === 0 && info.file.status !== 'removed') {
                    this.setState({ fileList: [...info.fileList] })
                    this.props.change('file', info.file)
                    this.setState({
                        fileError: 'none'
                    })
                }
                if (this.state.fileList.length > 0) {
                    let fileList = [...info.fileList];
                    fileList = fileList.slice(-1);
                    this.setState({ fileList })
                    this.props.change('file', info.file)
                }
            }
        }
    }

    handleRemove = file => {
        file.status = 'removed';
        this.setState({ fileList: [] });
        delete this.props.formValues.file;
    }

    handleCancel = () => {
        this.props.reset();
        this.props.onCancel();
    }

    render() {
        const { handleSubmit, licenceType } = this.props;

        const uploadLicenceProps = {
            accept: ".jpeg,.jpg,.png,.pdf",
            multiple: false,
            listType: "picture",
            fileList: this.state.fileList,
            beforeUpload: this.handlePreUpload,
            onChange: this.handleChange,
            onRemove: this.handleRemove,
        };
        return (
            <div>
                <form onSubmit={handleSubmit(this.onSubmit)}>

                    <fieldset className="form-group sf-form">
                        <Field
                            label={Strings.licence_type}
                            name="type"
                            placeholder={Strings.type_licen}
                            // validate={isRequired}
                            id="type"
                            options={licenceType && licenceType.map((type) => ({
                                title: type.name,
                                value: type.id
                            }))}
                            component={CustomSelect} />
                    </fieldset>
                    <fieldset className="form-group sf-form">
                        <Field
                            label={Strings.licence_number}
                            name="number"
                            placeholder={Strings.number_licen}
                            type="text"
                            id="number"
                            component={customInput} />
                    </fieldset>
                    <fieldset className="form-group sf-form">
                        <Field
                            label={Strings.licence_issued_by}
                            name="issued_by"
                            placeholder={Strings.issued_by_licen}
                            type="text"
                            id="issued_by"
                            component={customInput} />
                    </fieldset>
                    <fieldset className="form-group sf-form lsico">
                        <Field
                            label={Strings.licence_issued_date}
                            name="issued_date"
                            type="text"
                            id="issued_date"
                            component={CustomDatepicker} />
                    </fieldset>
                    <fieldset className="form-group sf-form lsico">
                        <Field
                            label={Strings.licence_expiry_date}
                            name="expiry_date"
                            type="text"
                            id="expiry_date"
                            component={CustomDatepicker} />
                    </fieldset>

                    <div className="form-group upload-d-file">
                        <label>{Strings.choose_file}<span>{Strings.suppoert_file_type}</span></label>
                        <div className="logo-upload">
                            <Dragger  {...uploadLicenceProps} >
                                <p className="ant-upload-drag-icon">
                                    <i class="anticon material-icons">cloud_upload</i>
                                </p>
                                <p className="ant-upload-text">{Strings.img_upload_text}</p>
                            </Dragger>
                        </div>
                        {this.state.fileError === 'block' ?
                            <label className="error-input">Please Upload fill.</label>
                            :
                            ''
                        }
                    </div>

                    <div className="all-btn multibnt">
                        <div className="btn-hs-icon d-flex justify-content-between">
                            <button type="button" onClick={this.handleCancel} className="bnt bnt-normal">
                                {Strings.cancel_btn}</button>
                            <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                {Strings.update_btn}</button>
                        </div>
                    </div>

                </form>
            </div>
        )
    }
}

const mapStateToProps = (state) => {

    return {
        formValues: state.form && state.form.EditLicences && state.form.EditLicences.values
            ? state.form.EditLicences.values : {},
        licenceType: state.profileManagement && state.profileManagement.licenceType,
        profile: state.profileManagement && state.profileManagement.profile,
        profileComplete: state.profileManagement && state.profileManagement.profileComplete,
        isDirty: isDirty('EditLicences')(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(actions, dispatch),
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'EditLicences', validate: addNewLicencesValidator, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(EditLicences)