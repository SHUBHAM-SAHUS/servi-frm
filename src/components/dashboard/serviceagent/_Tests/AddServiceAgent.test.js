import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddServiceAgent from '../AddServiceAgent';

describe('ServiceAgent Component Test', () => {
    const initialState = {
        subscription: {
            subscriptions: [],
        },
        roleManagement: {
            roles: []
        },
        organization: {
            otherServiceAgents: []
        },
        form: {
            addServiceAgent: {
                values: {}
            }
        },
        industryManagement: {
            industries: [],
            services: [], 
            categories: [],
            subCategories:[]
        }

    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddServiceAgent store={store} />)
    })

    it('should render component ServiceAgentSaveCard correctly', () => {
        const component = shallow(<AddServiceAgent store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ServiceAgentSaveCard component', () => {
        expect(container.length).toEqual(1)
    });

})

