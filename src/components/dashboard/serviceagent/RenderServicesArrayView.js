import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { CustomSelect } from '../../common/customSelect';
import { CustomAutoComplete } from '../../common/customAutoComplete';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as industryActions from '../../../actions/industryManagementAction';
import { Icon } from 'antd';
import { isServiceRequired, isCategoryRequired, isSubCategoryRequired } from './../../../utils/Validations/serviceAgentValidation'

class RenderServicesArrayView extends React.Component {

  subCategoriesSelect(value, option, serviceIndex, industry_id, categoriesIndex, index) {
    var subCategory = undefined;
    if (!isNaN(value))
      subCategory = this.props.subCategories.find(sub => sub.id.toString() === value.toString());
    if (subCategory) {
      this.props.change(`org_services[$${industry_id}].services[${serviceIndex}].categories[${categoriesIndex}].subcategory[${index}].is_sub_cat_id`, 1)
    }
    else {
      this.props.change(`org_services[$${industry_id}].services[${serviceIndex}].categories[${categoriesIndex}].subcategory[${index}].is_sub_cat_id`, 0)
    }
  }

  renderSubCategory = ({ fields, industry_id, serviceIndex, formValues, categoriesIndex, meta: { error, submitFailed } }) => {
    if (fields.length === 0)
      fields.push({});
    return fields.map((member, index) => (
      <div className="mor-sub-cat">
        <fieldset className="sf-form form-group auto-comp">
          <Field name={`${member}.sub_category_id`}
            dataSource={
              this.props.subCategories && formValues && formValues.services[serviceIndex]
                && formValues.services[serviceIndex].categories
                && formValues.services[serviceIndex].categories[categoriesIndex]
                && formValues.services[serviceIndex].categories[categoriesIndex].category_id ?
                this.props.subCategories.filter(subCategory =>
                  subCategory.category_id === formValues.services[serviceIndex].categories[categoriesIndex].category_id)
                  .map(subCategory => ({ text: subCategory.sub_category_name, value: subCategory.id })) : []
            }
            onChange={(value, option) => this.subCategoriesSelect(value, option, serviceIndex, industry_id, categoriesIndex, index)}
            component={CustomAutoComplete}
            validate={isSubCategoryRequired}
          /> </fieldset>

        {index === fields.length - 1 ?
          <button className="exp-bnt add" type="button" onClick={() => fields.push({})}><Icon type='plus' /></button> :
          <button className='exp-bnt delete' type='button' onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
        {submitFailed && error && <span class="error-input">{error}</span>}
      </div>
    ))
  }

  renderCategory = ({ fields, industry_id, serviceIndex, formValues, meta: { error, submitFailed } }) => {
    if (fields.length === 0)
      fields.push({});
    return (
      <table className="sub-cat-table">
        <tr>
          <th className="wc-6"><label>{Strings.category_table_header}</label></th>
          <th className="wc-6"><label>{Strings.sub_category_table_header}</label></th>
        </tr>
        {fields.map((member, index) => (
          <tr key={index}>
            <td>
              <div className="mor-sub-cat">
                <fieldset className="form-group sf-form">
                  <Field name={`${member}.category_id`} type="text"
                    options={this.props.categories && formValues && formValues.services[serviceIndex]
                      && formValues.services[serviceIndex].service_id ?
                      this.props.categories.filter(category =>
                        category.service_id === formValues.services[serviceIndex].service_id)
                        .map(category => ({ title: category.category_name, value: category.id })) : []}
                    component={CustomSelect}
                    placeholder={Strings.user_role_placeholder}
                    validate={isCategoryRequired}
                  /> </fieldset>

                {index === fields.length - 1 ?
                  <button className="exp-bnt add" type="button" onClick={() => fields.push({})}><Icon type='plus' /></button> :
                  <button className="exp-bnt delete" type="button" onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
                {submitFailed && error && <span class="error-input">{error}</span>}
              </div>
            </td>
            <td>
              <FieldArray name={`${member}.subcategory`} serviceIndex={serviceIndex}
                formValues={formValues} categoriesIndex={index} component={this.renderSubCategory} industry_id={industry_id} />
            </td>
          </tr>

        ))}
      </table>
    )
  }

  render() {
    var { fields, industry_id, formValues, meta: { error, submitFailed } } = this.props;
    return (
      <div className="add-sfs-agent">
        {fields.map((member, index) => (
          <div className="sf-card-inn-bg">
            <div class="doc-action-bnt">
              <button class="normal-bnt" onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></div>
            <fieldset className="form-group sf-form">
              <Field label={Strings.choose_service} name={`${member}.service_id`} type="text"
                options={this.props.services &&
                  industry_id ?
                  this.props.services.filter(service =>
                    service.industry_id === industry_id)
                    .map(service => ({ title: service.service_name, value: service.id })) : []}
                component={CustomSelect}
                placeholder={Strings.user_role_placeholder}
                validate={isServiceRequired} />
              <div className={this.props.initValueFromEdit ? "sfs-cat-sub sub-cat-update" : "sfs-cat-sub"}>
                <FieldArray name={`${member}.categories`} serviceIndex={index} formValues={formValues}
                  component={this.renderCategory} industry_id={industry_id}
                  validate={isCategoryRequired}
                />
              </div>
            </fieldset>
          </div>
        ))}

        <button className="normal-bnt add-line-bnt mt-3" type="button" onClick={() => fields.push({})}>
          <i class="material-icons">add</i>
          {Strings.add_service_btn}
        </button>
        {submitFailed && error && <span class="error-input">{error}</span>}
      </div>
    )
  }
}

const mapStateToProps = (state, { }) => {
  return {
    industries: state.industryManagement.industries,
    services: state.industryManagement.services,
    categories: state.industryManagement.categories,
    subCategories: state.industryManagement.subCategories,

  }
}

const mapDispatchToprops = dispatch => {
  return {
    industryActions: bindActionCreators(industryActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToprops)(RenderServicesArrayView)