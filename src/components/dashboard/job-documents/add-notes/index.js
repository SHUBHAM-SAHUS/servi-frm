import React from 'react';
import { Input, Button, Collapse, Popover, notification } from 'antd';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Field, reduxForm, FormSection, FieldArray, getFormValues, autofill } from 'redux-form';
import _ from 'lodash';
import { withRouter } from 'react-router-dom';

import { CustomCheckbox } from '../../../common/customCheckbox';
import { customInput } from '../../../common/custom-input';
import { CustomDatepicker } from '../../../common/customDatepicker';
import { customTextarea } from '../../../common/customTextarea';

import { Strings } from '../../../../dataProvider/localize';
import moment from 'moment';
import { CustomTimePicker } from '../../../common/customTimePicker';
import { CustomReactTimePicker } from '../../../common/customReactTimePicker';
import { DeepTrim, getStorage } from '../../../../utils/common';
import * as actions from '../../../../actions/jobDocumentsAction';

const { Panel } = Collapse;

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
    }),
};


var defaultCheckedList = [];

class AddNotes extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
        value: '',
    };

    componentDidMount() {
        let { fillForm } = this.props;
        let array = []
        const jobId = getStorage('JOB_ID');
        let note = '';
        this.props.getJobDetails(jobId).then(res => {
            if (res && res.job_doc_details) {
                res.job_doc_details.map(doc => {
                    if (doc.job_doc_schedules) {
                        doc.job_doc_schedules.map(sch => {
                            var obj = {};
                            console.log(sch, 'schsch')
                            var date = sch.date ? new Date(sch.date) : new Date();
                            console.log(date, 'datedatedate----')
                            let splitFinish = sch.finish ? sch.finish.split(":") : []
                            let splitStart = sch.start ? sch.start.split(":") : []
                            if (splitFinish.length === 3)
                                obj['finish'] = sch.finish ? date.setHours(splitFinish[0], splitFinish[1], splitFinish[2]) : date.setHours(1, 0, 0);

                            if (splitStart.length === 3)
                                obj['start'] = sch.start ? date.setHours(splitStart[0], splitStart[1], splitStart[2]) : date.setHours(1, 0, 0);

                            obj['id'] = sch.id ? sch.id : '';
                            obj['date'] = sch.date ? sch.date : '';
                            obj['scope'] = sch.scope ? sch.scope : '';
                            obj['area'] = sch.area ? sch.area : '';
                            obj['site_requirements'] = sch.site_requirements ? sch.site_requirements : '';

                            array.push(obj)
                        })
                        note = doc.note;
                    }

                })
                console.log(array, 'arrayarray')
                fillForm(array, note)
            }
        })
    }
    start = () => {
        this.setState({ loading: true });
        setTimeout(() => {
            this.setState({
                selectedRowKeys: [],
                loading: false,
            });
        }, 1000);
    };

    onSelectChange = selectedRowKeys => {
        this.setState({ selectedRowKeys });
    };

    onChange = ({ target: { value } }) => {
        this.setState({ value });
    };

    onSubmit = async (formData) => {
        formData = await DeepTrim(formData);

        var service_agents = [];
        var job_allocated_users = [];
        var certificates = [];
        var schedules = [];
        var finalFormData = {};
        var service_agent_flag = true;
        if (this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 && this.props.scopeDocsDetails[0].client_id) {
            finalFormData.client_id = this.props.scopeDocsDetails[0].client_id;
        }
        if (formData.serviceAgents && formData.serviceAgents.length > 0) {
            formData.serviceAgents.forEach((service_agent, index) => {
                if (parseInt(service_agent)) {
                    return service_agents.push({
                        service_agent_id: parseInt(service_agent),
                        task_id: index
                    })
                }
            })
        }

        if (formData.jobAllocatedUsers) {
            Object.keys(formData.jobAllocatedUsers).map(staff => {
                if (staff && staff !== "undefined" && formData.jobAllocatedUsers[staff] && formData.jobAllocatedUsers[staff].toString() != "type") {
                    let allIds = staff.split("_");
                    var user_license = [];
                    if (formData.jobAllocatedUsers.type) {
                        Object.keys(formData.jobAllocatedUsers.type).map(licence => {
                            let licenceIds = licence.split("_");
                            if (allIds && allIds[0] && licenceIds[0] && allIds[1] && formData.jobAllocatedUsers.type[licence] && licenceIds && licenceIds[1] && licenceIds[1].toString() === allIds[1].toString() && allIds[0].toString() === licenceIds[0].toString()) {
                                if (licenceIds[2]) {
                                    user_license.push(licenceIds[2]);
                                }
                            }
                        })
                    }
                    if (allIds[1]) {
                        job_allocated_users.push({
                            user_name: allIds[1],
                            task_id: parseInt(allIds[0]),
                            user_license: _.uniq(user_license)
                        })
                    }
                }
            })
        }
        if (formData.certificates && formData.certificates.length > 0) {
            formData.certificates.map((certificate, index) => {
                if (certificate) {
                    certificates.push(index);
                }
            })
        }
        if (formData.schedule && formData.schedule.length > 0) {
            formData.schedule.map(item => {
                if (item && item.date) {
                    item.date = moment(item.date).format();
                }
                if (item.start) {
                    item.start = moment(item.start, "HH:mm:ss").format('HH:mm:ss');
                }
                if (item.finish) {
                    item.finish = moment(item.finish, "HH:mm:ss").format('HH:mm:ss');
                }
                if (item) {
                    schedules.push(item);
                }
            })
        }
        if (formData.note) {
            finalFormData.note = formData.note;
        }
        finalFormData.job_doc_number = this.state.job_doc_number;
        finalFormData.quote_id = this.state.quote_id;
        finalFormData.service_agents = service_agents;
        finalFormData.job_allocated_users = job_allocated_users;
        finalFormData.certificates = certificates;
        finalFormData.schedules = schedules;

        let job_doc_tasks = [];
        if (this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 && this.props.scopeDocsDetails[0].sites) {
            this.props.scopeDocsDetails[0].sites.forEach(site => {
                if (site && site.tasks && site.tasks.length > 0) {
                    site.tasks.forEach(task => {
                        if (task) {
                            if (task.service_agent_id === null || task.service_agent_id === undefined) {
                                if (formData.serviceAgents && formData.serviceAgents.length > 0) {
                                    var taskServiceAgent = service_agents.find(item => item.task_id == task.id);
                                    if (!taskServiceAgent) {
                                        service_agent_flag = false;
                                    }
                                } else {
                                    service_agent_flag = false;
                                }
                            }
                            if (task.id) {
                                job_doc_tasks.push(task.id);
                            }
                        }
                    })
                }
            })
        }

        finalFormData.job_doc_tasks = job_doc_tasks;
        if (service_agent_flag) {
            this.props.jobDocAction.createJobDoc(finalFormData, this.props.scopeDocsDetails[0].id).then(res => {
                this.setState({ saved: false })
                if (res.job_doc_number) {
                    this.setState({ job_doc_number: res.job_doc_number })
                }
                notification.success({
                    message: Strings.success_title,
                    description: res && res.message ? res.message : "Job doc created successfully",
                    onClick: () => { },
                    className: 'ant-success'
                });

                if (res.job_doc_number) {
                    this.props.history.push({ pathname: './showJobDoc', state: { job_doc_number: res.job_doc_number } });
                }
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
        } else {
            notification.error({
                message: Strings.error_title,
                description: Strings.service_agent_not_assign,
                onClick: () => { },
                className: 'ant-error'
            });
        }
    }

    renderStaffMembers = ({ fields, index, meta: { error, submitFailed } }) => {
        return (<Collapse className="sl-inductions" defaultActiveKey={['0']}>
            {this.state.serviceAgentArray[index] && this.state.serviceAgentArray[index].service_agent && this.state.serviceAgentArray[index].service_agent.name ? <Panel className="sli-table-items" header={this.state.serviceAgentArray[index].service_agent.name + " (SA)"} key={index}>
                <table className="table">
                    <tr className="up-jd-scop">
                        <th>{Strings.job_staff_name_position}</th>
                        {this.props.licenceType && this.props.licenceType.length > 0 ? this.props.licenceType.map(licence => {
                            if (licence && licence.name && licence.id);
                            return <th>
                                <Field name={`${this.state.serviceAgentArray[index].service_agent.task_id}-${licence.id}`} label={licence && licence.name ? licence.name : ''}
                                    component={CustomCheckbox}
                                    onChange={(value) => this.onChangeLicenceType(value, this.state.serviceAgentArray[index].service_agent.task_id, licence.id, index)}
                                /></th>
                        }) : ''}
                    </tr>
                    {this.state.serviceAgentArray[index] && this.state.serviceAgentArray[index].staff_users ? this.state.serviceAgentArray[index].staff_users.map(user => {
                        return <tr>
                            <td className="sli-name-chk">
                                <Field name={`${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}`} label={user && user.first_name ? user.first_name + " (" + user.role_name + ")" : ''} component={CustomCheckbox}
                                    onChange={(value) => { this.handleRemoveUser(value, this.state.serviceAgentArray[index].service_agent.task_id, user.user_name) }} />
                            </td>
                            {this.props.licenceType && this.props.licenceType.length > 0 ? this.props.licenceType.map(licence => {
                                if (user && user.organisation_user && user.organisation_user.user_licences && user.organisation_user.user_licences.length > 0) {
                                    let licienceObj = user.organisation_user.user_licences.filter(item => licence.id == item.type);
                                    if (licienceObj && licienceObj.length > 0) {
                                        return <td className="sli-name-chk">
                                            <FormSection name="type"><Field name={`${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}_${licienceObj[0].id}`} label={licienceObj && licienceObj[0].license_type_name ? licienceObj[0].license_type_name : ''} component={CustomCheckbox}
                                                onChange={(value) => { this.handlesingleLicenceCheck(value, `${this.state.serviceAgentArray[index].service_agent.task_id}_${user.user_name}`) }} />
                                            </FormSection>
                                            <div className="stff-action-bnt">
                                                <a href="#" onClick={() => this.downloadImage(licienceObj[0].license_type_name, licienceObj[0].image)}><i className="material-icons">get_app</i></a>
                                                <button type="button" className="normal-bnt" onClick={() => this.viewLicienceDetails(licienceObj[0])}><i className="material-icons">remove_red_eye</i></button></div>
                                        </td>
                                    } else {
                                        return <td></td>
                                    }
                                } else {
                                    return <td></td>
                                }
                            }) : ''}

                        </tr>
                    }) : ''}
                </table>
                <div id="sfPopOver" className="add-staff-f-lice">
                    <Popover className="normal-bnt add-line-bnt add-jd-staff-bnt"
                        placement="bottomLeft"
                        content={this.addStaff(this.state.serviceAgentArray[index])}
                        trigger="click"
                        getPopupContainer={() => document.getElementById('sfPopOver')}
                    >
                        <Button onClick={this.handleAddFilterState} ><i className="material-icons">add</i> Add Staff</Button>
                    </Popover>
                </div>
            </Panel> : ''
            }
        </Collapse>
        )
    }

    disableScheduleDate = (current) => {
        var startDate = moment(new Date());
        startDate = startDate.subtract(1, "days");
        return current && current.valueOf() < startDate;
    }

    renderScheduleMembers = ({ fields, meta: { error, submitFailed } }) => {
        let { isViewJob } = this.props;
        var startDate = this.props.scopeDocsDetails && this.props.scopeDocsDetails.length > 0 && this.props.scopeDocsDetails[0] && this.props.scopeDocsDetails[0].sites && this.props.scopeDocsDetails[0].sites[0] && this.props.scopeDocsDetails[0].sites[0].tasks && this.props.scopeDocsDetails[0].sites[0].tasks[0] && this.props.scopeDocsDetails[0].sites[0].tasks[0].start_date; //getting first start_date of first site's first task

        startDate = moment(startDate)._d;
        return (<>
            {fields.map((member, index) => (
                <tr key={index}>
                    <td>
                        <fieldset className="jc-calndr sf-form no-label">
                            <Field name={`${member}.date`} type="date" id="date"
                                disabledDate={this.disableScheduleDate}
                                disabled={isViewJob ? true : false}
                                component={CustomDatepicker} />
                        </fieldset>
                    </td>
                    <td>
                        <fieldset className="sf-form">
                            <Field name={`${member}.start`} placeholder="" disabled={isViewJob ? true : false} component={CustomReactTimePicker} />
                        </fieldset>
                    </td>
                    <td>
                        <fieldset className="sf-form">
                            <Field name={`${member}.finish`} component={CustomReactTimePicker} disabled={isViewJob ? true : false} />
                        </fieldset>
                    </td>
                    <td>
                        <fieldset className="sf-form">
                            <Field name={`${member}.scope`} placeholder={Strings.scope_jobd} type="text" component={customInput} disabled={isViewJob ? true : false} />
                        </fieldset>
                    </td>
                    <td>
                        <fieldset className="sf-form">
                            <Field name={`${member}.area`} placeholder={Strings.area_jobd} type="text" component={customInput} disabled={isViewJob ? true : false} />
                        </fieldset>
                    </td>
                    <td>
                        <fieldset className="sf-form">
                            <Field name={`${member}.site_requirements`} placeholder={Strings.site_requirements_jobd} type="text" component={customInput} disabled={isViewJob ? true : false} />
                        </fieldset>
                    </td>
                    {!isViewJob &&
                        <td><button className='delete-bnt' type='button' onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button></td>}

                </tr>
            ))}
            {!isViewJob &&
                <div className="btn-hs-icon sm-bnt bnt-error mt-4">
                    <button className="bnt bnt-normal" type="button" onClick={() => fields.push({ date: startDate })}>Add Schedule</button>
                    {submitFailed && error && <span className="error-input">{error}</span>}
                </div>
            }

        </>)
    }

    previewEmailClick = () => {
        const { staffLists, jobDetails, formValues, updateJobDocument, certificateList, selectedLicences,
            selectedDocuments, setJobView, isViewJob, setSelecteduser, selectedStaffUsers } = this.props;
        var arr = [];
        var arr2 = [];
        let users = [];

        selectedLicences.map(obj => {
            arr.push({ user_name: obj.user_name, id: obj.id })
            let indexOfUser = users.indexOf(obj.user_name);
            if (indexOfUser == -1) {
                users.push(obj.user_name)
            }
        })

        console.log(selectedStaffUsers, 'selectedStaffUsers=====')
        arr && arr.length > 0 && arr.map(a => {
            let value = {};
            if (arr2.length === 0) {
                value['user_name'] = a.user_name;
                value['user_license'] = [a.id];
                arr2.push(value);
            } else {
                const arr3 = arr2.filter(b => b.user_name === a.user_name);
                if (arr3 && arr3.length > 0) {
                    arr3[0].user_license.push(a.id);
                    var index = arr2.indexOf(arr3[0]);
                    arr2[index] = arr3[0];
                } else {
                    value['user_name'] = a.user_name;
                    value['user_license'] = [a.id];
                    arr2.push(value);
                }
            }
        })

        if (selectedStaffUsers && selectedStaffUsers.length > 0) {
            arr2 = [];
            selectedStaffUsers.map(a => {
                let value = {};
                value['user_name'] = a.obj.user_name;
                let license = [];
                a.type.map(b => {
                    license.push(b.id);
                })
                value['user_license'] = license;
                arr2.push(value);
                let indexOfUser = users.indexOf(a.obj.user_name);
                if (indexOfUser == -1) {
                    users.push(a.obj.user_name)
                }
            })
        }
        console.log('selectedLicences:-', selectedLicences, 'arr::55:---', arr2);


        var certies = [];
        certificateList.length > 0 && certificateList.forEach(ele => {
            certies.push(ele.id);
        })
        var jobAllocatedUsers = [];
        var license = [];
        staffLists.job_allocated_users && staffLists.job_allocated_users.length > 0 && staffLists.job_allocated_users.forEach(ele => {
            ele.user_license.split(",") && ele.user_license.split(",").map(obj => { license.push(Number(obj)) });
            // let indexOfUser = users.indexOf(obj.user_name);
            // if (indexOfUser == -1) {
            //     users.push(obj.user_name)
            // }
            jobAllocatedUsers.push({ user_name: ele.user_name.toString(), user_license: license })
        });

        setSelecteduser(users);
        let formValueUpdate = [];
        formValues.schedule && formValues.schedule.length > 0 && formValues.schedule.map(a => {
            // a.start = moment(a.finish).format("HH:mm:ss");
            let value = JSON.parse(JSON.stringify(a));
            value.finish = value.finish ? moment(value.finish).format("HH:mm:ss") : '';
            value.start = value.start ? moment(value.start).format("HH:mm:ss") : '';
            formValueUpdate.push(value);
        })
        console.log("ddddddd", formValues)
        var data = {
            job_doc_id: staffLists.id,
            job_id: jobDetails.id,
            quote_id: jobDetails.quote_id,
            note: formValues && formValues.note || '',
            job_allocated_users: arr2 && arr2.length > 0 ? arr2 : jobAllocatedUsers,
            certificates: selectedDocuments || [],
            schedules: formValues && formValueUpdate || [],
            client_id: jobDetails.client_id,
            job_doc_tasks: jobDetails.selected_tasks,
            job_number: jobDetails.job_number,
        };
        console.log(data, 'data=============F')
        updateJobDocument(data).then(res => {
            setJobView(true)
            notification.success({
                message: Strings.success_title,
                description: res && res.message ? res.message : "Job doc update successfully",
                onClick: () => { },
                className: 'ant-success'
            });
        }).catch((message) => {
            notification.error({
                message: Strings.error_title,
                description: message ? message : Strings.generic_error,
                onClick: () => { },
                className: 'ant-error'
            });
        });
    }

    cancelViewJob(value) {
        const { setJobView } = this.props;
        setJobView(value)
    }

    showEmailClient = (value) => {
        console.log("VALUE ::::: ", value);
        console.log("PROPS ::::: ", this.props.staffLists.job_doc_number);

        this.props.history.push({
            pathname: '/dashboard/jobEmail/emailDocument',
            state: {
                job_doc_number: this.props.staffLists.job_doc_number, quote_number: this.props.jobDetails.quote_number,
                client_id: this.props.jobDetails.client_id, org_id: this.props.jobDetails.org_id
            }
        })
    }

    render() {
        const { staffLists, jobDetails, formValues, isViewJob } = this.props;
        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;

        const data = [];
        for (let i = 0; i < 1; i++) {
            data.push({
                key: i,
                staff: `Steven Gerrard (Site Supervisor) ${i}`,
                position: `Site Supervisor ${i}`,
            });
        }

        const { TextArea } = Input;
        const { value } = this.state;
        return (
            <div className="add-tsk-main job-drcn-main p-0">
                <form onSubmit={this.onSubmit}>
                    <div className="sf-card-body p-0">
                        <div className="jd-staff-table">
                            <div className="table-responsive">
                                <table className="add-user-table table" >
                                    <tr>
                                        <th>{Strings.job_date}</th>
                                        <th>{Strings.job_start} </th>
                                        <th>{Strings.job_finish}</th>
                                        <th>{Strings.job_scope}</th>
                                        <th>{Strings.job_area}</th>
                                        <th>{Strings.job_site_requirements}</th>
                                        <th></th>
                                    </tr>
                                    <FieldArray name="schedule" component={this.renderScheduleMembers} />
                                </table>
                            </div>
                        </div>
                        {/* Add notes here */}
                        <div className="row">
                            <div className="col-md-8 col-sm-8 col-xs-12">
                                <fieldset className="sf-form">
                                    <Field
                                        name="note"
                                        type="text"
                                        label={isViewJob ? "Note" : "Add Notes"}
                                        disabled={isViewJob ? true : false}
                                        component={customTextarea} />
                                </fieldset>
                            </div>
                        </div>
                    </div>
                </form>
                {isViewJob ?
                    <div className="pull-right w-50 text-right">
                        <Button className="allocate-btn pl-4 pr-4 mr-2" type="default" onClick={() => this.cancelViewJob()}>Cancel</Button>
                        <Button className="allocate-btn pl-4 pr-4" type="primary" onClick={() => this.showEmailClient(value)}>Email Job Docs</Button>
                    </div>
                    :
                    <div className="pull-right w-50 text-right">
                        <Button onClick={this.previewEmailClick} className="allocate-btn pl-4 pr-4" type="primary">Preview & Email</Button>
                    </div>}

            </div>

        );
    }
};
// export default AddNotes;
const mapStateToProps = (state, ownProps) => {
    return {
        staffLists: state.jobDetailsReducer.staffList.length > 0 && state.jobDetailsReducer.staffList[0],
        jobDetails: state.jobDetailsReducer.jobDetails.length > 0 && state.jobDetailsReducer.jobDetails[0],
        formValues: getFormValues("AddNotes")(state),
        certificateList: state.jobDetailsReducer.certificateList,
        selectedLicences: state.jobDetailsReducer.selectedLicences,
        selectedStaffUsers: state.jobDetailsReducer.selectedStaffUsers,
        selectedDocuments: state.jobDetailsReducer.selectedDocuments,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        fillForm: (array, note) => {
            array.map((a, index) => {
                dispatch(autofill("AddNotes", `schedule[${index}].date`, a.date));
                dispatch(autofill("AddNotes", `schedule[${index}].start`, a.start));
                dispatch(autofill("AddNotes", `schedule[${index}].finish`, a.finish));
                dispatch(autofill("AddNotes", `schedule[${index}].scope`, a.scope));
                dispatch(autofill("AddNotes", `schedule[${index}].area`, a.area));
                dispatch(autofill("AddNotes", `schedule[${index}].site_requirements`, a.site_requirements));
                dispatch(autofill("AddNotes", `schedule[${index}].id`, a.id));
            });
            dispatch(autofill("AddNotes", `note`, note));
        },
        updateJobDocument: (data) => dispatch(actions.updateJobDocument(data)),
        getJobDetails: (jobId) => dispatch(actions.getJobDetails(jobId)),
        setJobView: (value) => dispatch(actions.setJobView(value)),
        setSelecteduser: (value) => dispatch(actions.setSelecteduser(value)),

    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    withRouter,
    reduxForm({
        form: 'AddNotes', enableReinitialize: true,
        // onSubmitFail: (errors, dispatch, sub, props) => {
        //     handleFocus(errors, "#");
        // }
    })
)(AddNotes)