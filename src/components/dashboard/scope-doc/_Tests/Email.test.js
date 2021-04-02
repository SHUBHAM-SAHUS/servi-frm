import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import Email from '../Email';

describe('Email Component Test', () => {
    const initialState = {
        selectedScopeDoc: {},
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<Email store={store} />)
    })

    it('should render component Email correctly', () => {
        const component = shallow(<Email store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) Email component', () => {
        expect(container.length).toEqual(1)
    });
});