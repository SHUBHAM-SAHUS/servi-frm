import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddChemicalForm from '../AddChemicalForm';

describe('AddChemicalForm Component Test', () => {
    const initialState = {
    }

    const mockStore = configureStore()
    var store

    beforeEach(() => {
        store = mockStore(initialState)
    })

    it('should render component AddChemicalForm correctly', () => {
        const component = shallow(<AddChemicalForm store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddChemicalForm component', () => {
        const component = shallow(<AddChemicalForm store={store} />);
        expect(component.length).toEqual(1)
    });
});