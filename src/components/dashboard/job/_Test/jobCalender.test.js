import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import JobCalender from '../jobCalender';


describe('jobCalender Component Test', () => {
  const initialState = {
    jobsManagement: {
      jobsList: [],
      accountManagersList: [],
      zones: [],
      stateNames: [],
    },
    initialValues: {}
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<JobCalender store={store} />)
  })

  it('should render component JobCalender correctly', () => {
    const component = shallow(<JobCalender store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) JobCalender component', () => {
    expect(container.length).toEqual(1)
  });

})