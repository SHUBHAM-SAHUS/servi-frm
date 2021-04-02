import { validationString } from '../../dataProvider/localize'

export const validate = values => {
  const errors = {}

  if (values && !values.job_start_date) {
    errors.job_start_date = validationString.job_start_date_empty;
  }

  if (values && !values.day && !values.night) {
    errors.job_time = validationString.job_time_select;
  }

  if (values && (!values.job_duration || values.job_duration === "0")) {
    errors.job_duration = validationString.job_duration_select;
  }

  if (values && values.shifts && Array.isArray(values.shifts) && values.shifts.length > 0) {
    const shift_errors = []

    values.shifts.forEach((shift, index) => {
      const singleShiftErrors = {}

      if (!shift.shift_date) {
        singleShiftErrors.shift_date = validationString.shift_date_empty;
      }

      if (!shift.yard_time) {
        singleShiftErrors.yard_time = validationString.yard_time_empty;
      }

      if (!shift.site_time) {
        singleShiftErrors.site_time = validationString.site_time_empty;
      }

      if (!shift.finish_time) {
        singleShiftErrors.finish_time = validationString.finish_time_empty;
      }

      if (!shift.supervisor) {
        singleShiftErrors.supervisor = validationString.supervisor_empty;
      }

      if (shift.supervisor && isNaN(parseInt(shift.supervisor))) {
        singleShiftErrors.supervisor = validationString.supervisor_invalid;
      }

      if (!shift.site_supervisor) {
        singleShiftErrors.site_supervisor = validationString.site_supervisor_empty;
      }

      if (shift.site_supervisor && isNaN(parseInt(shift.site_supervisor))) {
        singleShiftErrors.supervisor = validationString.site_supervisor_invalid
      }

      shift_errors[index] = singleShiftErrors;
    })

    errors.shifts = shift_errors
  }

  return errors
}