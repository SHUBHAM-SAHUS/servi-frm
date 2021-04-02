import validator from 'validator';
import { validationString } from '../../dataProvider/localize';
import { customPhonoeNoValidate } from '../common';

/** User Personal Details Validations */
export const personalDetailsValidator = (values) => {
    const errors = {}

    /** Personal Details Validation*/
    /* if (!values.name) {
        errors.name = validationString.profile_first_name_empty
    } */

    /* if (!values.middle_name) {
        errors.middle_name = validationString.profile_middle_name_empty
    }
 */
    if (!values.last_name) {
        errors.last_name = validationString.profile_last_name_empty
    }

    if (!values.date_of_birth) {
        errors.date_of_birth = validationString.profile_date_of_birth_empty
    }

    /* if (!values.month) {
        errors.month = 'This is a required field'
    }

    if (!values.year) {
        errors.year = 'This is a required field'
    } */

    if (!values.gender) {
        errors.gender = validationString.profile_gender_empty
    }

    if (!values.user_name) {
        errors.user_name = 'This is a required field'
    }

    if (!values.country_code) {
        errors.country_code = validationString.profile_country_code_empty
    }

    if (!values.phone_number) {
        errors.phone_number = validationString.profile_phone_number_empty
    } else if (!validator.isMobilePhone(values.country_code + values.phone_number, 'any')) {
        errors.phone_number = validationString.profile_phone_number_invalid
    }

    if (values.contact_number) {
        if (!validator.isMobilePhone(values.contact_number, 'any')) {
            if (customPhonoeNoValidate(values.contact_number) == true) {
            } else {
                errors.contact_number = validationString.org_phone_number_invalid
            }
        }
    }

    if (!values.email_address) {
        errors.email_address = validationString.profile_email_address_empty
    } else if (!validator.isEmail(values.email_address)) {
        errors.email_address = validationString.profile_email_address_invalid
    }

    if (!values.role) {
        errors.role = 'This is a required field'
    }

    if (!values.street_address) {
        errors.street_address = validationString.profile_street_address_empty
    }

    if (!values.city) {
        errors.city = validationString.profile_city_empty
    }

    if (!values.state) {
        errors.state = validationString.profile_state_empty
    }

    if (!values.zip_code) {
        errors.zip_code = validationString.profile_zip_code_empty
    }

    if (!values.country) {
        errors.country = validationString.profile_country_empty
    }

    /* Experience */
    if (!values.user_experiences || !values.user_experiences.length > 0 || !Array.isArray(values.user_experiences)) {
        errors.user_experiences = { _error: validationString.job_report_empty };
    } else {
        const user_experiences_errors = [];
        values.user_experiences.forEach((exp, index) => {
            const userErrors = {}
            if (!exp.sub_category_id || (Array.isArray(exp.sub_category_id) && (exp.sub_category_id.length === 0))) {
                userErrors.sub_category_id = validationString.profile_sub_category_empty;
            }
            if (!exp.hours_of_experience) {
                userErrors.hours_of_experience = validationString.profile_hours_of_experience_empty;
            }

            user_experiences_errors[index] = userErrors;
        })
        errors.user_experiences = user_experiences_errors;
    }

    /** Emergency Contact Validation */
    if (!values.ec_full_name) {
        errors.ec_full_name = validationString.profile_ec_full_name_empty
    }

    if (!values.relationship) {
        errors.relationship = validationString.profile_relationship_empty
    }

    //required fields in Profile - Emergency Contact Details: Mobile Number OR Email 
    if (!values.ec_email) {
        if (!values.ec_mobile_number) {
            errors.ec_mobile_number = validationString.profile_ec_mobile_number_empty
        } else if (!validator.isMobilePhone(values.ec_mobile_number, 'any')) {
            if (customPhonoeNoValidate(values.ec_mobile_number) == true) {
                console.log('allow ph no')
            } else {
                errors.ec_mobile_number = validationString.profile_ec_mobile_number_invalid
            }
        }
    } else if (values.ec_mobile_number) {
        if (!validator.isMobilePhone(values.ec_mobile_number, 'any')) {
            if (customPhonoeNoValidate(values.ec_mobile_number) == true) {
                console.log('allow ph no')
            } else {
                console.log('allow ph no')
                errors.ec_mobile_number = validationString.profile_ec_mobile_number_invalid
            }
        }
    }

    if (!values.ec_mobile_number) {
        if (!values.ec_email) {
            errors.ec_email = validationString.profile_ec_email_empty
        } else if (!validator.isEmail(values.ec_email)) {
            errors.ec_email = validationString.profile_ec_email_invalid
        }
    } else if (values.ec_email) {
        if (!validator.isEmail(values.ec_email)) {
            errors.ec_email = validationString.profile_ec_email_invalid
        }
    }

    if (!values.ec_street_address) {
        errors.ec_street_address = validationString.profile_ec_street_address_empty
    }

    if (!values.ec_city) {
        errors.ec_city = validationString.profile_ec_city_empty
    }

    if (!values.ec_state) {
        errors.ec_state = validationString.profile_ec_state_empty
    }

    if (!values.ec_zip_code) {
        errors.ec_zip_code = validationString.profile_ec_zip_code_empty
    }

    if (!values.ec_country) {
        errors.ec_country = validationString.profile_ec_country_empty
    }

    return errors
}

