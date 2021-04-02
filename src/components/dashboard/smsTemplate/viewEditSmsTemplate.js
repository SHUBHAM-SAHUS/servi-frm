import React from 'react';
import {
    Icon,
    Menu,
    Dropdown,
    Modal,
    notification
} from 'antd';
import $ from 'jquery';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { validate } from '../../../utils/Validations/smsTemaplateValidation';
import { customInput } from '../../common/custom-input';
import { CustomSwitch } from '../../common/customSwitch';
import * as actions from '../../../actions/smsTemplateAction';
import { Strings } from '../../../dataProvider/localize';
import { customTextarea } from '../../common/customTextarea';
import { VALIDATE_STATUS } from '../../../dataProvider/constant';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { handleFocus } from '../../../utils/common';
class viewEditSmsTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = { displayEdit: 'none', cardExpnadBtn: true }
    }

    onSubmit = (formData) => {
        formData.active = +formData.active;
        console.log("object", formData)
        this.props.updateSmsTemplate(formData).then((message) => {
            this.handleCancel();
            this.getSmsTemplateDetail();
            notification.success({
                message: Strings.success_title,
                description: message,
                onClick: () => { },
                className: 'ant-error'
            })
        }).catch((error) => {
            if (error.status === VALIDATE_STATUS) {
                notification.warning({
                    message: Strings.validate_title,
                    description: error && error.data && typeof error.data.message == 'string'
                        ? error.data.message : Strings.generic_validate,
                    onClick: () => { },
                    className: 'ant-error'
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
        this.getSmsTemplateDetail();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.state !== this.props.location.state) {
            this.getSmsTemplateDetail();
        }
    }

    getSmsTemplateDetail = () => {
        this.props.getSmsTemplateDetails(this.props.location.state)
            .then(flag => {

            }).catch(message => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            })
    }

    handleEditClick = () => {
        this.setState({ displayEdit: 'block' });
        if (!this.state.cardExpnadBtn) {
            this.handleExpand()
        }
    }

    handleCancel = () => {
        this.setState({ displayEdit: 'none' });
    }

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    }

    render() {
        const { handleSubmit } = this.props;
        var selectedSms = this.props.smsTemplateDetails.find(sms => sms && sms.slug === this.props.location.state)

        var menu = (<Menu>
            <Menu.Item onClick={this.handleEditClick}>
                {Strings.edit_sms_template_btn}
            </Menu.Item>
        </Menu>);

        return (
            <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
                <div className="row">
                    <div className="col-lg-8 col-md-12 mb-4">
                        <div className="sf-card-wrap">
                            {/* zoom button  */}
                            <div className="card-expands">
                                <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                                    <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                            </div>
                            <div className="sf-card">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">{Strings.sms_template_card}</h2>
                                    <div className="info-btn">
                                        {/* Drop down for card */}
                                        <Dropdown className="more-info" overlay={menu}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                        {/*Drop down*/}
                                    </div>
                                </div>

                                <div className="sf-card-body mt-2">

                                    <div className="row">
                                        <div className="col-lg-5 col-md-12 vtrow-bx">
                                            <div className="view-text-value pr-3">
                                                <label>{Strings.sms_template_name}</label>
                                                <span>{selectedSms ? selectedSms.temp_name : ''}</span>
                                            </div>
                                        </div>

                                        <div className="col-lg-5 col-md-12 lbr-1 vtrow-bx">
                                            <div className="view-text-value pr-3">
                                                <label>{Strings.sms_template_content}</label>
                                                <span>{selectedSms ? selectedSms.content : ''}</span>
                                            </div>
                                        </div>

                                        <div className="col-lg-3 col-md-12 vtrow-bx">
                                            <div className="view-text-value">
                                                <label>{Strings.sms_template_status}</label>
                                                <span>{selectedSms ? Boolean(selectedSms.active).toString() : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Edit */}
                    <div className="col-lg-4 col-md-12" style={{ display: this.state.displayEdit }}>
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h4 className="sf-sm-hd sf-pg-heading">{Strings.edit_sms_template_title}</h4>
                                <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                            </div>
                            <div className="sf-card-body mt-2">
                                <form onSubmit={handleSubmit(this.onSubmit)} >
                                    <div className="form-group sf-form">
                                        <div className="view-text-value pr-3">
                                            <label>{Strings.sms_template_name}</label>
                                            <span>{selectedSms ? selectedSms.temp_name : ''}</span>
                                        </div>
                                    </div>
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

                                    <div className="all-btn multibnt">
                                        <div className="btn-hs-icon d-flex justify-content-between">
                                            <button onClick={this.handleCancel} className="bnt bnt-normal" type="button">
                                                {Strings.cancel_btn}</button>
                                            <button type="submit" className="bnt bnt-active">
                                                {Strings.update_btn}</button>
                                        </div>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    var value = state.smsTemplate &&
        state.smsTemplate.smsTemplateDetails &&
        state.smsTemplate.smsTemplateDetails.find(sms => sms && sms.slug === ownProps.location.state);

    return {
        smsTemplateDetails: state.smsTemplate && state.smsTemplate.smsTemplateDetails,
        initialValues: value,
        isDirty: isDirty('viewEditSmsTemplate')(state)
    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: "viewEditSmsTemplate", validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(viewEditSmsTemplate)