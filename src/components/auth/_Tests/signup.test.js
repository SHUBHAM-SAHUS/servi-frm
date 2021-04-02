import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import signup from '../signup';

describe('signup Component Test', () => {
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
        container = shallow(<signup store={store} />)
    })

    it('should render component signup correctly', () => {
        const component = shallow(<signup store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) signup component', () => {
        expect(container.length).toEqual(1)
    });
})

