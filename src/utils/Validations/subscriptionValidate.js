import validator from 'validator';

export const validate = values => {
    const errors = {}
    if(!values.name ){
		errors.name = 'This is a required field'
    }
    if(!values.period){
        errors.period = 'This is a required field'
    }else if(!validator.isIn(values.period,[3,6,12])){
        errors.period = 'Period can be 3, 6, 12 months only';
    }
    if(!values.amount){
        errors.amount = 'This is a required field'
    }
    return errors
}