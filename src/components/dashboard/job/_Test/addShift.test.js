import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddShift from '../addShift';

describe('AddShift Component Test', () => {
    const initialState = {
        sAJobCalendar: {
            siteSupervisorsList: [],
            supervisorsList: []
        },
        jobdocManagement: {
            orgUSerList: []
        },
        form: {
            addShift: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddShift store={store} />)
    })

    it('should render component AddShift correctly', () => {
        const component = shallow(<AddShift store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddShift component', () => {
        expect(container.length).toEqual(1)
    });
})