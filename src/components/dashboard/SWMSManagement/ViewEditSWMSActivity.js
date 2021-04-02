import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Icon, Dropdown, Popconfirm, notification, Popover } from "antd";
import { reduxForm, Field, FieldArray } from "redux-form";
import $ from "jquery";
import { validate } from "../../../utils/Validations/SWMSValidation";
import { customInput } from "../../common/custom-input";
import { cutomExpandableText } from '../../common/cutomExpandableText';
import * as actions from "../../../actions/SWMSAction";
import { CustomSwitch } from "../../common/customSwitch";
import { Strings } from "../../../dataProvider/localize";
import { handleFocus, DeepTrim, calculateRisk } from "../../../utils/common";
import UpdateSingleCategory from "./UpdateSingleCategory";
import { VALIDATE_STATUS } from "../../../dataProvider/constant";
import ScrollArea from 'react-scrollbar';
import PerfectScrollbar from 'react-perfect-scrollbar';
import { CustomSelect } from "../../common/customSelect";
import { customTextarea } from "../../common/customTextarea";
import UpdateSingleActivity from "./UpdateSingleActivity";
import emailEditor from "../../common/EmailEditor";
import draftToHtml from "draftjs-to-html";
import { convertToRaw, ContentState, EditorState } from "draft-js";
import htmlToDraft from 'html-to-draftjs';
import ReactHtmlParser from 'react-html-parser';

const required = value => value ? undefined : "Required"


export const extactOptionsFroDefaults = (orgSWMS) => {
    let arrayDefaults = []
    if (orgSWMS) {
        Object.keys(orgSWMS).forEach(key => {
            if (key !== "swms" && key !== "swms_cat") {
                arrayDefaults = [...arrayDefaults, ...orgSWMS[key].map(obj => {
                    switch (key) {
                        case "ppes":
                            return ({ value: `${key}|${obj.id}`, title: `PPE|${obj.name}` });
                        case "tools":
                            return ({ value: `${key}|${obj.id}`, title: `Tool Type|${obj.name}` });
                        case "high_risk_works":
                            return ({ value: `${key}|${obj.id}`, title: ` High Risk Work|${obj.name}` });
                        case "sds":
                            return ({ value: `${key}|${obj.id}`, title: `Chemicals|${obj.name}` })
                        default:
                            break;
                    }
                })]
            }
        })
    }
    return arrayDefaults
}

export const viewDefaults = (defaultString, orgSWMS) => {
    if (defaultString && orgSWMS) {
        try {
            var defaultArray = JSON.parse(defaultString)
        } catch{
            return
        }
        // var defaultArray = defaultString.split(",")
        var returnStr = ""
        defaultArray.forEach(def => {
            var arr = def.split("|");
            switch (arr[0]) {
                case "ppes":
                    if (orgSWMS.ppes.find(ppe => ppe.id == arr[1]))
                        returnStr += "  PPE|" + orgSWMS.ppes.find(ppe => ppe.id == arr[1]).name
                    break;
                case "tools":
                    if (orgSWMS.tools.find(ppe => ppe.id == arr[1]))
                        returnStr += "  Tool Type|" + orgSWMS.tools.find(ppe => ppe.id == arr[1]).name
                    break;
                case "high_risk_works":
                    if (orgSWMS.high_risk_works.find(ppe => ppe.id == arr[1]))
                        returnStr += "  High Risk Work|" + orgSWMS.high_risk_works.find(ppe => ppe.id == arr[1]).name
                    break;
                case "sds":
                    if (orgSWMS.sds.find(ppe => ppe.id == arr[1]))
                        returnStr += "  Chemicals|" + orgSWMS.sds.find(ppe => ppe.id == arr[1]).name
                    break;
                default:
                    break;
            }
        })
        return returnStr;
    }
}

export const toDefaultArray = (defaultString) => {
    try {
        return JSON.parse(defaultString)
    } catch{
        return []
    }
}

