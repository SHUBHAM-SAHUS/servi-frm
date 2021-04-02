import validator from 'validator';
import { validationString } from '../../dataProvider/localize';
import { customPhonoeNoValidate } from '../common';

/* Add New Scope Doc validations Start */

export const isRequired = value => value ? undefined : validationString.scope_doc_isRequired

export const isNotEmptyArray = value => value && Array.isArray(value) && value.length === 0 ? 'Please select area of expertise' : undefined;

export const isTaskStartDateRequired = value => value ? undefined : validationString.scope_doc_isTaskDateRequired

export const atLeastOne = value => value ? undefined : validationString.scope_doc_atLeastOne

export const isPhoneNumber = value => (!/^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/.test(value)
  && !validator.isMobilePhone(value, 'any')
  && !/^(?:\+?61|\(?0)[2378]\)?(?:[ -]?[0-9]){8}$/.test(value)) ? validationString.scope_doc_isPhoneNumber : null

export const isEmail = value => validator.isEmail(value) ? null : validationString.scope_doc_isEmail

export const isNumber = value => value && isNaN(Number(value)) ? validationString.scope_doc_isNumber : undefined

export const isValidABN = value => !/^(?=[0-9]*$)(?:.{9}|.{11})$/.test((value && value.replace(/\s/g, ""))) ? validationString.scope_doc_isValidABN : null

export const clientNameRequired = value => value ? undefined : validationString.scope_doc_client_name_empty
// export const clientNameRequired = value => {
//   console.log(value)
//   return (!value || value === []) ? validationString.scope_doc_client_name_empty : undefined
// }

export const primaryPersonRequired = value => value ? undefined : validationString.scope_doc_primary_contact_person_empty

export const primaryPersonContactNumberRequired = value => value ? undefined : validationString.scope_doc_phone_empty
export const primaryPersonContactNumberIsPhoneNumber = value => (!/^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/.test(value)
  && !validator.isMobilePhone(value, 'any')
  && !/^(?:\+?61|\(?0)[2378]\)?(?:[ -]?[0-9]){8}$/.test(value))
  ? validationString.scope_doc_isPhoneNumber
  : null

export const primaryPersonEmailRequired = value => value ? undefined : validationString.scope_doc_email_empty
export const primaryPersonEmailIsEmail = value => validator.isEmail(value) ? null : validationString.scope_doc_isEmail

export const clientAddressRequired = value => value ? undefined : validationString.scope_doc_address_empty

export const abnRequired = value => value ? undefined : validationString.scope_doc_abn_acn_empty

export const jobNameRequired = value => value ? undefined : validationString.scope_doc_job_name_empty


/** Site Validations Start */

export const siteNameRequired = value => value ? undefined : validationString.scope_doc_site_name_empty

export const siteAddressRequired = value => value ? undefined : validationString.scope_doc_site_address_empty

export const siteCityRequired = value => value ? undefined : validationString.scope_doc_site_city_empty

export const siteStateRequired = value => value ? undefined : validationString.scope_doc_site_state_empty

export const siteZipRequired = value => value ? undefined : validationString.scope_doc_site_zip_code_empty

export const siteCountryRequired = value => value ? undefined : validationString.scope_doc_site_country_empty

/** Site Validations End */


/** Task Validations Start */

export const taskNameRequired = value => value ? undefined : validationString.scope_doc_site_task_name_empty

export const taskAreaRequired = value => value ? undefined : validationString.scope_doc_site_area_empty

export const taskEstimateRequired = value => {
  return value ? undefined : validationString.scope_doc_site_estimate_empty
}

/** Task Validations End */

export const validate = values => {

  const errors = {};

  if (values && values.client && !values.client.name) {
    errors.client_name = validationString.scope_doc_client_name_empty
  }

  if (values && values.client && !values.client.primary_contact_person) {
    errors.primary_contact_person = validationString.scope_doc_primary_contact_person_empty
  }

  return errors;
}

