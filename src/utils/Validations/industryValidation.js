import validator from 'validator';

export const validate = values => {

    const errors = {}

    if (!values.industry_name) {
        errors.industry_name = "required"
    }
    return errors
}