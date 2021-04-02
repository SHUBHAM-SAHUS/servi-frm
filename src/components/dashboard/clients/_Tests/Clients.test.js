import React from 'react';
import {shallow} from 'enzyme'
import configureStore from 'redux-mock-store';
import Clients from '../Clients';

describe('Clients Component Test', () => {
    const initialState = {
        clientsList: [],
    }

    const mockStore = configureStore();
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<Clients store={store} />)
    });

    it('should render component Clients correctly', () => {
        const component = shallow(<Clients store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) Clients component', () => {
        expect(container.length).toEqual(1)
    });
});