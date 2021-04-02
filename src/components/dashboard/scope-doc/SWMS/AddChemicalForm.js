import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Modal, Upload, message, notification } from 'antd';
import { customInput } from '../../../common/custom-input';
import { Strings } from '../../../../dataProvider/localize';
import { validate } from '../../../../utils/Validations/SWMSValidation';
import { CustomDatepicker } from '../../../common/customDatepicker';
import * as action from '../../../../actions/SWMSAction';
import { getStorage, handleFocus, DeepTrim } from '../../../../utils/common';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../../dataProvider/constant';
import { extactHRWDefaults } from '../../SWMSManagement/ViewEditHRW';
import { CustomSelect } from '../../../common/customSelect';
import { CustomSwitch } from '../../../common/customSwitch';
const Dragger = Upload.Dragger;



class AddChemicalForm extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            validateFile: false
        };
    }

    addChemicalApi = (finalFormData, org_id, job_id) => {
        this.props.addChemical(finalFormData, org_id, job_id).then((flag) => {
            this.props.reset();
            this.setState({ fileList: [] });
            this.props.close()
        }).catch((error) => {
            if (error.status == VALIDATE_STATUS) {
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
                        ? error.data.message : error ? error : Strings.generic_error, onClick: () => { },
                    className: 'ant-error'
                });
            }
        });
    }
    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        if (formData.name && this.state.fileList.length == 0) {
            this.setState({ validateFile: true })
            return
        }

        var finalFormData = new FormData();
        /*  Object.keys(formData).forEach(key => {
             finalFormData.append(key, formData[key]);
         }) */
        finalFormData.append("chemicals", JSON.stringify([formData]))
        if (this.state.fileList.length > 0) {
            finalFormData.append('document', this.state.fileList[0]);
        }
        if (this.props.organisation_id && this.props.job_id) {
            finalFormData.append('org_id', this.props.organisation_id);
            finalFormData.append('job_id', this.props.job_id);
            this.addChemicalApi(finalFormData, this.props.organisation_id, this.props.job_id);
        } else {
            finalFormData.append('org_id', JSON.stringify(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id));
            this.addChemicalApi(finalFormData);
        }
    }

    removeFile = () => this.setState({ fileList: [], logoImageURL: '', validateFile: true });

    render() {
        const { handleSubmit } = this.props;
        const uploadPicProps = {
            beforeUpload: file => {
                this.setState({
                    fileList: [file],
                    validateFile: false
                });
                return false;
            },
            multiple: false,
            onChange: (info) => {
                // this.setState({ fileList: [info.file] })
            },
            accept: ".jpeg,.jpg,.png,.pdf",
            fileList: this.state.fileList,
            onRemove: this.removeFile,

        }

        return (
            <form onSubmit={handleSubmit(this.onSubmit)} >
                <fieldset className="form-group sf-form">
                    <Field
                        label="Chemical Name"
                        name="name"
                        type="name"
                        component={customInput} />
                </fieldset>
                <div className="form-group sf-form">
                    <label className="upload-f">Upload Document <span>Supported File Types</span></label>
                    <div className="sm-upload-box">
                        <Dragger  {...uploadPicProps}>
                            <p className="ant-upload-drag-icon">
                                <i class="material-icons">cloud_upload</i>
                            </p>
                            <p className="ant-upload-text">{Strings.img_upload_text_sc}</p>
                        </Dragger>
                        {this.state.validateFile ? <span className="error-input">Select file</span> : null}
                    </div>
                </div>
                <fieldset className="form-group sf-form lsico">
                    <Field
                        label="Expiry"
                        name="expiry"
                        type="name"

                        component={CustomDatepicker} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label="Defaults"
                        name={`defaults`}
                        mode="multiple"
                        options={extactHRWDefaults(this.props.orgSWMS)}
                        component={CustomSelect} />
                </fieldset>
                <fieldset className="sf-form">
                    <Field
                        label="Active"
                        name={`active`}
                        component={CustomSwitch}
                    />
                </fieldset>

                <div className="all-btn multibnt">
                    <div className="btn-hs-icon d-flex justify-content-between">
                        <button onClick={() => this.props.close()} className="bnt bnt-normal" type="button">
                            {Strings.cancel_btn}</button>
                        <button type="submit" className="bnt bnt-active">
                            {Strings.add_txt}</button>
                    </div>
                </div>
            </form >
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    // var value = state.scopeDocs.scopeDocs ? state.scopeDocs.scopeDocs.find(item => item.id === ownProps.selectedScopeDocID) : {};
    return {
        initialValues: { defaults: [], active: 1 },
        orgSWMS: state.swmsReducer.orgSWMS

    }
}

export default compose(
    connect(mapStateToProps, action),
    reduxForm({
        form: 'AddChemicalForm', validate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(AddChemicalForm)



