import React, { Component } from 'react';
import {
  List,
  Icon,
  AutoComplete,
  Input,
  notification
} from 'antd';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { withRouter } from "react-router-dom";
import { Link } from 'react-router-dom';
import { Strings } from '../../../dataProvider/localize';
import { abbrivationStr } from '../../../utils/common';
import ScrollArea from 'react-scrollbar';
import * as emailTemplateActions from '../../../actions/emailTemplateAction';
import { ERROR_NOTIFICATION_KEY } from '../../../config';

export class EmailTemplateSearch extends Component {

  state = {
    searchValue: '',
    viewButton: true,
    activeId: null
  }

  componentDidMount() {
    this.setState({ viewButton: true });
  }

  static getDerivedStateFromProps(props, state) {
    if (!props.location.pathname.includes("show_email_template")) { }
  }

  handleListItemClick = item => {
    this.setState({ activeId: item.slug });
    this.props.emailActions.getEmailTemplateDetails(item.slug)
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
  }

  handleSearchChange = (searchValue) => {
    this.setState({ searchValue });
  }

  handleViewAllClick = () => {
    this.setState({ viewButton: false });
  }

  render() {
    const dataSource = this.props.templateList.filter(template => template.temp_name.toLowerCase().includes(this.state.searchValue.toLowerCase()));

    return (
      <div className={this.props.toggleSearch ? "col-md-3 mb-4 sf-searchbar" : "col-md-3 mb-4 closed sf-searchbar"}>
        <button onClick={this.props.handleSearchToggle} className="bnt-searchbar open"><Icon type="left" /></button>
        <div className="sf-card">
          <div className="sf-card-head">
            {/* search text box  */}
            <div className="auto-search-txt search-lists">
              <AutoComplete
                className="certain-category-search"
                dropdownClassName="certain-category-search-dropdown"
                dropdownMatchSelectWidth={false}
                dropdownStyle={{ width: 300 }}
                size="large"
                style={{ width: '100%' }}
                dataSource={
                  this.state.viewButton
                    ? dataSource.map(template => template.temp_name).slice(0, 5)
                    : dataSource.map(template => template.temp_name)
                }
                onChange={this.handleSearchChange}
                placeholder={Strings.search_placeholder}
                optionLabelProp="value"
              >
                <Input suffix={<Icon type="search" />} />
              </AutoComplete>
            </div>
            {/* search text box  */}
          </div>
          <div className="sf-search-body">
            <div className={this.state.viewButton ? "sf-card-body p-0" : "sf-card-body p-0 search-lists-bar"}>
              <ScrollArea speed={0.8} smoothScrolling={true}
                className="sf-scroll" horizontal={false}>
                <List className="sf-service-list"
                  itemLayout="horizontal"
                  dataSource={
                    this.state.viewButton ? dataSource.slice(0, 10) : dataSource
                  }
                  renderItem={item => {
                    return (
                      <List.Item
                        className={
                          this.props.location.state != null
                            ? this.props.location.state === item.slug
                              ? "active"
                              : "disable-lists"
                            : ""
                        }
                        onClick={() => this.handleListItemClick(item)}
                      >
                        <Link
                          to={{
                            pathname: this.props.match.path + '/show_email_template',
                            state: item.slug
                          }}
                        >
                          <List.Item.Meta
                            avatar={<label>{abbrivationStr(item.temp_name)}</label>}
                            title={item.temp_name}
                          />
                        </Link>
                      </List.Item>
                    )
                  }}
                />
              </ScrollArea>
            </div>
            <div className="sf-card-footer d-flex align-items-end justify-content-center" >
              <button className="v-all-org" style={{ display: this.state.viewButton ? 'block' : 'none' }} onClick={this.handleViewAllClick}>{Strings.view_all_templates}</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  templateList: state.emailTemplate.emailTemplateMastersList
})

const mapDispatchToProps = dispatch => {
  return {
    emailActions: bindActionCreators(emailTemplateActions, dispatch)
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(EmailTemplateSearch))
