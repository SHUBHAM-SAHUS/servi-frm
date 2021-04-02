import validator from 'validator';
import { validationString } from '../../dataProvider/localize';

export const validate = values => {
  
    var errors = {}
    if (!values.name) {
        errors.name = validationString.role_name_empty
    }

    return errors
}
