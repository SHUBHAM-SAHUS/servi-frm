import React from 'react';
import { List, Icon, AutoComplete, Input } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';

import * as actions from '../../../actions/roleManagementActions';
import { Strings } from '../../../dataProvider/localize';
import * as rolePermissionAction from '../../../actions/permissionManagementAction';
import { abbrivationStr } from '../../../utils/common';

class EmailSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seacrhValue: '', viewButton: true, activeId: null }
  }

  componentDidMount() {
    this.setState({ viewButton: true });
  }

  componentWillReceiveProps(props) {
    if (!props.location.pathname.includes("showRole"))
      this.setState({ activeId: null });
  }

  handleOrganizationClick = (roleId) => {
    this.setState({ activeId: roleId });
    this.props.rolePermissionAction.getPermissionsByRole(roleId)
  }

  handelSearchChange = (seacrhValue) => {
    this.setState({ seacrhValue });
  }

  handelViewAllClick = () => {
    this.setState({ viewButton: false });
  }


  render() {
    const dataSource = this.props.roles.filter(role => role.name.toLowerCase().includes(this.state.seacrhValue.toLowerCase()));
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
            <div className="sf-card-body p-0">
              <List className={this.state.viewButton ? "sf-service-list" : "sf-service-list has-scroll"}
                itemLayout="horizontal"
                dataSource={this.state.viewButton ? dataSource.slice(0, 10) : dataSource}
                renderItem={item => (
                  <List.Item className={this.state.activeId != null ?
                    this.state.activeId === item.id ? "active" : "disable-lists" : ""} onClick={() => this.handleOrganizationClick(item.id)} >
                    <Link to={{ pathname: this.props.match.path + '/showRole', state: item.id }}>
                      <List.Item.Meta
                        avatar={<label>{abbrivationStr(item.name)}</label>}
                        title={item.name}
                      />
                    </Link>
                  </List.Item>
                )}
              />
            </div>
            {
              dataSource.length > 10
                ? <div className="sf-card-footer d-flex align-items-end justify-content-center" >
                  <button className="v-all-org" style={{ display: this.state.viewButton ? 'block' : 'none' }} onClick={this.handelViewAllClick}>{Strings.view_all_mail_txt}</button>
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
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
    rolePermissionAction: bindActionCreators(rolePermissionAction, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(EmailSearch))