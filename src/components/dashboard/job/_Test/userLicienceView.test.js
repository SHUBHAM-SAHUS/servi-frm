import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import UserLicienceView from '../userLicienceView';

describe('UserLicienceView Component Test', () => {
    const initialState = {
        sAJobMgmt: {
            userLicence: [],
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<UserLicienceView store={store} />)
    })

    it('should render component UserLicienceView correctly', () => {
        const component = shallow(<UserLicienceView store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) UserLicienceView component', () => {
        expect(container.length).toEqual(1)
    });
})