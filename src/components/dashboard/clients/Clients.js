import React from 'react';
import { Strings } from '../../../dataProvider/localize';
import { connect } from 'react-redux';
import { Icon, Modal, Progress, notification } from 'antd';
import { bindActionCreators } from 'redux';
import { Route } from 'react-router-dom';
import { getStorage, setStorage } from '../../../utils/common';
import * as actions from '../../../actions/clientManagementActions';
import * as rolesActions from '../../../actions/roleManagementActions';
import * as accessControlAction from '../../../actions/accessControlManagementAction';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { goBack } from '../../../utils/common';
import { getFormMeta, getFormSyncErrors } from 'redux-form';
import ClientSearch from './ClientSearch';
import ViewEditClients from './ViewEditClients';
import AddNewClient from './AddNewClient';

const mapRouteToTitle = {
  '/dashboard/clients': Strings.clients_title
}

export class Clients extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formCompletion: 0,
      toggleSearch: true
    }
    if (this.props.location.state && this.props.location.state.fromLink)
      this.createClientHandler();
    // var currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    // this.props.clientActions.getClientsList(currentOrganization);
  }

  createClientHandler = () => {
    this.props.history.push(this.props.match.path + '/addNewClient')
  }

  handleSearchToggle = () => {
    this.setState({ toggleSearch: !this.state.toggleSearch })
  }

  componentDidMount(props) {
    var currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    // this.props.rolesActions.getRoles(currentOrganization.id);
    this.props.clientActions.initClientsList(currentOrganization)
      .then((flag) => {
        this.createClientHandler()
      })
      .catch((message) => {
        this.createClientHandler()
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
          className: 'ant-error'
        });
      });
  }

  componentWillReceiveProps(props) {
    if (props.location.pathname.includes("/addNewClient")) {
      this.state.cliDetailsSection = this.state.contactPersonSection = false;
      this.state.formCompletion = 0;
      if (props.formValues && props.formValues.values) {
        var values = props.formValues.values;
        if (values.name && values.abn_acn && values.address) {
          this.state.cliDetailsSection = true;
        }
        var personPercent = 0
        if (values.wizPerson && values.wizPerson.length > 0) {
          this.state.contactPersonSection = true;
          personPercent = 30;
        }
        const error = props.formSyncErrors;
        var percentageFields = Object.keys(values)
          .filter(key =>
            ((key === 'name' && !error.name) || (key === 'abn_acn' && !error.abn_acn) || (key === 'address' && !error.address))
          ).length
        this.state.formCompletion = (percentageFields / 3 * 70) + personPercent;
      }
    } else if (props.location.pathname.includes("/showClient")) {
      this.state.cliDetailsSection = this.state.contactPersonSection = true;
      this.state.formCompletion = 100;
    }
  }
  render() {


    return (
      <div className="sf-page-layout">
        <div className="dash-header pt-3 pb-3">
          <h2 className="page-mn-hd">
            <Icon type="arrow-left" onClick={() => goBack(this.props)} />
            {
              mapRouteToTitle[this.props.location.pathname]
                ? mapRouteToTitle[this.props.location.pathname]
                : Strings.clients_title
            }
          </h2>
          <div className="sf-steps-status">
            <div className="sf-steps-row">
              <div className={this.state.cliDetailsSection ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="material-icons">person</i></div>
                <span>Details</span>
              </div>
              <div className={this.state.contactPersonSection ? "sf-st-item active" : "sf-st-item"}>
                <div className="iconbx">
                  <i class="material-icons">perm_contact_calendar</i></div>
                <span>Contacts</span>
              </div>

            </div>
            <div className="sf-st-item sf-prog">
              <Progress
                type="circle"
                strokeColor={'#03a791'}
                width={40}
                strokeWidth={12}
                percent={Math.round(this.state.formCompletion)}
                format={
                  (percent) => percent + '%'} />
              <span>Progress</span>
            </div>
          </div>

          <div class="oh-cont">
            <button className="bnt bnt-active" onClick={this.createClientHandler}>{Strings.create_client}</button>
          </div>
        </div>
        <div className="main-container">
          <div className="row">
            <ClientSearch handleSearchToggle={this.handleSearchToggle} toggleSearch={this.state.toggleSearch} />
            <Route
              path={this.props.match.path + '/showClient'}
              render={(props) => <ViewEditClients {...props} toggleSearch={this.state.toggleSearch} />}
            />
            <Route
              path={this.props.match.path + '/addNewClient'}
              render={(props) => <AddNewClient {...props} toggleSearch={this.state.toggleSearch} />}
            />
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    clientsList: state.clientManagement && state.clientManagement.clients,
    formValues: state.form.addNewClient,
    formSyncErrors: getFormSyncErrors('addNewClient')(state),
  }
}

const mapDispatchToProps = dispatch => {
  return {
    clientActions: bindActionCreators(actions, dispatch),
    rolesActions: bindActionCreators(rolesActions, dispatch),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Clients)
