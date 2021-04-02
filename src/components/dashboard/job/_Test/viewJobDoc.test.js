import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewJobDocs from '../viewJobDoc';

describe('ViewJobDocs Component Test', () => {
    const initialState = {
        scopeDocs: {
            scopeDocsDetails: [],
            jobDocsDetails: {}
        },
        organization: {
            serviceAgents: []
        },
        form: {
            viewJobDocs: {
                values: {}
            }
        },
        profileManagement: {
            licenceType: []
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ViewJobDocs store={store} />)
    })

    it('should render component ViewJobDocs correctly', () => {
        const component = shallow(<ViewJobDocs store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ViewJobDocs component', () => {
        expect(container.length).toEqual(1)
    });

})

