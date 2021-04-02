import React from 'react';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, notification } from 'antd';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { customTextarea } from '../../common/customTextarea';
import { CustomDatepicker } from '../../common/customDatepicker';
import { DeepTrim } from '../../../utils/common';
import {
    clientDetailsValidate,
    primaryPersonRequired,
    primaryPersonContactNumberRequired,
    primaryPersonContactNumberIsPhoneNumber,
    primaryPersonEmailRequired,
    primaryPersonEmailIsEmail,
    jobNameRequired
} from '../../../utils/Validations/scopeDocValidation';
import * as actions from '../../../actions/scopeDocActions';
import { CustomAutoCompleteSearch } from '../../common/customAutoCompleteSearch';
import { handleFocus } from '../../../utils/common';

class EditClientDetails extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectInitialPrimaryPerson: false };
    }

    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        formData.organisation_id = this.props.initialValues.organisation_id;
        formData.client_id = this.props.initialValues.id;
        formData.scope_doc_id = this.props.selectedScopeDocID;
        let client_person = {
            client_id: this.props.initialValues.id,
            name: formData.primary_contact_person,
            phone: formData.phone,
            email: formData.email,
            quote_requested_by: formData.quote_requested_by,
        }

        let site_id = [];
        if (this.props.selectedScopeDoc && this.props.selectedScopeDoc.sites && this.props.selectedScopeDoc.sites.length > 0) {
            this.props.selectedScopeDoc.sites.forEach(site => {
                if (site && site.site_id) {
                    site_id.push(site.site_id);
                }
            })
        }
        formData.site_ids = site_id;
        formData.client_person = client_person;
        this.props.action.updateClientDetailInScopeDoc(this.props.selectedScopeDocID, formData)
            .then((res) => {
                this.props.handleCancel();
                this.props.action.getScopeDoc();
                notification.success({
                    message: Strings.success_title,
                    description: res.message,
                    onClick: () => { },
                    className: 'ant-success'
                });
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }

    handlePersonSelection = (personId) => {
        let selectedPrimaryPerson = this.props.primaryPersonsList.find(person => person.id == personId);
        this.props.change('primary_contact_person', selectedPrimaryPerson.name);
        this.props.change('phone', selectedPrimaryPerson.phone);
        this.props.change('email', selectedPrimaryPerson.email);
        this.setState({
            selectInitialPrimaryPerson: true
        })
    }

    handleCancelCleintDetail = () => {
        this.props.handleCancel();
        this.props.reset();
    }

    onChangePrimaryContactPerson = (event, selectedPrimaryPerson) => {
        if ((selectedPrimaryPerson === undefined || selectedPrimaryPerson === false) && this.props.formValues.phone !== '' && this.props.formValues.email !== '') {
            this.props.change('phone', '');
            this.props.change('email', '');
        }
    }

    render() {
        const { handleSubmit, initialValues, selectedScopeDoc } = this.props;
        var selectedPrimaryPerson = false;
        if (this.props.formValues && this.props.formValues.primary_contact_person) {
            selectedPrimaryPerson = this.props.primaryPersonsList.find(person => person.id == this.props.formValues.primary_contact_person);
            if (selectedPrimaryPerson === undefined) {
                selectedPrimaryPerson = this.props.primaryPersonsList.find(person => person.name == this.props.formValues.primary_contact_person);
            }
        }

        return (
            <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h4 className="sf-sm-hd sf-pg-heading">{Strings.scope_doc_edit_client_title}</h4>
                    <button class="closed-btn" onClick={this.handleCancelCleintDetail}><Icon type="close" /></button>
                </div>
                <div className="sf-card-body doc-update-task mt-2">
                    <form onSubmit={handleSubmit(this.onSubmit)} >
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.client_name}
                                name="name"
                                type="text"
                                id="name"
                                component={customInput} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.org_pri_person}
                                name="primary_contact_person"
                                type="text"
                                validate={selectedPrimaryPerson ? [] : primaryPersonRequired}
                                dataSource={this.props.primaryPersonsList.map(person => ({
                                    text: person.name,
                                    value: person.id
                                }))}
                                component={CustomAutoCompleteSearch}
                                onSelect={(value) => { this.handlePersonSelection(value) }}
                                onChange={(value) => this.onChangePrimaryContactPerson(value, selectedPrimaryPerson)}
                            />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.phone_no_txt}
                                name="phone"
                                type="text"
                                validate={selectedPrimaryPerson ? [] : [primaryPersonContactNumberRequired, primaryPersonContactNumberIsPhoneNumber]}
                                component={
                                    this.props.isDirty === false ? () => <div className="view-text-value lbl-b">
                                        <label>{Strings.phone_no_txt}</label>
                                        <span>{
                                            initialValues
                                                ? initialValues.phone
                                                : ''
                                        }</span>
                                    </div> : selectedPrimaryPerson
                                            ? () =>
                                                <div className="view-text-value lbl-b">
                                                    <label>{Strings.phone_no_txt}</label>
                                                    <span>{
                                                        selectedPrimaryPerson
                                                            ? selectedPrimaryPerson.phone
                                                            : ''
                                                    }</span>
                                                </div>
                                            : customInput
                                } />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.email_txt}
                                name="email"
                                type="text"
                                validate={selectedPrimaryPerson ? [] : [primaryPersonEmailRequired, primaryPersonEmailIsEmail]}
                                component={
                                    this.props.isDirty === false ? () => <div className="view-text-value lbl-b">
                                        <label>{Strings.email_txt}</label>
                                        <span>{
                                            initialValues
                                                ? initialValues.email
                                                : ''
                                        }</span>
                                    </div> : selectedPrimaryPerson
                                            ? () =>
                                                <div className="view-text-value lbl-b">
                                                    <label>{Strings.email_txt}</label>
                                                    <span>{
                                                        selectedPrimaryPerson
                                                            ? selectedPrimaryPerson.email
                                                            : ''
                                                    }</span>
                                                </div>
                                            : customInput
                                } />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.address_txt}
                                name="address"
                                type="name"
                                id="address"
                                component={customTextarea} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                                <Field
                                    label={Strings.org_abn}
                                    name="abn_acn"
                                    type="text"
                                    id="abn_acn"
                                    component={customInput} />
                            </fieldset> 
                        {/* </FormSection> */}
                        {/* <FormSection name="quotes[0]"> */}
                        {selectedScopeDoc.quotes &&
                            selectedScopeDoc.quotes[0].admin_approve_status === 3
                            && selectedScopeDoc.quotes[0].client_approve_status === 3 ? 
                        <fieldset className="form-group sf-form">
                            <Field
                                label="PO Number"
                                name="quote_po_no"
                                type="text"
                                component={customInput} />
                        </fieldset>: null}
                        <fieldset className="form-group sf-form lsico">
                            <Field
                                label={Strings.quote_request_by}
                                name="quote_requested_by"
                                type="name"
                                id="quote_requested_by"
                                component={CustomDatepicker} />
                        </fieldset>

                        <fieldset className="form-group sf-form">
                            <Field
                                label={"Job Name"}
                                name="job_name"
                                type="text"
                                validate={jobNameRequired}
                                component={customInput}
                            />
                        </fieldset>

                        <div className="all-btn multibnt">
                            <div className="btn-hs-icon d-flex justify-content-between">
                                <button onClick={this.handleCancelCleintDetail} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                                    {Strings.cancel_btn}</button>
                                <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                    {Strings.update_btn}</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    var value = {};
    value = state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : null;
    let clientDetails = {};
    clientDetails = value && value.client ? value.client : null;
    let clientPersonDetails = {};
    clientPersonDetails = value && value.client_person ? value.client_person : null
    if (value && clientDetails && clientPersonDetails) {
        clientDetails.primary_contact_person = clientPersonDetails && clientPersonDetails.name ? clientPersonDetails.name : '';
        clientDetails.phone = clientPersonDetails && clientPersonDetails.phone ? clientPersonDetails.phone : '';
        clientDetails.email = clientPersonDetails && clientPersonDetails.email ? clientPersonDetails.email : '';
        clientDetails.quote_requested_by = clientPersonDetails && clientPersonDetails.quote_requested_by ? clientPersonDetails.quote_requested_by : '';
        clientDetails.job_name = value && value.job_name ? value.job_name : '';
        clientDetails.quote_po_no = value && value.quotes && value.quotes[0] && value.quotes[0].quote_po_no? value.quotes[0].quote_po_no: ""
    }
    return {
        selectedScopeDoc: (value ? value : {}),
        scopeDocData: state.scopeDocs.scopeDocs,
        initialValues: (clientDetails ? clientDetails : {}),
        primaryPersonsList: state.scopeDocs.primaryPersons,
        formValues: state.form.EditClientDetails && state.form.EditClientDetails.values
            ? state.form.EditClientDetails.values
            : {},
        isDirty: isDirty('EditClientDetails')(state),
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'EditClientDetails', validate: clientDetailsValidate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(EditClientDetails)