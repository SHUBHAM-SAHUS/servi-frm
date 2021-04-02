import React from "react";
import { connect } from "react-redux";
import { compose } from "redux";
import { Icon, Dropdown, Popconfirm, notification, Drawer } from "antd";
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
import { customTextarea } from "../../common/customTextarea";
import UpdateToolBoxItems from "./UpdateToolBoxItems";
import ViewEditToolBoxTalkItem from "./ViewEditToolBoxTalkItem";
import AddNewToolboxTalk from "./AddNewToolboxTalk";
const required = value => value ? undefined : "Required"

class ViewEditToolBoxTalk extends React.Component {
    constructor(props) {
        super(props);
        this.state = { cardExpnadBtn: true, toolboxTalk: {}, drawerVisible: false };
    }
    showDrawer = () => {
        this.setState({
            toolboxTalk: {},
            drawerVisible: true,
        });
    };

    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    };
    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn });
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    };



    handdleDeleteCatClick = cat => {
        this.props.deleteToolbox({
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

    handleCatEditClick = (toolboxTalk) => {
        this.setState({ toolboxTalk, drawerVisible: true })

    }



    render() {
        const { orgSWMS } = this.props;
        const { toolboxTalk } = this.state
        return (
            <div
                className={"col-md-10"}
            >
                {this.state.drawerVisible ? <Drawer
                    className="toolbox-talk-drawer"
                    width={"80%"}
                    onClose={this.onClose}
                    visible={this.state.drawerVisible}>
                    <AddNewToolboxTalk
                        initialValues={{ ...toolboxTalk, toolbox_talk_item_temp: toolboxTalk.toolbox_talk_item, toolbox_talk_item: [] }}
                        onClose={this.onClose} />
                </Drawer> : null}
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
                                    <h2 className="sf-pg-heading">Toolbox Talk</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled overlay={""}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body mt-2">
                                    <div className="sf-c-table org-user-table swms-view-table">
                                        <div className="tr">
                                            <span className="th">Toolbox Talk Name </span>
                                            <span className="th">Number of items </span>
                                            <span className="th"></span>
                                        </div>
                                        {orgSWMS && orgSWMS.map(
                                            cat => {
                                                return <div className="tr">
                                                    <span className="td">{cat.toolbox_name}</span>
                                                    <span className="td">{cat.toolbox_talk_item && cat.toolbox_talk_item.length}</span>

                                                    <span className="td">
                                                        <div id="confirmPopPo">
                                                            <button className='delete-bnt' type='button' onClick={() => this.handleCatEditClick(cat)}>
                                                                <i class="material-icons">create</i>
                                                            </button>
                                                            <Popconfirm
                                                                title={"Are you sure You want to delete Toolbox talk"}
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
                                    <div className="btn-hs-icon sm-bnt bnt-error">
                                        <button className="bnt bnt-normal" onClick={this.showDrawer} type="button">Add New Toolbox Talk</button>
                                    </div>


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
        formValues: state.form.ViewEditToolTalkItem && state.form.ViewEditToolTalkItem.values,
        orgSWMS: state.swmsReducer.toolboxTalk
    };
};

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({
        form: "ViewEditToolBoxTalk",
        validate,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(ViewEditToolBoxTalk);
