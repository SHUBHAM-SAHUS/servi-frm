import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import reseturpass from '../reseturpass';

describe('reseturpass Component Test', () => {
    const initialState = {
        auth: {
            errorMessage: '',
            resetStatus: 0,
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<reseturpass store={store} />)
    })

    it('should render component reseturpass correctly', () => {
        const component = shallow(<reseturpass store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) reseturpass component', () => {
        expect(container.length).toEqual(1)
    });
})

