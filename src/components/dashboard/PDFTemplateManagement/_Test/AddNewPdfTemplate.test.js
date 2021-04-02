import React from 'react'
import {shallow} from 'enzyme'
import configureStore from 'redux-mock-store'
import AddNewPdfTemplate from '../AddNewPdfTemplate'

describe('AddNewPdfTemplate Component Test', () => {
    const initialState = {
        pdfTemplateList: {},
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<AddNewPdfTemplate store={store} />)
    })

    it('should render component AddNewPdfTemplate correctly', () => {
        const component = shallow(<AddNewPdfTemplate store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) AddNewPdfTemplate component', () => {
        expect(container.length).toEqual(1)
    });
})
