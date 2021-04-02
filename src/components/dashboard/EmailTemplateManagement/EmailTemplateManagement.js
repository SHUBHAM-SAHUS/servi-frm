import React, { Component } from 'react';
import { Icon, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import { bindActionCreators } from 'redux';
import * as emailTemplateActions from '../../../actions/emailTemplateAction'

import EmailTemplateSearch from './EmailTemplateSearch'
import AddNewEmailTemplate from './AddNewEmailTemplate'
import ViewEditEmailTemplate from './ViewEditEmailTemplate'
import { Strings } from '../../../dataProvider/localize';
import { goBack } from '../../../utils/common';
import { ERROR_NOTIFICATION_KEY } from '../../../config';

const mapRouteToTitle = {
  '/dashboard/CategoryManagement/createCategory': Strings.email_template_title
}

export class EmailTemplateManagement extends Component {
  constructor(props) {
    super(props);
    this.state = { toggleSearch: true }
  }

  componentDidMount() {
    this.props.emailActions.getEmailDropdownItems()
      .then(() => {

      })
      .catch((message) => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })

    this.props.emailActions.getAllEmailTemplates()
      .then(() => {
        if (this.props.location.state && this.props.location.state.fromLink)
          this.props.history.push(this.props.match.path + '/create_email_template')
      })
      .catch((message) => {
        notification.error({
          key: ERROR_NOTIFICATION_KEY,
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      })
  }

  createEmailTemplateHandler = () => {
    this.props.history.push(this.props.match.path + '/create_email_template')
  }

  handleSearchToggle = () => {
    this.setState({ toggleSearch: !this.state.toggleSearch })
  }

  render() {
    return (
      <div className="sf-page-layout">
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            {mapRouteToTitle[this.props.location.pathname] ? mapRouteToTitle[this.props.location.pathname] : Strings.email_template_title}
          </h2>
          <div class="oh-cont">
            <button className="bnt bnt-active" onClick={this.createEmailTemplateHandler}>{Strings.add_template_btn}</button>
          </div>
        </div>
        {/* inner header  */}
        <div className="main-container">
          <div className="row">
            {/* Left section */}
            <EmailTemplateSearch handleSearchToggle={this.handleSearchToggle} toggleSearch={this.state.toggleSearch} />
            {/* center section  */}
            <Route path={this.props.match.path + '/show_email_template'}
              render={(props) => <ViewEditEmailTemplate {...props} toggleSearch={this.state.toggleSearch} />} />
            <Route path={this.props.match.path + '/create_email_template'}
              render={(props) => <AddNewEmailTemplate {...props} toggleSearch={this.state.toggleSearch} />} />
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    emailActions: bindActionCreators(emailTemplateActions, dispatch)
  }
}

export default connect(null, mapDispatchToProps)(EmailTemplateManagement)
