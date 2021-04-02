import React from "react";
import { Field, reduxForm, FormSection, FieldArray } from "redux-form";
import { CustomCheckbox } from "../../../common/customCheckbox";
import { customInput } from "../../../common/custom-input";
import { compose } from "redux";
import { connect } from "react-redux";
import * as actions from '../../../../actions/SWMSAction'
import { handleFocus, getStorage } from "../../../../utils/common";
import { Icon, Input, notification } from "antd";
import { Strings } from "../../../../dataProvider/localize";
import JsxParser from 'react-jsx-parser'
import { SignCanvas } from "../../../common/SignCanvas";
import { ADMIN_DETAILS } from "../../../../dataProvider/constant";
import { ERROR_NOTIFICATION_KEY } from "../../../../config";

const required = value => value ? undefined : "Required"

class customField extends React.Component {
    render() {
        return <fieldset className="tbt-input-text no-label">
            <Field
                name={this.props.name}
                type="text"
                component={customInput}
                readonly={this.props.readonly}
                validate={this.props.readonly ? () => undefined : required}
            />
        </fieldset>
    }
}

class ViewToolboxTalk extends React.Component {
    state = {}
    onSubmit = (formData) => {
        if (!this.state.signStatus) {
            return;
        }

        let svgString = new XMLSerializer().serializeToString(document.getElementById("toolboxTalkSign").childNodes[0]);
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height)
        let DOMURL = window.self.URL || window.self.webkitURL || window.self;
        let img = new Image();
        let svg = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
        let url = DOMURL.createObjectURL(svg);
        img.onload = () => {
            ctx.drawImage(img, 0, 0);
            let png = canvas.toDataURL("image/png");
            canvas.toBlob((blob) => {
                var finalFormData = new FormData();
                finalFormData.append("sign", blob)

                /* Form data */

                formData.toolbox_talk_items && formData.toolbox_talk_items.forEach(itm => {
                    itm.item_status = +Boolean(itm.item_status)
                })

                Object.keys(formData).forEach(key => {
                    if (key === "toolbox_talk_items")
                        finalFormData.append(key, JSON.stringify(formData[key]))
                    else
                        finalFormData.append(key, formData[key]);
                });
                this.props.addJobToolbox(finalFormData, formData.job_id, formData.toolbox_talk_id).then(message => {
                    notification.success({
                        message: Strings.success_title,
                        description: message,
                        onClick: () => { },
                        className: 'ant-success'
                    });
                    this.initializeData();
                    this.props.initialize(this.props.jobToolBoxTalkDetail);

                }).catch((message) => {
                    notification.error({
                        key: ERROR_NOTIFICATION_KEY,
                        message: Strings.error_title,
                        description: message ? message : Strings.generic_error,
                        onClick: () => { },
                        className: 'ant-error'
                    });
                });
            })
        }
        img.src = url;


    }
    /* onSaveSignature = (signDetails, file) => {
        this.props.change("sign", file);
    } */
    onSaveSignature = (status) => {
        if (status !== this.state.clientSign) {
            this.setState({ signStatus: status });
        }
    }

    initializeData = () => {
        var { selectedToolboxTalk, jobToolBoxTalkDetail } = this.props

        var itemsArray = []
        selectedToolboxTalk.toolbox_talk_items
            && selectedToolboxTalk.toolbox_talk_items.forEach((item) => {

                if (item.comment && item.comment.split("{input}") && item.comment.split("{input}").length > 0) {
                    var finalString = ""
                    item.comment.split("{input}").forEach(
                        (str, index) => {
                            if (index != item.comment.split("{input}").length - 1) {
                                if (jobToolBoxTalkDetail && jobToolBoxTalkDetail.sign_data)
                                    finalString += str + ` <customField name="item_comments[${index}]" readonly={true} /> `
                                else
                                    finalString += str + ` <customField name="item_comments[${index}]" readonly={false} /> `

                            }
                            else
                                finalString += str
                        }
                    )
                    itemsArray.push({ item_name: item.item_name, comment: finalString })
                }
                else {
                    itemsArray.push({ item_name: item.item_name, comment: item.comment })
                }

            })
        this.setState({ toolboxTalkItems: itemsArray })
    }

    componentDidMount() {
        this.initializeData()
    }

    render() {
        const { selectedToolboxTalk, handleSubmit, jobToolBoxTalkDetail } = this.props;
        const { toolboxTalkItems } = this.state;
        return (
            <div className="toolbox-container" >
                <div className="tbtf-body">
                    <h1 className="tbtf-mn-heading">{selectedToolboxTalk.toolbox_name}</h1>
                    <form onSubmit={handleSubmit(this.onSubmit)}>
                        <div className="tbt-items-table">
                            <table className="tbt-dtl-table">
                                <tr>
                                    <th>Item</th>
                                    <th>Comment</th>
                                    <th>Done</th>
                                </tr>
                                {toolboxTalkItems &&
                                    toolboxTalkItems.map(
                                        (item, item_index) => <FormSection name={`toolbox_talk_items[${item_index}]`} >
                                            <tr>
                                                <td>{item.item_name}</td>
                                                <td className="n-comments-tbt dynamic-html-cnt">
                                                    <JsxParser
                                                        components={{ customField }}
                                                        jsx={item.comment}
                                                    />
                                                </td>

                                                <td>

                                                    <Field name="item_status" component={CustomCheckbox}
                                                        disabled={jobToolBoxTalkDetail && jobToolBoxTalkDetail.sign_data}
                                                        validate={required}
                                                    />
                                                </td>
                                            </tr></FormSection>)}

                            </table>
                        </div>
                        <div className="acknowledge-box">
                            <div className="print-sign-table">
                                <h3 className="ackn-tbl-heading">Attachment</h3>
                                <table className="tbt-dtl-table">
                                    <tr>
                                        <th>Name</th>
                                        <th>File</th>
                                    </tr>
                                    {selectedToolboxTalk.toolbox_talk_attachments &&
                                        selectedToolboxTalk.toolbox_talk_attachments.map(attach => <tr>
                                            <td>{attach.attachment_name}</td>
                                            <td><a href={attach.file_name} target="_blank" download>Download document</a></td>
                                        </tr>)}
                                </table>
                            </div>

                            <div className="ttg-note-table mt-4">
                                <table className="tbt-dtl-table">
                                    <tr>
                                        <th colSpan="2">Notes</th>
                                    </tr>
                                    <tr>
                                        <td>{selectedToolboxTalk.notes}</td>
                                    </tr>

                                </table>
                            </div>
                        </div>
                        {/* signature */}

                        <div className="ttg-note-table mt-4">
                            <h3 className="ackn-tbl-heading">Signature</h3>
                            {jobToolBoxTalkDetail && jobToolBoxTalkDetail.sign_data ?
                                <img className="ttg-sign-img" src={jobToolBoxTalkDetail.sign_data.job_toolbox_talks_sign} /> :
                                <>
                                    <SignCanvas
                                        signDetail={{
                                            user_name: JSON.parse(getStorage(ADMIN_DETAILS)).user_name
                                            , user_first_name: JSON.parse(getStorage(ADMIN_DETAILS)) ?
                                                JSON.parse(getStorage(ADMIN_DETAILS)).name + " " +
                                                (JSON.parse(getStorage(ADMIN_DETAILS)).last_name ?
                                                    JSON.parse(getStorage(ADMIN_DETAILS)).last_name : '') : "",
                                            user_role_name: JSON.parse(getStorage(ADMIN_DETAILS)).role.role_name
                                        }}
                                        sign_id={"toolboxTalkSign"}
                                        signFlag={this.onSaveSignature}
                                    // onSave={this.onSaveSignature}
                                    ></SignCanvas>
                                    {!this.state.signStatus ?
                                        <span className="error-input">{"Sign is required"}</span> : null}
                                </>
                            }
                        </div>

                        <div className="all-btn multibnt d-flex justify-content-end mt-4">
                            <div className="btn-hs-icon d-flex justify-content-between">
                                <button onClick={this.props.onCancel} className="bnt bnt-normal" type="button" >
                                    {Strings.cancel_btn}</button>
                                <button type="submit" disabled={jobToolBoxTalkDetail && jobToolBoxTalkDetail.sign_data} className="bnt bnt-active">
                                    <Icon type="save" theme="filled" /> {Strings.save_btn}
                                </button>
                            </div>
                        </div>


                    </form>
                </div>

            </div >
        );
    }
}
const mapStateToProps = (state) => {
    return {
        jobToolBoxTalk: state.swmsReducer.jobToolBoxTalk,
        // formValues: state.form.ViewToolboxTalk && state.form.ViewToolboxTalk.values
        jobToolBoxTalkDetail: state.swmsReducer.jobToolBoxTalkDetail,

    }
}
export default compose(
    connect(mapStateToProps, actions),
    reduxForm({
        form: 'ViewToolboxTalk', enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(ViewToolboxTalk)