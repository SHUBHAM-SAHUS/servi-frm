import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ServiceAgentSaveCard from '../ServiceAgentSaveCard';

describe('ServiceAgent ServiceAgentSaveCard Component Test', () => {
    const initialState = {
        organizationBilling: {
            billingDetails: {},
        },
        subscription: {
            subscriptions: [],
        },
        form: {
            addPaymentDetails: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ServiceAgentSaveCard store={store} />)
    })

    it('should render component ServiceAgentSaveCard correctly', () => {
        const component = shallow(<ServiceAgentSaveCard store={store} />);
        expect(component).toMatchSnapshot();
    });

    // it('Render the connected(SMART) ServiceAgentSaveCard component', () => {
    //     expect(container.length).toEqual(1)
    // });

    // it('Render the connected(SMART) ServiceAgentSaveCard component', () => {
    //     expect(container.length).toEqual(1)
    // });
})

