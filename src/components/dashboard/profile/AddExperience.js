import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field } from 'redux-form';

import { CustomSelect } from '../../common/customSelect';
import { customInput } from '../../common/custom-input';

import { Strings } from '../../../dataProvider/localize';

import { isRequired, isNumber, isNotEmptyArray } from '../../../utils/Validations/scopeDocValidation';
import { Icon } from 'antd';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';

export class AddExperience extends Component {
  selectedOption
  handleChange = (value) => {
    this.selectedOption = value
  }

  render() {
    var { fields, meta: { error, submitFailed }, subCategories, isDisable } = this.props;
    if (fields.length === 0) {
      fields.push({ sub_category_id: [] });
    }

    var initialOption = isDisable && isDisable.map(isd =>
      isd.sub_category_id
    )

    return (
      <>
        {
          fields.map((experience, index) => {
            return (
              <tr>
                <td>
                  <fieldset className="form-group sf-form">
                    {/* <Field
                      label="Role Name"
                      name="role_name"
                      placeholder={Strings.role_name}
                      type="text"
                      dataSource={this.props.roles ? this.props.roles.map(role => ({
                        text: role.role_name,
                        value: role.id
                      })) : ""}
                      component={CustomAutoCompleteSearch}

                    /> */}

                    <Field
                      name={`${experience}.sub_category_id`}
                      // validate={isRequired}
                      type="text"
                      placeholder={Strings.sub_category_id_acc_pd}
                      dataSource={subCategories && subCategories.map((category) => ({
                        text: category.sub_category_name,
                        value: category.id,
                        // disabled: category.id == this.selectedOption
                      }))}
                      validate={[isNotEmptyArray]}
                      onChange={this.handleChange}
                      component={CustomAutoCompleteSearch}
                    />
                  </fieldset>
                </td>
                <td>
                  <fieldset className="form-group sf-form">
                    <Field
                      name={`${experience}.hours_of_experience`}
                      placeholder={Strings.hours_of_experience_acc_pd}
                      type="text"
                      validate={[isNumber]}
                      component={customInput} />
                  </fieldset>
                </td>
                <td>
                  {index === fields.length - 1
                    ? <button className="exp-bnt add" type="button" onClick={() => fields.push({ sub_category_id: [] })}><Icon type='plus' /></button>
                    : <button className='exp-bnt delete' type='button' onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
                </td>
              </tr>
            )
          })
        }
      </>

    )
  }
}

const mapStateToProps = (state) => ({

})

export default connect(mapStateToProps)(AddExperience)
