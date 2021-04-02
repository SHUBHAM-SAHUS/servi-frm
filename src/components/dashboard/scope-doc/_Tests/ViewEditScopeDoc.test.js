import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import ViewEditScopeDoc from '../ViewEditScopeDoc';

describe('ViewEditScopeDoc Component Test', () => {
    const initialState = {
        scopeDocs: {
            scopeDocs: [],
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ViewEditScopeDoc store={store} />)
    })

    it('should render component ViewEditScopeDoc correctly', () => {
        const component = shallow(<ViewEditScopeDoc store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ViewEditScopeDoc component', () => {
        expect(container.length).toEqual(1)
    });
});