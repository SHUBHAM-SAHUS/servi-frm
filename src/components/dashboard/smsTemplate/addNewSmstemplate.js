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
import { validate } from '../../../utils/Validations/smsTemaplateValidation';
import { customInput } from '../../common/custom-input';
import * as actions from '../../../actions/smsTemplateAction';
import { CustomSwitch } from '../../common/customSwitch'
import { Strings } from '../../../dataProvider/localize';
import { customTextarea } from '../../common/customTextarea';
import { VALIDATE_STATUS } from '../../../dataProvider/constant';
import { CustomSelect } from '../../common/customSelect';
import { isRequired } from '../../../utils/Validations/scopeDocValidation';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { handleFocus } from '../../../utils/common';
class addNewSmsTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cardExpnadBtn: true };
    }

    onSubmit = (formData) => {
        formData.active = +formData.active;
        formData.temp_name = formData.template_name.split('---')[0]
        formData.slug = formData.template_name.split('---')[1]
        this.props.addSmsTemplate(formData).then((message) => {
            this.props.reset();
            notification.success({
                message: Strings.success_title,
                description: message,
                onClick: () => { },
                className: 'ant-success'
            })
        }).catch((error) => {
            if (error.status === VALIDATE_STATUS) {
                notification.warning({
                    message: Strings.validate_title,
                    description: error && error.data && typeof error.data.message == 'string'
                        ? error.data.message : Strings.generic_validate,
                    onClick: () => { },
                    className: 'ant-warning'
                });
            } else {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
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
        this.props.getSmsDropDown().then((flag) => {
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

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    }

    render() {
        const { handleSubmit, smsDropDown } = this.props;
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
                                        <h2 className="sf-pg-heading">{Strings.sms_template_card}</h2>
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
                                                label={Strings.sms_template_name}
                                                name="temp_name"
                                                type="text"
                                                id="temp_name"
                                                component={customInput} />
                                        </fieldset> */}
                                        <fieldset className="form-group sf-form">
                                            <Field
                                                label={Strings.sms_template_name}
                                                name="template_name"
                                                placeholder={Strings.temp_name_sms}
                                                type="text"
                                                id="template_name"
                                                validate={isRequired}
                                                options={smsDropDown && smsDropDown.map(sms => ({
                                                    title: sms.temp_name,
                                                    value: `${sms.temp_name}---${sms.slug}`
                                                }))
                                                }
                                                component={CustomSelect} />
                                        </fieldset>
                                        <fieldset className="form-group sf-form">
                                            <Field
                                                label={Strings.sms_template_content}
                                                name="content"
                                                type="text"
                                                id="content"
                                                component={customTextarea} />
                                        </fieldset>
                                        <fieldset className="form-group sf-form">
                                            <Field
                                                name="active"
                                                id="active"
                                                label={Strings.sms_template_status}
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
        smsDropDown: state.smsTemplate && state.smsTemplate.smsDropDown,
        initialValues: { active: true, template_name: [] },
        isDirty: isDirty('addNewSmsTemplate')(state)
    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: 'addNewSmsTemplate', validate ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(addNewSmsTemplate)