class ViewEditSWMSActivity extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cardExpnadBtn: true, inlineCat: [] };
    }

    componentDidUpdate() {
        $(document).ready(function() {
            let adjust_size = function() {
                let $windowWidth = $(window).width();
                let $leftSliderWidths = $('.ant-layout-sider').width();
                let $winWleflSlW =  $windowWidth - $leftSliderWidths;
                let $tblScWidth = $winWleflSlW - $('.sf-searchbar').width();
                $('.swms-big-tb-scroll').css('width',($tblScWidth - 131));

            };
            adjust_size();
            $(window).resize(adjust_size);
          });
    }
    componentDidMount() {
        $(document).ready(function() {
            let adjust_size = function() {
                let $windowWidth = $(window).width();
                let $leftSliderWidths = $('.ant-layout-sider').width();
                let $winWleflSlW =  $windowWidth - $leftSliderWidths;
                let $tblScWidth = $winWleflSlW - $('.sf-searchbar').width();
                $('.swms-big-tb-scroll').css('width',($tblScWidth - 131));
            };
            adjust_size();
            $(window).resize(adjust_size);
          });
    }

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn });
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    };
    onEditorStateChange = (editorState, index, fieldName) => {
        this.props.change(`swms[${index}].${fieldName}_temp`, editorState)
        this.props.change(`swms[${index}].${fieldName}`, draftToHtml(convertToRaw(editorState.getCurrentContent())))
    };

    editorState = (value) => {
        var body = value ? value : '';

        const html = body
        const contentBlock = htmlToDraft(html);
        if (contentBlock) {
            const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks);
            const editorState = EditorState.createWithContent(contentState);
            return editorState
        }
    }

    renderMembers = ({ fields, meta: { error, submitFailed } }) => (
        <>
            {fields.length > 0 ? <div className="sf-c-table org-user-table ve-a-user-t ad-nusr-txt">
                {fields.map((member, index) => (
                    <div className="tr" key={index}>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.activity`}
                                    // placeholder={"Activity Name"}
                                    type="text"
                                    component={customInput}
                                    validate={required}

                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.swms_category_id`}
                                    type="name"
                                    options={this.props.orgSWMS.swms_cat ? this.props.orgSWMS.swms_cat.map(obj => ({ value: obj.id, title: obj.category })) : []}
                                    component={CustomSelect}
                                    dropdownMatchSelectWidth="true"
                                    validate={required}

                                />
                            </fieldset>
                        </span>

                        <span className="td">
                            <fieldset className="sf-form">
                                {/* <Field
                                    name={`${member}.hazard`}
                                    component={cutomExpandableText}
                                    validate={required}

                                /> */}
                                <Field
                                    name={`${member}.hazard_temp`}
                                    type="text"
                                    // toolbarCustomButtons={[<CustomOption />]}
                                    options={['list']}
                                    component={emailEditor}
                                    editorState={this.props.formValues && this.props.formValues.swms
                                        && this.props.formValues.swms[index]
                                        && this.props.formValues.swms[index].hazard_temp
                                        ? this.props.formValues.swms[index].hazard_temp : this.editorState()}
                                    onEditorStateChange={(editorState) => this.onEditorStateChange(editorState, index, 'hazard')}
                                    validate={required}

                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.likelihood_before_controls`}
                                    type="name"
                                    options={this.props.likelyhoodBeforeControls ? this.props.likelyhoodBeforeControls.map(obj => ({
                                        value: obj.id,
                                        title: obj.order + ". " + obj.name
                                    })) : []}
                                    component={CustomSelect}
                                    dropdownMatchSelectWidth="true"
                                    validate={required}

                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.consequence_before_controls`}
                                    type="name"
                                    options={this.props.consequenceBeforeControls ? this.props.consequenceBeforeControls.map(obj => ({
                                        value: obj.id,
                                        title: obj.order + ". " + obj.name
                                    })) : []}
                                    component={CustomSelect}
                                    dropdownMatchSelectWidth="true"
                                    validate={required}

                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <label> {calculateRisk(
                                this.props.likelyhoodBeforeControls && this.props.likelyhoodBeforeControls
                                    .find(like => like.id == (this.props.formValues.swms &&
                                        this.props.formValues.swms[index] &&
                                        this.props.formValues.swms[index].likelihood_before_controls)) ?
                                    this.props.likelyhoodBeforeControls
                                        .find(like => like.id == (this.props.formValues.swms &&
                                            this.props.formValues.swms[index] &&
                                            this.props.formValues.swms[index].likelihood_before_controls)) : null,
                                this.props.consequenceBeforeControls && this.props.consequenceBeforeControls
                                    .find(conse => conse.id == (this.props.formValues.swms &&
                                        this.props.formValues.swms[index] &&
                                        this.props.formValues.swms[index].consequence_before_controls)) ?
                                    this.props.consequenceBeforeControls
                                        .find(conse => conse.id == (this.props.formValues.swms &&
                                            this.props.formValues.swms[index] &&
                                            this.props.formValues.swms[index].consequence_before_controls)) : null
                            )}</label>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                {/* <Field
                                    name={`${member}.control_measures`}
                                    component={cutomExpandableText}
                                    validate={required}

                                /> */}
                                <Field
                                    name={`${member}.control_measures_temp`}
                                    type="text"
                                    // toolbarCustomButtons={[<CustomOption />]}
                                    options={['list']}
                                    component={emailEditor}
                                    editorState={this.props.formValues && this.props.formValues.swms
                                        && this.props.formValues.swms[index]
                                        && this.props.formValues.swms[index].control_measures_temp
                                        ? this.props.formValues.swms[index].control_measures_temp : this.editorState()}
                                    onEditorStateChange={(editorState) => this.onEditorStateChange(
                                        editorState, index, 'control_measures')}
                                    validate={required}

                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.likelihood_after_controls`}
                                    type="name"
                                    options={this.props.likelyhoodBeforeControls ? this.props.likelyhoodBeforeControls.map(obj => ({
                                        value: obj.id,
                                        title: obj.order + ". " + obj.name
                                    })) : []}
                                    component={CustomSelect}
                                    dropdownMatchSelectWidth="true"
                                    validate={required}

                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.consequence_after_controls`}
                                    type="name"
                                    options={this.props.consequenceBeforeControls ? this.props.consequenceBeforeControls.map(obj => ({
                                        value: obj.id,
                                        title: obj.order + ". " + obj.name
                                    })) : []}
                                    component={CustomSelect}
                                    dropdownMatchSelectWidth="true"
                                    validate={required}

                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <label>{calculateRisk(
                                this.props.likelyhoodBeforeControls && this.props.likelyhoodBeforeControls
                                    .find(like => like.id == (this.props.formValues.swms &&
                                        this.props.formValues.swms[index] &&
                                        this.props.formValues.swms[index].likelihood_after_controls)) ?
                                    this.props.likelyhoodBeforeControls
                                        .find(like => like.id == (this.props.formValues.swms &&
                                            this.props.formValues.swms[index] &&
                                            this.props.formValues.swms[index].likelihood_after_controls)) : null,
                                this.props.consequenceBeforeControls && this.props.consequenceBeforeControls
                                    .find(conse => conse.id == (this.props.formValues.swms &&
                                        this.props.formValues.swms[index] &&
                                        this.props.formValues.swms[index].consequence_after_controls)) ?
                                    this.props.consequenceBeforeControls
                                        .find(conse => conse.id == (this.props.formValues.swms &&
                                            this.props.formValues.swms[index] &&
                                            this.props.formValues.swms[index].consequence_after_controls)) : null
                            )}</label>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.person_responsible`}
                                    type="name"
                                    component={customInput}
                                    validate={required}

                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form defaults-activity autohtxtbox">
                                <Field
                                    name={`${member}.defaults`}
                                    mode="multiple"
                                    options={extactOptionsFroDefaults(this.props.orgSWMS)}
                                    component={CustomSelect} dropdownMatchSelectWidth="true" />
                            </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.active`}
                                    component={CustomSwitch}
                                    onChange={(val) => this.props.onChange(`swms_category[${index}].active`, +val)}
                                />
                            </fieldset>
                        </span>
                        <span className="td"><button className='delete-bnt' type='button' onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></span>
                    </div>
                ))}
            </div> : null}
            <div className="btn-hs-icon sm-bnt bnt-error">

                {submitFailed && error && <span className="error-input">{error}</span>}
            </div>
        </>
    )



    handleAddCategory = fromData => {
        this.props.addSWMS(fromData)
            .then((flag) => {
                this.props.reset();
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

    removeInlineCat = (cat) => {
        var { inlineCat } = this.state
        var index = inlineCat.findIndex(id => id === cat.id)
        if (index != -1) {
            inlineCat.splice(index, 1);
        }
        this.setState({ inlineCat })
    }

    handleCatEditClick = (cat) => {
        var { inlineCat } = this.state
        inlineCat.push(cat.id);
        this.setState({ inlineCat })
    }

    handdleDeleteCatClick = cat => {
        this.props.deleteswmsActivity({
            id: cat.id
        }).then(message => {
            notification.success({
                message: Strings.success_title,
                description: message,
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
    componentDidUpdate() {
        console.dir(this.ref);
    }
    ref = React.createRef();


    render() {
        const { handleSubmit, orgSWMS, likelyhoodBeforeControls, consequenceBeforeControls, formValues } = this.props;
        const { inlineCat } = this.state
        return (
            <div
                className={"col-md-10"}
            >
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <div className="sf-card-wrap">
                            {/* zoom button  */}
                            <div className="card-expands">
                                <button
                                    type="button"
                                    onClick={this.handleExpand}
                                    className="exapnd-bnt normal-bnt"
                                >
                                    <Icon
                                        type={
                                            this.state.cardExpnadBtn
                                                ? "fullscreen"
                                                : "fullscreen-exit"
                                        }
                                    />
                                </button>
                            </div>

                            {/* SWMS Category */}
                            <div className="sf-card mb-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <div className="d-flex align-items-center"><h2 className="sf-pg-heading">SWMS Activity</h2>
                                        <div className="btn-hs-icon sm-bnt bnt-error"><button className="bnt bnt-normal ml-2" type="button" onClick={() => {
                                            const swms = formValues && formValues.swms ? formValues.swms : [];
                                            swms.push({ active: 1, defaults: [] });
                                            this.props.change("swms", swms);
                                        }
                                        }>
                                            Add New Activity</button></div></div>
                                    <div className="info-btn disable-dot-menu">
                                        <Popover className="swms-popup-dtl"
                                            content={(
                                                <img className="risk-asses-img" src="/images/risk_assesment.png" />
                                            )}
                                            placement="topRight"
                                            overlayClassName="swms-act-popup"
                                            title="Risk Assesment">
                                            <strong className="more-info">
                                                <i class="material-icons swms-info-size">info</i></strong></Popover>

                                        <Dropdown className="more-info" disabled overlay={""}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body mt-2">
                                    {/* <PerfectScrollbar className="sf-ps-scroll" onScrollX> */}

                                    <div className="swms-big-tb-scroll">
                                        <div className="sf-c-table org-user-table swms-view-table">
                                            <div className="tr">
                                                <span className="th">Activity</span>
                                                <span className="th">Category</span>
                                                <span className="th">Potential Safety Environment Hazards</span>
                                                <span className="th">Likelihood (before controls) </span>
                                                <span className="th">Consequence (before controls)</span>
                                                <span className="th">Risk Rating (before controls) </span>
                                                <span className="th">Control Measures</span>
                                                <span className="th">Likelihood (after controls) </span>
                                                <span className="th">Consequence (after controls)</span>
                                                <span className="th">Risk Rating (after controls)</span>
                                                <span className="th">Person Responsible</span>
                                                <span className="th">Defaults</span>
                                                <span className="th">Active</span>
                                                <span className="th"></span>
                                            </div>
                                        </div>
                                        <form onSubmit={handleSubmit(this.handleAddCategory)}>
                                            <FieldArray name="swms" component={this.renderMembers} />
                                            {
                                                this.props.formValues && this.props.formValues.swms && this.props.formValues.swms.length > 0
                                                    ? <div className="s-n-bnt btn-hs-icon sm-bnt ml-4">
                                                        <button type="submit" className="bnt bnt-active">
                                                            <i class="material-icons">save</i>{Strings.save_btn}</button>
                                                    </div>
                                                    : null
                                            }
                                        </form>
                                        <div className="sf-c-table org-user-table swms-view-table">

                                            {orgSWMS && orgSWMS.swms && orgSWMS.swms.map(
                                                cat => {
                                                    var inline = inlineCat.findIndex(id => id === cat.id);
                                                    if (inline !== -1) {
                                                        return <UpdateSingleActivity
                                                            form={'UpdateSingleActivity' + cat.id}
                                                            initialValues={{ ...cat, defaults: cat.defaults ? toDefaultArray(cat.defaults) : [] }}
                                                            removeInlineCat={this.removeInlineCat} />
                                                    }
                                                    return <div className="tr">
                                                        <span className="td">{cat.activity}</span>
                                                        <span className="td">{cat.swms_category_id && orgSWMS.swms_cat &&
                                                            orgSWMS.swms_cat.find(cate => cate.id == cat.swms_category_id)
                                                            ? orgSWMS.swms_cat.find(cate => cate.id == cat.swms_category_id).category :
                                                            'Uncategorised'}</span>
                                                        <span className="td dynamic-html-cnt">{cat.hazard && ReactHtmlParser(cat.hazard)}</span>
                                                        <span className="td">{likelyhoodBeforeControls && likelyhoodBeforeControls
                                                            .find(like => like.id == cat.likelihood_before_controls) ?
                                                            likelyhoodBeforeControls
                                                                .find(like => like.id == cat.likelihood_before_controls).order + ". " +
                                                            likelyhoodBeforeControls
                                                                .find(like => like.id == cat.likelihood_before_controls).name : null}
                                                        </span>
                                                        <span className="td">{consequenceBeforeControls && consequenceBeforeControls
                                                            .find(conse => conse.id == cat.consequence_before_controls) ?
                                                            consequenceBeforeControls
                                                                .find(conse => conse.id == cat.consequence_before_controls).order + ". " +
                                                            consequenceBeforeControls
                                                                .find(conse => conse.id == cat.consequence_before_controls).name : null}
                                                        </span>

                                                        <span className="td">{calculateRisk(
                                                            likelyhoodBeforeControls && likelyhoodBeforeControls
                                                                .find(like => like.id == cat.likelihood_before_controls) ?
                                                                likelyhoodBeforeControls
                                                                    .find(like => like.id == cat.likelihood_before_controls) : null,
                                                            consequenceBeforeControls && consequenceBeforeControls
                                                                .find(conse => conse.id == cat.consequence_before_controls) ?
                                                                consequenceBeforeControls
                                                                    .find(conse => conse.id == cat.consequence_before_controls) : null
                                                        )}</span>
                                                        <span className="td dynamic-html-cnt">{cat.control_measures && ReactHtmlParser(cat.control_measures)}</span>
                                                        <span className="td">{
                                                            likelyhoodBeforeControls && likelyhoodBeforeControls
                                                                .find(like => like.id == cat.likelihood_after_controls) ?
                                                                likelyhoodBeforeControls
                                                                    .find(like => like.id == cat.likelihood_after_controls).order + ". " +
                                                                likelyhoodBeforeControls
                                                                    .find(like => like.id == cat.likelihood_after_controls).name : null}
                                                        </span>
                                                        <span className="td">{
                                                            consequenceBeforeControls && consequenceBeforeControls
                                                                .find(conse => conse.id == cat.consequence_after_controls) ?
                                                                consequenceBeforeControls
                                                                    .find(conse => conse.id == cat.consequence_after_controls).order + ". " +
                                                                consequenceBeforeControls
                                                                    .find(conse => conse.id == cat.consequence_after_controls).name : null
                                                        }</span>
                                                        <span className="td">{calculateRisk(
                                                            likelyhoodBeforeControls && likelyhoodBeforeControls
                                                                .find(like => like.id == cat.likelihood_after_controls) ?
                                                                likelyhoodBeforeControls
                                                                    .find(like => like.id == cat.likelihood_after_controls) : null,
                                                            consequenceBeforeControls && consequenceBeforeControls
                                                                .find(conse => conse.id == cat.consequence_after_controls) ?
                                                                consequenceBeforeControls
                                                                    .find(conse => conse.id == cat.consequence_after_controls) : null
                                                        )}</span>
                                                        <span className="td">{cat.person_responsible}</span>
                                                        <span className="td">{viewDefaults(cat.defaults, orgSWMS)}</span>
                                                        <span className="td">{(cat.active) ? "Yes" : "No"}</span>
                                                        <span className="td">
                                                            <div id="confirmPopPo">
                                                                <button className='delete-bnt' type='button' onClick={() => this.handleCatEditClick(cat)}>
                                                                    <i class="material-icons">create</i>
                                                                </button>
                                                                <Popconfirm
                                                                    title={"Are you sure You want to delete Activity"}
                                                                    onConfirm={() => this.handdleDeleteCatClick(cat)}
                                                                    placement="topRight"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                    className="delete-bnt"
                                                                    getPopupContainer={() => document.getElementById('confirmPopPo')}
                                                                >
                                                                    <button className='delete-bnt' userId={cat.id}>
                                                                        <i class="fa fa-trash-o"></i>
                                                                    </button>
                                                                </Popconfirm>
                                                            </div>
                                                        </span>
                                                    </div>
                                                })}
                                        </div>



                                    </div>
                                    {/* </PerfectScrollbar> */}

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        formValues: state.form.ViewEditSWMSActivity && state.form.ViewEditSWMSActivity.values,
        orgSWMS: state.swmsReducer.orgSWMS,
        likelyhoodBeforeControls: state.likelyhoodBeforeControl.likelyhoodBeforeControls,
        consequenceBeforeControls: state.beforeConsequenceControl && state.beforeConsequenceControl.consequenceBeforeControls,
    };
};

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({
        form: "ViewEditSWMSActivity",
        validate,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(ViewEditSWMSActivity);
