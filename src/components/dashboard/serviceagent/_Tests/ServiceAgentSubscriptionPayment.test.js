import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ServiceAgentSubscriptionPayment from '../ServiceAgentSubscriptionPayment';

describe('ServiceAgent ServiceAgentSubscriptionPayment Component Test', () => {
    const initialState = {
        organizationBilling: {
            billingDetails: {},
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ServiceAgentSubscriptionPayment store={store} />)
    })

    it('should render component ServiceAgentSubscriptionPayment correctly', () => {
        const component = shallow(<ServiceAgentSubscriptionPayment store={store} />);
        expect(component).toMatchSnapshot();
    });

    // it('Render the connected(SMART) ServiceAgentSaveCard component', () => {
    //     expect(container.length).toEqual(1)
    // });

    // it('Render the connected(SMART) ServiceAgentSaveCard component', () => {
    //     expect(container.length).toEqual(1)
    // });
})

