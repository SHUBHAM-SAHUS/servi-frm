import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import EditSiteServiceDetails from '../EditSiteServiceDetails';

describe('EditSiteServiceDetails Search Component Test', () => {
    const initialState = {
        selectedScopeDoc: {},
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<EditSiteServiceDetails store={store} />)
    })

    it('should render component EditSiteServiceDetails correctly', () => {
        const component = shallow(<EditSiteServiceDetails store={store} />);
        expect(component).toMatchSnapshot();
    });

    // it('Render the connected(SMART) EditSiteServiceDetails component', () => {
    //     expect(container.length).toEqual(1)
    // });
});