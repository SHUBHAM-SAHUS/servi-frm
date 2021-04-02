import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import CreateJobDocs from '../createJobDocs';

describe('CreateJobDocs Component Test', () => {
    const initialState = {
        scopeDocs: {
            scopeDocsDetails: []
        },
        organization: {
            serviceAgents: []
        },
        form: {
            createJobDocs: {
                values: {}
            }
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<CreateJobDocs store={store} />)
    })

    it('should render component CreateJobDocs correctly', () => {
        const component = shallow(<CreateJobDocs store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) CreateJobDocs component', () => {
        expect(container.length).toEqual(1)
    });

})

