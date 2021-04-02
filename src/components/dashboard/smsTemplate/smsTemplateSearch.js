import React from 'react';
import { List, Icon, AutoComplete, Input } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { Strings } from "../../../dataProvider/localize";
import { abbrivationStr } from '../../../utils/common';
import ScrollArea from 'react-scrollbar';

class smsTemplateSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { seacrhValue: '', viewButton: true, activeId: null }
    }

    componentDidMount() {
        this.setState({ viewButton: true });
    }

    componentWillReceiveProps(props) {
        if (!props.location.pathname.includes("showSmsTemplate"))
            this.setState({ activeId: null });
    }

    handleOrganizationClick = (organId) => {
        this.setState({ activeId: organId });
    }

    handelSearchChange = (seacrhValue) => {
        this.setState({ seacrhValue });
    }

    handelViewAllClick = () => {
        this.setState({ viewButton: false });
    }

    render() {
        const dataSource = this.props.smsTemplateList && this.props.smsTemplateList.filter(sms => sms && sms.temp_name.toLowerCase().includes(this.state.seacrhValue.toLowerCase()));
        return (
            <div className={this.props.togleSearch ? "col-md-3 mb-4 sf-searchbar" : "col-md-3 mb-4 closed sf-searchbar"}>
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
                                // dataSource={this.state.viewButton ? dataSource.map(subscript => subscript.name).slice(0, 5) : dataSource.map(subscript => subscript.name)}
                                onChange={this.handelSearchChange}
                                placeholder={Strings.search_placeholder}
                                optionLabelProp="value"
                            >
                                <Input suffix={<Icon type="search" />} />
                                {/* <Icon type="search" /> */}
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
                                    dataSource={this.state.viewButton ? dataSource && dataSource.slice(0, 10) : dataSource}
                                    renderItem={item => (
                                        <List.Item className={this.state.activeId != null ?
                                            this.state.activeId === item.slug ? "active" : "disable-lists" : ""} onClick={() => this.handleOrganizationClick(item.slug)} >
                                            <Link to={{ pathname: this.props.match.path + '/showSmsTemplate', state: item.slug }}>
                                                <List.Item.Meta
                                                    avatar={<label>{abbrivationStr(item.temp_name)}</label>}
                                                    title={item.temp_name}
                                                    description={<div className="itm-amount-date">
                                                        <span>{item.amount}</span>
                                                        <span>{item.period}</span>
                                                    </div>}
                                                />
                                            </Link>
                                        </List.Item>

                                    )}
                                />
                            </ScrollArea>
                        </div>
                        {dataSource.length >= 10 ? <div className="sf-card-footer d-flex align-items-end justify-content-center" >
                            <button className="v-all-org" style={{ display: this.state.viewButton ? 'block' : 'none' }} onClick={this.handelViewAllClick}>{Strings.sms_view_all_btn}</button>
                        </div> : null}
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        smsTemplateList: state.smsTemplate && state.smsTemplate.smsTemplateList,
    }
}

export default withRouter(connect(mapStateToProps)(smsTemplateSearch))