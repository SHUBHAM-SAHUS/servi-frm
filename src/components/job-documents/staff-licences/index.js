import React from 'react';
import { Checkbox, Table } from "antd";

const CheckboxGroup = Checkbox.Group;
const columns = [
    {
        title: 'Name (Position)',
        dataIndex: 'name',

    },
    {
        title: 'Induction',
        dataIndex: 'induction',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        title: 'Police Check',
        dataIndex: 'police-check',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        title: ' WWCC',
        dataIndex: 'wwcc',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        title: 'White Card',
        dataIndex: 'white-card',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        title: 'First Aid',
        dataIndex: 'first-aid',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        title: 'Working at Height',
        dataIndex: 'working-at-height',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        title: 'Rope Access',
        dataIndex: 'rope-access',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
];

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
    }),
};



// const { Table, Button } = antd;

var defaultCheckedList = [];

class StaffList extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
    };

    start = () => {
        this.setState({ loading: true });
        // ajax request after empty completing
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

    render() {

        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const data = [];

        const data1 = [];
        for (let i = 0; i < 6; i++) {
            data.push({
                key: i,
                name: `Steven Gerrard (Site Supervisor) ${i}`,
                position: `Site Supervisor ${i}`,
            });
        }

        return (
            <div className="add-tsk-main job-drcn-main defalut-mai">

                <div className="col-12 p-0 mt-2 white-back">
                    <label className="p-2 text-left w-100"><strong>Staff Licences/Inductions </strong></label>
                    <div className="table-responsive ">
                        <Table className="staff-licnce-main dflt-lcnc" columns={columns} dataSource={data} />
                    </div>
                </div>

            </div>

        );
    }
};



export default StaffList