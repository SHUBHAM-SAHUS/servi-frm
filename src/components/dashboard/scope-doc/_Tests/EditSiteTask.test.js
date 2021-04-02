import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import EditSiteTask from '../EditSiteTask';

describe('EditSiteTask Component Test', () => {
    const initialState = {
        scopeDocs: {
            scopeDocs: [],
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<EditSiteTask store={store} />)
    })

    it('should render component EditSiteTask correctly', () => {
        const component = shallow(<EditSiteTask store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) EditSiteTask component', () => {
        expect(container.length).toEqual(1)
    });
});