import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddPaymentDetails from '../AddPaymentDetails';

describe('ServiceAgent AddPaymentDetails Component Test', () => {
    const initialState = {
        initialValues: {},
        form: {
            addPaymentDetails: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddPaymentDetails store={store} />)
    })

    it('should render component AddPaymentDetails correctly', () => {
        const component = shallow(<AddPaymentDetails store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddPaymentDetails component', () => {
        expect(container.length).toEqual(1)
    });
})

