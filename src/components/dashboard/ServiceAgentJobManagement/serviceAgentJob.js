import React from 'react';
import { Icon, Modal } from 'antd';
import { reduxForm, } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import * as accessControlAction from '../../../actions/accessControlManagementAction';
import { goBack, handleFocus } from '../../../utils/common';
import ServiceAgentJobEmail from './ServiceAgentJobEmail';
import EmailJobSignOffSheet from './EmailJobSignOffSheet';
import EmailJobReport from './EmailJobReport';

class ServiceAgentJob extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toggleSearch: false,
      toggleCc: false,
      toggleBcc: false,
      editorState: '',
      serviceAgentJobEmail: 'block',
      jobSignOffSheet: 'none',
      jobReportEmail: 'none'
    }
    // this.getEmailList()
  }

  handleSearchToggle = () => {
    this.setState({ toggleSearch: !this.state.togleSearch })
  }

  handleCcToggle = (event) => {
    event.preventDefault();
    this.setState({ toggleSearch: !this.state.toggleCc })
  }

  handleBccToggle = (event) => {
    event.preventDefault();
    this.setState({ toggleSearch: !this.state.toggleBcc })
  }

  cancel = () => {
    goBack(this.props)
  }

  handleCancel = () => {
    this.setState({
      serviceAgentJobEmail: 'none',
      jobSignOffSheet: 'none',
      jobReportEmail: 'none'
    })
  }

  handleEmailSwms = () => {
    this.setState({
      serviceAgentJobEmail: 'block',
      jobSignOffSheet: 'none',
      jobReportEmail: 'none'
    })
  }

  handleEmailSignOff = () => {
    this.setState({
      jobSignOffSheet: 'block',
      serviceAgentJobEmail: 'none'
    })
  }

  handleEmailJobReport = () => {
    this.setState({
      jobReportEmail: 'block',
      serviceAgentJobEmail: 'none',
      jobSignOffSheet: 'none',
    })
  }

  render() {
    return (
      <div className="sf-page-layout">
        {/* inner header  */}
        <div className="dash-header">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            <span>Service Agent Job Management</span>
          </h2>
          <div className="all-btn d-flex justify-content-end sc-doc-bnt">
            <div className="btn-hs-icon">
              <button type="button" className="bnt bnt-active" onClick={this.handleEmailSwms}>
                Email SWMS Sheet</button>
            </div>
            <div className="btn-hs-icon">
              <button type="submit" className="bnt bnt-active" onClick={this.handleEmailSignOff}>
                Email Sign Off Sheet</button>
            </div>
            <div className="btn-hs-icon">
              <button type="submit" className="bnt bnt-active" onClick={this.handleEmailJobReport}>
                Email Job Report</button>
            </div>
          </div>
        </div>

        <div className="main-container">
          {/* <div className="row"> */}
          <div style={{ display: this.state.serviceAgentJobEmail }}>
            <ServiceAgentJobEmail
              onCancel={this.handleCancel}
            // initialValues={this.state.Person}
            // togleSearch={this.state.togleSearch}
            />
          </div>
          <div style={{ display: this.state.jobSignOffSheet }}>
            <EmailJobSignOffSheet
              onCancel={this.handleCancel}
            />
          </div>
          <div style={{ display: this.state.jobReportEmail }}>
            <EmailJobReport
              onCancel={this.handleCancel}
            />
          </div>

          {/* </div> */}
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var value = state.scopeDocs && state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : null;
  // var initialOrgData = {}
  // if (value) {
  //   initialOrgData = { 'from': JSON.parse(getStorage(ADMIN_DETAILS)).email_address, 'to': value.client_person.email, body: str }
  // }
  return {
    selectedScopeDoc: (value ? value : {}),
    jobDocEmailList: state.scopeDocs && state.scopeDocs.jobDocEmailList ? state.scopeDocs.jobDocEmailList : []
  }
}

const mapDispatchToprops = dispatch => {
  return {
    // action: bindActionCreators(actions, dispatch),
    accessControlAction: bindActionCreators(accessControlAction, dispatch)
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({ form: '' ,
  onSubmitFail: (errors, dispatch, sub, props) => {
    handleFocus(errors, "#");
  }})
)(ServiceAgentJob)