import React from 'react';
import {shallow} from 'enzyme'
import configureStore from 'redux-mock-store';
import AddPrimaryPerson from '../AddPrimaryPerson';

describe('AddPrimaryPerson Component Test', () => {
    const initialState = {
        
    }

    const mockStore = configureStore();
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddPrimaryPerson store={store} />)
    });

    it('should render component AddPrimaryPerson correctly', () => {
        const component = shallow(<AddPrimaryPerson store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddPrimaryPerson component', () => {
        expect(container.length).toEqual(1)
    });
});