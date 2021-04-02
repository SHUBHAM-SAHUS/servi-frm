import { validationString } from '../../dataProvider/localize'

export const validate = values => {
  const errors = {};

  if (values && !values.name) {
    errors.name = validationString.eqp_name_empty
  }

  if (values && !values.equipment_id) {
    errors.equipment_id = validationString.eqp_id_empty
  }

  if (values && !values.type) {
    errors.type = validationString.eqp_type_empty
  }

  if (values && !values.equ_group) {
    errors.equ_group = validationString.eqp_grp_empty
  }

  if (values && !values.cost) {
    errors.cost = validationString.eqp_cost_empty
  }
  
  if (values && (values.test_date || values.test_type || values.tester || values.license_type || values.license_expiry || values.result || values.next_test_date)) {
    if (values && !values.test_date) {
      errors.test_date = validationString.test_date_empty
    }

    if (values && !values.test_type) {
      errors.test_type = validationString.test_type_empty
    }

    if (values && !values.tester) {
      errors.tester = validationString.tester_empty
    }

    if (values && !values.license_type) {
      errors.license_type = validationString.tester_lic_type_empty
    }

    if (values && !values.license_expiry) {
      errors.license_expiry = validationString.tester_lic_expiry_empty
    }

    if (values && !values.result) {
      errors.result = validationString.test_result_empty
    }

    if (values && !values.next_test_date) {
      errors.next_test_date = validationString.nxt_test_date
    }
  }

  return errors;
}