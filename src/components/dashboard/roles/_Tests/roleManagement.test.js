import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import RolesManagement from '../rolesManagement'

describe('Roles Management Component Test', () => {
    const initialState = {
        roleManagement: {
            roles: [],
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<RolesManagement store={store} />)
    })

    it('should render component RolesManagement correctly', () => {
        const component = shallow(<RolesManagement store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) RolesManagement component', () => {
        expect(container.length).toEqual(1)
    });
});