import React, { Fragment } from 'react';
import { Image, Icon, Button, Table, Checkbox, Input } from 'antd';
import { connect } from 'react-redux';
// import AddTasks from './add-tasks';
// import AddStaff from './add-staff';
// import Document from './document';
// import StaffList from './staff-list';
// import StaffLicences from './staff-licences';
// import AddNotes from './add-notes';
import Logo from "../../../../images/logo.jpg";
import * as actions from '../../../../actions/jobDocumentsAction';
import { goBack, goBackBrowser } from "../../../../utils/common";

const CheckboxGroup = Checkbox.Group;
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

const schedulecolumns = [
    {
        title: 'Date',
        dataIndex: 'date',
        // render: (text, record) => (
        //     <button className="btn add-sdul" disabled>Add Schedule</button>
        // ),
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
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
    },
    getCheckboxProps: record => ({
        disabled: record.name === 'Disabled User',
        // Column configuration not to be checked
        name: record.name,
    }),
};

// callback = (key) => {
//     console.log(key);
// }


var defaultCheckedList = [];


class JobDocumentHistoryView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
            selected: null,
            workCover: false,
            liability: false,
            swms: false,
            msdmExit: false,
            msdmReeboot: false,
            msdmFresh: false,
            selectedRowKeys: [],
            loading: false,
            value: '',
        }

    }

    componentDidMount() {

    }

    onGroupChange = (checkedList) => {
        this.setState({
            checkedList,
        });
    }


    onGroupChange = (checkedList) => {
        this.setState({
            checkedList,
        });
    }

    jobDocumentClick = (key) => {
        this.setState({ [key]: !this.state[key] })
    }

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
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
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
        console.log('selectedRowKeys changed: ', selectedRowKeys);
        this.setState({ selectedRowKeys });
    };

    onChange = ({ target: { value } }) => {
        this.setState({ value });
    };


    render() {
        const { staffList, certificateList, step, staffLists, jobDocVersionHistory } = this.props;
        let jobDetails = jobDocVersionHistory && jobDocVersionHistory.job_doc_data &&
            jobDocVersionHistory.job_doc_data.job_details && jobDocVersionHistory.job_doc_data.job_details.length > 0 ?
            jobDocVersionHistory.job_doc_data.job_details[0] : undefined
        const {
            workCover, liability, swms, msdmExit, msdmReeboot, msdmFresh,
        } = this.state;

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
            <>
                <div className="main-container white-back pb-5">
                    <div className="col-12 header-main header-bs mb-3">
                        <div className="d-flex ">
                            <div className="pull-left hed-img d-flex">
                                <h2 className="page-mn-hd">
                                    <Icon
                                        type="arrow-left"
                                        onClick={() => goBack(this.props)}
                                    />
                                </h2>
                                <img
                                    width={50}
                                    src={Logo}
                                />
                            </div>
                            <div className="full-right hed-text">
                                <h1>JOB DOCUMENTS</h1>
                            </div>
                            <div className="pull-right link-head-main">
                                <div className="link-head">Link Expires: 30days</div>
                            </div>
                        </div>
                    </div>

                    <div className="col-12 job-drcn-main job-drcn-main defalut-mai">
                        <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12 pt-2 pb-2 text-left">
                                <div className="">
                                    <b>From:- </b>
                                </div>
                                <div className="">
                                    <b>Business Name: </b> {jobDetails && jobDetails.businessName || ''}
                                </div>
                                <div className="">
                                    <b>ABN: </b>{jobDetails && jobDetails.client_abn_acn || ''}
                                </div>
                                <div className="">
                                    <b>Address: </b> {jobDetails && jobDetails.address || ''}
                                </div>
                                <div className="">
                                    <b>Phone: </b>{jobDetails && jobDetails.phone_number || ''}
                                </div>
                                <div className="">
                                    <b>Email: </b> {jobDetails && jobDetails.email_address || ''}
                                </div>
                                <div className="">
                                    <b>Job Name: </b>  {jobDetails && jobDetails.job_name || ''}
                                </div>
                            </div>

                            <div className="col-lg-6 col-md-6 col-sm-12 pt-2 pb-2 text-left">
                                <div className="">
                                    <b>To:- </b>
                                </div>
                                <div className="">
                                    <b>Client Name: </b> {jobDetails && jobDetails.client_name || ''}
                                </div>
                                <div className="">
                                    <b>Primary Contact: </b> {jobDetails && jobDetails.client_name || ''}
                                </div>
                                <div className="">
                                    <b>Phone Number: </b> {jobDetails && jobDetails.client_person_phone || ''}
                                </div>
                                <div className="">
                                    <b>ABN: </b>  {jobDetails && jobDetails.client_abn_acn || ''}
                                </div>
                                <div className="">
                                    <b>Address: </b> {jobDetails && jobDetails.client_address || ''}
                                </div>
                                <div className="">
                                    <b>Email: </b>{jobDetails && jobDetails.client_person_email || ''}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* <AddTasks /> */}
                    {/* <div className="text-left defalut-mai" onClick={this.addTasks}>

                        <div className="add-tsk-main">
                            <label className="mb-2"><strong>Service  Tasks</strong></label>
                            <div className="col-lg-5 col-md-6 col-sm-12 pl-0 white-back">
                                <ul className="mb-2">
                                    {
                                        defaultCheckedList.map((item, i) =>
                                            <li > {item.name}</li>
                                        )
                                    }
                                </ul>
                            </div>
                        </div>

                    </div> */}

                    {/* <Document /> */}

                    {/* <div className="document-main mt-2">

                        <div className="add-tsk-main job-drcn-main defalut-mai">
                            <label className="mb-2 text-left w-100"><strong>Job Documents</strong></label>
                            <div className="col-12 ">
                                <div className="row boxes-documents">
                                    <div className={`col-sm-12 col-md-3 col-lg-2 docu-boxes-main mr-1 ${workCover ? 'colorblue-back' : 'white-back'}`}>
                                        <div className="docu-boxes">
                                            <span><b>Workcover Certificate</b></span>
                                            <span><b>Number: </b> 12345654567</span>
                                            <span><b>Expiry Date: </b> 15/02/2021</span>
                                        </div>
                                        <i className="fa fa-download"></i>
                                    </div>
                                    <div className={`col-sm-12 col-md-3 col-lg-2 docu-boxes-main mr-1 ${liability ? 'colorblue-back' : 'white-back'}`}>
                                        <div className="docu-boxes">
                                            <span><b>Public Liability</b></span>
                                            <span><b>Number: </b> 1234565</span>
                                            <span><b>Expiry Date: </b> 12/03/2021</span>
                                        </div>
                                        <i className="fa fa-download"></i>
                                    </div>
                                    <div className={`col-sm-12 col-md-3 col-lg-2 docu-boxes-main mr-1 ${swms ? 'colorblue-back' : 'white-back'}`}>
                                        <div className="docu-boxes">
                                            <span><b>SWMS</b></span>
                                            <span><b>Number: </b> 90043</span>
                                        </div>
                                        <i className="fa fa-download"></i>
                                    </div>
                                    <div className={`col-sm-12 col-md-3 col-lg-2 docu-boxes-main mr-1 ${msdmExit ? 'colorblue-back' : 'white-back'}`}>
                                        <div className="docu-boxes">
                                            <span><b>MSDS</b></span>
                                            <span><b>Chemical: </b>  Exit</span>
                                        </div>
                                        <i className="fa fa-download"></i>
                                    </div>
                                    <div className={`col-sm-12 col-md-3 col-lg-2 docu-boxes-main mr-1 ${msdmReeboot ? 'colorblue-back' : 'white-back'}`}>
                                        <div className="docu-boxes">
                                            <span><b>MSDS</b></span>
                                            <span><b>Chemical: </b> Reeboot</span>
                                        </div>
                                        <i className="fa fa-download"></i>
                                    </div>
                                    <div className={`col-sm-12 col-md-3 col-lg-2 docu-boxes-main mr-1 ${msdmFresh ? 'colorblue-back' : 'white-back'}`}>
                                        <div className="docu-boxes">
                                            <span><b>MSDS</b></span>
                                            <span><b>Chemical: </b> Morning Fresh</span>
                                        </div>
                                        <i className="fa fa-download"></i>
                                    </div>
                                </div>
                            </div>
                        </div >

                    </div> */}

                    {/* <StaffLicences /> */}

                    {/* <div className="staff-licence-main">

                        <div className="add-tsk-main job-drcn-main defalut-mai">
                            <div className="col-12 p-0 mt-2">
                                <label className="p-2 text-left w-100"><strong>Staff Licences/Inductions </strong></label>
                                <div className="table-responsive ">
                                    <Table className="staff-licnce-main dflt-lcnc" columns={columns} dataSource={data} />
                                </div>
                            </div>
                        </div>
                    </div> */}

                    {/* <AddNotes /> */}

                    {/* <div className="staff-licence-main">
                        <div className="add-tsk-main job-drcn-main p-0">
                            <div className="p-0 mt-2 ">
                                <div className="table-responsive ">
                                    <Table className="add-note-main note-mn" columns={schedulecolumns} dataSource={data} />
                                </div>
                                <div className="col-12 text-left mb-3">
                                    <button className="btn add-sdul" disabled>Add Schedule</button>
                                </div>
                                <div className="col-lg-8 col-md-8 col-sm-12 mt-2 mb-2 staff-text-tsk text-left">
                                    <label className="mb-2">Add Notes</label>
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

                    </div> */}
                </div>
            </>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        jobDocVersionHistory: state.jobdocManagement.jobDocVersionHistory
    }
}

const mapDispatchToprops = dispatch => {
    return {

    }
}

export default connect(mapStateToProps, mapDispatchToprops)(JobDocumentHistoryView);