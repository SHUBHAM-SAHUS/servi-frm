import { validationString } from '../../dataProvider/localize'

export const validate = values => {
    const errors = {};
    
    if (!values.name)
        errors.name = validationString.course_name

    if (!values.short_description)
        errors.short_description = validationString.course_short_description

    if (!values.detailed_description)
        errors.detailed_description = validationString.course_detailed_description

    if (values.course_modules && values.course_modules.length === 0)
        errors.course_modules = validationString.course_modules

    if (values.required_by_everyone === 0)
        if (values.org_role && values.org_role.length === 0)
            errors.org_role = validationString.course_org_role

    if(values.tags && values.tags.length === 0)
        errors.tags = validationString.course_tags

    if (!values.expiration)
        errors.expiration = validationString.course_expiration

    return errors;
}