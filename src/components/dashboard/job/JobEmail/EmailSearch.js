import React from 'react';
import { List, Avatar, Modal, Icon, AutoComplete, Input, notification } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import moment from 'moment';
import * as actions from '../../../../actions/scopeDocActions';
import { Strings } from '../../../../dataProvider/localize';
import { abbrivationStr } from '../../../../utils/common';
import { ERROR_NOTIFICATION_KEY } from '../../../../config';

class EmailSearch extends React.Component {
  constructor(props) {
    super(props);
    this.state = { seacrhValue: '', viewButton: true, activeId: null }
  }

  componentDidMount() {
    this.setState({ viewButton: true });
  }

  handelSearchChange = (seacrhValue) => {
    this.setState({ seacrhValue });
  }

  handelViewAllClick = () => {
    this.setState({ viewButton: false });
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

  handleJobEmailDetailsClick = (docId) => {
    this.setState({ activeId: docId.id });
    this.props.action.getJobDocsEmailDetails(docId.id).then((flag) => {
      this.props.history.push({ pathname: this.props.match.path + '/emailDocument', state: { id: docId.id, job_doc_number: docId.job_doc_number } })
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

  render() {
    const dataSource = this.props.jobDocEmailList.filter(jobDocEmail => jobDocEmail.client && jobDocEmail.client.name.toLowerCase().includes(this.state.seacrhValue.toLowerCase()));
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
                    this.state.activeId === item.id ? "active" : "disable-lists" : ""} onClick={() => this.handleJobEmailDetailsClick({ id: item.id, job_doc_number: item.job_doc_number })} >
                    <Link>
                      <List.Item.Meta
                        avatar={<label>{abbrivationStr(item.client.name)}</label>}
                        title={item.client.name}
                        description={
                          <div className="ant-list-item-meta-description">
                            <span>{item.job_doc_number}</span>
                            <span>{moment(item.created_at).format('DD MMM YYYY')}</span>
                          </div>
                        }
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
    jobDocEmailList: state.scopeDocs.jobDocEmailList,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(EmailSearch))