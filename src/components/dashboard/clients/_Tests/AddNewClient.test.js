import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import AddNewClient from '../AddNewClient';

describe('AddNewClient Component Test', () =>{
    const initialState = {
        primaryPersonForm: {}
    }

    const mockStore = configureStore();
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddNewClient store={store} />)
    })

    it('should render component AddNewClient correctly', () => {
        const component = shallow(<AddNewClient store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddNewClient component', () => {
        expect(container.length).toEqual(1)
    });
});