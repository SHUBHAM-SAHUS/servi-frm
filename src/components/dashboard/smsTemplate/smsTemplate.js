import React from 'react';
import { Icon, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import * as actions from '../../../actions/smsTemplateAction';
import { Strings } from '../../../dataProvider/localize';
import { goBack } from '../../../utils/common';
import SmsTemplateSearch from './smsTemplateSearch';
import AddNewSmsTemplate from './addNewSmstemplate';
import ViewEditSmsTemplate from './viewEditSmsTemplate';
import { ERROR_NOTIFICATION_KEY } from '../../../config';
const mapRouteToTitle = {
    // '/dashboard/ConsequenceBeforeControl/createConsequenceBeforeControl': Strings.consequencebeforecontrol_title
}

class smsTemplate extends React.Component {
    constructor(props) {
        super(props);
        this.state = { togleSearch: true };
        this.props.getSmsTemplate().then((flag) => {
            if (this.props.location.state && this.props.location.state.fromLink)
                this.createModuleHandler()
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

    createModuleHandler = () => {
        this.props.history.push(this.props.match.path + '/createSmsTemplate')
    }

    handleSearchToggle = () => {
        this.setState({ togleSearch: !this.state.togleSearch })
    }

    render() {
        return (
            <div className="sf-page-layout">
                {/* inner header  */}
                <div className="dash-header pt-3 pb-3">
                    <h2 className="page-mn-hd">
                        <Icon type="arrow-left" onClick={() => goBack(this.props)} />
                        {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : Strings.sms_template_title}
                    </h2>
                    <div class="oh-cont">
                        <button className="bnt bnt-active" onClick={this.createModuleHandler}>{Strings.add_sms_template_btn}</button>
                    </div>
                </div>
                {/* inner header  */}
                <div className="main-container">
                    <div className="row">
                        {/* Left section */}
                        <SmsTemplateSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} />
                        {/* center section  */}
                        <Route path={this.props.match.path + '/showSmsTemplate'}
                            render={(props) => <ViewEditSmsTemplate {...props} togleSearch={this.state.togleSearch} />} />
                        <Route path={this.props.match.path + '/createSmsTemplate'}
                            render={(props) => <AddNewSmsTemplate {...props} togleSearch={this.state.togleSearch} />} />
                    </div>
                </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        smsTemplateList: state.smsTemplate && state.smsTemplate.smsTemplateList,
    }
}

export default connect(mapStateToProps, actions)(smsTemplate);