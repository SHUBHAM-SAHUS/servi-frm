import { validationString } from "../../dataProvider/localize"

export const validate = values => {

    const errors = {}

    if (!values.slug) {
        errors.slug = validationString.sms_slug_empty
    }

    // if (!values.template_name) {
    //     errors.template_name = validationString.sms_temp_name_empty
    // }

    if (values.template_name && Array.isArray(values.template_name) && values.template_name.length === 0) {
        errors.template_name = validationString.sms_temp_name_empty
    }

    if (!values.content) {
        errors.content = validationString.sms_content_empty
    }
    return errors
}