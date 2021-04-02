import React from 'react';
import { shallow } from 'enzyme';
import configureStore from 'redux-mock-store'

import AddNewScopeDoc from '../AddNewScopeDoc';

describe('Add New Scope Doc Component Test', () => {
  const initialState = {
    form: {
      addNewScopeDoc: {
        values: {}
      }
    },
    scopeDocs: []
  }

  const mockStore = configureStore();
  let store, container;

  beforeEach(() => {
    store = mockStore(initialState)
    container = shallow(<AddNewScopeDoc store={store} />)
  })

  it('should render component Add New Scope Doc correctly', () => {
    const component = shallow(<AddNewScopeDoc store={store} />);
    expect(component).toMatchSnapshot();
  });

  it('Render the connected(SMART) Add New Scope Doc component', () => {
    expect(container.length).toEqual(1);
  });

});
