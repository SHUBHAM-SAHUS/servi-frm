import React from "react";
import { Field, reduxForm, FormSection, FieldArray } from "redux-form";

import { CustomCheckbox } from "../../common/customCheckbox";
import { customInput } from "../../common/custom-input";

class ViewToolboxTalk extends React.Component {
    render() {
        const { taskFiles } = this.props;
        return (
            <div className="toolbox-container">
            <div className="tbtf-list">
                <button className="normal-bnt active">Toolbox Talk 1</button>
                <button className="normal-bnt">Toolbox Talk 2</button>
                <button className="normal-bnt">Toolbox Talk 3</button>
                <button className="normal-bnt">Toolbox Talk 4</button>
            </div>
                <div className="tbtf-body">
                <h1 className="tbtf-mn-heading">Toolbox Talk 1</h1>
                    <div className="tbt-items-table">
                        <table className="tbt-dtl-table">
                            <tr>
                                <th>Item</th>
                                <th>Comment</th>
                                <th>Done</th>
                            </tr>
                            <tr>
                                <td>Describe work to be done</td>
                                <td className="n-comments-tbt">
                                    <ul className="tbt-lists">
                                        <li>
                                            Give full description of the work tasks and steps to be
                                        followed</li>
                                        <li>
                                            <p className="tbt-nor-list">
                                                <span>Detail relevant procedures</span>
                                                <fieldset className="tbt-input-text no-label">
                                                    <Field
                                                        name="name"
                                                        type="text"
                                                        component={customInput}
                                                    />
                                                </fieldset>
                                            </p>
                                        </li>
                                    </ul>
                                </td>
                                <td>
                                    <Field name="" component={CustomCheckbox} />
                                </td>
                            </tr>
                            <tr>
                                <td>Describe work to be done</td>
                                <td className="n-comments-tbt">
                                    <p className="tbt-nor-list">
                                        <span>Highlight danger areas</span>
                                        <fieldset className="tbt-input-text no-label">
                                            <Field
                                                name="name"
                                                type="text"
                                                component={customInput}
                                            />
                                        </fieldset>
                                    </p>
                                </td>
                                <td>
                                    <Field name="" component={CustomCheckbox} />
                                </td>
                            </tr>
                            <tr>
                                <td>Describe work to be done</td>
                                <td className="n-comments-tbt">
                                    <p className="tbt-nor-list">
                                        <strong>Permit(s) Type and Number:</strong>
                                        <fieldset className="tbt-input-text no-label">
                                            <Field
                                                name="name"
                                                type="text"
                                                component={customInput}
                                            />
                                        </fieldset>
                                    </p>
                                </td>
                                <td>
                                    <Field name="" component={CustomCheckbox} />
                                </td>
                            </tr>
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
                                <tr>
                                    <td>Attachment Name</td>
                                    <td><img className="attach-jb-img" src="../images/before-pic.jpg"/></td>
                                </tr>
                            </table>
                        </div>

                        <div className="ttg-note-table mt-4">
                            <table className="tbt-dtl-table">
                                <tr>
                                    <th colSpan="2">Notes</th>
                                </tr>
                                <tr>
                                    <td>1.</td>
                                    <td>If a worker is on site but fails to attend the toolbox talk, the reason for their non-attendance is to be documented on the toolbox talk sheet. They
are then to be given a brief toolbox talk before taking their respective positions.</td>
                                </tr>
                                <tr>
                                    <td>2.</td>
                                    <td>Any changes made during the shift by the Shift Manager must be fully communicated to all parties – if necessary hold a mini toolbox talk, after breaks</td>
                                </tr>
                            </table>
                        </div>

                        {/* signature */}

                        <div className="ttg-note-table mt-4">
                            <h3 className="ackn-tbl-heading">Signature</h3>
                            <img className="ttg-sign-img" src="../images/sign.png"/>
                        </div>

                    </div>
                </div>

            </div>
        );
    }
}

export default ViewToolboxTalk;
