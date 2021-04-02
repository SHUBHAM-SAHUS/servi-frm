import React from 'react';
import { Checkbox, Table, Icon, Modal, Button } from "antd";
import { connect } from 'react-redux';
import * as actions from '../../../../actions/jobDocumentsAction';
import { PDFObject } from 'react-pdfobject'

const CheckboxGroup = Checkbox.Group;

class StaffList extends React.Component {
    state = {
        selectRowKeys: [],
        loading: false,
        visible: false,
        selectedHead: [],
        document: '',
        isPdfDocument: false
    };

    onSelectChange = (selectedRowKeys, seletStaffDetails) => {
        let { setSelecteduser, setSeletedStaffUsers } = this.props;
        this.setState({ selectRowKeys: selectedRowKeys });
        setSeletedStaffUsers(seletStaffDetails);
        setSelecteduser([]);

    };

    handleCancel = (e) => {
        this.setState({
            visible: false,
        });
    }

    handleOk = (e) => {
        this.setState({
            visible: false,
        });
    }

    checkValMatch = () => {

    }

    headerClick = (head, seletStaffDetail) => {
        console.log(head, 'head----')
        let { setSeletedStaffUsers, setSelecteduser } = this.props;
        setSeletedStaffUsers([]);
        setSelecteduser([]);
        let { selectedHead } = this.state;
        var selectedHeader = this.state.selectedHead || [];
        var seletStaffDetails = seletStaffDetail;
        console.log(head, seletStaffDetail, 'head---')
        var checkIsExist = selectedHeader && selectedHeader.length > 0 && selectedHeader.some(obj => obj.id == head.id);
        if (!checkIsExist) {
            selectedHeader.push(head);
        } else {
            selectedHeader = selectedHeader.filter(obj => obj.id != head.id);
        }
        this.setState({ selectedHead: selectedHeader });

        var allLicence = [];
        var arr = [];
        let selectedRow = []
        seletStaffDetails.length > 0 && seletStaffDetails.map((staff, index) => {
            let isRewSelect = [];
            staff.user_licences && staff.user_licences.length > 0 && staff.user_licences.map(licence => {
                allLicence.push(licence);
                let islicense = selectedHeader.filter(he => he.id === licence.type)
                if (islicense && islicense.length > 0) {
                    if (isRewSelect.indexOf(licence.type) === -1) {
                        isRewSelect.push(licence.type);
                    }
                }

            })
            if (selectedHeader.length > 0 && isRewSelect.length === selectedHeader.length) {
                selectedRow.push(index)
            }
            isRewSelect = [];
        });
        this.setState({ selectRowKeys: selectedRow });
        console.log(selectedHeader, 'selectedHeader=====')
        allLicence && allLicence.length > 0 && allLicence.map(licence => {
            selectedHeader && selectedHeader.length > 0 && selectedHeader.filter(selected => {
                if (licence.type == selected.id) {
                    arr.push(licence);
                }
            })
        });
        // selectedHeader.map(head => {
        //     seletStaffDetails.map(staff)
        // })
        console.log(seletStaffDetails, 'seletStaffDetailsseletStaffDetails', allLicence)
        console.log(selectedHead, 'selectedHead', arr, 'SeletedStaffLicenc')
        this.props.setSeletedStaffLicences(arr);
    }

