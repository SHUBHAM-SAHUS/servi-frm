import React from 'react';
import { Icon, Dropdown, Menu, Progress, Tabs, Upload, message, Button, Modal, notification } from 'antd';
import { reduxForm, Field, getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Link } from 'react-router-dom';
import { customInput } from '../../common/custom-input';
import { validate } from '../../../utils/Validations/subscriptionValidate';
import { CustomSelect } from '../../common/customSelect';
import { customTextarea } from '../../common/customTextarea';
import * as actions from '../../../actions/profileManagementActions';
import * as trainingAction from '../../../actions/inductionTrainingAction';
import { Strings } from '../../../dataProvider/localize';
import { CustomCheckbox } from '../../../components/common/customCheckbox';
import { CustomDatepicker } from '../../common/customDatepicker';
import { getStorage, handleFocus } from '../../../utils/common';

import PersonalDetails from './PersonalDetails';
import ViewPersonalDetails from './ViewPersonalDetails';
import PayrollDetails from './PayrollDetails';
import Licences from './Licences';
import MedicalDeclaration from './MedicalDeclaration';
import Rostering from './Rostering';
import { goBack } from '../../../utils/common'
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import AddNewLicences from './AddNewLicences';
import TimeOffRequest from './TimeOffRequest';
import moment from 'moment';
import DrawBox from './drawBox';
import * as faceapi from 'face-api.js';
import {
    loadModels,
    getFullFaceDescription,
    isFaceDetectionModelLoaded
} from '../../../dataProvider/face';
import ViewTrainingDetails from './ViewTrainingDetails';
import { createCanvas, loadImage } from 'canvas';
import EditLIcences from './EditLIcences';
import { add } from 'react-big-calendar/lib/utils/dates';
const { TabPane } = Tabs;

const MaxWidth = 600;
const boxColor = '#BE80B5';
//const testImg = require('../img/test.jpg');

const INIT_STATE = {
    url: null,
    imageURL: null,
    fullDesc: null,
    imageDimension: null,
    error: null,
    loading: false
};

// upload user profile pic
function getBase64(img, callback) {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
}

class Profile extends React.Component {
    userDetails = []
    org_user_id
    org_user_name
    profileComplete
    constructor(props) {
        super(props);
        this.state = {
            ...INIT_STATE,
            WIDTH: null,
            HEIGHT: 0,
            isModelLoaded: !!isFaceDetectionModelLoaded(),
            currentKey: '1',
            userLicencesSection: false,
            userDetailsSection: false,
            userPayrollSection: false,
            userMedicalSection: false,
            userRosteringSection: false,
            userInductionTrainingSection: false,
            formCompletion: 0,
            viewPersonalDetails: 'none',
            personalDetails: 'block',
            imageUrl: '',
            userDetails: '',
            addNewLicence: 'none',
            personalProfileDetails: 'block',
            certificatesLicences: 'none',
            addLeave: 'none',
            addNewLeaveForm: 'none',
            editLicence: 'none',
            file: '',
        }

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    componentWillMount() {
        this.resetState();
        let _W = document.documentElement.clientWidth;
        if (_W > MaxWidth) _W = MaxWidth;
        this.setState({ WIDTH: _W });
        this.mounting();
    }

    componentDidMount() {
        const page = 1
        this.props.trainingAction.getCourses(page);
        this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name);
        this.props.userActions.getLicencesType();
        this.setState({ currentKey: '6' }, () => {
            this.setState({ currentKey: '5' }, () => {
                this.setState({ currentKey: '4' }, () => {
                    this.setState({ currentKey: '3' }, () => {
                        this.setState({ currentKey: '2' }, () => {
                            this.setState({ currentKey: '1' }, () => {
                                if (this.props.location.state && this.props.location.state.key) {
                                    this.changeTabKey(this.props.location.state.key);
                                }
                            }
                            /* , () => this.setState({
                                viewPersonalDetails: 'none',
                                personalDetails: 'block',
                            }, () => this.setState({
                                viewPersonalDetails: 'block',
                                personalDetails: 'none'
                            })) */)
                        })
                    })
                })
            })
        })
    }

