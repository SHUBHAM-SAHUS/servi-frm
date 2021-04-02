import React from 'react';
import { Checkbox, Icon, Modal } from "antd";
import moment from 'moment';

const CheckboxGroup = Checkbox.Group;

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

    jobDocumentClick = (key, document) => {
        this.setState({ [key]: !this.state[key] });
        if (document.s3FileUrl) {
            window.open(document.s3FileUrl, '_blank')
        }
    }

    selectDocument = (documentId) => {
        let { setDocuments } = this.props
        setDocuments(documentId)
    }

    confirm = () => {
        return (
            <Modal
                title="Licence Details"
                visible={this.state.visible}
                onOk={this.handleOk}
                onCancel={this.handleCancel}
            >
                <p>Licence Name : </p>
                <p>Licence Number : </p>
                <p>Licence Issued By : </p>
                <p>Licence Expiry Date : </p>
            </Modal>)
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

    render() {
        const { documents, selectedDocuments, isViewJob } = this.props;

        const { workCover, liability, swms, msdmExit, msdmReeboot, msdmFresh, documentData } = this.state;
        let viewDocuments = [];
        if (documents && documents.length > 0) {
            documents.map(a => {
                if (selectedDocuments.indexOf(a.id) > -1) {
                    viewDocuments.push(a);
                }
            })
        }

        return (
            <>

                <div className="add-tsk-main white-back pt-3 pb-3">
                    {/* <label className="mb-2 text-left w-100"><strong>Job Documents</strong></label> */}
                    <div className="col-12 ">
                        {isViewJob ?
                            <div className="row boxes-documents">
                                {viewDocuments && viewDocuments.map((document, i) =>
                                    <div className={`col-sm-12 col-md-3 col-lg-2 docu-boxes-main mr-1 select-document`} >
                                        <div className="docu-boxes">
                                            <span><b>{document.name}</b></span>
                                            <span><b>{document.description}</b></span>
                                            {document.expiry_date && (
                                                <span><b>Expiry Date: </b>
                                                    {moment(document.expiry_date).format("DD/MMM/YYYY")}
                                                </span>
                                            )}
                                        </div>
                                        <div className="doc-btns-lst">
                                            <a href="#"
                                                //  onClick={() => this.setState({ visible: !this.state.visible })}
                                                onClick={() => this.jobDocumentClick('workCover', document)}
                                                className="pr-3 mr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                                            {document.s3FileUrl && (
                                                <i onClick={() => this.jobDocumentClick('workCover', document)} className="fa fa-download"></i>
                                            )}
                                        </div>
                                    </div>


                                )}
                            </div> :
                            <div className="row boxes-documents">
                                {documents && documents.map((document, i) =>
                                    <div className={`col-sm-12 col-md-3 col-lg-2 docu-boxes-main mr-1 
                            ${workCover ? 'colorblue-back' : selectedDocuments.indexOf(document.id) > -1 ? 'select-document' : 'white-back'}`} >
                                        <div className="docu-boxes" onClick={() => this.selectDocument(document.id)}>
                                            <span><b>{document.name}</b></span>
                                            <span><b>{document.description}</b></span>
                                            {document.expiry_date && (
                                                <span><b>Expiry Date: </b>
                                                    {moment(document.expiry_date).format("DD/MMM/YYYY")}
                                                </span>
                                            )}
                                        </div>
                                        <div className="doc-btns-lst">
                                            <a href="#"
                                                //  onClick={() => this.setState({ visible: !this.state.visible })}
                                                onClick={() => this.jobDocumentClick('workCover', document)}
                                                className="pr-3 mr-3"><i className="fa fa-eye" aria-hidden="true"></i></a>
                                            {document.s3FileUrl && (
                                                <i onClick={() => this.jobDocumentClick('workCover', document)} className="fa fa-download"></i>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </div>
                        }


                        <div className="docmnt-lists-mn">
                            <Modal
                                title="Licence Details"
                                visible={this.state.visible}
                                onOk={this.handleOk}
                                onCancel={this.handleCancel}
                            >
                                <p>Licence Name : </p>
                                <p>Licence Number : </p>
                                <p>Licence Issued By : </p>
                                <p>Licence Expiry Date : </p>
                            </Modal>
                        </div>

                    </div>
                </div>

            </>
        );
    }



}

export default Document