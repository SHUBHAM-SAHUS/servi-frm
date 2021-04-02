import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AreaSWMSUpdate from '../AreaSWMSUpdate';

describe('AreaSWMSUpdate Component Test', () => {
    const initialState = {
        swmsReducer: {
            orgSWMS: {},
            taskSWMS: []
        }
        ,form: {
            areaSWMSUpdate: {
                values: {}
            }
        }
    }

    const mockStore = configureStore()
    var store

    beforeEach(() => {
        store = mockStore(initialState)
    })

    it('should render component AreaSWMSUpdate correctly', () => {
        const component = shallow(<AreaSWMSUpdate store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AreaSWMSUpdate component', () => {
        const component = shallow(<AreaSWMSUpdate store={store} />);
        expect(component.length).toEqual(1)
    });
});