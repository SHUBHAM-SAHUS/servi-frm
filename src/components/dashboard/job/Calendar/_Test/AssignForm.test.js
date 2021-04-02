import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AssignForm from '../AssignForm';

describe('AssignForm Component Test', () => {
  const initialState = {
    jobsManagement: {
      accountManagersList: [],
    },
    initialValues: {}
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<AssignForm store={store} />)
  })

  it('should render component AssignForm correctly', () => {
    const component = shallow(<AssignForm store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) AssignForm component', () => {
    expect(container.length).toEqual(1)
  });

})