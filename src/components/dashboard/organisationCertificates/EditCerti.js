import React from 'react';
import { Icon, Menu, Dropdown, Upload, Modal, notification } from 'antd';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { getStorage, setStorage, handleFocus } from '../../../utils/common';
import ScrollArea from 'react-scrollbar';

import { validate } from '../../../utils/Validations/roleValidation';
import { customInput } from '../../common/custom-input';
import { CustomSwitch } from '../../common/customSwitch';
import * as actions from '../../../actions/orgCertificatesAction';
import { Strings } from '../../../dataProvider/localize';
import { CustomCheckbox } from '../../../components/common/customCheckbox';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { CustomDatepicker } from '../../common/customDatepicker';
import { customTextarea } from '../../common/customTextarea'
import { DeepTrim } from '../../../utils/common';

import $ from 'jquery';
import moment from 'moment';

function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

class EditCerti extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            displayEdit: 'none', displayPermissionEdit: 'none', cardExpnadBtn: true,
            logoImageURL: '', file: []
        }
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }

    onSubmit = async formData => {
		formData = await DeepTrim(formData);

        formData.active = +formData.active;
        formData.expiry_date = formData.expiry_date.toString();
        var finalFormData = new FormData();
        Object.keys(formData).forEach(key => {
            if (key != 'file_name')
                finalFormData.append(key, formData[key]);
        })
        if (this.state.file && this.state.file.length > 0)
            finalFormData.append("file_name", this.state.file[0])
        this.props.action.updateCerti(finalFormData, formData.organisation_id)
            .then((message) => {
                this.handleCancel();
                this.setState({ file: [] });
                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                });
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
                      ? error.data.message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                  });
                }
              });
    }

    handleEditClick = () => {
        this.setState({ displayEdit: 'block' });
        this.setState({ displayPermissionEdit: 'none' });
        if (!this.state.cardExpnadBtn) {
            this.handleExpand()
        }
    }

    handlePermissionEditClick = () => {
        this.setState({ displayPermissionEdit: 'block' });
        this.setState({ displayEdit: 'none' });
        if (!this.state.cardExpnadBtn) {
            this.handleExpand()
        }
    }

    handleCancel = () => {
        this.setState({ displayEdit: 'none' });
    }

    handlePermissionCancel = () => {
        this.setState({ displayPermissionEdit: 'none' });
    }

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    }

    removeFile = () => this.setState({ file: [], logoImageURL: '' });

    render() {
        const { handleSubmit } = this.props;
        var orgCerti = this.props.orgCerti.find(role => role.id === this.props.location.state)
        var menu = (<Menu>
            <Menu.Item onClick={this.handleEditClick}>
                Edit Certificate
            </Menu.Item>
        </Menu>);
        const uploadPicProps = {
            beforeUpload: file => {
                this.setState({
                    file: [file],
                });
                return false;
            },
            multiple: false,
            onChange: (info) => {
                this.props.change(`isDirty`, false)
                /* getBase64(info.file, imageUrl =>
                    this.setState({
                        logoImageURL: imageUrl,
                        // file: [info.file]
                    }),
                ); */
            },
            accept: ".jpeg,.jpg,.png,.pdf",
            fileList: this.state.file,
            onRemove: this.removeFile
        };



        return (
            <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
                <div className="row">
                    <div className="col-lg-8 col-md-12 mb-4">
                        <div className="sf-card-wrap">
                            {/* zoom button  */}
                            <div className="card-expands">
                                <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                                    <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                            </div>
                            <div className="sf-card" >
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">Organisation Certificate Details</h2>
                                    <div className="info-btn">
                                        {/* Drop down for card */}

                                        <Dropdown className="more-info" overlay={menu}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                        {/*Drop down*/}
                                    </div>
                                </div>

                                <div className="sf-card-body mt-2">

                                    <div className="data-v-row">
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{"Name"}</label>
                                                <span>{orgCerti ? orgCerti.name : ''}</span>
                                            </div>
                                        </div>

                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{"Expiry Date"}</label>
                                                <span>{orgCerti && orgCerti.expiry_date ? moment(orgCerti.expiry_date).format("YYYY-MM-DD") : ''}</span>
                                            </div>
                                        </div>

                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{"Description"}</label>
                                                <span>{orgCerti ? orgCerti.description : ''}</span>
                                            </div>
                                        </div>

                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{"Certificate number"}</label>
                                                <span>{orgCerti ? orgCerti.certificate_number : ''}</span>
                                            </div>
                                        </div>

                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.role_status}</label>
                                                <span>{orgCerti ? Boolean(orgCerti.active).toString() : ''}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>Download Certificate Document</label>
                                                <a href={orgCerti && orgCerti.s3FileUrl} download={orgCerti && orgCerti.file_name} className="normal-bnt" target='_blank'>
                                                    <i class="material-icons">get_app</i>
                                                    <span className="edit-image-logo">{"Open document"}</span></a>
                                            </div>
                                        </div>
                                    </div>
                                    {/* <div className="data-v-row certifi-img">
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{"Certificate Image "}</label>
                                                {orgCerti && orgCerti.s3FileUrl ?
                                                    <img className="cerfic-pic" alt="Certificate" src={orgCerti.s3FileUrl} /> : null}
                                            </div>
                                        </div>
                                    </div> */}

                                </div>
                            </div>

                            {/* perimission */}


                        </div>

                    </div>

                    {/* Edit */}

                    <div className="col-lg-4 col-md-12" style={{ display: this.state.displayEdit }}>
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h4 className="sf-sm-hd sf-pg-heading">Edit Organisation Certificate</h4>
                                <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                            </div>
                            <div className="sf-card-body mt-2">
                                <form onSubmit={handleSubmit(this.onSubmit)} >
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={"Certificate name"}
                                            name="name"
                                            type="name"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form lsico">
                                        <Field
                                            label={"Expiry Date"}
                                            name="expiry_date"
                                            type="name"
                                            id="name"
                                            component={CustomDatepicker} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={"Certificate number"}
                                            name="certificate_number"
                                            type="name"
                                            id="name"
                                            component={customInput} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={"Description"}
                                            name="description"
                                            type="name"
                                            id="name"
                                            component={customTextarea} />
                                    </fieldset>
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            name="active"
                                            id="active"
                                            label={Strings.role_status}
                                            component={CustomSwitch} />
                                    </fieldset>

                                    <div className="form-group">
                                        <div className="sm-upload-box">
                                            <Upload {...uploadPicProps}>
                                                <p className="ant-upload-drag-icon">
                                                    <i class="anticon material-icons">cloud_upload</i>
                                                </p>
                                                <p className="ant-upload-text">Update document</p>
                                            </Upload>
                                        </div>
                                    </div>

                                    <div className="all-btn multibnt">
                                        <div className="btn-hs-icon d-flex justify-content-between">
                                            <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                                                {Strings.cancel_btn}</button>
                                            <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                                {Strings.update_btn}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>

                    {/* update role Permission */}


                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    var value = state.orgCerti.orgCerti.find(role => role.id === ownProps.location.state);

    return {
        orgCerti: state.orgCerti.orgCerti,
        initialValues: value,
        isDirty: isDirty('editCerti')(state),
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'editCerti', validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(EditCerti)


