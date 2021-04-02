import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ServiceAgent from '../ServiceAgent';

describe('ServiceAgent Component Test', () => {
    const initialState = {
        organization: {
            serviceAgents: [],
            otherServiceAgents: [],
        },
        form:{
            addServiceAgent:{}
        }

    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ServiceAgent store={store} />)
    })

    it('should render component ServiceAgentSaveCard correctly', () => {
        const component = shallow(<ServiceAgent store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ServiceAgentSaveCard component', () => {
        expect(container.length).toEqual(1)
    });

})

