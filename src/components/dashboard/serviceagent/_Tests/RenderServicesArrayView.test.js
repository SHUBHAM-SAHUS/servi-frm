import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import RenderServicesArrayView from '../RenderServicesArrayView';

describe('RenderServicesArrayView Component Test', () => {
    const initialState = {
        industryManagement: {
            industries: [],
            services: [],
            categories: [],
            subCategories: []
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<RenderServicesArrayView store={store} />)
    })

    it('should render component Render Services Array View correctly', () => {
        container = shallow(<RenderServicesArrayView store={store} />)
        expect(container).toMatchSnapshot();
    });

    it('Render the connected(SMART) RenderServicesArrayView component', () => {
        container = shallow(<RenderServicesArrayView store={store} />)
        expect(container.length).toEqual(1)
    });

})

