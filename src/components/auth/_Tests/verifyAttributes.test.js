import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import verifyAttributes from '../verifyAttributes';

describe('verifyAttributes Component Test', () => {
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
        container = shallow(<verifyAttributes store={store} />)
    })

    it('should render component verifyAttributes correctly', () => {
        const component = shallow(<verifyAttributes store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) SignInCode component', () => {
        expect(container.length).toEqual(1)
    });
})

