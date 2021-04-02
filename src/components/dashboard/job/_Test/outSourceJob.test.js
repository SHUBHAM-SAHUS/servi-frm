import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import OutSourceJob from '../outSourceJob';

describe('OutSourceJob Component Test', () => {
    const initialState = {
        jobsManagement: {
            jobsList: []
        },
        organization: {
            serviceAgents: []
        },
        form: {
            outSourceJob: {
                values: {}
            }
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<OutSourceJob store={store} />)
    })

    it('should render component OutSourceJob correctly', () => {
        const component = shallow(<OutSourceJob store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) OutSourceJob component', () => {
        expect(container.length).toEqual(1)
    });

})

