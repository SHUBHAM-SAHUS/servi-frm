import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { notification } from 'antd';
import { reduxForm } from 'redux-form';
import * as action from '../../../actions/SWMSAction';
import { customInput } from '../../common/custom-input';
import { CustomSelect } from '../../common/customSelect';
import { countryCodes } from '../../../dataProvider/countryCodes';
import validator from 'validator';
import { ValidationStrings } from './../../../dataProvider/localize'
import { DeepTrim } from '../../../utils/common';
import { VALIDATE_STATUS } from '../../../dataProvider/constant';
import { CustomSwitch } from '../../common/customSwitch';
import { extactHRWDefaults } from './ViewEditHRW';
import { validate } from "../../../utils/Validations/SWMSValidation";

const required = value => value ? undefined : "Required category name"

class UpdateSingleHRW extends React.Component {



    onSubmit = async (formData) => {
        formData.active = +formData.active;
        formData = await DeepTrim(formData);

        this.props.updateHRW(formData, formData.organisation_id)
            .then((flag) => {
                this.props.reset();
                this.props.removeInlineCat(this.props.initialValues);
            })
            .catch((error) => {
                if (error.status == VALIDATE_STATUS) {
                    notification.warning({
                        message: Strings.validate_title,
                        description: error && error.data && typeof error.data.message == 'string'
                            ? error.data.message : Strings.generic_validate,
                        onClick: () => { },
                        className: 'ant-warning'
                    });
                } else {
                    notification.error({
                        message: Strings.error_title,
                        description: error && error.data && error.data.message && typeof error.data.message == 'string'
                            ? error.data.message : Strings.generic_error,
                        onClick: () => { },
                        className: 'ant-error'
                    });
                }
            });

    }

    componentDidMount() {

    }



    render() {

        const { handleSubmit, initialValues } = this.props;

        return (
            <form className="tr" onSubmit={handleSubmit(this.onSubmit)} key={initialValues.id}>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`name`}
                            type="text"
                            placeholder={"High Risk Work Name"}
                            validate={required}
                            component={customInput}
                        />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form update-signle-tool-type">
                        <Field
                            name={`defaults`}
                            mode="multiple"
                            options={extactHRWDefaults(this.props.orgSWMS)}
                            component={CustomSelect} />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`active`}
                            component={CustomSwitch}
                        />
                    </fieldset>
                </span>
                <span className="td">
                    <button className='delete-bnt' type='submit' >
                        <i class="material-icons">save</i>
                    </button>
                    <button className='delete-bnt' type='button' onClick={() => this.props.removeInlineCat(this.props.initialValues)} >
                        <i class="material-icons">close</i>
                    </button>
                </span>
            </form>

        )
    }
}

const mapStateToProps = (state, { serviceObject }) => {
    return {
        orgSWMS: state.swmsReducer.orgSWMS
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({ enableReinitialize: true, validate })
)(UpdateSingleHRW)