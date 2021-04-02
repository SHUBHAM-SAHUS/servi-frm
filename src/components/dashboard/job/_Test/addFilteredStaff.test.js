import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddFilteredStaff from '../addFilteredStaff';

describe('AddFilteredStaff Component Test', () => {
    const initialState = {
        profileManagement: {
            licenceType: []
        },
        form: {
            addFilteredStaff: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddFilteredStaff store={store} />)
    })

    it('should render component AddFilteredStaff correctly', () => {
        const component = shallow(<AddFilteredStaff store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddFilteredStaff component', () => {
        expect(container.length).toEqual(1)
    });
})