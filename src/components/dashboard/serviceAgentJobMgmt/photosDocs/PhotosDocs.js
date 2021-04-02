import React from 'react';
import moment from 'moment';
import { reduxForm } from 'redux-form';
import { validate } from '../../../../utils/Validations/roleValidation';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Upload, Icon, Popconfirm, Progress, Select, Modal, Dropdown, notification } from 'antd';
import * as actions from '../../../../actions/SAJobMgmtAction';
import { PHOTOS_DOCS_URL, USER_NAME, ADMIN_DETAILS, ACCESS_CONTROL, JWT_REFRESH_TOKEN, JWT_ACCESS_TOKEN, JWT_ID_TOKEN } from '../../../../dataProvider/constant';
import { Strings } from '../../../../dataProvider/localize';
import { BASE_SCOPE_API_URL } from '../../../../dataProvider/env.config';
import { goBack, handleFocus,goBackBrowser } from '../../../../utils/common';
import { getStorage, setStorage } from '../../../../utils/common';
import $ from 'jquery';

const Dragger = Upload.Dragger;

// select box Radio

const { Option } = Select;

const children = [];
for (let i = 10; i < 36; i++) {
    children.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
}

class PhotosDocs extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            fileList: [],
            fileUploadStatus: '',
            loaderPercent: 0,
            uploading: '',
            responseData: '',
            cardExpnadBtn: true
        };
        this.handleChange = this.handleChange.bind(this);
        this.currentOrganization = this.props.location.state ? this.props.location.state :
            JSON.parse(getStorage(ADMIN_DETAILS)) ?
                JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
    }

    componentDidMount() {
        this.props.actions.getPhotosDocsFileList(this.props.job.id);
    }

    // select radio button
    handleSizeChange = e => {
        this.setState({ size: e.target.value });
    };

    onSubmit = (formData) => {
        this.props.reset();
    }

    handleChange = info => {
        let fileList = [...new Set(info.fileList)];
        this.setState({ fileList: fileList });
        this.setState({ loaderPercent: info.file.percent, uploading: info.file.status });
        var statusFlag = true;
        var errorFlag = false;


        fileList.forEach(file => {
            if (file.status !== 'done')
                statusFlag = false;
            if (file.status === 'error')
                errorFlag = true;
        })
        if (statusFlag) {
            if (info.file && info.file.response && info.file.response.data) {
                this.setState({
                    fileUploadStatus: 'Success',
                    responseData: info.file.response.data
                })
            }
            this.props.actions.getPhotosDocsFileList(this.props.job.id);
            notification.success({
                message: Strings.success_title,
                description: info.file.response.message ? info.file.response.message : Strings.success_title,
                onClick: () => { },
                className: 'ant-success'
            });

        }
        if (errorFlag) {
            if (info.file.response) {
                if (info.file.response.data) {
                    this.setState({
                        fileUploadStatus: 'Failed',
                        responseData: info.file.response.data
                    })
                    var errorFiles = fileList.filter(file => file.status === 'error')

                    var invalidMessages = <table className="rap-cell-table add-user-table table" >
                        <tr>
                            <th>{"Row Number"}</th>
                            <th>{"File name"}</th>
                            <th></th>
                        </tr>
                        {errorFiles.map((item, index) => (
                            <tr key={item.line_no}>
                                <td>{index + 1}</td>
                                <td>{item.name}</td>
                            </tr>
                        ))}
                    </table>
                    this.props.actions.getPhotosDocsFileList(this.props.job.id);
                    notification.error({
                        message: "Error while uploading following file",
                        description: invalidMessages,
                        onClick: () => { },
                        className: 'ant-error'
                    });
                }
            }
        }
    };

    handdleDeleteUserClick = (file) => {
        this.props.actions.deletePhotosDocsFile({ job_id: this.props.job.id, id: file.id })
            .then((res) => {
                notification.success({
                    message: Strings.success_title,
                    description: res.message,
                    onClick: () => { },
                    className: 'ant-success'
                });
            }).catch((message) => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
    }

    render() {
        const props = {
            action: BASE_SCOPE_API_URL + PHOTOS_DOCS_URL,
            onChange: this.handleChange,
            name: 'files',
            multiple: true,
            data: { job_id: this.props.job.id },
            headers: {
                refreshtoken: getStorage(JWT_REFRESH_TOKEN),
                accessToken: getStorage(JWT_ACCESS_TOKEN),
                accessId: getStorage(JWT_ID_TOKEN),
                user_name: getStorage(USER_NAME),
                org_id: JSON.stringify(JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id),
            }
        };
        const { docFileList } = this.props;
        return (
            <div>
                {/* inner header  */}
                <div className="dash-header">
                    <h2 className="page-mn-hd"><Icon type="arrow-left" onClick={() => 
                    // goBack(this.props)
                    goBackBrowser(this.props)
                    } />Photos/Docs</h2>

                    {/* <div className="sf-steps-status">
                        <div className="sf-st-item">
                            <div className="iconbx">
                                <Icon type="usergroup-add" /></div>
                            <span>{Strings.user_wizard_user}</span>
                        </div>
                        <div className="sf-st-item no-bp">
                            <div className="iconbx key-rtic">
                                <img alt="" src="/images/key-icon.png" /></div>
                            <span>{Strings.user_wizard_permissions}</span>
                        </div>
                        <div className="sf-st-item sf-prog">
                            <i>0%</i>
                            <span>{Strings.org_wizard_progress}</span>
                        </div>
                    </div> */}

                    <div />
                </div>
                {/* inner header  */}

                <div className="main-container">
                    <div className="row">
                        <div className="col-md-12">
                            <div >
                                {/* zoom button  */}

                                <div className="sf-card"  >
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">Upload Files</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>

                                    </div>
                                    <div className="sf-card-body">

                                        <div className="row">
                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="bulk-import-files">
                                                    <i class="material-icons wnt-img">
                                                        insert_drive_file
                                                    </i>
                                                    <div className="blki-msg">
                                                        <h5> {Strings.photos_docs_upload_heading} </h5>
                                                        <span>{Strings.photos_docs_upload_info} </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12">
                                                <div className="upload-sfv-file">
                                                    <Dragger {...props} fileList={this.state.fileList}>
                                                        <p className="ant-upload-drag-icon">
                                                            <i class="material-icons">cloud_upload</i>
                                                        </p>
                                                        <p className="ant-upload-text">Choose file to upload</p>
                                                        <p className="ant-upload-hint">
                                                            {Strings.img_upload_text}
                                                        </p>
                                                        <div className="file-up-msg">
                                                            {this.state.loaderPercent !== 0 ? <Progress percent={this.state.loaderPercent} /> : null}
                                                            {this.state.uploading === 'uploading' ? <span className="uplod-txt">Uploading...</span> : null}
                                                            {this.state.fileUploadStatus === 'Success' ? <span className="uplf-success"><Icon type="check" /> {this.state.fileUploadStatus}</span> : this.state.fileUploadStatus === '' ? null : <span className="uplf-failed"><Icon type="warning" theme="filled" />{this.state.fileUploadStatus}</span>}
                                                        </div>
                                                    </Dragger>
                                                </div>
                                            </div>
                                        </div>

                                    </div>
                                </div>

                                {/* user list table */}

                                <div className="sf-card mt-4" >
                                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                                        <h2 className="sf-pg-heading">Files</h2>
                                        <div className="info-btn disable-dot-menu">
                                            <Dropdown className="more-info" disabled>
                                                <i className="material-icons">more_vert</i>
                                            </Dropdown>
                                        </div>

                                    </div>
                                    <div className="sf-card-body">
                                        <div className="photo-doc-up-table">
                                            <table className="add-user-table table">
                                                <tr>
                                                    <th>File Type</th>
                                                    <th>Name</th>
                                                    <th>File Size</th>
                                                    <th>Date</th>
                                                    <th style={{ width: '80px' }}></th>
                                                </tr>
                                                {docFileList.map((file, index) =>
                                                    <tr
                                                        key={file.id}
                                                    >
                                                        <td>{file.file_type.includes("image/") ? <i class="material-icons">
                                                            photo_size_select_actual
                                                    </i> : <i class="material-icons">
                                                                insert_drive_file
                                                    </i>

                                                        }</td>
                                                        <td>{file.file_name}</td>
                                                        {parseInt(file.file_size) > 1000000 ?
                                                            <td>{((parseInt(file.file_size) / 1048576)).toFixed(1)}MB</td>
                                                            : <td>{(parseInt(file.file_size) / 1024).toFixed(1)}KB</td>}
                                                        <td>{moment(file.created_at).format("DD/MM/YYYY")}</td>
                                                        <td>
                                                            <div id="user-edit">


                                                                <Popconfirm
                                                                    title={Strings.user_list_confirm_delete_alert}
                                                                    icon={<Icon type="question-circle-o" style={{ color: 'red' }} />}
                                                                    onConfirm={() => this.handdleDeleteUserClick(file)}
                                                                    placement="topRight"
                                                                    okText="Yes"
                                                                    cancelText="No"
                                                                >
                                                                    <button className='delete-bnt'>
                                                                        <i class="fa fa-trash-o"></i>
                                                                    </button>
                                                                </Popconfirm>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                )}
                                            </table>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>


                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        users: state.organizationUsers.users,
        job: state.sAJobMgmt.jobDetails.job_details && state.sAJobMgmt.jobDetails.job_details[0] ?
            state.sAJobMgmt.jobDetails.job_details[0] : {},
        docFileList: state.sAJobMgmt.docFileList
    }
}

const mapDispatchToprops = dispatch => {
    return {
        actions: bindActionCreators(actions, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'photosDocs', validate ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(PhotosDocs);