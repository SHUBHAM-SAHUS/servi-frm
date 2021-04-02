import validator from 'validator';
import { validationString } from '../../dataProvider/localize'

/** User Personal Details Validations */
export const validate = (values) => {
    const errors = {}

    /** Personal Details Validation*/
    if (!values.to) {
        errors.to = validationString.to_email_empty
    } else if (!validator.isEmail(values.to)) {
        errors.to = validationString.to_email_invalid;
    }

    if (!values.from) {
        errors.from = validationString.from_email_empty
    } else if (!validator.isEmail(values.from)) {
        errors.from = validationString.from_email_invalid;
    }

    if (values.cc) {
        if (!validator.isEmail(values.cc)) {
            errors.cc = validationString.cc_email_invalid
        }
    }

    if (values.bcc) {
        if (!validator.isEmail(values.bcc)) {
            errors.bcc = validationString.bcc_email_invalid;
        }
    }

    if (!values.subject) {
        errors.subject = validationString.subject_empty;
    }

    // if (!values.body) {
    //     errors.body = 'Please add the Message'
    // }

    return errors
}

/** JobDocs Email Validations */
export const JobDocsEmailvalidate = (values) => {
    const errors = {}

    /** Personal Details Validation*/

    if (!values.from_profile) {
        errors.from_profile = validationString.from_profile_empty
    }

    if (!values.to_field) {
        errors.to_field = validationString.to_email_empty
    } else if (!validator.isEmail(values.to_field)) {
        errors.to_field = validationString.to_email_invalid
    }

    if (!values.from_field) {
        errors.from_field = validationString.from_email_empty
    } else if (!validator.isEmail(values.from_field)) {
        errors.from_field = validationString.from_email_invalid
    }

    if (values.cc_field) {
        if (!validator.isEmail(values.cc_field)) {
            errors.cc_field = validationString.cc_email_invalid
        }
    }

    if (values.bcc_field) {
        if (!validator.isEmail(values.bcc_field)) {
            errors.bcc_field = validationString.bcc_email_invalid
        }
    }

    if (!values.subject) {
        errors.subject = validationString.subject_empty
    }

    if (!values.validity) {
        errors.validity = validationString.validity_empty
    }

    // if (!values.body) {
    //     errors.body = 'Please add the Message'
    // }

    return errors
}