import { validationString } from '../../dataProvider/localize';

export const validate = values => {
    return values ? undefined : validationString.user_course_quiz_validation
}
