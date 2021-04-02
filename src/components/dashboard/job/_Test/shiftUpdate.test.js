import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ShiftUpdate from '../shiftUpdate';

describe('ShiftUpdate Component Test', () => {
    const initialState = {
        sAJobCalendar: {
            siteSupervisorsList: [],
            supervisorsList: []
        },
        jobdocManagement: {
            orgUSerList: []
        },
        form: {
            shiftUpdate: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ShiftUpdate store={store} />)
    })

    it('should render component ShiftUpdate correctly', () => {
        const component = shallow(<ShiftUpdate store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ShiftUpdate component', () => {
        expect(container.length).toEqual(1)
    });
})