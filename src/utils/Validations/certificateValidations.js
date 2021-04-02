import validator from 'validator';
import { validationString } from '../../dataProvider/localize';

export const validate = values => {
  const errors = {}
  if (!values.name) {
    errors.name = validationString.certificate_name_empty
  }
  return errors
}
