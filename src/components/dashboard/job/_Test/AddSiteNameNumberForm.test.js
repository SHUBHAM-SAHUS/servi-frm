import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddSiteNameNumberForm from '../AddSiteNameNumberForm';

describe('AddSiteNameNumberForm Component Test', () => {
    const initialState = {
        form: {
            addSiteNameNumberForm: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddSiteNameNumberForm store={store} />)
    })

    it('should render component AddSiteNameNumberForm correctly', () => {
        const component = shallow(<AddSiteNameNumberForm store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddSiteNameNumberForm component', () => {
        expect(container.length).toEqual(1)
    });
})