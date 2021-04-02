import React, { Component } from 'react';
import { connect } from 'react-redux';
import IdleTimer from 'react-idle-timer'
import { notification } from 'antd';
import HeadRoute from './components/Routes/headRoute';
import * as actions from './actions';
import { logoutUser } from './actions/index';
import { Store } from './index';
import { Strings } from './dataProvider/localize'
import { ERROR_NOTIFICATION_KEY } from './config';
class App extends Component {
  constructor(props) {
    super(props);
    this.state = { idleTime: 1000 * 60 * 15 };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.idleTime !== this.props.idleTime) {
      if (this.props.idleTime > 0) {
        this.setState({ idleTime: this.props.idleTime });
      }
    }
  }
  render() {
    this.onIdle = async (e) => {
      await logoutUser(Store.dispatch);
      return notification.error({
        key: ERROR_NOTIFICATION_KEY,
        message: Strings.error_title,
        description: "Your Session Expired.", onClick: () => { },
        className: 'ant-error'
      });
    }

    return (
      <div className="App">
        <IdleTimer
          ref={ref => { this.idleTimer = ref }}
          element={document}
          onActive={this.onActive}
          onIdle={this.onIdle}
          onAction={this.onAction}
          debounce={250}
          timeout={this.state.idleTime} />

        {
          this.props.showSpinner > 0 ?
            <div className="sk-loder-st">
              <div class="sk-circle">
                <div class="sk-circle1 sk-child"></div>
                <div class="sk-circle2 sk-child"></div>
                <div class="sk-circle3 sk-child"></div>
                <div class="sk-circle4 sk-child"></div>
                <div class="sk-circle5 sk-child"></div>
                <div class="sk-circle6 sk-child"></div>
                <div class="sk-circle7 sk-child"></div>
                <div class="sk-circle8 sk-child"></div>
                <div class="sk-circle9 sk-child"></div>
                <div class="sk-circle10 sk-child"></div>
                <div class="sk-circle11 sk-child"></div>
                <div class="sk-circle12 sk-child"></div>
              </div>
            </div>
            : null
        }
        <HeadRoute />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    showSpinner: state.auth.showSpinner,
    idleTime: state.auth.idleTime
  }
}

export default connect(mapStateToProps, actions)(App);
