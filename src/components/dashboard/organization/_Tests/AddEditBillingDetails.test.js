import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddEditBillingDetails from '../AddEditBillingDetails';

describe('ServiceAgent AddEditBillingDetails Component Test', () => {
    const initialState = {
        organizationBilling: {
            billingDetails: {},
        },
        form: {
            addEditBillingDetails: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddEditBillingDetails store={store} />)
    })

    it('should render component AddEditBillingDetails correctly', () => {
        const component = shallow(<AddEditBillingDetails store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddEditBillingDetails component', () => {
        expect(container.length).toEqual(1)
    });
})

