import React from 'react';
import { Icon, Dropdown, Menu, Pagination, Modal, notification } from 'antd';
import { reduxForm, Field } from 'redux-form';
import { validate } from '../../../utils/Validations/subscriptionValidate';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Link, withRouter } from 'react-router-dom';
import * as actions from '../../../actions/profileManagementActions';
import { Strings } from '../../../dataProvider/localize';
import moment from 'moment';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import { getStorage, handleFocus } from '../../../utils/common';


class Licences extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            minValue: 0,
            maxValue: 4,
            page_no: 1,
        };

        this.org_user_id = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null;
        this.org_user_name = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).user_name : null;
    }

    // more info
    editMenu = (
        <Menu>
            <Menu.Item onClick={this.handleEditClick}>{Strings.menu_edit_org}</Menu.Item>
        </Menu>
    )

    componentDidMount() {
        this.props.userActions.getLicencesType();
    }

    componentDidUpdate(prevProps, prevState) {

    }

    onSubmit = (formData) => {

    }

    addNewLicence = () => {
        const show = 'block'
        this.props.onPropsSet(show)
    }

    editLicence = (data) => {
        const show = 'block'
        // data = { ...data, isEditLicences: true }
        this.props.onPropsSet(show, data)
    }

    deleteLicence = (id) => {
        let formData
        this.props.profile && this.props.profile[0] && this.props.profile[0].licences && this.props.profile[0].licences.length === 1 ?
            formData = { id: id, profile_progress: this.props.profileComplete - 10 } : formData = { id: id }
        this.props.userActions.deleteLicence(formData)
            .then(message => {
                notification.success({
                    message: Strings.success_title,
                    description: message,
                    onClick: () => { },
                    className: 'ant-success'
                });
                this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name);
            }).catch(message => {
                notification.error({
                    message: Strings.error_title,
                    description: message ? message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });
        this.props.reset();
    }

    handleChange = page => {
        /* if (page <= 1) {
            this.setState({
                minValue: 0,
                maxValue: 4
            });
        } else {
            this.setState({
                minValue: this.state.maxValue,
                maxValue: page * 4
            });
        } */
        this.setState({
            page_no: page
        })
        if (page) {
            this.props.userActions.getOrgUserDetails(this.org_user_id, this.org_user_name, page);
        }
    };

    downloadImage = (name, url) => {
        let imageUrl = `${url}? t = ${new Date().getTime()}`;
        fetch(imageUrl)
            .then(response => {
                response.blob().then(blob => {
                    let url = window.URL.createObjectURL(blob);
                    let a = document.createElement('a');
                    a.href = url;
                    a.download = name;
                    a.click();
                });
            });
    }

    render() {
        const { handleSubmit, initialValues, licenceType, profile } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit)}>

                {/* Personal Details */}

                <div className="sf-card">
                    <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                        <h2 className="sf-pg-heading">{Strings.tab_licences}</h2>
                        <div class="oh-cont">
                            <button type="button" className="bnt bnt-active" onClick={this.addNewLicence}>{Strings.add_new_licence}</button>
                        </div>
                    </div>
                    <div className="sf-card-body mt-2">
                        {!initialValues ?
                            <div className="no-licence">
                                <img src="../images/no-licence.png" />
                                <h2><strong>Upload relevant licences</strong>
                                    File type permitted are .png and .jpg. <span>Max file size: 4MB</span></h2>
                                <button type="button" className="bnt bnt-w-br" onClick={this.addNewLicence}>{Strings.add_new_licence}</button>
                            </div>
                            :
                            <div className="has-licence">
                                <div className="row">
                                    {initialValues && initialValues.length && initialValues.length > 0 && initialValues.map(licence => {
                                        return (
                                            <div className="col-md-6 col-sm-6 col-xs-12">
                                                <div className="licence-list">
                                                    {licence && (licence.image.includes('.PDF') || licence.image.includes('.pdf'))
                                                        ?
                                                        <div className="licence-img show-pdf-file-view"><i class="fa fa-file-pdf-o"></i></div>
                                                        :
                                                        <div className="licence-img"><img src={profile[0] && profile[0].licences_file_path + licence.image} /></div>
                                                    }
                                                    <div className="li-details">
                                                        <h3>{licenceType.find(type => type.id === licence.type) ? licenceType.find(type => type.id === licence.type).name : ''}</h3>
                                                        <ul className="li-lists">
                                                            <li><span>Number:</span> {licence && licence.number}</li>
                                                            <li><span>Issued By:</span> {licence && licence.issued_by}</li>
                                                            <li><span>Issue Date:</span> {licence && licence.issued_date && moment(licence && licence.issued_date).format('D/MM/YYYY')}</li>
                                                            <li><span>Expiry Date:</span> {licence && licence.expiry_date && moment(licence && licence.expiry_date).format('D/MM/YYYY')}</li>
                                                        </ul>
                                                        <div className="action-bnt">
                                                            {/* <Link to={initialValues.licences_file_path+licence.image} target="_blank" download><i className="fa fa-download"></i></Link> */}
                                                            {/* <a href={profile[0] && profile[0].licences_file_path + licence.image} download={profile[0] && profile[0].licences_file_path + licence.image.split('/')[licence.image.split('/').length - 1]} target="_blank" ><i className="fa fa-download"></i></a> */}
                                                            <a href="#" onClick={() => this.downloadImage(licenceType.find(type => type.id === licence.type) ? licenceType.find(type => type.id === licence.type).name : '', profile[0] && profile[0].licences_file_path + licence.image)}><i className="material-icons">get_app</i></a>
                                                            {/* <button type="button" onClick={() => {
                                                                const a = document.createElement('a');
                                                                a.style.display = 'none';
                                                                a.href = licence.image;
                                                                // the filename you want
                                                                a.download = "license"
                                                                document.body.appendChild(a);
                                                                a.click();
                                                            }}><i className="fa fa-download"></i></button> */}
                                                            <button type="button" onClick={() => this.editLicence(licence)}><i class="fa fa-pencil" ></i></button>
                                                            <button type="button" onClick={() => this.deleteLicence(licence.id)}><i class="fa fa-trash"></i></button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                </div>
                            </div>
                        }

                    </div>
                </div>
                {profile && profile[0] && profile[0].licences_count > 10 ?
                    <Pagination className="sf-pagination"
                        defaultCurrent={this.state.page_no}
                        defaultPageSize={10}
                        total={profile[0].licences_count}
                        onChange={this.handleChange}
                    />
                    : ''
                }
            </form>

        );
    }
}

const mapStateToProps = (state) => {
    return {
        profile: state.profileManagement && state.profileManagement.profile,
        licenceType: state.profileManagement && state.profileManagement.licenceType,
        profileComplete: state.profileManagement && state.profileManagement.profileComplete,

    }
}

const mapDispatchToProps = dispatch => {
    return {
        userActions: bindActionCreators(actions, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToProps),
    reduxForm({
        form: 'Licences', validate,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(Licences)