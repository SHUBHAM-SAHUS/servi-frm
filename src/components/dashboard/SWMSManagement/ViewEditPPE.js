import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Icon, Dropdown, Popconfirm, notification } from "antd";
import { reduxForm, Field, FieldArray } from "redux-form";
import $ from "jquery";
import { validate } from "../../../utils/Validations/SWMSValidation";
import { customInput } from "../../common/custom-input";
import * as actions from "../../../actions/SWMSAction";
import { CustomSwitch } from "../../common/customSwitch";
import { Strings } from "../../../dataProvider/localize";
import { handleFocus, DeepTrim } from "../../../utils/common";
import UpdateSingleCategory from "./UpdateSingleCategory";
import { VALIDATE_STATUS } from "../../../dataProvider/constant";
import UpdateSinglePPE from "./UpdateSinglePPE";
const required = value => value ? undefined : "Required"

class ViewEditPPE extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cardExpnadBtn: true, inlineCat: [] };
    }

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn });
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    };

    renderMembers = ({ fields, meta: { error, submitFailed } }) => (
        <>
            {fields.length > 0 ? <div className="sf-c-table org-user-table ve-a-user-t ad-nusr-txt">
                {fields.map((member, index) => (
                    <div className="tr" key={index}>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.name`}
                                    placeholder={"PPE Name"}
                                    type="text"
                                    component={customInput}
                                    validate={required}

                                />
                            </fieldset>
                        </span>
                        <span className="td">
                            <fieldset className="sf-form">
                                <Field
                                    name={`${member}.active`}
                                    component={CustomSwitch}
                                    onChange={(val) => this.props.onChange(`ppe[${index}].active`, +val)}
                                />
                            </fieldset>
                        </span>


                        <span className="td"><button className='delete-bnt' type='button' onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></span>
                    </div>
                ))}
            </div> : null}
            <div className="btn-hs-icon sm-bnt bnt-error">
                <button className="bnt bnt-normal" type="button" onClick={() => fields.push({ active: 1 })}>
                Add New PPE</button>
                {submitFailed && error && <span className="error-input">{error}</span>}
            </div>
        </>
    )

    handleAddCategory = fromData => {
        this.props.addPPE(fromData)
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
        this.props.deletePPE({
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

    render() {
        const { handleSubmit, orgSWMS } = this.props;
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
                                    <h2 className="sf-pg-heading">PPE</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled overlay={""}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body mt-2">
                                    <div className="sf-c-table org-user-table swms-view-table">
                                        <div className="tr">
                                            <span className="th">PPE</span>
                                            <span className="th">Active</span>
                                            <span className="th"></span>
                                        </div>
                                        {orgSWMS && orgSWMS.ppes && orgSWMS.ppes.map(
                                            cat => {
                                                var inline = inlineCat.findIndex(id => id === cat.id);
                                                if (inline !== -1) {
                                                    return <UpdateSinglePPE
                                                        form={'UpdateSingleCategory' + cat.id} initialValues={cat}
                                                        removeInlineCat={this.removeInlineCat} />
                                                }
                                                return <div className="tr">
                                                    <span className="td">{cat.name}</span>
                                                    <span className="td">{(cat.active) ? "Yes" : "No"}</span>
                                                    <span className="td">
                                                        <div id="confirmPopPo">
                                                            <button className='delete-bnt' type='button' onClick={() => this.handleCatEditClick(cat)}>
                                                                <i class="material-icons">create</i>
                                                            </button>
                                                            <Popconfirm
                                                                title={"Are you sure You want to delete PPE"}
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
                                    <form onSubmit={handleSubmit(this.handleAddCategory)}>
                                        <FieldArray name="ppe" component={this.renderMembers} />
                                        {
                                            this.props.formValues && this.props.formValues.ppe && this.props.formValues.ppe.length > 0
                                                ? <div className="s-n-bnt btn-hs-icon sm-bnt ml-4">
                                                    <button type="submit" className="bnt bnt-active">
                                                        <i class="material-icons">save</i>{Strings.save_btn}</button>
                                                </div>
                                                : null
                                        }
                                    </form>
                                    {/* <div className="btn-hs-icon sm-bnt bnt-error">
                                        <button className="bnt bnt-normal" type="button">
                                            Add New Category
                                        </button>
                                    </div> */}
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
        formValues: state.form.ViewEditPPE && state.form.ViewEditPPE.values,
        orgSWMS: state.swmsReducer.orgSWMS
    };
};

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({
        form: "ViewEditPPE",
        validate,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(ViewEditPPE);
