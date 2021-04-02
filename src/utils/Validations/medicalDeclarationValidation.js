import validator from 'validator';
import { validationString } from '../../dataProvider/localize'

/** User Medical Declaration Validations */
export const validate = (values) => {
    const errors = {}

    if(!values.accept_job_requirement){
        errors.accept_job_requirement = validationString.accept_job_requirment
    }

    return errors
}