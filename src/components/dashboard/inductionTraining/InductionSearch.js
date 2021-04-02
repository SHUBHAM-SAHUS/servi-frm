import React from 'react';
import { List, Avatar, Icon, AutoComplete, Input } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ScrollArea from 'react-scrollbar';

import * as actions from '../../../actions/roleManagementActions';
import { Strings } from '../../../dataProvider/localize';
import { abbrivationStr } from '../../../utils/common';

class InductionSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seacrhValue: '', viewButton: true, activeId: null }
  }

  componentDidMount() {
    this.setState({ viewButton: true });
  }

  componentWillReceiveProps(props) {
    if (!props.location.pathname.includes("showInduction"))
      this.setState({ activeId: null });
  }

  handleOrganizationClick = (roleId) => {
    this.setState({ activeId: roleId });
  }

  handelSearchChange = (seacrhValue) => {
    this.setState({ seacrhValue });
  }

  handelViewAllClick = () => {
    this.setState({ viewButton: false });
  }


  render() {
    const dataSource = this.props.courses.filter(course => course && course.name && course.name.toLowerCase().includes(this.state.seacrhValue.toLowerCase()));
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
                // dataSource={this.state.viewButton ? dataSource.map(role => role.name).slice(0, 5) : dataSource.map(role => role.name)}
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
                    <List.Item className={this.state.activeId != null ?
                      this.state.activeId === item.id ? "active" : "disable-lists" : ""} onClick={() => this.handleOrganizationClick(item.id)} >
                      <Link to={{ pathname: this.props.match.path + '/showInduction', state: item.id }}>
                        <List.Item.Meta
                          avatar={<label>{abbrivationStr(item.name)}</label>}
                          title={item.name}
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
                  <button className="v-all-org" style={{ display: this.state.viewButton ? 'block' : 'none' }} onClick={this.handelViewAllClick}>{Strings.view_all_induction}</button>
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
    courses: state.inductionTraining.courses,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(InductionSearch))