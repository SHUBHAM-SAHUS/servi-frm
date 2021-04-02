import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { customInput } from '../../../common/custom-input';
import { Strings } from '../../../../dataProvider/localize';
import { customTextarea } from '../../../common/customTextarea';
import { validate } from '../../../../utils/Validations/SWMSValidation';
import { CustomSelect } from '../../../common/customSelect'
import { CustomSwitch } from '../../../common/customSwitch'
import * as action from '../../../../actions/SWMSAction';
import { getStorage, handleFocus } from '../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import { Modal, notification } from 'antd';
import { DeepTrim } from '../../../../utils/common';
import { extactOptionsFroDefaults } from '../../SWMSManagement/ViewEditSWMSActivity';


class AddSWMSForm extends React.Component {

    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        formData.active = +formData.active;
        if (this.props.organisation_id && this.props.job_id) {
            formData.org_id = this.props.organisation_id;
            formData.job_id = this.props.job_id;
        } else {
            formData.org_id = JSON.stringify(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id);
        }
        this.props.addSWMS({ swms: [formData] }).then((flag) => {
            this.props.reset();
            this.props.close();
        })
            .catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }

    render() {
        const { handleSubmit, swmsControl } = this.props;

        return (
            <form onSubmit={handleSubmit(this.onSubmit)} >
                <fieldset className="form-group sf-form">
                    <Field
                        label="Activity"
                        name="activity"
                        type="name"
                        component={customInput} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label="Category"
                        name={`swms_category_id`}
                        type="name"
                        options={this.props.orgSWMS.swms_cat ? this.props.orgSWMS.swms_cat.map(obj => ({ value: obj.id, title: obj.category })) : []}
                        component={CustomSelect}
                        dropdownMatchSelectWidth="true"
                    />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label="Potential Safety Enviroment Hazards"
                        name="hazard"
                        type="name"
                        component={customTextarea} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label="likelihood before controls"
                        name="likelihood_before_controls"
                        type="name"
                        options={swmsControl.likelihood_before_controls ? swmsControl.likelihood_before_controls.map(obj => ({ value: obj.id, title: obj.name })) : []}
                        component={CustomSelect} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label="consequence before controls"
                        name="consequence_before_controls"
                        type="name"
                        options={swmsControl.consequence_before_controls ? swmsControl.consequence_before_controls.map(obj => ({ value: obj.id, title: obj.name })) : []}
                        component={CustomSelect} />
                </fieldset>

                <fieldset className="form-group sf-form">
                    <Field
                        label="Control Measures"
                        name="control_measures"
                        type="name"
                        component={customTextarea} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label="likelihood after controls"
                        name="likelihood_after_controls"
                        type="name"
                        options={swmsControl.likelihood_before_controls ? swmsControl.likelihood_before_controls.map(obj => ({ value: obj.id, title: obj.name })) : []}
                        component={CustomSelect} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label="consequence after controls"
                        name="consequence_after_controls"
                        type="name"
                        options={swmsControl.consequence_before_controls ? swmsControl.consequence_before_controls.map(obj => ({ value: obj.id, title: obj.name })) : []}
                        component={CustomSelect} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label="Person Responsible"
                        name="person_responsible"
                        type="name"

                        component={customInput} />
                </fieldset>
                <fieldset className="sf-form">
                    <Field
                        label="Defaults"
                        name={`defaults`}
                        mode="multiple"
                        options={extactOptionsFroDefaults(this.props.orgSWMS)}
                        component={CustomSelect} dropdownMatchSelectWidth="true" />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label="Active"
                        name="active"
                        type="name"

                        component={CustomSwitch} />
                </fieldset>
                <div className="all-btn multibnt">
                    <div className="btn-hs-icon d-flex justify-content-between">
                        <button onClick={this.props.close} className="bnt bnt-normal" type="button">
                            {Strings.cancel_btn}</button>
                        <button type="submit" className="bnt bnt-active">
                            {Strings.add_txt}</button>
                    </div>
                </div>
            </form>

        );
    }
}

const mapStateToProps = (state, ownProps) => {
    // var value = state.scopeDocs.scopeDocs ? state.scopeDocs.scopeDocs.find(item => item.id === ownProps.selectedScopeDocID) : {};
    return {
        initialValues: { active: true, defaults: [] },
        swmsControl: state.swmsReducer.swmsControl,
        orgSWMS: state.swmsReducer.orgSWMS,
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({
        form: 'AddSWMSForm', validate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(AddSWMSForm)



