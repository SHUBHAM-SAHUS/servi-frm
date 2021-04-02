import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store';
import AddNewEmailTemplate from '../AddNewEmailTemplate';

describe('AddNewEmailTemplate Component Test', () => {

  const initialState = {
    emailTemplate: {
      templateList: []
    }
  }

  const mockStore = configureStore()
  let store, container

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<AddNewEmailTemplate store={store} />)
  })

  it('should render component AddNewEmailTemplate correctly', () => {
    const component = shallow(<AddNewEmailTemplate store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) AddNewEmailTemplate component', () => {
    expect(container.length).toEqual(1)
  });
})