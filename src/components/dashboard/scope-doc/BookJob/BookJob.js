import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, Collapse, notification, Popconfirm } from 'antd';
import { Strings } from '../../../../dataProvider/localize';
import { CustomDatepicker } from '../../../common/customDatepicker';
import { validate } from '../../../../utils/Validations/scopeDocValidation';
import { handleFocus, currencyFormat } from '../../../../utils/common';
import { calculateEstimate } from '../ViewEditScopeDoc'
import moment from 'moment';
import SaveTaskBooking from './SaveTaskBooking';
import * as action from '../../../../actions/scopeDocActions'
import { ERROR_NOTIFICATION_KEY } from '../../../../config';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';

const Panel = Collapse.Panel;

class BookJob extends React.Component {
    durations = ["Day", "Week", "Fortnight", "Month", "Year"];
    disableDate = (current) => {
        var startDate = moment(new Date());
        return current && current.valueOf() < startDate;
    }
    state = {
        expanded: [], durationDataSource: [], selectedQuoteDuration: ''
    }
    disableDate = (current) => {
        var startDate = moment(new Date());
        return current && current.valueOf() < startDate;
    }

    getSnapshotBeforeUpdate(prevprops, prevstate) {
        if (prevprops.selectedSiteTaskSWMS && this.props.selectedSiteTaskSWMS
            && prevprops.selectedSiteTaskSWMS.id !== this.props.selectedSiteTaskSWMS.id) {
            this.setState({ expanded: [...this.state.expanded, this.props.selectedSiteTaskSWMS.id] });
        }
    }

    handleRebookQuote = (scopeDocId, quote_number, clientId) => {
        this.props.action
            .rebookQuote(scopeDocId, quote_number)
            .then(message => {
                if (message) {
                    notification.success({
                        message: Strings.success_title,
                        description: message ? message : "Quote Rebook Successfully.",
                        onClick: () => { },
                        className: 'ant-success'
                    });
                    this.props.action.getPrimaryPersons(clientId);
                    this.props.handleCancel()
                    this.props.history.push({ pathname: '../scopedoc/showScopeDoc', state: scopeDocId })
                }
            })
            .catch(message => {
                console.error(message)
                notification.error({
                    key: ERROR_NOTIFICATION_KEY,
                    message: Strings.error_title,
                    description: message && typeof message === "string" ? message : Strings.generic_error,
                    onClick: () => { },
                    className: "ant-error"
                });
            });
    }

    handleDurationSearch = value => {
        var letterNumber = /^[1-9]+$/;
        var array = value.split(" ");

        if (value.match(letterNumber)) {
            let post = value > 1 ? "s" : ""
            this.setState({
                durationDataSource: !value ? [] : this.durations.map(title => ({ text: value + " " + title + post, value: value + " " + title + post })),
            });
        } else if (array.length > 1 && !isNaN(array[0])) {
            let postfix = array[0] > 1 ? "s" : ""
            let filterValue = this.durations.filter(val => {
                return val.toLowerCase().includes((array[1].toLowerCase()))
            })
            this.setState({
                durationDataSource: !value ? [] : filterValue.map(title => ({ text: array[0] + " " + title + postfix, value: array[0] + " " + title + postfix })),
            });
        } else {
            this.setState({
                durationDataSource: !value ? [] : this.durations.map(title => ({ text: title, value: title.toString() })),
            });
        }
    };

    setInitialValues = (task, quote_managements_task) => {
        if (this.props.initialValues.quote_start_date && this.props.initialValues.quote_duration && (!task.start_date || !task.frequency_end_date)) {
            const numeric = Number(this.props.initialValues.quote_duration.split(' ')[0]);
            const unit = (this.props.initialValues.quote_duration.split(' ')[1]).toLowerCase();
            const calculatedFrequencyEndDate = moment(this.props.formValues.quote_start_date).add(numeric, unit);
            return {
                ...task,
                quote_managements_task: JSON.stringify(quote_managements_task),
                start_date: task.start_date ? task.start_date : this.props.initialValues.quote_start_date,
                frequency_end_date: task.frequency_end_date ? task.frequency_end_date : calculatedFrequencyEndDate
            }
        } else if (this.props.formValues.quote_start_date && this.props.formValues.quote_duration && this.state.selectedQuoteDuration !== '') {
            const numeric = Number(this.state.selectedQuoteDuration.split(' ')[0]);
            const unit = (this.state.selectedQuoteDuration.split(' ')[1]).toLowerCase();
            const calculatedFrequencyEndDate = moment(this.props.formValues.quote_start_date).add(numeric, unit);
            return {
                ...task,
                quote_managements_task: JSON.stringify(quote_managements_task),
                start_date: this.props.formValues.quote_start_date,
                frequency_end_date: calculatedFrequencyEndDate
            }
        } else if (this.props.formValues.quote_start_date && !this.props.formValues.quote_duration) {
            return {
                ...task,
                quote_managements_task: JSON.stringify(quote_managements_task),
                start_date: this.props.formValues.quote_start_date,
            }
        } else if (this.props.initialValues.quote_start_date && this.props.initialValues.quote_duration) {
            return {
                ...task,
                quote_managements_task: JSON.stringify(quote_managements_task)
            }
        }
    }

