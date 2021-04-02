import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddHRWForm from '../AddHRWForm';

describe('AddHRWForm Component Test', () => {
    const initialState = {
    }

    const mockStore = configureStore()
    var store

    beforeEach(() => {
        store = mockStore(initialState)
    })

    it('should render component AddHRWForm correctly', () => {
        const component = shallow(<AddHRWForm store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddHRWForm component', () => {
        const component = shallow(<AddHRWForm store={store} />);
        expect(component.length).toEqual(1)
    });
});