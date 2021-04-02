import React, { Fragment } from 'react';
import { Checkbox, Table, Input, Button, Popconfirm, Form, Collapse, notification } from "antd";
import { connect } from 'react-redux';
import { Strings } from '../../../../dataProvider/localize';

import * as actions from '../../../../actions/jobDocumentsAction';


const CheckboxGroup = Checkbox.Group;
var defaultCheckedList2 = [
    {
        name: "Christiano Ronaldo",
        selected: false
    },
    {
        name: "Steven Gerrard",
        selected: false
    },
    {
        name: "Diego Maradona",
        selected: false
    },
];

class AddStaff extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            checkedListStaff: [],
            staffs: [],
            MainIndex: -1,
            SelectStaff: null,
            staff: [],
            supervisors: [],
            selected: null,
            allocateSeleted: '',
            supervisorSeleted: '',
            //showSupervisors: true,
            staffCheckbox: [],
            disabled: false,
            allocatedId: [],
            allocateClicked: false,
            selectedStaffMembers: [],
            selectData: [],

            //new logic

            selectedServiceAgent: 0,
            selectedSupervisor: 0,
            selectedSupervisors: [],
            selectedStaffs: [],
            showSupervisors: false,
            showStaff: false,
            allocatedServiceAgents: [
            ],
            allocatedStaffs: [],

            // add-tasks
            checkedList: [],
            selected: null,
            selectedTasks: [],
            allocateComfirmed: false,
            selectedTasksList: [],
            addNewStaff: false,
        };
    }

    componentDidMount() {
        const { staffLists, setJobDocumentStep } = this.props;
        if (staffLists) {
            this.setState({ allocateComfirmed: true });
            setJobDocumentStep([1, 2]);
        }
        const staffs = this.state.staffs;
        staffs.push(1);
        this.setState({ staffs: staffs });
    }

    delete = (index) => {
        const currentServiceAgents = this.state.allocatedServiceAgents || [];
        const removedServiceAgent = currentServiceAgents.splice(index, 1);
        this.setState({ allocatedServiceAgents: removedServiceAgent })
    }

    allocateConfirm = () => {
        //debugger;
        const { allocatedServiceAgents, selectedTasks } = this.state;
        const { jobDetails, getServiceAgentAllStaff, setJobDocumentStep, setAllocatedServiceAgents } = this.props;
        console.log('allocatedServiceAgents:-', allocatedServiceAgents);
        var selectedStaff = [];

        this.setState({ allocateComfirmed: true });
        setJobDocumentStep([1, 2]);
        allocatedServiceAgents && allocatedServiceAgents.length > 0 && allocatedServiceAgents.forEach(ele => {

            ele.staffs.map(obj => {
                var arr = [];
                if (obj.selected) {
                    console.log(obj.user_name, 'obj.user_name')
                    obj && obj.user_licences && obj.user_licences.length > 0 && obj.user_licences.forEach(ele => {
                        arr.push(ele.id);
                    })
                    selectedStaff.push({ user_license: arr, user_name: obj.user_name });
                }
            });

            ele.supervisors.map(obj => {
                var arrSupLic = [];
                if (obj.selected) {
                    console.log(obj.user_name, 'obj.supervisors')
                    obj && obj.user_licences && obj.user_licences.length > 0 && obj.user_licences.forEach(ele => {
                        arrSupLic.push(ele.id);
                    })
                    selectedStaff.push({ user_license: arrSupLic, user_name: obj.user_name });
                }
            });
        });

        console.log(selectedStaff, 'selectedStaffselectedStaff-111111')
        var obj = {};
        for (var i = 0, len = selectedStaff.length; i < len; i++)
            obj[selectedStaff[i]['user_name']] = selectedStaff[i];
        selectedStaff = new Array();
        for (var key in obj)
            selectedStaff.push(obj[key]);
        console.log(selectedStaff, 'selectedStaffselectedStaff')
        var data = {
            job_doc_tasks: selectedTasks,
            job_number: jobDetails.job_number,
            client_id: jobDetails.client_id,
            quote_id: jobDetails.quote_id,
            job_id: jobDetails.id,
            job_allocated_users: selectedStaff,

        };
        setAllocatedServiceAgents(allocatedServiceAgents);
        getServiceAgentAllStaff(data).then(res => {
            notification.success({
                message: Strings.success_title,
                description: res && res.message ? res.message : "Job doc successfully",
                onClick: () => { },
                className: 'ant-success'
            });
        });
    }

    handleServiceAgent = (id, item) => {
        this.setState({
            selectedServiceAgent: item.id,
            showSupervisors: true,
            selectedSupervisors: item.site_supervisors,
            selectedStaffs: item.staffs
        });
    }

    handleSupervisor = (item) => {
        this.setState({ selectedSupervisor: item.id, showStaff: true });
    }

    handleSupervisorStaff = (item) => {
        const selectedStaff = this.state.selectedStaffMembers;
        var selected = [];
        if (selectedStaff.includes(item.id)) {
            selected = selectedStaff.filter(val => val !== item.id);
            this.setState({ selectedStaffMembers: selected });
        } else {
            this.setState({ selectedStaffMembers: [...this.state.selectedStaffMembers, item.id] });
        }
    }

    handleAllocateClick = (data) => {
        const { staffList } = this.props;
        const selectedServiceAgent = staffList.find(val => val.id === this.state.selectedServiceAgent);
        const selectedSupervisors = selectedServiceAgent.site_supervisors.map((item) => {
            return {
                ...item,
                selected: item.id === this.state.selectedSupervisor
            }
        });
        const selectedStaff = selectedServiceAgent.staffs.map((item) => {
            return {
                ...item,
                selected: this.state.selectedStaffMembers.includes(item.id)
            }
        });

        const allocatedServiceAgents = staffList.map((item) => {
            return {
                ...item,
                selected: item.id === selectedServiceAgent.id,
            }
        });

        const allocatedAgentStaffs = {
            id: selectedServiceAgent.id,
            staffs: selectedStaff,
            supervisors: selectedSupervisors,
            serviceAgents: allocatedServiceAgents
        }

        const currentServiceAgents = this.state.allocatedServiceAgents || [];
        currentServiceAgents.push(allocatedAgentStaffs);

        this.setState({
            allocatedServiceAgents: currentServiceAgents,
            selectedStaffMembers: [],
            selectedServiceAgent: 0,
            showSupervisors: false,
            selectedSupervisors: [],
            selectedStaffs: [],
            selectedSupervisor: 0,
            showStaff: false
        });


        //this.setState({ allocatedServiceAgents: [...currentServiceAgents, allocatedAgentStaffs] });
    }

    // add-tasks
    onGroupChange = (checkedList) => {
        this.setState({
            checkedList,
        });
    }

    handleClick = (i, item) => {
        const { jobDetails } = this.props;
        var arr = this.state.selectedTasks;
        var arr2 = this.state.selectedTasksList;
        if (arr.includes(item.id)) {
            arr.pop(item.id);
        } else {
            arr.push(item.id);
        }
        arr2.push(item);
        // jobDetails.sites[i].allocated = !jobDetails.sites[i].allocated;
        this.setState({ selected: !this.state.selected, selectedTasks: arr, selectedTasksList: arr2 });
    }

    addNewClick = () => {
        this.setState({ addNewStaff: true });
    }

    render() {
        const { staffList, taskList, jobDetails, staffLists, isViewJob } = this.props;
        const { allocatedServiceAgents, selectedServiceAgent, selectedStaffMembers, selectedSupervisor, allocateComfirmed, selectedTasksList, addNewStaff, selectedTasks } = this.state;
        const validateAllocation = () => {
            return (selectedServiceAgent !== 0 && selectedSupervisor !== 0 && (selectedStaffMembers.length > 0))
        }
        var selectedTask = [];
        var sitesDetails = [];
        jobDetails && jobDetails.sites && jobDetails.sites.forEach(ele => {
            ele.tasks && ele.tasks.forEach(obj => {
                sitesDetails.push(obj)
            });
        });

        sitesDetails && sitesDetails.length > 0 && sitesDetails.map(obj => {
            jobDetails.selected_tasks && jobDetails.selected_tasks.forEach(ele => {
                if (ele == obj.id) {
                    selectedTask.push(obj);
                }
            })
        });
        const { Panel } = Collapse;
        return (
            <>
                {!staffLists && (
                    <Fragment>
                        <div className="text-left mb-4" onClick={this.addTasks}>
                            <Collapse className="job-drcn-main p-0 swms-content-list sf-card mb-3 p-3" defaultActiveKey={['0']} onChange={this.callback}>
                                <Panel className="color-add border0" header="ADD TASKS" key="1">
                                    <div className="add-tsk-main">
                                        <label className="mb-2"><strong>Allocate Tasks</strong></label>
                                        <div className="col-12 ">
                                            <div className="check-icon dash-tsklist row">
                                                {jobDetails && jobDetails.sites && jobDetails.sites.length > 0 && jobDetails.sites.map((item, i) =>
                                                    <div className="col-lg-4 col-md-6 col-sm-12 tsjd-lst sf-card">
                                                        <div className="list-tasks">
                                                            <div className="job-doc-label mb-1"><b className="">Site Address : </b><span>{item.street_address}, {item.city}, {item.state}, {item.country}</span> </div>
                                                            <div className="job-doc-label"><div className="lbl-docs">
                                                                <div className="tsk-hdg"> <b>Task :</b></div>
                                                                <div className="tsk-lines pl-1">
                                                                    {item.tasks.length > 0 && item.tasks.map((task, i) =>
                                                                        <div className="lst-tskks" onClick={() => this.handleClick(i, task)}>
                                                                            {task.job_task_label} {task.task_name}
                                                                            {selectedTasks.includes(task.id) &&
                                                                                <i className="fa fa-check" aria-hidden="true"></i>
                                                                            }
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            </div> {item.title}</div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                        <div className="text-left hdg-mn addstaff-top-head mb-3">
                            <Collapse className="swms-content-list sf-card p-3" defaultActiveKey={['0']} onChange={this.callback}>
                                <Panel className="color-add border0" header="ADD STAFF" key="1">
                                    {/* ALLOCATED SERVICE AGENTS */}
                                    {allocatedServiceAgents && allocatedServiceAgents.length > 0 && allocatedServiceAgents.map((item, i) =>
                                        <div key={i} className="add-tsk-main " key={i}>
                                            <div className="row">
                                                {/* Site Agents */}
                                                {item.id}

                                                <div className="col-lg-2 col-md-6 col-sm-12 text-left mb-4 staff-lists-datas" key={i}>
                                                    <label className="mb-2"><strong>Allocate SA</strong></label>
                                                    <div className="whiteback-staff sf-card">
                                                        <ul className="check-icon dash-stafflist">
                                                            {
                                                                item.serviceAgents && item.serviceAgents.length > 0
                                                                && item.serviceAgents.map((item, id) =>
                                                                    <li key={id} > {item.name} {item.selected && <i className="fa fa-check" aria-hidden="true"></i>}</li>
                                                                )
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/* Bind Supervisors */}
                                                <div className="col-lg-2 col-md-6 col-sm-12 text-left mb-2 staff-lists-datas">
                                                    <label className="mb-2"><strong>Allocate Site Supervisor</strong></label>
                                                    <div className="whiteback-staff sf-card">
                                                        <ul className="check-icon dash-stafflist">
                                                            {
                                                                item.supervisors && item.supervisors.map((item, id) => {
                                                                    return (
                                                                        <li key={id}> {item.first_name} {item.selected && <i className="fa fa-check" aria-hidden="true"></i>}</li>
                                                                    )
                                                                })
                                                            }
                                                        </ul>
                                                    </div>
                                                </div>
                                                {/* BIND STAFF USERS */}
                                                {item.staffs && item.staffs.length > 0 &&
                                                    <div className="col-lg-5 col-md-8 col-sm-12 text-left staff-lists-datas">
                                                        <label className="mb-2"><strong>Allocate Site Staff</strong></label>
                                                        <div className="whiteback-staff sf-card staff-multi dash-stafflist">
                                                            {item.staffs.map((item, id) => {
                                                                return (
                                                                    <Checkbox
                                                                        key={id}
                                                                        indeterminate={false}
                                                                        checked={item.selected}
                                                                    >
                                                                        {item.first_name}
                                                                    </Checkbox>
                                                                )
                                                            })}
                                                        </div>
                                                    </div>
                                                }
                                            </div>
                                            <div className="d-flex mt-3">
                                                <div className="pull-right w-100 text-right">
                                                    {(allocatedServiceAgents && allocatedServiceAgents.length > 0) && (
                                                        <>
                                                            <Button className="mr-2 del-btn" type="primary" onClick={() => this.delete(i)}>Delete</Button>
                                                            <Button className="mr-2 del-btn" type="primary" onClick={() => this.addNewClick(i)}>ADD</Button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* ADD NEW ROW */}
                                    {/* NOT ALLOCATED ANY SERVICE AGENT */}
                                    {(addNewStaff || allocatedServiceAgents.length == 0) && (<div key="un-allocated-sa" className="add-tsk-main " key="un-allocated-sa">
                                        <div className="row">
                                            {/* Site Agents */}
                                            <div className="col-lg-2 col-md-6 col-sm-12 text-left mb-4 staff-lists-datas" key="un-allocated-sa">
                                                <label className="mb-2"><strong>Allocate SA</strong></label>
                                                <div className="whiteback-staff sf-card">
                                                    <ul className="check-icon dash-stafflist">
                                                        {
                                                            staffList && staffList.length > 0 && staffList.map((item, id) =>
                                                                <li key={id} onClick={() => this.handleServiceAgent(item.id, item)}> {item.name}
                                                                    {item.id === this.state.selectedServiceAgent && <i className="fa fa-check" aria-hidden="true"></i>}</li>
                                                            )
                                                        }
                                                    </ul>
                                                </div>
                                            </div>

                                            {/* Bind Supervisors */}
                                            {this.state.showSupervisors && <div className="col-lg-2 col-md-6 col-sm-12 text-left mb-2 staff-lists-datas">
                                                <label className="mb-2"><strong>Allocate Site Supervisor</strong></label>
                                                <div className="whiteback-staff sf-card">
                                                    <ul className="check-icon dash-stafflist">
                                                        {
                                                            this.state.selectedSupervisors && this.state.selectedSupervisors.length > 0 && this.state.selectedSupervisors.map((item, id) => {
                                                                return (
                                                                    <li key={id} onClick={() => this.handleSupervisor(item)}> {item.first_name}
                                                                        {item.id == this.state.selectedSupervisor && <i className="fa fa-check" aria-hidden="true"></i>}</li>
                                                                )
                                                            })
                                                        }
                                                    </ul>
                                                </div>
                                            </div>}
                                            {/* STAFF SECTION */}
                                            {
                                                this.state.showStaff && this.state.selectedStaffs && this.state.selectedStaffs.length > 0 &&
                                                <div className="col-lg-5 col-md-8 col-sm-12 text-left staff-lists-datas">
                                                    <label className="mb-2"><strong>Allocate Site Staff</strong></label>
                                                    <div className="whiteback-staff sf-card staff-multi dash-stafflist">
                                                        {
                                                            this.state.selectedStaffs.map((item, id) => {
                                                                return (
                                                                    <Checkbox
                                                                        key={id}
                                                                        onClick={() => this.handleSupervisorStaff(item)}
                                                                        indeterminate={false}
                                                                        // onChange={this.onCheckAllChange}
                                                                        checked={selectedStaffMembers.includes(item.id)}
                                                                    >
                                                                        {item.first_name}
                                                                    </Checkbox>
                                                                )
                                                            })
                                                        }
                                                    </div>
                                                </div>
                                            }
                                        </div>
                                        <div className="d-flex mt-3">
                                            {validateAllocation() && <div className="pull-right w-100 text-right">
                                                <Button onClick={() => this.handleAllocateClick()} className="allocate-btn" type="primary">Allocate</Button>
                                            </div>}
                                        </div>
                                    </div>)}
                                    <div className="pull-right">
                                        {this.state.allocatedServiceAgents.length > 0 && (<Button onClick={() => this.allocateConfirm()} className="btn confirm-btn">Confirm Allocation</Button>)}
                                    </div>
                                </Panel>
                            </Collapse>
                        </div>
                    </Fragment>)}
                {staffLists && (
                    <div className="">
                        <Collapse className="job-drcn-main p-0 swms-content-list sf-card mb-3 p-3" defaultActiveKey={['0']} onChange={this.callback}>
                            <Panel className="color-add border0" header={isViewJob ? "SERVICE TASKS" : "ADDED TASKS"} key="1">
                                <div className="add-tsk-main">
                                    <label className="mb-2"><strong>Allocate Tasks</strong></label>
                                    <ul>
                                        {selectedTask && selectedTask.length > 0 && selectedTask.map((item, i) =>
                                            <div key={i} className="">
                                                <li key={i}> {item.job_task_label} - {item.task_name}</li>
                                            </div>
                                        )}
                                    </ul>
                                </div>
                            </Panel>
                        </Collapse>
                    </div>
                )}
            </>
        );
    }

}

const mapStateToProps = (state, ownProps) => {
    return {
        staffList: state.jobDocuments.staffList,
        jobDetails: state.jobDetailsReducer.jobDetails.length > 0 && state.jobDetailsReducer.jobDetails[0],
        staffLists: state.jobDetailsReducer.staffList.length > 0 && state.jobDetailsReducer.staffList[0],
    }
}

const mapDispatchToprops = dispatch => {
    return {
        getServiceAgentAllStaff: (data) => dispatch(actions.setServiceAgentAllStaff(data)),
        setJobDocumentStep: (data) => dispatch(actions.setJobDocumentStep(data)),
        setAllocatedServiceAgents: (data) => dispatch(actions.setAllocatedServiceAgents(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(AddStaff);