import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import EditSingleService from '../EditSingleService';

describe('EditSingleService Component Test', () => {
    const initialState = {
        industryManagement: {
            industries: [],
            services: [],
            categories: [],
            subCategories: []
        },
        form:{}
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<EditSingleService store={store} />)
    })

    it('should render component Edit Single Service correctly', () => {
        container = shallow(<EditSingleService store={store} />)
        expect(container).toMatchSnapshot();
    });

    it('Render the connected(SMART) EditSingleService component', () => {
        container = shallow(<EditSingleService store={store} />)
        expect(container.length).toEqual(1)
    });

})

