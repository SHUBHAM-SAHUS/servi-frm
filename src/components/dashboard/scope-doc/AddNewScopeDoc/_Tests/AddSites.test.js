import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddSites from '../AddSites';

describe('Add Sites Component Test', () => {
  const initialState = {
    scopeDocForm: {}
  }

  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<AddSites store={store} />)
  })

  it('should render component ScopeDocSearch correctly', () => {
    const component = shallow(<AddSites store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) ScopeDocSearch component', () => {
    expect(container.length).toEqual(1);
  });

});
