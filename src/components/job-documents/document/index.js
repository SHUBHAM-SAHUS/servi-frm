import React from 'react';
import { Checkbox } from "antd";
import { Icon } from 'antd';

const CheckboxGroup = Checkbox.Group;
const plainOptions = [
    { label: 'T1f1J1Q155v1 – External Façade Cleaning via Rope Access', value: 1 },
    { label: 'T3f1J1Q155v1 – Internal Glass Cleaning', value: 2 },
    { label: 'T4f1J1Q155v1 – Admin Area – Internal Window Cleaning', value: 3 }
];



var defaultCheckedList = [];

class Document extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedList: [],
            workCover: false,
            liability: false,
            swms: false,
            msdmExit: false,
            msdmReeboot: false,
            msdmFresh: false,

        };
    }

    onGroupChange = (checkedList) => {
        this.setState({
            checkedList,
        });
    }

    jobDocumentClick = (key) => {
        this.setState({ [key]: !this.state[key] })
    }

    render() {
        const {
            workCover,
            liability,
            swms,
            msdmExit,
            msdmReeboot,
            msdmFresh,
        } = this.state;
        return (
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

        );
    }



}

export default Document