export const personalDetailsForm = (values) => {
    const errors = {}

    if (!values.name) {
        errors.name = validationString.profile_first_name_empty
    }

    if (!values.last_name) {
        errors.last_name = validationString.profile_last_name_empty
    }

    if (!values.date_of_birth) {
        errors.date_of_birth = validationString.profile_date_of_birth_empty
    }

    if (!values.gender) {
        errors.gender = validationString.profile_gender_empty
    }

    if (!values.country_code) {
        errors.country_code = validationString.profile_country_code_empty
    }

    if (!values.phone_number) {
        errors.phone_number = validationString.profile_phone_number_empty
    } else if (!validator.isMobilePhone(values.country_code + values.phone_number, 'any')) {
        errors.phone_number = validationString.profile_phone_number_invalid
    }

    if (values.contact_number) {
        if (!validator.isMobilePhone(values.contact_number, 'any')) {
            if (customPhonoeNoValidate(values.contact_number) == true) {
                console.log('allow ph no')
            } else {
                errors.contact_number = validationString.org_phone_number_invalid
            }
        }
    }

    if (!values.email_address) {
        errors.email_address = validationString.profile_email_address_empty
    } else if (!validator.isEmail(values.email_address)) {
        errors.email_address = validationString.profile_email_address_invalid
    }

    return errors
}

export const residentialAddressValidation = (values) => {
    const errors = {}

    if (!values.street_address) {
        errors.street_address = validationString.profile_street_address_empty
    }

    if (!values.city) {
        errors.city = validationString.profile_city_empty
    }

    if (!values.state) {
        errors.state = validationString.profile_state_empty
    }

    if (!values.zip_code) {
        errors.zip_code = validationString.profile_zip_code_empty
    }

    if (!values.country) {
        errors.country = validationString.profile_country_empty
    }

    return errors
}

export const experienceValidation = (values) =>{
    const errors = {}
     /* Experience */
     if (!values.user_experiences || !values.user_experiences.length > 0 || !Array.isArray(values.user_experiences)) {
        errors.user_experiences = { _error: validationString.job_report_empty };
    } else {
        const user_experiences_errors = [];
        values.user_experiences.forEach((exp, index) => {
            const userErrors = {} 
            if (!exp.sub_category_id) {
                userErrors.sub_category_id = validationString.profile_sub_category_empty;
            }
            if (!exp.hours_of_experience) {
                userErrors.hours_of_experience = validationString.profile_hours_of_experience_empty;
            }

            user_experiences_errors[index] = userErrors;
        })
        errors.user_experiences = user_experiences_errors;
    }

    return errors
}

export const emergencyContactValidation = (values) =>{
    const errors = {}

    /** Emergency Contact Validation */
    if (!values.ec_full_name) {
        errors.ec_full_name = validationString.profile_ec_full_name_empty
    }

    if (!values.relationship) {
        errors.relationship = validationString.profile_relationship_empty
    }

    //required fields in Profile - Emergency Contact Details: Mobile Number OR Email 
    if (!values.ec_email) {
        if (!values.ec_mobile_number) {
            errors.ec_mobile_number = validationString.profile_ec_mobile_number_empty
        } else if (!validator.isMobilePhone(values.ec_mobile_number, 'any')) {
            if (customPhonoeNoValidate(values.ec_mobile_number) == true) {
                console.log('allow ph no')
            } else {
                errors.ec_mobile_number = validationString.profile_ec_mobile_number_invalid
            }
        }
    } else if (values.ec_mobile_number) {
        if (!validator.isMobilePhone(values.ec_mobile_number, 'any')) {
            if (customPhonoeNoValidate(values.ec_mobile_number) == true) {
                console.log('allow ph no')
            } else {
                console.log('allow ph no')
                errors.ec_mobile_number = validationString.profile_ec_mobile_number_invalid
            }
        }
    }

    if (!values.ec_mobile_number) {
        if (!values.ec_email) {
            errors.ec_email = validationString.profile_ec_email_empty
        } else if (!validator.isEmail(values.ec_email)) {
            errors.ec_email = validationString.profile_ec_email_invalid
        }
    } else if (values.ec_email) {
        if (!validator.isEmail(values.ec_email)) {
            errors.ec_email = validationString.profile_ec_email_invalid
        }
    }

    if (!values.ec_street_address) {
        errors.ec_street_address = validationString.profile_ec_street_address_empty
    }

    if (!values.ec_city) {
        errors.ec_city = validationString.profile_ec_city_empty
    }

    if (!values.ec_state) {
        errors.ec_state = validationString.profile_ec_state_empty
    }

    if (!values.ec_zip_code) {
        errors.ec_zip_code = validationString.profile_ec_zip_code_empty
    }

    if (!values.ec_country) {
        errors.ec_country = validationString.profile_ec_country_empty
    }

    return errors
}