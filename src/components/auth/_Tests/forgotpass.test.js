import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import Forgotpass from '../forgotpass';

describe('Forgotpass Component Test', () => {
    const initialState = {
        auth: {
            errorMessage: '',
            forgotPassStatus: 0,
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<Forgotpass store={store} />)
    })

    it('should render component Forgotpass correctly', () => {
        const component = shallow(<Forgotpass store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) Forgotpass component', () => {
        expect(container.length).toEqual(1)
    });
})

