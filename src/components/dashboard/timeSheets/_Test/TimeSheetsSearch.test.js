import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import TimeSheetsSearch from '../TimeSheetsSearch';

describe('TimeSheetsSearch Component Test', () => {
    const initialState = {
        timeSheet: {
            jobsList: []
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<TimeSheetsSearch store={store} />)
    })

    it('should render component TimeSheetsSearch correctly', () => {
        const component = shallow(<TimeSheetsSearch store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) TimeSheetsSearch component', () => {
        expect(container.length).toEqual(1)
    });
})