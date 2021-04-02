import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddServiceAgentIndustry from '../AddServiceAgentIndustry';

describe('AddServiceAgentIndustry Component Test', () => {
    const initialState = {
        organization: {
            serviceAgents: [],
            otherServiceAgents: [],
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
            subCategories: []
        }

    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddServiceAgentIndustry store={store} />)
    })

    it('should render component Add service agent industry correctly', () => {
        
        expect(container).toMatchSnapshot();
    });

    it('Render the connected(SMART) ServiceAgentSaveCard component', () => {
        expect(container.length).toEqual(1)
    });

})

