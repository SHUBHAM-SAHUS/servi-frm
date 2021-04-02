import React from 'react';
import { Popover, Select, Checkbox, Icon } from 'antd';
import { connect } from 'react-redux';
import { reduxForm } from 'redux-form';
import _ from 'lodash';
import { compose } from 'redux';

import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../utils/common';
import { Strings } from '../../../dataProvider/localize';

const { Option } = Select;

class AddFilteredStaff extends React.Component {
    constructor(props) {
        super(props);
        this.state = { staffList: [], filteredStaffList: [], selectedLicience: [], selectedUser: [], allSelectedUserList: [] }
        this.currentOrganization = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }

    componentDidMount() {
        var optionArray = [];

        if (this.props.allStaffList && this.props.allStaffList.length > 0 && this.props.serviceAgent && this.props.serviceAgent.service_agent && this.props.serviceAgent.service_agent.service_agent_id) {
            var serviceAgentObject = this.props.allStaffList.find(item => item.service_agent.service_agent_id == this.props.serviceAgent.service_agent.service_agent_id);
            if (serviceAgentObject.staff_users && serviceAgentObject.staff_users.length > 0) {
                serviceAgentObject.staff_users.forEach(user => {
                    if (user && user.user_name && user.first_name) {
                        optionArray.push({ user_name: user.user_name, name: user.first_name });
                    }
                });
            }
        }

        if (this.props.licenceType && this.props.licenceType.length > 0) {
            this.props.licenceType.forEach(licience => {
                if (licience && licience.name) {
                    optionArray.push({ user_name: licience.name, name: licience.name });
                }
            })
        }
        this.setState({ staffList: optionArray });
    }
    selectValueforAddStaff = (selectedValues) => {
        if (this.props.allStaffList && this.props.allStaffList.length > 0 && this.props.serviceAgent && this.props.serviceAgent.service_agent && this.props.serviceAgent.service_agent.service_agent_id) {
            var serviceAgentObject = this.props.allStaffList.find(item => item.service_agent.service_agent_id == this.props.serviceAgent.service_agent.service_agent_id);

            // if (this.props.serviceAgent && this.props.serviceAgent.staff_users && this.props.serviceAgent.staff_users.length > 0) {
            //     var serviceAgentObject = this.props.serviceAgent;
            if (serviceAgentObject.staff_users && serviceAgentObject.staff_users.length > 0) {
                if (isNaN(parseInt(selectedValues))) {
                    let licienceListUser = [];
                    serviceAgentObject.staff_users.forEach(item => {
                        if (item && item.organisation_user && item.organisation_user.user_licences && item.organisation_user.user_licences.length > 0) {
                            item.organisation_user.user_licences.map(k => {
                                if (k.license_type_name.toString() === selectedValues.toString()) {
                                    licienceListUser.push(item);
                                }
                            })
                        }
                    })
                    let finalUserLicienceList = _.uniq([...this.state.filteredStaffList, ...licienceListUser])
                    this.setState({ filteredStaffList: finalUserLicienceList });
                    this.setState({ selectedLicience: [...this.state.selectedLicience, selectedValues] })

                } else {
                    let userObj = serviceAgentObject.staff_users.find(user => user.user_name.toString() === selectedValues.toString());
                    let userList = serviceAgentObject.staff_users.filter(user => user.first_name.toString() === userObj.first_name.toString());
                    let finalUserList = _.uniq([...this.state.filteredStaffList, ...userList])
                    this.setState({ filteredStaffList: finalUserList });
                    this.setState({ selectedUser: [...this.state.selectedUser, userObj.first_name] });
                }
            }
        }
    }

    deselectValueForAddStaff = (deselectedValue) => {
        this.setState({ selectedLicience: this.state.selectedLicience.filter(k => k.toString() !== deselectedValue.toString()) })
        if (isNaN(parseInt(deselectedValue))) {
            let deselectedUserList = [];
            this.state.filteredStaffList.forEach(user => {
                let existLicience = [];
                if (user && user.organisation_user && user.organisation_user.user_licences && user.organisation_user.user_licences.length > 0) {
                    if (this.state.selectedLicience && this.state.selectedLicience.length > 0) {
                        for (let licience of this.state.selectedLicience) {
                            let userLicience = user.organisation_user.user_licences.filter(k => k.license_type_name.toString() === licience.toString());
                            if (userLicience && userLicience.length > 0) {
                                existLicience.push(licience);
                            }
                        }
                    }
                }
                if (existLicience.length == 1) {
                    let checkedUserSelected = this.state.selectedUser.filter(selectedUser => selectedUser.toString() === user.first_name ? user.first_name.toString() : '');
                    if (_.isEmpty(checkedUserSelected)) {
                        deselectedUserList.push(user);
                    }
                }
            })
            if (deselectedUserList && deselectedUserList.length > 0) {
                let finalFilteredUserList = this.state.filteredStaffList;
                deselectedUserList.forEach(staff => {
                    let removeItem = _.remove(finalFilteredUserList, (user) => {
                        return staff.user_name.toString() === user.user_name.toString();
                    })
                })
                this.setState({ filteredStaffList: finalFilteredUserList });
            }
        } else {
            var deselectedUser = this.state.filteredStaffList.filter(item => item.user_name.toString() === deselectedValue.toString());
            let deselectedUserObjList = [];
            if (deselectedUser && deselectedUser.length > 0 && deselectedUser[0].first_name) {
                let deselectedName = deselectedUser[0].first_name;
                let deselectedUserList = this.state.filteredStaffList.filter(staff => staff.first_name.toString() === deselectedName.toString());
                if (deselectedUserList && deselectedUserList.length > 0) {
                    for (let userObj of deselectedUserList) {
                        let existLicienceFlag = false
                        if (userObj && userObj.organisation_user && userObj.organisation_user.user_licences && userObj.organisation_user.user_licences.length > 0) {
                            if (this.state.selectedLicience && this.state.selectedLicience.length > 0) {
                                for (let licience of this.state.selectedLicience) {
                                    let userLicience = userObj.organisation_user.user_licences.filter(k => k.license_type_name.toString() === licience.toString());
                                    if (userLicience && userLicience.length > 0) {
                                        existLicienceFlag = true;
                                        break;
                                    }
                                }
                            }
                        }
                        if (existLicienceFlag === false) {
                            deselectedUserObjList.push(userObj);
                        }
                    }
                }
            }
            if (deselectedUserObjList && deselectedUserObjList.length > 0) {
                let finalFilteredUserList = this.state.filteredStaffList;
                deselectedUserObjList.forEach(staff => {
                    let removeItem = _.remove(finalFilteredUserList, (user) => {
                        return staff.user_name.toString() === user.user_name.toString();
                    })
                })
                this.setState({ filteredStaffList: finalFilteredUserList });
            }
        }

    }



