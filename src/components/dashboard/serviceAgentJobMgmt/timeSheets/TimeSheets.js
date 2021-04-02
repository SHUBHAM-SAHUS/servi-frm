import React, { Component } from 'react';
import { Icon, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { reduxForm, Field, isDirty } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import { Route } from 'react-router-dom';
import $ from 'jquery';

import * as actions from '../../../../actions/roleManagementActions';
import * as accessControlAction from '../../../../actions/accessControlManagementAction';
import { Strings } from '../../../../dataProvider/localize';
import { ADMIN_DETAILS, ACCESS_CONTROL } from '../../../../dataProvider/constant';
import { getStorage, setStorage, goBack, handleFocus, goBackBrowser } from '../../../../utils/common';
import TimeSheetsSearch from './TimeSheetsSearch';
import { customInput } from '../../../common/custom-input';
import { validate } from '../../../../utils/Validations/roleValidation';
import { CustomDatepicker } from '../../../common/customDatepicker';
import { CustomSelect } from '../../../common/customSelect';
import * as timeSheetAction from '../../../../actions/timeSheetAction';
import * as jobCalendarAction from '../../../../actions/jobCalendarActions'
import ShowTimeSheet from './showTimeSheet';
import { ERROR_NOTIFICATION_KEY } from '../../../../config';

const mapRouteToTitle = {
    '/dashboard/reports': 'Reports'
}



export class TimeSheets extends Component {
    constructor(props) {
        super(props);
        this.state = { togleSearch: true }
    }
    componentDidMount() {
        this.props.timeSheetAction.getCompletedJobList()
            .then(() => {

            })
            .catch(message => {
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            })
        if (this.props.location.isFromJobDetails) {
            this.props.history.push({ pathname: this.props.match.path + '/showJob', state: { ...this.props.location.state, isFromJobDetails: true } })
        } else {
            this.props.history.push({ pathname: this.props.match.path + '/showJob', state: this.props.jobsList[0] })
        }
    }
    createRoleHandler = () => {
        this.props.history.push(this.props.match.path + '/createRole')
    }

    handleSearchToggle = () => {
        this.setState({ togleSearch: !this.state.togleSearch })
    }

    roleAccessControl = JSON.parse(getStorage(ACCESS_CONTROL))["job_calendar"] && JSON.parse(getStorage(ACCESS_CONTROL))["job_calendar"].permissions;
    /**Permissions for the module */
    permissions = {
        sf_job_calendar_job_calendar: this.roleAccessControl && Array.isArray(this.roleAccessControl) && this.roleAccessControl.findIndex(acess => acess.control_name === 'sf_job_calendar_job_calendar')
    }

    // expand center card----------
    handleExpand = () => {
        this.setState({ cardExpnadBtn: !this.state.cardExpnadBtn })
        $(".main-container").toggleClass("po-relative");
        $(".sf-card-wrap").toggleClass("fullscreen");
        $(".zoom-save-bnt").toggleClass("show-bnt");
    }

    handleCancel = () => {
        this.setState({ displayEdit: 'none' });
    }

    handleGoBack = () => {
        if (
            this.props.location.isFromJobDetails
            || (this.props.location.state
                && (typeof this.props.location.state === 'object')
                && this.props.location.state.hasOwnProperty('isFromJobDetails')
                && this.props.location.state.isFromJobDetails)
        ) {
            // alert('First')
            goBackBrowser(this.props)
            goBackBrowser(this.props)
        } else {
            // alert('Second')
            goBack(this.props)
        }
    }

    render() {
        return (
            <div className="sf-page-layout">
                {/* inner header  */}
                <div className="dash-header">
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() => this.handleGoBack()} />
                        {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : 'Timesheets'}
                    </h2>
                </div>
                {/* inner header  */}
                <div className="main-container">
                    <div className="row">

                        {/* Left section */}

                        <TimeSheetsSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} />


                        {/* center section  */}
                        <div className="col-md-9">
                            {this.props.jobsList && this.props.jobsList.length > 0 ? <ShowTimeSheet job={this.props.location.state} initialJob={this.props.jobsList[0]} /> : null}
                            {/* <Route
                                path={this.props.match.path + '/showJob'}
                                render={() => <ShowTimeSheet />}
                            /> */}
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        timeSheetList: state.timeSheet.timeSheetList,
        jobsList: state.timeSheet.jobsList
    }
}

const mapDispatchToprops = dispatch => ({
    timeSheetAction: bindActionCreators(timeSheetAction, dispatch),
    jobCalendarAction: bindActionCreators(jobCalendarAction, dispatch)
})

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'timeSheets', validate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(TimeSheets)
