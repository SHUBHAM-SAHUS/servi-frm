import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import UserManagement from '../UserManagement';

describe('UserManagement Component Test', () => {
    const initialState = {
        organizationUsers: {
            organizationUsers: [],
        }

    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<UserManagement store={store} />)
    })

    it('should render component user management correctly', () => {
        
        expect(container).toMatchSnapshot();
    });

    it('Render the connected(SMART) UserManagement component', () => {
        expect(container.length).toEqual(1)
    });

})

