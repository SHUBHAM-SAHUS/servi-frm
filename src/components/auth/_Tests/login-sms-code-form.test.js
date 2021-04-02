import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import SignInCode from '../login-sms-code-form';

describe('SignInCode Component Test', () => {
    const initialState = {
        auth: {
            errorMessage: '',
            secondStepStatus: 0,
        },
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<SignInCode store={store} />)
    })

    it('should render component SignInCode correctly', () => {
        const component = shallow(<SignInCode store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) SignInCode component', () => {
        expect(container.length).toEqual(1)
    });
})

