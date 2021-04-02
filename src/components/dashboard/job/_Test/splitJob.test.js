import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import SplitJob from '../splitJob';

describe('SplitJob Component Test', () => {
    const initialState = {
        jobsManagement: {
            jobsList: []
        },
        organization: {
            serviceAgents: []
        },
        form: {
            SplitJob: {
                values: {}
            }
        },
        scopeDocs: { scopeDocsDetails: [{}] }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<SplitJob store={store} />)
    })

    it('should render component SplitJob correctly', () => {
        const component = shallow(<SplitJob store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) SplitJob component', () => {
        container = shallow(<SplitJob store={store} />)
        expect(container.length).toEqual(1)
    });

})

