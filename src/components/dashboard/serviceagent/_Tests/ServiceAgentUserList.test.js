import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ServiceAgentUserList from '../ServiceAgentUserList';

describe('ServiceAgentUserList Component Test', () => {
    const initialState = {
        organizationUsers: {
            users: [],
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ServiceAgentUserList store={store} />)
    })

    it('should render component service agent users list correctly', () => {
        
        expect(container).toMatchSnapshot();
    });

    it('Render the connected(SMART) ServiceAgentUserList component', () => {
        expect(container.length).toEqual(1)
    });

})