    //WARNING! To be deprecated in React v17. Use new lifecycle static getDerivedStateFromProps instead.
    componentWillReceiveProps(props) {
        var values = {}
        var valuesPayroll = {}
        var valuesMedical = {}
        var valuesRostering = {}
        var valRostering = false

        var formErrors = {}
        var formErrorsPayroll = {}

        this.state.userDetailsSection = this.state.userPayrollSection = this.state.userLicencesSection = this.state.userMedicalSection = this.state.userRosteringSection = false
        this.state.formCompletion = 0

        if (props.formValuesPesonalDetails && props.formValuesPesonalDetails.values) {
            values = props.formValuesPesonalDetails.values;
            formErrors = props.formSyncErrorsPesonalDetails;
        }

        let personalDetaisFormsValues = {}
        let personalDetailsFormErrors = {}
        if (props.formValuesPesonalDetailsForm && props.formValuesPesonalDetailsForm.values) {
            personalDetaisFormsValues = props.formValuesPesonalDetailsForm.values;
            personalDetailsFormErrors = props.formSyncErrorsPesonalDetailsForm
        }
        let residentialAddressFromsValues = {}
        let residentialAddressFromsErrors = {}
        if (props.formValuesExperienceForm && props.formValuesExperienceForm.values) {
            residentialAddressFromsValues = props.formValuesResidentialAddressForm.values;
            residentialAddressFromsErrors = props.formSyncErrorsResidentialAddress
        }
        let experienceFromsValues = {}
        let experienceFormsErrors = {}
        if (props.formValuesResidentialAddressForm && props.formValuesResidentialAddressForm.values) {
            experienceFromsValues = props.formValuesExperienceForm.values;
            experienceFormsErrors = props.formSyncErrorsExperienceForm
        }
        let emergencyContactFromsValues = {}
        let emergencyContactFormsErrors = {}
        if (props.formValuesEmergencyContactForm && props.formValuesEmergencyContactForm.values) {
            emergencyContactFromsValues = props.formValuesEmergencyContactForm.values;
            emergencyContactFormsErrors = props.formSyncErrorsEmergencyContactForm
        }

        if (props.formValuesPayroll && props.formValuesPayroll.values) {
            valuesPayroll = props.formValuesPayroll.values
            formErrorsPayroll = props.formSyncErrorsPayroll
        }
        let payrollDetailsFormsValues = {}
        let payrollDetailsFormsErrors = {}
        if (props.formValuesPayrollForm && props.formValuesPayrollForm.values) {
            payrollDetailsFormsValues = props.formValuesPayrollForm.values
            payrollDetailsFormsErrors = props.formSyncErrorsPayrollFrom
        }
        let superFundFormsValues = {}
        let superFundFormsErrors = {}
        if (props.formValuesSuperFundForm && props.formValuesSuperFundForm.values) {
            superFundFormsValues = props.formValuesSuperFundForm.values
            superFundFormsErrors = props.formSyncErrorsSuperFundForm
        }
        let bankAccountFormsValues = {}
        let bankAccountFormsErrors = {}
        if (props.formValuesBankAccountForm && props.formValuesBankAccountForm.values) {
            bankAccountFormsValues = props.formValuesBankAccountForm.values
            bankAccountFormsErrors = props.formSyncErrorsBankAccountForm
        }

        if (props.formValuesMedical && props.formValuesMedical.values) {
            valuesMedical = props.formValuesMedical.values
            // formErrorsMedical = props.formSyncErrorsMedical
        }

        if (props.formValuesRostering && props.formValuesRostering.values) {
            valuesRostering = props.formValuesRostering.values
            Object.keys(valuesRostering).forEach(key => {
                if (valuesRostering[key]) {
                    Object.keys(valuesRostering[key]).forEach(key2 => {
                        if (valuesRostering[key].full_time_availability) {
                            valRostering = true
                        } else {
                            Object.keys(valuesRostering[key][key2]).forEach(obj => {
                                if (valuesRostering[key][key2][obj].from_to) {
                                    valRostering = true
                                }
                            })
                        }
                    })
                }
            })
        }

        if (personalDetaisFormsValues.name && personalDetaisFormsValues.last_name && personalDetaisFormsValues.date_of_birth && personalDetaisFormsValues.gender && personalDetaisFormsValues.phone_number
            && personalDetaisFormsValues.email_address && (personalDetaisFormsValues.profile_pic || personalDetaisFormsValues.profile_pic) && residentialAddressFromsValues.street_address && residentialAddressFromsValues.city && residentialAddressFromsValues.state && residentialAddressFromsValues.zip_code
            && residentialAddressFromsValues.country && experienceFromsValues.user_experiences.length >= 1 && emergencyContactFromsValues.ec_full_name && emergencyContactFromsValues.relationship
            && (emergencyContactFromsValues.ec_mobile_number || emergencyContactFromsValues.ec_email) && emergencyContactFromsValues.ec_street_address && emergencyContactFromsValues.ec_city && emergencyContactFromsValues.ec_state && emergencyContactFromsValues.ec_zip_code && emergencyContactFromsValues.ec_country) {
            this.state.userDetailsSection = true
        }

        if (superFundFormsValues.is_super_ac) {
            if (payrollDetailsFormsValues.tfn && bankAccountFormsValues.bank_ac_name && bankAccountFormsValues.bank_name && bankAccountFormsValues.bank_bsb
                && bankAccountFormsValues.bank_ac_number) {
                this.state.userPayrollSection = true
            }
        } else {
            if (payrollDetailsFormsValues.tfn && superFundFormsValues.fund_name && superFundFormsValues.fund_abn && superFundFormsValues.phone_number
                && superFundFormsValues.bsb && superFundFormsValues.ac_no && superFundFormsValues.ac_name && bankAccountFormsValues.bank_ac_name && bankAccountFormsValues.bank_name && bankAccountFormsValues.bank_bsb
                && bankAccountFormsValues.bank_ac_number) {
                this.state.userPayrollSection = true
            }
        }
        var multi = 0;
        if (props.profile[0] && props.profile[0].licences && props.profile[0].licences.length && props.profile[0].licences.length > 0) {
            this.state.userLicencesSection = true
            multi++
        }

        if (props.profile[0] && props.profile[0].medical_declarations) {
            this.state.userMedicalSection = true
            multi++
        } else {
            if (valuesMedical.accept_job_requirement && valuesMedical.signature_file) {
                this.state.userMedicalSection = true
                multi++
            }
        }

        if (valRostering) {
            this.state.userRosteringSection = true
            multi++
        }

        let percentagePayroll
        if (this.props.one_course_completed) {
            this.state.userInductionTrainingSection = true
            multi++
        }

        let payrollDetailsForm = Object.keys(payrollDetailsFormsValues)
            .filter(key =>
                ((key === 'tfn' && !payrollDetailsFormsErrors.tfn))
            );
        let superFundForm
        if (!superFundFormsValues.is_super_ac) {
            superFundForm = Object.keys(superFundFormsValues)
                .filter(key =>
                    ((key === 'fund_name' && !superFundFormsErrors.fund_name) || (key === 'fund_abn' && !superFundFormsErrors.fund_abn)
                        || (key === 'phone_number' && !superFundFormsErrors.phone_number) || (key === 'bsb' && !superFundFormsErrors.bsb) ||
                        (key === 'ac_no' && !superFundFormsErrors.ac_no) || (key === 'ac_name' && !superFundFormsErrors.ac_name)
                    )
                );
        }
        let bankAccountForm = Object.keys(bankAccountFormsValues)
            .filter(key =>
                ((key === 'bank_ac_name' && !bankAccountFormsErrors.bank_ac_name) || (key === 'bank_name' && !bankAccountFormsErrors.bank_name)
                    || (key === 'bank_bsb' && !bankAccountFormsErrors.bank_bsb) || (key === 'bank_ac_number' && !bankAccountFormsErrors.bank_ac_number)
                )
            );

        let percentageDetailsFrom = Object.keys(personalDetaisFormsValues)
            .filter(key =>
                ((key === 'name' && !personalDetailsFormErrors.name) || (key === 'last_name' && !personalDetailsFormErrors.last_name) || (key === 'date_of_birth' && !personalDetailsFormErrors.date_of_birth) || (key === 'gender' && !personalDetailsFormErrors.gender) ||
                    (key === 'phone_number' && !personalDetailsFormErrors.phone_number) || (key === 'email_address' && !personalDetailsFormErrors.email_address) || (key === 'profile_pic')
                )
            );
        let percentageResidentailAddressFrom = Object.keys(residentialAddressFromsValues)
            .filter(key =>
                ((key === 'street_address' && !residentialAddressFromsErrors.street_address) || (key === 'city' && !residentialAddressFromsErrors.city) ||
                    (key === 'state' && !residentialAddressFromsErrors.state) || (key === 'zip_code' && !residentialAddressFromsErrors.zip_code) || (key === 'country' && !residentialAddressFromsErrors.country)
                )
            );
        let percentageEmergencyContactFromsValues = Object.keys(emergencyContactFromsValues)
            .filter(key =>
                ((key === 'ec_full_name' && !emergencyContactFormsErrors.ec_full_name) || (key === 'relationship' && !emergencyContactFormsErrors.relationship) ||
                    (key === 'ec_mobile_number' && !emergencyContactFormsErrors.ec_mobile_number) || (key === 'ec_email' && !emergencyContactFormsErrors.ec_email) || (key === 'ec_street_address' && !emergencyContactFormsErrors.ec_street_address) ||
                    (key === 'ec_city' && !emergencyContactFormsErrors.ec_city) || (key === 'ec_state' && !emergencyContactFormsErrors.ec_state) || (key === 'ec_zip_code' && !emergencyContactFormsErrors.ec_zip_code) || (key === 'ec_country' && !emergencyContactFormsErrors.ec_country)
                )
            );

        var percentageValues
        if (superFundForm) {
            percentageValues = percentageDetailsFrom.length + percentageResidentailAddressFrom.length + percentageEmergencyContactFromsValues.length + payrollDetailsForm.length + superFundForm.length + bankAccountForm.length
        } else {
            percentageValues = percentageDetailsFrom.length + percentageResidentailAddressFrom.length + percentageEmergencyContactFromsValues.length + payrollDetailsForm.length + bankAccountForm.length
        }
        // console.log('percentageValues', percentageValues)
        if (superFundFormsValues.is_super_ac) {
            this.state.formCompletion = Math.round((percentageValues / 26) * 60) + (multi * 10);
        } else {
            this.state.formCompletion = Math.round((percentageValues / 32) * 60) + (multi * 10);
        }
        this.profileComplete = Math.round(this.state.formCompletion)
        this.profileComplete && this.props.dispatch({ type: 'PROFILE_COMPLETE', payload: this.profileComplete });
    }

