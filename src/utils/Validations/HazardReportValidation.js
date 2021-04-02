import validator from 'validator';
import { validationString } from '../../dataProvider/localize'

/** Card Validations */
export const validate = values => {
    const errors = {}
    if (!values.hazard_location) {
        errors.hazard_location = validationString.haz_location_empty
    }

    if (!values.description) {
        errors.description = validationString.haz_desc_empty
    }

    if (!values.hazard_date) {
        errors.hazard_date = validationString.haz_date_empty
    }

    if (!values.immediate_action_taken) {
        errors.immediate_action_taken = validationString.haz_action_empty

    }

    if (!values.likelihood) {
        errors.likelihood = validationString.haz_likelihood_empty

    }

    if (!values.consequence) {
        errors.consequence = validationString.haz_Consequence_empty

    }

    if (!values.responsible_person) {
        errors.responsible_person = validationString.haz_responsible_empty

    } else if (!validator.isNumeric(values.responsible_person)) {
        errors.responsible_person = validationString.haz_responsible_invalid;
    }

    if (!values.hazard_categories || Object.keys(values.hazard_categories).filter(cat => values.hazard_categories[cat] === true).length < 1) {
        errors.hazard_categories = validationString.haz_category_empty;
    }
    return errors
}

/** Billing Address Validations */
export const assignValidate = values => {
    const errors = {}

    if (!values.responsible_person) {
        errors.responsible_person = validationString.haz_responsible_empty

    } else if (!validator.isNumeric(values.responsible_person)) {
        errors.responsible_person = validationString.haz_responsible_invalid;
    }

    if (!values.follow_up) {
        errors.follow_up = validationString.haz_follow_up_empty;
    }
    /* if (values.status === undefined || values.status === null) {
        errors.status = 'This is a required field'
    } */

    return errors
}