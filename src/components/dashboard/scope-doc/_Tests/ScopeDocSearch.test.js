import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import ScopeDocSearch from '../ScopeDocSearch';

describe('Scope Doc Search Component Test', () => {
    const initialState = {
        scopeDocs: {
            scopeDocs: [],
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ScopeDocSearch store={store} />)
    })

    it('should render component ScopeDocSearch correctly', () => {
        const component = shallow(<ScopeDocSearch store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ScopeDocSearch component', () => {
        expect(container.length).toEqual(1)
    });
});