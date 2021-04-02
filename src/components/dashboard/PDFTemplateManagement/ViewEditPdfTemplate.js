import React from 'react';
import {
    Icon,
    Menu,
    Dropdown,
    Modal,
    message,
    notification
} from 'antd';
import $ from 'jquery';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { validate } from '../../../utils/Validations/pdfTemplateValidation';
import { customInput } from '../../common/custom-input';
import { CustomSwitch } from '../../common/customSwitch';
import * as actions from '../../../actions/pdfTemplateActions';
import { Strings } from '../../../dataProvider/localize';
import { customTextarea } from '../../common/customTextarea';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
import { handleFocus, DeepTrim } from '../../../utils/common';
class ViewEditPdfTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = { displayEdit: 'none', cardExpnadBtn: true }
    }

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);

        formData.template_status = +formData.template_status;
        // formData = { ...formData, org_id: 0 }
        console.log(formData)
        this.props.updatePdfTemplate(formData).then((flag) => {
            this.handleCancel();
            this.getPdfTemplateDatail();
            notification.success({
                message: Strings.success_title,
                description: flag,
                onClick: () => { },
                className: 'ant-success'
            })
        }).catch((message) => {
            notification.error({
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
            });
        });
    }

    componentDidMount() {
        this.getPdfTemplateDatail();
    }

    componentDidUpdate(prevProps, prevState) {
        if (prevProps.location.state !== this.props.location.state) {
            this.getPdfTemplateDatail();
        }

    }

    getPdfTemplateDatail = () => {
        this.props.getPdfTemplateDatail(this.props.location.state)
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
        var selectedTemplate = this.props.pdfTemplateDetail.find(pdf => pdf.slug === this.props.location.state)

        var menu = (<Menu>
            <Menu.Item onClick={this.handleEditClick}>
                {Strings.edit_template_btn}
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
                                    <h2 className="sf-pg-heading">{Strings.pdf_template_details}</h2>
                                    <div className="info-btn">
                                        {/* Drop down for card */}
                                        <Dropdown className="more-info" overlay={menu}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                        {/*Drop down*/}
                                    </div>
                                </div>

                                <div className="sf-card-body mt-2">

                                    <div className="data-v-row">
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.pdf_template_name}</label>
                                                <span>{selectedTemplate ? selectedTemplate.template_name : ''}</span>
                                            </div>
                                        </div>

                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.pdf_content}</label>
                                                <span>{selectedTemplate ? selectedTemplate.content : ''}</span>
                                            </div>
                                        </div>

                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{Strings.pdf_template_status}</label>
                                                <span>{selectedTemplate ? Boolean(selectedTemplate.template_status).toString() : ''}</span>
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
                                <h4 className="sf-sm-hd sf-pg-heading">{Strings.edit_pdf_template_btn}</h4>
                                <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                            </div>
                            <div className="sf-card-body mt-2">
                                <form onSubmit={handleSubmit(this.onSubmit)} >

                                    <div className="data-v-col">
                                        <div className="view-text-value">
                                            <label>{Strings.pdf_template_name}</label>
                                            <span>{selectedTemplate ? selectedTemplate.template_name : ''}</span>
                                        </div>
                                    </div>
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

                                    <div className="all-btn multibnt">
                                        <div className="btn-hs-icon d-flex justify-content-between">
                                            <button onClick={this.handleCancel} className="bnt bnt-normal" type="button">
                                                {Strings.cancel_btn}</button>
                                            <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
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
    var value = state.pdfTemplate
        && state.pdfTemplate.pdfTemplateDetail
        && state.pdfTemplate.pdfTemplateDetail.length > 0
        && state.pdfTemplate.pdfTemplateDetail.find(pdf => pdf.slug === ownProps.location.state);
    return {
        pdfTemplateDetail: state.pdfTemplate && state.pdfTemplate.pdfTemplateDetail,
        initialValues: value,
        isDirty: isDirty('ViewEditPdfTemplate')(state)
    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({ form: "ViewEditPdfTemplate", validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(ViewEditPdfTemplate)