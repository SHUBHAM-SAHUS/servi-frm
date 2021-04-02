import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { notification, Upload } from 'antd';
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
import { CustomDatepicker } from '../../common/customDatepicker';
import { validate } from "../../../utils/Validations/SWMSValidation";

const required = value => value ? undefined : "Required"

class UpdateSingleSDS extends React.Component {



    onSubmit = async (formData) => {
        formData.active = +formData.active;
        formData = await DeepTrim(formData);
        var finalForm = new FormData();
        Object.keys(formData).forEach(key => {
            if (key == "document" && formData.document.length > 0)
                finalForm.append("document", formData.document[0])
            else if (key == "defaults") {
                finalForm.append(key, JSON.stringify(formData[key]))
            } else if (key == "issue_date_of_msds") {
                finalForm.append(key, JSON.stringify(formData[key]))
            }
            else
                finalForm.append(key, formData[key])
        }
        )

        this.props.updateChemical(finalForm)
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



    render() {

        const { handleSubmit, initialValues, formValues, change } = this.props;
        const uploadButton = (
            <div className="loadf-txt">
                <i class="material-icons">cloud_upload</i>
                <div className="ant-upload-text">Upload Document</div>
            </div>
        );

        return (
            <form className="tr" onSubmit={handleSubmit(this.onSubmit)} key={initialValues.id}>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`name`}
                            placeholder={"Chemical Name"}
                            type="text"
                            component={customInput}
                        />
                    </fieldset>
                </span>
                <span className="td">
                    <fieldset className="sf-form">
                        <Field
                            name={`manufacturer`}
                            placeholder={"Manufacturer"}
                            type="text"
                            component={customInput}
                        />
                    </fieldset>
                </span>
                <span className="td">
                    <div className="chemicals-afbf-pic">
                        <Upload
                            fileList={formValues &&
                                formValues.document && Array.isArray(formValues.document) ?
                                formValues.document : []}
                            beforeUpload={(info) => {
                                change('document', [info])
                                return false;
                            }}
                            accept='.jpeg,.jpg,.png,.doc,.docx,.pdf'
                            // onChange={({ fileList }) => this.handleChange(fileList, index, 'document')}
                            onRemove={() => change('document', [])}

                        >
                            {uploadButton}
                        </Upload>

                    </div>
                </span>
                <span className="td">
                    <div className="form-group sf-form lsico">
                        <fieldset className="sf-form">
                            <Field
                                name={`issue_date_of_msds`}
                                type="name"
                                component={CustomDatepicker} />
                        </fieldset>
                    </div>
                </span>
                <span className="td">
                    <fieldset className="sf-form update-signle-tool-type">
                        <Field
                            name={`hazardous`}
                            options={[{ title: "Yes", value: 1 }, { title: "No", value: 0 }]}
                            component={CustomSelect} />
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

const mapStateToProps = (state, { serviceObject, initialValues }) => {
    return {
        orgSWMS: state.swmsReducer.orgSWMS,
        formValues: state.form["UpdateSingleCategory" + initialValues.id] &&
            state.form["UpdateSingleCategory" + initialValues.id].values,
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({ enableReinitialize: true })
)(UpdateSingleSDS)