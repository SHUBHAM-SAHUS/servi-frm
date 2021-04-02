import React from 'react';
import { Icon, Dropdown, Menu, Modal, message, notification, Upload, Button } from 'antd';
import { reduxForm, Field, FieldArray, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../../common/custom-input';
import { customCountrySelect } from '../../../common/customCountrySelect';
import { CustomSelect } from '../../../common/customSelect';
import { Strings } from '../../../../dataProvider/localize';
import { CustomDatepicker } from '../../../common/customDatepicker';
import moment from 'moment';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../../dataProvider/constant';
import { isRequired, isNumber } from '../../../../utils/Validations/scopeDocValidation';
import { countryCodes } from '../../../../dataProvider/countryCodes'
import { handleFocus, DeepTrim } from '../../../../utils/common';
import * as actions from '../../../../actions/profileManagementActions';
import { Link } from 'react-router-dom';
import { getStorage, setStorage, countries, zones } from '../../../../utils/common';
import { personalDetailsForm } from '../../../../utils/Validations/personalDetailsFormValidation';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';
import { createCanvas, loadImage } from 'canvas';
import {
    loadModels,
    getFullFaceDescription,
    isFaceDetectionModelLoaded
} from '../../../../dataProvider/face';
import { searchExpandScopeDocsList } from '../../../../actions/scopeDocActions';

const INIT_STATE = {
    url: null,
    imageURL: null,
    fullDesc: null,
    imageDimension: null,
    error: null,
    loading: false
};

class PesonalDetailsForm extends React.Component {
    gender = ['Male', 'Female', 'Other']

    constructor(props) {
        super(props);
        this.state = {
            date: '',
            phnOtpErr: false,
            emailOtpErr: false,
            fileList: [],
            fileRemoved: false,
        }

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    static getDerivedStateFromProps(props, state) {
        var OrgSACountry = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).country : null;
        if (!props.formValues && props.formValues.ec_country || props.formValues && props.formValues.ec_country === '') {
            props.change(`ec_country`, OrgSACountry);
        }
    }

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);
        formData = { ...formData, 'profile_progress': this.props.profileComplete }
        let birthDate = moment(formData.date_of_birth).toString()
        formData.date_of_birth = birthDate

        delete formData.isDirty
        console.log(formData)
        //for uplaod profile picture form personal details.

        let finalFormData = new FormData();
        let newFile
        if (this.state.imageURL) {
            let binarydata = atob(this.state.imageURL.split(',')[1]);
            let array = []
            let i = 0
            while (i < binarydata.length) {
                array.push(binarydata.charCodeAt(i))
                i++
            };
            newFile = new Blob([new Uint8Array(array)], { type: 'image/png' })
            Object.keys(formData).forEach(key => {
                if (key === 'student_usi') {
                    if (formData[key]) {
                        finalFormData.append(key, formData[key]);
                    }
                } else if (key === 'zone') {
                    if (formData[key]) {
                        finalFormData.append(key, formData[key]);
                    }
                }
                else {
                    finalFormData.append(key, formData[key]);
                }
            });
            finalFormData.delete('profile_pic')
            finalFormData.append('profile_pic', newFile)
        } else {
            Object.keys(formData).forEach(key => {
                if (key === 'student_usi') {
                    if (formData[key]) {
                        finalFormData.append(key, formData[key]);
                    }
                } else if (key === 'zone') {
                    if (formData[key]) {
                        finalFormData.append(key, formData[key]);
                    }
                }
                else {
                    finalFormData.append(key, formData[key]);
                }
            });
            finalFormData.delete('profile_pic')
        }

        if (this.state.file && this.state.file.length > 0)
            finalFormData.append("visa_doc_file", this.state.file[0]);

        const { initialValues } = this.props
        console.log('initialValues', initialValues)
        if (initialValues.profile_pic || finalFormData.get('profile_pic')) {
            this.props.action.updateOrgUserPersonalDetails(finalFormData)
                .then((flag) => {
                    notification.success({
                        message: Strings.success_title,
                        description: flag,
                        onClick: () => { },
                        className: 'ant-success'
                    });
                    // this.props.onPersonDetails()
                    // this.props.reset()
                    this.props.action.getOrgUserDetails(this.org_user_id, this.org_user_name)
                        .then(() => {
                            this.setState({
                                fileRemoved: false
                            })
                            setStorage(ADMIN_DETAILS, JSON.stringify({
                                ...JSON.parse(getStorage(ADMIN_DETAILS)),
                                name: this.props && this.props.profile && this.props.profile[0] && this.props.profile[0].name ?
                                    this.props.profile[0].name : JSON.parse(getStorage(ADMIN_DETAILS)).name,
                                last_name: this.props && this.props.profile && this.props.profile[0] && this.props.profile[0].last_name ?
                                    this.props.profile[0].last_name : JSON.parse(getStorage(ADMIN_DETAILS)).last_name
                            }));
                        });
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
        } else {
            notification.warning({
                message: Strings.validate_title,
                description: 'Please upload your profile picture.',
                onClick: () => { },
                className: 'ant-warning'
            });
        }
    }

    handleVerifyPhn = () => {
        const phnCode = this.props.formValues.phone_code
        if (phnCode) {
            this.props.action.verifyAttr({ phone_code: phnCode })
                .then(message => {
                    this.setState({
                        phnVerify: 'none'
                    })
                    notification.success({
                        message: Strings.success_title,
                        description: message ? message : Strings.generic_error, onClick: () => { },
                        className: 'ant-success'
                    })
                    this.props.action.getOrgUserDetails(this.org_user_id, this.org_user_name);
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
            this.props.action.verifyAttr({ email_code: emailCode })
                .then(message => {
                    this.setState({
                        emailVerify: 'none'
                    })
                    notification.success({
                        message: Strings.success_title,
                        description: message ? message : Strings.generic_error, onClick: () => { },
                        className: 'ant-success'
                    })
                    this.props.action.getOrgUserDetails(this.org_user_id, this.org_user_name);
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
        this.props.action.resendVerifyAttr(val)
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
        this.props.action.resendVerifyAttr(val)
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

    disabledDate = (current) => {
        return current && current.valueOf() > Date.now();
    }

    resetState = () => {
        this.setState({ ...INIT_STATE });
    };

    mounting = async () => {
        await loadModels();
    };

    // profile pic loader
    profileLoaderView = (
        <div className="profile-loader">
            <div class="sk-circle">
                <div class="sk-circle1 sk-child"></div>
                <div class="sk-circle2 sk-child"></div>
                <div class="sk-circle3 sk-child"></div>
                <div class="sk-circle4 sk-child"></div>
                <div class="sk-circle5 sk-child"></div>
                <div class="sk-circle6 sk-child"></div>
                <div class="sk-circle7 sk-child"></div>
                <div class="sk-circle8 sk-child"></div>
                <div class="sk-circle9 sk-child"></div>
                <div class="sk-circle10 sk-child"></div>
                <div class="sk-circle11 sk-child"></div>
                <div class="sk-circle12 sk-child"></div>
            </div>
        </div>
    )

    handleFileChange = async file => {
        this.resetState();
        console.log(file)
        await this.setState({
            imageURL: URL.createObjectURL(file),
            loading: true
        });
        await this.handleImageChange();
    };

    getImageDimension = imageURL => {
        let img = new Image();
        img.src = imageURL;
        img.onload = () => {
            let HEIGHT = (this.state.WIDTH * img.height) / img.width;
            this.setState({
                HEIGHT,
                imageDimension: {
                    width: img.width,
                    height: img.height
                }
            });
        };
    };

    handleImageChange = async (image = this.state.imageURL) => {
        await this.getImageDimension(image);
        await getFullFaceDescription(image).then(fullDesc => {
            console.log(fullDesc)
            if (fullDesc.length > 1 || fullDesc.length === 0) {
                notification.error({
                    message: Strings.error_title,
                    description: 'Invalid Profile Photo!',
                    onClick: () => { },
                    className: 'ant-error'
                });
                this.setState({ uploadLoader: false });
                return;
            } else if (this.state.imageDimension.width < 150 && this.state.imageDimension.height < 150) {
                notification.error({
                    message: Strings.error_title,
                    description: 'Upload Profile Photo with size of 150 X 150 px',
                    onClick: () => { },
                    className: 'ant-error'
                });
                this.setState({ uploadLoader: false });
                return;
            } else {
                const canvas = createCanvas(this.state.imageDimension.width, this.state.imageDimension.height)
                const ctx = canvas.getContext('2d');


                var imageURL = ''
                loadImage(this.state.imageURL).then((image1) => {
                    ctx.shadowColor = '#000';
                    ctx.shadowBlur = 20;
                    ctx.shadowOffsetX = 0;
                    ctx.shadowOffsetY = 0;

                    // no crop
                    let cropParam = this.cropBoxDimention(fullDesc[0].detection, this.state.imageDimension.width, this.state.imageDimension.height)

                    // elementToDraw, cropX, cropY, width, height, x, y, width, height
                    //ctx.drawImage(image1, cropParam.cropX, cropParam.cropY, cropParam.cropWidth, cropParam.cropHeight, 0, 0, this.state.WIDTH, this.state.WIDTH);

                    // cropped
                    ctx.drawImage(image1, cropParam.cropX, cropParam.cropY, cropParam.cropWidth, cropParam.cropHeight, 0, 0, cropParam.cropWidth, cropParam.cropHeight);
                    //console.log(canvas.toDataURL())

                    imageURL = canvas.toDataURL()

                    loadImage(imageURL).then((image2) => {
                        const canvas2 = createCanvas(cropParam.cropWidth, cropParam.cropHeight)
                        const ctx2 = canvas2.getContext('2d');
                        ctx2.shadowColor = '#000';
                        ctx2.shadowBlur = 20;
                        ctx2.shadowOffsetX = 0;
                        ctx2.shadowOffsetY = 0;
                        ctx2.drawImage(image2, 0, 0, cropParam.cropWidth, cropParam.cropHeight, 0, 0, cropParam.cropWidth, cropParam.cropHeight);
                        imageURL = canvas2.toDataURL()
                        this.setState({ imageURL });
                        this.props.change('profile_pic', imageURL)
                        this.props.change('isDirty', true)
                        // this.uploadProfImage()
                    });


                }).catch((error) => {
                    console.log(error);
                });
                this.setState({ fullDesc, uploadLoader: false });
            }
        });
    };

    cropBoxDimention = (detection, imageWidth, imageHeight) => {
        const relativeBox = detection.relativeBox;
        const dimension = detection._imageDims;
        let referSize = dimension._width > dimension._height ? dimension._height : dimension._width
        console.log(referSize)

        let _X = imageWidth * relativeBox._x;
        let _Y = (relativeBox._y * imageWidth * dimension._height) / dimension._width;
        let _W = imageWidth * relativeBox.width;
        let _H = (relativeBox.height * imageHeight * dimension._height) /
            dimension._width;
        //return { cropX: X, cropY: Y, cropWidth: W, cropHeight: H }

        return {
            cropX: _X - (_X * 0.33), cropY: _Y - (_Y),
            cropWidth: _W + (_X * 0.66), cropHeight: _H + (_Y * 2)
        }
    }

    uploadProfImage = () => {
        this.setState({ uploadLoader: false })
        let finalFormData = new FormData();
        let binarydata = atob(this.state.imageURL.split(',')[1]);
        let array = []
        let i = 0
        while (i < binarydata.length) {
            array.push(binarydata.charCodeAt(i))
            i++
        };
        let newFile = new Blob([new Uint8Array(array)], { type: 'image/png' })
        finalFormData.append('profile_pic', newFile)
        return this.props.userActions.uploadProfileImage(finalFormData)
            .then((flag) => {
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

    removeFile = () => this.setState({ file: [], logoImageURL: '' });

    removeVisaDoc = () => {
        this.setState({
            fileRemoved: true,
        })
    }

    render() {

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
            },
            accept: ".jpeg,.jpg,.png,.pdf",
            fileList: this.state.file,
            onRemove: this.removeFile
        };

        const { handleSubmit, initialValues, formValues } = this.props;
        let visa_doc_file_path;
        if (initialValues && initialValues.visa_doc && this.state.fileRemoved) {
            visa_doc_file_path = null;
        } else {
            visa_doc_file_path = initialValues && initialValues.visa_doc ? initialValues.visa_doc : null
        }

        let roleSlug = getStorage(ADMIN_DETAILS) && JSON.parse(getStorage(ADMIN_DETAILS)).role.slug;

        const editMenu = (
            <Menu>
                <Menu.Item></Menu.Item>
            </Menu>
        )

        const props = {
            name: 'file',
            accept: ".jpeg,.jpg,.png",
            // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
            headers: {
                authorization: 'authorization-text',
            },
            // fileList: [this.state.file],
            showUploadList: false,
            beforeUpload: file => {
                this.setState({ uploadLoader: true })
                const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
                const isLt5M = file.size / 1024 / 1024 < 2;

                if (!isJpgOrPng) {
                    this.setState({ uploadLoader: false })
                    notification.error({
                        message: Strings.error_title,
                        description: 'You can only upload JPG/PNG file!',
                        onClick: () => { },
                        className: 'ant-error'
                    });
                } else if (!isLt5M) {
                    this.setState({ uploadLoader: false })
                    notification.error({
                        message: Strings.error_title,
                        description: 'Image must smaller than 2MB!',
                        onClick: () => { },
                        className: 'ant-error'
                    });
                } else {
                    const start = async () => {
                        this.mounting()
                        await this.handleFileChange(file)
                    }
                    Promise.all([
                        this.mounting()
                    ]).then(start)
                }
                return false;
            },
            onChange: info => {
                if (info.file.status !== 'uploading') {
                }
                /*  if (info.file.status === 'done') {
                     message.success(`${info.file.name} file uploaded successfully`);
                     getBase64(info.file.originFileObj, imageUrl =>
                         this.setState({
                             file: imageUrl,
                         }),
                     );
                 } else if (info.file.status === 'error') {
                     message.error(`${info.file.name} file upload failed.`);
                 } */
            },
            onRemove: this.removeFile
        };

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
                        <div className="row justify-content-center">
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <div className="">
                                    <div className="profile-pic" style={{ color: '#03a791', border: '4px solid #03a791' }}>
                                        {this.state.uploadLoader ?
                                            this.profileLoaderView
                                            : ''
                                        }
                                        {initialValues && initialValues.profile_pic ?
                                            <img src={initialValues.profile_pic} />
                                            :
                                            <Icon type="camera" theme="filled" />
                                        }
                                        {/* {/ <Icon type="camera" theme="filled" / > /} */}
                                        <Upload className="upload-pic temp-upload-pic" id="profile_pic" {...props}>
                                            {this.state.imageURL ? <span className="temp-pic-view"><img src={formValues.profile_pic} /></span> : ''}
                                            <Button><i class="fa fa-pencil"></i></Button>
                                        </Upload>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="row">
                            {/* <div className="col-md-4 col-sm-6 col-sm-12">
                                <div className="">
                                    <div className="profile-pic" style={{ color: '#03a791', border: '4px solid #03a791' }}>
                                        {this.state.uploadLoader ?
                                            this.profileLoaderView
                                            : ''
                                        }
                                        {initialValues && initialValues.profile_pic ?
                                            <img src={initialValues.profile_pic} />
                                            :
                                            <Icon type="camera" theme="filled" />
                                        }
                                        <Upload className="upload-pic temp-upload-pic" id="profile_pic" {...props}>
                                            {this.state.imageURL ? <span className="temp-pic-view"><img src={formValues.profile_pic} /></span> : ''}
                                            <Button><i class="fa fa-pencil"></i></Button>
                                        </Upload>
                                    </div>
                                </div>
                            </div> */}
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.first_name}
                                        name="name"
                                        placeholder={Strings.name_acc_pd}
                                        type="text"
                                        id="name"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.middle_name}
                                        name="middle_name"
                                        placeholder={Strings.middle_name_acc_pd}
                                        type="text"
                                        id="name"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.last_name}
                                        name="last_name"
                                        placeholder={Strings.last_name_acc_pd}
                                        type="text"
                                        id="last_name"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form lsico">
                                    <Field
                                        label={Strings.dob_txt}
                                        name="date_of_birth"
                                        id="date_of_birth"
                                        disabledDate={this.disabledDate}
                                        component={CustomDatepicker}
                                    />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.gender_txt}
                                        name="gender"
                                        placeholder="Male"
                                        type="text"
                                        id="gender"
                                        options={this.gender.map((gen) => ({
                                            title: gen,
                                            value: gen
                                        }))}
                                        component={CustomSelect} />
                                </fieldset>
                            </div>

                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <div className="sf-form">
                                    <label>{Strings.mobile_no_txt}</label>
                                    <div className="co-code-mobile-no">
                                        <fieldset className="sf-form co-code-txt no-label">
                                            <Field
                                                name={`country_code`}
                                                type="text"
                                                showSearch={1}
                                                options={countryCodes.map(country => ({
                                                    title: country.dial_code,
                                                    value: country.dial_code
                                                }))}
                                                component={CustomSelect}
                                            />
                                        </fieldset>
                                        <fieldset className="sf-form mobile-ntxt no-label">
                                            <Field
                                                name={`phone_number`}
                                                type="text"
                                                placeholder="Phone Number"
                                                maxLength="10"
                                                id="phone_number"
                                                component={customInput}
                                            />
                                        </fieldset>
                                    </div>
                                    {
                                        initialValues && initialValues.phone_verified === 0
                                            ? <div className="no-varify-form">
                                                <fieldset className="sf-form no-label">
                                                    <Field
                                                        name="phone_code"
                                                        placeholder="Enter OTP here."
                                                        type="text"
                                                        validate={isNumber}
                                                        id="phone_code"
                                                        component={customInput} />
                                                </fieldset>
                                                <button type="button" className="bnt bnt-active" onClick={this.handleVerifyPhn}>Verify</button>
                                                {
                                                    this.state.phnOtpErr
                                                        ? <span class="error-input">This is a required field</span>
                                                        : ''
                                                }
                                                <Link className="re-send-bnt" onClick={(val) => this.resendOtpPhn(val = 'PHONE')}>Resend OTP</Link>
                                            </div>
                                            : ''
                                    }
                                </div>
                                {/* <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.mobile_no_txt}
                                        name="phone_number"
                                        type="text"
                                        id="phone_number"
                                        component={customInput} />
                                </fieldset>
                                {initialValues && initialValues.phone_verified === 0 ?
                                    <div className="no-varify-form">
                                        <fieldset className="sf-form no-label">
                                            <Field
                                                name="phone_code"
                                                placeholder="Enter OTP here."
                                                type="text"
                                                validate={isNumber}
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
                                } */}
                            </div>
                            {roleSlug !== "STAFF" ?
                                < div className="col-md-4 col-sm-6 col-sm-12">
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.phone_no_txt}
                                            name="contact_number"
                                            type="text"
                                            id="contact_number"
                                            component={customInput} />
                                    </fieldset>
                                </div> :
                                <div></div>
                            }

                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.primary_email_txt}
                                        name="email_address"
                                        placeholder={Strings.email_address_acc_pd}
                                        type="text"
                                        id="email_address"
                                        component={customInput} />
                                </fieldset>
                                {initialValues && initialValues.email_verified === 0 ?
                                    <div className="no-varify-form">
                                        <fieldset className="sf-form no-label">
                                            <Field
                                                name="email_code"
                                                placeholder="Enter OTP here."
                                                type="text"
                                                id="email_code"
                                                validate={isNumber}
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
                            {/* <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.role_txt}
                                        name="role"
                                        type="text"
                                        id="role"
                                        component={customInput} />
                                </fieldset>
                            </div> */}
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.student_usi}
                                        name="student_usi"
                                        type="text"
                                        placeholder={Strings.student_usi}
                                        validate={isNumber}
                                        id="student_usi"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.zone_txt}
                                        name="zone"
                                        options={countries.map(country => ({ title: country, value: country.toString() }))}
                                        placeholder={Strings.zone_txt.toString()}
                                        component={customCountrySelect} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.visa_number}
                                        name="visa_number"
                                        type="text"
                                        placeholder={Strings.visa_number}
                                        id="visa_number"
                                        component={customInput} />
                                </fieldset>
                            </div>
                            <div className="col-md-4 col-sm-6 col-sm-12">
                                {
                                    visa_doc_file_path ?
                                        <fieldset className="form-group sf-form lsico">
                                            <label style={{ display: 'inline-block' }}>
                                                <p>License Document</p>
                                            </label>
                                            <div className="d-flex" >
                                                <a href={visa_doc_file_path} download
                                                    className="normal-bnt" target='_blank'>
                                                    <i class="material-icons">get_app</i>
                                                    <span className="edit-image-logo">{"Open document"}</span>
                                                </a>
                                                <button type="button" className="normal-bnt ml-5" onClick={this.removeVisaDoc}>
                                                    <i class="anticon material-icons">cloud_upload</i>
                                                </button>
                                            </div>

                                        </fieldset> :
                                        <fieldset className="form-group sf-form lsico">
                                            <label style={{ display: 'inline-block' }}>
                                                <p>License Document</p>
                                            </label>
                                            <div className="sm-upload-box">
                                                <Upload {...uploadPicProps}>
                                                    <p className="ant-upload-drag-icon">
                                                        <i class="anticon material-icons">cloud_upload</i>
                                                    </p>
                                                    <p className="ant-upload-text">update
                                                document</p>
                                                </Upload>
                                            </div>
                                        </fieldset>

                                }
                            </div>

                            <div className="col-md-4 col-sm-6 col-sm-12">
                                <fieldset className="form-group sf-form">
                                    <Field
                                        label={Strings.passport_number}
                                        name="passport_number"
                                        type="text"
                                        placeholder={Strings.passport_number}
                                        id="passport_number"
                                        component={customInput} />
                                </fieldset>
                            </div>
                        </div>
                        <div className="all-btn d-flex justify-content-end mt-4">
                            <div className="btn-hs-icon">
                                <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                    <Icon type="save" theme="filled" /> Save</button>
                            </div>
                        </div>
                    </div>

                </div>

            </form >
        );
    }
}

