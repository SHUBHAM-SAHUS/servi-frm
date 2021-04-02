import React, { Component } from 'react';
import { Icon, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { reduxForm, Field, isDirty } from 'redux-form';
import { bindActionCreators, compose } from 'redux';
import $ from 'jquery';

import { ACCESS_CONTROL } from '../../../dataProvider/constant';
import { getStorage, handleFocus, goBackBrowser } from '../../../utils/common';
import { validate } from '../../../utils/Validations/roleValidation';
import * as timeSheetAction from '../../../actions/adminTimeSheetAction';
import ShowTimeSheet from './showTimeSheet';
import { ERROR_NOTIFICATION_KEY } from '../../../config';

const mapRouteToTitle = {
    '/dashboard/reports': 'Reports'
}



export class TimeSheets extends Component {
    constructor(props) {
        super(props);
        this.state = { togleSearch: true }
    }
    componentDidMount() {
        this.props.timeSheetAction.getTimeSheetFilters();
        this.props.timeSheetAction.getAdminTimeSheets({});
        this.props.timeSheetAction.getOwnTimeSheet();
    }
    createRoleHandler = () => {
        this.props.history.push(this.props.match.path + '/createRole')
    }

    handleSearchToggle = () => {
        this.setState({ togleSearch: !this.state.togleSearch })
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

    render() {
        return (
            <div className="sf-page-layout">
                {/* inner header  */}
                <div className="dash-header">
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() =>
                            // goBack(this.props)
                            goBackBrowser(this.props)
                        } />
                        {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : 'Timesheets'}
                    </h2>
                </div>
                {/* inner header  */}
                <div className="main-container">

                    {/* Left section */}

                    {/* <TimeSheetsSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} /> */}


                    {/* center section  */}
                    <ShowTimeSheet job={this.props.location.state} />
                    {/* <Route
                                path={this.props.match.path + '/showJob'}
                                render={() => <ShowTimeSheet />}
                            /> */}
                    {/* </div> */}
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        sataffList: state.adminTimesheet.sataffList,
        saList: state.adminTimesheet.saList
    }
}

const mapDispatchToprops = dispatch => ({
    timeSheetAction: bindActionCreators(timeSheetAction, dispatch),
})

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'timeSheets', validate, enableReinitialize: true,
        onSubmitFail: (errors) => {
            handleFocus(errors, "#");
        }
    })
)(TimeSheets)
