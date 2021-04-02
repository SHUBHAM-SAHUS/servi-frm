import React from 'react';
import { Checkbox, Table, Icon } from "antd";

const CheckboxGroup = Checkbox.Group;
const columns = [
    // {
    //     title: 'Fill',
    //     dataIndex: 'fill',
    // },
    {
        title: 'Staff',
        className: 'text-center',
        dataIndex: 'staff',
    },
    {
        title: 'Position',
        className: 'text-center',
        dataIndex: 'position',
    },
    {
        // title: 'Job Induction',
        title: () => (
            <Checkbox onChange={onChange}>Job Induction</Checkbox>
        ),
        dataIndex: 'jobinduction',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a href="#" className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a href="#" className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        // title: 'Police Check',
        title: () => (
            <Checkbox onChange={onChange}>Police Check</Checkbox>
        ),
        dataIndex: 'policecheck',
        className: 'text-center',
    },
    {
        // title: 'Working with Children Check',
        title: () => (
            <Checkbox onChange={onChange}>Working with Children Check</Checkbox>
        ),
        dataIndex: 'workingwithchildrencheck',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a href="#" className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a href="#" className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        // title: 'White Card',
        title: () => (
            <Checkbox onChange={onChange}>White Card</Checkbox>
        ),
        dataIndex: 'whitecard',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a href="#" className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a href="#" className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        // title: 'First Aid',
        title: () => (
            <Checkbox onChange={onChange}>First Aid</Checkbox>
        ),
        dataIndex: 'firstaid',
        className: 'text-center',
    },
    {
        // title: 'Working At Heights',
        title: () => (
            <Checkbox onChange={onChange}>Working At Heights</Checkbox>
        ),
        dataIndex: 'workingatheights',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a href="#" className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a href="#" className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        // title: 'EWP Above 11m',
        title: () => (
            <Checkbox onChange={onChange}>EWP Above 11m</Checkbox>
        ),
        dataIndex: 'EWPabove11m',
        className: 'text-center',
    },
    {
        // title: 'EWP Below 11m',
        title: () => (
            <Checkbox onChange={onChange}>EWP Below 11m</Checkbox>
        ),
        dataIndex: 'EWPbelow11m',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a href="#" className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a href="#" className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        // title: 'Rope Access',
        title: () => (
            <Checkbox onChange={onChange}>Rope Access</Checkbox>
        ),
        dataIndex: 'ropeaccess',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a href="#" className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a href="#" className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
    {
        // title: 'Traffic Management',
        title: () => (
            <Checkbox onChange={onChange}>Traffic Management</Checkbox>
        ),
        dataIndex: 'trafficmanagement',
        className: 'text-center',
        render: () => (
            <span className="icon-tbl-main">
                <a href="#" className="pr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                <a href="#" className=""><i className="fa fa-download" aria-hidden="true"></i></a>
            </span>
        ),
    },
];



function onChange(e) {
}

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        name: record.name,
    }),
};

var defaultCheckedList = [];

class StaffList extends React.Component {
    state = {
        selectedRowKeys: [],
        loading: false,
    };


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

    render() {

        const { loading, selectedRowKeys } = this.state;
        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        const data = [];
        for (let i = 0; i < 10; i++) {
            data.push({
                key: i,
                staff: `Steven Gerrard ${i}`,
                position: `Site Supervisor ${i}`,
            });
        }

        return (
            <div className="add-tsk-main job-drcn-main">
                <label className="mb-2 text-left w-100"><strong>Staff List</strong></label>
                <div className="col-12 p-0 tabel-main-stafflist">
                    <div className="table-responsive">
                        <Table className="table-bordered staf-list-table-head"
                            rowSelection={rowSelection}
                            columns={columns}
                            dataSource={data}
                        />
                    </div>
                </div>
            </div>
        );
    }
};



export default StaffList