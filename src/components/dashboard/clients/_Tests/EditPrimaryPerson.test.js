import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'
import EditPrimaryPerson from '../EditPrimaryPerson';

describe('EditPrimaryPerson Component Test', () => {
    const initialState = {
        clients: [],
        formValues: {},
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<EditPrimaryPerson store={store} />)
    })

    it('should render component EditPrimaryPerson correctly', () => {
        const component = shallow(<EditPrimaryPerson store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) EditPrimaryPerson component', () => {
        expect(container.length).toEqual(1)
    });
});