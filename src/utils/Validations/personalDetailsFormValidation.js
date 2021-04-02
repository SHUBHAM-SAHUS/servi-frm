import validator from 'validator';
import { validationString } from '../../dataProvider/localize';
import { customPhonoeNoValidate } from '../common';

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