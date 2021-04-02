import React from 'react'
import {shallow} from 'enzyme'
import configureStore from 'redux-mock-store'
import PDFTemplateManagement from '../PDFTemplateManagement'

describe('PDFTemplateManagement Component Test', () => {
    const initialState = {
        pdfTemplateList: {},
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<PDFTemplateManagement store={store} />)
    })

    it('should render component PDFTemplateManagement correctly', () => {
        const component = shallow(<PDFTemplateManagement store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) PDFTemplateManagement component', () => {
        expect(container.length).toEqual(1)
    });
})
