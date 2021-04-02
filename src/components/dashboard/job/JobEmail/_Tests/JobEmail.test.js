import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import JobEmail from '../JobEmail';

describe('JobEmail Component Test', () => {
    const initialState = {
        jobDocEmailList: [],
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<JobEmail store={store} />)
    })

    it('should render component JobEmail correctly', () => {
        const component = shallow(<JobEmail store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) JobEmail component', () => {
        expect(container.length).toEqual(1)
    });
});