import React from 'react';
import { Icon, Modal, notification } from 'antd';
import { reduxForm, } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as actions from '../../../../actions/scopeDocActions';
import { JobDocsEmailvalidate } from '../../../../utils/Validations/emailQuoteValidation';
import * as accessControlAction from '../../../../actions/accessControlManagementAction';
import { Strings } from '../../../../dataProvider/localize';
import { goBack, handleFocus, goBackBrowser } from '../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import { getStorage } from '../../../../utils/common';
import EmailSearch from './EmailSearch';
import ViewJobEmail from './ViewJobEmail'
import { Route } from 'react-router-dom';
import { ERROR_NOTIFICATION_KEY } from '../../../../config';



class JobEmail extends React.Component {
  selectedScopDoc
  constructor(props) {
    super(props);
    this.state = {
      togleSearch: true,
      toggleCc: false,
      toggleBcc: false,
      editorState: ''
    }
    this.getEmailList()
    this.selectedScopDoc = this.props.location.state
  }

  handleSearchToggle = () => {
    this.setState({ togleSearch: !this.state.togleSearch })
  }

  handleCcToggle = (event) => {
    event.preventDefault();
    this.setState({ toggleCc: !this.state.toggleCc })
  }

  handleBccToggle = (event) => {
    event.preventDefault();
    this.setState({ toggleBcc: !this.state.toggleBcc })
  }

  cancel = () => {
    // goBack(this.props)
    goBackBrowser(this.props);
  }

  getEmailList = () => {
    this.props.action.getJobDocsEmails().then({
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
            <span>Email Job Document</span>
          </h2>
        </div>
        <div className="main-container">
          <div className="row">
            <EmailSearch handleSearchToggle={this.handleSearchToggle} togleSearch={this.state.togleSearch} />
            <Route
              path={this.props.match.path + '/emailDocument'}
              render={(props) => <ViewJobEmail togleSearch={this.state.togleSearch} />}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  // var value = state.scopeDocs && state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : null;
  // var initialOrgData = {}
  // if (value) {
  //   initialOrgData = { 'from': JSON.parse(getStorage(ADMIN_DETAILS)).email_address, 'to': value.client_person.email, body: str }
  // }
  return {
    jobDocEmailList: state.scopeDocs && state.scopeDocs.jobDocEmailList ? state.scopeDocs.jobDocEmailList : []
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    accessControlAction: bindActionCreators(accessControlAction, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'JobEmail', validate: JobDocsEmailvalidate,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(JobEmail)