    viewDocument = (obj) => {
        if (obj) {
            if (obj.image.split('.').pop().split(/\#|\?/)[0] === 'pdf') {
                this.setState({ visible: true, document: obj.image, isPdfDocument: true });
            } else {
                this.setState({ visible: true, document: obj.image, isPdfDocument: false });
            }
        }
    }

    render() {
        const { loading, selectRowKeys } = this.state;
        // console.log(selectedRowKeys, 'selectedRowKeysF')
        const { staffLists, selected, selectedStaff, staffList, jobDetails, licencesTypes, selecteduser } = this.props;
        var allStaffsAndSupervisor = [];
        var seletStaffDetails = [];
        staffList && staffList.length > 0 && staffList.forEach(ele => {
            ele.staffs.map(obj => {
                allStaffsAndSupervisor.push(obj)
            })
            ele.site_supervisors.map(obj => {
                allStaffsAndSupervisor.push(obj)
            })
        });
        allStaffsAndSupervisor && allStaffsAndSupervisor.length > 0 && allStaffsAndSupervisor.forEach(ele => {
            staffLists && staffLists.job_allocated_users.map(obj => {
                if (obj.user_name == ele.user_name) {
                    seletStaffDetails.push(ele);
                }
            });
        });

        var obj = {};
        for (var i = 0, len = seletStaffDetails.length; i < len; i++)
            obj[seletStaffDetails[i]['user_name']] = seletStaffDetails[i];
        seletStaffDetails = new Array();
        for (var key in obj)
            seletStaffDetails.push(obj[key]);


        const data = [];
        console.log(seletStaffDetails, 'seletStaffDetails---', staffLists && staffLists.job_allocated_users)
        if (seletStaffDetails && seletStaffDetails.length > 0) {
            seletStaffDetails.map((obj, i) => {
                data.push({
                    key: i,
                    staff: obj.first_name,
                    position: obj.role_name,
                    type: obj.user_licences,
                    obj: obj
                });
            })
        }

        let selectedRow = []
        console.log(data, 'datadata')
        if (selecteduser && selecteduser.length > 0) {
            data.map((a, index) => {
                if (selecteduser.indexOf(a.obj.user_name) > -1) {
                    selectedRow.push(index);
                }
            })
        }
        let selectedRowKeys = selectRowKeys && selectRowKeys.length > 0 ? JSON.parse(JSON.stringify(selectRowKeys)) : [];
        if (selectedRow.length > 0) {
            selectedRowKeys = selectedRow;
        }
        const rowSelection = {
            selectedRowKeys,
            seletStaffDetails,
            onChange: this.onSelectChange,
        };

        var headers = [];
        const columns = [
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
        ];
        columns.map(obj => {
            headers.push(obj);
        })

        console.log(licencesTypes, 'licencesTypes')
        licencesTypes && licencesTypes.length > 0 && licencesTypes.forEach(ele => (
            headers.push({
                title: () => (
                    <Checkbox onChange={() => this.headerClick(ele, seletStaffDetails)}>{ele.name}</Checkbox>
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
                                        <a href="javascript:void(0)" onClick={() => this.viewDocument(obj)} className="pr-3">
                                            <i className="fa fa-eye" aria-hidden="true"></i></a>
                                        <a href="javascript:void(0)" className=""
                                            onClick={() => this.viewDocument()}
                                        ><i className="fa fa-download" aria-hidden="true"></i></a>
                                    </span>
                                )
                            }
                        })
                    )
                },
            })
        ));
        return (
            <div className="add-tsk-main job-drcn-main" >
                < div className="col-12 p-0 tabel-main-stafflist" >
                    <div className="table-responsive">
                        <Table className="table-bordered staf-list-table-head"
                            rowSelection={rowSelection}
                            columns={headers}
                            // onRowClick={() => info()}
                            dataSource={data}
                            scroll={{ x: 'auto ' }}
                        />
                    </div>
                </div>

                <div className="docmnt-lists-mn">
                    <Modal
                        title="Licence Details"
                        visible={this.state.visible}
                        onOk={this.handleOk}
                        onCancel={this.handleCancel}
                        width={1500}
                    >
                        {this.state.isPdfDocument ? <div className="w-100 pdf-main-mdl">
                            <PDFObject url='https://arxiv.org/pdf/quant-ph/0410100.pdf' />
                        </div> :
                            <div className="w-100 text-center mb-3">
                                <img src={this.state.document} />
                            </div>
                        }
                    </Modal>
                </div>
            </div>
        );
    }
};

const mapStateToProps = (state, ownProps) => {
    return {
        staffLists: state.jobDetailsReducer.staffList && state.jobDetailsReducer.staffList.length > 0 && state.jobDetailsReducer.staffList[0],
        selectedStaff: state.jobDetailsReducer.selectedStaff,
        selectedLicences: state.jobDetailsReducer.selectedLicences,
        staffList: state.jobDocuments.staffList,
        jobDetails: state.jobDetailsReducer.jobDetails.length > 0 && state.jobDetailsReducer.jobDetails[0],
        licencesTypes: state.jobDetailsReducer.licencesTypes,
        selecteduser: state.jobDetailsReducer.selecteduser,

    }
}

const mapDispatchToprops = dispatch => {
    return {
        setSeletedStaffLicences: (data) => dispatch(actions.setSeletedStaffLicences(data)),
        setSeletedStaffUsers: (data) => dispatch(actions.setSeletedStaffUsers(data)),
        setSelecteduser: (value) => dispatch(actions.setSelecteduser(value)),
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(StaffList);
