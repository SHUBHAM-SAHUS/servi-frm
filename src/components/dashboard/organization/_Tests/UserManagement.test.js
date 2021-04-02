import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import UserManagement from '../UserManagement';

describe('ServiceAgent UserManagement Component Test', () => {
    const initialState = {
        organizationUsers: {
            users: []
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<UserManagement store={store} />)
    })

    it('should render component UserManagement correctly', () => {
        const component = shallow(<UserManagement store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) UserManagement component', () => {
        expect(container.length).toEqual(1)
    });
})

