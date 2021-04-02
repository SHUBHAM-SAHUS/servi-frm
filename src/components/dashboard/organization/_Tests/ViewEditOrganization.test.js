import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewEditOrganization from '../ViewEditOrganization';

describe('ServiceAgent ViewEditOrganization Component Test', () => {
    const initialState = {
        organization: {
            initialValues: {},
            organizations: {
                organizations: []
            },
            organizationUsers: {
                users: []
            },
            roleManagement: {
                roles: []
            },
            organizationBilling: {
                billingDetails: {}
            },
            form: {
                syncErrors: {},
                formValues: {}
            },
            subscriptions: {
                subscriptions: {}
            }

        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ViewEditOrganization store={store} />)
    })

    it('should render component ViewEditOrganization correctly', () => {
        expect(container).toMatchSnapshot();
    });

    // it('Render the connected(SMART) ViewEditOrganization component', () => {
    //     expect(container.length).toEqual(1)
    // });
})