const mapStateToProps = (state) => {
    let value = {}
    if (state.profileManagement && state.profileManagement.profile) {
        for (let item of state.profileManagement.profile) {
            if (item.profile_pic) {
                value = {
                    ...value, id: item.id, name: item.name, last_name: item.last_name, date_of_birth: item.date_of_birth, gender: item.gender,
                    country_code: item.country_code, phone_number: item.phone_number, contact_number: item.contact_number, email_address: item.email_address, student_usi: item.student_usi,
                    zone: item.zone, profile_pic: item.profile_pic,
                    visa_number: item.visa_number, visa_doc: item.visa_doc,
                    passport_number: item.passport_number
                }

            } else {
                value = {
                    ...value, id: item.id, name: item.name, last_name: item.last_name, date_of_birth: item.date_of_birth, gender: item.gender,
                    country_code: item.country_code, phone_number: item.phone_number, contact_number: item.contact_number, email_address: item.email_address, student_usi: item.student_usi,
                    zone: item.zone, visa_number: item.visa_number, visa_doc: item.visa_doc, passport_number: item.passport_number
                }
            }
        }
    }
    return {
        formValues: state.form && state.form.PesonalDetailsForm &&
            state.form.PesonalDetailsForm.values ? state.form.PesonalDetailsForm.values : {},
        isDirty: isDirty('PesonalDetailsForm')(state),
        profileComplete: state.profileManagement && state.profileManagement.profileComplete,
        profile: state.profileManagement && state.profileManagement.profile,
        initialValues: value ? value : {},
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'PesonalDetailsForm', validate: personalDetailsForm, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(PesonalDetailsForm)