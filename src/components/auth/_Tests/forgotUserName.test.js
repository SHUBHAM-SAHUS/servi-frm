import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ForgotUserName from '../forgotusername';

describe('ForgotUserName Component Test', () => {
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
        container = shallow(<ForgotUserName store={store} />)
    })

    it('should render component ForgotUserName correctly', () => {
        const component = shallow(<ForgotUserName store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ForgotUserName component', () => {
        expect(container.length).toEqual(1)
    });
})

