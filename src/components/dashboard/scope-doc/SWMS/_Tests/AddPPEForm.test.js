import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddPPEForm from '../AddPPEForm';

describe('AddPPEForm Component Test', () => {
    const initialState = {
    }

    const mockStore = configureStore()
    var store

    beforeEach(() => {
        store = mockStore(initialState)
    })

    it('should render component AddPPEForm correctly', () => {
        const component = shallow(<AddPPEForm store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddPPEForm component', () => {
        const component = shallow(<AddPPEForm store={store} />);
        expect(component.length).toEqual(1)
    });
});