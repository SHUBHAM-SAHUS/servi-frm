import React from 'react';
import { Icon, Button, Collapse } from 'antd';
import AddTasks from './add-tasks';
import AddStaff from './add-staff';
import Document from './document';
import StaffList from './staff-list';
import StaffLicences from './staff-licences';
import AddNotes from './add-notes';
import Logo from '../../images/logo.jpg';
import { goBack, goBackBrowser } from "../../utils/common";

class JobDocuments extends React.Component {
    constructor(props) {
        super(props);
    }

    callback = (key) => {
        console.log(key);
    }

    render() {
        // const { Header, Sider, Content } = Layout;
        const { Panel } = Collapse;

        return (
            <div className="main-container white-back pb-5">
                <div className="col-12 header-main header-bs mb-3">
                    <div className="d-flex ">
                        <div className="pull-left hed-img">
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
                                <b>Business Name: </b> FAMASO Pty Ltd
                                    </div>
                            <div className="">
                                <b>ABN: </b> 456310255732
                                    </div>
                            <div className="">
                                <b>Address: </b> 1/92 Railway Street South, Altona, VIC, 3018
                                    </div>
                            <div className="">
                                <b>Phone: </b> 1300 801 801
                                    </div>
                            <div className="">
                                <b>Email: </b> info@famaso.com.au
                                    </div>
                            <div className="">
                                <b>Job Name: </b> AAMI Stadium Façade Cleaning
                                    </div>
                            <div className="">
                                <b>Site Address(s): </b> AMMI Stadium, Olympic Blvd, Melbourne, VIC, 3000
                            </div>

                        </div>

                        <div className="col-lg-6 col-md-6 col-sm-12 pt-2 pb-2 text-left">
                            <div className="">
                                <b>To:- </b>
                            </div>
                            <div className="">
                                <b>Client Name: </b> Spotless
                            </div>
                            <div className="">
                                <b>Primary Contact: </b> Mark Jones
                            </div>
                            <div className="">
                                <b>Phone Number: </b> 0432323211
                            </div>
                            <div className="">
                                <b>ABN: </b> 12345678910
                            </div>
                            <div className="">
                                <b>Address: </b> 101 Deakin Road, Melbourne, VIC, 3003
                            </div>
                            <div className="">
                                <b>Email: </b> mark.mark@spotless.com.au
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-left defalut-mai" onClick={this.addTasks}>
                    {/* <Collapse className="job-drcn-main p-0" defaultActiveKey={['1']} onChange={this.callback}>
                        <Panel className="color-add " header="ADD TASKS" key="1"> */}
                    <AddTasks />
                    {/* </Panel>
                    </Collapse> */}
                </div>

                {/* <div className="text-left addstaff-top-head" onClick={this.addTasks}>
                    <Collapse className="" defaultActiveKey={['1']} onChange={this.callback}>
                        <Panel className="color-add border0" header="ADD STAFF" key="1">
                            <AddStaff />
                        </Panel>
                    </Collapse>
                </div> */}

                {/* <div className="pull-right">
                    <Button className="btn confirm-btn">Confirm Allocation</Button>
                </div> */}

                {/* <div className="devider"></div> */}

                <div className="document-main mt-2">
                    <Document />
                </div>

                {/* <div className="staff-list-main">
                    <StaffList />
                </div> */}

                <div className="staff-licence-main">
                    <StaffLicences />
                </div>

                <div className="staff-licence-main">
                    <AddNotes />
                </div>

                {/* <div className="pull-right w-50 text-right">
                    <Button className="mr-2 del-btn pl-4 pr-4" type="primary">Cancel</Button>
                    <Button className="allocate-btn pl-4 pr-4" type="primary">Email Job Docs</Button>
                </div> */}


            </div>
        );
    }
}



export default JobDocuments