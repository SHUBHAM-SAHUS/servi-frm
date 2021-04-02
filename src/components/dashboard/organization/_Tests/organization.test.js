import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Organization from '../organization';

describe('ServiceAgent Organization Component Test', () => {
    const initialState = {}

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<Organization store={store} />)
    })

    it('should render component Organization correctly', () => {
        const component = shallow(<Organization store={store} />);
        expect(component).toMatchSnapshot();
    });

    /* it('Render the connected(SMART) Organization component', () => {
        expect(container.length).toEqual(1)
    });*/
})

