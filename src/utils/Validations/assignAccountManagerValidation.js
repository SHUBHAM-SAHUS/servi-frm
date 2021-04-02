import validator from 'validator';
import { validationString } from '../../dataProvider/localize'

export const assignManagerAccountValidate = values => {

  const errors = {};

  if (!values.start_date) {
    errors.start_date = validationString.acc_mgr_start_date_required_txt
  }

  if (!values.end_date) {
    errors.end_date = validationString.acc_mgr_end_date_required_txt
  }

  if (!values.account_manager) {
    errors.account_manager = validationString.acc_mgr_txt
  }

  if (values.account_manager && !values.outsourced_budget) {
    errors.outsourced_budget = validationString.acc_mgr_budget_txt
  }

  return errors;
}