    changeTabKey = (key) => {
        this.key = key
        this.setState({
            currentKey: key,
            personalDetails: 'block',
            personalProfileDetails: 'block',
            addNewLicence: 'none',
            editLicence: 'none',
            certificatesLicences: 'none',
            addLeave: 'none',
            addNewLeaveForm: 'none',
            viewPersonalDetails: 'none',
            uploadLoader: false
        })
        if (key === '4') {
            this.setState({
                certificatesLicences: 'block'
            })
        }

        if (key === '5') {
            this.setState({
                certificatesLicences: 'block',
                addLeave: 'block'
            })
        }
    }


    dynamicTabContent = () => {
        if (this.state.currentKey === '1') {
            return null
        }
        else
            return null;
    }

    onSubmit = (formData) => {

    }

    // more info
    editMenu = (
        <Menu>
            <Menu.Item onClick={this.handleEditClick}>{Strings.menu_edit_org}</Menu.Item>
        </Menu>
    )

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

    viewDetails = () => {
        this.setState({
            viewPersonalDetails: 'block',
            personalDetails: 'none',
            // personDetails: data
        })
    }

    editPerson = () => {
        this.setState({
            viewPersonalDetails: 'none',
            personalDetails: 'block',
            // personDetails: data
        })
    }

    addNewLicence = () => {
        this.setState({
            addNewLicence: 'block',
            // personalDetails: 'none',
            personalProfileDetails: 'none',
            viewPersonalDetails: 'none',
            editLicence: 'none'

        })
    }

