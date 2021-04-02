import React from 'react';
import { Icon, Progress, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { getFormMeta, getFormSyncErrors } from 'redux-form';
import * as actions from '../../../actions/organizationAction';
import { Route, Link } from 'react-router-dom';
import ServiceAgentSearch from './ServiceAgentSearch';
import AddServiceAgent from './AddServiceAgent';
import ViewEditServiceAgent from './ViewEditServiceAgent';
import { Strings } from '../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../dataProvider/constant';
import { getStorage, setStorage } from '../../../utils/common';
import { goBack } from '../../../utils/common';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
const mapRouteToTitle = {
    '/dashboard/serviceagent/createServiceAgent': Strings.new_service_agent
}

class ServiceAgent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            togleSearch: true,
            subscriptLevelSection: false,
            serviceIndsSection: false,
            orgDetailsSection: false,
            orgUserSection: false,
            formCompletion: 0
        }
        this.props.initServiceAgentList()
            .then(flag => {
                if (this.permissions.sf_create_service_agent !== -1) {
                    if (this.props.location.state && this.props.location.state.fromLink)
                        this.createSAHandler();
                }
            })
            .catch((message) => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }

    createSAHandler = () => {
        this.props.history.push(this.props.match.path + '/createServiceAgent')

    }

    handleSearchToggle = () => {
        this.setState({ togleSearch: !this.state.togleSearch })
    }

    componentWillReceiveProps(props) {
        if (this.props.location.pathname.includes("/createServiceAgent")) {
            if (props.formValues && props.formValues.values) {
                var organization = this.props.otherServiceAgents.find(agent => agent.id == props.formValues.values.name);
            }
            if (organization) {
                this.state.orgDetailsSection = this.state.subscriptLevelSection = this.state.orgUserSection = this.state.serviceIndsSection = true;
                this.state.formCompletion = 100;
            } else {
                this.state.orgDetailsSection = this.state.subscriptLevelSection = this.state.orgUserSection = this.state.serviceIndsSection = false;
                this.state.formCompletion = 0;
                var values = {}
                var formErrors = {}

                if (props.formValues && props.formValues.values) {
                    values = props.formValues.values;
                    formErrors = props.formSyncErrors;
                }
                if (values.name && values.email_address && values.phone_number && values.primary_person && values.notification_email && !formErrors.name && !formErrors.email_address && !formErrors.phone_number && !formErrors.primary_person && !formErrors.notification_email) {
                    this.state.orgDetailsSection = true;
                }
                if (values.org_industries && values.org_industries[0] && values.org_industries[0].hasOwnProperty('industry_id')) {
                    this.state.serviceIndsSection = true;
                }
                // if (values.subscription_id) {
                //     this.state.subscriptLevelSection = true;
                // }
                if (values.org_users && values.org_users.length > 0 && Object.keys(values.org_users[0]).length === 5) {
                    this.state.orgUserSection = true;
                }
                var percentageValues = Object.keys(values)
                    .filter(key => (key === 'org_industries' && values.org_industries[0]
                        && values.org_industries[0].hasOwnProperty('industry_id'))
                        || ((key === 'name' && !formErrors.name) || (key === 'email_address' && !formErrors.email_address) || (key === 'phone_number' && !formErrors.phone_number) || (key === 'primary_person' && !formErrors.primary_person) || (key === 'notification_email' && !formErrors.notification_email))
                        || (key === 'org_users' && (values.org_users[0] && Object.keys(values.org_users[0]).length === 5))
                    ); //|| (key === 'subscription_id')
                this.state.formCompletion = Math.round((percentageValues.length / 7) * 100);
            }
        } else if (this.props.location.pathname.includes("/showServiceAgent") && props.viewFormInitial && props.viewFormInitial.id) {
            var serviceAgent = props.serviceAgents.find(organ => organ.id === props.viewFormInitial.id)
            if (serviceAgent) {
                this.state.orgDetailsSection = this.state.subscriptLevelSection = this.state.orgUserSection = true;
                this.state.serviceIndsSection = false;
                this.state.formCompletion = 86;
                if (serviceAgent.org_industries && serviceAgent.org_industries.length > 0) {
                    this.state.serviceIndsSection = true;
                    this.state.formCompletion = 100;
                } else if (props.viewFormValues.org_industries && props.viewFormValues.org_industries.length > 0) {
                    this.state.serviceIndsSection = true;
                    this.state.formCompletion = 100;
                }
            }
        }
    }
    saAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["ServiceAgent"].permissions;
    permissions = {
        sf_list_service_agent: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_list_service_agent'),
        sf_create_service_agent: this.saAccessControl.findIndex(acess => acess.control_name === 'sf_create_service_agent'),
    }
    render() {


        return (
            <div>
                {/* inner header  */}
                <div className="dash-header">
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() => goBack(this.props)} />
                        {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : Strings.new_service_agent}
                    </h2>
                    <div className={"sf-steps-status"} >
                        <div className="sf-steps-row">
                            <div className={this.state.orgDetailsSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i class="material-icons">person</i></div>
                                <span>{Strings.org_wizard_detail}</span>
                            </div>
                            <div className={this.state.serviceIndsSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i class="material-icons">people</i></div>
                                <span>{Strings.org_wizard_industries}</span>
                            </div>
                            <div className={this.state.orgUserSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i class="material-icons">people</i></div>
                                <span>{Strings.org_wizard_user}</span>
                            </div>
                            {/* <div className={this.state.subscriptLevelSection ? "sf-st-item active" : "sf-st-item"}>
                                <div className="iconbx">
                                    <i class="material-icons">format_paint</i></div>
                                <span>{Strings.org_wizard_sub}</span>
                            </div> */}
                        </div>
                        <div className="sf-st-item sf-prog">
                            <Progress type="circle" strokeColor={'#03a791'} width={40} strokeWidth={12} percent={Math.round(this.state.formCompletion)} format={
                                (percent) => percent + '%'} />
                            <span>{Strings.org_wizard_progress}</span>
                        </div>
                    </div>
                    <div class="oh-cont">
                        {this.permissions.sf_create_service_agent !== -1 ?
                            <button className="bnt bnt-active" onClick={this.createSAHandler}>{Strings.sa_add_btn}</button> : null}
                    </div>
                </div>
                {/* inner header  */}
                <div className="main-container">
                    <div className="row">
                        {/* Left section */}
                        {
                            this.permissions.sf_list_service_agent !== -1
                                ? <ServiceAgentSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} />
                                : null
                        }
                        {/* center section  */}
                        <Route
                            path={this.props.match.path + '/showServiceAgent'}
                            render={(props) => <ViewEditServiceAgent {...props} togleSearch={this.state.togleSearch} />} />
                        <Route path={this.props.match.path + '/createServiceAgent'}
                            render={(props) => <AddServiceAgent {...props} togleSearch={this.state.togleSearch} />} />
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        serviceAgents: state.organization.serviceAgents,
        formValues: state.form.addServiceAgent,
        otherServiceAgents: state.organization.otherServiceAgents,
        metaForm: getFormMeta('addServiceAgent')(state),
        formSyncErrors: getFormSyncErrors('addServiceAgent')(state),
        viewFormInitial: state.form.viewEditServiceAgent && state.form.viewEditServiceAgent.initial,
        viewFormValues: state.form.viewEditServiceAgent && state.form.viewEditServiceAgent.values
            ? state.form.viewEditServiceAgent.values : {}
    }
}

export default connect(mapStateToProps, actions)(ServiceAgent)