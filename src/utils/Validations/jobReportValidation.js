import validator from 'validator';
import { validationString } from '../../dataProvider/localize'

export const validate = values => {
    var errors = {};
    if (!values.job_cleaning_reports || !values.job_cleaning_reports.length > 0 || !Array.isArray(values.job_cleaning_reports)) {
        errors.job_cleaning_reports = { _error:  validationString.job_report_empty};
    } else {
        const job_cleaning_reports_errors = [];
        values.job_cleaning_reports.forEach((jobReport, index) => {
            const userErrors = {}
            if (!jobReport.area) {
                userErrors.area = validationString.job_report_area_validate;
            }
            if (!jobReport.photo_taken_by) {
                userErrors.photo_taken_by = validationString.job_report_photo_taken_validate;
            }

            job_cleaning_reports_errors[index] = userErrors;
        })
        errors.job_cleaning_reports = job_cleaning_reports_errors;
    }



    return errors
}

export const singleValidate = values => {
    var errors = {};
    if (!values.area) {
        errors.area = validationString.job_report_area_validate;
    } 
    if (!values.photo_taken_by) {
        errors.photo_taken_by = validationString.job_report_photo_taken_validate;
    } 
    return errors
}