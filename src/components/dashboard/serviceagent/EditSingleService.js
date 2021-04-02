import React from 'react';
import { Field, FieldArray, isDirty } from 'redux-form';
import { CustomSelect } from '../../common/customSelect';
import { CustomAutoComplete } from '../../common/customAutoComplete';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Icon, Modal, notification } from 'antd';
import { validate, isServiceRequired, isCategoryRequired, isSubCategoryRequired } from '../../../utils/Validations/serviceAgentValidation';
import { reduxForm } from 'redux-form';
import * as action from '../../../actions/organizationAction'
import { handleFocus, DeepTrim } from '../../../utils/common';

class EditSingleService extends React.Component {

    subCategoriesSelect(value, option, serviceIndex, categoriesIndex, index) {
        var subCategory = undefined;
        if (!isNaN(value))
            subCategory = this.props.subCategories.find(sub => sub.id.toString() === value.toString());
        if (subCategory) {
            this.props.change(`services[${serviceIndex}].categories[${categoriesIndex}].subcategory[${index}].is_sub_cat_id`, 1)
        }
        else {
            this.props.change(`services[${serviceIndex}].categories[${categoriesIndex}].subcategory[${index}].is_sub_cat_id`, 0)
        }
    }

    renderSubCategory = ({ fields, serviceIndex, formValues, categoriesIndex, meta: { error, submitFailed } }) => {
        if (fields.length === 0)
            fields.push({});
        return fields.map((member, index) => (
            <div className="mor-sub-cat">
                <fieldset className="sf-form form-group auto-comp">
                    <Field name={`${member}.sub_category_id`}
                        dataSource={
                            this.props.subCategories && formValues && formValues.services && formValues.services[serviceIndex]
                                && formValues.services[serviceIndex].categories
                                && formValues.services[serviceIndex].categories[categoriesIndex]
                                && formValues.services[serviceIndex].categories[categoriesIndex].category_id ?
                                this.props.subCategories.filter(subCategory =>
                                    subCategory.category_id === formValues.services[serviceIndex].categories[categoriesIndex].category_id)
                                    .map(subCategory => ({ text: subCategory.sub_category_name, value: subCategory.id })) : []
                        }
                        onChange={(value, option) => this.subCategoriesSelect(value, option, serviceIndex, categoriesIndex, index)}
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

    renderCategory = ({ fields, serviceIndex, formValues, meta: { error, submitFailed } }) => {
        if (fields.length === 0)
            fields.push({});
        return (
            <div className="edit-sai-table">
                {fields.map((member, index) => (
                    <div className="edit-sai-tbl-items" key={index}>
                        <table className="sub-cat-table">
                            <tr>
                                <th className="wc-6"><label>{Strings.category_table_header}</label></th>
                            </tr>
                            <tr>
                                <td>
                                    <div className="mor-sub-cat">
                                        <fieldset className="form-group sf-form">
                                            <Field name={`${member}.category_id`} type="text"
                                                options={this.props.categories && formValues.services && formValues.services[serviceIndex]
                                                    && formValues.services[serviceIndex].service_id ?
                                                    this.props.categories.filter(category =>
                                                        category.service_id === formValues.services[serviceIndex].service_id)
                                                        .map(category => ({ title: category.category_name, value: category.id })) : []}
                                                component={CustomSelect}
                                                placeholder={Strings.user_role_placeholder}
                                                onChange={() => {
                                                    var categories = []
                                                    if (this.props.formValues.categories && this.props.formValues.categories[index]
                                                        && this.props.formValues.categories[index].subcategory) {
                                                        this.props.formValues.categories[index].subcategory.map(() => categories.push({}));
                                                        this.props.change(`services[${serviceIndex}].categories[${index}].subcategory`, categories);
                                                    }
                                                }} /> </fieldset>

                                        {index === fields.length - 1 ?
                                            <button className="exp-bnt add" type="button" onClick={() => fields.push({})}><Icon type='plus' /></button> :
                                            <button className="exp-bnt delete" type="button" onClick={() => fields.remove(index)}><Icon type='minus' /></button>}
                                        {submitFailed && error && <span class="error-input">{error}</span>}
                                    </div>
                                </td>
                            </tr>
                            <tr>
                                <th className="wc-6"><label>{Strings.sub_category_table_header}</label></th>
                            </tr>
                            <tr>
                                <td>
                                    <FieldArray name={`${member}.subcategory`}
                                        formValues={formValues} serviceIndex={serviceIndex} categoriesIndex={index} component={this.renderSubCategory} />
                                </td>
                            </tr>
                        </table>
                    </div>
                ))}
            </div>
        )
    }

    handleCancel = () => {
        this.props.reset();
        this.props.handleCancel();
    }

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);


        // formData.industry_id = this.props.industryId;
        var finalFormObject = {
            service_agent_id: this.props.service_agent_id, org_industries: [formData],
            old_industry_id: this.props.industryId
        }
        this.props.updateServiceAgentService(finalFormObject)
            .then((flag) => {
                this.props.reset();
                this.props.getSubCategories();
                this.props.handleCancel();
            })
            .catch((message) => {
                notification.error({
                    message: "Error!",
                    description: message ? message : "Something went wrong please try again later",
                    onClick: () => { },
                    className: 'ant-error'
                });
            });

    }
    renderServices = ({ fields, formValues, meta: { error, submitFailed } }) => (
        <div className="add-sfs-agent">
            {fields.map((member, index) => (
                <div className="sf-card-inn-bg">
                    <div class="doc-action-bnt">
                        <button class="normal-bnt" type='button' onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></div>
                    <fieldset className="form-group sf-form">
                        <Field label={Strings.choose_service} name={`${member}.service_id`} type="text"
                            options={this.props.services && formValues.industry_id ?
                                this.props.services.filter(service =>
                                    service.industry_id == formValues.industry_id)
                                    .map(service => ({ title: service.service_name, value: service.id })) : []}
                            component={CustomSelect}
                            placeholder={Strings.user_role_placeholder}
                            validate={isServiceRequired}
                            onChange={() => {
                                var categories = []
                                if (formValues.services && formValues.services[index]
                                    && formValues.services[index].categories && formValues.services[index].categories.length) {
                                    formValues.services[index].categories.map(() => categories.push({}));
                                    this.props.change(`services[${index}].categories`, categories);
                                }
                            }}
                        />
                        <div className={this.props.initValueFromEdit ? "sfs-cat-sub sub-cat-update" : "sfs-cat-sub"}>
                            <FieldArray name={`services[${index}].categories`} formValues={formValues}
                                serviceIndex={index} component={this.renderCategory} />
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

    componentWillReceiveProps(newProps) {
        if (newProps.serviceObject && this.props.serviceObject && newProps.serviceObject.service_id !== this.props.serviceObject.service_id) {
            this.count = 0
        }
    }

    render() {
        var { industryId, formValues, handleSubmit, serviceObject } = this.props;
        if (this.count === 0) {
            formValues = serviceObject
        }
        this.count++;
        return (
            <div className="add-sfs-agent">
                <form onSubmit={handleSubmit(this.onSubmit)}>
                    <div className="add-new-sr-indu">
                        <fieldset className="form-group sf-form">
                            <Field label="Choose Industry" name={`industry_id`} type="text"
                                options={this.props.industries ?
                                    this.props.industries
                                        .map(service => ({ title: service.industry_name, value: service.id })) : []}
                                component={CustomSelect}
                                placeholder={Strings.user_role_placeholder}
                                onChange={() => {
                                    var services = []
                                    if (
                                        this.props.formValues.services && this.props.formValues.services.length) {
                                        this.props.formValues.services.map(() => services.push({}));
                                        this.props.change(`services`, services);
                                    }
                                }}
                            />
                            < div className={this.props.initValueFromEdit ? "sfs-cat-sub sub-cat-update" : "sfs-cat-sub"} >
                                <FieldArray name={`services`} formValues={formValues} component={this.renderServices} />
                            </div>
                        </fieldset>

                        {/* <div className="sf-card-inn-bg">
                            <fieldset className="form-group sf-form">
                                <Field label={Strings.choose_service} name={`service_id`} type="text"
                                    options={this.props.services &&
                                        industryId ?
                                        this.props.services.filter(service =>
                                            service.industry_id === industryId)
                                            .map(service => ({ title: service.service_name, value: service.id })) : []}
                                    component={CustomSelect}
                                    placeholder={Strings.user_role_placeholder} />
                                <div className={this.props.initValueFromEdit ? "sfs-cat-sub sub-cat-update" : "sfs-cat-sub"}>
                                    <FieldArray name={`categories`} formValues={formValues}
                                        industryId={industryId} component={this.renderCategory} />
                                </div>
                            </fieldset>
                        </div>
                        <button className="normal-bnt add-line-bnt mb-4" type="button">
                            <i className="material-icons">add</i>Add Service</button> */}
                    </div>
                    <div className="all-btn multibnt">
                        <div className="btn-hs-icon d-flex justify-content-between">
                            <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                                {Strings.cancel_btn}</button>
                            <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                {Strings.update_btn}</button>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
}

const mapStateToProps = (state, { serviceObject }) => {
    return {
        industries: state.industryManagement.industries,
        services: state.industryManagement.services,
        categories: state.industryManagement.categories,
        subCategories: state.industryManagement.subCategories,
        formValues: state.form.EditSingleService && state.form.EditSingleService.values
            ? state.form.EditSingleService.values
            : {},
        initialValues: serviceObject ? serviceObject : {},
        isDirty: isDirty('EditSingleService')(state),
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({
        form: 'EditSingleService', validate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(EditSingleService)