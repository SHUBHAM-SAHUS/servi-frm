import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewEditServiceAgent from '../ViewEditServiceAgent';

describe('ViewEditServiceAgent Component Test', () => {
    const initialState = {
        organization: {
            serviceAgents: [],
        },
        form: {
            viewEditServiceAgent: {
                values: {}
            }
        },
        industryManagement: {
            industries: [],
            services: [],
            categories: [],
            subCategories: []
        },
        organizationUsers: {
            users: [],
        },
        subscription: {
            subscriptions: []
        }

    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ViewEditServiceAgent store={store} />)
    })

    it('should render component view edit service agent correctly', () => {

        expect(container).toMatchSnapshot();
    });



})

