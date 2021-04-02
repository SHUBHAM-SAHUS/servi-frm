import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import EditBillingAddress from '../EditBillingAddress';

describe('ServiceAgent EditBillingAddress Component Test', () => {
    const initialState = {
        organizationBilling: {
            billingDetails: {},
        },
        initialValues: {}
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<EditBillingAddress store={store} />)
    })

    it('should render component EditBillingAddress correctly', () => {
        const component = shallow(<EditBillingAddress store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) EditBillingAddress component', () => {
        expect(container.length).toEqual(1)
    });
})

