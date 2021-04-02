import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import EditClient from '../EditClient';

describe('EditClient Component Test', () => {
    const initialState = {
        selectedScopeDoc: [],
    }

    const mockStore = configureStore();
    let store, container

    beforeEach(()=>{
        store = mockStore(initialState)
        container = shallow(<EditClient store={store} />)
    })

    it('should render component EditClient correctly', () => {
        const component = shallow(<EditClient store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) EditClient component', () => {
        expect(container.length).toEqual(1)
    });
});