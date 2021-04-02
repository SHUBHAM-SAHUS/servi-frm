import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { CustomSelect } from '../../common/customSelect';
import { CustomAutoComplete } from '../../common/customAutoComplete';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import * as industryActions from '../../../actions/industryManagementAction';
import { Icon } from 'antd';
import { isServiceRequired, isCategoryRequired, isSubCategoryRequired } from './../../../utils/Validations/organizationValidaton'

class AddServiceAgentIndustry extends React.Component {

    componentDidMount() {
        this.props.industryActions.getIndustries();
        this.props.industryActions.getServices();
        this.props.industryActions.getCategories();
        this.props.industryActions.getSubCategories();
    }

    subCategoriesSelect(value, option, serviceIndex, industryIndex, categoriesIndex, index) {
        var subCategory = undefined;
        if (!isNaN(value))
            subCategory = this.props.subCategories.find(sub => sub.id.toString() === value.toString());
        if (subCategory) {
            this.props.change(`org_industries[${industryIndex}].services[${serviceIndex}].categories[${categoriesIndex}].subcategory[${index}].is_sub_cat_id`, 1)
        }
        else {
            this.props.change(`org_industries[${industryIndex}].services[${serviceIndex}].categories[${categoriesIndex}].subcategory[${index}].is_sub_cat_id`, 0)
        }
    }

    renderSubCategory = ({ fields, serviceIndex, industryIndex, formValues, categoriesIndex, meta: { error, submitFailed } }) => {
        if (fields.length === 0)
            fields.push({});
        return fields.map((member, index) => (
            <div className="mor-sub-cat">
                <fieldset className="sf-form form-group auto-comp">
                    <Field name={`${member}.sub_category_id`}
                        dataSource={
                            this.props.subCategories && formValues.org_industries && formValues.org_industries[industryIndex].services[serviceIndex]
                                && formValues.org_industries[industryIndex].services[serviceIndex].categories
                                && formValues.org_industries[industryIndex].services[serviceIndex].categories[categoriesIndex]
                                && formValues.org_industries[industryIndex].services[serviceIndex].categories[categoriesIndex].category_id ?
                                this.props.subCategories.filter(subCategory =>
                                    subCategory.category_id === formValues.org_industries[industryIndex].services[serviceIndex].categories[categoriesIndex].category_id)
                                    .map(subCategory => ({ text: subCategory.sub_category_name, value: subCategory.id })) : []
                        }
                        onChange={(value, option) => this.subCategoriesSelect(value, option, serviceIndex, industryIndex, categoriesIndex, index)}
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

    renderCategory = ({ fields, serviceIndex, industryIndex, formValues, meta: { error, submitFailed } }) => {
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
                                        options={this.props.categories && formValues.org_industries && formValues.org_industries[industryIndex].services[serviceIndex]
                                            && formValues.org_industries[industryIndex].services[serviceIndex].service_id ?
                                            this.props.categories.filter(category =>
                                                category.service_id === formValues.org_industries[industryIndex].services[serviceIndex].service_id)
                                                .map(category => ({ title: category.category_name, value: category.id })) : []}
                                        component={CustomSelect}
                                        placeholder={Strings.user_role_placeholder}
                                        validate={isCategoryRequired}
                                        onChange={() => {
                                            var categories = []
                                            if (this.props.formValues.org_industries && this.props.formValues.org_industries[industryIndex] &&
                                                this.props.formValues.org_industries[industryIndex].services && this.props.formValues.org_industries[industryIndex].services[serviceIndex]
                                                && this.props.formValues.org_industries[industryIndex].services[serviceIndex].categories && this.props.formValues.org_industries[industryIndex].services[serviceIndex].categories[index]
                                                && this.props.formValues.org_industries[industryIndex].services[serviceIndex].categories[index].subcategory) {
                                                this.props.formValues.org_industries[industryIndex].services[serviceIndex].categories[index].subcategory.map(() => categories.push({}));
                                                this.props.change(`org_industries[${industryIndex}].services[${serviceIndex}].categories[${index}].subcategory`, categories);
                                            }
                                        }}
                                    /> </fieldset>

                                {index === fields.length - 1 ?
                                    <button className="exp-bnt add" type="button" onClick={() => fields.push({})}><Icon type='plus' /></button> :
                                    <button className="exp-bnt delete" type="button" onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
                                {submitFailed && error && <span class="error-input">{error}</span>}
                            </div>
                        </td>
                        <td>
                            <FieldArray name={`${member}.subcategory`} serviceIndex={serviceIndex}
                                industryIndex={industryIndex} formValues={formValues} categoriesIndex={index} component={this.renderSubCategory} />
                        </td>
                    </tr>

                ))}
            </table>
        )
    }

