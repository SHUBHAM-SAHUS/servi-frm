import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import acceptedJobDetails from '../acceptedJobDetails';

describe('acceptedJobDetails Component Test', () => {
    const initialState = {
        sAJobMgmt: {
            jobDetails: [],
            userLicence: [],
            swmsSignDetails: [],
            taskSWMS: [],
            jobReports: [],
            filePath: '',
            swmsDoc: []
        },
        roleManagement: {
            roles: []
        },
        swmsReducer: {
            orgSWMS: []
        },
        form: {
            acceptedJobDetails: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<acceptedJobDetails store={store} />)
    })

    it('should render component acceptedJobDetails correctly', () => {
        const component = shallow(<acceptedJobDetails store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) acceptedJobDetails component', () => {
        expect(container.length).toEqual(1)
    });

})

