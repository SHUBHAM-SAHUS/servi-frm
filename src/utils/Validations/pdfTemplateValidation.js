import { validationString } from "../../dataProvider/localize"

export const validate = values => {

    const errors = {}

    if (!values.slug) {
        errors.slug = validationString.pdf_slug_empty
    }
    if (!values.template_name) {
        errors.template_name = validationString.pdf_temp_name_empty
    }
    if (!values.content) {
        errors.content = validationString.pdf_content_empty
    }
    
    return errors
}