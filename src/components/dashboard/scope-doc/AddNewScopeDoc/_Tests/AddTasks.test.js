import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddTasks from '../AddTasks';

describe('Add Tasks Component Test', () => {
  const initialState = {
    scopeDocForm: {}
  }

  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<AddTasks store={store} />)
  })

  it('should render component ScopeDocSearch correctly', () => {
    const component = shallow(<AddTasks store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) ScopeDocSearch component', () => {
    expect(container.length).toEqual(1);
  });

});
