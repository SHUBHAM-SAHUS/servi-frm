import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import PreviewJobDoc from '../PreviewJobDoc';

describe('PreviewJobDoc Component Test', () => {
    const initialState = {
        scopeDocs: {
            scopeDocsDetails: []
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<PreviewJobDoc store={store} />)
    })

    it('should render component PreviewJobDoc correctly', () => {
        const component = shallow(<PreviewJobDoc store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) PreviewJobDoc component', () => {
        expect(container.length).toEqual(1)
    });

})