export const siteTaskValidate = values => {
  const errors = {}
  if (!values.task_name) {
    errors.task_name = validationString.scope_doc_site_task_name_empty
  }

  if (!values.areas) {
    errors.areas = validationString.scope_doc_site_area_empty;
  }

  if (values.duration) {
    var res = values.duration.trim().split(" ");

    if (res.length > 0) {
      var isnum = /^\d+$/.test(res[0]);
      var inital = res[0].toLowerCase()
      if ((res.length === 1 && !(inital == 'day' || inital == 'month' || inital == 'week' || inital == 'month' || inital == 'year' || inital == 'fortnight'))) {
        errors.duration = "Invalid Duration"
      }

      var inital1 = res.length > 1 ? res[1].toLowerCase() : ''
      if ((res.length > 1 && !(isnum && inital1 == 'day' || inital1 == 'days' || inital1 == 'week' || inital1 == 'weeks' || inital1 == 'month' || inital1 == 'months' || inital1 == 'year' || inital1 == 'years' || inital1 == 'fortnight' || inital1 == 'fortnights'))) {
        errors.duration = "Invalid Duration"
      }

      if (res.length > 2) {
        errors.duration = "Invalid Duration"
      }
    }
  }

  if (values.frequency) {
    var res = values.frequency.trim().split(" ");

    if (res.length > 0) {
      var isnum = /^\d+$/.test(res[0]);
      var inital = res[0].toLowerCase()
      if ((res.length === 1 && !(inital == 'day' || inital == 'month' || inital == 'week' || inital == 'month' || inital == 'year' || inital == 'fortnight'))) {
        errors.frequency = "Invalid frequency"
      }

      var inital1 = res.length > 1 ? res[1].toLowerCase() : ''
      if ((res.length > 1 && !(isnum && inital1 == 'day' || inital1 == 'days' || inital1 == 'week' || inital1 == 'weeks' || inital1 == 'month' || inital1 == 'months' || inital1 == 'year' || inital1 == 'years' || inital1 == 'fortnight' || inital1 == 'fortnights'))) {
        errors.frequency = "Invalid frequency"
      }
      if (res.length > 2) {
        errors.frequency = "Invalid frequency"
      }
    }
  }

  return errors
}

export const clientDetailsValidate = values => {
  const errors = {}
  if (!values.name) {
    errors.name = validationString.client_name_empty
  }
  if (!values.primary_contact_person) {
    errors.primary_contact_person = validationString.scope_doc_primary_contact_person_empty
  }

  if (!values.phone) {
    errors.phone = validationString.scope_doc_phone_empty
  } else if (!validator.isMobilePhone(values.phone, 'any')) {
    if (customPhonoeNoValidate(values.phone) == true) {
      console.log('allow ph no')
    } else {
      errors.phone = validationString.scope_doc_phone_invalid
    }
  }

  if (!values.email) {
    errors.email = validationString.scope_doc_email_empty
  } else if (!validator.isEmail(values.email)) {
    errors.email = validationString.scope_doc_email_invalid
  }

  if (!values.address) {
    errors.address = validationString.scope_doc_address_empty
  }

  if (!values.abn_acn) {
    errors.abn_acn = validationString.scope_doc_abn_acn_empty
  } else if (!/^(?=[0-9]*$)(?:.{9}|.{11})$/.test(values.abn_acn.replace(/\s/g, ""))) {
    errors.abn_acn = validationString.scope_doc_abn_acn_invalid
  }

  if (!values.business_number) {
    errors.business_number = validationString.client_business_phone_empty;
  } else if (!/^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/.test(values.business_number)
    && !validator.isMobilePhone(values.business_number, 'any')
    && !/^(?:\+?61|\(?0)[2378]\)?(?:[ -]?[0-9]){8}$/.test(values.business_number)) {
    errors.business_number = validationString.scope_doc_isPhoneNumber
  }

  // if (!values.website) {
  //   errors.website = validationString.client_website_empty;
  // }

  if (!values.email_address) {
    errors.email_address = validationString.client_email_address_empty;
  } else if (!validator.isEmail(values.email_address)) {
    errors.email = validationString.scope_doc_email_invalid
  }

  if (!values.quote_requested_by) {
    errors.quote_requested_by = validationString.scope_doc_quote_requested_by_empty
  }

  return errors
}

export const businessPhoneNoRequired = value => value ? undefined : validationString.client_business_phone_empty;
export const invoicingEmailAddressRequired = value => value ? undefined : validationString.client_email_address_empty;