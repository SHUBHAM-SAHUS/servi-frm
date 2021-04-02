import { validationString } from "../../dataProvider/localize"

export const validate = values => {
  const errors = {}
  if (!values.name) {
    errors.name = validationString.swms_name_empty
  }
  if (!values.expiry) {
    errors.expiry = validationString.swms_expiry_empty
  }

  if (!values.hazard) {
    errors.hazard = validationString.swms_hazard_empty
  }
  if (!values.likelihood_before_controls) {
    errors.likelihood_before_controls = validationString.swms_likelihood_before_controls_empty
  }
  if (!values.consequence_before_controls) {
    errors.consequence_before_controls = validationString.swms_consequence_before_controls_empty
  }
  if (!values.control_measures) {
    errors.control_measures = validationString.swms_control_measures_empty
  }
  if (!values.likelihood_after_controls) {
    errors.likelihood_after_controls = validationString.swms_likelihood_after_controls_empty
  }
  if (!values.consequence_after_controls) {
    errors.consequence_after_controls = validationString.swms_consequence_after_controls_empty
  }
  if (!values.person_responsible) {
    errors.person_responsible = validationString.swms_person_responsible_empty
  }
  if (!values.hazard) {
    errors.hazard = validationString.swms_hazard_empty
  }
  if (!values.category) {
    errors.category = "Required Category"
  }

  return errors
}