import validator from 'validator';
import { validationString } from '../../dataProvider/localize'

/** Card Validations */
export const validate = values => {
    const errors = {}
    if (!values.incident_date) {
        errors.incident_date = validationString.inci_date_empty
    }

    if (!values.incident_time) {
        errors.incident_time = validationString.inci_time_empty
    }

    if (!values.location) {
        errors.location = validationString.inci_location_empty
    }

    if (!values.description) {
        errors.description = validationString.inci_description_empty

    }

    if (!values.actual_incident_category || Object.keys(values.actual_incident_category)
        .filter(cat => values.actual_incident_category[cat] === true).length < 1) {
        errors.actual_incident_category = validationString.inci_category_empty
    }

    if (!values.whats_was_done) {
        errors.whats_was_done = validationString.inci_what_done_empty

    }

    if (!values.persons || !values.persons.length > 0 || !Array.isArray(values.persons)) {
        // errors.persons =  { _error: 'Add atleast one person' };
    } else {
        const org_users_errors = [];
        values.persons.forEach((user, index) => {
            const userErrors = {}
            if (!user.name) {
                userErrors.name = validationString.person_name_empty;
            }
            if (!user.type_of_person) {
                userErrors.type_of_person = validationString.person_type_empty;
            }
            if (!user.other_detail) {
                userErrors.other_detail = validationString.person_other_empty
            }
            org_users_errors[index] = userErrors;
        })
        errors.persons = org_users_errors;
    }

    if (!values.witnesses || !values.witnesses.length > 0 || !Array.isArray(values.witnesses)) {
        // errors.witnesses =  { _error: 'Add atleast one person' };
    } else {
        const org_users_errors = [];
        values.witnesses.forEach((user, index) => {
            const userErrors = {}
            if (!user.name) {
                userErrors.name = validationString.wit_name_empty;
            }
            if (!user.type_of_person) {
                userErrors.type_of_person = validationString.wit_type_empty
            }
            if (!user.other_detail) {
                userErrors.other_detail = validationString.wit_other_empty
            }
            org_users_errors[index] = userErrors;
        })
        errors.witnesses = org_users_errors;
    }

    if (!values.consultations || !values.consultations.length > 0 || !Array.isArray(values.consultations)) {
        // errors.consultations =  { _error: 'Add atleast one person' };
    } else {
        const org_users_errors = [];
        values.consultations.forEach((user, index) => {
            const userErrors = {}
            if (!user.name) {
                userErrors.name = validationString.consult_name_empty
            }
            if (!user.position) {
                userErrors.position = validationString.consult_position_empty
            }
            if (!user.contact_details) {
                userErrors.contact_details = validationString.consult_contact_empty
            }
            org_users_errors[index] = userErrors;
        })
        errors.consultations = org_users_errors;
    }

    if (!values.correctives || !values.correctives.length > 0 || !Array.isArray(values.correctives)) {
        // errors.correctives =  { _error: 'Add atleast one person' };
    } else {
        const org_users_errors = [];
        values.correctives.forEach((user, index) => {
            const userErrors = {}
            if (!user.risk_control) {
                userErrors.risk_control = validationString.action_risk_empty;
            }
            if (!user.required_action) {
                userErrors.required_action = validationString.action_required_empty;
            }
            if (!user.responsible_person) {
                userErrors.responsible_person = validationString.action_who_responsible_empty
            } else if (!validator.isNumeric(user.responsible_person)) {
                userErrors.responsible_person = validationString.action_responsible_invalid
            }
            if (!user.completion_date) {
                userErrors.completion_date = validationString.action_date_complete_empty
            }
            org_users_errors[index] = userErrors;
        })
        errors.correctives = org_users_errors;
    }

    if (!values.autho_name) {
        errors.autho_name = validationString.action_auth_empty

    }

    if (!values.date) {
        errors.date = validationString.action_date_complete_empty

    }

    if (!values.signatureFile) {
        errors.signatureFile = validationString.action_sign_empty

    }

    return errors
}

/** Billing Address Validations */
export const assignValidate = values => {
    const errors = {}

    if (!values.assigned_to) {
        errors.assigned_to = validationString.inci_assigned_to_empty;

    }

    if (!values.due_date) {
        errors.due_date = validationString.inci_due_date_empty;
    }
    if (!values.comment) {
        errors.comment = validationString.inci_comment_empty;
    }
    /* if (values.status === undefined) {
        errors.status = 'This is a required field'
    } */
    return errors
}