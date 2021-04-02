import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddNotes from '../AddNotes';

describe('Add Notes Component Test', () => {
  const initialState = {
    formValues: {}
  }

  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<AddNotes store={store} />)
  })

  it('should render component ScopeDocSearch correctly', () => {
    const component = shallow(<AddNotes store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) ScopeDocSearch component', () => {
    expect(container.length).toEqual(1);
  });

});
