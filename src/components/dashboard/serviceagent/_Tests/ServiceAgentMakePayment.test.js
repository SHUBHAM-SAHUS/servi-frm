import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ServiceAgentMakePayment from '../ServiceAgentMakePayment';

describe('ServiceAgent ServiceAgentMakePayment Component Test', () => {
    const initialState = {
        organizationBilling: {
            billingDetails: {},
        },
        subscription: {
            subscriptions: {},
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ServiceAgentMakePayment store={store} />)
    })

    it('should render component ServiceAgentMakePayment correctly', () => {
        const component = shallow(<ServiceAgentMakePayment store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ServiceAgentMakePayment component', () => {
        expect(container.length).toEqual(1)
    });

    it('Render the connected(SMART) ServiceAgentMakePayment component', () => {
        expect(container.length).toEqual(1)
    });
})

