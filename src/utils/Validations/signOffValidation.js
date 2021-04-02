export const validate = values => {
  const errors = {}

  if (values && (values.client_name || values.signed_off_date || values.feedback || values.signatureFile)){
    if (!values.client_name) {
      errors.client_name = 'Please enter Client Name'
    }

    if (!values.signed_off_date) {
      errors.signed_off_date = 'Please enter a date'
    }

    if (!values.feedback) {
      errors.feedback = 'Please enter some feedback'
    }

    if (!values.signatureFile) {
      errors.signatureFile = 'Please sign here and click save'
    }
  }

  return errors;
}

export const signedOffByRequired = value => value ? undefined : 'Please enter a name'

export const signedOffDateRequired = value => value ? undefined : 'Please enter a date'