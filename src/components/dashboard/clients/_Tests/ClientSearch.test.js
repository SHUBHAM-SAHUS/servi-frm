import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import ClientSearch from '../ClientSearch';

describe('ClientSearch Component Test', () => {
    const initialState = {
        clients: [],
    }

    const mockStore = configureStore();
    let store, container

    beforeEach(()=>{
        store = mockStore(initialState)
        container = shallow(<ClientSearch store={store} />)
    })

    it('should render component ClientSearch correctly', () => {
        const component = shallow(<ClientSearch store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ClientSearch component', () => {
        expect(container.length).toEqual(1)
    });
});