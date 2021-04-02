import React from 'react';
import { reduxForm, Field, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, Upload, notification } from 'antd';
import { customInput } from '../../common/custom-input';
import { Strings } from '../../../dataProvider/localize';
import { customTextarea } from '../../common/customTextarea';
import { CustomDatepicker } from '../../common/customDatepicker';
import { clientDetailsValidate } from '../../../utils/Validations/scopeDocValidation';
import * as actions from '../../../actions/clientManagementActions';
import { VALIDATE_STATUS } from '../../../dataProvider/constant'
import { handleFocus, DeepTrim, abbrivationStr } from '../../../utils/common';

function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener('load', () => callback(reader.result));
  reader.readAsDataURL(img);
}

class EditClient extends React.Component {

  state = {
    fileList: [],
    imageURL: null,
    imageArray: []
  }

  updateClientDetails = formData => {
    this.props.action.editClient(formData)
      .then((message) => {
        this.props.action.getClientDetails(formData.get('id'));
        this.props.action.getClientsList(formData.get('organisation_id'));
        notification.success({
          message: Strings.success_title,
          description: message ? message : "Client Details Updated Successfully.", onClick: () => { },
          className: 'ant-success'
        });
      })
      .catch((error) => {
        if (error.status == VALIDATE_STATUS) {
          notification.warning({
            message: Strings.validate_title,
            description: error && error.data && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_validate,
            onClick: () => { },
            className: 'ant-warning'
          });
        } else {
          notification.error({
            message: Strings.error_title,
            description: error && error.data && error.data.message && typeof error.data.message == 'string'
              ? error.data.message : Strings.generic_error,
            onClick: () => { },
            className: 'ant-error'
          });
        }
      });
  }

  onSubmit = async formData => {
    formData = await DeepTrim(formData);

    var finalFormData = new FormData();
    Object.keys(formData).forEach(key => {
      finalFormData.append(key, formData[key]);
    })

    if (this.state.fileList.length > 0) {
      finalFormData.append('logo', this.state.imageArray[0]);
    }

    if (this.props.isFromClientView) {
      this.updateClientDetails(finalFormData)
      return;
    }

    if (formData.name.toString().toLowerCase() !== this.props.selectedScopeDoc.name.toString().toLowerCase() || this.props.isFromClientView) {
      let existClientName = this.props.clientsList.filter(client => client.name.toString().toLowerCase() === formData.name.toString().toLowerCase());
      if (existClientName && existClientName.length > 0) {
        notification.error({
          message: Strings.error_title,
          description: "Client Name Already Present, Pleasse Try Again!",
          onClick: () => { },
          className: 'ant-error'
        });
      } else {
        this.updateClientDetails(finalFormData)
      }
    } else {
      this.updateClientDetails(finalFormData)
    }
  }

  handleCancel = () => {
    this.props.reset();
    this.props.handleCancel()
  }

  removeFile = () => {
    this.setState({ fileList: [], imageURL: null });
    return false;
  }

  render() {
    const { handleSubmit } = this.props;

    const uploadPicProps = {
      beforeUpload: file => {
        this.setState({
          fileList: [file],
        });
        return false;
      },
      multiple: false,
      onChange: async (info) => {
        //this.setState({ fileList: [info.file] })
        await getBase64(info.file, imageUrl =>
          this.setState({
            imageURL: imageUrl,
            fileList: [info.file],
            imageArray: [info.file]
          }),
        );
      },
      accept: ".jpeg,.jpg,.png",
      fileList: this.state.fileList,
      onRemove: () => this.removeFile()
    };

    return (
      <div className="sf-card">
        <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
          <h4 className="sf-sm-hd sf-pg-heading">{Strings.scope_doc_edit_client_title}</h4>
          <button class="closed-btn" onClick={this.handleCancel}><Icon type="close" /></button>
        </div>
        <div className="sf-card-body doc-update-task mt-2">
          <form onSubmit={handleSubmit(this.onSubmit)} >
            <div className="form-group">
              <div className="add-new-file">
                <div className="view-logo">
                  {
                    this.state.imageURL !== null
                      ? <img src={this.state.imageURL} />
                      : this.props.initialValues.client_logo
                        ? <img src={this.props.initialValues.client_logo} />
                        : this.props.initialValues.name && <b>{abbrivationStr(this.props.initialValues.name)}</b>
                  }
                </div>
                <div className="edit-img-title">
                  <Upload {...uploadPicProps} >
                    <span className="edit-image-logo">{Strings.org_edit_img}</span>
                  </Upload>
                </div>
              </div>
            </div>
            <fieldset className="form-group sf-form">
              <Field
                label={Strings.client_name}
                name="name"
                type="text"
                id="name"
                component={customInput} />
            </fieldset>
            <fieldset className="form-group sf-form">
              <Field
                label={Strings.address_txt}
                name="address"
                type="name"
                id="address"
                component={customTextarea} />
            </fieldset>
            <fieldset className="form-group sf-form">
              <Field
                label={Strings.org_abn}
                name="abn_acn"
                type="name"
                id="abn_acn"
                component={customInput} />
            </fieldset>
            <fieldset className="form-group sf-form">
              <Field
                label={Strings.business_telephone}
                name="business_number"
                type="text"
                id="business_number"
                component={customInput} />
            </fieldset>
            <fieldset className="form-group sf-form">
              <Field
                label={Strings.website_client}
                name="website"
                type="text"
                id="website"
                component={customInput} />
            </fieldset>
            <fieldset className="form-group sf-form">
              <Field
                label={Strings.invoicing_email_client}
                name="email_address"
                type="text"
                id="email_address"
                component={customInput} />
            </fieldset>
            <div className="all-btn multibnt">
              <div className="btn-hs-icon d-flex justify-content-between">
                <button onClick={this.handleCancel} className="bnt bnt-normal" type="button" disabled={!this.props.isDirty}>
                  {Strings.cancel_btn}</button>
                <button type="submit" className="bnt bnt-active" disabled={!this.props.isDirty}>
                  {Strings.update_btn}</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  var value = state.clientManagement && state.clientManagement.clientDetails ? state.clientManagement.clientDetails[0] : null;
  return {
    selectedScopeDoc: (value ? value : {}),
    scopeDocData: state.scopeDocs && state.scopeDocs.scopeDocs,
    isDirty: isDirty('EditClient')(state),
    clientsList: state.clientManagement && state.clientManagement.clients,
  }
}

const mapDispatchToprops = dispatch => {
  return {
    action: bindActionCreators(actions, dispatch),
  }
}

export default compose(
  connect(mapStateToProps, mapDispatchToprops),
  reduxForm({
    form: 'EditClient', validate: clientDetailsValidate, enableReinitialize: true,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }
  })
)(EditClient)