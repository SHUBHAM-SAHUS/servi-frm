import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import OrganizationUserList from '../OrganizationUserList';

describe('ServiceAgent OrganizationUserList Component Test', () => {
    const initialState = {
        organizationUsers: {
            users: [],
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<OrganizationUserList store={store} />)
    })

    it('should render component OrganizationUserList correctly', () => {
        const component = shallow(<OrganizationUserList store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) OrganizationUserList component', () => {
        expect(container.length).toEqual(1)
    });
})

