import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Field, reduxForm, FieldArray, FormSection } from 'redux-form';
import { Strings } from '../../../../../dataProvider/localize'
import { TimePicker, Radio, Dropdown } from 'antd';
import { CustomSelect } from '../../../../common/customSelect';
import { CustomDatepicker } from '../../../../common/customDatepicker';
import { customInput } from '../../../../common/custom-input'
import { customTextarea } from '../../../../common/customTextarea'
import moment from 'moment'

const users = [
  {
    name: "Anurag",
    id: 1
  },
  {
    name: "Kalpesh",
    id: 2
  },
  {
    name: "Arish",
    id: 3
  },
  {
    name: "Rupesh",
    id: 4
  },
  {
    name: "Sumeet",
    id: 5
  },
  {
    name: "Ramanath",
    id: 6
  },
  {
    name: "Prasad",
    id: 7
  },
  {
    name: "Vishnu",
    id: 8
  },
  {
    name: "Vishal",
    id: 9
  },
  {
    name: "Samruddhi",
    id: 10
  }
]

export class HazardDetailsStep extends Component {

  state = {
    value: -1
  }

  componentDidMount() {

  }

  onHazardTimeChange = (value) => {
    this.props.change("hazard_time", value)
  }

  renderActions = ({ fields }) => {
    if (fields.length === 0) {
      fields.push({})
    }

    return (
      <>
        {
          fields.map((action, index) =>
            (
              <div className="row">
                <div className="col-md-7 col-sm-12">
                  <fieldset className="sf-form form-group">
                    <Field
                      name={`${action}.action`}
                      label="Action"
                      type="text"
                      component={customInput} />
                  </fieldset>
                </div>
                <div className="col-md-4 col-sm-12">
                  <fieldset className="sf-form form-group">
                    <Field
                      name={`${action}.user_name`}
                      label="By Whom"
                      placeholder="Select"
                      options={this.props.usersList.map(user => ({
                        title: user.name + " " + (user.last_name ? user.last_name : ""),
                        value: user.user_name
                      }))}
                      component={CustomSelect} />
                  </fieldset>
                </div>
                <div className="col-md-1 col-sm-12 d-flex justify-content-center align-items-center">
                  <div className="act-bnt">
                    <button
                      type="button"
                      className="delete-bnt delete-bnt"
                      userid="176"
                      onClick={() => fields.remove(index)}><i class="fa fa-trash-o"></i></button>
                  </div>
                </div>
              </div>
            )
          )
        }
        <button
          className="normal-bnt add-line-bnt mt-1"
          type="button"
          onClick={() => fields.push({})}><i class="material-icons">add</i>Add More Corrective Actions</button>
      </>
    )
  }

  render() {
    return (
      <>
        <div className="sf-card">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Hazard Details</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">
            <div className="row">
              <div className="col-md-4 col-sm-12">
                <div className="row">
                  <div className="col-md-7">
                    <fieldset className="form-group sf-form lsico">
                      <Field
                        name="hazard_date"
                        label="Date of Incident"
                        component={CustomDatepicker} />
                    </fieldset>
                  </div>
                  <div className="col-md-5">
                    <fieldset className="form-group sf-form lsico w-100">
                      <label>Time</label>
                      <TimePicker
                        name="hazard_time"
                        use12Hours
                        placeholder="Time"
                        value={this.props.formValues && this.props.formValues.hazard_time && this.props.formValues.hazard_time}
                        format="h:mm a"
                        onChange={(value) => this.onHazardTimeChange(value)} />
                    </fieldset>
                  </div>
                </div>
              </div>
              <div className="col-md-4 col-sm-12">
                <fieldset className="sf-form form-group">
                  <Field
                    name="hazard_location"
                    label={Strings.location_txt}
                    type="text"
                    component={customInput} />
                </fieldset>
              </div>
              <div className="col-lg-12">
                <fieldset className="sf-form form-group">
                  <Field
                    label="Description"
                    name="description"
                    type="text"
                    id="description"
                    component={customTextarea} />
                </fieldset>
              </div>
            </div>
          </div>
        </div>

        <div className="sf-card mt-4">
          <div className="sf-card-head abb-1 d-flex justify-content-between align-items-center">
            <h2 className="sf-pg-heading">Immediate Action Taken When Hazard Identified</h2>
            <div className="info-btn disable-dot-menu">
              <Dropdown className="more-info" disabled>
                <i className="material-icons">more_vert</i>
              </Dropdown>
            </div>
          </div>
          <div className="sf-card-body">
            <FieldArray
              name="immediateActions"
              component={this.renderActions}
            />
          </div>
        </div>
      </>
    )
  }
}

const mapStateToProps = (state) => ({
  formValues: state.form.hazardReport && state.form.hazardReport.values,
  usersList: state.organizationUsers.users
})

const mapDispatchToProps = dispatch => ({
})

export default connect(mapStateToProps, mapDispatchToProps)(HazardDetailsStep)
