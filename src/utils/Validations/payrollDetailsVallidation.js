import validator from 'validator';
import { validationString } from '../../dataProvider/localize';
import { customPhonoeNoValidate } from '../common';

export const pyrollDetailsValidation = (values) => {
    const errors = {}

    if (!values.tfn) {
        errors.tfn = validationString.tfn_empty
    } else if (!/^([0-9])/.test(values.tfn)) {
        errors.tfn = validationString.tfn_invalid
    }

    return errors
}

export const superFundValidation = (values) => {
    const errors = {}

    if (!values.is_super_ac) {
        if (!values.fund_name) {
            errors.fund_name = validationString.fund_name_empty
        }

        if (!values.fund_abn) {
            errors.fund_abn = validationString.fund_abn_empty
        } else if (!/^([0-9])/.test(values.fund_abn)) {
            errors.fund_abn = validationString.fund_abn_invalid
        }

        if (!values.phone_number) {
            errors.phone_number = validationString.payroll_phone_number_empty
        } else if (!validator.isMobilePhone(values.phone_number, 'any')) {
            if (customPhonoeNoValidate(values.phone_number) == true) {
                console.log('allow ph no')
            } else {
                errors.phone_number = validationString.payroll_phone_number_invalid
            }
        }

        if (!values.bsb) {
            errors.bsb = validationString.bsb_empty
        } else if (!/^([0-9])/.test(values.bsb)) {
            errors.bsb = validationString.bsb_invalid
        }

        if (!values.ac_no) {
            errors.ac_no = validationString.fund_ac_no_empty
        } else if (!/[0-9]$/.test(values.ac_no)) {
            errors.ac_no = validationString.fund_ac_no_invalid
        }

        if (!values.ac_name) {
            errors.ac_name = validationString.fund_ac_name_empty
        } else if (!/^[a-zA-Z ]*$/.test(values.ac_name)) {
            errors.ac_name = validationString.fund_ac_name_invalid
        }

        return errors
    }
}

export const backAccountValidation = (values) => {
    const errors = {}

    if (!values.bank_ac_name)
        errors.bank_ac_name = validationString.bank_ac_name_empty
    else if (!/^[a-zA-Z ]*$/.test(values.bank_ac_name))
        errors.bank_ac_name = validationString.bank_ac_name_invalid

    if (!values.bank_name)
        errors.bank_name = validationString.bank_name_empty
    else if (!/^[a-zA-Z ]*$/.test(values.bank_name))
        errors.bank_name = validationString.bank_name_invalid

    if (!values.bank_bsb)
        errors.bank_bsb = validationString.bank_bsb_empty
    else if (!/^([0-9])/.test(values.bank_bsb))
        errors.bank_bsb = validationString.bank_bsb_invalid

    if (!values.bank_ac_number) {
        errors.bank_ac_number = validationString.bank_ac_no_empty
    } else if (!/[0-9]$/.test(values.bank_ac_number)) {
        errors.bank_ac_number = validationString.bank_ac_no_invalid
    }

    if (!values.cnf_bank_ac_no) {
        errors.cnf_bank_ac_no = validationString.cnf_bank_ac_no_empty
    } else if (!/[0-9]$/.test(values.cnf_bank_ac_no)) {
        errors.cnf_bank_ac_no = validationString.cnf_bank_ac_no_invalid
    } else if (values.cnf_bank_ac_no !== values.bank_ac_number) {
        errors.cnf_bank_ac_no = validationString.cnf_bank_ac_no_dismatch
    }

    return errors
}