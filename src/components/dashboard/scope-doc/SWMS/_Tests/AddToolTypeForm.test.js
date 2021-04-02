import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddToolTypeForm from '../AddToolTypeForm';

describe('AddToolTypeForm Component Test', () => {
    const initialState = {
       
    }

    const mockStore = configureStore()
    var store

    beforeEach(() => {
        store = mockStore(initialState)
    })

    it('should render component AddToolTypeForm correctly', () => {
        const component = shallow(<AddToolTypeForm store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddToolTypeForm component', () => {
        const component = shallow(<AddToolTypeForm store={store} />);
        expect(component.length).toEqual(1)
    });
});