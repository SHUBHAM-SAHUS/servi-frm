import { validationString } from '../../dataProvider/localize';

export const braodcastValidate = values => {
    const errors = {}
    if (!values.title) {
        errors.title = validationString.broadcast_title
    }
    /*  if (values.role && values.role.length === 0) {
         errors.role = validationString.broadcast_role
     }
    
     if(values.attachment && values.attachment.length === 0){
         errors.attachment = validationString.broadcast_attachment
     } */
    if (!values.body) {
        errors.body = validationString.broadcast_body
    }
    if (!values.send_date) {
        errors.send_date = validationString.broadcast_send_date
    }
    return errors
}