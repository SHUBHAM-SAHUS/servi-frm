import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Icon, Modal, Dropdown, Menu, notification } from 'antd';
import {
    reduxForm,
    Field,
    isDirty
} from 'redux-form';
import $ from 'jquery';
import { validate } from '../../../utils/Validations/pdfTemplateValidation';
import { customInput } from '../../common/custom-input';
import * as actions from '../../../actions/pdfTemplateActions';
import { CustomSwitch } from '../../common/customSwitch'
import { Strings } from '../../../dataProvider/localize';
import { customTextarea } from '../../common/customTextarea';
import { isRequired } from '../../../utils/Validations/scopeDocValidation';
import { CustomSelect } from '../../common/customSelect';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { handleFocus, DeepTrim } from '../../../utils/common';
class AddNewPdfTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cardExpnadBtn: true };
    }
    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);

        formData.template_status = +formData.template_status;
        // let temp = formData.temp_name.split('---')

        formData.template_name = formData.temp_name.split('---')[0]
        formData.slug = formData.temp_name.split('---')[1]
        this.props.addPdfTemplate(formData).then((flag) => {
            this.props.reset();
            notification.success({
                message: Strings.success_title,
                description: flag,
                onClick: () => { },
                className: 'ant-error'
            })
        }).catch((message) => {
            notification.error({
                key: ERROR_NOTIFICATION_KEY,
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
            });
        });
    }

    componentDidMount() {
        this.props.getPdfDropDown().then(flag => {

        }).catch((message) => {
            notification.error({
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
            });
        });
    }

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    }

    render() {
        const { handleSubmit, pdfDropDown } = this.props;
        return (
            <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
                <div className="row">
                    <div className="col-md-12 col-lg-8">
                        <form onSubmit={handleSubmit(this.onSubmit)}>
                            <div className="sf-card-wrap">
                                {/* zoom button  */}
                                <div className="card-expands">
                                    <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                                        <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                                </div>
                                <div className="sf-card">
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">{Strings.pdf_template_details}</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled overlay={''}>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>
                                    </div>
                                    <div className="sf-card-body mt-2">
                                        {/* <fieldset className="form-group sf-form">
                                            <Field
                                                label={Strings.slug}
                                                name="slug"
                                                type="text"
                                                id="slug"
                                                component={customInput} />
                                        </fieldset>
                                        <fieldset className="form-group sf-form">
                                            <Field
                                                label={Strings.pdf_template_name}
                                                name="template_name"
                                                type="text"
                                                id="template_name"
                                                component={customInput} />
                                        </fieldset> */}
                                        <fieldset className="form-group sf-form">
                                            <Field
                                                label={Strings.pdf_template_name}
                                                name="temp_name"
                                                type="text"
                                                id="temp_name"
                                                validate={isRequired}
                                                options={pdfDropDown && pdfDropDown.map(pdf => ({
                                                    title: pdf.template_name,
                                                    value: `${pdf.template_name}---${pdf.slug}`
                                                }))
                                                }
                                                component={CustomSelect} />
                                        </fieldset>
                                        <fieldset className="form-group sf-form">
                                            <Field
                                                label={Strings.pdf_content}
                                                name="content"
                                                type="text"
                                                id="content"
                                                component={customTextarea} />
                                        </fieldset>
                                        <fieldset className="form-group sf-form">
                                            <Field
                                                name="template_status"
                                                id="template_status"
                                                label={Strings.pdf_template_status}
                                                component={CustomSwitch} />
                                        </fieldset>
                                    </div>
                                </div>
                                {/* zoom save button  */}
                                <div className="row zoom-save-bnt">
                                    <div className="col-md-12">
                                        <div className="all-btn d-flex justify-content-end mt-4">
                                            <div className="btn-hs-icon">
                                                <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                                    <i class="material-icons">save</i> {Strings.save_btn}</button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="all-btn d-flex justify-content-end mt-4">
                                <div className="btn-hs-icon">
                                    <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                                        <i class="material-icons">save</i> {Strings.save_btn}</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        pdfDropDown: state.pdfTemplate && state.pdfTemplate.pdfDropDown,
        initialValues: { template_status: true },
        isDirty: isDirty('AddNewPdfTemplate')(state)
    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'AddNewPdfTemplate', validate ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(AddNewPdfTemplate)