import React from 'react';
import { ADMIN_DETAILS } from '../../../../../dataProvider/constant';
import { List, Avatar, Icon, AutoComplete, Input, Modal, notification } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ScrollArea from 'react-scrollbar';
import * as actions from '../../../../../actions/roleManagementActions';
import { Strings } from '../../../../../dataProvider/localize';
import * as rolePermissionAction from '../../../../../actions/permissionManagementAction';
import { abbrivationStr } from '../../../../../utils/common';
import { getStorage } from '../../../../../utils/common';
import * as reportActions from '../../../../../actions/SAIncidentReportActions'

class HazardReportSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      seacrhValue: '',
      viewButton: true,
      activeId: null
    }
  }

  componentDidMount() {
    this.setState({ viewButton: true });
  }

  componentWillReceiveProps(props) {
    if (!props.location.pathname.includes("showRole")) {
      this.setState({ activeId: null });
    }

    if (!props.location.pathname.includes("showHazardReport")) {
      this.setState({ activeId: null });
    }


  }

  handleReportClick = (reportId, jobId) => {
    this.setState({ activeId: reportId });
    const orgId = JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id;
    this.props.reportActions.getHazardDetailsNew(reportId, orgId, jobId)
      .then((flag) => {
        this.props.history.push({ pathname: this.props.match.path + '/showHazardReport', state: reportId })
      })
      .catch((message) => {
        notification.error({
          message: Strings.error_title,
          description: message ? message : Strings.generic_error,
          onClick: () => { },
            className: 'ant-error'
        });
      });
  }

  handelSearchChange = (seacrhValue) => {
    this.setState({ seacrhValue });
  }

  handelViewAllClick = () => {
    this.setState({ viewButton: false });
  }

  render() {
    const dataSource = this.props.hazardReports
    return (
      <div className={this.props.togleSearch ? "col-md-3 mb-4 sf-searchbar" : "col-md-3 mb-4 closed sf-searchbar"}>
        <button onClick={this.props.handleSearchToggle} className="bnt-searchbar open"><Icon type="left" /></button>
        <div className="sf-card">
          <div id="stickAutoComplete" className="sf-card-head">
            {/* search text box  */}
            <div className="auto-search-txt search-lists">
              <AutoComplete
                className="certain-category-search"
                dropdownClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 300 }}
                size="large"
                style={{ width: '100%' }}
                onChange={this.handelSearchChange}
                placeholder={Strings.search_placeholder}
                optionLabelProp="value"
                getPopupContainer={() => document.getElementById('stickAutoComplete')}
              >
                <Input suffix={<Icon type="search" />} />

              </AutoComplete>
            </div>
            {/* search text box  */}
          </div>
          <div className="sf-search-body">
            <div className={this.state.viewButton ? "sf-card-body p-0" : "sf-card-body p-0 search-lists-bar"}>
              <ScrollArea speed={0.8} smoothScrolling={true} className="sf-scroll" horizontal={false}>
                <List className="sf-service-list"
                  itemLayout="horizontal"
                  dataSource={this.state.viewButton ? dataSource.slice(0, 10) : dataSource}
                  renderItem={item => (
                    <List.Item
                      className={this.state.activeId != null
                        ? this.state.activeId === item.id
                          ? "active"
                          : "disable-lists"
                        : ""}
                      onClick={() => this.handleReportClick(item.id, item.job_id)} >
                      <Link to={{ pathname: this.props.match.path + '/showHazardReport', state: item.id }}>
                        <List.Item.Meta
                          avatar={<label>{abbrivationStr(item.description)}</label>}
                          title={item.description}
                          description={
                            <div className="ant-list-item-meta-description">
                              <span>{item.hazard_date}</span>
                              {item.status === 0 ? <span className="ins-pill new-pill">Assigned</span> :
                                item.status === 1 ? <span className="ins-pill partial-pill">In progress</span> :
                                  item.status === 2 ? <span className="ins-pill complete-pill">Complete</span> : null}

                            </div>
                          }
                        />
                      </Link>
                    </List.Item>
                  )}
                />
              </ScrollArea>
            </div>
            {
              dataSource.length > 10
                ? <div className="sf-card-footer d-flex align-items-end justify-content-center" >
                    <button className="v-all-org" style={{ display: this.state.viewButton ? 'block' : 'none' }} onClick={this.handelViewAllClick}>{Strings.view_all_reports_txt}</button>
                  </div>
                : null
            }
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    roles: state.roleManagement.roles,
    hazardReports: state.sAIncidentManagement.allHazardReports,
    hazardReportDetails: state.sAIncidentManagement.hazardReportDetails
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    rolePermissionAction: bindActionCreators(rolePermissionAction, dispatch),
    reportActions: bindActionCreators(reportActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(HazardReportSearch))