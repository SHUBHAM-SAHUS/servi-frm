import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon } from 'antd';
import { Strings } from '../../../dataProvider/localize';
import { customTextarea } from '../../common/customTextarea';
import { CustomDatepicker } from '../../common/customDatepicker';
import { validate } from '../../../utils/Validations/scopeDocValidation';
import { handleFocus } from '../../../utils/common';

class EditInternalNotes extends React.Component {

    onSubmit = formData => {
    }

    render() {
        const { handleSubmit, selectedScopeDoc } = this.props;
        return (
            <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h4 className="sf-sm-hd sf-pg-heading">{Strings.scope_doc_edit_notes}</h4>
                    <button class="closed-btn" onClick={this.props.handleCancel}><Icon type="close" /></button>
                </div>
                <div className="sf-card-body doc-update-task mt-2">
                    <form onSubmit={handleSubmit(this.onSubmit)} >
                        <fieldset className="form-group sf-form">
                            <Field
                                label={Strings.internal_notes}
                                name="internal_notes"
                                type="name"
                                id="internal_notes"
                                component={customTextarea} />
                        </fieldset>
                        <div className="all-btn multibnt">
                            <div className="btn-hs-icon d-flex justify-content-between">
                                <button onClick={this.props.handleCancel} className="bnt bnt-normal" type="button">
                                    {Strings.cancel_btn}</button>
                                <button type="submit" className="bnt bnt-active">
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
    var value = state.scopeDocs.scopeDocs ? state.scopeDocs.scopeDocs.find(item => item.id === ownProps.selectedScopeDocID) : {};
    return {
        selectedScopeDoc: (value ? value : {}),
        scopeDocData: state.scopeDocs.scopeDocs,
        ///initialValues: (value ? value.client : {})
    }
}

const mapDispatchToprops = dispatch => {
    return {
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({ form: 'EditInternalNotes', validate, enableReinitialize: true ,
    onSubmitFail: (errors, dispatch, sub, props) => {
      handleFocus(errors, "#");
    }})
)(EditInternalNotes)