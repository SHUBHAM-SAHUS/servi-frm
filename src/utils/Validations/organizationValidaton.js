import validator from "validator";
import { validationString } from "../../dataProvider/localize";
import { customPhonoeNoValidate } from "../common";

export const isServiceRequired = value => value ? undefined : "Select Service"
export const isCategoryRequired = value => value ? undefined : "Select Category"
export const isSubCategoryRequired = value => value ? undefined : "Select Sub-Category"

export const validate = values => {
  const errors = {};
  if (!values.name) {
    errors.name = validationString.org_name_empty;
  }

  if (!values.primary_person) {
    errors.primary_person = validationString.org_primary_person_empty;
  }

  if (!values.address) {
    errors.address = validationString.profile_street_address_empty
  }

  if (!values.phone_number) {
    errors.phone_number = validationString.org_phone_number_empty;
  } else if (!validator.isMobilePhone(values.phone_number, "any")) {
    if (customPhonoeNoValidate(values.phone_number) == true) {
      console.log("allow ph no");
    } else {
      errors.phone_number = validationString.payroll_phone_number_invalid;
    }
  }

  if (!values.abn_acn) {
    errors.abn_acn = validationString.org_abn_acn_empty;
  }

  if (values.abn_acn) {
    if (
      !/^(?=[0-9]*$)(?:.{9}|.{11})$/.test(values.abn_acn.replace(/\s/g, ""))
    ) {
      errors.abn_acn = validationString.org_abn_acn_invlid;
    }
  } else {
    errors.abn_acn = "This is a required field";
  }

  if (!values.email_address) {
    errors.email_address = validationString.org_email_empty;
  } else if (!validator.isEmail(values.email_address)) {
    errors.email_address = validationString.org_email_invalid;
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
        userErrors.name = validationString.org_user_name_empty;
      }

      if (Array.isArray(user.role_id) && user.role_id.length === 0) {
        userErrors.role_id = validationString.org_user_role_empty;
      }

      if (!user.role_id) {
        userErrors.role_id = validationString.org_user_role_empty;
      }
      if (!user.email_address) {
        userErrors.email_address = validationString.org_user_email_empty;
      } else if (!validator.isEmail(user.email_address)) {
        userErrors.email_address = validationString.org_user_email_invalid;
      }

      if (!user.phone_number) {
        userErrors.phone_number = validationString.org_user_phone_number_empty;
      } else if (
        !validator.isMobilePhone(user.country_code + user.phone_number)
      ) {
        userErrors.phone_number =
          validationString.org_user_phone_number_invalid;
      }

      org_users_errors[index] = userErrors;
    });
    errors.org_users = org_users_errors;
  }

  return errors;
};
