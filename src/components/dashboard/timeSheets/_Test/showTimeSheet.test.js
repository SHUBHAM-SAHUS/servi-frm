import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import ShowTimeSheet from '../showTimeSheet';

describe('ShowTimeSheet Component Test', () => {
    const initialState = {
        timeSheet: {
            jobsList: [],
            timeSheetList: [],
            invoices: []
        },
        sAIncidentManagement: {
            allIncidentReportsByJob: [],
            allHazardReportsByJob: [],
            incidentReportDetails: [],
            hazardReportDetails: [],
            incidentCategories: [],
            riskControls: [],
            hazardDetails: []
        },
        sAJobMgmt: {
            jobDetails: [],
            jobReports: [],
            filePath: ''
        },
        organizationUsers: {
            usersList: []
        },
        invoice: {
            invoiceDetails: []
        }, form: {
            showTimeSheet: {}
        }
    }

    const mockStore = configureStore()
    let store, container

    beforeEach(() => {
        store = mockStore(initialState)
        container = shallow(<ShowTimeSheet store={store} />)
    })

    it('should render component ShowTimeSheet correctly', () => {
        const component = shallow(<ShowTimeSheet store={store} />);
        expect(component).toMatchSnapshot();
    });

    it('Render the connected(SMART) ShowTimeSheet component', () => {
        expect(container.length).toEqual(1)
    });
})