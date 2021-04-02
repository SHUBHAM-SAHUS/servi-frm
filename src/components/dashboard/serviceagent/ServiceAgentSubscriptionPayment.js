import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { ADMIN_DETAILS } from '../../../dataProvider/constant';
import ServiceAgentMakePayment from '../serviceagent/ServiceAgentMakePayment';
import ServiceAgentSaveCard from '../serviceagent/ServiceAgentSaveCard';
import * as orgBillingActions from "../../../actions/organizationBillingAction";
import {getStorage, setStorage} from '../../../utils/common';

class ServiceAgentSubscriptionPayment extends React.Component {

    constructor(props) {
        super(props);
        this.state = { showSavedCards: false }
        this.getCardDetails()
    }

    getCardDetails = () => {
        var organId = JSON.parse(getStorage(ADMIN_DETAILS)) ? JSON.parse(getStorage(ADMIN_DETAILS)).organisation.id : null
        this.props.billingAction.getOrganizationBillingDetails(this.props.agentID).then((message) => {
            if (this.props.billingDetails.card_details != null) {
                this.setState({
                    showSavedCards: false
                })
            } else {
                this.setState({
                    showSavedCards: true
                })
            }
        }).catch((message) => {
        });
    }

    showDifferentCard = () => {
        this.setState({
            showSavedCards: true
        })
    }

    showSavedCardPage = () => {
        this.setState({
            showSavedCards: false
        })
    }

    render() {
        return (
            <div>
                {(this.props.billingDetails.card_details != null) ?
                    (this.state.showSavedCards ?
                        <ServiceAgentSaveCard agentID={this.props.agentID} subscriptionID={this.props.subscriptionID} showCard={this.showSavedCardPage} dissmissSubscriptionPayment={this.props.dissmissSubscriptionPayment} />
                        : <ServiceAgentMakePayment agentID={this.props.agentID} subscriptionID={this.props.subscriptionID} showDifferentCard={this.showDifferentCard} dissmissSubscriptionPayment={this.props.dissmissSubscriptionPayment} />
                    ) : <ServiceAgentSaveCard agentID={this.props.agentID} subscriptionID={this.props.subscriptionID} showCard={this.showSavedCardPage} dissmissSubscriptionPayment={this.props.dissmissSubscriptionPayment} />}
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        billingDetails: state.organizationBilling.billingDetails,
    }
}

const mapDispatchToprops = dispatch => {
    return {
        billingAction: bindActionCreators(orgBillingActions, dispatch)
    }
}

export default connect(mapStateToProps, mapDispatchToprops)(ServiceAgentSubscriptionPayment);;