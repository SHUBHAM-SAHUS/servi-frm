import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import ViewJobEmail from '../ViewJobEmail';

describe('ViewJobEmail Component Test', () => {
    const initialState = {
        jobDocEmailList: [],
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ViewJobEmail store={store} />)
    })

    it('should render component ViewJobEmail correctly', () => {
        const component = shallow(<ViewJobEmail store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) JobEmail component', () => {
        expect(container.length).toEqual(1)
    });
});