import React from 'react';
import { Icon, Dropdown, Menu, Modal, message, notification } from 'antd';
import { reduxForm, Field, FieldArray, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { customInput } from '../../../common/custom-input';
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
import { getStorage, setStorage, countries } from '../../../../utils/common';
import { experienceValidation } from '../../../../utils/Validations/profileValidation';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';
import AddExperience from '../AddExperience';

class ExperienceForm extends React.Component {

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

	static getDerivedStateFromProps(props, state) {
		var OrgSACountry = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).country : null;
		if (!props.formValues && props.formValues.ec_country || props.formValues && props.formValues.ec_country === '') {
			props.change(`ec_country`, OrgSACountry);
		}
	}

	onSubmit = async (formData) => {
		formData = await DeepTrim(formData);
		formData = { ...formData, 'profile_progress': this.props.profileComplete }
		formData.user_experiences.forEach((exp) => {
			// formData.user_experiences[index] = { ...formData.user_experiences[index], 'sub_category_id': exp.sub_category_name }
			delete exp.sub_category
		})

		this.selectedSubCategory = this.props.formValues && this.props.formValues.user_experiences && this.props.formValues.user_experiences.map(exp =>
			this.props.subCategories.find(category =>
				exp.sub_category_name ? category.id === exp.sub_category_name : false
			),
		)

		this.selectedSubCategory = this.props.formValues && this.props.formValues.user_experiences && this.props.formValues.user_experiences.map(exp =>
			this.props.subCategories.find(category =>
				exp.sub_category_name ? category.id === exp.sub_category_name : false
			),
		)

		const processedFormData = { ...formData };

		processedFormData.user_experiences = [];
		processedFormData.new_user_experiences = [];

		formData.user_experiences.forEach((exp, index) => {
			exp.hours_of_experience = parseInt(exp.hours_of_experience);
			if (/^\d+$/.test(exp.sub_category_id)) {
				processedFormData.user_experiences.push({ ...exp, sub_category_id: parseInt(exp.sub_category_id) });
			} else {
				processedFormData.new_user_experiences.push({ sub_category_name: exp.sub_category_id, hours_of_experience: exp.hours_of_experience });
			}
		})

		//return console.log(processedFormData);

		this.props.action.updateOrgUserExperience(processedFormData)
			.then((flag) => {
				notification.success({
					message: Strings.success_title,
					description: flag,
					onClick: () => { },
					className: 'ant-success'
				});
				this.props.action.getOrgUserDetails(this.org_user_id, this.org_user_name)
					.then(() => {
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

	}

	render() {
		const { handleSubmit, initialValues } = this.props;
		const editMenu = (
			<Menu>
				<Menu.Item></Menu.Item>
			</Menu>
		)

		return (
			<form onSubmit={handleSubmit(this.onSubmit)
			} >
				<div className="sf-card mt-3">
					<div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
						<h2 className="sf-pg-heading">{Strings.experience_txt}</h2>
						<div className="info-btn disable-dot-menu">
							<Dropdown className="more-info" disabled overlay={editMenu}>
								<i className="material-icons">more_vert</i>
							</Dropdown>
						</div>
					</div>
					<div className="sf-card-body">
						<table className="sf-table psnl-pro-table">
							<tr>
								<th>{Strings.area_of_expertise}</th>
								<th className="w-30">{Strings.hours_of_experinace}</th>
								<th className="w-5px"></th>
							</tr>

							<FieldArray
								name="user_experiences"
								subCategories={this.props.subCategories}
								isDisable={initialValues && initialValues.user_experiences}
								component={AddExperience} />
						</table>
						<div className="all-btn d-flex justify-content-end mt-4">
							<div className="btn-hs-icon">
								<button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
									<Icon type="save" theme="filled" /> Save</button>
							</div>
						</div>
					</div>

				</div>

			</form>
		);
	}
}

const mapStateToProps = (state) => {
	let value = {}
	if (state.profileManagement && state.profileManagement.profile) {
		for (let item of state.profileManagement.profile) {
			value = {
				...value, id: item.id, user_experiences: item.user_experiences
			}
		}
	}
	return {
		subCategories: state.industryManagement.subCategories,
		formValues: state.form && state.form.ExperienceForm &&
			state.form.ExperienceForm.values ? state.form.ExperienceForm.values : {},
		isDirty: isDirty('ExperienceForm')(state),
		profileComplete: state.profileManagement && state.profileManagement.profileComplete,
		profile: state.profileManagement && state.profileManagement.profile,
		initialValues: value ? value : {}
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
		form: 'ExperienceForm', validate: experienceValidation, enableReinitialize: true,
		onSubmitFail: (errors, dispatch, sub, props) => {
			handleFocus(errors, "#");
		}
	})
)(ExperienceForm)