import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import RoleSearch from '../roleSearch';

describe('Role Search Component Test', () => {
    const initialState = {
        roleManagement: {
            roles: [],
        },
        accessControlManagement: {
            accessControls: [],
            accessControlsByModule: []
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<RoleSearch store={store} />)
    })

    it('should render component Role Search correctly', () => {
        const component = shallow(<RoleSearch store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) Role Search component', () => {
        expect(container.length).toEqual(1)
    });
});