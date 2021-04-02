import React from 'react';
import { Checkbox } from "antd";

const CheckboxGroup = Checkbox.Group;
// const plainOptions = [
//     { label: 'T1f1J1Q155v1 – External Façade Cleaning via Rope Access', value: 1 },
//     { label: 'T3f1J1Q155v1 – Internal Glass Cleaning', value: 2 },
//     { label: 'T4f1J1Q155v1 – Admin Area – Internal Window Cleaning', value: 3 }
// ];



var defaultCheckedList = [
    {
        name: "T1f1J1Q155v1 – External Façade Cleaning via Rope Access",
        selected: false
    },
    {
        name: "T3f1J1Q155v1 – Internal Glass Cleaning",
        selected: false
    },
    {
        name: "T4f1J1Q155v1 – Admin Area – Internal Window Cleaning",
        selected: false
    },
];

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

    // handleClick = (i) => {
    //     defaultCheckedList[i].selected = !defaultCheckedList[i].selected;
    //     this.setState({ selected: !this.state.selected });
    // }

    render() {
        return (
            <div className="add-tsk-main">
                <label className="mb-2"><strong>Service  Tasks</strong></label>
                <div className="col-lg-5 col-md-6 col-sm-12 pl-0 white-back">
                    {/* <CheckboxGroup
                        options={plainOptions}
                        onChange={this.onGroupChange}
                        value={this.state.checkedList}
                    >
                    </CheckboxGroup> */}

                    <ul className="mb-2">
                        {
                            defaultCheckedList.map((item, i) =>
                                <li > {item.name}</li>
                            )
                        }

                        {/* <li> <i className="fa fa-check" aria-hidden="true"></i></li>
                        <li></li> */}
                    </ul>
                </div>
            </div>

        );
    }



}

export default AddTasks