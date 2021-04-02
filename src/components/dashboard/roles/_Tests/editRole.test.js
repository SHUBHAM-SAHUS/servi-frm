import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import EditRole from '../editRole'

describe('Edit Role Component Test', () => {
    const initialState = {
        roleManagement: {
            roles: [],
        },
        accessControlManagement: {
            accessControlsByModule: []
        },
        permissionByRoleManagement: {
            permissionByRole: []
        },
        initialValues: {}
    }

    const mockStore = configureStore()
    var store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<EditRole store={store} />)
    })

    it('should render component Edit Role correctly', () => {
        const component = shallow(<EditRole store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) Edit Role component', () => {
        expect(container.length).toEqual(1)
    });
});