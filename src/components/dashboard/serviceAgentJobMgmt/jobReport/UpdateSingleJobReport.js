import React from 'react';
import { Field, FieldArray } from 'redux-form';
import { connect } from 'react-redux';
import { bindActionCreators, compose } from 'redux';
import { Icon, Modal } from 'antd';
import { reduxForm } from 'redux-form';
import * as action from '../../../../actions/SAJobMgmtAction';
import { customInput } from '../../../common/custom-input';

class UpdateSingleJobReort extends React.Component {

    onSubmit = (formData) => {

        
        /*   this.props.updateUsersFromView({ org_user: formData }, formData.organisation_id)
              .then((flag) => {
                  this.props.reset();
                  this.props.removeInlineUser(this.props.initialValues);
              })
              .catch((message) => {
                  Modal.error({
                      title: "Error!",
                      content: message ? message : "Something went wrong please try again later",
                  });
              }); */

    }

    render() {

        const { handleSubmit, initialValues } = this.props;

        return (

            <tr className="drag-row">
                <form onSubmit={handleSubmit(this.onSubmit)} key={initialValues.id}>
                    <td>
                        <button class="dragde-bnt normal-bnt" type="button"><i class="fa fa-ellipsis-h"></i><i class="fa fa-ellipsis-h"></i></button>
                    </td>
                    <td>
                        <fieldset className="sf-form no-label">
                            <Field name={`area`} type="text" component={customInput} />
                        </fieldset>
                    </td>
                    <td>
                        <div className="location-afbf-pic">
                            {/*  <Upload
                                listType="picture-card"
                                fileList={formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].location ?
                                    formValues.job_cleaning_reports[index].location : []}
                                beforeUpload={this.handlePreUpload}
                                onChange={({ fileList }) => this.handleChange(fileList, index, 'location')}
                            >
                                {formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].location ?
                                    formValues.job_cleaning_reports[index].location.length >= 1 ? null : uploadButton
                                    : uploadButton}
                            </Upload> */}

                        </div>
                    </td>
                    <td>
                        <div className="location-afbf-pic">
                            {/*  <Upload
                                listType="picture-card"
                                fileList={formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].before ?
                                    formValues.job_cleaning_reports[index].before : []}
                                beforeUpload={this.handlePreUpload}
                                onChange={({ fileList }) => this.handleChange(fileList, index, 'before')}
                            >
                                {formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].before ?
                                    formValues.job_cleaning_reports[index].before.length >= 2 ? null : uploadButton
                                    : uploadButton}
                            </Upload> */}
                        </div>
                    </td>
                    <td>
                        <div className="location-afbf-pic">
                            {/* <Upload
                                listType="picture-card"
                                fileList={formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].after ?
                                    formValues.job_cleaning_reports[index].after : []}
                                beforeUpload={this.handlePreUpload}
                                onChange={({ fileList }) => this.handleChange(fileList, index, 'after')}
                            >
                                {formValues.job_cleaning_reports &&
                                    formValues.job_cleaning_reports[index] &&
                                    formValues.job_cleaning_reports[index].after ?
                                    formValues.job_cleaning_reports[index].after.length >= 2 ? null : uploadButton
                                    : uploadButton}
                            </Upload> */}
                        </div>
                    </td>
                    <td>
                        <fieldset className="sf-form no-label">
                            <Field name={`note`} type="text" component={customInput} />
                        </fieldset>
                    </td>
                    <td>
                        <fieldset className="sf-form no-label">
                            <Field name={`photo_taken_by`} type="text" component={customInput} />
                        </fieldset>
                    </td>
                    <td>
                        <button className='delete-bnt' type='submit' >
                            <i class="material-icons">save</i>
                        </button>
                        <button className='delete-bnt' type='button' onClick={() => this.props.removeInlineUser(this.props.initialValues)} >
                            <i class="material-icons">close</i>
                        </button>
                    </td>
                </form>
            </tr>


        )
    }
}

const mapStateToProps = (state, { serviceObject }) => {
    return {
        roles: state.roleManagement.roles,
    }
}


export default compose(
    connect(mapStateToProps, action),
    reduxForm({ /*  validate, */ enableReinitialize: true })
)(UpdateSingleJobReort)