    renderServices = ({ fields, industryIndex, formValues, meta: { error, submitFailed } }) => (
        <div className="add-sfs-agent">
            {fields.map((member, index) => (
                <div className="sf-card-inn-bg">
                    <div class="doc-action-bnt">
                        <button class="normal-bnt" onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></div>
                    <fieldset className="form-group sf-form">
                        <Field label={Strings.choose_service} name={`${member}.service_id`} type="text"
                            options={this.props.services && formValues.org_industries &&
                                formValues.org_industries[industryIndex].industry_id ?
                                this.props.services.filter(service =>
                                    service.industry_id === formValues.org_industries[industryIndex].industry_id)
                                    .map(service => ({ title: service.service_name, value: service.id })) : []}
                            component={CustomSelect}
                            placeholder={Strings.user_role_placeholder}
                            validate={isServiceRequired}
                            onChange={() => {
                                var categories = []
                                if (this.props.formValues.org_industries && this.props.formValues.org_industries[industryIndex] &&
                                    this.props.formValues.org_industries[industryIndex].services && this.props.formValues.org_industries[industryIndex].services[index]
                                    && this.props.formValues.org_industries[industryIndex].services[index].categories && this.props.formValues.org_industries[industryIndex].services[index].categories.length) {
                                    this.props.formValues.org_industries[industryIndex].services[index].categories.map(() => categories.push({}));
                                    this.props.change(`org_industries[${industryIndex}].services[${index}].categories`, categories);
                                }
                            }}
                        />
                        <div className={this.props.initValueFromEdit ? "sfs-cat-sub sub-cat-update" : "sfs-cat-sub"}>
                            <FieldArray name={`${member}.categories`} serviceIndex={index} formValues={formValues}
                                industryIndex={industryIndex} component={this.renderCategory} />
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

    render() {
        var { fields, meta: { error, submitFailed }, formValues, initValueFromEdit } = this.props;
        return (
            <div className={initValueFromEdit ? "sf-card-body update-industry" : "sf-card-body"}>
                {fields.map((member, index) => (
                    <div className="sf-card-inner">
                        <div class="doc-action-bnt">
                            <button class="normal-bnt" onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></div>
                        <fieldset className="sf-form">
                            <Field label={Strings.service_inductry_txt} name={`${member}.industry_id`} type="text"
                                options={this.props.industries ?
                                    this.props.industries.map(industry => ({ title: industry.industry_name, value: industry.id })) : []}
                                component={CustomSelect}
                                onChange={() => {
                                    var services = []
                                    if (this.props.formValues.org_industries && this.props.formValues.org_industries[index] &&
                                        this.props.formValues.org_industries[index].services && this.props.formValues.org_industries[index].services.length) {
                                        this.props.formValues.org_industries[index].services.map(() => services.push({}));
                                        this.props.change(`org_industries[${index}].services`, services);
                                    }
                                }}
                                placeholder={Strings.user_role_placeholder} />
                            <div>
                                <FieldArray name={`${member}.services`} industryIndex={index} formValues={formValues} component={this.renderServices} />
                            </div>
                        </fieldset>
                    </div>
                ))}
                <div className="btn-hs-icon sm-bnt">
                    <button className="bnt bnt-normal" type="button" onClick={() => fields.push({})}>{Strings.add_industry_btn}</button>
                </div>
                {submitFailed && error && <span class="error-input">{error}</span>}
                <div className="s-n-bnt btn-hs-icon sm-bnt ml-4 usr-sb-btn">
                    <button type="submit" className="bnt bnt-active">
                        {Strings.update_btn}</button>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state, { initValueFromEdit }) => {
    return {
        industries: state.industryManagement.industries,
        services: state.industryManagement.services,
        categories: state.industryManagement.categories,
        subCategories: state.industryManagement.subCategories,
        formValues: initValueFromEdit
            ? state.form.viewEditOrganization && state.form.viewEditOrganization.values
                ? state.form.viewEditOrganization.values
                : {}
            : state.form.addOrganization && state.form.addOrganization.values
                ? state.form.addOrganization.values
                : {},
    }
}

const mapDispatchToprops = dispatch => {
    return {
        industryActions: bindActionCreators(industryActions, dispatch),
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(AddServiceAgentIndustry)