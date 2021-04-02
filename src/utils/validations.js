import { validationString } from '../dataProvider/localize'
export const validate = values => {
	const errors = {}
	if (!values.user_name) {
		errors.user_name = validationString.user_name_empty;
	}
	// else if (values.user_name.length < 8) {
	// 	errors.user_name = validationString.user_name_len;
	// }

	if (!values.password) {
		errors.password = validationString.pass_empty;
	}/*  else if (values.password.length < 8) {
		errors.password = validationString.pass_len;
	} */

	if (!values.confirmPassword) {
		errors.confirmPassword = validationString.con_pass_empty;
	} else if (values.confirmPassword !== values.password) {
		errors.confirmPassword = validationString.con_pass_match;
	}

	if (!values.login_code) {
		errors.login_code = validationString.valid_code_empty;
	} else if (isNaN(Number(values.login_code))) {
		errors.login_code = validationString.valid_code_number;
	}

	if (!values.user_full_name) {
		errors.user_full_name = validationString.full_name_empty;
	}

	if (!values.email_address) {
		errors.email_address = validationString.email_empty;
	} else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.email_address)) {
		errors.email_address = validationString.email_invalid;
	}
	if (!values.old_password) {
		errors.old_password = validationString.old_pass_empty;
	} /* else if (values.old_password.length < 8) {
		errors.old_password = validationString.pass_len;
	} */
	if (!values.new_password) {
		errors.new_password = validationString.new_pass_empty;
	} else if (values.new_password.length < 8) {
		errors.new_password = validationString.pass_len;
	}
	if (!values.confirm_password) {
		errors.confirm_password = validationString.con_pass_empty;
	} else if (values.confirm_password !== values.new_password) {
		errors.confirm_password = validationString.con_pass_match;
	}
	return errors
}
