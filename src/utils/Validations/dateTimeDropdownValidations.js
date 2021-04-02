import { validationString } from '../../dataProvider/localize'

export const splitStartDateRequired = value => value ? undefined : 'Please enter start date'

export const splitNumberOfShiftsRequired = value => value ? !isNaN(value) ? undefined : 'Invalid number of shifts' : 'Please enter the number of shifts'

export const validate = (values) => {
  const errors = {}

  if (!values.start_date) {
    errors.start_date = 'Please enter start date'
  }

  if (!values.number_of_shifts) {
    errors.number_of_shifts = 'Please enter the number of shifts'
  }

  return errors;
}