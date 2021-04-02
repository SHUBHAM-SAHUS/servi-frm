import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import ViewEditClients from '../ViewEditClients';

describe('ViewEditClients Component Test', () => {
    const initialState = {
        selectedClient: [],
        sites: [],
    }

    const mockStore = configureStore();
    let store, container

    beforeEach(()=>{
        store = mockStore(initialState)
        container = shallow(<ViewEditClients store={store} />)
    })

    it('should render component ViewEditClients correctly', () => {
        const component = shallow(<ViewEditClients store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ViewEditClients component', () => {
        expect(container.length).toEqual(1)
    });
});