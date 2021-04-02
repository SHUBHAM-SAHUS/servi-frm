import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import TimeSheets from '../TimeSheets';

describe('TimeSheets Component Test', () => {
    const initialState = {
        timeSheet: {
            timeSheetList: [],
            jobsList: []
        },
        form: {
            timeSheets: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<TimeSheets store={store} />)
    })

    it('should render component TimeSheets correctly', () => {
        const component = shallow(<TimeSheets store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) TimeSheets component', () => {
        expect(container.length).toEqual(1)
    });
})