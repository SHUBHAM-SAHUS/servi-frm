import React from 'react';
import {
    Icon,
    Menu,
    Dropdown,
    Modal,
    notification,
    Drawer,
    Button
} from 'antd';
import $ from 'jquery';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose } from 'redux';
import AddNewToolboxTalk from './AddNewToolboxTalk';
import { validate } from '../../../utils/Validations/industryValidation';
import { customInput } from '../../common/custom-input';
import { CustomSwitch } from '../../common/customSwitch';
import * as actions from '../../../actions/industryManagementAction';
import { Strings } from '../../../dataProvider/localize';
import { handleFocus, DeepTrim } from '../../../utils/common';
import ScrollArea from 'react-scrollbar';
import PerfectScrollbar from 'react-perfect-scrollbar';

class EditSWMSManagement extends React.Component {
    constructor(props) {
        super(props);
        this.state = { displayEdit: 'none', cardExpnadBtn: true, drawerVisible: false }
    }

    // Drawer
    showDrawer = () => {
        this.setState({
            drawerVisible: true,
        });
    };

    onClose = () => {
        this.setState({
            drawerVisible: false,
        });
    };

    onSubmit = async formData => {
        formData = await DeepTrim(formData);

        formData.active = +formData.active;
        this.props.updateIndustry(formData).then((flag) => {
            this.handleCancel();
        }).catch((message) => {
            notification.error({
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
            });
        });
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
        var selectedIndustry = this.props.industries.find(industry => industry.id === this.props.location.state)

        var menu = (<Menu>
            <Menu.Item onClick={this.handleEditClick}>
                {Strings.menu_industry_edit}
            </Menu.Item>
        </Menu>);

        return (
            <div className={this.props.togleSearch ? "col-md-9" : "col-md-9 col-md-srch"}>
                <div className="row">
                    <div className="col-md-12 mb-4">
                        <div className="sf-card-wrap">
                            {/* zoom button  */}
                            <div className="card-expands">
                                <button type="button" onClick={this.handleExpand} className="exapnd-bnt normal-bnt">
                                    <Icon type={this.state.cardExpnadBtn ? "fullscreen" : "fullscreen-exit"} /></button>
                            </div>

                            {/* SWMS Category */}
                            <div className="sf-card mb-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">SWMS Category</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled overlay={''}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body mt-2">
                                    <div className="sf-c-table org-user-table swms-view-table">
                                        <div className="tr">
                                            <span className="th">Category</span>
                                            <span className="th">Active</span>
                                            <span className="th"></span>
                                        </div>
                                        <div className="tr">
                                            <span className="td">Mark</span>
                                            <span className="td">True</span>
                                            <span className="td">
                                                <div id="confirmPopPo">
                                                    <button className="delete-bnt" type="button">
                                                        <i className="material-icons">create</i></button>
                                                    <button className="delete-bnt delete-bnt" userid="4">
                                                        <i className="fa fa-trash-o"></i></button>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="btn-hs-icon sm-bnt bnt-error">
                                        <button className="bnt bnt-normal" type="button">Add New Category</button>
                                    </div>
                                </div>
                            </div>

                            {/* SWMS Activity */}
                            <div className="sf-card mb-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">SWMS Activity</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled overlay={''}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body mt-2">
                                    {/* <ScrollArea speed={0.8} smoothScrolling={true} className="swms-table-scroll"> */}
                                    <PerfectScrollbar className="sf-ps-scroll" onScrollX>
                                        <div className="swms-table-scroll">
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
                                                <div className="tr">
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">Some Text</span>
                                                    <span className="td">True</span>
                                                    <span className="td">
                                                        <div id="confirmPopPo">
                                                            <button className="delete-bnt" type="button">
                                                                <i className="material-icons">create</i></button>
                                                            <button className="delete-bnt delete-bnt" userid="4">
                                                                <i className="fa fa-trash-o"></i></button>
                                                        </div>
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </PerfectScrollbar>
                                    <div className="btn-hs-icon sm-bnt bnt-error">
                                        <button className="bnt bnt-normal" type="button">Add New Activity</button>
                                    </div>
                                </div>
                            </div>

                            {/* PPE */}
                            <div className="sf-card mb-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">PPE</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled overlay={''}>
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
                                        <div className="tr">
                                            <span className="td">Some Text</span>
                                            <span className="td">True</span>
                                            <span className="td">
                                                <div id="confirmPopPo">
                                                    <button className="delete-bnt" type="button">
                                                        <i className="material-icons">create</i></button>
                                                    <button className="delete-bnt delete-bnt" userid="4">
                                                        <i className="fa fa-trash-o"></i></button>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="btn-hs-icon sm-bnt bnt-error">
                                        <button className="bnt bnt-normal" type="button">Add New PPE</button>
                                    </div>
                                </div>
                            </div>

                            {/* Tool Type */}
                            <div className="sf-card mb-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">Tool Type</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled overlay={''}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body mt-2">
                                    <div className="sf-c-table org-user-table swms-view-table">
                                        <div className="tr">
                                            <span className="th">Tool Name</span>
                                            <span className="th">Defaults</span>
                                            <span className="th">Active</span>
                                            <span className="th"></span>
                                        </div>
                                        <div className="tr">
                                            <span className="td">Some Text</span>
                                            <span className="td">Some Text</span>
                                            <span className="td">True</span>
                                            <span className="td">
                                                <div id="confirmPopPo">
                                                    <button className="delete-bnt" type="button">
                                                        <i className="material-icons">create</i></button>
                                                    <button className="delete-bnt delete-bnt" userid="4">
                                                        <i className="fa fa-trash-o"></i></button>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="btn-hs-icon sm-bnt bnt-error">
                                        <button className="bnt bnt-normal" type="button">Add New Tool Type</button>
                                    </div>
                                </div>
                            </div>

                            {/* Chemicals */}
                            <div className="sf-card mb-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">Chemicals</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled overlay={''}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body mt-2">
                                    <div className="sf-c-table org-user-table swms-view-table">
                                        <div className="tr">
                                            <span className="th">Chemical Name</span>
                                            <span className="th">Document </span>
                                            <span className="th">Expiry </span>
                                            <span className="th">Defaults </span>
                                            <span className="th">Active</span>
                                            <span className="th"></span>
                                        </div>
                                        <div className="tr">
                                            <span className="td">Some Text</span>
                                            <span className="td">Some Text</span>
                                            <span className="td">Some Text</span>
                                            <span className="td">Some Text</span>
                                            <span className="td">True</span>
                                            <span className="td">
                                                <div id="confirmPopPo">
                                                    <button className="delete-bnt" type="button">
                                                        <i className="material-icons">create</i></button>
                                                    <button className="delete-bnt delete-bnt" userid="4">
                                                        <i className="fa fa-trash-o"></i></button>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="btn-hs-icon sm-bnt bnt-error">
                                        <button className="bnt bnt-normal" type="button">Add New Chemicals</button>
                                    </div>
                                </div>
                            </div>

                            {/* Toolbox Talk Items */}
                            <div className="sf-card mb-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">Toolbox Talk Items</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled overlay={''}>
                                            <i className="material-icons">more_vert</i>
                                        </Dropdown>
                                    </div>
                                </div>
                                <div className="sf-card-body mt-2">
                                    <div className="sf-c-table org-user-table swms-view-table">
                                        <div className="tr">
                                            <span className="th">Toolbox Talk Item Name</span>
                                            <span className="th">Comment </span>
                                            <span className="th">Active</span>
                                            <span className="th"></span>
                                        </div>
                                        <div className="tr">
                                            <span className="td">Some Text</span>
                                            <span className="td">Some Text</span>
                                            <span className="td">True</span>
                                            <span className="td">
                                                <div id="confirmPopPo">
                                                    <button className="delete-bnt" type="button">
                                                        <i className="material-icons">create</i></button>
                                                    <button className="delete-bnt delete-bnt" userid="4">
                                                        <i className="fa fa-trash-o"></i></button>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="btn-hs-icon sm-bnt bnt-error">
                                        <button className="bnt bnt-normal" type="button">Add New Toolbox Talk Items</button>
                                    </div>
                                </div>
                            </div>

                            {/* Toolbox Talk  */}
                            <div className="sf-card mb-4">
                                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                    <h2 className="sf-pg-heading">Toolbox Talk</h2>
                                    <div className="info-btn disable-dot-menu">
                                        <Dropdown className="more-info" disabled overlay={''}>
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
                                        <div className="tr">
                                            <span className="td">Some Text</span>
                                            <span className="td">20</span>
                                            <span className="td">
                                                <div id="confirmPopPo">
                                                    <button className="delete-bnt" type="button">
                                                        <i className="material-icons">create</i></button>
                                                    <button className="delete-bnt delete-bnt" userid="4">
                                                        <i className="fa fa-trash-o"></i></button>
                                                </div>
                                            </span>
                                        </div>
                                    </div>
                                    <div className="btn-hs-icon sm-bnt bnt-error">
                                        <button className="bnt bnt-normal" onClick={this.showDrawer} type="button">Add New Toolbox Talk</button>
                                    </div>
                                </div>
                            </div>
                            <Drawer
                                className="toolbox-talk-drawer"
                                width={"80%"}
                                onClose={this.onClose}
                                visible={this.state.drawerVisible}>
                                <AddNewToolboxTalk />
                            </Drawer>

                        </div>
                    </div>

                    {/* Edit -- can be delete*/}
                    <div className="col-lg-4 col-md-12" style={{ display: this.state.displayEdit }}>
                        <div className="sf-card">
                            <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                <h4 className="sf-sm-hd sf-pg-heading">{Strings.edit_industry_details_title}</h4>
                                <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
                            </div>
                            <div className="sf-card-body mt-2">
                                <form onSubmit={handleSubmit(this.onSubmit)} >
                                    <fieldset className="form-group sf-form">
                                        <Field
                                            label={Strings.industry_name}
                                            name="industry_name"
                                            type="name"
                                            id="industry_name"
                                            component={customInput} />
                                    </fieldset>

                                    <fieldset className="form-group sf-form">
                                        <Field
                                            name="active"
                                            id="active"
                                            label={Strings.industry_status}
                                            component={CustomSwitch} />
                                    </fieldset>

                                    <div className="all-btn multibnt">
                                        <div className="btn-hs-icon d-flex justify-content-between">
                                            <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
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
    var value = state.industryManagement.industries.find(industry => industry.id === ownProps.location.state);
    return {
        industries: state.industryManagement.industries,
        initialValues: value,
        isDirty: isDirty('editIndustry')(state),
    }
}

export default compose(
    connect(mapStateToProps, actions),
    reduxForm({
        form: "editIndustry", validate: validate, enableReinitialize: true, onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(EditSWMSManagement)


