import validator from 'validator';
import { validationString } from '../../dataProvider/localize'

/** Card Validations */
export const validate = values => {
    const errors = {}
    if (!values.titlex) {
        errors.titlex = validationString.card_title_empty;
    }

    if (!values.card_name) {
        errors.card_name = validationString.card_name_empty
    }

    if (!values.card_number) {
        errors.card_number = validationString.card_num_empty;

    } else if (!validator.isNumeric(values.card_number)) {
        errors.card_number = validationString.card_num_invalid
    } else if (values.card_number.length < 16) {
        errors.card_number = validationString.card_num_invalid;
    }

    if (Array.isArray(values.card_expiry_month) && values.card_expiry_month.length === 0) {
        errors.card_expiry_month = validationString.billing_validation_invalid_month
    }

    if (!values.card_expiry_month) {
        errors.card_expiry_month = validationString.card_expiry_empty;

    } else if (typeof values.card_expiry_month === "string" && !validator.isNumeric(values.card_expiry_month)) {
        errors.card_expiry_month = validationString.card_expiry_invalid
    }

    if (Array.isArray(values.card_expiry_year) && values.card_expiry_year.length === 0) {
        errors.card_expiry_year = validationString.billing_validation_invalid_year
    }

    if (!values.card_expiry_year) {
        errors.card_expiry_year = validationString.card_expiry_empty;

    } else if (typeof values.card_expiry_year === "string" && !validator.isNumeric(values.card_expiry_year)) {
        errors.card_expiry_year = validationString.card_expiry_invalid
    }

    if (!values.cvn) {
        errors.cvn = validationString.card_cvn_empty

    } else if (!validator.isNumeric(values.cvn)) {
        errors.cvn = validationString.card_cvn_invalid
    }

    return errors
}

/** Billing Address Validations */
export const billingAddressValidate = values => {
    const errors = {}

    if (!values.billing_email_address) {
        errors.billing_email_address = validationString.bill_email_empty

    } else if (!validator.isEmail(values.billing_email_address)) {
        errors.billing_email_address = validationString.bill_email_invalid
    }

    if (!values.billing_address) {
        errors.billing_address = validationString.bill_address_empty;
    }

    return errors
}