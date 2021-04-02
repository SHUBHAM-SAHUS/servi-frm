import React from 'react';
import { Checkbox, Table, Input, Button, Popconfirm, Form } from "antd";

const CheckboxGroup = Checkbox.Group;

// const plainOptionsStaff1 = [
//     { label: 'Sunshine Rope', value: 1 },
//     { label: 'Impulse SA', value: 2 },
//     { label: 'Garden SA', value: 3 }
// ];
// const plainOptionsStaff2 = [
//     { label: 'Christiano Ronaldo', value: 1 - 2 },
//     { label: 'Steven Gerrard', value: 2 - 2 },
//     { label: 'Diego Maradona', value: 3 - 2 }
// ];
const plainOptionsStaff3 = [
    { label: 'Will Jones', value: 1 - 3 },
    { label: 'Sharon Song', value: 2 - 3 },
    { label: 'Ste Sale', value: 3 - 3 },
    { label: 'Pam Jones', value: 4 },
    { label: 'Si Daniels', value: 5 },
    { label: 'Dan Morrow', value: 6 },
    { label: 'Alfie Con', value: 7 },
    { label: 'Sim Jo', value: 8 },
    { label: 'Alison Becker', value: 9 },
    { label: 'Arnold Arnold', value: 10 },
    { label: 'Speakman Jones', value: 11 },
    { label: 'Daz Dazer', value: 12 },
    { label: 'ndigo', value: 13 },
    { label: 'David David', value: 14 },
];


var defaultCheckedList1 = [
    {
        name: "Sunshine Rope",
        selected: false
    },
    {
        name: "Impulse SA",
        selected: false
    },
    {
        name: "Garden SA",
        selected: false
    },
];

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
        super(props);
        this.state = {
            checkedListStaff: [],
            staffs: []
        };
    }

    onGroupChange1 = (checkedListStaff1) => {
        this.setState({
            checkedListStaff1,
        });
    }

    onGroupChange2 = (checkedListStaff2) => {
        this.setState({
            checkedListStaff2,
        });
    }

    onGroupChange3 = (checkedListStaff3) => {
        this.setState({
            checkedListStaff3,
        });
    }

    componentDidMount() {
        const staffs = this.state.staffs;
        staffs.push(1);
        this.setState({ staffs: staffs })
    }

    add = () => {
        const staffs = this.state.staffs;
        staffs && staffs.length == 0 ? staffs.push(1) : staffs.push(staffs.length + 1)
        this.setState({ staffs: staffs })
    }

    delete = () => {
        const staffs = this.state.staffs;
        staffs && staffs.length == 0 ? staffs.pop(1) : staffs.pop(staffs.length - 1)
        this.setState({ staffs: staffs })
    }

    handleClick1 = (i) => {
        defaultCheckedList1[i].selected = !defaultCheckedList1[i].selected;
        this.setState({ selected: !this.state.selected });
    }

    handleClick2 = (i) => {
        defaultCheckedList2[i].selected = !defaultCheckedList2[i].selected;
        this.setState({ selected: !this.state.selected });
    }

    render() {
        const { staffs } = this.state;

        return (
            <>
                {staffs && staffs.map((a, i) =>
                    <div className="add-tsk-main job-drcn-main">
                        <div className="row">
                            <div className="col-lg-2 col-md-6 col-sm-12 text-left mb-2" key={i}>
                                <label className="mb-2"><strong>Allocate SA</strong></label>
                                <div className="white-back">
                                    <ul className="check-icon">
                                        {
                                            defaultCheckedList1.map((item, i) =>
                                                <li onClick={() => this.handleClick1(i)}> {item.name} {item.selected === true && <i className="fa fa-check" aria-hidden="true"></i>}</li>
                                            )
                                        }

                                        {/* <li>Sunshine Rope <i className="fa fa-check" aria-hidden="true"></i></li>
                                        <li>Impulse SA </li>
                                        <li>Garden SA </li> */}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-2 col-md-6 col-sm-12 text-left mb-2">
                                <label className="mb-2"><strong>Allocate Site Supervisor</strong></label>
                                <div className="white-back">
                                    <ul className="check-icon">
                                        {
                                            defaultCheckedList2.map((item, i) =>
                                                <li onClick={() => this.handleClick2(i)}> {item.name} {item.selected === true && <i className="fa fa-check" aria-hidden="true"></i>}</li>
                                            )
                                        }

                                        {/* <li>Christiano Ronaldo <i className="fa fa-check" aria-hidden="true"></i></li>
                                        <li>Steven Gerrard </li>
                                        <li>Diego Maradona </li> */}
                                    </ul>
                                </div>
                            </div>
                            <div className="col-lg-5 col-md-8 col-sm-12 text-left">
                                <label className="mb-2"><strong>Allocate Site Supervisor</strong></label>
                                <div className="white-back staff-multi">
                                    <CheckboxGroup
                                        options={plainOptionsStaff3}
                                        onChange={this.onGroupChange3}
                                        value={this.state.checkedListStaff3}
                                    >
                                    </CheckboxGroup>
                                </div>
                            </div>
                        </div>

                        <div className="d-flex mt-3">
                            <div className="pull-left w-50">
                                <Button className="add-more p-0" onClick={() => this.add()}>ADD MORE STAFF +</Button>
                            </div>
                            <div className="pull-right w-50 text-right">
                                {staffs && staffs.length > 1 && (<Button className="mr-2 del-btn" type="primary" onClick={() => this.delete()}>Delete</Button>)}
                                <Button className="allocate-btn" type="primary">Allocate</Button>
                            </div>
                        </div>
                    </div>

                )}
            </>
        );
    }



}

export default AddStaff