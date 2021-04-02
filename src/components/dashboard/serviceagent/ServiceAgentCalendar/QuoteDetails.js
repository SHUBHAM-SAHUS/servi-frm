import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Checkbox } from 'antd';
import { Strings } from '../../../../dataProvider/localize';
import moment from 'moment';
import {withRouter} from 'react-router-dom'

export class QuoteDetails extends Component {

  state = {
    checked: 0
  }

  static getDerivedStateFromProps(props, state) {

  }

  onCheckChange = () => {
    this.setState({ checked: !this.state.checked })
  }

  render() {
    const { task } = this.props

    return (
      <div className="col-md-3">
        <div className="sf-card sf-shadow">
          <div className="sf-card-head jc-head">
            <div className="doc-vlue">{Strings.quote_txt}
              <span>{task && task.quote_number}</span>
            </div>
          </div>
          <div className="sf-card-body px-0">
            <div className="job-date-list sf-scroll-bar">
              <div className="job-date-item">
                <h3 class="job-c-my">{moment(new Date()).format("MMMM")}</h3>
                <div className="job-c-details">
                  <div className="sf-chkbx-group">
                    <Checkbox
                      onChange={() => this.onCheckChange()}
                      checked={this.state.checked}
                      disabled={false}>
                      {moment(task && task.start).format("DD-MM-YYYY")}
                    </Checkbox>
                  </div>
                  <div className="jc-chk-value">
                    <div className="jc-value-dtls">
                      <span className="jc-assign">{`${task && task.client_name}: ${task && task.title}`}</span>
                      <span className="jc-assign">{task && task.areas && (task.areas.length > 0) ? task.areas.map((area, index) => index > 0 ? `, ${area.area_name}` : area.area_name) : 'No areas'}</span>
                    </div>
                    <span>Budget: ${task && task.outsourced_budget}</span>
                    <div id="sfPopOver" className="add-sa">
                      {/* <button type="button" class="ant-btn bnt-simple add-sa-bnt"><i class="material-icons">add_circle</i><span> Add SA</span></button> */}
                      <button
                        className="jc-outsource normal-bnt"
                        disabled=""
                        type="button"
                        onClick={() => this.props.history.push({ pathname: '/dashboard/jobDetails', state: task.job_number })}>See Details</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({
  
})

const mapDispatchToProps = {
  
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(QuoteDetails))
