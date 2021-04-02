import React, { Component } from 'react'
import { connect } from 'react-redux'
import { Upload, Icon, Modal, Calendar, Select, Carousel, Collapse, TimePicker, Radio, Popover, Button, Steps, Divider } from 'antd';
const { Step } = Steps;

export class StepsProgress extends Component {

  state = {

  }

  static getDerivedStateFromProps(props, state) {
    return null;
  }

  render() {
    return (

      <div className="incident-steps">
        <Steps progressDot current={this.props.currentStep} direction="vertical">
          <Step title="Personal Details" />
          <Step title="Hazard Details" />
          <Step title="Corrective actions" />
        </Steps>
      </div>
    )
  }
}

const mapStateToProps = (state) => ({

})

const mapDispatchToProps = dispatch => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(StepsProgress)
