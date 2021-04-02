import React from 'react';
import { reduxForm, Field } from 'redux-form';
import { connect } from 'react-redux';
import { compose, bindActionCreators } from 'redux';
import { Icon, Collapse, notification } from 'antd';
import { Strings } from '../../../../dataProvider/localize';
import { CustomDatepicker } from '../../../common/customDatepicker';
import { validate } from '../../../../utils/Validations/scopeDocValidation';
import { handleFocus, currencyFormat } from '../../../../utils/common';
import { calculateEstimate } from '../ViewEditScopeDoc'
import moment from 'moment';
import { CustomAutoCompleteSearch } from '../../../common/customAutoCompleteSearch';
import * as actions from '../../../../actions/scopeDocActions';
import * as bookingCalendarActions from '../../../../actions/bookingCalendarActions';


const Panel = Collapse.Panel;

class SaveTaskBooking extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            durationDataSource: [],
            frequencyDataSource: [],
        }
    }

    frequencies = ["Day", "Week", "Month", "Year"];
    durations = ["Day", "Week", "Fortnight", "Month", "Year"];

    onSubmit = formData => {
        let data = { ...formData, ...this.props.bookJobValues }
        data.quote_duration = data.quote_duration ? data.quote_duration.toUpperCase().split(' ').join('_') : ''
        data.duration = data.duration ? data.duration.toUpperCase().split(' ').join('_') : ''
        data.frequency = data.frequency ? data.frequency.toUpperCase().split(' ').join('_') : ''
        data.start_date = data.start_date ? moment(data.start_date).format('YYYY-MM-DD') : null;
        data.frequency_end_date = data.frequency_end_date ? moment(data.frequency_end_date).format('YYYY-MM-DD') : null;
        data.quote_start_date = data.quote_start_date ? moment(data.quote_start_date).format('YYYY-MM-DD') : null;

        console.log(data);
        this.props.action.saveScopeDocJob(this.props.selectedScopeDocID, data)
            .then((res) => {
                this.props.action.getScopeDoc()
                    .then(() => {
                        this.props.bookingCalendarActions.getBookedJobsList(this.props.selectedScopeDoc)
                        this.props.updateBookTask();
                    })
                    .then(() => {

                    })
                this.props.onFormSubmit(this.props.taskIndex)
                notification.success({
                    message: Strings.success_title,
                    description: res.message,
                    onClick: () => { },
                    className: 'ant-success'
                });
            }).catch((data) => {
                notification.error({
                    message: Strings.error_title,
                    description: typeof data === "string" ? data : data.data.message ? data.data.message : Strings.generic_error,
                    onClick: () => { },
                    className: 'ant-error'
                });
            });

    }

    toggleDetails = () => this.setState({ showDetails: this.state.showDetails })

    disableDate = (current) => {
        var startDate = moment(new Date());
        return current && current.valueOf() < startDate;
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
    handleFrequencySearch = value => {
        var letterNumber = /^[ 1-9]+$/;
        var array = value.split(" ");

        if (value.match(letterNumber)) {
            let postfix = value > 1 ? "s" : ""
            this.setState({
                frequencyDataSource: !value ? [] : this.frequencies.map(title => ({ text: value + " " + title + postfix, value: value + " " + title + postfix })),
            });
        } else if (array.length > 1 && !isNaN(array[0])) {
            let postfix = array[0] > 1 ? "s" : ""
            let filterValue = this.frequencies.filter(val => {
                return val.toLowerCase().includes((array[1].toLowerCase()))
            })
            this.setState({
                frequencyDataSource: !value ? [] : filterValue.map(title => ({ text: array[0] + " " + title + postfix, value: array[0] + " " + title + postfix })),
            });
        } else {
            this.setState({
                frequencyDataSource: !value ? [] : this.frequencies.map(title => ({ text: title, value: title.toString() })),
            });
        }
    };

    render() {
        const { handleSubmit, initialValues } = this.props;
        return (
            <form onSubmit={handleSubmit(this.onSubmit)} >
                <fieldset className="form-group sf-form lsico">
                    <Field
                        label={Strings.expected_start_date_txt}
                        name="start_date"
                        type="date"
                        disabledDate={this.disableDate}
                        // disabled={initialValues.disable_start_date}
                        component={CustomDatepicker} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label={Strings.task_duration_txt}
                        name="duration"
                        type="name"
                        id="duration"
                        component={CustomAutoCompleteSearch}
                        dataSource={this.state.durationDataSource}
                        onSearch={this.handleDurationSearch}
                        onSelect={this.handleSelection} />
                </fieldset>
                <fieldset className="form-group sf-form">
                    <Field
                        label={Strings.repeat_txt}
                        name="frequency"
                        type="text"
                        id="frequency"
                        component={CustomAutoCompleteSearch}
                        dataSource={this.state.frequencyDataSource}
                        onSearch={this.handleFrequencySearch}
                        onSelect={this.handleSelection} />
                </fieldset>
                <fieldset className="form-group sf-form lsico">
                    <Field
                        label="Frequency End Date"
                        name="frequency_end_date"
                        type="date"
                        id="frequency_end_date"
                        component={CustomDatepicker} />
                </fieldset>
                <div className="d-flex justify-content-center">
                    <button type="submit" className="bnt bnt-active" /* disabled={!this.props.dirty} */ >Book Task</button>
                </div>
            </form>);
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        bookJobValues: state.form.BookJob &&
            state.form.BookJob.values ? state.form.BookJob.values : {},
    }
}

const mapDispatchToprops = dispatch => {
    return {
        action: bindActionCreators(actions, dispatch),
        bookingCalendarActions: bindActionCreators(bookingCalendarActions, dispatch)
    }
}

export default compose(
    connect(mapStateToProps, mapDispatchToprops),
    reduxForm({
        validate, enableReinitialize: true,
        onSubmitFail: (errors, dispatch, sub, props) => {
            handleFocus(errors, "#");
        }
    })
)(SaveTaskBooking)