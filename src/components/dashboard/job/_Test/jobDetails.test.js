import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import JobDetails from '../jobDetails';

describe('JobDetails Component Test', () => {
    const initialState = {
        sAJobMgmt: {
            jobDetails: []
        },
        form: {
            jobDetails: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<JobDetails store={store} />)
    })

    it('should render component JobDetails correctly', () => {
        const component = shallow(<JobDetails store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) JobDetails component', () => {
        expect(container.length).toEqual(1)
    });

})

