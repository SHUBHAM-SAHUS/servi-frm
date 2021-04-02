import validator from 'validator';
import { validationString } from '../../dataProvider/localize'

export const validate = values => {
    const errors = {}
    if (!values.timeSheetList || !values.timeSheetList.length > 0 || !Array.isArray(values.timeSheetList)) {
    } else {
        const org_users_errors = [];
        values.timeSheetList.forEach((timesheet, index) => {
            const userErrors = {}
            if (!timesheet.user_name) {
                userErrors.user_name = validationString.timesheet_name_empty;
            }
            if (!timesheet.start_time) {
                userErrors.start_time = validationString.timesheet_start_empty;
            }
            if (!timesheet.stop_time) {
                userErrors.stop_time = validationString.timesheet_end_empty;
            }
            org_users_errors[index] = userErrors;
        })
        errors.timeSheetList = org_users_errors;
    }

    return errors
}

