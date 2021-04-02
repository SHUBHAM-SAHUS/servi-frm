import React from 'react';
import { connect } from 'react-redux';
import { Layout, Menu, Icon, Badge, Dropdown, Avatar, Modal, Select } from 'antd';
import { NAV_MENU } from './navigationMenu';
import { Route, Link, Switch } from 'react-router-dom';
import * as action from '../../actions';
import * as actions from '../../actions/profileManagementActions';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import InviteUsers from './organization/InviteUsers';
import { Strings } from '../../dataProvider/localize';
import {
  ADMIN_DETAILS, JWT_ACCESS_TOKEN, JWT_ID_TOKEN,
  PAYMENT_DETAILS, ACCESS_CONTROL, ORGANIZATIONS_LIST,
  SELECTED_ORG
} from '../../dataProvider/constant'
import AddPaymentDetails from './organization/AddPaymentDetails';
import PaymentSavedCard from './organization/PaymentSavedCard';
import { getStorage, setStorage, abbrivationStr } from '../../utils/common';
import { changeOrganization, removeLoginData } from '../../utils/sessions';
import createJobDocs from './job/createJobDocs';
import jobDetails from './job/jobDetails';
import JobEmail from './job/JobEmail/JobEmail';
import JobCalendar from './job/jobCalender';
import JobDetailsContainer from './job/JobDetails/JobDetailsContainer';
import SignOffSheet from './serviceAgentJobMgmt/signOffSheet/SignOffSheet';
import ScrollArea from 'react-scrollbar';
import $ from 'jquery';

import { PAYMENT_URL, GET_CARD_DETAILS_URL } from '../../dataProvider/constant';
import axiosInstance from '../../dataProvider/axiosHelper';
import PaymentPending from './PaymentPending';
import PhotosDocs from './serviceAgentJobMgmt/photosDocs/PhotosDocs';
import JobReport from './serviceAgentJobMgmt/jobReport/JobReport';
import SignSWMS from './serviceAgentJobMgmt/signSWMS/SignSWMS';
import EmailJobReport from './serviceAgentJobMgmt/jobReport/EmailJobReport';
import EmailSWMSSign from './serviceAgentJobMgmt/signSWMS/EmailSWMSSign';
import RebookJob from './serviceAgentJobMgmt/rebookJob/RebookJob';
import TimeSheets from './serviceAgentJobMgmt/timeSheets/TimeSheets';
import AddHazardReport from './serviceAgentJobMgmt/addHazardReport/AddHazardReport'
import AddIncidentReport from "./serviceAgentJobMgmt/addIncidentReport/AddIncidentReport";
import JobManagement from './jobManagementModule/JobManagement';
import EmialJobSignOff from './serviceAgentJobMgmt/signOffSheet/EmialJobSignOff';
import ViewJobDoc from './job/viewJobDoc';
import ChangePassword from './profile/ChangePassword';
import StaffCalendar from '../../components/dashboard/ServiceAgentStaff/StaffCalendar/StaffCalendar'
import { RFC_2822 } from 'moment';
import JobDocuments from '../dashboard/job-documents';
import * as jobDocumentsAction from '../../actions/jobDocumentsAction';
const { Header, Sider, Content } = Layout;
const { Option } = Select;
const { confirm, info } = Modal;
// for notification dropdown list
const notification = (
  <Menu>
    <Menu.Item key="0">
      <a target="_blank" rel="noopener noreferrer" >
        First Notification
		</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <a target="_blank" rel="noopener noreferrer" >
        Second Notification
		</a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <a target="_blank" rel="noopener noreferrer" >
        Thired Notification
		</a>
    </Menu.Item>
  </Menu>
);

const sfHelp = (
  <Menu>
    <Menu.Item key="0">
      <a target="_blank" rel="noopener noreferrer">
        {Strings.das_help_center_title}
      </a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="1">
      <a target="_blank" rel="noopener noreferrer">
        {Strings.das_learning_roadmap}
      </a>
    </Menu.Item>
    <Menu.Divider />
    <Menu.Item key="3">
      <a target="_blank" rel="noopener noreferrer">
        {Strings.das_video_help}
      </a>
    </Menu.Item>
  </Menu>
);

