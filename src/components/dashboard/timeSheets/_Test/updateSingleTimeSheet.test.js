import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import UpdateSingleTimeSheet from '../updateSingleTimeSheet';

describe('UpdateSingleTimeSheet Component Test', () => {
    const initialState = {
        timeSheet: {
            timeSheetList: []
        },
        form: {
            updateSingleTimesheet: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<UpdateSingleTimeSheet store={store} />)
    })

    it('should render component UpdateSingleTimeSheet correctly', () => {
        const component = shallow(<UpdateSingleTimeSheet store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) UpdateSingleTimeSheet component', () => {
        expect(container.length).toEqual(1)
    });
})