import React from 'react'
import {shallow} from 'enzyme'
import configureStore from 'redux-mock-store'
import PDFTemplateSearch from '../PDFTemplateSearch'

describe('PDFTemplateSearch Component Test', () => {
    const initialState = {
        pdfTemplateList: {},
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<PDFTemplateSearch store={store} />)
    })

    it('should render component PDFTemplateSearch correctly', () => {
        const component = shallow(<PDFTemplateSearch store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) PDFTemplateSearch component', () => {
        expect(container.length).toEqual(1)
    });
})