export class Dashboard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      collapsed: false,
      broken: false,
      showSearch: false,
      selectedOrg: getStorage(ADMIN_DETAILS) && JSON.parse(getStorage(ADMIN_DETAILS)).last_logged_in_org_id &&
        JSON.parse(getStorage(ORGANIZATIONS_LIST)) &&
        JSON.parse(getStorage(ORGANIZATIONS_LIST)).findIndex((org) => org.id == JSON.parse(getStorage(ADMIN_DETAILS)).last_logged_in_org_id)
        ? JSON.parse(getStorage(ORGANIZATIONS_LIST)).findIndex((org) => org.id == JSON.parse(getStorage(ADMIN_DETAILS)).last_logged_in_org_id)
        : 0,
      showSearchBox: false
    };

    // search button show hide
    // this.toggleSearchBox = this.toggleSearchBox.bind(this)

    this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;

    if (JSON.parse(getStorage(PAYMENT_DETAILS)) &&
      /* JSON.parse(getStorage(PAYMENT_DETAILS)).subscription_amount > 0 && */
      JSON.parse(getStorage(PAYMENT_DETAILS)).is_payment_due == 1) {

      if (JSON.parse(getStorage(ADMIN_DETAILS)).role.org_default_role === 1) {

        axiosInstance.get(GET_CARD_DETAILS_URL)
          .then(res => {
            setStorage(PAYMENT_DETAILS, JSON.stringify({
              ...JSON.parse(getStorage(PAYMENT_DETAILS)),
              eway_token: res.data.data.card_details.eway_token,
              card_details: res.data.data.card_details
            }))
            if (JSON.parse(getStorage(PAYMENT_DETAILS)).eway_token) {
              this.props.history.push(this.props.match.path + '/savedCardPayment');
            }
            else {
              this.props.history.push(this.props.match.path + '/AddPaymentDetails');
            }

          }).catch(error => { });
      }
      else {
        this.props.history.push(this.props.match.path + '/paymentPending')
      }


    } else {
      // if (this.props.location.pathname === '/dashboard' || this.props.location.pathname === '/dashboard/')
      this.props.history.push(this.props.match.path + '/dashboard');
      this.handleUserManageClick = this.handleUserManageClick.bind(this);
    }
  }

  componentDidMount() {
    // for nav scroll
    let onResize = function () {
      if ($(window).height() > 300) {
        let $windowHeight = $(window).height() - 100;
        $('.menu-scroll').css('max-height', $windowHeight);
        $('.ant-layout').css('min-height', ($windowHeight + 100));
      } else {
        $('.menu-scroll').css('max-height', '');
      }
    }
    $(document).ready(onResize);
    $(window).resize(onResize);
    // end

    $(function () {
      $(".ant-layout-has-sider").css({ minHeight: $(window).innerHeight() + 'px' });
      $(window).resize(function () {
        $(".ant-layout-has-sider").css({ minHeight: $(window).innerHeight() + 'px' });
      });
    });

    if (!getStorage(SELECTED_ORG) && getStorage(ORGANIZATIONS_LIST) && JSON.parse(getStorage(ORGANIZATIONS_LIST)).length > 1) {
      this.firstTimeOrg()
    }
    this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name);
  }

  firstTimeOrg = () => {
    // console.log("org deafult", getStorage(ADMIN_DETAILS))
    info({
      title: 'Please select Organization', className: "select-org-modal",
      content: <div className="slt-org-mdl">
        <Select defaultValue={getStorage(ADMIN_DETAILS) && JSON.parse(getStorage(ADMIN_DETAILS)).last_logged_in_org_id &&
          JSON.parse(getStorage(ORGANIZATIONS_LIST)) &&
          JSON.parse(getStorage(ORGANIZATIONS_LIST)).findIndex((org) => org.id == JSON.parse(getStorage(ADMIN_DETAILS)).last_logged_in_org_id)
          ? JSON.parse(getStorage(ORGANIZATIONS_LIST)).findIndex((org) => org.id == JSON.parse(getStorage(ADMIN_DETAILS)).last_logged_in_org_id)
          : 0} onChange={value => this.setState({ selectedOrg: value })}>
          {JSON.parse(getStorage(ORGANIZATIONS_LIST)).map((org, index) =>
            <Option value={index}>{org.name}</Option>)}
        </Select>
      </div>,
      onOk: () => {
        setStorage(SELECTED_ORG, this.state.selectedOrg);
        changeOrganization(this.state.selectedOrg);
        this.props.resetStore()
        this.props.history.push('/');
      },
      keyboard: false,

    });
  }

  changeOrgModal = () => {
    confirm({
      title: 'Please select Organization', className: "select-org-modal",
      content: <div className="slt-org-mdl">
        <Select
          defaultValue={getStorage(SELECTED_ORG) ? JSON.parse(getStorage(SELECTED_ORG)) : 0}
          onChange={value => this.setState({ selectedOrg: value })}>
          {JSON.parse(getStorage(ORGANIZATIONS_LIST)).map((org, index) =>
            <Option value={index}>{org.name}</Option>)}
        </Select>
      </div>,
      onOk: () => {
        setStorage(SELECTED_ORG, this.state.selectedOrg);
        changeOrganization(this.state.selectedOrg);
        this.props.resetStore()
        this.props.history.push('/');
      },
      onCancel: () => { },
      keyboard: false,
    });
  }
  /**Acting as auth guard */
  componentDidUpdate() {
    if (!getStorage(ADMIN_DETAILS) && !getStorage(JWT_ACCESS_TOKEN)
      && !getStorage(JWT_ID_TOKEN)) {
      this.props.history.push('/signin');
    }
  }

  handleUserManageClick = () => {
    this.props.action.signOut();
    this.props.history.push({ pathname: '/signin' })
  }

  toggle = (evt) => {
    evt.stopPropagation()
    this.setState({
      collapsed: !this.state.collapsed,
    });
  };
  breakpointToggle = broken => {
    this.setState({ broken: broken });
  }

  // will use it very soon
  handleSearchClick = () => {
    this.setState({ showSearch: true })
  }

  handleSelection = (menuItems) => {
    const menuItemNumber = Object.keys(menuItems).findIndex(item => {
      return item === this.props.location.pathname.split('/')[2];
    });
    return [menuItemNumber.toString()];
  }

  openSider = () => this.setState({ collapsed: false })

  closeSider = () => this.setState({ collapsed: true })

  removeViewDocumentState = () => {
    let { setJobView } = this.props;
    setJobView(false)
  }
  render() {
    const modulesAccess = getStorage(ACCESS_CONTROL) && getStorage(ACCESS_CONTROL) !== 'undefined' && JSON.parse(getStorage(ACCESS_CONTROL)) ?
      JSON.parse(getStorage(ACCESS_CONTROL)) : {};
    modulesAccess.jobDocuments = {
      show_in_sidebar: 1,
      module_name: "jobDocuments"
    }

    // for user profile dropdown list

    const currentUserRole = getStorage(ADMIN_DETAILS) && JSON.parse(getStorage(ADMIN_DETAILS)).role.role_name
    const currentUserOrg = getStorage(ADMIN_DETAILS) && JSON.parse(getStorage(ADMIN_DETAILS)).organisation.name

    const menu = (
      <Menu className="user-drop-list">
        <Menu.Item key="0">
          <a target="_blank" rel="noopener noreferrer" className="user-details">
            <div className="user-name-role">
              <strong className="user-name">
                {this.props && this.props.profile[0] && this.props.profile[0].name ?
                  this.props.profile[0].name + " " + (this.props.profile[0].last_name ? this.props.profile[0].last_name : "") : null}
                {/* {JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name : ''} */}
              </strong>
              <span className="pill">{currentUserRole}</span>
            </div>
            <span className="user-id">
              {this.props && this.props.profile[0] && this.props.profile[0].email_address ? this.props.profile[0].email_address : null}
              {/* {JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).email_address : ''} */}
            </span>
          </a>
        </Menu.Item>
        <Menu.Divider />
        {/* JSON.parse(getStorage(ORGANIZATIONS_LIST)) && JSON.parse(getStorage(ORGANIZATIONS_LIST)).map((org, index) =>
					<Menu.Item key={3 + index} onClick={() => { this.handleOrgChange(index) }}>
						{org && org.logo ? <img className="pro-org-img" alt="" src="/images/sf-list-img.png" /> :
							<label className="pro-abbr">{abbrivationStr(org.name)}</label>}{org.name}
					</Menu.Item>
				) */}
        <Menu.Item key="4" onClick={this.changeOrgModal}>
          <i class="material-icons">account_balance</i>
          <span className="change-org-name">
            Change Organisation
            <span className="org-name">{currentUserOrg}</span>
          </span>
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="1" rel="noopener noreferrer" onClick={() => this.props.history.push('/dashboard/profile')}>
          <i className="fa fa-user-circle-o"></i> {Strings.profile_title}
        </Menu.Item>
        <Menu.Item key="1" rel="noopener noreferrer" onClick={() => this.props.history.push('/dashboard/changePassword')}>
          <i className="material-icons">vpn_key</i> {Strings.change_password}
        </Menu.Item>
        <Menu.Item key="3" onClick={this.handleUserManageClick}>
          <i className="fa fa-sign-out"></i> {Strings.logout_title}
        </Menu.Item>
      </Menu>
    );

    if (!getStorage(SELECTED_ORG) && getStorage(ORGANIZATIONS_LIST) && JSON.parse(getStorage(ORGANIZATIONS_LIST)).length > 1) {
      return <div></div>
    }

    return (

      <Layout>
        {JSON.parse(getStorage(PAYMENT_DETAILS)) &&
          JSON.parse(getStorage(PAYMENT_DETAILS)).is_payment_due == 1 ?
          null :
          <Sider
            width={280}
            onMouseOver={this.openSider}
            onMouseOut={this.closeSider}
            breakpoint="sm"
            collapsedWidth={this.state.broken ? "0" : "80"}
            onBreakpoint={this.breakpointToggle}
            trigger={null}
            collapsible
            collapsed={this.state.collapsed}>
            <div className="logo dsb-logo"><img src={"/images/sf-logo.png"} /><strong>Service Farm</strong></div>
            <ScrollArea speed={0.8} smoothScrolling={true}
              className="sf-scroll menu-scroll" horizontal={false}>
              <Menu className="sf-nav" theme="dark" mode="inline" defaultSelectedKeys={['1']} selectedKeys={this.handleSelection(modulesAccess)}>
                {Object.keys(modulesAccess).map((link, index) => {
                  /* if (link === "service_agent_staff_calendar" && JSON.parse(getStorage(ADMIN_DETAILS)).organisation.organisation_type == 1) {
                    return
                  } */
                  var menu = NAV_MENU.find(ele => ele.linkTo === '/' + link);

                  if (modulesAccess[link].show_in_sidebar === 1 && menu) {
                    return (
                      <Menu.Item key={index} className="sf-nav-items"
                        onClick={() => this.removeViewDocumentState()}
                      // disabled={modulesAccess[link].slug !== 'dashboard' && modulesAccess[link].slug !== 'profile' ?
                      //   this.props.profileProgress !== 100 : false}
                      >

                        <Link to={{ pathname: this.props.match.path + menu.linkTo, state: { fromLink: true } }} onClick={this.closeSider}>
                          {/* this.state.broken && !this.state.collapsed ? : null */}
                          {menu.iconType(modulesAccess[link].icon_name)}
                          <span>{modulesAccess[link].module_name}</span>
                        </Link>
                      </Menu.Item>
                    )
                  }
                }
                )}
              </Menu>

            </ScrollArea>
          </Sider>}
        <Layout onClick={this.closeSider}
          className={this.state.broken && !this.state.collapsed ? "sideBarOverlay" : ""}>
          {/*         this.state.broken && !this.state.collapsed ? : null */}
          <Header>
            {/* <Icon className="trigger" type={'menu'} onClick={this.toggle} /> */}
            <button className="trigger navbar-bnt normal-bnt" type={'menu'} onClick={this.toggle}>
              <i class="material-icons">menu</i>
            </button>
            <div className="usr-profile d-flex" id="profileDrop">
              <div className="sett-badge search-badge">
                <span className={this.state.showSearchBox ? "searchFfrom show-search-box" : "searchFfrom"}>
                  {this.state.showSearchBox ? <div className="page-search-box">
                    <input type="text" placeholder="search" className="toggle-textbox" />
                    <button onClick={() => this.setState({ showSearchBox: false })} type="button" className="normal-bnt"><i className="material-icons">close</i></button>
                  </div> : null}
                  <button onClick={() => this.setState({ showSearchBox: true })} className="normal-bnt srch-button">
                    <i class="ion-search"></i></button>
                </span>
              </div>
              <div className="sett-badge">
                <Dropdown overlay={notification} getPopupContainer={() => document.getElementById('profileDrop')}>
                  <a className="ant-dropdown-link notifi-drop no-dots">
                    <Badge dot><i class="material-icons">notifications</i>
                    </Badge>
                  </a>
                </Dropdown></div>

              <div className="sett-badge">
                <Dropdown overlay={sfHelp} getPopupContainer={() => document.getElementById('profileDrop')}>
                  <a className="ant-dropdown-link notifi-drop">
                    <i className="ion-help-circled"></i>
                  </a>
                </Dropdown></div>

              <div className="sett-badge pro-sett">
                <Dropdown overlay={menu} getPopupContainer={() => document.getElementById('profileDrop')}>
                  <a className="ant-dropdown-link" >
                    <span className="ant-avatar ant-avatar-circle ant-avatar-image">
                      <img src={this.props && this.props.profileImageUrl ? this.props.profileImageUrl : null} />
                    </span>
                    <span class="usr-txt">{this.props && this.props.profile[0] && this.props.profile[0].name ?
                      this.props.profile[0].name + " " + (this.props.profile[0].last_name ? this.props.profile[0].last_name : "") : null
                    }</span><Icon type="caret-down" />
                    {/* <span class="usr-txt">{JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).name : ''}</span><Icon type="caret-down" /> */}
                  </a>
                </Dropdown></div>
            </div>
          </Header>
          <Content>
            {JSON.parse(getStorage(PAYMENT_DETAILS)) &&
              JSON.parse(getStorage(PAYMENT_DETAILS)).is_payment_due == 1
              /*  &&
              JSON.parse(getStorage(PAYMENT_DETAILS)).subscription_amount > 0 */ ?
              JSON.parse(getStorage(ADMIN_DETAILS)).organisation.role.org_default_role === 1 ?
                <Switch>
                  <Route path={this.props.match.path + '/AddPaymentDetails'} component={AddPaymentDetails} />
                  <Route path={this.props.match.path + '/savedCardPayment'} component={PaymentSavedCard} />
                </Switch> : <Switch>
                  <Route path={this.props.match.path + '/paymentPending'} component={PaymentPending} />

                </Switch>
              :
              <Switch>
                {Object.keys(modulesAccess).map((link, index) => {
                  var menu = NAV_MENU.find(ele => ele.linkTo === '/' + link);
                  if (modulesAccess[link].show_in_sidebar === 1 && menu) {
                    return (<Route path={this.props.match.path + menu.linkTo} component={menu.component} />)
                  }
                }
                )}
                <Route path={this.props.match.path + '/inviteUsers'} component={InviteUsers} />
                <Route path={this.props.match.path + '/jobCalendar'} component={JobCalendar} />
                <Route path={this.props.match.path + '/staffCalendar'} component={StaffCalendar} />
                <Route path={this.props.match.path + '/jobDocs'} component={createJobDocs} />
                <Route path={this.props.match.path + '/jobDetails'} exact component={jobDetails} />
                <Route path={this.props.match.path + '/SignSWMS'} component={SignSWMS} />
                <Route path={this.props.match.path + '/jobEmail'} component={JobEmail} />
                <Route path={this.props.match.path + '/jobReport'} component={JobReport} />
                <Route path={this.props.match.path + '/photosDocs'} component={PhotosDocs} />
                <Route path={this.props.match.path + '/emailJobReport'} component={EmailJobReport} />
                <Route path={this.props.match.path + '/job-details'} component={JobDetailsContainer} />
                <Route path={this.props.match.path + '/sign-off-sheet'} component={SignOffSheet} />
                <Route path={this.props.match.path + '/emailSWMSSign'} component={EmailSWMSSign} />
                <Route path={this.props.match.path + '/rebookJob'} component={RebookJob} />
                <Route path={this.props.match.path + '/time-sheets'} component={TimeSheets} />
                <Route path={this.props.match.path + '/add-hazard-report'} component={AddHazardReport} />
                <Route path={this.props.match.path + '/add-incident-report'} component={AddIncidentReport} />
                <Route path={this.props.match.path + '/emailJobSignOff'} component={EmialJobSignOff} />
                <Route path={this.props.match.path + '/showJobDoc'} component={ViewJobDoc} />
                <Route path={this.props.match.path + '/changePassword'} component={ChangePassword} />
                <Route path={this.props.match.path + '/jobDocuments'} component={JobDocuments} />
              </Switch>
            }
          </Content>
        </Layout>


      </Layout>

    );
  }
}

const mapStateToProps = (state) => {
  return {
    profile: state.profileManagement && state.profileManagement.profile,
    profileImageUrl: state.profileManagement && state.profileManagement.profileImageUrl,
    profileProgress: state.profileManagement && state.profileManagement.profileProgress,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(action, dispatch),
    userActions: bindActionCreators(actions, dispatch),
    resetStore: () => dispatch({ type: 'USER_LOGOUT' }),
    setJobView: (value) => dispatch(jobDocumentsAction.setJobView(value)),

  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(Dashboard))