    onSubmitUserList = () => {
        if (this.props.serviceAgent && this.props.serviceAgent.service_agent && this.state.allSelectedUserList && this.state.allSelectedUserList.length > 0) {
            var serviceAgentObj = this.props.serviceAgent.service_agent;
            this.props.handleAddNewStaff(this.state.allSelectedUserList, serviceAgentObj);
        }
    }
    onChangeCheckBox = (event) => {
        if (event && event.target && event.target.checked && event.target.name) {
            this.setState({ allSelectedUserList: [...this.state.allSelectedUserList, event.target.name] });
        } else if (event && event.target && event.target.checked === false) {
            this.setState({ allSelectedUserList: this.state.allSelectedUserList.filter(item => item.toString() !== event.target.name.toString()) });
        }
    }

    onHandleCancel = () => {
        this.props.handleAddStaffCancelled();
    }

    render() {
        return (
            <div id="addStaffLince" className="searchStffPopu jd-add-staff-popover">
                <div id="addStaffDrop" className="add-staff-search form-group sf-form">
                    <Popover
                        placement="bottomLeft"
                        content={<div className="sub-popover-slt">
                            {this.state.filteredStaffList && this.state.filteredStaffList.length > 0 ? this.state.filteredStaffList.map(staff => {
                                if (staff && staff.first_name && staff.user_name) {
                                    return (<div className="staff-dtl-list">
                                        <Checkbox
                                            name={staff.user_name.toString()}
                                            onChange={this.onChangeCheckBox}
                                        >
                                            {staff.first_name}
                                        </Checkbox>
                                        {staff.organisation_user && staff.organisation_user.user_licences && staff.organisation_user.user_licences.length > 0 ? staff.organisation_user.user_licences.map(item => (
                                            <span className="staff-licence-list">{item && item.license_type_name ? item.license_type_name : ''}</span>
                                        )) : ''}
                                    </div>)
                                }
                            }) : ''}
                            <div className="all-btn multibnt mt-3 d-flex justify-content-end">
                                <div className="btn-hs-icon d-flex justify-content-between">
                                    {<button className="bnt bnt-normal" type="button" onClick={this.onHandleCancel}>
                                        {Strings.cancel_btn}</button>}
                                    {this.state.filteredStaffList && this.state.filteredStaffList.length > 0 ? <button className="bnt bnt-active" type="button" onClick={this.onSubmitUserList}>{Strings.add_staff_bnt}</button> : ''}
                                </div>
                            </div>
                        </div>}
                        trigger="hover"
                        getPopupContainer={() => document.getElementById('addStaffLince')}
                    >
                        <div className="select-wibg">
                            <Select
                                name="allocatedStaff"
                                placeholder="Select Staff Member or licience Type"
                                mode="tags"
                                onSelect={this.selectValueforAddStaff}
                                onDeselect={this.deselectValueForAddStaff}
                            >
                                {this.state.staffList && this.state.staffList.length > 0 ? this.state.staffList.map(item => (
                                    <Option value={item.user_name.toString()}>{item.name}</Option>
                                )) : null}
                            </Select>
                            <span className="srch-icons" data-icon="" data-js-prompt="&amp;#xe090;"></span>
                            <span className="ant-select-arrow"><Icon type="plus" /></span>
                        </div>
                    </Popover>
                </div>
                {/* <div className="all-btn multibnt mt-3 d-flex justify-content-end">
                    <div className="btn-hs-icon d-flex justify-content-between">
                        <button className="bnt bnt-normal" type="button">
                        {Strings.cancel_btn}</button>
                        <button type="button" className="bnt bnt-active">{Strings.add_staff_bnt}</button>
                    </div>
                </div> */}
            </div>
        );
    }
}

const mapStateToProps = (state, props) => {
    return {
        licenceType: state.profileManagement.licenceType,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        // SAJobMgmtAction: bindActionCreators(SAJobMgmtAction, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'addFilteredStaff', enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(AddFilteredStaff)