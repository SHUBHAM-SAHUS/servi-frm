import validator from 'validator';
import { validationString } from '../../dataProvider/localize'

/** User Personal Details Validations */
export const addNewLicencesValidator = (values) => {
    const errors = {}

    if (values.type && Array.isArray(values.type) && values.type.length === 0) {
        errors.type = validationString.lic_type_empty
    }

    // if (!values.type) {
    //     errors.type = validationString.lic_type_empty
    // }

    if (!values.number) {
        errors.number = validationString.lic_num_empty;
    }

    if (!values.issued_by) {
        errors.issued_by = validationString.issue_by_empty
    }

    if (!values.issued_date) {
        errors.issued_date = validationString.issue_date_empty
    }

    if (!values.expiry_date) {
        errors.expiry_date = validationString.expiry_date_empty;
    }

    return errors
}