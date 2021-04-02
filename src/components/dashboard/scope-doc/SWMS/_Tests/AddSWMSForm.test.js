import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddSWMSForm from '../AddSWMSForm';

describe('AddSWMSForm Component Test', () => {
    const initialState = {
        swmsReducer:{
            swmsControl:{}
        }
    }

    const mockStore = configureStore()
    var store

    beforeEach(() => {
        store = mockStore(initialState)
    })

    it('should render component AddSWMSForm correctly', () => {
        const component = shallow(<AddSWMSForm store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddSWMSForm component', () => {
        const component = shallow(<AddSWMSForm store={store} />);
        expect(component.length).toEqual(1)
    });
});