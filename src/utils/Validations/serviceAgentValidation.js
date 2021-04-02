import validator from "validator";
import { validationString } from "../../dataProvider/localize";
import { customPhonoeNoValidate } from "../common";

export const isServiceRequired = value =>
  value ? undefined : "Select Service";
export const isCategoryRequired = value =>
  value ? undefined : "Select Category";
export const isSubCategoryRequired = value =>
  value ? undefined : "Select Sub-Category";

export const validate = values => {
  const errors = {};

  if (!values.name) {
    errors.name = validationString.sa_name_empty;
  }
  if (!values.primary_person) {
    errors.primary_person = validationString.sa_primary_person_empty;
  }
  if (!values.address) {
    errors.address = validationString.profile_street_address_empty;
  }
  if (!values.notification_email) {
    errors.notification_email = validationString.sa_email_empty;
  } else if (!validator.isEmail(values.notification_email)) {
    errors.notification_email = validationString.sa_email_invalid;
  }

  if (!values.website) {
    // errors.website = "Please enter website"
  } else if (!validator.isURL(values.website)) {
    errors.website = validationString.sa_website_empty;
  }

  if (!values.email_address) {
    errors.email_address = validationString.sa_email_empty;
  } else if (!validator.isEmail(values.email_address)) {
    errors.email_address = validationString.sa_email_invalid;
  }

  // if (!values.country_code) {
  //   errors.country_code = "This is a required field"
  // }

  if (!values.phone_number) {
    errors.phone_number = validationString.sa_phone_number_empty;
  } else if (!validator.isMobilePhone(values.phone_number)) {
    //errors.phone_number = validationString.sa_phone_number_invalid;
    if (customPhonoeNoValidate(values.phone_number) == true) {
      console.log("allow ph no");
    } else {
      errors.phone_number = validationString.sa_phone_number_invalid;
    }
  }

  // if (!values.phone_number) {
  //     errors.phone_number = 'This is a required field'
  // } else if (!/^(?:\+?61|0)[2-478](?:[ -]?[0-9]){8}$/.test(values.phone_number)
  //     && !validator.isMobilePhone(values.phone_number, 'en-IN')
  //     && !/^(?:\+?61|\(?0)[2378]\)?(?:[ -]?[0-9]){8}$/.test(values.phone_number)) {
  //     errors.phone_number = 'Invalid phone number';
  // }

  if (values.abn_acn) {
    if (
      !/^(?=[0-9]*$)(?:.{9}|.{11})$/.test(values.abn_acn.replace(/\s/g, ""))
    ) {
      errors.abn_acn = validationString.sa_abn_acn_empty;
    }
  } else {
    errors.abn_acn = "This is a required field";
  }

  if (
    !values.org_industries ||
    !values.org_industries.length > 0 ||
    !Array.isArray(values.org_industries)
  ) {
    // errors.org_industries = { _error: 'Add atleast one industry' };
  } else {
    const org_industries = [];
    values.org_industries.forEach((industry, index) => {
      const industryErrors = {};
      if (!industry.industry_id) {
        industryErrors.industry_id = validationString.sa_industry_empty;
      }

      org_industries[index] = industryErrors;
    });
    errors.org_industries = org_industries;
  }
  if (
    !values.org_users ||
    !values.org_users.length > 0 ||
    !Array.isArray(values.org_users)
  ) {
  } else {
    const org_users_errors = [];
    values.org_users.forEach((user, index) => {
      const userErrors = {};
      if (!user.name) {
        userErrors.name = validationString.sa_user_name_empty;
      }
      if (!user.role_id) {
        userErrors.role_id = validationString.sa_user_role_empty;
      }
      if (!user.email_address) {
        userErrors.email_address = validationString.sa_user_email_empty;
      } else if (!validator.isEmail(user.email_address)) {
        userErrors.email_address = validationString.sa_user_email_invalid;
      }

      // if (!user.country_code) {
      //   userErrors.country_code = "Required"
      // }

      if (!user.phone_number) {
        userErrors.phone_number = validationString.sa_user_phone_number_empty;
      } else if (
        !validator.isMobilePhone(user.country_code + user.phone_number, "any")
      ) {
        userErrors.phone_number = validationString.sa_user_phone_number_invalid;
      }

      org_users_errors[index] = userErrors;
    });
    errors.org_users = org_users_errors;
  }
  delete errors.subscription_id;

  return errors;
};
