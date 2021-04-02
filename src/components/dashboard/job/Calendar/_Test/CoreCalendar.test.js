import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import CoreCalender from '../CoreCalender';

describe('CoreCalender Component Test', () => {
  const initialState = {
    jobsManagement: {
      accountManagersList: [],
      jobsList: [],
      zones: [],
      stateNames: [],
    },
    form: {
      jobCalendar: {
        values: {}
      }
    },
    initialValues: {}
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<CoreCalender store={store} />)
  })

  it('should render component CoreCalender correctly', () => {
    const component = shallow(<CoreCalender store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) CoreCalender component', () => {
    expect(container.length).toEqual(1)
  });

})