    handleDurationSelection = (value) => {
        this.setState({ selectedQuoteDuration: value })
    }

    handleBookJobSubmit = (taskIndex) => {
        const expandedPanels = [...this.state.expanded]
        expandedPanels.splice(expandedPanels.indexOf(taskIndex), 1)
        this.setState({expanded: expandedPanels})
    }

    render() {
        const { allTasks, selectedScopeDoc, selectedScopeDocID, handleCancel, quoteManagement } = this.props;
        return (
            <div className="sf-card">
                <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
                    <h4 className="sf-sm-hd sf-pg-heading">{"Book Calendar"}</h4>
                    <button class="closed-btn" onClick={handleCancel}><Icon type="close" /></button>
                </div>
                <div className="sf-card-body jbdc-staff-list" >
                    <h2>Quote: {selectedScopeDoc && selectedScopeDoc.quotes && selectedScopeDoc.quotes[0]
                        && selectedScopeDoc.quotes[0].quote_number}</h2>
                    {
                        !(this.props.initialValues && this.props.initialValues.quote_start_date && this.props.initialValues.quote_duration) ? <form>
                            <fieldset className="form-group sf-form lsico">
                                <Field
                                    label={"Quote Start date"}
                                    name="quote_start_date"
                                    type="date"
                                    disabledDate={this.disableDate}
                                    component={CustomDatepicker}
                                    onChange={this.handleQuoteStartDateChange} />
                            </fieldset>
                            <fieldset className="form-group sf-form">
                                <Field
                                    label="Quote Duration"
                                    name="quote_duration"
                                    component={CustomAutoCompleteSearch}
                                    dataSource={this.state.durationDataSource}
                                    onSearch={this.handleDurationSearch}
                                    onSelect={this.handleDurationSelection}
                                />
                            </fieldset>
                        </form>
                            : (
                                <div className="view-quote-time-header">
                                    <div>
                                        <div className="view-text-value mb-3">
                                            <label>{'Quote Start Date'}</label>
                                            <span>{this.props.initialValues.quote_start_date}</span>
                                        </div>
                                        <div className="view-text-value mb-3">
                                            <label>{'Quote Duration'}</label>
                                            <span>{this.props.initialValues.quote_duration}</span>
                                        </div>
                                    </div>
                                </div>
                            )
                    }
                </div>
                <Collapse className="sf-collps-rt doc-collapse"
                    onChange={(args) => this.setState({ expanded: args })}
                    activeKey={this.state.expanded}
                    expandIcon={({ isActive }) => <Icon type="caret-down" rotate={isActive ? 180 : 0} />}>
                    {allTasks && allTasks.length && allTasks.map((task, index) => {
                        const quote_managements_task = quoteManagement &&
                            quoteManagement.find(quo => quo.task_id === task.id)
                        return <Panel key={task.id} className="sc-doc-panel"
                            header={
                                <div className="d-flex justify-content-between scope-doc-task-header-panel align-items-center">
                                    <h3 className="swms-hd">{task.task_label + "  >  " + task.task_name}
                                    </h3>
                                    {
                                        task.booked_for_calendar
                                            ? <span class="material-icons icon-task-panel">check</span>
                                            : <span class="material-icons icon-task-panel">clear</span>
                                    }

                                </div>
                            }>

                            <div className="sf-card-body">
                                <h3 className="swms-hd"><span className="rfcl-img"><img src="/images/roof-cleaning.png" alt="" /></span>{task.task_label}
                                </h3>

                                <div className="data-v-col">
                                    <div className="view-text-value">
                                        <label>{"Scope"}</label>
                                        <span>{task ?
                                            task.task_name : ""}</span>
                                    </div>
                                </div>
                                <Collapse className="show-frquency-box his-li-table" bordered={false} accordion
                                    expandIcon={({ isActive }) => <Icon type="caret-right" rotate={isActive ? 90 : 0} />}>
                                    <Panel header="View Details" key="1">
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{"Area"}</label>
                                                <span>{task &&
                                                    task.areas ?
                                                    task.areas.map(area => area.area_name + ",") : ""}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{"Site Name"}</label>
                                                <span>{task &&
                                                    task.site_id && selectedScopeDoc && selectedScopeDoc.sites
                                                    && selectedScopeDoc.sites.find(sit => sit.site_id === task.site_id)
                                                    && selectedScopeDoc.sites.find(sit => sit.site_id === task.site_id).site
                                                    && selectedScopeDoc.sites.find(sit => sit.site_id === task.site_id).site.site_name}</span>
                                            </div>
                                        </div>
                                        <div className="data-v-col">
                                            <div className="view-text-value">
                                                <label>{"Notes"}</label>
                                                <span>{task &&
                                                    task.note}</span>
                                            </div>
                                        </div>
                                        {task.estimate ? <div className="esti-data-view">
                                            {typeof task.estimate === 'string' ?
                                                <div className="data-v-col">
                                                    <div className="view-text-value">
                                                        <label>{Strings.estimate_txt}</label>
                                                        <span>{task.estimate}</span>
                                                    </div>
                                                </div>
                                                :
                                                <>
                                                    <label className="esti-hrs-hd">{Strings.estimate_txt}
                                                        <span className="qunty-rate">{currencyFormat(calculateEstimate(task.estimate))}</span> <b>{task.estimate && task.estimate.estimate_type
                                                            && task.estimate.estimate_type.toUpperCase()}</b></label>
                                                    <div className="esti-table">
                                                        {task.estimate && task.estimate.estimate_type === "hours" ? <table className="table">
                                                            <tr className="est-sc-thd">
                                                                <th>Staff</th>
                                                                <th>Hours</th>
                                                                <th>Days</th>
                                                                <th>Rate</th>
                                                            </tr>
                                                            <tr>
                                                                <td>{task.estimate.staff}</td>
                                                                <td>{task.estimate.hours}</td>
                                                                <td>{task.estimate.days}</td>
                                                                <td>{currencyFormat(task.estimate.rate)}</td>
                                                            </tr>
                                                        </table> :
                                                            task.estimate && task.estimate.estimate_type === "area" ?

                                                                <table className="table">
                                                                    <tr className="est-sc-thd">
                                                                        <th>SQM</th>
                                                                        <th>Rate</th>
                                                                    </tr>
                                                                    <tr>
                                                                        <td>{task.estimate.sqm}</td>
                                                                        <td>{currencyFormat(task.estimate.rate)}</td>
                                                                    </tr>
                                                                </table> :
                                                                task.estimate && task.estimate.estimate_type === "quant" ?
                                                                    <table className="table">
                                                                        <tr className="est-sc-thd">
                                                                            <th>Quantity</th>
                                                                            <th>Rate</th>
                                                                        </tr>
                                                                        <tr>
                                                                            <td>{task.estimate.quant}</td>
                                                                            <td>{currencyFormat(task.estimate.rate)}</td>
                                                                        </tr>
                                                                    </table> : null}
                                                    </div>
                                                </>}
                                        </div> : null}
                                    </Panel>
                                </Collapse>
                                <SaveTaskBooking form={'saveTaskBooking$' + index}
                                    initialValues={this.setInitialValues(task, quote_managements_task)}
                                    selectedScopeDocID={selectedScopeDocID} updateBookTask={this.props.updateBookTask}
                                    selectedScopeDoc={this.props.selectedScopeDoc}
                                    bookJobFormValues={this.props.formValues}
                                    onFormSubmit={this.handleBookJobSubmit}
                                    taskIndex={task.id}
                                />
                            </div>
                        </Panel>
                    })
                    }
                </Collapse>
            </div >
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        selectedScopeDoc: state.scopeDocs.scopeDocsDetails ? state.scopeDocs.scopeDocsDetails[0] : {},
        formValues: state.form && state.form.BookJob && state.form.BookJob.values
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(action, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        form: 'BookJob', validate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(BookJob)