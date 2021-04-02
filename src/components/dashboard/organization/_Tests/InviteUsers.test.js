import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import InviteUsers from '../InviteUsers';

describe('ServiceAgent InviteUsers Component Test', () => {
    const initialState = {
        organizationUsers: {
            users: []
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<InviteUsers store={store} />)
    })

    it('should render component InviteUsers correctly', () => {
        const component = shallow(<InviteUsers store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) InviteUsers component', () => {
        expect(container.length).toEqual(1)
    });
})

