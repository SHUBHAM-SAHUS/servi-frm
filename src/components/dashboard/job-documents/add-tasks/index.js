import React from 'react';
import { Checkbox } from "antd";

const CheckboxGroup = Checkbox.Group;
class AddTasks extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
            selected: null,
        };
    }

    onGroupChange = (checkedList) => {
        this.setState({
            checkedList,
        });
    }

    handleClick = (i) => {
        this.props.taskList[i].allocated = !this.props.taskList[i].allocated;
        this.setState({ selected: !this.state.selected });
    }

    render() {
        const { taskList } = this.props;
        return (
            <div className="add-tsk-main">
                <label className="mb-2"><strong>Allocate Tasks</strong></label>
                <div className="col-12 ">
                    <div className="check-icon dash-tsklist row">
                        {
                            taskList && taskList.map((item, i) =>
                                <div className="col-lg-4 col-md-6 col-sm-12 tsjd-lst sf-card" onClick={() => this.handleClick(i)}>
                                    <div className="list-tasks">
                                        <div className="job-doc-label mb-1"><b className="lbl-docs">Site Address : </b><span>{item.street_address}, {item.city}, {item.state}, {item.country}</span> </div>
                                        {item.allocated === true && <i className="fa fa-check" aria-hidden="true"></i>}
                                        <div className="job-doc-label"><div className="lbl-docs">
                                            <div className="tsk-hdg"> <b>Task :</b></div>
                                            <div className="tsk-lines pl-3">
                                                {item.tasks.length > 0 && item.tasks.map((task, i) =>
                                                    <div>
                                                        {task.job_task_label} {task.task_name}
                                                    </div>
                                                )}
                                            </div>
                                        </div> {item.title}</div>
                                    </div>
                                </div>
                            )
                        }
                    </div>
                </div>
            </div>

        );
    }
}

export default AddTasks