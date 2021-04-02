import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddAreas from '../AddAreas';

describe('Add Areas Component Test', () => {
  const initialState = {

  }

  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<AddAreas store={store} />)
  })

  it('should render component ScopeDocSearch correctly', () => {
    const component = shallow(<AddAreas store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) ScopeDocSearch component', () => {
    expect(container.length).toEqual(1);
  });

});
