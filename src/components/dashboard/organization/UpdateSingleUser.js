import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Icon, Modal, notification } from 'antd';
import { reduxForm } from 'redux-form';
import * as action from '../../../actions/organizationUserAction';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import { countryCodes } from '../../../dataProvider/countryCodes';
import { DeepTrim } from '../../../utils/common';

import validator from 'validator';

var countryCode = '+61'
const required = value => value ? undefined : 'This is a required field'
//const phoneRequired = value => value ? (validator.isMobilePhone(value)) ? undefined : 'Invalid phone number' : 'This is a required field'

class UpdateSingleUser extends React.Component {

  phoneRequired = value => {
    if (!value) {
      return 'Enter phone number'
    } else if (!validator.isMobilePhone(countryCode + value)) {
      return 'Invalid phone number'
    }
    return undefined
  }

  componentDidMount() {
    if (this.props.initialValues && this.props.initialValues.country_code) {
      console.log(this.props.initialValues.country_code)
      countryCode = this.props.initialValues.country_code
    }
  }

  onSelectCountryCode = value => {
    countryCode = value
  }

  onSubmit = async (formData) => {
    formData = await DeepTrim(formData);
    
    this.props.updateUsersFromView({ org_user: formData }, formData.organisation_id)
      .then((flag) => {
        this.props.reset();
        this.props.removeInlineUser(this.props.initialValues);
      })
      .catch((message) => {
        notification.error({
          message: "Error!",
          description: message ? message : "Something went wrong please try again later",onClick: () => { },
          className: 'ant-error'
        });
      });

  }

  render() {

    const { handleSubmit, initialValues } = this.props;
    if (!initialValues.country_code) this.props.change("country_code", "+61")

    return (
      <form className="tr" onSubmit={handleSubmit(this.onSubmit)} key={initialValues.id}>
        <span className="td">
          <fieldset className="sf-form">
            <Field
              name={`name`}
              type="text"
              placeholder='Name'
              validate={required}
              component={customInput}
            />
          </fieldset>
        </span>
        <span className="td">
          <fieldset className="sf-form">
            <Field
              name={`email_address`}
              type="text"
              placeholder='Email Address'
              validate={required}
              component={customInput}
            />
          </fieldset>
        </span>
        <span className="td">
          <div className="co-code-mobile-no">
            <fieldset className="sf-form co-code-txt">
              <Field
                name={`country_code`}
                type="text"
                showSearch={1}
                validate={required}
                options={countryCodes.map(country => ({
                  title: country.dial_code,
                  value: country.dial_code
                }))}
                component={CustomSelect}
                onChange={this.onSelectCountryCode}
              />
            </fieldset>
            <fieldset className="sf-form mobile-ntxt">
              <Field
                name={`phone_number`}
                type="text"
                maxLength="10"
                placeholder='Phone Number'
                validate={this.phoneRequired}
                component={customInput}
              />
            </fieldset>
          </div>
        </span>
        <span className="td">
          <fieldset className="sf-form">
            <Field
              name={`role_id`}
              type="text"
              validate={required}
              options={this.props.roles ? this.props.roles.map(role => ({ title: role.name, value: role.id })) : []}
              component={CustomSelect}
              placeholder={Strings.user_role_placeholder}
            />
          </fieldset>
        </span>
        <span className="td">
          <button className='delete-bnt' type='submit' >
            <i class="material-icons">save</i>
          </button>
          <button className='delete-bnt' type='button' onClick={() => this.props.removeInlineUser(this.props.initialValues)}>
            <i class="material-icons">close</i>
          </button>
        </span>
      </form>
    )
  }
}

const mapStateToProps = (state, { serviceObject }) => {
  return {
    roles: state.roleManagement.roles,
  }
}


export default compose(
  connect(mapStateToProps, action),
  reduxForm({ /*  validate, */ enableReinitialize: true })
)(UpdateSingleUser)