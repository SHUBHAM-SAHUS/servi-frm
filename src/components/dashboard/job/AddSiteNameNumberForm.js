import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { Modal, notification } from 'antd';
import { DeepTrim } from '../../../utils/common';

import * as action from '../../../actions/SAJobMgmtAction';
import { handleFocus } from '../../../utils/common';

class AddSiteNameNumberForm extends React.Component {

    onSubmit = async formData => {
		formData = await DeepTrim(formData);

        formData.job_number = this.props.job_number;
        formData.id = this.props.job_id;
        this.props.updateJob(formData).then(message => {
            notification.success({
                message: Strings.success_title,
                description: message,
                onClick: () => { },
                className: 'ant-success'
                // onOk: () => this.props.close()
            })
            this.props.close()
        }).catch(err => {
            notification.error({
                message: Strings.error_title,
                description: err ? err : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
            })
        })
    }

    render() {
        const { handleSubmit, siteFormType } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit)} >
                {siteFormType === "name" ? <> <fieldset className="form-group sf-form">
                    <Field
                        label="Site Contact Name"
                        name="site_contact_name"
                        type="text"
                        component={customInput} />
                </fieldset>
                    <fieldset className="form-group sf-form">
                        <Field
                            label="Site Contact Number"
                            name="site_contact_number"
                            type="text"
                            component={customInput} />
                    </fieldset></> : <fieldset className="form-group sf-form">
                        <Field
                            label="Purchase Order Number"
                            name="po_number"
                            type="text"
                            component={customInput} />
                    </fieldset>}

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
    return {
        initialValues: {}
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({ form: 'addSiteNameNumberForm', enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(AddSiteNameNumberForm)



