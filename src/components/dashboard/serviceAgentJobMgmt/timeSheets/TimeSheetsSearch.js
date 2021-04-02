import React from 'react';
import { List, Icon, AutoComplete, Input } from 'antd';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { withRouter } from "react-router-dom";
import { bindActionCreators } from 'redux';
import ScrollArea from 'react-scrollbar';
import * as actions from '../../../../actions/roleManagementActions';
import { Strings } from '../../../../dataProvider/localize';
import * as rolePermissionAction from '../../../../actions/permissionManagementAction';
import { abbrivationStr } from '../../../../utils/common';
import * as timeSheetAction from '../../../../actions/timeSheetAction';
import * as SAIncidentReportAction from '../../../../actions/SAIncidentReportActions';
import { getStorage } from '../../../../utils/common';
import { ADMIN_DETAILS } from '../../../../dataProvider/constant';
import * as sAJobMgmtAction from '../../../../actions/SAJobMgmtAction';

class TimeSheetsSearch extends React.Component {
    constructor(props) {
        super(props);
        this.state = { seacrhValue: '', viewButton: true, activeId: null }
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }

    componentDidMount() {
        console.log('State', this.props.location.state)
        this.setState({ viewButton: true, activeId: this.props.location.state.id });
    }

    componentWillReceiveProps(props) {
        if (!props.location.pathname.includes("showJob"))
            this.setState({ activeId: null });
    }

    handleJobClick = (job) => {
        console.log('Job', job)
        this.props.SAIncidentReportAction.getAllIncidentsByJobId(this.currentOrganization, job.id);
        this.props.SAIncidentReportAction.getAllHazardsByJobId(this.currentOrganization, job.id)
        this.props.sAJobMgmtAction.getJobDetails(job.job_number)
        this.props.sAJobMgmtAction.getJobReport(job.id);

        this.setState({ activeId: job.id });
        this.props.history.push({ pathname: this.props.match.path + '/showJob', state: job })

    }

    handelSearchChange = (seacrhValue) => {
        this.setState({ seacrhValue });
    }

    handelViewAllClick = () => {
        this.setState({ viewButton: false });
    }


    render() {
        const { jobsList } = this.props;
        const dataSource = jobsList.filter(job => job.job_number.toLowerCase().includes(this.state.seacrhValue.toLowerCase()));
        let activeJob = this.state.activeId == null ? jobsList && jobsList.length > 0 ? jobsList[0].id : null : this.state.activeId;
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
                                // dataSource={this.state.viewButton ? dataSource.map(job => job.job_number).slice(0, 5) : dataSource.map(job => job.job_number)}
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
                                        <List.Item className={activeJob != null ?
                                            activeJob === item.id ? "active" : "disable-lists" : ""} onClick={() => this.handleJobClick(item)} >
                                            <Link to={{ pathname: this.props.match.path + '/showJob', state: item.id }}>
                                                <List.Item.Meta
                                                    avatar={<label>{abbrivationStr(item && item.site_contact_name ? item.site_contact_name : '')}</label>}
                                                    title={item && item.job_name ? item.job_name : ''}
                                                    description={item && item.job_number ? item.job_number : ''}
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
                                    <button className="v-all-org" style={{ display: this.state.viewButton ? 'block' : 'none' }} onClick={this.handelViewAllClick}>{Strings.view_all_timesheets}</button>
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
        jobsList: state.timeSheet.jobsList,
        pageNumber: state.timeSheet.currentPageNumber,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        timeSheetAction: bindActionCreators(timeSheetAction, dispatch),
        SAIncidentReportAction: bindActionCreators(SAIncidentReportAction, dispatch),
        action: bindActionCreators(actions, dispatch),
        rolePermissionAction: bindActionCreators(rolePermissionAction, dispatch),
        sAJobMgmtAction: bindActionCreators(sAJobMgmtAction, dispatch),

    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToprops)(TimeSheetsSearch))