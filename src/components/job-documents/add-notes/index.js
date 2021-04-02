import React, { useState } from 'react';
import { Checkbox, Table, Input } from "antd";

const columns = [
    {
        title: 'Date',
        dataIndex: 'date',
        render: (text, record) => (
            <button className="btn add-sdul" disabled>Add Schedule</button>
        ),
    },
    {
        title: 'Start',
        dataIndex: 'start',
    },
    {
        title: 'Finish',
        dataIndex: 'finish',
    },
    {
        title: ' Scope',
        dataIndex: 'scope',
    },
    {
        title: 'Area',
        dataIndex: 'area',
    },
    {
        title: 'Side Requirements',
        dataIndex: 'side-requirements',
    },
];

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

    render() {

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
            <div className="add-tsk-main job-drcn-main">
                <div className="col-12 p-0 mt-2 white-back">
                    <div className="table-responsive ">
                        <Table className="add-note-main note-mn" columns={columns} dataSource={data} />
                    </div>
                    <div className="col-lg-8 col-md-8 col-sm-12 mt-2 mb-2 staff-text-tsk">
                        <TextArea
                            value={value}
                            disabled
                            onChange={this.onChange}
                            placeholder=""
                            autoSize={{ minRows: 3, maxRows: 5 }}
                        />
                    </div>
                </div>
            </div>

        );
    }
};

export default AddNotes