    editLicence = (show, data) => {
        this.setState({
            editLicence: show,
            addNewLicence: 'none',
            // personalDetails: 'none',
            personalProfileDetails: 'none',
            viewPersonalDetails: 'none',
            licencesDetails: data
        })
    }

    addLeave = (show) => {
        this.setState({
            addLeave: show,
            // personalDetails: 'none',
            personalProfileDetails: 'none',
            viewPersonalDetails: 'none'
        })
    }

    addNewLeave = () => {
        this.setState({
            addNewLeaveForm: 'block',
            addNewLicence: 'none',
            personalProfileDetails: 'none',
            certificatesLicences: 'none',
            addLeave: 'none',
            leaveDeatails: {},
            editLicence: 'none'
        })
    }

    editLeave = (leaves) => {
        this.setState({
            addNewLeaveForm: 'block',
            addNewLicence: 'none',
            personalProfileDetails: 'none',
            certificatesLicences: 'none',
            addLeave: 'none',
            leaveDeatails: leaves
        })
    }

    handleCancel = (key) => {
        if (this.key === '3') {
            this.setState({
                addNewLicence: 'none',
                personalProfileDetails: 'block',
                // personalDetails: 'none',
                viewPersonalDetails: 'none',
                addNewLeaveForm: 'none',
                certificatesLicences: 'none',
                addLeave: 'none',
                editLicence: 'none'
            })
        }
        if (this.key === '5') {
            this.setState({
                addNewLicence: 'none',
                personalProfileDetails: 'block',
                // personalDetails: 'none',
                viewPersonalDetails: 'none',
                addNewLeaveForm: 'none',
                certificatesLicences: 'block',
                addLeave: 'block',
                editLicence: 'none',

            })
        }
        this.props.reset();
    }

