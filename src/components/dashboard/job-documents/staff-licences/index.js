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
    },
    {
        title: 'Police Check',
        dataIndex: 'police-check',
    },
    {
        title: ' WWCC',
        dataIndex: 'wwcc',
    },
    {
        title: 'White Card',
        dataIndex: 'white-card',
    },
    {
        title: 'First Aid',
        dataIndex: 'first-aid',
    },
    {
        title: 'Working at Height',
        dataIndex: 'working-at-height',
    },
    {
        title: 'Rope Access',
        dataIndex: 'rope-access',
    },
];

const rowSelection = {
    onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
    }),
};



// const { Table, Button } = antd;

var defaultCheckedList = [];

class StaffLicenseList extends React.Component {
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
        let { allStaffList, staffLists, licencesTypes } = this.props;
        const { loading, selectedRowKeys } = this.state;

        var allStaffs = [];
        var seletStaffDetails = [];
        allStaffList && allStaffList.length > 0 && allStaffList.forEach(ele => {
            ele.staffs.map(obj => {
                allStaffs.push(obj)
            })
        });
        allStaffs && allStaffs.length > 0 && allStaffs.forEach(ele => {
            staffLists && staffLists.length > 0 && staffLists[0].job_allocated_users.map(obj => {
                if (obj.user_name == ele.user_name) {
                    seletStaffDetails.push(ele);
                }
            });
        });

        const rowSelection = {
            selectedRowKeys,
            onChange: this.onSelectChange,
        };
        const hasSelected = selectedRowKeys.length > 0;
        // const data = [];

        // const data1 = [];
        // for (let i = 0; i < 6; i++) {
        //     data.push({
        //         key: i,
        //         name: `Steven Gerrard (Site Supervisor) ${i}`,
        //         position: `Site Supervisor ${i}`,
        //     });
        // }
        var obj = {};
        for (var i = 0, len = seletStaffDetails.length; i < len; i++)
            obj[seletStaffDetails[i]['user_name']] = seletStaffDetails[i];
        seletStaffDetails = new Array();
        for (var key in obj)
            seletStaffDetails.push(obj[key]);

        const data = [];

        if (seletStaffDetails && seletStaffDetails.length > 0) {
            seletStaffDetails.map((obj, i) => {
                data.push({
                    key: i,
                    name: obj.first_name + ' (' + obj.role_name + ')', 
                    type: obj.user_licences
                });
            })
        }
        var headers = [];
        console.log(data, 'data')
        const columns = [
            {
                title: 'Name (Position)',
                className: '',
                dataIndex: 'name',
            }
        ];
        columns.map(obj => {
            headers.push(obj);
        })
        licencesTypes && licencesTypes.length > 0 && licencesTypes.forEach(ele => (
            headers.push({
                title: () => (
                    ele.name
                ),
                dataIndex: ele.id,
                className: 'text-center',
                type: ele.id,
                render: (text, record) => {
                    return (
                        record && record.type.length > 0 && record.type.map(obj => {
                            if (obj.type == ele.id) {
                                return (
                                    <span className="icon-tbl-main">
                                        <a href="#" onClick={() => window.open(obj.image, '_blank')} className="pr-3">
                                            <i className="fa fa-eye" aria-hidden="true"></i></a>
                                        <a href="#" className=""><i className="fa fa-download" aria-hidden="true"></i></a>
                                    </span>
                                )
                            }
                        })
                    )
                },
            })
        ));
        return (
            <div className="add-tsk-main job-drcn-main">

                <div className="col-12 p-0 mt-2 white-back">
                    <label className="p-2 text-left w-100"><strong>Staff Licences/Inductions </strong></label>
                    <div className="table-responsive ">
                        <Table className="table-bordered staf-list-table-head" columns={headers} dataSource={data} />
                    </div>
                </div>

            </div>

        );
    }
};



export default StaffLicenseList