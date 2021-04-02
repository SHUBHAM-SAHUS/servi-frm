import React from 'react';
import {shallow} from 'enzyme';
import configureStore from 'redux-mock-store';
import EditSiteDetails from '../EditSiteDetails';

describe('EditSiteDetails Component Test', () => {
    const initialState = {
        selectedScopeDoc: [],
    }

    const mockStore = configureStore();
    let store, container

    beforeEach(()=>{
        store = mockStore(initialState)
        container = shallow(<EditSiteDetails store={store} />)
    })

    it('should render component EditSiteDetails correctly', () => {
        const component = shallow(<EditSiteDetails store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) EditSiteDetails component', () => {
        expect(container.length).toEqual(1)
    });
});