    removeFile = () => this.setState({ file: '' });

    resetState = () => {
        this.setState({ ...INIT_STATE });
    };

    mounting = async () => {
        await loadModels();
    };

    handleFileChange = async file => {
        this.resetState();
        // console.log(file)
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
            // console.log(fullDesc)
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
                        this.uploadProfImage()
                    });


                }).catch((error) => {
                    // console.log(error);
                });
                this.setState({ fullDesc, uploadLoader: false });
            }
        });
    };

    cropBoxDimention = (detection, imageWidth, imageHeight) => {
        const relativeBox = detection.relativeBox;
        const dimension = detection._imageDims;
        let referSize = dimension._width > dimension._height ? dimension._height : dimension._width
        // console.log(referSize)

        let _X = imageWidth * relativeBox._x;
        let _Y =
            (relativeBox._y * imageWidth * dimension._height) / dimension._width;
        let _W = imageWidth * relativeBox.width;
        let _H =
            (relativeBox.height * imageHeight * dimension._height) /
            dimension._width;
        //return { cropX: _X, cropY: _Y, cropWidth: _W, cropHeight: _H }

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

    render() {
        const { handleSubmit, profile, licenceType, formValuesPesonalDetailsForm } = this.props;
        this.userDetails = profile[0]

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
                // if (info.file.status === 'done') {
                //     message.success(`${info.file.name} file uploaded successfully`);
                //     getBase64(info.file.originFileObj, imageUrl =>
                //         this.setState({
                //             file: imageUrl,
                //         }),
                //     );
                // } else if (info.file.status === 'error') {
                //     message.error(`${info.file.name} file upload failed.`);
                // }
            },
            onRemove: this.removeFile
        };
        return (
            <div>
                {/* inner header  */}
                < div className="dash-header" >
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() => goBack(this.props)} />
                        {Strings.profile_title}
                    </h2>
                    <div className="sf-steps-status">
                        <div className="sf-steps-row">
                            <div className={this.state.userDetailsSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i className="material-icons">description</i></div>
                                <span>Personal Details</span>
                            </div>
                            <div className={this.state.userPayrollSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i className="material-icons">attach_money</i>
                                </div>
                                <span>Payroll</span>
                            </div>
                            <div className={this.state.userLicencesSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i className="material-icons">assignment_ind</i></div>
                                <span>Licences</span>
                            </div>
                            <div className={this.state.userMedicalSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i className="material-icons">healing</i></div>
                                <span>Medical</span>
                            </div>
                            <div className={this.state.userRosteringSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i className="material-icons">event_note</i></div>
                                <span>Rostering</span>
                            </div>
                            <div className={this.state.userInductionTrainingSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i className="material-icons">school</i></div>
                                <span>Induction & Training</span>
                            </div>
                        </div>
                        <div className="sf-st-item sf-prog">
                            <Progress type="circle" strokeColor={'#03a791'} width={40} strokeWidth={12} percent={Math.round(this.state.formCompletion)} format={
                                (percent) => percent + '%'} />
                            <span>Progress</span>
                        </div>
                    </div>
                    <div class="oh-cont"></div>
                </div>
                {/* inner header  */}
                < div className="main-container" >
                    <div className="row">
                        <div className="col-lg-9 col-md-9 col-sm-12">
                            <div className="sf-card has-shadow p-tab-shadow">
                                <Tabs className="profile-tabs" onChange={(key) => this.changeTabKey(key)} activeKey={this.state.currentKey} type="card">
                                    <TabPane tab={<div className="tab-item"><i className="material-icons">description</i> {Strings.tab_personal_dtl}</div>} key="1">
                                        {this.state.personalDetails === 'block' ?
                                            <div className="tab-wraper">
                                                <PersonalDetails
                                                    initialValues={this.userDetails}
                                                    onPersonDetails={(data) => this.viewDetails()}
                                                />
                                            </div>
                                            :
                                            ''
                                        }
                                        {this.state.viewPersonalDetails === 'block' ?
                                            <div className="tab-wraper">
                                                <ViewPersonalDetails
                                                    // initialValues={this.state.personDetails}
                                                    onPersonEdit={this.editPerson}
                                                />
                                            </div>
                                            :
                                            ''
                                        }
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item"><i className="material-icons">attach_money</i> {Strings.tab_payroll_dtl}</div>} key="2">
                                        <div className="tab-wraper"><PayrollDetails /></div>
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item"><i className="material-icons">assignment_ind</i> {Strings.tab_licences}</div>} key="3">
                                        <div className="tab-wraper"><Licences initialValues={this.userDetails && this.userDetails.licences} reset={this.props.reset}
                                            onPropsSet={(show, data) => data ? this.editLicence(show, data) : this.addNewLicence(show)} /></div>
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item"><i className="material-icons">healing</i> {Strings.tab_medical_dclr}</div>} key="4">
                                        <div className="tab-wraper"><MedicalDeclaration initialValues={this.userDetails && this.userDetails.medical_declarations} /></div>
                                    </TabPane>

                                    <TabPane tab={<div className="tab-item"><i className="material-icons">event_note</i> {Strings.tab_rostering}</div>} key="5">
                                        <div className="tab-wraper"><Rostering onPropsSet={(show) => this.addLeave(show)} /></div>
                                    </TabPane>
                                    <TabPane tab={<div className="tab-item"><i className="material-icons">school</i> {Strings.tab_induction_training}</div>} key="6">
                                        <div className="tab-wraper"><ViewTrainingDetails /></div>
                                    </TabPane>
                                </Tabs>
                            </div>
                        </div>


                        {/* ---------------------------- 
                                Right section
                        ---------------------------- */}

                        {/* user prifile pic and status */}

                        <div className="col-lg-3 col-md-3 col-sm-12">
                            {this.state.personalProfileDetails ?
                                <div className="sf-card mb-4" style={{ display: this.state.personalProfileDetails }}>
                                    {/* style={{ display: this.state.personalDetails }} */}
                                    <div className="user-profile-card">
                                        <div className="profile-pic">

                                            {this.state.uploadLoader ?
                                                this.profileLoaderView
                                                : ''
                                            }
                                            {formValuesPesonalDetailsForm && formValuesPesonalDetailsForm.values && formValuesPesonalDetailsForm.values.profile_pic
                                                ?
                                                <img src={formValuesPesonalDetailsForm.values.profile_pic} />
                                                :
                                                this.userDetails && this.userDetails.profile_pic
                                                    ?
                                                    <img src={this.userDetails.profile_pic} />
                                                    :
                                                    <Icon type="camera" theme="filled" />
                                            }

                                            {/* {this.userDetails ?
                                                <img src={this.userDetails && this.userDetails.profile_pic} />
                                                :
                                                <Icon type="camera" theme="filled" />
                                            } */}
                                            {/* <Icon type="camera" theme="filled" /> */}
                                            {/* <Upload className="upload-pic" id="profile_img" {...props}>
                                                <img src={this.props.formValuesPesonalDetailsForm && this.props.formValuesPesonalDetailsForm.profile_img} /> 
                                                <Button><i class="fa fa-pencil"></i></Button>
                                            </Upload> */}
                                        </div>
                                        <h5 className="user-title">{this.userDetails && this.userDetails.name + " " +
                                            (this.userDetails.last_name ? this.userDetails.last_name : "")}<span>{this.userDetails && this.userDetails.email_address}</span></h5>
                                    </div>
                                    <div className="usr-pro-body">
                                        <h3>Areas of Expertise</h3>

                                        {/* <p>Training completed for pressure washing and window washing.</p> */}

                                        <ul className="exp-details">
                                            {this.userDetails && this.userDetails.user_experiences &&
                                                this.userDetails.user_experiences.map(exp => {
                                                    return (

                                                        <li>
                                                            <span>{exp && exp.sub_category && exp.sub_category.sub_category_name}</span>
                                                            <span>{exp && exp.hours_of_experience}</span>
                                                        </li>

                                                    )
                                                })
                                            }
                                        </ul>
                                        {/* <li>
                                            <span>Window Cleaning</span>
                                            <span>230 Hours</span>
                                        </li> */}


                                    </div>
                                    <div className="usr-pro-footer">
                                        <div className="pro-status">
                                            <strong>Jobs Completed</strong>
                                            <span>- 0</span>
                                        </div>
                                        <div className="pro-status">
                                            <strong>Last Online</strong>
                                            <span>- 03/10/2019</span>
                                        </div>
                                    </div>
                                </div>
                                :
                                ''

                            }


                            {/* view user profile pic and content */}
                            <div className="sf-card mb-4" style={{ display: 'none' }}>
                                <div className="user-profile-card">
                                    <div className="profile-pic ovhdn"><img src={this.state.imageUrl} /></div>
                                    <h5 className="user-title">Brett Sue <span>brett.sue@contraxct.com</span></h5>
                                </div>
                                <div className="usr-pro-body">
                                    <h3>Areas of Expertise</h3>
                                    <ul className="exp-details">
                                        <li>
                                            <span>Carpet Cleaning</span>
                                            <span>100 Hours</span>
                                        </li>
                                        <li>
                                            <span>Window Cleaning</span>
                                            <span>230 Hours</span>
                                        </li>
                                    </ul>
                                </div>
                                <div className="usr-pro-footer">
                                    <div className="pro-status">
                                        <strong>Jobs Completed</strong>
                                        <span>100</span>
                                    </div>
                                    <div className="pro-status">
                                        <strong>Last Online</strong>
                                        <span>2 days ago</span>
                                    </div>
                                </div>

                            </div>



                            {/* Add licences form start from here */}
                            {this.state.addNewLicence === 'block' ?
                                <div className="sf-card mb-4" >
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h4 className="sf-sm-hd sf-pg-heading">{Strings.add_new_licence}</h4>
                                        <button type="button" class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                                    </div>
                                    <div className="sf-card-body mt-2">
                                        <AddNewLicences onCancel={this.handleCancel} />
                                    </div>
                                </div> :
                                ''
                            }

                            {/* Edit licences form start from here */}
                            {this.state.editLicence === 'block' ?
                                <div className="sf-card mb-4" >
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h4 className="sf-sm-hd sf-pg-heading">{Strings.edit_licence}</h4>
                                        <button type="button" class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                                    </div>
                                    <div className="sf-card-body mt-2">
                                        <EditLIcences initialValues={this.state.licencesDetails} onCancel={this.handleCancel} />
                                    </div>
                                </div> :
                                ''
                            }

                            {/* Medical Declaration Certificates/Licences */}
                            {this.state.certificatesLicences === 'block' ?
                                <div className="sf-card mb-4">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h4 className="sf-sm-hd sf-pg-heading">{Strings.certificates_licences}</h4>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="sf-card-body">
                                        {this.userDetails && this.userDetails.licences
                                            && this.userDetails.licences.map(licence => {
                                                return (
                                                    <ul className="crt-licence-lists">
                                                        <li><Link onClick={() => this.changeTabKey("3")}>- {licenceType.find(type => type.id === licence.type) ? licenceType.find(type => type.id === licence.type).name : ''}</Link></li>
                                                        {/* <li><Link>- ASIC Certificate</Link></li>
                                                        <li><Link>- Drivers Licence</Link></li> */}
                                                    </ul>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                :
                                ''
                            }



                            {/* Rostering Leave add new */}
                            {this.state.addLeave === 'block' ?
                                <div className="sf-card mb-4 pro-leave">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h4 className="sf-sm-hd sf-pg-heading">Leave</h4>
                                        <div class="oh-cont">
                                            <button type="button" className="bnt bnt-sm bnt-active" onClick={this.addNewLeave}>Add New</button>
                                        </div>
                                    </div>
                                    <div className="sf-card-body add-leave-bx">
                                        <ul className="leave-lists">
                                            {this.userDetails && this.userDetails.leaves
                                                && this.userDetails.leaves.map(leaves => {
                                                    return (
                                                        <li className="leave-items" onClick={() => this.editLeave(leaves)}>
                                                            <strong>
                                                                {leaves && leaves.start_date && moment(leaves.start_date).format("ddd, DD MMM YYYY")}
                                                                {leaves.leave_type === 1 ? <span>Sick Leave</span> : ''}
                                                                {leaves.leave_type === 2 ? <span>Annual Leave</span> : ''}
                                                                {leaves.leave_type === 3 ? <span>Personal leave</span> : ''}
                                                                {leaves.leave_type === 4 ? <span>Functional Leave</span> : ''}
                                                                {/* <span>Annual Leave</span> */}
                                                            </strong>
                                                            <i class="fa fa-long-arrow-right"></i>
                                                            <strong className="l-apprvd">
                                                                {leaves && leaves.end_date && moment(leaves.end_date).format("ddd, DD MMM YYYY")}
                                                                {leaves.leave_status === 0 ? <span>Pending</span> : ''}
                                                                {leaves.leave_status === 1 ? <span>Approved</span> : ''}
                                                                {leaves.leave_status === 2 ? <span>Unapproved</span> : ''}
                                                            </strong>
                                                        </li>
                                                    )
                                                })
                                            }
                                        </ul>
                                    </div>
                                </div>
                                :
                                ''
                            }

                            {/* Rostering Time off Request */}
                            {this.state.addNewLeaveForm === 'block' ?
                                <div className="sf-card mb-4">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h4 className="sf-sm-hd sf-pg-heading">{Strings.time_of_request}</h4>
                                        <button type="button" class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                                    </div>
                                    <div className="sf-card-body mt-2">
                                        <TimeOffRequest initialValues={this.state.leaveDeatails} onCancel={this.handleCancel} />
                                    </div>
                                </div>
                                :
                                ''
                            }
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profileManagement && state.profileManagement.profile,
        licenceType: state.profileManagement && state.profileManagement.licenceType,
        courses: state.inductionTraining.courses,
        one_course_completed: state.inductionTraining.one_course_completed,

        formValuesPesonalDetails: state.form && state.form.PesonalDetails,
        formValuesPesonalDetailsForm: state.form && state.form.PesonalDetailsForm,
        formValuesResidentialAddressForm: state.form && state.form.ResidentialAddressForm,
        formValuesExperienceForm: state.form && state.form.ExperienceForm,
        formValuesEmergencyContactForm: state.form && state.form.EmergencyContactForm,

        formValuesViewPesonalDetails: state.form && state.form.ViewPesonalDetails,
        formValuesPayroll: state.form && state.form.PayrollDetails,
        formValuesPayrollForm: state.form && state.form.PayrollDetailsForm,
        formValuesSuperFundForm: state.form && state.form.SuperFundForm,
        formValuesBankAccountForm: state.form && state.form.BankAccountForm,

        formValuesMedical: state.form && state.form.MedicalDeclaration,
        formValuesRostering: state.form && state.form.Rostering ? state.form.Rostering : {},

        formSyncErrorsPesonalDetails: getFormSyncErrors('PesonalDetails')(state),
        formSyncErrorsPesonalDetailsForm: getFormSyncErrors('PesonalDetailsForm')(state),
        formSyncErrorsResidentialAddress: getFormSyncErrors('ResidentialAddressForm')(state),
        formSyncErrorsExperienceForm: getFormSyncErrors('ExperienceForm')(state),
        formSyncErrorsEmergencyContactForm: getFormSyncErrors('EmergencyContactForm')(state),

        formSyncErrorsPayroll: getFormSyncErrors('PayrollDetails')(state),
        formSyncErrorsPayrollFrom: getFormSyncErrors('PayrollDetailsForm')(state),
        formSyncErrorsSuperFundForm: getFormSyncErrors('SuperFundForm')(state),
        formSyncErrorsBankAccountForm: getFormSyncErrors('BankAccountForm')(state),

        formSyncErrorsMedical: getFormSyncErrors('MedicalDeclaration')(state),
    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(actions, dispatch),
        trainingAction: bindActionCreators(trainingAction, dispatch),
    }
}


export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'Profile', validate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(Profile)