import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ServiceAgentSearch from '../ServiceAgentSearch';

describe('ServiceAgentSearch Component Test', () => {
    const initialState = {
        organization: {
            serviceAgents: [],
           
        }

    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ServiceAgentSearch store={store} />)
    })

    it('should render component serach service agent industry correctly', () => {
        
        expect(container).toMatchSnapshot();
    });

    it('Render the connected(SMART) ServiceAgentSearch component', () => {
        expect(container.length).toEqual(1)
    });

})

