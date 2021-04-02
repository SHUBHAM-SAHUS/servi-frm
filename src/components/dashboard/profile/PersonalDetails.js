import React from 'react';
import { Icon, Dropdown, Menu, Modal, message, notification } from 'antd';
import { reduxForm, Field, FieldArray, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../actions/profileManagementActions';
import * as industryActions from '../../../actions/industryManagementAction';
import { ADMIN_DETAILS, VALIDATE_STATUS } from '../../../dataProvider/constant';
import { getStorage } from '../../../utils/common';
import PesonalDetailsForm from './PersonalDetailsForms/PersonalDetailsForm';
import ResidentailAddressForm from './PersonalDetailsForms/ResidentialAddressForm';
import ExperienceForm from './PersonalDetailsForms/ExperienceForm';
import EmergencyContactForm from './PersonalDetailsForms/EmergencyContactForm';

class PesonalDetails extends React.Component {
    gender = ['Male', 'Female', 'Other']

    selectedSubCategory = false
    constructor(props) {
        super(props);
        this.state = {
            date: '',
            phnOtpErr: false,
            emailOtpErr: false
        }

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    componentDidMount() {
        this.props.industryActions.getSubCategories();
    }

    render() {
        const { handleSubmit, initialValues, formValues } = this.props;

        // console.log(formValues)

        const editMenu = (
            <Menu>
                <Menu.Item></Menu.Item>
            </Menu>
        )

        return (
            <form>
                {/* Personal Details */}
                <div>
                    <PesonalDetailsForm />
                </div>

                {/* Residential Address */}
                <div>
                    <ResidentailAddressForm />
                </div>

                {/* Experience */}
                <div>
                    <ExperienceForm />
                </div>

                {/* Emergency Contact Details */}
                <div>
                    <EmergencyContactForm />
                </div>
            </form>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        subCategories: state.industryManagement.subCategories,
        formValues: state.form && state.form.PesonalDetails &&
            state.form.PesonalDetails.values ? state.form.PesonalDetails.values : {},
        isDirty: isDirty('PesonalDetails')(state),
        profileComplete: state.profileManagement && state.profileManagement.profileComplete,
        profile: state.profileManagement && state.profileManagement.profile,

    }
}

const mapDispatchToprops = dispatch => {
    return {
        industryActions: bindActionCreators(industryActions, dispatch),
        action: bindActionCreators(actions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'PesonalDetails', enableReinitialize: true, keepDirtyOnReinitialize: false,
        onSubmitFail: (errors, dispatch, sub, props) => {

        }
    })
)(PesonalDetails)