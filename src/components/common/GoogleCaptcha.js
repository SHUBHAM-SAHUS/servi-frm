import
React,
{
    Component
} from 'react';
import {
    loadReCaptcha,
    ReCaptcha
} from 'react-recaptcha-google';

import { SITEKEY } from '../../config.js';

class GoogleCaptcha extends Component {
    constructor(props, context) {
        super(props, context);
        this.onLoadRecaptcha = this.onLoadRecaptcha.bind(this);
        this.verifyCallback = this.verifyCallback.bind(this);
    }
  
    componentDidMount() {
        loadReCaptcha();
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
    }
   
    onLoadRecaptcha() {
        if (this.captchaDemo) {
            this.captchaDemo.reset();
        }
    }
   
    verifyCallback(recaptchaToken) {
        if (recaptchaToken) {
            this.props.handlerFromParant("Verified");
        }
    }

    expiredCallback() {
        this.captchaDemo.reset();
    }

    render() {
        return (
            <div>
                <ReCaptcha
                    ref={(el) => { this.captchaDemo = el; }}
                    size="normal"
                    data-theme="dark"
                    render="explicit"
                    data-badge="null"
                    sitekey= {SITEKEY}
                    onloadCallback={this.onLoadRecaptcha}
                    verifyCallback={this.verifyCallback}
                    expiredCallback={this.expiredCallback}
                />
            </div>
        );
    };
};

export default GoogleCaptcha;