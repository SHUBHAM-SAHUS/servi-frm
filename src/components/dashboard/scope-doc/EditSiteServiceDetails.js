import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, Modal, notification } from 'antd';
import * as actions from '../../../actions/scopeDocActions';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { customTextarea } from '../../common/customTextarea';
import { CustomDatepicker } from '../../common/customDatepicker';
import { validate } from '../../../utils/Validations/scopeDocValidation';
import { handleFocus, DeepTrim } from '../../../utils/common';

class EditSiteServiceDetails extends React.Component {

    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        formData.site_id = this.props.initialValues.id
        formData.client_id = this.props.selectedScopeDoc.client.id
        this.props.action.updateSiteService(this.props.selectedScopeDoc.id, formData)
            .then((res) => {
                this.props.action.getScopeDoc();
                this.props.handleCancel()
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

    render() {
        const { handleSubmit, selectedScopeDoc } = this.props;
        return (
            <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h4 className="sf-sm-hd sf-pg-heading">{Strings.scope_doc_edit_ssd}</h4>
                    <button class="closed-btn" onClick={this.props.handleCancel}><Icon type="close" /></button>
                </div>
                <div className="sf-card-body doc-update-task mt-2">
                    <form onSubmit={handleSubmit(this.onSubmit)} >
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.job_name}
                                name="job_name"
                                type="text"
                                id="job_name"
                                component={customInput} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.site_name}
                                name="site_name"
                                type="text"
                                id="site_name"
                                component={customInput} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.street_add_txt}
                                name="street_address"
                                type="text"
                                id="street_address"
                                component={customTextarea} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.city_txt}
                                name="city"
                                type="text"
                                id="city"
                                component={customTextarea} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.state_txt}
                                name="state"
                                type="text"
                                id="state"
                                component={customTextarea} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.zip_code_no}
                                name="zip_code"
                                type="text"
                                id="zip_code"
                                component={customTextarea} />
                        </fieldset>
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.country_txt}
                                name="country"
                                type="text"
                                id="country"
                                component={customTextarea} />
                        </fieldset>
                        <div className="all-btn multibnt">
                            <div className="btn-hs-icon d-flex justify-content-between">
                                <button onClick={this.props.handleCancel} className="bnt bnt-normal" type="button">
                                    {Strings.cancel_btn}</button>
                                <button type="submit" className="bnt bnt-active">
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
    var value = state.scopeDocs ? state.scopeDocs.scopeDocsDetails[0] : null;
    return {
        selectedScopeDoc: (value ? value : {}),
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'EditSiteServiceDetails', validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(EditSiteServiceDetails)