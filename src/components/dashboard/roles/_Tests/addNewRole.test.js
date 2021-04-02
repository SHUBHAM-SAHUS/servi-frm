import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddNewRole from '../addNewRole';

describe('Add New Role Component Test', () => {
    const initialState = {
        roleManagement: {
            roles: [],
        },
        accessControlManagement: {
            accessControls: [],
            accessControlsByModule: []
        },
        initialValues: {},

    }

    const mockStore = configureStore()
    var store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddNewRole store={store} />)
    })

    it('should render component AddNewRole correctly', () => {
        const component = shallow(<AddNewRole store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddNewRole component', () => {
        expect(container.length).toEqual(1)
    });
});