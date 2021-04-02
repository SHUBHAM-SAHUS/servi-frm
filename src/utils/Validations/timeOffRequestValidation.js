import validator from 'validator';
import { validationString } from '../../dataProvider/localize';

/** User Personal Details Validations */
export const timeOffRequestValidator = (values) => {
    const errors = {}

    if (!values.start_date) {
        errors.start_date = validationString.timeoff_start_date_empty
    }

    if (!values.start_time && !values.all_day) {
        errors.start_time = validationString.timeoff_start_time_empty
    }

    if (!values.end_date) {
        errors.end_date = validationString.timeoff_end_date_empty
    }

    if (!values.end_time && !values.all_day) {
        errors.end_time = validationString.timeoff_end_time_empty
    }

    if (values.leave_type && Array.isArray(values.leave_type) && values.leave_type.length === 0) {
        errors.leave_type = validationString.timeoff_leave_type_empty
    }

    if (!values.comment) {
        errors.comment = validationString.timeoff_comment_empty
    }

    if (!values.notify_manager) {
        errors.notify_manager = validationString.timeoff_notify_manager_empty
    }

    return errors
}