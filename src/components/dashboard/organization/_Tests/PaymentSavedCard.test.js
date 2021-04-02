import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import PaymentSavedCard from '../PaymentSavedCard';

describe('ServiceAgent PaymentSavedCard Component Test', () => {
    const initialState = {}

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<PaymentSavedCard store={store} />)
    })

    it('should render component PaymentSavedCard correctly', () => {
        const component = shallow(<PaymentSavedCard store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) PaymentSavedCard component', () => {
        expect(container.length).toEqual(1)
    });
})

