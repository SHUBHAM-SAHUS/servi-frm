import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import EditClientDetails from '../EditClientDetails';

describe('EditClientDetails Component Test', () => {
    const initialState = {
        scopeDocs: {
            scopeDocs: [],
        },
        initialValues: {},
        selectedScopeDoc: {}
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<EditClientDetails store={store} />)
    })

    it('should render component ScopeDocSearch correctly', () => {
        const component = shallow(<EditClientDetails store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ScopeDocSearch component', () => {
        expect(container.length).toEqual(1)
    });
});