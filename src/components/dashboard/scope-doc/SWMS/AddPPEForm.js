import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { customInput } from '../../../common/custom-input';
import { Strings } from '../../../../dataProvider/localize';
import { customTextarea } from '../../../common/customTextarea';
import { validate } from '../../../../utils/Validations/SWMSValidation';
import { CustomSwitch } from '../../../common/customSwitch'
import { getStorage, handleFocus } from '../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import { Modal, notification } from 'antd';
import { DeepTrim } from '../../../../utils/common';

import * as action from '../../../../actions/SWMSAction';

class AddPPEForm extends React.Component {

    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        formData.active = +formData.active;
        if (this.props.organisation_id && this.props.job_id) {
            formData.org_id = this.props.organisation_id;
            formData.job_id = this.props.job_id;
        } else {
            formData.org_id = JSON.stringify(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id);
        }
        this.props.addPPE({ ppe: [formData] }).then((flag) => {
            this.props.reset();
            this.props.close()
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
        const { handleSubmit } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit)} >
                <fieldset className="form-group sf-form">
                    <Field
                        label="PPE"
                        name="name"
                        type="name"

                        component={customInput} />
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
                        <button onClick={() => this.props.close()} className="bnt bnt-normal" type="button">
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
        initialValues: { active: true }
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({
        form: 'AddPPEForm', validate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(AddPPEForm)



