import React from 'react'
import {shallow} from 'enzyme'
import configureStore from 'redux-mock-store'
import ViewEditPdfTemplate from '../ViewEditPdfTemplate'

describe('ViewEditPdfTemplate Component Test', () => {
    const initialState = {
        pdfTemplateDetail: {},
        initialValues: {}
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ViewEditPdfTemplate store={store} />)
    })

    it('should render component ViewEditPdfTemplate correctly', () => {
        const component = shallow(<ViewEditPdfTemplate store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ViewEditPdfTemplate component', () => {
        expect(container.length).toEqual(1)
    });
})