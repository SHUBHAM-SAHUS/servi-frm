import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import PreviewScopeDocQuote from '../PreviewScopeDocQuote';

describe('PreviewScopeDocQuote Component Test', () => {
    const initialState = {
        selectedScopeDoc: {},
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<PreviewScopeDocQuote store={store} />)
    })

    it('should render component PreviewScopeDocQuote correctly', () => {
        const component = shallow(<PreviewScopeDocQuote store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) PreviewScopeDocQuote component', () => {
        expect(container.length).toEqual(1)
    });
});